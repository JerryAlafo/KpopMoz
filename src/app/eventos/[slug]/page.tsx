import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { MapPin, Clock, Users, ArrowLeft, ArrowUpRight, Calendar, CheckCircle } from "lucide-react";
import { Marquee } from "@/components/shared/Marquee";

export async function generateStaticParams() {
  const { data } = await supabase.from("events").select("slug");
  return (data ?? []).map((row) => ({ slug: row.slug as string }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await supabase
    .from("events")
    .select("title, description")
    .eq("slug", slug)
    .maybeSingle();
  if (!data) return {};
  return {
    title: `${data.title} — KPOP.MZ`,
    description: data.description,
  };
}

const monthMapFull: Record<string, string> = {
  "01": "Janeiro", "02": "Fevereiro", "03": "Março", "04": "Abril",
  "05": "Maio", "06": "Junho", "07": "Julho", "08": "Agosto",
  "09": "Setembro", "10": "Outubro", "11": "Novembro", "12": "Dezembro",
};

const typeLabel: Record<string, string> = {
  "random-dance": "Random Dance",
  "cover-dance": "Cover Dance",
  "encontro": "Encontro",
  "festival": "Festival",
  "workshop": "Workshop",
  "concurso": "Concurso",
};

export default async function EventoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: row } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!row) notFound();

  const event = {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    type: row.type as string,
    date: row.date as string,
    startTime: row.start_time as string,
    endTime: (row.end_time ?? undefined) as string | undefined,
    location: row.location as string,
    city: row.city as string,
    description: row.description as string,
    capacity: (row.capacity ?? undefined) as number | undefined,
    registered: row.registered as number,
    free: row.is_free as boolean,
    price: row.price as number,
    organizer: row.organizer as string,
    coverBg: row.cover_bg as string,
  };

  const [year, month, day] = event.date.split("-");
  const progress = event.capacity
    ? Math.min(100, Math.round((event.registered / event.capacity) * 100))
    : null;

  const { data: relatedRows } = await supabase
    .from("events")
    .select("id, slug, title, date, start_time, location, city, cover_bg")
    .neq("id", event.id)
    .order("date", { ascending: true })
    .limit(3);

  const related = (relatedRows ?? []).map((r) => ({
    id: r.id as string,
    slug: r.slug as string,
    title: r.title as string,
    date: r.date as string,
    startTime: r.start_time as string,
    location: r.location as string,
    city: r.city as string,
    coverBg: r.cover_bg as string,
  }));

  return (
    <>
      {/* Hero */}
      <section
        className="relative pt-28 lg:pt-36 pb-0 overflow-hidden grain"
        style={{ background: event.coverBg }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-bone" />
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 relative">
          <Link
            href="/eventos"
            className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase text-bone/80 hover:text-bone transition-colors mb-8"
          >
            <ArrowLeft size={13} strokeWidth={2} />
            Calendário
          </Link>

          <div className="pb-20 lg:pb-28">
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="bg-bone text-ink font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5">
                {typeLabel[event.type] ?? event.type}
              </span>
              <span className="bg-coral text-ink font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5">
                {event.free ? "Entrada Grátis" : `${event.price} MZN`}
              </span>
            </div>
            <h1
              className="font-display font-bold tracking-[-0.02em] leading-[0.92] text-bone max-w-4xl"
              style={{ fontSize: "clamp(2rem, 6vw, 5.5rem)" }}
            >
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-6 font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase text-bone/70">
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={11} />
                {day} de {monthMapFull[month as string]} de {year}
              </span>
              <span className="opacity-40">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={11} />
                {event.startTime}{event.endTime && ` — ${event.endTime}`}
              </span>
              <span className="opacity-40">·</span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={11} />
                {event.location}, {event.city}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-12 lg:py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Details */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl mb-4">
                  Sobre o evento
                </h2>
                <p className="text-base sm:text-lg text-ink/75 leading-[1.85]">
                  {event.description}
                </p>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Data", value: `${day} de ${monthMapFull[month as string]} de ${year}` },
                  { label: "Horário", value: `${event.startTime}${event.endTime ? ` — ${event.endTime}` : ""}` },
                  { label: "Local", value: event.location },
                  { label: "Cidade", value: event.city },
                  { label: "Organizador", value: event.organizer },
                  { label: "Tipo", value: typeLabel[event.type] ?? event.type },
                ].map(({ label, value }) => (
                  <div key={label} className="border border-ink/10 p-4 lg:p-5">
                    <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/50 mb-1">
                      {label}
                    </div>
                    <div className="font-display font-semibold text-base lg:text-lg leading-snug">
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              {/* What to expect */}
              <div className="bg-ink text-bone p-6 lg:p-8">
                <h3 className="font-display font-bold text-xl lg:text-2xl mb-5">
                  O que esperar
                </h3>
                <div className="space-y-3">
                  {[
                    "Ambiente descontraído e inclusivo",
                    "Fãs de todos os fandoms bem-vindos",
                    "Organização a cargo da equipa KM",
                    event.free ? "Entrada completamente grátis" : `Entrada: ${event.price} MZN`,
                    event.capacity ? `Vagas limitadas a ${event.capacity} pessoas` : "Sem limite de vagas",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm text-bone/80">
                      <CheckCircle size={15} className="text-coral shrink-0" strokeWidth={1.75} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Registration card */}
            <div className="lg:col-span-4 lg:col-start-9">
              <div className="sticky top-28 space-y-4">
                <div className="border-2 border-ink p-6 lg:p-8">
                  <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/60 mb-4">
                    Inscrição
                  </div>
                  <div className="font-display font-black text-5xl lg:text-6xl leading-none mb-1">
                    {event.free ? "Grátis" : event.price}
                    {!event.free && (
                      <span className="text-xl ml-1 font-mono font-normal">MZN</span>
                    )}
                  </div>

                  {progress !== null && (
                    <div className="mt-4 mb-5">
                      <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.15em] uppercase text-ink/60 mb-2">
                        <span className="inline-flex items-center gap-1">
                          <Users size={11} /> {event.registered} / {event.capacity}
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
                  )}

                  {progress === null && (
                    <div className="mt-3 mb-5 font-mono text-[10px] tracking-[0.15em] uppercase text-ink/60">
                      {event.registered} inscritos
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="block">
                      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/60">
                        Nome completo
                      </span>
                      <input
                        type="text"
                        placeholder="O teu nome"
                        className="w-full border-b border-ink/20 py-2 mt-1 focus:border-coral focus:outline-none transition-colors text-sm bg-transparent"
                      />
                    </label>
                    <label className="block">
                      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/60">
                        Email
                      </span>
                      <input
                        type="email"
                        placeholder="o.teu@email.mz"
                        className="w-full border-b border-ink/20 py-2 mt-1 focus:border-coral focus:outline-none transition-colors text-sm bg-transparent"
                      />
                    </label>
                    <label className="block">
                      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/60">
                        Cidade
                      </span>
                      <input
                        type="text"
                        placeholder="Maputo, Beira..."
                        className="w-full border-b border-ink/20 py-2 mt-1 focus:border-coral focus:outline-none transition-colors text-sm bg-transparent"
                      />
                    </label>
                  </div>

                  <button
                    type="button"
                    className="mt-6 w-full btn-brutal justify-center"
                  >
                    Confirmar inscrição
                    <ArrowUpRight size={14} />
                  </button>
                  <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/40 mt-3 text-center">
                    Receberás confirmação por email
                  </p>
                </div>

                <Link
                  href="/comunidade"
                  className="block border border-ink/15 p-5 hover:border-coral transition-colors group"
                >
                  <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/50 mb-1.5">
                    Faz parte da comunidade
                  </div>
                  <div className="font-display font-bold text-base group-hover:text-coral transition-colors inline-flex items-center gap-2">
                    Entrar na KM <ArrowUpRight size={14} />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Marquee
        items={[event.title, event.city, typeLabel[event.type] ?? event.type, event.organizer]}
        invert
      />

      {/* Related events */}
      {related.length > 0 && (
        <section className="py-12 lg:py-20">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
              <h2 className="font-display font-bold tracking-tight text-3xl sm:text-4xl">
                Outros eventos
              </h2>
              <Link
                href="/eventos"
                className="font-mono text-xs uppercase tracking-[0.2em] border-b border-ink hover:text-coral hover:border-coral pb-1 inline-flex items-center gap-2"
              >
                Calendário completo <ArrowUpRight size={13} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
              {related.map((ev) => {
                const [ey, em, ed] = ev.date.split("-");
                return (
                  <Link
                    key={ev.id}
                    href={`/eventos/${ev.slug}`}
                    className="group flex flex-col card-tilt"
                  >
                    <div
                      className="relative aspect-[4/3] overflow-hidden grain"
                      style={{ background: ev.coverBg }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                      <div className="absolute top-3 left-3 bg-bone text-ink p-2.5 sm:p-3 flex flex-col items-center min-w-[60px]">
                        <div className="font-mono text-[9px] tracking-[0.2em]">
                          {em}/{ey}
                        </div>
                        <div className="font-display font-black text-3xl leading-none mt-0.5">
                          {ed}
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="font-display font-bold text-lg text-bone group-hover:text-coral transition-colors line-clamp-2">
                          {ev.title}
                        </h3>
                      </div>
                    </div>
                    <div className="pt-3 flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase text-ink/60">
                      <MapPin size={11} />
                      {ev.location}, {ev.city}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
