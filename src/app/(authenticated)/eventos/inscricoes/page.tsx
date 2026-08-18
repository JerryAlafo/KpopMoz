"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, MapPin, Clock, CheckCircle2, ArrowUpRight } from "lucide-react";
import type { EventItem } from "@/types";

const monthMap: Record<string, string> = {
  "01": "JAN", "02": "FEV", "03": "MAR", "04": "ABR", "05": "MAI", "06": "JUN",
  "07": "JUL", "08": "AGO", "09": "SET", "10": "OUT", "11": "NOV", "12": "DEZ",
};


function EventCard({
  title, slug, date, startTime, endTime, location, city, free, price, coverBg, past = false,
}: {
  title: string; slug: string; date: string; startTime: string; endTime?: string;
  location: string; city: string; free: boolean; price?: number; coverBg: string; past?: boolean;
}) {
  const [, month, day] = date.split("-");

  return (
    <div className={`flex gap-3 sm:gap-4 p-4 border border-ink/10 transition-all ${past ? "opacity-60 hover:opacity-100" : "hover:border-ink/30"}`}>
      <div
        className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 grain flex flex-col items-center justify-center ${past ? "grayscale" : ""}`}
        style={{ background: coverBg }}
      >
        <div className="font-mono text-[8px] sm:text-[9px] text-bone/80">{monthMap[month as string]}</div>
        <div className="font-display font-black text-lg sm:text-xl text-bone leading-none">{day}</div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
          {past ? (
            <div className="font-display font-semibold text-sm sm:text-base leading-tight">{title}</div>
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
  const [upcomingRegistered, setUpcomingRegistered] = useState<EventItem[]>([]);
  const [pastEvents, setPastEvents] = useState<EventItem[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    setLoadingEvents(true);
    fetch("/api/conta/eventos", { cache: "no-store" })
      .then((r) => r.ok ? r.json() : { upcoming: [], past: [] })
      .then((data) => {
        setUpcomingRegistered(Array.isArray(data.upcoming) ? data.upcoming : []);
        setPastEvents(Array.isArray(data.past) ? data.past : []);
      })
      .catch(() => {})
      .finally(() => setLoadingEvents(false));
  }, []);

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
          {loadingEvents ? (
            <p className="font-mono text-xs text-ink/30 tracking-[0.15em] uppercase">A carregar...</p>
          ) : upcomingRegistered.length === 0 ? (
            <p className="font-mono text-xs text-ink/40 tracking-[0.15em] uppercase">Ainda não estás inscrito em eventos.</p>
          ) : upcomingRegistered.map((event) => (
            <EventCard
              key={event.id}
              title={event.title}
              slug={event.slug}
              date={event.date}
              startTime={event.startTime}
              endTime={event.endTime}
              location={event.location}
              city={event.city}
              free={event.free}
              price={event.price}
              coverBg={event.coverBg}
            />
          ))}
        </div>
      </section>

      {/* Histórico */}
      <section>
        <h2 className="font-display font-bold text-lg sm:text-xl tracking-tight mb-4">
          Histórico
        </h2>
        <div className="space-y-3">
          {loadingEvents ? (
            <p className="font-mono text-xs text-ink/30 tracking-[0.15em] uppercase">A carregar...</p>
          ) : pastEvents.length === 0 ? (
            <p className="font-mono text-xs text-ink/40 tracking-[0.15em] uppercase">Nenhum evento anterior.</p>
          ) : pastEvents.map((event) => (
            <EventCard
              key={event.id}
              title={event.title}
              slug={event.slug}
              date={event.date}
              startTime={event.startTime}
              endTime={event.endTime}
              location={event.location}
              city={event.city}
              free={event.free}
              price={event.price}
              coverBg={event.coverBg}
              past
            />
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
