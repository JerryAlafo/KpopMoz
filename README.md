# KPOP.MZ — Comunidade K-POP de Moçambique

Plataforma digital da comunidade KpopMoçambique (KM), construída em Next.js 16, React 19 e Tailwind CSS.

## Stack

- Next.js 16 (App Router, Turbopack stable)
- React 19.2
- TypeScript 5.7
- Tailwind CSS 3.4
- lucide-react (ícones)

## Como executar

Requer Node.js 20.9 ou superior.

```bash
# Instalar dependências
npm install

# Modo desenvolvimento
npm run dev

# Build de produção
npm run build
npm run start
```

A aplicação fica disponível em `http://localhost:3000`.

## Estrutura

```
src/
├── app/                    # App Router (páginas)
│   ├── page.tsx            # Homepage
│   ├── noticias/           # Notícias K-POP
│   ├── eventos/            # Calendário de eventos
│   ├── comunidade/         # Adesão e fandoms
│   ├── talentos/           # Talentos locais MZ
│   ├── artistas/           # Base de dados de grupos
│   ├── marketplace/        # Loja da comunidade
│   ├── aprender/           # Cultura e língua coreana
│   └── globals.css
├── components/
│   ├── home/               # Secções da homepage
│   ├── layout/             # Header e Footer
│   └── shared/             # Componentes partilhados
├── data/                   # Dados mock (notícias, eventos, etc.)
├── lib/                    # Utilitários
└── types/                  # Tipos TypeScript
```

## Design System

- **Paleta**: ink (#0a0a0a), bone (#f5f1ea), coral (#ff3d68), sunny (#ffd23f), electric (#3a5cff), mint (#7af0c8)
- **Tipografia**: Bricolage Grotesque (display), DM Sans (corpo), JetBrains Mono (mono), Noto Sans KR (hangul)
- **Estilo**: editorial, magazine, bold — sem emojis, apenas ícones do lucide-react

## Páginas implementadas

| Rota | Descrição |
|------|-----------|
| `/` | Homepage com hero, notícias em destaque, eventos, talentos, artistas, marketplace, aprender, sobre e CTA |
| `/noticias` | Listagem de notícias com filtros por categoria |
| `/eventos` | Agenda de eventos (Random Dance, Cover Dance, festivais) |
| `/comunidade` | Formulário de adesão e grelha de fandoms |
| `/talentos` | Talentos moçambicanos (dançarinos, editores, fanart) |
| `/artistas` | Base de dados de grupos de K-POP |
| `/marketplace` | Produtos da comunidade (photocards, lightsticks, etc.) |
| `/aprender` | Glossário, cultura, língua coreana e história |

## Responsividade

Mobile-first em todo o projeto. Breakpoints utilizados: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px).

## Notas

- Os dados são mock (em `src/data/`) — substituir por chamadas à API ou CMS quando estiver pronto.
- Fontes carregadas via `<link>` do Google Fonts no `layout.tsx`.
- O ficheiro `globals.css` contém classes utilitárias customizadas: `.grain`, `.btn-brutal`, `.marquee-track`, `.outline-number`, `.hangul-deco`, `.live-dot`, etc.
