"use client";

import { useState } from "react";
import type { ElementType, FormEvent, ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth";
import {
  Users, FileText, Flag, Megaphone, TrendingUp, Calendar,
  ShieldCheck, Trash2, Check, X, Search, ChevronDown,
  AlertTriangle, Eye, Newspaper, Music, Plus, Send, ShoppingBag,
} from "lucide-react";

/* ── Mock data ──────────────────────────────────────── */
const STATS = [
  { label: "Membros", value: "8 247", delta: "+34 esta semana", icon: Users, color: "text-blue-600" },
  { label: "Posts hoje", value: "127", delta: "+18% vs ontem", icon: FileText, color: "text-emerald-600" },
  { label: "Denúncias activas", value: "4", delta: "2 novas hoje", icon: Flag, color: "text-coral" },
  { label: "Eventos activos", value: "6", delta: "3 esta semana", icon: Calendar, color: "text-amber-600" },
];

const ACTIVITY = [
  { day: "Seg", posts: 89 },
  { day: "Ter", posts: 104 },
  { day: "Qua", posts: 78 },
  { day: "Qui", posts: 143 },
  { day: "Sex", posts: 167 },
  { day: "Sáb", posts: 201 },
  { day: "Dom", posts: 127 },
];
const maxPosts = Math.max(...ACTIVITY.map((a) => a.posts));

const MOCK_MEMBERS = [
  { id: "u1", name: "Yara Mucavele", username: "@yara.dnc", role: "mod", posts: 312, joined: "Jan 2024", online: true },
  { id: "u2", name: "Eduardo Nhaca", username: "@eddu.edit", role: "member", posts: 198, joined: "Mar 2024", online: true },
  { id: "u3", name: "Tânia Cossa", username: "@tania.draws", role: "member", posts: 87, joined: "Jun 2024", online: false },
  { id: "u4", name: "Carlos Sitoe", username: "@c.sitoe", role: "member", posts: 45, joined: "Ago 2024", online: false },
  { id: "u5", name: "Fátima Nhacolo", username: "@fat.km", role: "member", posts: 231, joined: "Fev 2024", online: true },
  { id: "u6", name: "Grupo CRWN", username: "@crwn.crew", role: "mod", posts: 156, joined: "Mai 2024", online: false },
];

const MOCK_REPORTS = [
  { id: "r1", reason: "Spam", post: "Compra seguidores por 500MZN...", author: "@unknown99", reporter: "@yara.dnc", ago: "5 min" },
  { id: "r2", reason: "Assédio", post: "Comentário ofensivo num post de fanart...", author: "@troll_acc", reporter: "@tania.draws", ago: "2h" },
  { id: "r3", reason: "Conteúdo explícito", post: "Imagem inapropriada partilhada no feed...", author: "@acc123", reporter: "@eddu.edit", ago: "5h" },
  { id: "r4", reason: "Outro", post: "Informação falsa sobre concert BTS em Maputo...", author: "@fake_news", reporter: "@fat.km", ago: "1d" },
];

const INITIAL_EVENTS = [
  { id: "e1", title: "Random Dance Play — Junho", date: "08 Jun", registered: 147, capacity: 200 },
  { id: "e2", title: "Cover Dance Showcase Beira", date: "15 Jun", registered: 89, capacity: 150 },
  { id: "e3", title: "Workshop Coreografia Avançada", date: "22 Jun", registered: 31, capacity: 40 },
];

const INITIAL_ANNOUNCEMENTS = [
  { id: "a1", title: "Inscrições abertas para voluntários", audience: "Geral", status: "Publicado", pinned: true },
  { id: "a2", title: "Actualização das regras da comunidade", audience: "Geral", status: "Publicado", pinned: false },
];

const INITIAL_PRODUCTS = [
  { id: "p1", title: "Photocard Jungkook — Proof", category: "Photocards", price: "350", condition: "Novo", seller: "@yara.dnc", city: "Maputo" },
  { id: "p2", title: "Lightstick BLACKPINK 2nd Gen", category: "Lightsticks", price: "2200", condition: "Usado", seller: "@eddu.edit", city: "Beira" },
];

const REASON_COLOR: Record<string, string> = {
  "Spam": "text-amber-700 bg-amber-50",
  "Assédio": "text-coral bg-coral/10",
  "Conteúdo explícito": "text-red-700 bg-red-50",
  "Outro": "text-ink/50 bg-ink/5",
};

type Tab = "overview" | "membros" | "denuncias" | "conteudo" | "criar";
type CreateForm = "evento" | "anuncio" | "produto";

/* ── Helper components ─────────────────────────────── */
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block font-mono text-[9px] uppercase tracking-[0.2em] text-ink/40">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-transparent border border-ink/20 px-3 py-2 font-mono text-xs focus:outline-none focus:border-ink transition-colors placeholder:text-ink/25";

/* ── Componente principal ──────────────────────────── */
export default function AdminPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("todos");
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [banned, setBanned] = useState<string[]>([]);
  const [createForm, setCreateForm] = useState<CreateForm>("evento");
  const [published, setPublished] = useState(false);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  // Evento form state
  const [evTitle, setEvTitle] = useState("");
  const [evDesc, setEvDesc] = useState("");
  const [evDate, setEvDate] = useState("");
  const [evStart, setEvStart] = useState("");
  const [evEnd, setEvEnd] = useState("");
  const [evLocation, setEvLocation] = useState("");
  const [evCity, setEvCity] = useState("Maputo");
  const [evFree, setEvFree] = useState(true);
  const [evPrice, setEvPrice] = useState("");
  const [evCapacity, setEvCapacity] = useState("");

  // Anúncio form state
  const [anTitle, setAnTitle] = useState("");
  const [anBody, setAnBody] = useState("");
  const [anFandom, setAnFandom] = useState("Geral");
  const [anPin, setAnPin] = useState(false);

  // Produto form state
  const [prTitle, setPrTitle] = useState("");
  const [prPrice, setPrPrice] = useState("");
  const [prCategory, setPrCategory] = useState("Photocards");
  const [prCondition, setPrCondition] = useState("Novo");
  const [prSeller, setPrSeller] = useState("");
  const [prCity, setPrCity] = useState("Maputo");

  function openCreateForm(form: CreateForm) {
    setCreateForm(form);
    setPublished(false);
    setTab("criar");
  }

  function clearCurrentForm({ keepStatus = false }: { keepStatus?: boolean } = {}) {
    if (!keepStatus) setPublished(false);

    if (createForm === "evento") {
      setEvTitle("");
      setEvDesc("");
      setEvDate("");
      setEvStart("");
      setEvEnd("");
      setEvLocation("");
      setEvCity("Maputo");
      setEvFree(true);
      setEvPrice("");
      setEvCapacity("");
      return;
    }

    if (createForm === "anuncio") {
      setAnTitle("");
      setAnBody("");
      setAnFandom("Geral");
      setAnPin(false);
      return;
    }

    if (createForm === "produto") {
      setPrTitle("");
      setPrPrice("");
      setPrCategory("Photocards");
      setPrCondition("Novo");
      setPrSeller("");
      setPrCity("Maputo");
      return;
    }
  }

  function formatEventDate(value: string) {
    if (!value) return "A definir";

    const [, month, day] = value.split("-").map(Number);
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    return `${String(day).padStart(2, "0")} ${months[month - 1] ?? ""}`;
  }

  function handlePublish(e: FormEvent) {
    e.preventDefault();

    if (createForm === "evento") {
      const capacity = Number(evCapacity) || 100;
      setEvents((items) => [
        {
          id: `event-${Date.now()}`,
          title: evTitle.trim(),
          date: formatEventDate(evDate),
          registered: 0,
          capacity,
        },
        ...items,
      ]);
    }

    if (createForm === "anuncio") {
      setAnnouncements((items) => [
        {
          id: `announcement-${Date.now()}`,
          title: anTitle.trim(),
          audience: anFandom,
          status: "Publicado",
          pinned: anPin,
        },
        ...items,
      ]);
    }

    if (createForm === "produto") {
      setProducts((items) => [
        {
          id: `product-${Date.now()}`,
          title: prTitle.trim(),
          category: prCategory,
          price: prPrice,
          condition: prCondition,
          seller: prSeller.trim(),
          city: prCity,
        },
        ...items,
      ]);
    }

    setPublished(true);
    clearCurrentForm({ keepStatus: true });
    setTimeout(() => setPublished(false), 3000);
  }

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
    { key: "overview", label: "Visão geral" },
    { key: "membros", label: "Membros", badge: MOCK_MEMBERS.length },
    { key: "denuncias", label: "Denúncias", badge: activeReports.length },
    { key: "conteudo", label: "Conteúdo" },
    { key: "criar", label: "Criar" },
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
            className={`shrink-0 flex items-center gap-2 px-4 sm:px-5 py-3 font-mono text-[10px] sm:text-xs uppercase tracking-[0.15em] border-b-2 -mb-px transition-all ${tab === t.key ? "border-coral text-ink" : "border-transparent text-ink/40 hover:text-ink"
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

      {/* ── CRIAR ────────────────────────────────────── */}
      {tab === "criar" && (
        <div className="space-y-5">
          {/* Selector de tipo */}
          <div className="flex gap-2 flex-wrap">
            {([
              { key: "evento", label: "Evento", icon: Calendar },
              { key: "anuncio", label: "Anúncio", icon: Megaphone },
              { key: "produto", label: "Produto", icon: ShoppingBag },
            ] as { key: CreateForm; label: string; icon: ElementType }[]).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => { setCreateForm(key); setPublished(false); }}
                className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.15em] border transition-colors ${createForm === key ? "bg-ink text-bone border-ink" : "border-ink/20 text-ink/50 hover:border-ink hover:text-ink"
                  }`}
              >
                <Icon size={13} strokeWidth={1.75} />
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handlePublish} className="border border-ink/10 p-5 space-y-4">

            {/* ── Formulário Evento ── */}
            {createForm === "evento" && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={13} className="text-coral" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/60">Novo Evento</span>
                </div>
                <div className="space-y-3">
                  <Field label="Título do evento *">
                    <input required value={evTitle} onChange={e => setEvTitle(e.target.value)}
                      placeholder="ex: Random Dance Play — Julho 2025"
                      className={inputCls} />
                  </Field>
                  <Field label="Descrição">
                    <textarea rows={3} value={evDesc} onChange={e => setEvDesc(e.target.value)}
                      placeholder="Descreve o evento, programa, regras..."
                      className={`${inputCls} resize-none`} />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Field label="Data *">
                      <input required type="date" value={evDate} onChange={e => setEvDate(e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Início *">
                      <input required type="time" value={evStart} onChange={e => setEvStart(e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Fim">
                      <input type="time" value={evEnd} onChange={e => setEvEnd(e.target.value)} className={inputCls} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Local *">
                      <input required value={evLocation} onChange={e => setEvLocation(e.target.value)}
                        placeholder="ex: Jardim dos Professores" className={inputCls} />
                    </Field>
                    <Field label="Cidade *">
                      <select value={evCity} onChange={e => setEvCity(e.target.value)} className={inputCls}>
                        {["Maputo", "Matola", "Beira", "Nampula", "Online"].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Capacidade máxima">
                      <input type="number" min="1" value={evCapacity} onChange={e => setEvCapacity(e.target.value)}
                        placeholder="ex: 200" className={inputCls} />
                    </Field>
                    <Field label="Entrada">
                      <div className="flex gap-3 items-center h-[38px]">
                        <label className="flex items-center gap-1.5 font-mono text-xs text-ink/60 cursor-pointer">
                          <input type="radio" checked={evFree} onChange={() => setEvFree(true)} className="accent-coral" />
                          Gratuita
                        </label>
                        <label className="flex items-center gap-1.5 font-mono text-xs text-ink/60 cursor-pointer">
                          <input type="radio" checked={!evFree} onChange={() => setEvFree(false)} className="accent-coral" />
                          Paga
                        </label>
                        {!evFree && (
                          <input type="number" min="1" value={evPrice} onChange={e => setEvPrice(e.target.value)}
                            placeholder="MZN" className={`${inputCls} w-24`} />
                        )}
                      </div>
                    </Field>
                  </div>
                </div>
              </>
            )}

            {/* ── Formulário Anúncio ── */}
            {createForm === "anuncio" && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <Megaphone size={13} className="text-coral" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/60">Novo Anúncio</span>
                </div>
                <div className="space-y-3">
                  <Field label="Título *">
                    <input required value={anTitle} onChange={e => setAnTitle(e.target.value)}
                      placeholder="ex: Resultado do concurso de fanart"
                      className={inputCls} />
                  </Field>
                  <Field label="Mensagem *">
                    <textarea required rows={5} value={anBody} onChange={e => setAnBody(e.target.value)}
                      placeholder="Escreve o conteúdo do anúncio..."
                      className={`${inputCls} resize-none`} />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Fandom / Audiência">
                      <select value={anFandom} onChange={e => setAnFandom(e.target.value)} className={inputCls}>
                        {["Geral", "ARMY", "BLINK", "ONCE", "STAY", "ORBIT", "ELF", "EXO-L"].map(f => <option key={f}>{f}</option>)}
                      </select>
                    </Field>
                    <Field label="Opções">
                      <div className="flex items-center gap-2 h-[38px]">
                        <label className="flex items-center gap-1.5 font-mono text-xs text-ink/60 cursor-pointer">
                          <input type="checkbox" checked={anPin} onChange={e => setAnPin(e.target.checked)} className="accent-coral" />
                          Fixar no topo do feed
                        </label>
                      </div>
                    </Field>
                  </div>
                </div>
              </>
            )}

            {/* ── Formulário Produto ── */}
            {createForm === "produto" && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingBag size={13} className="text-coral" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/60">Novo Produto — Marketplace</span>
                </div>
                <div className="space-y-3">
                  <Field label="Título do produto *">
                    <input required value={prTitle} onChange={e => setPrTitle(e.target.value)}
                      placeholder="ex: Photocard Jungkook — Proof" className={inputCls} />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Field label="Preço (MZN) *">
                      <input required type="number" min="1" value={prPrice} onChange={e => setPrPrice(e.target.value)}
                        placeholder="ex: 500" className={inputCls} />
                    </Field>
                    <Field label="Categoria *">
                      <select value={prCategory} onChange={e => setPrCategory(e.target.value)} className={inputCls}>
                        {["Photocards", "Lightsticks", "Álbuns", "Posters", "Roupa", "Acessórios"].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </Field>
                    <Field label="Condição *">
                      <select value={prCondition} onChange={e => setPrCondition(e.target.value)} className={inputCls}>
                        {["Novo", "Usado", "Personalizado"].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Vendedor (username) *">
                      <input required value={prSeller} onChange={e => setPrSeller(e.target.value)}
                        placeholder="ex: @yara.dnc" className={inputCls} />
                    </Field>
                    <Field label="Cidade *">
                      <select value={prCity} onChange={e => setPrCity(e.target.value)} className={inputCls}>
                        {["Maputo", "Matola", "Beira", "Nampula", "Online"].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </Field>
                  </div>
                </div>
              </>
            )}

            {/* Acções */}
            <div className="flex items-center justify-between pt-2 border-t border-ink/10">
              <button type="button" onClick={() => clearCurrentForm()}
                className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40 hover:text-ink transition-colors">
                Limpar
              </button>
              <button
                type="submit"
                className={`flex items-center gap-2 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.15em] transition-all ${published
                  ? "bg-emerald-500 text-bone border border-emerald-500"
                  : "bg-ink text-bone hover:bg-ink/80 border border-ink"
                  }`}
              >
                {published ? (
                  <><Check size={13} strokeWidth={2.5} /> Publicado!</>
                ) : (
                  <><Send size={13} strokeWidth={1.75} /> Publicar</>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── CONTEÚDO ─────────────────────────────────── */}
      {tab === "conteudo" && (
        <div className="space-y-6">
          {/* Anúncios */}
          <div className="border border-ink/10">
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-ink/10">
              <div className="flex items-center gap-2">
                <Megaphone size={13} className="text-coral" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/60">Anúncios</span>
              </div>
              <button
                onClick={() => openCreateForm("anuncio")}
                className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 bg-ink text-bone hover:bg-ink/80 transition-colors"
              >
                <Plus size={11} strokeWidth={2.25} /> Novo anúncio
              </button>
            </div>
            {announcements.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 px-4 py-3 border-b border-ink/5 last:border-0 hover:bg-ink/2 transition-colors">
                <div className="flex items-center gap-2 min-w-0">
                  {a.pinned && <Megaphone size={11} className="text-coral shrink-0" />}
                  <div className="min-w-0">
                    <div className="font-mono text-xs text-ink/70 truncate">{a.title}</div>
                    <div className="font-mono text-[9px] text-ink/30 mt-0.5">{a.audience}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-[9px] uppercase px-2 py-0.5 bg-emerald-50 text-emerald-700">
                    {a.status}
                  </span>
                  <button className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink/40 hover:text-ink border border-ink/10 hover:border-ink px-2 py-1 transition-colors">
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Notícias */}
          <div className="border border-ink/10">
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-ink/10">
              <div className="flex items-center gap-2">
                <Newspaper size={13} className="text-coral" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/60">Notícias</span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-ink/35">
                Curadoria editorial
              </span>
            </div>
            <div className="px-4 py-4">
              <div className="font-display font-semibold text-sm">
                As notícias são geridas pela equipa editorial da KM.
              </div>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink/35">
                Para publicar ou remover uma notícia, contacta a equipa editorial directamente.
              </p>
            </div>
          </div>

          {/* Eventos */}
          <div className="border border-ink/10">
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-ink/10">
              <div className="flex items-center gap-2">
                <Calendar size={13} className="text-coral" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/60">Eventos</span>
              </div>
              <button
                onClick={() => openCreateForm("evento")}
                className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 bg-ink text-bone hover:bg-ink/80 transition-colors"
              >
                <Plus size={11} strokeWidth={2.25} /> Novo evento
              </button>
            </div>
            {events.map((e) => (
              <div key={e.id} className="flex items-center justify-between gap-3 px-4 py-3 border-b border-ink/5 last:border-0 hover:bg-ink/2 transition-colors">
                <div className="min-w-0">
                  <div className="font-mono text-xs text-ink/70 truncate">{e.title}</div>
                  <div className="font-mono text-[9px] text-ink/30 mt-0.5">{e.date} · {e.registered}/{e.capacity} inscritos</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-16 h-1.5 bg-ink/10">
                    <div className="h-full bg-coral" style={{ width: `${Math.min((e.registered / e.capacity) * 100, 100)}%` }} />
                  </div>
                  <button className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink/40 hover:text-ink border border-ink/10 hover:border-ink px-2 py-1 transition-colors">
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Marketplace */}
          <div className="border border-ink/10">
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-ink/10">
              <div className="flex items-center gap-2">
                <ShoppingBag size={13} className="text-coral" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/60">Marketplace</span>
              </div>
              <button
                onClick={() => openCreateForm("produto")}
                className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 bg-ink text-bone hover:bg-ink/80 transition-colors"
              >
                <Plus size={11} strokeWidth={2.25} /> Novo produto
              </button>
            </div>
            {products.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 px-4 py-3 border-b border-ink/5 last:border-0 hover:bg-ink/2 transition-colors">
                <div className="min-w-0">
                  <div className="font-mono text-xs text-ink/70 truncate">{p.title}</div>
                  <div className="font-mono text-[9px] text-ink/30 mt-0.5">
                    {p.category} · {p.condition} · {p.price} MZN · {p.seller} · {p.city}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink/40 hover:text-ink border border-ink/10 hover:border-ink px-2 py-1 transition-colors">
                    Editar
                  </button>
                  <button
                    onClick={() => setProducts((items) => items.filter((x) => x.id !== p.id))}
                    className="font-mono text-[9px] uppercase tracking-[0.1em] text-coral/60 hover:text-coral border border-coral/10 hover:border-coral px-2 py-1 transition-colors"
                  >
                    <Trash2 size={10} />
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
