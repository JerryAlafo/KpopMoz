import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Utilização — KPOP.MZ",
  description: "Termos e condições de utilização da plataforma KPOP.MZ.",
};

const sections = [
  {
    title: "1. Aceitação dos termos",
    body: "Ao acederes e utilizares a plataforma KPOP.MZ, aceitas ficar vinculado por estes Termos de Utilização. Se não concordares com alguma parte destes termos, não deves utilizar a plataforma. A KpopMoçambique reserva-se o direito de atualizar estes termos a qualquer momento, com aviso prévio publicado na plataforma.",
  },
  {
    title: "2. Utilização da plataforma",
    body: "A plataforma KPOP.MZ é destinada a fãs de K-POP em Moçambique com 13 ou mais anos de idade. Comprometes-te a utilizar a plataforma de forma respeitosa, sem publicar conteúdo ofensivo, spam, ou que viole direitos de terceiros. A KM reserva-se o direito de remover conteúdo e suspender contas que violem estes termos.",
  },
  {
    title: "3. Conta de utilizador",
    body: "És responsável por manter a confidencialidade das tuas credenciais de acesso. Todas as atividades realizadas com a tua conta são da tua responsabilidade. Caso suspeites de acesso não autorizado, deves notificar imediatamente a equipa da KM através dos nossos canais oficiais.",
  },
  {
    title: "4. Conteúdo publicado",
    body: "Ao publicares conteúdo na plataforma, concedes à KM uma licença não exclusiva para exibir, distribuir e promover esse conteúdo no contexto da plataforma. Manténs os direitos de propriedade intelectual sobre o teu conteúdo. Não deves publicar conteúdo que infrinja direitos de autor ou marcas registadas de terceiros.",
  },
  {
    title: "5. Marketplace",
    body: "As transações realizadas no Marketplace são entre vendedores e compradores individuais. A KM não é parte nas transações e não assume responsabilidade por produtos, pagamentos ou disputas entre utilizadores. Incentivamos transações seguras e locais sempre que possível.",
  },
  {
    title: "6. Propriedade intelectual",
    body: "O design, logótipo, nome KPOP.MZ e conteúdo editorial da plataforma são propriedade da KpopMoçambique. Os nomes, imagens e marcas de artistas K-POP são propriedade das respetivas agências e usados de forma referencial e não comercial, no âmbito da atividade de fandom.",
  },
  {
    title: "7. Limitação de responsabilidade",
    body: "A plataforma é fornecida 'tal como está'. A KM não garante disponibilidade ininterrupta e não se responsabiliza por perdas resultantes de indisponibilidade técnica, erros ou conteúdo de terceiros. O uso da plataforma é por conta e risco do utilizador.",
  },
  {
    title: "8. Lei aplicável",
    body: "Estes termos são regidos pela legislação moçambicana. Qualquer disputa será submetida à jurisdição dos tribunais competentes de Moçambique. A língua oficial destes termos é o Português.",
  },
];

export default function TermosPage() {
  return (
    <>
      <section className="pt-28 lg:pt-36 pb-12 lg:pb-16 bg-ink text-bone relative overflow-hidden grain">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 relative">
          <div className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-coral flex items-center gap-3 mb-4">
            <span className="inline-block w-6 h-px bg-coral" />
            <span>Legal / Termos</span>
          </div>
          <h1
            className="font-display font-bold leading-[0.92] tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 9vw, 7rem)" }}
          >
            Termos de<br />
            <span className="italic text-coral">Utilização.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-bone/70 leading-relaxed">
            Última atualização: Maio de 2026. Lê com atenção antes de utilizares a plataforma.
          </p>
        </div>
      </section>

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

          <div className="mt-16 lg:mt-20 pt-10 border-t border-ink/15 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/50">
              Dúvidas? Contacta-nos através das redes sociais.
            </p>
            <Link href="/" className="font-mono text-xs tracking-[0.2em] uppercase hover:text-coral transition-colors">
              ← Voltar à página principal
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
