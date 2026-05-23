import type { NewsCategory, NewsItem } from "@/types";

const FEED_TIMEOUT_MS = 4500;
const TRANSLATE_TIMEOUT_MS = 3500;

const SOURCES = [
  {
    name: "Google News",
    url: "https://news.google.com/rss/search?q=K-pop%20OR%20Kpop%20when%3A7d&hl=pt-PT&gl=MZ&ceid=MZ%3Apt-PT",
  },
  { name: "Soompi", url: "https://www.soompi.com/feed" },
  { name: "Koreaboo", url: "https://www.koreaboo.com/feed/" },
];

const FALLBACK_VISUALS = [
  "linear-gradient(135deg, #ff3d68 0%, #ffd23f 100%)",
  "linear-gradient(135deg, #0a0a0a 0%, #3a5cff 100%)",
  "linear-gradient(135deg, #7af0c8 0%, #3a5cff 100%)",
  "linear-gradient(135deg, #ffd23f 0%, #ff3d68 100%)",
  "linear-gradient(135deg, #3a5cff 0%, #ff3d68 100%)",
];

interface FeedSource {
  name: string;
  url: string;
}

const translationCache = new Map<string, string>();

function decodeEntities(value: string) {
  const named: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: "\"",
  };

  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (_, entity: string) => {
    const lower = entity.toLowerCase();
    if (named[lower]) return named[lower];

    if (lower.startsWith("#x")) {
      const code = Number.parseInt(lower.slice(2), 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : "";
    }

    if (lower.startsWith("#")) {
      const code = Number.parseInt(lower.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : "";
    }

    return "";
  });
}

function stripCdata(value: string) {
  return value.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "");
}

function stripHtml(value: string) {
  return decodeEntities(stripCdata(value))
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tagValue(xml: string, tag: string) {
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = xml.match(new RegExp(`<${escaped}\\b[^>]*>([\\s\\S]*?)<\\/${escaped}>`, "i"));
  if (!match?.[1]) return "";
  return stripHtml(match[1]);
}

function rawTagValue(xml: string, tag: string) {
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = xml.match(new RegExp(`<${escaped}\\b[^>]*>([\\s\\S]*?)<\\/${escaped}>`, "i"));
  return match?.[1] ? stripCdata(match[1]).trim() : "";
}

function attrFromTag(xml: string, tag: string, attr: string) {
  const tagEscaped = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const attrEscaped = attr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = xml.match(new RegExp(`<${tagEscaped}\\b[^>]*\\s${attrEscaped}=["']([^"']+)["'][^>]*>`, "i"));
  return match?.[1] ? decodeEntities(match[1]) : "";
}

function firstImageFromHtml(value: string) {
  const match = value.match(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/i);
  return match?.[1] ? decodeEntities(match[1]) : "";
}

function safeUrl(value: string, base?: string) {
  if (!value) return "";

  try {
    const url = new URL(decodeEntities(value), base);
    return url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 90);
}

function inferCategory(title: string, excerpt: string): NewsCategory {
  const haystack = `${title} ${excerpt}`.toLowerCase();

  if (/(tour|concert|showcase|festival|kcon|evento|show)/.test(haystack)) return "tour";
  if (/(comeback|returns|regresso|volta)/.test(haystack)) return "comeback";
  if (/(album|single|mv|music video|release|lança|lancamento|lançamento|teaser)/.test(haystack)) return "lancamento";
  if (/(fan meeting|fanmeet|workshop|audition|audição|audicao)/.test(haystack)) return "evento";
  return "industria";
}

function tagsFromText(title: string, source: string) {
  const known = [
    "BTS",
    "BLACKPINK",
    "Stray Kids",
    "TWICE",
    "NewJeans",
    "SEVENTEEN",
    "ATEEZ",
    "aespa",
    "NMIXX",
    "IVE",
    "LE SSERAFIM",
    "ENHYPEN",
    "TXT",
    "RIIZE",
    "BABYMONSTER",
  ];
  const tags = known.filter((tag) => title.toLowerCase().includes(tag.toLowerCase()));
  return [...new Set([...tags, source, "K-POP"])].slice(0, 5);
}

function readingTime(text: string) {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.ceil(words / 220));
}

function publishedDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString().slice(0, 10) : date.toISOString().slice(0, 10);
}

function extractImage(itemXml: string, sourceUrl: string) {
  const rawContent = rawTagValue(itemXml, "content:encoded") || rawTagValue(itemXml, "description");
  const candidates = [
    attrFromTag(itemXml, "media:content", "url"),
    attrFromTag(itemXml, "media:thumbnail", "url"),
    attrFromTag(itemXml, "enclosure", "url"),
    firstImageFromHtml(rawContent),
  ];

  for (const candidate of candidates) {
    const url = safeUrl(candidate, sourceUrl);
    if (url) return url;
  }

  return "";
}

function parseFeed(xml: string, source: FeedSource): NewsItem[] {
  const blocks = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? xml.match(/<entry\b[\s\S]*?<\/entry>/gi) ?? [];

  return blocks.map((itemXml, index) => {
    const title = tagValue(itemXml, "title");
    const link = safeUrl(tagValue(itemXml, "link") || attrFromTag(itemXml, "link", "href"), source.url);
    const rawDescription = rawTagValue(itemXml, "description") || rawTagValue(itemXml, "summary") || rawTagValue(itemXml, "content:encoded");
    const excerpt = stripHtml(rawDescription).slice(0, 220);
    const publishedAt = publishedDate(tagValue(itemXml, "pubDate") || tagValue(itemXml, "updated") || tagValue(itemXml, "published"));
    const category = inferCategory(title, excerpt);
    const slug = `${slugify(source.name)}-${slugify(title || `noticia-${index}`)}`;

    return {
      id: `${source.name}-${slug}-${index}`,
      slug,
      title: title || "Notícia K-POP",
      excerpt: excerpt || "Actualização recente do mundo K-POP. Abre a fonte para ler o artigo completo.",
      content: excerpt,
      category,
      author: source.name,
      publishedAt,
      readingTime: readingTime(`${title} ${excerpt}`),
      imageBg: FALLBACK_VISUALS[index % FALLBACK_VISUALS.length],
      imageUrl: extractImage(itemXml, link || source.url),
      sourceName: source.name,
      sourceUrl: link || source.url,
      tags: tagsFromText(title, source.name),
    };
  }).filter((item) => item.title && item.sourceUrl);
}

async function fetchWithTimeout(url: string) {
  return fetch(url, {
    headers: {
      "User-Agent": "KPOP.MZ/1.0 (+https://kpop.mz)",
      Accept: "application/rss+xml, application/xml, text/xml, text/html;q=0.8",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(FEED_TIMEOUT_MS),
  });
}

function languageText(value: string) {
  return ` ${value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, " ")} `;
}

function countTerms(text: string, terms: string[]) {
  return terms.filter((term) => text.includes(term)).length;
}

function languageHits(value: string) {
  const text = languageText(value);
  const englishHits = countTerms(text, [
    " the ",
    " and ",
    " for ",
    " to ",
    " with ",
    " from ",
    " new ",
    " after ",
    " before ",
    " will ",
    " has ",
    " have ",
    " says ",
    " reveals ",
    " revealed ",
    " wins ",
    " award ",
    " fans ",
    " announces ",
    " release ",
    " releases ",
    " comeback ",
    " tour ",
    " album ",
    " performance ",
  ]);
  const portugueseHits = countTerms(text, [
    " de ",
    " da ",
    " do ",
    " das ",
    " dos ",
    " no ",
    " na ",
    " nos ",
    " nas ",
    " ao ",
    " em ",
    " com ",
    " para ",
    " que ",
    " uma ",
    " um ",
    " fas ",
    " lanca ",
    " anuncia ",
    " confirma ",
    " lancamento ",
    " noticia ",
    " apos ",
    " grupo ",
    " musica ",
    " novo ",
    " nova ",
    " volta ",
    " revela ",
    " estreia ",
    " single ",
    " video ",
  ]);

  return { englishHits, portugueseHits };
}

function isProbablyPortuguese(value: string) {
  const { englishHits, portugueseHits } = languageHits(value);

  if (portugueseHits >= 3 && portugueseHits >= englishHits) return true;
  if (portugueseHits >= 2 && englishHits === 0) return true;

  return false;
}

function needsTranslation(value: string) {
  const { englishHits, portugueseHits } = languageHits(value);
  return !isProbablyPortuguese(value) || englishHits > portugueseHits;
}

async function translateWithGoogle(text: string) {
  try {
    const params = new URLSearchParams({
      client: "gtx",
      sl: "en",
      tl: "pt",
      dt: "t",
      q: text,
    });
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?${params.toString()}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(TRANSLATE_TIMEOUT_MS),
    });
    if (!response.ok) return "";

    const data = await response.json() as unknown;
    if (!Array.isArray(data) || !Array.isArray(data[0])) return "";

    return stripHtml(
      data[0]
        .map((part) => Array.isArray(part) ? String(part[0] ?? "") : "")
        .join("")
    );
  } catch {
    return "";
  }
}

async function translateWithMyMemory(text: string) {
  try {
    const params = new URLSearchParams({
      q: text,
      langpair: "en|pt",
    });
    const response = await fetch(`https://api.mymemory.translated.net/get?${params.toString()}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(TRANSLATE_TIMEOUT_MS),
    });
    if (!response.ok) return "";

    const data = await response.json() as { responseData?: { translatedText?: string } };
    return stripHtml(data.responseData?.translatedText ?? "");
  } catch {
    return "";
  }
}

async function translateText(value: string, force = false) {
  const text = value.trim();
  if (!text) return "";
  if (!force && isProbablyPortuguese(text)) return text;

  const cacheKey = text.slice(0, 500);
  const cached = translationCache.get(cacheKey);
  if (cached) return cached;

  const translated = await translateWithGoogle(cacheKey) || await translateWithMyMemory(cacheKey);
  if (!translated) return "";

  translationCache.set(cacheKey, translated);
  return translated;
}

async function translateItem(item: NewsItem) {
  const shouldTranslate = needsTranslation(`${item.title} ${item.excerpt}`);
  if (!shouldTranslate) return item;

  const [title, excerpt] = await Promise.all([
    translateText(item.title, true),
    translateText(item.excerpt, true),
  ]);

  if (!title || !excerpt) return null;

  const translatedItem = {
    ...item,
    title,
    excerpt,
    content: excerpt,
    category: inferCategory(title, excerpt),
  };

  return isProbablyPortuguese(`${translatedItem.title} ${translatedItem.excerpt}`) ? translatedItem : null;
}

async function fetchOgImage(url: string) {
  try {
    const response = await fetchWithTimeout(url);
    if (!response.ok) return "";

    const html = await response.text();
    const match =
      html.match(/<meta\b[^>]*(?:property|name)=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i) ??
      html.match(/<meta\b[^>]*content=["']([^"']+)["'][^>]*(?:property|name)=["']og:image["'][^>]*>/i) ??
      html.match(/<meta\b[^>]*(?:property|name)=["']twitter:image["'][^>]*content=["']([^"']+)["'][^>]*>/i) ??
      html.match(/<meta\b[^>]*content=["']([^"']+)["'][^>]*(?:property|name)=["']twitter:image["'][^>]*>/i);

    return match?.[1] ? safeUrl(match[1], url) : "";
  } catch {
    return "";
  }
}

async function fetchSource(source: FeedSource, perSource: number) {
  const response = await fetchWithTimeout(source.url);
  if (!response.ok) throw new Error(`Failed to fetch ${source.name}`);

  const xml = await response.text();
  const items = parseFeed(xml, source).slice(0, perSource);

  const enriched = await Promise.all(items.map(async (item) => ({
    ...item,
    imageUrl: item.imageUrl || await fetchOgImage(item.sourceUrl ?? ""),
  })));
  const translated = await Promise.all(enriched.map((item) => translateItem(item)));

  return translated.filter((item): item is NewsItem => Boolean(item));
}

function uniqueItems(items: NewsItem[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.sourceUrl ?? item.slug}:${item.title.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function getDynamicNews(limit = 12, offset = 0): Promise<NewsItem[]> {
  const safeLimit = Math.max(limit, 1);
  const safeOffset = Math.max(offset, 0);
  const target = safeLimit + safeOffset;
  const perSource = Math.max(3, Math.ceil(target / SOURCES.length) + 4);
  const settled = await Promise.allSettled(SOURCES.map((source) => fetchSource(source, perSource)));
  const live = settled.flatMap((result) => result.status === "fulfilled" ? result.value : []);

  return uniqueItems(live)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(safeOffset, safeOffset + safeLimit);
}
