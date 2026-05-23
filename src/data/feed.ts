export type FeedPost = {
  id: string;
  type: "post" | "event" | "news" | "talent" | "milestone";
  author: {
    name: string;
    username: string;
    initials: string;
    avatarBg: string;
    fandom?: string;
  };
  publishedAt: string;
  content?: string;
  image?: { bg: string; alt: string };
  link?: { href: string; label: string };
  reactions: { emoji: string; count: number }[];
  comments: number;
  tags?: string[];
};

export const feedPosts: FeedPost[] = [
  {
    id: "f1",
    type: "post",
    author: {
      name: "Yara Mucavele",
      username: "@yara.dnc",
      initials: "YM",
      avatarBg: "linear-gradient(135deg, #ff3d68, #ffd23f)",
      fandom: "ARMY",
    },
    publishedAt: "2026-05-23T09:14:00",
    content:
      "Acabámos de confirmar a setlist para o Random Dance de Junho 🔥 Mais de 65 músicas, pesos pesados da 2ª, 3ª e 4ª gen. Quem vem? Inscrições abertas no link da bio!",
    reactions: [
      { emoji: "🔥", count: 48 },
      { emoji: "💜", count: 31 },
      { emoji: "😱", count: 19 },
    ],
    comments: 14,
    tags: ["RandomDance", "Junho", "Maputo"],
  },
  {
    id: "f3",
    type: "post",
    author: {
      name: "Grupo CRWN",
      username: "@crwn.crew",
      initials: "CR",
      avatarBg: "linear-gradient(135deg, #0a0a0a, #ff3d68)",
      fandom: "STAY",
    },
    publishedAt: "2026-05-22T11:30:00",
    content:
      "Novo vídeo no canal! Cobrimos a choreo do \"Maniac\" inteira — 4 meses de ensaio comprimidos em 3 minutos. Vai ao YouTube e diz-nos o que achas.",
    image: { bg: "linear-gradient(135deg, #0a0a0a 0%, #3a5cff 100%)", alt: "CRWN cover dance" },
    link: { href: "/talentos/grupo-crwn", label: "Ver perfil do CRWN" },
    reactions: [
      { emoji: "🔥", count: 73 },
      { emoji: "💫", count: 55 },
    ],
    comments: 27,
    tags: ["CoverDance", "StrayKids", "Beira"],
  },
  {
    id: "f4",
    type: "event",
    author: {
      name: "KM Beira",
      username: "@km.beira",
      initials: "KB",
      avatarBg: "linear-gradient(135deg, #3a5cff, #7af0c8)",
    },
    publishedAt: "2026-05-21T14:00:00",
    content:
      "Inscrições abertas para o Cover Dance Showcase Beira — 15 de Junho no Centro Cultural Português. 7 grupos confirmados. Entrada: 100 MZN. Vagas limitadas!",
    image: { bg: "linear-gradient(135deg, #3a5cff 0%, #ff3d68 100%)", alt: "Cover Dance Showcase Beira" },
    link: { href: "/eventos/cover-dance-showcase-beira", label: "Ver evento e inscrever" },
    reactions: [
      { emoji: "🎤", count: 34 },
      { emoji: "🙌", count: 28 },
    ],
    comments: 9,
    tags: ["Beira", "CoverDance", "Showcase"],
  },
  {
    id: "f5",
    type: "post",
    author: {
      name: "Tânia Cossa",
      username: "@tania.draws",
      initials: "TC",
      avatarBg: "linear-gradient(135deg, #7af0c8, #3a5cff)",
      fandom: "BLINK",
    },
    publishedAt: "2026-05-21T08:45:00",
    content:
      "Terminei a série de fanart das NewJeans. Cinco peças, uma por membro, técnica digital + caligrafia coreana à mão. Aceito comissões de outros grupos — DM aberto 🎨",
    image: { bg: "linear-gradient(135deg, #ffd23f 0%, #ff5a82 100%)", alt: "Fanart NewJeans" },
    link: { href: "/talentos/tania-cossa", label: "Ver portfólio" },
    reactions: [
      { emoji: "🎨", count: 91 },
      { emoji: "😍", count: 67 },
      { emoji: "💛", count: 44 },
    ],
    comments: 33,
    tags: ["Fanart", "NewJeans", "Arte"],
  },
  {
    id: "f6",
    type: "milestone",
    author: {
      name: "Equipa KM",
      username: "@kpopmz",
      initials: "KM",
      avatarBg: "#ff3d68",
    },
    publishedAt: "2026-05-20T12:00:00",
    content:
      "8 000 membros registados na plataforma! Desde Maputo à Pemba, somos cada vez mais. Obrigado a cada um que faz esta comunidade acontecer 💜",
    reactions: [
      { emoji: "🎉", count: 204 },
      { emoji: "💜", count: 178 },
      { emoji: "🇲🇿", count: 155 },
    ],
    comments: 61,
    tags: ["KpopMz", "Comunidade", "Marco"],
  },
  {
    id: "f7",
    type: "post",
    author: {
      name: "Eduardo Nhaca",
      username: "@eddu.edit",
      initials: "EN",
      avatarBg: "linear-gradient(135deg, #3a5cff, #7af0c8)",
      fandom: "STAY",
    },
    publishedAt: "2026-05-19T20:10:00",
    content:
      "Fiz um recap em vídeo do Random Dance de Maio. 4K, color grade feito do zero, e sim tem slow-motion do momento caos total quando tocou Miroh. Link no perfil.",
    reactions: [
      { emoji: "😂", count: 58 },
      { emoji: "🔥", count: 47 },
    ],
    comments: 18,
    tags: ["VideoEdit", "RandomDance", "Recap"],
  },
];
