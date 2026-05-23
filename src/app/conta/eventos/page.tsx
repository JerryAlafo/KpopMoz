"use client";

import Link from "next/link";
import { events } from "@/data/events";
import { Calendar, MapPin, Clock, CheckCircle2, ArrowUpRight } from "lucide-react";

const monthMap: Record<string, string> = {
  "01": "JAN", "02": "FEV", "03": "MAR", "04": "ABR", "05": "MAI", "06": "JUN",
  "07": "JUL", "08": "AGO", "09": "SET", "10": "OUT", "11": "NOV", "12": "DEZ",
};

const pastEventsData = [
  {
    id: "p1",
    slug: "random-dance-abril-maputo",
    title: "Random Dance Play - Edição Abril",
    date: "2026-04-13",
    startTime: "15:00",
    endTime: "18:00",
    location: "Praça da Independência",
    city: "Maputo",
    free: true,
    coverBg: "linear-gradient(135deg, #ff3d68 0%, #ffd23f 100%)",
  },
  {
    id: "p2",
    slug: "fan-meeting-maputo-stray-kids",
    title: "Fan Meeting Stray Kids — Streaming Party",
    date: "2026-03-22",
    startTime: "20:00",
    endTime: "23:30",
    location: "Espaço KM",
    city: "Maputo",
    free: false,
    price: 150,
    coverBg: "linear-gradient(135deg, #0a0a0a 0%, #3a5cff 100%)",
  },
  {
    id: "p3",
    slug: "workshop-coreografia-fevereiro",
    title: "Workshop de Coreografia — Nível Iniciante",
    date: "2026-02-08",
    startTime: "10:00",
    endTime: "13:00",
    location: "Centro Cultural Polana",
    city: "Maputo",
    free: false,
    price: 200,
    coverBg: "linear-gradient(135deg, #7af0c8 0%, #3a5cff 100%)",
  },
];

const upcomingRegistered = events.slice(0, 3);

function EventCard({
  title,
  slug,
  date,
  startTime,
  endTime,
  location,
  city,
  free,
  price,
  coverBg,
  past = false,
}: {
  title: string; slug: string; date: string; startTime: string; endTime?: string;
  location: string; city: string; free: boolean; price?: number; coverBg: string; past?: boolean;
}) {
  const [, month, day] = date.split("-");

  return (
    <div className={`flex gap-3 sm:gap-4 p-4 border border-ink/10 transition-all ${past ? "opacity-60 hover:opacity-100" : "hover:border-ink/30"}`}>
      {/* Date badge */}
      <div
        className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 grain flex flex-col items-center justify-center ${past ? "grayscale" : ""}`}
        style={{ background: coverBg }}
      >
        <div className="font-mono text-[8px] sm:text-[9px] text-bone/80">{monthMap[month]}</div>
        <div className="font-display font-black text-lg sm:text-xl text-bone leading-none">{day}</div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
          {past ? (
            <div className="font-display font-semibold text-sm sm:text-base leading-tight">
              {title}
            </div>
          ) : (
            <Link
              href={`/eventos/${slug}`}
              className="font-display font-semibold text-sm sm:text-base leading-tight hover:text-coral transition-colors"
            >
              {title}
            </Link>
          )}
          {past ? (
            <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-ink/40 bg-ink/5 border border-ink/10 px-2 py-0.5 shrink-0">
              Concluído
            </span>
          ) : (
            <span className="flex items-center gap-1 font-mono text-[9px] sm:text-[10px] tracking-[0.1em] uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 shrink-0">
              <CheckCircle2 size={9} strokeWidth={2.5} />
              Inscrito
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
          <span className={`flex items-center gap-1 font-mono text-[9px] sm:text-[10px] tracking-[0.1em] uppercase ${past ? "text-ink/40" : "text-ink/50"}`}>
            <MapPin size={9} strokeWidth={2} />
            {location} · {city}
          </span>
          <span className={`flex items-center gap-1 font-mono text-[9px] sm:text-[10px] tracking-[0.1em] uppercase ${past ? "text-ink/40" : "text-ink/50"}`}>
            <Clock size={9} strokeWidth={2} />
            {startTime} – {endTime}
          </span>
          <span className={`font-display font-bold text-sm ${past ? "text-ink/40" : ""}`}>
            {free ? "Grátis" : `${price} MZN`}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function MeusEventosPage() {
  return (
    <div className="space-y-8 lg:space-y-10">
      <div>
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink/50 mb-2">
          Conta / Os meus eventos
        </div>
        <h1 className="font-display font-bold text-2xl sm:text-4xl tracking-tight">
          Os meus eventos<span className="text-coral">.</span>
        </h1>
      </div>

      {/* Próximos */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg sm:text-xl tracking-tight">
            Próximos eventos
          </h2>
          <Link
            href="/eventos"
            className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/50 hover:text-coral transition-colors flex items-center gap-1"
          >
            Descobrir <ArrowUpRight size={11} />
          </Link>
        </div>
        <div className="space-y-3">
          {upcomingRegistered.map((event) => (
            <EventCard key={event.id} {...event} slug={event.slug} price={event.price} />
          ))}
        </div>
      </section>

      {/* Histórico */}
      <section>
        <h2 className="font-display font-bold text-lg sm:text-xl tracking-tight mb-4">
          Histórico
        </h2>
        <div className="space-y-3">
          {pastEventsData.map((event) => (
            <EventCard key={event.id} {...event} past />
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="border border-ink/10 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="font-display font-bold text-base sm:text-lg tracking-tight">
            Descobre mais eventos
          </div>
          <div className="font-mono text-xs text-ink/50 mt-1 tracking-[0.1em] uppercase">
            Random dances, showcases, workshops e mais
          </div>
        </div>
        <Link href="/eventos" className="btn-brutal shrink-0 text-sm">
          <Calendar size={13} />
          Ver todos os eventos
        </Link>
      </div>
    </div>
  );
}
