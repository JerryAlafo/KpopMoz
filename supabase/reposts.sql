-- ============================================================
-- KPOP.MZ — Reposts Migration
-- Execute no SQL Editor do Supabase
-- ============================================================

-- Adicionar coluna repost_of_id (FK para o post original)
ALTER TABLE feed_posts
  ADD COLUMN IF NOT EXISTS repost_of_id UUID;

-- Adicionar foreign key
ALTER TABLE feed_posts
  ADD CONSTRAINT feed_posts_repost_of_id_fkey
  FOREIGN KEY (repost_of_id) REFERENCES feed_posts(id) ON DELETE SET NULL;

-- Adicionar coluna shares (contagem de reposts)
ALTER TABLE feed_posts
  ADD COLUMN IF NOT EXISTS shares INTEGER NOT NULL DEFAULT 0;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_feed_posts_repost_of_id
  ON feed_posts(repost_of_id)
  WHERE repost_of_id IS NOT NULL;

-- Garantir que cada utilizador só faz repost uma vez por post
CREATE UNIQUE INDEX IF NOT EXISTS idx_feed_posts_unique_repost_per_user
  ON feed_posts(author_email, repost_of_id)
  WHERE repost_of_id IS NOT NULL;

-- Atualizar constraint de tipos de notificação
ALTER TABLE notifications
  DROP CONSTRAINT IF EXISTS notifications_type_check;

ALTER TABLE notifications
  ADD CONSTRAINT notifications_type_check
  CHECK (type IN ('like', 'comment', 'follow', 'share', 'mention', 'repost'));

-- Função para incrementar shares
CREATE OR REPLACE FUNCTION increment_shares(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE feed_posts SET shares = shares + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

NOTIFY pgrst, 'reload';
