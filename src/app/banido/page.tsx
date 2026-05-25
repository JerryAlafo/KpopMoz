import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function BanidoPage() {
  return (
    <main className="min-h-screen bg-bone flex items-center justify-center px-4">
      <div className="max-w-md border border-coral/25 p-8 text-center space-y-5">
        <ShieldAlert size={42} className="mx-auto text-coral" strokeWidth={1.75} />
        <div className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-coral">
            Conta suspensa
          </p>
          <h1 className="font-display font-bold text-3xl tracking-tight">
            Acesso bloqueado.
          </h1>
          <p className="text-sm leading-relaxed text-ink/65">
            Esta conta foi suspensa pela administracao da comunidade. Para rever a decisao,
            contacta a equipa KM.
          </p>
        </div>
        <Link href="/" className="btn-brutal inline-flex">
          Voltar ao inicio
        </Link>
      </div>
    </main>
  );
}
