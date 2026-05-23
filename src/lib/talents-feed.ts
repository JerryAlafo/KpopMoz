import type { Talent } from "@/types";

const TALENTS_TIMEOUT_MS = 6500;
const WIKIDATA_ENDPOINT = "https://query.wikidata.org/sparql";
const WIKIDATA_SEARCH_ENDPOINT = "https://www.wikidata.org/w/api.php";

const FALLBACK_VISUALS = [
  "linear-gradient(135deg, #3a5cff 0%, #7af0c8 100%)",
  "linear-gradient(135deg, #ff3d68 0%, #0a0a0a 100%)",
  "linear-gradient(135deg, #ffd23f 0%, #ff3d68 100%)",
  "linear-gradient(135deg, #7af0c8 0%, #0a0a0a 100%)",
];

const TALENT_OCCUPATIONS = [
  "wd:Q639669", // musician
  "wd:Q177220", // singer
  "wd:Q5716684", // dancer
  "wd:Q483501", // artist
  "wd:Q644687", // illustrator
  "wd:Q185069", // graphic designer
  "wd:Q3501317", // fashion designer
  "wd:Q4610556", // model
  "wd:Q33999", // actor
];

const TALENT_SEARCHES: { query: string; specialty: Talent["specialty"] }[] = [
  { query: "Mozambican musician", specialty: "Canto" },
  { query: "Mozambican singer", specialty: "Canto" },
  { query: "Mozambican rapper", specialty: "Canto" },
  { query: "Mozambican dancer", specialty: "Dança" },
  { query: "Mozambican artist", specialty: "Fanart" },
  { query: "Mozambican illustrator", specialty: "Fanart" },
  { query: "Mozambican fashion designer", specialty: "Moda" },
  { query: "Mozambican model", specialty: "Moda" },
  { query: "Mozambican actor", specialty: "Cosplay" },
];

interface WikidataValue {
  value?: string;
}

interface TalentBinding {
  person?: WikidataValue;
  personLabel?: WikidataValue;
  occupations?: WikidataValue;
  birthPlaceLabel?: WikidataValue;
  image?: WikidataValue;
  website?: WikidataValue;
}

interface WikidataResponse {
  results?: {
    bindings?: TalentBinding[];
  };
}

interface WikidataSearchItem {
  id?: string;
  label?: string;
  description?: string;
  concepturi?: string;
  url?: string;
}

interface WikidataSearchResponse {
  search?: WikidataSearchItem[];
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

function safeUrl(value?: string) {
  if (!value) return "";

  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : "";
  } catch {
    return "";
  }
}

function entityIdFromUrl(value?: string) {
  const match = value?.match(/\/entity\/(Q\d+)$/i);
  return match?.[1] ?? "";
}

function normalizeImageUrl(value?: string) {
  const url = safeUrl(value);
  return url.replace(/^http:\/\//i, "https://");
}

function specialtyFromOccupations(occupations: string): Talent["specialty"] {
  const text = occupations
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (/(dancer|dance|dancar|danca|bailar)/.test(text)) return "Dança";
  if (/(singer|musician|music|cantor|cantora|musico|musica)/.test(text)) return "Canto";
  if (/(fashion|model|moda)/.test(text)) return "Moda";
  if (/(illustrator|artist|artista|pintor|fanart|graphic)/.test(text)) return "Fanart";
  if (/(actor|atriz|ator|cosplay)/.test(text)) return "Cosplay";

  return "Edição";
}

function talentQuery(limit: number, offset: number) {
  return `
SELECT ?person ?personLabel ?birthPlaceLabel ?image ?website (GROUP_CONCAT(DISTINCT ?occupationLabel; separator=", ") AS ?occupations) WHERE {
  ?person wdt:P31 wd:Q5;
          wdt:P27 wd:Q1029;
          wdt:P106 ?occupation.
  ?occupation wdt:P279* ?occupationRoot.
  VALUES ?occupationRoot { ${TALENT_OCCUPATIONS.join(" ")} }
  VALUES ?occupationRoot { ${TALENT_OCCUPATIONS.join(" ")} }
  OPTIONAL { ?person wdt:P19 ?birthPlace. }
  OPTIONAL { ?person wdt:P18 ?image. }
  OPTIONAL { ?person wdt:P856 ?website. }
  ?person rdfs:label ?personLabel.
  FILTER(LANG(?personLabel) = "pt" || LANG(?personLabel) = "en")
  ?occupation rdfs:label ?occupationLabel.
  FILTER(LANG(?occupationLabel) = "pt" || LANG(?occupationLabel) = "en")
  OPTIONAL {
    ?birthPlace rdfs:label ?birthPlaceLabel.
    FILTER(LANG(?birthPlaceLabel) = "pt" || LANG(?birthPlaceLabel) = "en")
  }
}
GROUP BY ?person ?personLabel ?birthPlaceLabel ?image ?website
ORDER BY LCASE(STR(?personLabel))
LIMIT ${limit}
OFFSET ${offset}
`;
}

function talentByIdQuery(entityId: string) {
  return `
SELECT ?person ?personLabel ?birthPlaceLabel ?image ?website (GROUP_CONCAT(DISTINCT ?occupationLabel; separator=", ") AS ?occupations) WHERE {
  VALUES ?person { wd:${entityId} }
  ?person wdt:P31 wd:Q5;
          wdt:P27 wd:Q1029;
          wdt:P106 ?occupation.
  ?occupation wdt:P279* ?occupationRoot.
  OPTIONAL { ?person wdt:P19 ?birthPlace. }
  OPTIONAL { ?person wdt:P18 ?image. }
  OPTIONAL { ?person wdt:P856 ?website. }
  ?person rdfs:label ?personLabel.
  FILTER(LANG(?personLabel) = "pt" || LANG(?personLabel) = "en")
  ?occupation rdfs:label ?occupationLabel.
  FILTER(LANG(?occupationLabel) = "pt" || LANG(?occupationLabel) = "en")
  OPTIONAL {
    ?birthPlace rdfs:label ?birthPlaceLabel.
    FILTER(LANG(?birthPlaceLabel) = "pt" || LANG(?birthPlaceLabel) = "en")
  }
}
GROUP BY ?person ?personLabel ?birthPlaceLabel ?image ?website
LIMIT 1
`;
}

async function fetchWikidata(query: string) {
  const params = new URLSearchParams({ query, format: "json" });
  const response = await fetch(`${WIKIDATA_ENDPOINT}?${params.toString()}`, {
    headers: {
      "User-Agent": "KPOP.MZ/1.0 (+https://kpop.mz)",
      Accept: "application/sparql-results+json",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(TALENTS_TIMEOUT_MS),
  });

  if (!response.ok) return [];

  const data = await response.json() as WikidataResponse;
  return data.results?.bindings ?? [];
}

async function fetchWikidataSearch(query: string, limit: number) {
  const params = new URLSearchParams({
    action: "wbsearchentities",
    format: "json",
    language: "en",
    uselang: "pt",
    type: "item",
    search: query,
    limit: String(Math.min(Math.max(limit, 1), 50)),
    origin: "*",
  });
  const response = await fetch(`${WIKIDATA_SEARCH_ENDPOINT}?${params.toString()}`, {
    headers: {
      "User-Agent": "KPOP.MZ/1.0 (+https://kpop.mz)",
      Accept: "application/json",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(TALENTS_TIMEOUT_MS),
  });

  if (!response.ok) return [];

  const data = await response.json() as WikidataSearchResponse;
  return data.search ?? [];
}

function normalizeTalent(binding: TalentBinding, index: number): Talent | null {
  const sourceUrl = safeUrl(binding.person?.value);
  const entityId = entityIdFromUrl(sourceUrl);
  const name = binding.personLabel?.value?.trim() ?? "";
  if (!entityId || !name) return null;

  const occupations = binding.occupations?.value?.trim() || "talento criativo";
  const city = binding.birthPlaceLabel?.value?.trim() || "Moçambique";
  const specialty = specialtyFromOccupations(occupations);
  const username = `@${slugify(name).replace(/-/g, "")}`;

  return {
    id: entityId,
    slug: `${entityId.toLowerCase()}-${slugify(name)}`,
    name,
    username,
    city,
    specialty,
    bio: `${name} aparece no Wikidata como ${occupations}. Perfil carregado a partir de uma API pública real, sem dados mockados locais.`,
    bg: FALLBACK_VISUALS[index % FALLBACK_VISUALS.length],
    imageUrl: normalizeImageUrl(binding.image?.value),
    sourceUrl: binding.website?.value ? safeUrl(binding.website.value) : sourceUrl,
    socials: [{ platform: "Wikidata", handle: entityId }],
  };
}

function normalizeSearchTalent(item: WikidataSearchItem, specialty: Talent["specialty"], index: number): Talent | null {
  const id = item.id?.trim();
  const name = item.label?.trim();
  if (!id || !name) return null;

  const description = item.description?.trim();
  const sourceUrl = safeUrl(item.concepturi) || `https://www.wikidata.org/wiki/${id}`;

  return {
    id,
    slug: `${id.toLowerCase()}-${slugify(name)}`,
    name,
    username: `@${slugify(name).replace(/-/g, "")}`,
    city: "Moçambique",
    specialty,
    bio: `${description || "Talento moçambicano encontrado através da API pública do Wikidata."} Perfil carregado em tempo real, sem dados mockados locais.`,
    bg: FALLBACK_VISUALS[index % FALLBACK_VISUALS.length],
    sourceUrl,
    socials: [{ platform: "Wikidata", handle: id }],
  };
}

function uniqueTalents(items: Talent[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export async function getDynamicTalents(limit = 24, offset = 0): Promise<Talent[]> {
  try {
    const safeLimit = Math.max(limit, 1);
    const safeOffset = Math.max(offset, 0);
    const bindings = await fetchWikidata(talentQuery(safeLimit, safeOffset));
    const structured = uniqueTalents(
      bindings
        .map((binding, index) => normalizeTalent(binding, safeOffset + index))
        .filter((item): item is Talent => Boolean(item))
    );

    if (structured.length > 0) return structured;

    const target = safeLimit + safeOffset;
    const perSearch = Math.min(50, Math.max(6, Math.ceil(target / TALENT_SEARCHES.length) + 4));
    const settled = await Promise.allSettled(
      TALENT_SEARCHES.map((source) => fetchWikidataSearch(source.query, perSearch))
    );
    const searched = settled.flatMap((result, sourceIndex) => {
      if (result.status !== "fulfilled") return [];
      const source = TALENT_SEARCHES[sourceIndex];
      return result.value
        .map((item, itemIndex) => normalizeSearchTalent(item, source.specialty, sourceIndex * perSearch + itemIndex))
        .filter((item): item is Talent => Boolean(item));
    });

    return uniqueTalents(searched).slice(safeOffset, safeOffset + safeLimit);
  } catch {
    return [];
  }
}

export async function getTalentBySlug(slug: string): Promise<Talent | null> {
  const entityId = slug.match(/^(q\d+)-/i)?.[1]?.toUpperCase();

  if (entityId) {
    const [binding] = await fetchWikidata(talentByIdQuery(entityId));
    const talent = binding ? normalizeTalent(binding, 0) : null;
    if (talent) return talent;
  }

  const talents = await getDynamicTalents(100, 0);
  return talents.find((talent) => talent.slug === slug) ?? null;
}
