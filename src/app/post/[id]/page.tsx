"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { PostCard } from "@/components/feed/PostCard";
import { useAuth } from "@/contexts/auth";
import type { FeedPost } from "@/types";

export default function PostPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [post, setPost] = useState<FeedPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [following, setFollowing] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!params?.id) return;
    setLoading(true);
    setNotFound(false);
    fetch(`/api/feed/${params.id}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("not found");
        const data = await r.json();
        setPost(data.post);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params?.id]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/following")
      .then((r) => r.ok ? r.json() : [])
      .then((emails) => { if (Array.isArray(emails)) setFollowing(new Set(emails)); })
      .catch(() => {});
  }, [user]);

  const handleFollowToggle = useCallback((email: string, nowFollowing: boolean) => {
    setFollowing((prev) => {
      const next = new Set(prev);
      if (nowFollowing) next.add(email);
      else next.delete(email);
      return next;
    });
  }, []);

  const handleDeleted = useCallback(() => {
    router.push("/conta/feed");
  }, [router]);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-12 pb-24 lg:pb-12 min-h-[60vh]">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/conta/feed"
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50 hover:text-coral transition-colors mb-6"
        >
          <ArrowLeft size={12} /> Voltar ao feed
        </Link>

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/30">
            <Loader2 size={14} className="animate-spin" /> A carregar post…
          </div>
        ) : notFound || !post ? (
          <div className="py-20 text-center">
            <div className="font-display font-bold text-2xl mb-2">Publicação não encontrada</div>
            <p className="font-mono text-xs text-ink/40 mb-6">Este post pode ter sido apagado ou o link está errado.</p>
            <Link href="/conta/feed" className="btn-brutal text-sm">Ir para o feed</Link>
          </div>
        ) : (
          <PostCard
            post={post}
            userEmail={user?.email ?? null}
            isFollowing={following.has(post.author.email)}
            onFollowToggle={handleFollowToggle}
            onDeleted={handleDeleted}
          />
        )}
      </div>
    </div>
  );
}
