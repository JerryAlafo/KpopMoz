export type NewsCategory = "comeback" | "lancamento" | "tour" | "evento" | "industria";

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category: NewsCategory;
  author: string;
  publishedAt: string;
  readingTime: number;
  featured?: boolean;
  imageBg: string;
  imageUrl?: string;
  sourceName?: string;
  sourceUrl?: string;
  tags: string[];
}

export type EventType = "random-dance" | "cover-dance" | "encontro" | "festival" | "workshop" | "concurso";

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  type: EventType;
  date: string;
  startTime: string;
  endTime?: string;
  location: string;
  city: "Maputo" | "Beira" | "Nampula" | "Matola";
  description: string;
  capacity?: number;
  registered: number;
  free: boolean;
  price?: number;
  organizer: string;
  coverBg: string;
}

export interface Artist {
  id: string;
  slug: string;
  name: string;
  koreanName?: string;
  type: "grupo" | "solo" | "artista";
  agency?: string;
  debutYear?: number;
  fandomName?: string;
  members?: string[];
  topTracks: string[];
  followers?: number;
  bg: string;
  imageUrl?: string;
  sourceUrl?: string;
  genre?: string;
  description?: string;
}

export interface Talent {
  id: string;
  slug: string;
  name: string;
  username: string;
  city: string;
  specialty: "Dança" | "Canto" | "Edição" | "Fanart" | "Moda" | "Cosplay";
  bio: string;
  followers?: number;
  works?: number;
  featured?: boolean;
  bg: string;
  imageUrl?: string;
  sourceUrl?: string;
  socials?: { platform: string; handle: string }[];
}

export interface MusicItem {
  id: string;
  slug: string;
  title: string;
  artistName: string;
  artistSlug?: string;
  albumName?: string;
  genre?: string;
  releaseDate?: string;
  imageUrl?: string;
  previewUrl?: string;
  sourceUrl?: string;
  bg: string;
}

export interface MarketItem {
  id: string;
  title: string;
  category: "Photocards" | "Lightsticks" | "Álbuns" | "Posters" | "Roupa" | "Acessórios";
  price: number;
  currency: "MZN";
  seller: string;
  city: string;
  condition: "Novo" | "Usado" | "Personalizado";
  bg: string;
}

export interface LearnTopic {
  id: string;
  slug: string;
  title: string;
  category: "Glossário" | "Cultura" | "Língua" | "História";
  excerpt: string;
  content?: string;
  duration: string;
  level: "Iniciante" | "Intermédio" | "Avançado";
}
