"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { MapPin, Filter } from "lucide-react";
import type { MarketItem } from "@/types";

type Category = MarketItem["category"] | "Tudo";
type Condition = MarketItem["condition"] | "Todos";

const categories: Category[] = [
  "Tudo", "Photocards", "Lightsticks", "Álbuns", "Posters", "Roupa", "Acessórios",
];

export default function MarketplacePage() {
  const [items, setItems] = useState<MarketItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>("Tudo");
  const [activeCondition, setActiveCondition] = useState<Condition>("Todos");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    axios.get<MarketItem[]>("/api/market").then((r) => setItems(r.data));
  }, []);

  const filtered = items.filter((item) => {
    const catMatch = activeCategory === "Tudo" || item.category === activeCategory;
    const condMatch = activeCondition === "Todos" || item.condition === activeCondition;
    return catMatch && condMatch;
  });

  return (
    <>
      <section className="pt-28 lg:pt-36 pb-12 lg:pb-16 border-b border-ink/15">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-coral flex items-center gap-3 mb-4">
            <span className="inline-block w-6 h-px bg-coral" />
            <span>Secção 06 / Marketplace</span>
          </div>
          <h1
            className="font-display font-bold leading-[0.92] tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 9vw, 8rem)" }}
          >
            Compra. Vende.
            <br />
            <span className="italic text-coral">Troca.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-ink/70 leading-relaxed">
            Photocards, lightsticks, álbuns, posters, roupa e acessórios —
            entregues por vendedores moçambicanos verificados.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] border transition-colors ${
                  activeCategory === c
                    ? "bg-ink text-bone border-ink"
                    : "border-ink/30 hover:border-ink hover:bg-ink hover:text-bone"
                }`}
              >
                {c}
              </button>
            ))}
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`ml-auto px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] border inline-flex items-center gap-2 transition-colors ${
                showFilters ? "bg-ink text-bone border-ink" : "border-ink hover:bg-ink hover:text-bone"
              }`}
            >
              <Filter size={12} />
              Filtros
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2 pt-4 border-t border-ink/10">
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/50 mr-2">
                Condição:
              </span>
              {(["Todos", "Novo", "Usado", "Personalizado"] as Condition[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCondition(c)}
                  className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] border transition-colors ${
                    activeCondition === c
                      ? "bg-coral text-ink border-coral"
                      : "border-ink/20 hover:border-ink"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <div className="font-display font-black text-6xl text-ink/10 mb-4">0</div>
              <p className="font-display font-bold text-2xl text-ink/50">
                {items.length === 0 ? "A carregar produtos..." : "Sem resultados para este filtro."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {filtered.map((item) => (
                <div key={item.id} className="group flex flex-col card-tilt cursor-pointer">
                  <div
                    className="relative aspect-square overflow-hidden grain"
                    style={{ background: item.bg }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
                    <div className="absolute top-3 left-3 bg-bone text-ink font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-1">
                      {item.category}
                    </div>
                    <div className="absolute top-3 right-3 bg-coral text-ink font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-1">
                      {item.condition}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                      <div className="font-display font-black text-3xl sm:text-4xl text-bone leading-none">
                        {item.price}
                        <span className="text-sm ml-1 font-mono align-middle">MZN</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 lg:pt-4">
                    <h3 className="font-display font-semibold text-sm sm:text-base leading-tight group-hover:text-coral transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="mt-2 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] uppercase text-ink/60">
                      <span className="truncate max-w-[55%]">{item.seller}</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={10} /> {item.city}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info CTA */}
      <section className="py-16 lg:py-20 bg-ink text-bone grain">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 items-center">
            <h2 className="font-display font-bold leading-[0.95] tracking-tight text-4xl sm:text-5xl lg:text-6xl">
              Vende o que tens,
              <br />
              <span className="italic text-coral">para fãs reais.</span>
            </h2>
            <div>
              <p className="text-base sm:text-lg text-bone/70 leading-relaxed">
                Para listar um produto no marketplace, contacta a administração da
                comunidade. Verificamos todos os vendedores para manter a confiança
                da comunidade.
              </p>
              <p className="mt-4 font-mono text-[10px] tracking-[0.2em] uppercase text-bone/40">
                Contacto · kpopmozambique@gmail.com
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
