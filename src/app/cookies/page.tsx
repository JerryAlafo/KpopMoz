import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Cookies — KPOP.MZ",
  description: "Como a KPOP.MZ utiliza cookies e tecnologias semelhantes.",
};

const cookieTypes = [
  {
    name: "Cookies Essenciais",
    tag: "Sempre ativos",
    tagColor: "bg-ink text-bone",
    desc: "Necessários para o funcionamento básico da plataforma. Incluem cookies de sessão para manteres a sessão iniciada e cookies de preferências para guardar as tuas definições. Sem estes cookies a plataforma não funciona corretamente.",
    examples: ["session_id", "user_prefs", "csrf_token"],
  },
  {
    name: "Cookies Analíticos",
    tag: "Opcional",
    tagColor: "bg-coral text-ink",
    desc: "Ajudam-nos a compreender como os visitantes interagem com a plataforma, através de dados agregados e anónimos. Usamos estes dados para melhorar o design, o conteúdo e a performance da plataforma. Não identificam o utilizador individualmente.",
    examples: ["_ga", "_gid", "plat_analytics"],
  },
  {
    name: "Cookies de Preferências",
    tag: "Opcional",
    tagColor: "bg-coral text-ink",
    desc: "Guardam as tuas preferências de utilização — como filtros aplicados, secções favoritas ou modo de visualização. Tornam a experiência mais personalizada nas próximas visitas.",
    examples: ["filter_pref", "view_mode", "last_section"],
  },
];

const sections = [
  {
    title: "O que são cookies?",
    body: "Cookies são pequenos ficheiros de texto guardados no teu dispositivo quando visitas um website. Servem para que o site te 'reconheça' em visitas seguintes, guarde as tuas preferências e recolha dados de uso anónimos. Não são programas e não podem aceder a outros ficheiros do teu dispositivo.",
  },
  {
    title: "Como gerir cookies",
    body: "Podes controlar e/ou eliminar cookies nas definições do teu browser. Podes eliminar todos os cookies existentes no teu dispositivo e configurar a maioria dos browsers para os bloquear. Se o fizeres, poderás ter de reconfigurar manualmente algumas preferências sempre que visitares a plataforma, e alguns serviços e funcionalidades poderão não funcionar.",
  },
  {
    title: "Cookies de terceiros",
    body: "A plataforma pode incluir conteúdo incorporado (como vídeos do YouTube ou embeds do Instagram). Esses serviços podem definir os seus próprios cookies, sujeitos às políticas de privacidade dos respetivos serviços. A KM não controla esses cookies de terceiros.",
  },
  {
    title: "Atualizações a esta política",
    body: "Podemos atualizar esta política de cookies periodicamente. Alterações significativas serão comunicadas com aviso na plataforma. A data da última atualização está indicada no topo desta página.",
  },
];

export default function CookiesPage() {
  return (
    <>
      <section className="pt-28 lg:pt-36 pb-12 lg:pb-16 bg-ink text-bone relative overflow-hidden grain">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 relative">
          <div className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-coral flex items-center gap-3 mb-4">
            <span className="inline-block w-6 h-px bg-coral" />
            <span>Legal / Cookies</span>
          </div>
          <h1
            className="font-display font-bold leading-[0.92] tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 9vw, 7rem)" }}
          >
            Política de<br />
            <span className="italic text-coral">Cookies.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-bone/70 leading-relaxed">
            Última atualização: Maio de 2026. O que guardamos no teu browser e porquê.
          </p>
        </div>
      </section>

      {/* Cookie types */}
      <section className="py-16 lg:py-20 bg-bone">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-10 lg:mb-14">
            Tipos de cookies que utilizamos
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
            {cookieTypes.map((ct) => (
              <div key={ct.name} className="border border-ink/15 p-6 lg:p-8 flex flex-col gap-5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display font-bold text-xl lg:text-2xl leading-tight">
                    {ct.name}
                  </h3>
                  <span className={`shrink-0 font-mono text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 ${ct.tagColor}`}>
                    {ct.tag}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-ink/70 leading-relaxed flex-1">
                  {ct.desc}
                </p>
                <div className="pt-4 border-t border-ink/10">
                  <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/50 mb-2">
                    Exemplos
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ct.examples.map((ex) => (
                      <code key={ex} className="font-mono text-xs bg-ink/5 px-2 py-1 text-ink/70">
                        {ex}
                      </code>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Remaining sections */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="space-y-10 lg:space-y-14">
            {sections.map((s) => (
              <div key={s.title} className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4 lg:gap-10">
                <h2 className="font-display font-bold text-xl lg:text-2xl leading-tight text-coral shrink-0">
                  {s.title}
                </h2>
                <p className="text-base sm:text-lg text-ink/80 leading-relaxed">
                  {s.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 lg:mt-20 pt-10 border-t border-ink/15 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-4 font-mono text-[10px] tracking-[0.2em] uppercase">
              <Link href="/termos" className="hover:text-coral transition-colors">Termos</Link>
              <Link href="/privacidade" className="hover:text-coral transition-colors">Privacidade</Link>
            </div>
            <Link href="/" className="font-mono text-xs tracking-[0.2em] uppercase hover:text-coral transition-colors">
              ← Voltar à página principal
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
