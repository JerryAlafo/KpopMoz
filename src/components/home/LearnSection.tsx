import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { BookOpen, Clock, ArrowUpRight } from "lucide-react";

export async function LearnSection() {
  const { data } = await supabase
    .from("learn_topics")
    .select("id, slug, title, category, excerpt, duration, level")
    .order("created_at", { ascending: false })
    .limit(6);

  const topics = (data ?? []).map((row) => ({
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    category: row.category as string,
    excerpt: row.excerpt as string,
    duration: row.duration as string,
    level: row.level as string,
  }));

  return (
    <section className="py-16 lg:py-24 bg-ink text-bone relative overflow-hidden grain">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        <SectionHeader
          number="06"
          eyebrow="Cultura"
          title="Aprende com a comunidade"
          description="Glossário, alfabeto Hangul, história do K-POP e cultura coreana - tudo em português, sem complicar."
          link={{ href: "/aprender", label: "Centro de aprendizagem" }}
          invert
        />

        <div className="mt-10 lg:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
          {topics.map((topic, i) => (
            <Link
              key={topic.id}
              href={`/aprender/${topic.slug}`}
              className="group flex items-center gap-4 lg:gap-6 p-4 lg:p-6 border border-bone/15 hover:border-coral hover:bg-coral hover:text-ink transition-all duration-300"
            >
              <div className="font-display font-black text-3xl lg:text-5xl leading-none opacity-30 group-hover:opacity-100 transition-opacity shrink-0">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 font-mono text-[9px] sm:text-[10px] tracking-[0.25em] uppercase opacity-60 mb-2">
                  <span className="inline-flex items-center gap-1">
                    <BookOpen size={10} /> {topic.category}
                  </span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={10} /> {topic.duration}
                  </span>
                  <span>·</span>
                  <span>{topic.level}</span>
                </div>
                <h3 className="font-display font-bold text-lg sm:text-xl lg:text-2xl leading-tight">
                  {topic.title}
                </h3>
                <p className="text-sm opacity-70 mt-1 line-clamp-2">
                  {topic.excerpt}
                </p>
              </div>
              <ArrowUpRight size={20} className="opacity-40 group-hover:opacity-100 shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
