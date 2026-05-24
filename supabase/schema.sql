-- ============================================================
-- KPOP.MZ — Schema Supabase
-- Cole este ficheiro completo no SQL Editor do Supabase
-- Project Settings → SQL Editor → New Query → Run
-- ============================================================

-- ============================================================
-- 1. TABELAS
-- ============================================================

-- Perfis de utilizadores (ligados ao NextAuth via email)
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT        UNIQUE NOT NULL,
  name        TEXT        NOT NULL DEFAULT 'Utilizador',
  username    TEXT        UNIQUE NOT NULL,
  city        TEXT        NOT NULL DEFAULT 'Maputo',
  bio         TEXT        NOT NULL DEFAULT '',
  fandoms     TEXT[]      NOT NULL DEFAULT '{}',
  is_admin    BOOLEAN     NOT NULL DEFAULT FALSE,
  avatar_url  TEXT,
  joined_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Eventos
CREATE TABLE IF NOT EXISTS events (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT        UNIQUE NOT NULL,
  title       TEXT        NOT NULL,
  description TEXT        NOT NULL DEFAULT '',
  date        DATE        NOT NULL,
  start_time  TEXT        NOT NULL DEFAULT '00:00',
  end_time    TEXT,
  location    TEXT        NOT NULL,
  city        TEXT        NOT NULL,
  type        TEXT        NOT NULL,
  is_free     BOOLEAN     NOT NULL DEFAULT TRUE,
  price       INTEGER     NOT NULL DEFAULT 0,
  capacity    INTEGER,
  registered  INTEGER     NOT NULL DEFAULT 0,
  organizer   TEXT        NOT NULL DEFAULT 'KpopMoçambique',
  cover_bg    TEXT        NOT NULL DEFAULT 'linear-gradient(135deg, #1c1c1c, #0a0a0a)',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Itens do Marketplace
CREATE TABLE IF NOT EXISTS market_items (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT        NOT NULL,
  category    TEXT        NOT NULL,
  condition   TEXT        NOT NULL,
  price       INTEGER     NOT NULL,
  seller      TEXT        NOT NULL,
  city        TEXT        NOT NULL,
  bg          TEXT        NOT NULL DEFAULT 'linear-gradient(135deg, #1c1c1c, #0a0a0a)',
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Anúncios
CREATE TABLE IF NOT EXISTS announcements (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT        NOT NULL,
  body        TEXT        NOT NULL DEFAULT '',
  audience    TEXT        NOT NULL DEFAULT 'Geral',
  is_pinned   BOOLEAN     NOT NULL DEFAULT FALSE,
  status      TEXT        NOT NULL DEFAULT 'Publicado',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tópicos de Aprendizagem
CREATE TABLE IF NOT EXISTS learn_topics (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT        UNIQUE NOT NULL,
  title       TEXT        NOT NULL,
  category    TEXT        NOT NULL,
  excerpt     TEXT        NOT NULL DEFAULT '',
  content     TEXT        NOT NULL DEFAULT '',
  duration    TEXT        NOT NULL DEFAULT '5 min',
  level       TEXT        NOT NULL DEFAULT 'Iniciante',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Perfis de Talentos Moçambicanos
CREATE TABLE IF NOT EXISTS talent_profiles (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT        UNIQUE NOT NULL,
  name        TEXT        NOT NULL,
  username    TEXT        NOT NULL,
  specialty   TEXT        NOT NULL,
  city        TEXT        NOT NULL,
  bio         TEXT        NOT NULL DEFAULT '',
  followers   INTEGER     NOT NULL DEFAULT 0,
  works       INTEGER     NOT NULL DEFAULT 0,
  image_url   TEXT,
  is_featured BOOLEAN     NOT NULL DEFAULT FALSE,
  bg          TEXT        NOT NULL DEFAULT 'linear-gradient(135deg, #1c1c1c, #0a0a0a)',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Denúncias
CREATE TABLE IF NOT EXISTS reports (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  reason            TEXT        NOT NULL,
  post_content      TEXT        NOT NULL,
  author_username   TEXT        NOT NULL,
  reporter_username TEXT        NOT NULL,
  status            TEXT        NOT NULL DEFAULT 'pendente',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Inscrições em Eventos
CREATE TABLE IF NOT EXISTS event_registrations (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    UUID        NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_email  TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(event_id, user_email)
);

-- ============================================================
-- 2. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE events              ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements       ENABLE ROW LEVEL SECURITY;
ALTER TABLE learn_topics        ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports             ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Leitura pública
CREATE POLICY "Leitura publica eventos"      ON events           FOR SELECT USING (true);
CREATE POLICY "Leitura publica market"       ON market_items     FOR SELECT USING (is_active = true);
CREATE POLICY "Leitura publica anuncios"     ON announcements    FOR SELECT USING (status = 'Publicado');
CREATE POLICY "Leitura publica learn"        ON learn_topics     FOR SELECT USING (true);
CREATE POLICY "Leitura publica talentos"     ON talent_profiles  FOR SELECT USING (true);
CREATE POLICY "Leitura publica perfis"       ON profiles         FOR SELECT USING (true);

-- O service_role key (usado no servidor) bypassa RLS automaticamente

