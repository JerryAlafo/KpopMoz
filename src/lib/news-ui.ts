import type { CSSProperties } from "react";
import type { NewsItem } from "@/types";

function cssImageUrl(url: string) {
  return url.replace(/["\\\n\r]/g, "");
}

export function newsHref(item: NewsItem) {
  return item.sourceUrl ?? `/noticias/${item.slug}`;
}

export function isExternalNews(item: NewsItem) {
  return Boolean(item.sourceUrl);
}

export function newsVisualStyle(item: NewsItem): CSSProperties {
  if (!item.imageUrl) return { background: item.imageBg };

  return {
    backgroundImage: `linear-gradient(180deg, rgba(10,10,10,0.06), rgba(10,10,10,0.3)), url("${cssImageUrl(item.imageUrl)}")`,
    backgroundPosition: "center",
    backgroundSize: "cover",
  };
}
