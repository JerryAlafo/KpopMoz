import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { MapPin, Clock, Users } from "lucide-react";

const monthMap: Record<string, string> = {
  "01": "JAN", "02": "FEV", "03": "MAR", "04": "ABR", "05": "MAI", "06": "JUN",
  "07": "JUL", "08": "AGO", "09": "SET", "10": "OUT", "11": "NOV", "12": "DEZ",
};

export async function EventsSection() {
  const { data } = await supabase
    .from("events")
    .select("id, slug, title, type, date, start_time, end_time, location, city, capacity, registered, is_free, price, cover_bg")
    .order("date", { ascending: true })
    .limit(4);

  const upcoming = (data ?? []).map((row) => ({
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    type: row.type as string,
    date: row.date as string,
    startTime: row.start_time as string,
    endTime: (row.end_time ?? undefined) as string | undefined,
    location: row.location as string,
    city: row.city as string,
    capacity: (row.capacity ?? undefined) as number | undefined,
    registered: row.registered as number,
    free: row.is_free as boolean,
    price: row.price as number,
    coverBg: row.cover_bg as string,
  }));

  return (
    <section className="py-16 lg:py-24 bg-ink text-bone relative overflow-hidden grain">
      <div
        aria-hidden
        className="absolute left-[-2rem] -bottom-12 lg:-bottom-24 hangul-deco font-black text-bone/[0.03] select-none pointer-events-none leading-none"
        style={{ fontSize: "clamp(8rem, 22vw, 24rem)" }}
      >
        이벤트
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 relative">
        <SectionHeader
          number="02"
          eyebrow="Calendário"
          title="Próximos eventos"
          description="Random dance, cover dance, encontros e festivais. Junta-te. As inscrições fecham quando enchemos a sala."
          link={{ href: "/eventos", label: "Calendário completo" }}
          invert
        />

        <div className="mt-10 lg:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {upcoming.map((event) => {
            const [year, month, day] = event.date.split("-");
            const progress = event.capacity
              ? Math.min(100, Math.round((event.registered / event.capacity) * 100))
              : null;
            return (
              <Link
                key={event.id}
                href={`/eventos/${event.slug}`}
                className="group flex flex-col card-tilt"
              >
                <div
                  className="relative aspect-[4/5] overflow-hidden grain"
                  style={{ background: event.coverBg }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-bone text-ink p-2 sm:p-3 flex flex-col items-center min-w-[60px] sm:min-w-[70px]">
                    <div className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em]">
                      {monthMap[month as string]} {year}
                    </div>
                    <div className="font-display font-black text-3xl sm:text-4xl leading-none mt-1">
                      {day}
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-coral text-ink font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] px-2 py-1">
                    {event.type.replace("-", " ")}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
                    <h3 className="font-display font-bold text-lg sm:text-xl leading-tight text-bone group-hover:text-coral transition-colors line-clamp-2">
                      {event.title}
                    </h3>
                  </div>
                </div>
                <div className="pt-4 space-y-2 border-t border-bone/10 mt-0">
                  <div className="flex items-center gap-2 text-xs text-bone/70">
                    <MapPin size={12} strokeWidth={1.75} />
                    <span className="truncate">{event.location}, {event.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-bone/70">
                    <Clock size={12} strokeWidth={1.75} />
                    <span>{event.startTime}{event.endTime && ` — ${event.endTime}`}</span>
                  </div>
                  {progress !== null && (
                    <div className="pt-1">
                      <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.15em] uppercase text-bone/50 mb-1.5">
                        <span className="inline-flex items-center gap-1">
                          <Users size={10} /> {event.registered}/{event.capacity}
                        </span>
                        <span>{event.free ? "Grátis" : `${event.price} MZN`}</span>
                      </div>
                      <div className="h-px bg-bone/20 relative overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-coral"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {progress === null && (
                    <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.15em] uppercase text-bone/50 pt-1">
                      <span>{event.registered} inscritos</span>
                      <span>{event.free ? "Grátis" : `${event.price} MZN`}</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
