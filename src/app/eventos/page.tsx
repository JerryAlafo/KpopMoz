"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { Marquee } from "@/components/shared/Marquee";
import { MapPin, Clock, Users, ArrowUpRight, Calendar } from "lucide-react";
import type { EventItem, EventType } from "@/types";

const monthMap: Record<string, string> = {
  "01": "JAN", "02": "FEV", "03": "MAR", "04": "ABR", "05": "MAI", "06": "JUN",
  "07": "JUL", "08": "AGO", "09": "SET", "10": "OUT", "11": "NOV", "12": "DEZ",
};

const eventTypes: { label: string; value: EventType | "todos" }[] = [
  { label: "Todos", value: "todos" },
  { label: "Random Dance", value: "random-dance" },
  { label: "Cover Dance", value: "cover-dance" },
  { label: "Encontro", value: "encontro" },
  { label: "Festival", value: "festival" },
  { label: "Workshop", value: "workshop" },
  { label: "Concurso", value: "concurso" },
];

const typeLabel: Record<string, string> = {
  "random-dance": "Random Dance",
  "cover-dance": "Cover Dance",
  "encontro": "Encontro",
  "festival": "Festival",
  "workshop": "Workshop",
  "concurso": "Concurso",
};

export default function EventosPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [active, setActive] = useState<EventType | "todos">("todos");

  useEffect(() => {
    axios.get<EventItem[]>("/api/events").then((r) => setEvents(r.data));
  }, []);

  const filtered = active === "todos" ? events : events.filter((e) => e.type === active);

  return (
    <>
      {/* Hero */}
      <section className="pt-28 lg:pt-36 pb-12 lg:pb-16 bg-ink text-bone relative overflow-hidden grain">
        <div
          aria-hidden
          className="absolute right-[-3rem] -top-12 hangul-deco font-black text-bone/[0.04] select-none pointer-events-none leading-none"
          style={{ fontSize: "clamp(8rem, 22vw, 24rem)" }}
        >
          이벤트
        </div>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 relative">
          <div className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-coral flex items-center gap-3 mb-4">
            <span className="inline-block w-6 h-px bg-coral" />
            <span>Secção 02 / Calendário</span>
          </div>
          <h1
            className="font-display font-bold leading-[0.92] tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 9vw, 8rem)" }}
          >
            Onde a comunidade
            <br />
            <span className="italic text-coral">se encontra.</span>
          </h1>
          <p className="mt-6 lg:mt-8 max-w-2xl text-base sm:text-lg text-bone/70 leading-relaxed">
            Random dance, cover dance, encontros, festivais, workshops e concursos.
            Tudo o que a KM organiza ou apoia em Maputo, Beira e online.
          </p>
        </div>
      </section>

      <Marquee
        items={["Inscrições abertas", "Vagas limitadas", "Eventos grátis e pagos", "Maputo · Beira · Online"]}
      />

      {/* Filters */}
      <section className="py-10 lg:py-14 border-b border-ink/15">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-wrap items-center gap-2">
          {eventTypes.map((t) => (
            <button
              key={t.value}
              onClick={() => setActive(t.value)}
              className={`px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] border transition-colors ${
                active === t.value
                  ? "bg-ink text-bone border-ink"
                  : "border-ink/30 hover:border-ink hover:bg-ink hover:text-bone"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      {/* Events list */}
      <section className="py-12 lg:py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <div className="font-display font-black text-6xl text-ink/10 mb-4">0</div>
              <p className="font-display font-bold text-2xl text-ink/50">
                {events.length === 0 ? "A carregar eventos..." : "Sem eventos nesta categoria."}
              </p>
            </div>
          ) : (
            <div className="space-y-4 lg:space-y-6">
              {filtered.map((event) => {
                const [year, month, day] = event.date.split("-");
                const progress = event.capacity
                  ? Math.min(100, Math.round((event.registered / event.capacity) * 100))
                  : null;
                return (
                  <Link
                    key={event.id}
                    href={`/eventos/${event.slug}`}
                    className="group block border border-ink/15 hover:border-ink transition-colors"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_300px] gap-0">
                      {/* Date block */}
                      <div
                        className="relative grain p-5 lg:p-6 flex flex-col justify-between min-h-[150px] lg:min-h-[220px]"
                        style={{ background: event.coverBg }}
                      >
                        <div className="bg-bone text-ink inline-flex items-baseline gap-2 px-3 py-1.5 w-fit">
                          <span className="font-mono text-[10px] tracking-[0.2em]">
                            {monthMap[month as string]} {year}
                          </span>
                        </div>
                        <div>
                          <div className="font-display font-black text-6xl lg:text-7xl text-bone leading-none tracking-tight">
                            {day}
                          </div>
                          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/80 mt-2">
                            {event.startTime}
                            {event.endTime && ` - ${event.endTime}`}
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-5 lg:p-6 lg:px-8 flex flex-col justify-center">
                        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-coral mb-2">
                          {typeLabel[event.type] ?? event.type} · {event.organizer}
                        </div>
                        <h3 className="font-display font-bold text-2xl sm:text-3xl leading-tight group-hover:text-coral transition-colors">
                          {event.title}
                        </h3>
                        <p className="mt-2 text-sm sm:text-base text-ink/70 leading-relaxed line-clamp-2">
                          {event.description}
                        </p>
                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-ink/60">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin size={11} /> {event.location}, {event.city}
                          </span>
                          {progress !== null && (
                            <span className="inline-flex items-center gap-1.5">
                              <Users size={11} /> {event.registered}/{event.capacity}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action */}
                      <div className="border-t lg:border-t-0 lg:border-l border-ink/15 p-5 lg:p-6 flex lg:flex-col items-center justify-between lg:justify-center gap-4 bg-bone-200/30">
                        <div className="flex flex-col items-start lg:items-center">
                          <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/60">
                            {event.free ? "Entrada" : "Preço"}
                          </div>
                          <div className="font-display font-bold text-3xl lg:text-4xl">
                            {event.free ? "Grátis" : `${event.price}`}
                            {!event.free && (
                              <span className="text-base ml-1 font-mono">MZN</span>
                            )}
                          </div>
                        </div>
                        <div className="btn-brutal">
                          Inscrever
                          <ArrowUpRight size={14} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Submit event CTA */}
      <section className="py-16 lg:py-20 bg-coral text-ink grain">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <Calendar size={32} className="mx-auto mb-4" strokeWidth={1.5} />
          <h2 className="font-display font-bold text-3xl sm:text-5xl tracking-tight">
            Organizas um evento de K-POP?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-ink/80 max-w-2xl mx-auto">
            Submete o teu evento para apreciação da equipa KM e ganha visibilidade
            junto da maior comunidade K-POP do país.
          </p>
          <button className="btn-brutal mt-8">
            Submeter evento
            <ArrowUpRight size={14} />
          </button>
        </div>
      </section>
    </>
  );
}
