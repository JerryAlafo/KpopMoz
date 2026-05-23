"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth";
import {
  Users, FileText, Flag, Megaphone, TrendingUp, Calendar,
  ShieldCheck, Trash2, Check, X, Search, ChevronDown,
  AlertTriangle, Eye, Newspaper, Music,
} from "lucide-react";

/* ── Mock data ──────────────────────────────────────── */
const STATS = [
  { label: "Membros",          value: "8 247",  delta: "+34 esta semana",  icon: Users,       color: "text-blue-600"   },
  { label: "Posts hoje",       value: "127",    delta: "+18% vs ontem",    icon: FileText,    color: "text-emerald-600" },
  { label: "Denúncias activas",value: "4",      delta: "2 novas hoje",     icon: Flag,        color: "text-coral"      },
  { label: "Eventos activos",  value: "6",      delta: "3 esta semana",    icon: Calendar,    color: "text-amber-600"  },
];

const ACTIVITY = [
  { day: "Seg", posts: 89  },
  { day: "Ter", posts: 104 },
  { day: "Qua", posts: 78  },
  { day: "Qui", posts: 143 },
  { day: "Sex", posts: 167 },
  { day: "Sáb", posts: 201 },
  { day: "Dom", posts: 127 },
];
const maxPosts = Math.max(...ACTIVITY.map((a) => a.posts));

const MOCK_MEMBERS = [
  { id: "u1", name: "Yara Mucavele",  username: "@yara.dnc",    role: "mod",  posts: 312, joined: "Jan 2024", online: true  },
  { id: "u2", name: "Eduardo Nhaca",  username: "@eddu.edit",   role: "member", posts: 198, joined: "Mar 2024", online: true  },
  { id: "u3", name: "Tânia Cossa",    username: "@tania.draws", role: "member", posts: 87,  joined: "Jun 2024", online: false },
  { id: "u4", name: "Carlos Sitoe",   username: "@c.sitoe",     role: "member", posts: 45,  joined: "Ago 2024", online: false },
  { id: "u5", name: "Fátima Nhacolo", username: "@fat.km",      role: "member", posts: 231, joined: "Fev 2024", online: true  },
  { id: "u6", name: "Grupo CRWN",     username: "@crwn.crew",   role: "mod",  posts: 156, joined: "Mai 2024", online: false },
];

const MOCK_REPORTS = [
  { id: "r1", reason: "Spam", post: "Compra seguidores reais por 500MZN...", author: "@unknown99", reporter: "@yara.dnc", ago: "5 min" },
  { id: "r2", reason: "Assédio", post: "Comentário ofensivo num post de fanart...", author: "@troll_acc", reporter: "@tania.draws", ago: "2h" },
  { id: "r3", reason: "Conteúdo explícito", post: "Imagem inapropriada partilhada no feed...", author: "@acc123", reporter: "@eddu.edit", ago: "5h" },
  { id: "r4", reason: "Outro", post: "Informação falsa sobre concert BTS em Maputo...", author: "@fake_news", reporter: "@fat.km", ago: "1d" },
];

const REASON_COLOR: Record<string, string> = {
  "Spam":               "text-amber-700 bg-amber-50",
  "Assédio":            "text-coral bg-coral/10",
  "Conteúdo explícito": "text-red-700 bg-red-50",
  "Outro":              "text-ink/50 bg-ink/5",
};

type Tab = "overview" | "membros" | "denuncias" | "conteudo";

/* ── Componente principal ──────────────────────────── */
export default function AdminPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("todos");
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [banned, setBanned] = useState<string[]>([]);

  if (!user?.isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <ShieldCheck size={40} className="text-ink/20 mx-auto" />
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/40">
            Acesso negado
          </p>
          <Link href="/conta" className="btn-brutal">Voltar ao dashboard</Link>
        </div>
      </div>
    );
  }

  const filteredMembers = MOCK_MEMBERS.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.username.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "todos" || m.role === roleFilter;
    return matchSearch && matchRole;
  });

  const activeReports = MOCK_REPORTS.filter((r) => !dismissed.includes(r.id));

  const tabs: { key: Tab; label: string; badge?: number }[] = [
    { key: "overview",  label: "Visão geral" },
    { key: "membros",   label: "Membros",    badge: MOCK_MEMBERS.length },
    { key: "denuncias", label: "Denúncias",  badge: activeReports.length },
    { key: "conteudo",  label: "Conteúdo"   },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink/50 mb-2">
          Conta / Admin
        </div>
        <div className="flex items-center gap-3">
          <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
            Administração<span className="text-coral">.</span>
          </h1>
          <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-coral bg-coral/10 px-2 py-1">
            <ShieldCheck size={10} strokeWidth={2.5} />
            Admin
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-ink/10 overflow-x-auto scrollbar-hide">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`shrink-0 flex items-center gap-2 px-4 sm:px-5 py-3 font-mono text-[10px] sm:text-xs uppercase tracking-[0.15em] border-b-2 -mb-px transition-all ${
              tab === t.key ? "border-coral text-ink" : "border-transparent text-ink/40 hover:text-ink"
            }`}
          >
            {t.label}
            {t.badge !== undefined && (
              <span className={`text-[9px] px-1.5 py-px ${t.key === "denuncias" && t.badge > 0 ? "bg-coral text-bone" : "bg-ink/10 text-ink/50"}`}>
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ──────────────────────────────────── */}
      {tab === "overview" && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {STATS.map((s) => (
              <div key={s.label} className="border border-ink/10 p-4 space-y-2">
                <s.icon size={16} strokeWidth={1.75} className={s.color} />
                <div className="font-display font-black text-2xl sm:text-3xl leading-none">{s.value}</div>
                <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/50">{s.label}</div>
                <div className="font-mono text-[9px] text-ink/30">{s.delta}</div>
              </div>
            ))}
          </div>

          {/* Gráfico actividade 7 dias */}
          <div className="border border-ink/10 p-5">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={14} className="text-coral" strokeWidth={2} />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/60">
                Actividade — últimos 7 dias
              </span>
            </div>
            <div className="flex items-end gap-2 h-28">
              {ACTIVITY.map((a) => (
                <div key={a.day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-coral/80 hover:bg-coral transition-colors"
                    style={{ height: `${(a.posts / maxPosts) * 100}%` }}
                    title={`${a.posts} posts`}
                  />
                  <span className="font-mono text-[9px] text-ink/40">{a.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Denúncias pendentes (mini) */}
          {activeReports.length > 0 && (
            <div className="border border-coral/20 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle size={13} className="text-coral" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-coral">
                  {activeReports.length} denúncia{activeReports.length > 1 ? "s" : ""} pendente{activeReports.length > 1 ? "s" : ""}
                </span>
                <button onClick={() => setTab("denuncias")} className="ml-auto font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40 hover:text-ink">
                  Ver todas →
                </button>
              </div>
              {activeReports.slice(0, 2).map((r) => (
                <div key={r.id} className="flex items-start gap-3 p-3 bg-ink/3 border border-ink/5">
                  <span className={`shrink-0 font-mono text-[9px] uppercase px-2 py-0.5 ${REASON_COLOR[r.reason]}`}>{r.reason}</span>
                  <p className="font-mono text-xs text-ink/60 line-clamp-1 flex-1">{r.post}</p>
                  <span className="font-mono text-[9px] text-ink/30 shrink-0">{r.ago}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── MEMBROS ──────────────────────────────────── */}
      {tab === "membros" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar membro..."
                className="w-full pl-9 pr-4 py-2.5 bg-transparent border border-ink/20 focus:border-ink font-mono text-xs focus:outline-none transition-colors"
              />
            </div>
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="appearance-none bg-bone border border-ink/20 px-4 pr-8 py-2.5 font-mono text-xs uppercase tracking-[0.15em] focus:outline-none focus:border-ink transition-colors w-full sm:w-auto"
              >
                <option value="todos">Todos</option>
                <option value="mod">Moderadores</option>
                <option value="member">Membros</option>
              </select>
              <ChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 pointer-events-none" />
            </div>
          </div>

          {/* Tabela */}
          <div className="border border-ink/10 overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-b border-ink/10 bg-ink/3">
                  {["Membro", "Função", "Estado", "Posts", "Registo", "Acções"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-mono text-[9px] uppercase tracking-[0.2em] text-ink/40">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((m) => (
                  <tr key={m.id} className={`border-b border-ink/5 hover:bg-ink/2 transition-colors ${banned.includes(m.id) ? "opacity-40" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="font-display font-semibold text-sm">{m.name}</div>
                      <div className="font-mono text-[9px] text-ink/40">{m.username}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-mono text-[9px] uppercase tracking-[0.1em] px-2 py-0.5 ${m.role === "mod" ? "bg-amber-50 text-amber-700" : "bg-ink/5 text-ink/50"}`}>
                        {m.role === "mod" ? "Moderador" : "Membro"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${m.online ? "bg-emerald-500" : "bg-ink/20"}`} />
                        <span className="font-mono text-[9px] text-ink/50">{m.online ? "Online" : "Offline"}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-ink/60">{m.posts}</td>
                    <td className="px-4 py-3 font-mono text-[10px] text-ink/40">{m.joined}</td>
                    <td className="px-4 py-3">
                      {banned.includes(m.id) ? (
                        <span className="font-mono text-[9px] text-ink/30">Banido</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setBanned((p) => [...p, m.id])}
                            className="font-mono text-[9px] uppercase tracking-[0.1em] text-coral hover:bg-coral/5 px-2 py-1 border border-coral/20 hover:border-coral transition-colors"
                          >
                            Ban
                          </button>
                          <button className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink/40 hover:text-ink px-2 py-1 border border-ink/10 hover:border-ink transition-colors">
                            <Eye size={10} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredMembers.length === 0 && (
              <div className="py-10 text-center font-mono text-xs tracking-[0.2em] uppercase text-ink/30">
                Nenhum membro encontrado
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── DENÚNCIAS ────────────────────────────────── */}
      {tab === "denuncias" && (
        <div className="space-y-3">
          {activeReports.length === 0 && (
            <div className="py-16 text-center space-y-2">
              <Check size={28} className="text-emerald-500 mx-auto" />
              <p className="font-mono text-xs tracking-[0.2em] uppercase text-ink/30">
                Sem denúncias pendentes
              </p>
            </div>
          )}
          {activeReports.map((r) => (
            <div key={r.id} className="border border-ink/10 p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-mono text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 ${REASON_COLOR[r.reason]}`}>
                    {r.reason}
                  </span>
                  <span className="font-mono text-[9px] text-ink/40">
                    #{r.id} · denunciado por {r.reporter}
                  </span>
                </div>
                <span className="font-mono text-[9px] text-ink/30 shrink-0">{r.ago}</span>
              </div>
              <div className="bg-ink/3 border border-ink/8 px-3 py-2">
                <div className="font-mono text-[9px] text-ink/40 mb-1 uppercase tracking-[0.1em]">
                  Autor: {r.author}
                </div>
                <p className="font-mono text-xs text-ink/70">{r.post}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] px-3 py-2 bg-coral text-bone border border-coral hover:bg-coral/80 transition-colors">
                  <Trash2 size={11} strokeWidth={2} /> Apagar post
                </button>
                <button
                  onClick={() => setDismissed((p) => [...p, r.id])}
                  className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] px-3 py-2 border border-ink/20 text-ink/50 hover:border-ink hover:text-ink transition-colors"
                >
                  <X size={11} strokeWidth={2} /> Ignorar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── CONTEÚDO ─────────────────────────────────── */}
      {tab === "conteudo" && (
        <div className="space-y-6">
          {/* Notícias */}
          <div className="border border-ink/10">
            <div className="flex items-center justify-between px-4 py-3 border-b border-ink/10">
              <div className="flex items-center gap-2">
                <Newspaper size={13} className="text-coral" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/60">Notícias</span>
              </div>
              <button className="font-mono text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 bg-ink text-bone hover:bg-ink/80 transition-colors">
                + Nova notícia
              </button>
            </div>
            {[
              { title: "BLACKPINK anuncia tour mundial", status: "Publicado", pinned: true },
              { title: "Stray Kids preparam novo álbum 'ATE'", status: "Publicado", pinned: false },
              { title: "Recap do Random Dance de Maio", status: "Rascunho", pinned: false },
            ].map((n) => (
              <div key={n.title} className="flex items-center justify-between gap-3 px-4 py-3 border-b border-ink/5 last:border-0 hover:bg-ink/2 transition-colors">
                <div className="flex items-center gap-2 min-w-0">
                  {n.pinned && <Megaphone size={11} className="text-coral shrink-0" />}
                  <span className="font-mono text-xs text-ink/70 truncate">{n.title}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`font-mono text-[9px] uppercase px-2 py-0.5 ${n.status === "Publicado" ? "bg-emerald-50 text-emerald-700" : "bg-ink/5 text-ink/40"}`}>
                    {n.status}
                  </span>
                  <button className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink/40 hover:text-ink border border-ink/10 hover:border-ink px-2 py-1 transition-colors">
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Eventos */}
          <div className="border border-ink/10">
            <div className="flex items-center justify-between px-4 py-3 border-b border-ink/10">
              <div className="flex items-center gap-2">
                <Calendar size={13} className="text-coral" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/60">Eventos</span>
              </div>
              <button className="font-mono text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 bg-ink text-bone hover:bg-ink/80 transition-colors">
                + Novo evento
              </button>
            </div>
            {[
              { title: "Random Dance Play — Junho",       date: "08 Jun", registered: 147, capacity: 200 },
              { title: "Cover Dance Showcase Beira",      date: "15 Jun", registered: 89,  capacity: 150 },
              { title: "Workshop Coreografia Avançada",   date: "22 Jun", registered: 31,  capacity: 40  },
            ].map((e) => (
              <div key={e.title} className="flex items-center justify-between gap-3 px-4 py-3 border-b border-ink/5 last:border-0 hover:bg-ink/2 transition-colors">
                <div className="min-w-0">
                  <div className="font-mono text-xs text-ink/70 truncate">{e.title}</div>
                  <div className="font-mono text-[9px] text-ink/30 mt-0.5">{e.date} · {e.registered}/{e.capacity} inscritos</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-16 h-1.5 bg-ink/10">
                    <div className="h-full bg-coral" style={{ width: `${(e.registered / e.capacity) * 100}%` }} />
                  </div>
                  <button className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink/40 hover:text-ink border border-ink/10 hover:border-ink px-2 py-1 transition-colors">
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Artistas */}
          <div className="border border-ink/10">
            <div className="flex items-center justify-between px-4 py-3 border-b border-ink/10">
              <div className="flex items-center gap-2">
                <Music size={13} className="text-coral" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/60">Artistas & Talentos</span>
              </div>
              <button className="font-mono text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 bg-ink text-bone hover:bg-ink/80 transition-colors">
                + Adicionar
              </button>
            </div>
            <div className="px-4 py-3 font-mono text-[10px] text-ink/30 uppercase tracking-[0.15em]">
              10 artistas · 8 talentos registados
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
