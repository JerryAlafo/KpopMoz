import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { MapPin } from "lucide-react";

export async function MarketplaceSection() {
  const { data } = await supabase
    .from("market_items")
    .select("id, title, category, price, seller, city, condition, bg")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(6);

  const items = (data ?? []).map((row) => ({
    id: row.id as string,
    title: row.title as string,
    category: row.category as string,
    price: row.price as number,
    seller: row.seller as string,
    city: row.city as string,
    condition: row.condition as string,
    bg: row.bg as string,
  }));

  return (
    <section className="py-16 lg:py-24 bg-bone">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        <SectionHeader
          number="05"
          eyebrow="Marketplace"
          title="Trocas, vendas e merch"
          description="Photocards, lightsticks, álbuns, posters, roupa e acessórios - de vendedores moçambicanos para fãs moçambicanos."
          link={{ href: "/marketplace", label: "Abrir marketplace" }}
        />

        <div className="mt-10 lg:mt-16 grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {items.map((item, i) => (
            <Link
              key={item.id}
              href="/marketplace"
              className="group flex flex-col card-tilt"
            >
              <div
                className="relative aspect-square overflow-hidden grain"
                style={{ background: item.bg }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />
                <div className="absolute top-3 left-3 bg-bone text-ink font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-1">
                  {item.category}
                </div>
                <div className="absolute top-3 right-3 outline-number font-display font-black text-bone leading-none text-3xl sm:text-4xl">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="absolute bottom-3 right-3 bg-ink text-bone px-2.5 py-1 font-mono text-xs tracking-wider font-semibold">
                  {item.price} MZN
                </div>
              </div>
              <div className="pt-3 lg:pt-4 space-y-1">
                <h3 className="font-display font-semibold text-sm sm:text-base leading-tight group-hover:text-coral transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] uppercase text-ink/60">
                  <span className="truncate max-w-[60%]">{item.seller}</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={10} /> {item.city}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
