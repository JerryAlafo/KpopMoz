import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade — KPOP.MZ",
  description: "Como a KPOP.MZ recolhe, usa e protege os teus dados pessoais.",
};

const sections = [
  {
    title: "1. Quem somos",
    body: "A KpopMoçambique (KM) é responsável pelo tratamento dos dados pessoais recolhidos através da plataforma KPOP.MZ. Podes contactar-nos através dos nossos canais oficiais nas redes sociais ou pelo email indicado na plataforma.",
  },
  {
    title: "2. Dados que recolhemos",
    body: "Recolhemos o nome, endereço de email e cidade quando te registas na plataforma. Adicionalmente, podemos recolher dados de uso (páginas visitadas, tempo na plataforma) de forma agregada e anónima para melhorar a experiência. Não recolhemos dados sensíveis como documentos de identidade ou informação financeira.",
  },
  {
    title: "3. Como usamos os teus dados",
    body: "Utilizamos os teus dados para gerir a tua conta, enviar o newsletter semanal (se subscrito), notificá-te de eventos relevantes na tua cidade, e personalizar o conteúdo que vês na plataforma. Nunca vendemos nem partilhamos os teus dados com terceiros para fins comerciais.",
  },
  {
    title: "4. Newsletter e comunicações",
    body: "O newsletter semanal é de subscrição voluntária. Podes cancelar a subscrição a qualquer momento através do link de cancelamento em qualquer email enviado ou através das definições da tua conta. As comunicações operacionais (segurança da conta, por exemplo) não podem ser desativadas.",
  },
  {
    title: "5. Cookies",
    body: "Utilizamos cookies técnicos essenciais para o funcionamento da plataforma (sessão, preferências). Utilizamos também cookies analíticos anónimos para entender como a plataforma é usada. Podes gerir as preferências de cookies através da nossa política de cookies ou das definições do teu browser.",
  },
  {
    title: "6. Retenção de dados",
    body: "Os teus dados são mantidos enquanto a tua conta estiver ativa. Se eliminares a conta, os dados pessoais serão apagados dentro de 30 dias, exceto os que sejam necessários por obrigações legais ou para resolver disputas pendentes.",
  },
  {
    title: "7. Os teus direitos",
    body: "Tens direito a aceder, corrigir e eliminar os teus dados pessoais. Podes exportar os dados da tua conta ou solicitar a sua eliminação através das definições da plataforma ou contactando-nos diretamente. Comprometemo-nos a responder a pedidos de privacidade dentro de 30 dias.",
  },
  {
    title: "8. Segurança",
    body: "Implementamos medidas técnicas e organizacionais para proteger os teus dados contra acesso não autorizado, perda ou divulgação. As passwords são armazenadas de forma encriptada. Apesar das nossas medidas, nenhum sistema é 100% seguro — informa-nos imediatamente se suspeitares de qualquer violação.",
  },
];

export default function PrivacidadePage() {
  return (
    <>
      <section className="pt-28 lg:pt-36 pb-12 lg:pb-16 bg-ink text-bone relative overflow-hidden grain">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 relative">
          <div className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-coral flex items-center gap-3 mb-4">
            <span className="inline-block w-6 h-px bg-coral" />
            <span>Legal / Privacidade</span>
          </div>
          <h1
            className="font-display font-bold leading-[0.92] tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 9vw, 7rem)" }}
          >
            Política de<br />
            <span className="italic text-coral">Privacidade.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-bone/70 leading-relaxed">
            Última atualização: Maio de 2026. Os teus dados, como os usamos e como os protegemos.
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
