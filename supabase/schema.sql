-- ============================================================
-- KPOP.MZ — Schema Supabase
-- Cole este ficheiro completo no SQL Editor do Supabase
-- Project Settings → SQL Editor → New Query → Run
-- ============================================================

-- ============================================================
-- 1. TABELAS
-- (A ordem importa: tabelas referenciadas por FK devem vir primeiro)
-- ============================================================

-- Perfis de utilizadores (ligados ao NextAuth via email)
CREATE TABLE IF NOT EXISTS profiles (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email               TEXT        UNIQUE NOT NULL,
  name                TEXT        NOT NULL DEFAULT 'Utilizador',
  username            TEXT        UNIQUE NOT NULL,
  city                TEXT        NOT NULL DEFAULT 'Maputo',
  bio                 TEXT        NOT NULL DEFAULT '',
  fandoms             TEXT[]      NOT NULL DEFAULT '{}',
  is_admin            BOOLEAN     NOT NULL DEFAULT FALSE,
  onboarding_complete BOOLEAN     NOT NULL DEFAULT TRUE,
  avatar_url          TEXT,
  joined_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Se já tens o schema corrido, executa esta linha para adicionar a nova coluna:
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN NOT NULL DEFAULT TRUE;

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

-- Denúncias (submetidas por utilizadores)
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

-- Posts do Feed da Comunidade
-- (deve vir ANTES de post_likes por causa da FK)
CREATE TABLE IF NOT EXISTS feed_posts (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  author_email TEXT        NOT NULL,
  type         TEXT        NOT NULL DEFAULT 'post',
  content      TEXT        NOT NULL DEFAULT '',
  image_url    TEXT,
  tags         TEXT[]      NOT NULL DEFAULT '{}',
  reactions    INTEGER     NOT NULL DEFAULT 0,
  comments     INTEGER     NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Se já tens o schema corrido, executa estas migrações:
-- ALTER TABLE feed_posts ADD COLUMN IF NOT EXISTS image_url TEXT;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN NOT NULL DEFAULT TRUE;
-- CREATE TABLE IF NOT EXISTS post_comments (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), post_id UUID NOT NULL REFERENCES feed_posts(id) ON DELETE CASCADE, user_email TEXT NOT NULL, content TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
-- CREATE INDEX IF NOT EXISTS idx_post_comments_post ON post_comments(post_id);
-- CREATE INDEX IF NOT EXISTS idx_post_comments_user ON post_comments(user_email);
-- ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- Comentários em posts do feed
CREATE TABLE IF NOT EXISTS post_comments (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id      UUID        NOT NULL REFERENCES feed_posts(id) ON DELETE CASCADE,
  user_email   TEXT        NOT NULL,
  content      TEXT        NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Likes em posts do feed
CREATE TABLE IF NOT EXISTS post_likes (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id      UUID        NOT NULL REFERENCES feed_posts(id) ON DELETE CASCADE,
  user_email   TEXT        NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(post_id, user_email)
);

-- Follows entre utilizadores
CREATE TABLE IF NOT EXISTS follows (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_email   TEXT        NOT NULL,
  following_email  TEXT        NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(follower_email, following_email)
);

-- Notificações
CREATE TABLE IF NOT EXISTS notifications (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email   TEXT        NOT NULL,
  type         TEXT        NOT NULL,
  from_email   TEXT,
  post_id      UUID,
  read         BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. ÍNDICES (performance em queries frequentes)
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_profiles_email        ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_username     ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_feed_posts_author     ON feed_posts(author_email);
CREATE INDEX IF NOT EXISTS idx_feed_posts_published  ON feed_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_likes_post       ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user       ON post_likes(user_email);
CREATE INDEX IF NOT EXISTS idx_follows_follower      ON follows(follower_email);
CREATE INDEX IF NOT EXISTS idx_follows_following     ON follows(following_email);
CREATE INDEX IF NOT EXISTS idx_notifications_user    ON notifications(user_email, read);
CREATE INDEX IF NOT EXISTS idx_event_reg_user        ON event_registrations(user_email);
CREATE INDEX IF NOT EXISTS idx_event_reg_event       ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post    ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_user    ON post_comments(user_email);

-- ============================================================
-- 3. ROW LEVEL SECURITY
-- ============================================================
-- NOTA IMPORTANTE:
-- O servidor Next.js usa createAdminClient() com a SERVICE_ROLE KEY,
-- que bypassa o RLS automaticamente.
-- As políticas abaixo protegem o acesso directo com a chave anon
-- (ex: SDK no browser sem autenticação).
-- Escrita sem política = bloqueada por defeito.
-- ============================================================

ALTER TABLE profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE events              ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements       ENABLE ROW LEVEL SECURITY;
ALTER TABLE learn_topics        ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports             ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_posts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows             ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications       ENABLE ROW LEVEL SECURITY;

-- Leitura pública (acesso anon permitido)
CREATE POLICY "Leitura publica perfis"      ON profiles         FOR SELECT USING (true);
CREATE POLICY "Leitura publica eventos"     ON events           FOR SELECT USING (true);
CREATE POLICY "Leitura publica market"      ON market_items     FOR SELECT USING (is_active = true);
CREATE POLICY "Leitura publica anuncios"    ON announcements    FOR SELECT USING (status = 'Publicado');
CREATE POLICY "Leitura publica learn"       ON learn_topics     FOR SELECT USING (true);
CREATE POLICY "Leitura publica talentos"    ON talent_profiles  FOR SELECT USING (true);
CREATE POLICY "Leitura publica feed"        ON feed_posts       FOR SELECT USING (true);

-- As tabelas abaixo (post_likes, follows, notifications, reports,
-- event_registrations) são acedidas exclusivamente pelo servidor
-- via service_role — sem políticas anon adicionais necessárias.
-- A chave anon não tem acesso a estas tabelas.
