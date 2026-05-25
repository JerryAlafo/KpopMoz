"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowUpRight, CheckCircle, Loader2, Users } from "lucide-react";
import { useAuth } from "@/contexts/auth";

interface EventRegistrationCardProps {
  eventId: string;
  free: boolean;
  price: number;
  initialRegistered: number;
  capacity?: number;
}

export function EventRegistrationCard({
  eventId,
  free,
  price,
  initialRegistered,
  capacity,
}: EventRegistrationCardProps) {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [city, setCity] = useState(user?.city ?? "");
  const [registered, setRegistered] = useState(initialRegistered);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const progress = useMemo(() => (
    capacity ? Math.min(100, Math.round((registered / capacity) * 100)) : null
  ), [capacity, registered]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, city }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Nao foi possivel confirmar a inscricao.");

      setRegistered(data.registered ?? registered + 1);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel confirmar a inscricao.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="border-2 border-ink p-6 lg:p-8">
      <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/60 mb-4">
        Inscricao
      </div>
      <div className="font-display font-black text-5xl lg:text-6xl leading-none mb-1">
        {free ? "Gratis" : price}
        {!free && <span className="text-xl ml-1 font-mono font-normal">MZN</span>}
      </div>

      {progress !== null ? (
        <div className="mt-4 mb-5">
          <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.15em] uppercase text-ink/60 mb-2">
            <span className="inline-flex items-center gap-1">
              <Users size={11} /> {registered} / {capacity}
            </span>
            <span>{progress}% preenchido</span>
          </div>
          <div className="h-1.5 bg-ink/10 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-coral transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="mt-3 mb-5 font-mono text-[10px] tracking-[0.15em] uppercase text-ink/60">
          {registered} inscritos
        </div>
      )}

      <form onSubmit={submit} className="space-y-3">
        <label className="block">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/60">
            Nome completo
          </span>
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="O teu nome"
            className="w-full border-b border-ink/20 py-2 mt-1 focus:border-coral focus:outline-none transition-colors text-sm bg-transparent"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/60">
            Email
          </span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="o.teu@email.mz"
            className="w-full border-b border-ink/20 py-2 mt-1 focus:border-coral focus:outline-none transition-colors text-sm bg-transparent"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/60">
            Cidade
          </span>
          <input
            required
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Maputo, Beira..."
            className="w-full border-b border-ink/20 py-2 mt-1 focus:border-coral focus:outline-none transition-colors text-sm bg-transparent"
          />
        </label>

        <button
          type="submit"
          disabled={submitting || success}
          className="mt-6 w-full btn-brutal justify-center disabled:opacity-60"
        >
          {submitting ? <Loader2 size={14} className="animate-spin" /> : success ? <CheckCircle size={14} /> : <ArrowUpRight size={14} />}
          {success ? "Inscricao confirmada" : submitting ? "A confirmar" : "Confirmar inscricao"}
        </button>
      </form>

      {error && (
        <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-coral mt-3 text-center">
          {error}
        </p>
      )}
      {!error && (
        <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/40 mt-3 text-center">
          A inscricao fica registada no sistema
        </p>
      )}
    </div>
  );
}
