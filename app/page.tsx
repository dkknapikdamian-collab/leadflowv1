"use client"

import { useMemo, useState } from "react"

type Tab = "today" | "tasks" | "calendar" | "leads"
type LeadStatus = "new" | "waiting" | "followup_today" | "interested" | "replied" | "won"
type SectionKey = "all" | "meetings" | "overdue" | "today" | "noContact"

type Lead = { id: number; name: string; company: string; source: string; status: LeadStatus; value: number }
type Activity = { id: number; leadId: number; type: "task" | "follow_up" | "meeting" | "call" | "reminder"; title: string; at: string; status: "pending" | "done" }

const TODAY = "2026-04-04"
const leads: Lead[] = [
  { id: 1, name: "Marcin Kowalski", company: "TechFlow Sp. z o.o.", source: "LinkedIn", status: "followup_today", value: 8500 },
  { id: 2, name: "Ania Nowak", company: "Nowak Design Studio", source: "Polecenie", status: "interested", value: 3200 },
  { id: 3, name: "Piotr Zając", company: "Zając Consulting", source: "Strona www", status: "waiting", value: 5000 },
  { id: 4, name: "Karolina Wiśniewska", company: "Wiśniewska PR", source: "LinkedIn", status: "new", value: 2800 },
  { id: 5, name: "Tomasz Błaszczyk", company: "Błaszczyk IT Solutions", source: "Cold outreach", status: "new", value: 12000 },
  { id: 6, name: "Monika Jabłońska", company: "Jabłońska Finanse", source: "Polecenie", status: "replied", value: 1500 },
  { id: 7, name: "Agata Szymańska", company: "Szymańska Legal", source: "Strona www", status: "won", value: 6500 },
  { id: 8, name: "Sylwia Kowalczyk", company: "Kowalczyk E-commerce", source: "Polecenie", status: "interested", value: 9500 }
]
const acts: Activity[] = [
  { id: 1, leadId: 1, type: "follow_up", title: "Odpisać na wiadomość Marcina", at: "2026-04-04T11:00", status: "pending" },
  { id: 2, leadId: 2, type: "task", title: "Przygotować brief rebrandingowy", at: "2026-04-04T09:00", status: "pending" },
  { id: 3, leadId: 3, type: "reminder", title: "Zadzwonić w sprawie oferty", at: "2026-04-03T10:00", status: "pending" },
  { id: 4, leadId: 5, type: "call", title: "Rozmowa wstępna — Tomasz", at: "2026-04-04T15:00", status: "pending" },
  { id: 5, leadId: 8, type: "follow_up", title: "Wysłać case studies Google Ads", at: "2026-04-02T12:00", status: "pending" },
  { id: 6, leadId: 7, type: "task", title: "Wysłać umowę do podpisu", at: "2026-04-02T09:00", status: "done" }
]

const statusMeta: Record<LeadStatus, { label: string; color: string; bg: string }> = {
  new: { label: "Nowy", color: "#60a5fa", bg: "rgba(96,165,250,.12)" },
  waiting: { label: "Czeka", color: "#fbbf24", bg: "rgba(251,191,36,.12)" },
  followup_today: { label: "Follow-up dziś", color: "#f87171", bg: "rgba(248,113,113,.12)" },
  interested: { label: "Zainteresowany", color: "#34d399", bg: "rgba(52,211,153,.12)" },
  replied: { label: "Odpisane", color: "#a78bfa", bg: "rgba(167,139,250,.12)" },
  won: { label: "Wygrany", color: "#4ade80", bg: "rgba(74,222,128,.12)" }
}

const sectionMeta = {
  all: { title: "Wszystkie leady", color: "#f1eee8" },
  meetings: { title: "Spotkania i rozmowy dziś", color: "#a78bfa" },
  overdue: { title: "Zaległe — wymagają działania", color: "#ff6b6b" },
  today: { title: "Do zrobienia dziś", color: "#f59e0b" },
  noContact: { title: "Bez kontaktu 5+ dni", color: "#7b8190" }
}

export default function HomePage() {
  const [tab, setTab] = useState<Tab>("today")
  const [scale, setScale] = useState<"small" | "medium" | "large">("small")
  const [manual, setManual] = useState<Record<SectionKey, boolean>>({ all: true, meetings: true, overdue: true, today: true, noContact: true })
  const [promoted, setPromoted] = useState<SectionKey | null>(null)

  const leadMap = useMemo(() => new Map(leads.map((lead) => [lead.id, lead])), [])
  const meetings = acts.filter((a) => a.status === "pending" && a.at.startsWith(TODAY) && (a.type === "meeting" || a.type === "call"))
  const overdue = acts.filter((a) => a.status === "pending" && a.at.slice(0, 10) < TODAY)
  const today = acts.filter((a) => a.status === "pending" && a.at.startsWith(TODAY))
  const noContact = leads.filter((lead) => lead.status !== "won")
  const sections: Record<SectionKey, Lead[] | Activity[]> = { all: leads, meetings, overdue, today, noContact }
  const order = promoted ? [promoted, "all", "meetings", "overdue", "today", "noContact"].filter((value, index, arr) => arr.indexOf(value) === index) as SectionKey[] : ["all", "meetings", "overdue", "today", "noContact"]

  function showSection(section: SectionKey) {
    setPromoted(section)
    setManual((current) => ({ ...current, [section]: true }))
  }

  return (
    <main className={scale}>
      <div className="shell">
        <aside className="side">
          <div>
            <div className="brand">Lead<span>Desk</span></div>
            <div className="sub">SOLO CRM</div>
          </div>

          <nav className="nav">
            <button className={tab === "today" ? "active" : ""} onClick={() => setTab("today")}>◈ Dzisiaj</button>
            <button className={tab === "tasks" ? "active" : ""} onClick={() => setTab("tasks")}>☑ Zadania</button>
            <button className={tab === "calendar" ? "active" : ""} onClick={() => setTab("calendar")}>⊞ Kalendarz</button>
            <button className={tab === "leads" ? "active" : ""} onClick={() => setTab("leads")}>◉ Leady</button>
          </nav>

          <div className="bottom">
            <div className="scale">
              <button className={scale === "small" ? "chip active" : "chip"} onClick={() => setScale("small")}>Mała</button>
              <button className={scale === "medium" ? "chip active" : "chip"} onClick={() => setScale("medium")}>Średnia</button>
              <button className={scale === "large" ? "chip active" : "chip"} onClick={() => setScale("large")}>Duża</button>
            </div>
          </div>
        </aside>

        <section className="content">
          {tab === "today" && (
            <>
              <div className="head"><h1>Dzisiaj</h1><p>sobota, 4 kwietnia 2026</p></div>

              <div className="stats">
                <TopCard title="Wszystkie leady" value={leads.length} color="#f1eee8" onClick={() => showSection("all")} />
                <TopCard title="Zadania dziś" value={today.length} color="#f59e0b" onClick={() => showSection("today")} />
                <TopCard title="Zaległe" value={overdue.length} color="#ff6b6b" onClick={() => showSection("overdue")} />
                <TopCard title="Spotkania dziś" value={meetings.length} color="#a78bfa" onClick={() => showSection("meetings")} />
                <TopCard title="Bez kontaktu" value={noContact.length} color="#7b8190" onClick={() => showSection("noContact")} />
              </div>

              <div className="sections">
                {order.map((key) => (
                  <div className="section" key={key}>
                    <button className="section-head" onClick={() => setManual((current) => ({ ...current, [key]: !current[key] }))}>
                      <div className="section-title" style={{ color: sectionMeta[key].color }}>{sectionMeta[key].title}</div>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <span className="count" style={{ color: sectionMeta[key].color }}>{sections[key].length}</span>
                        <span className="sub">{manual[key] ? "Zwiń" : "Rozwiń"}</span>
                      </div>
                    </button>
                    {manual[key] && (
                      <div className="rows">
                        {key === "all" || key === "noContact"
                          ? (sections[key] as Lead[]).map((lead) => <LeadMini key={lead.id} lead={lead} />)
                          : (sections[key] as Activity[]).map((act) => <ActRow key={act.id} act={act} lead={leadMap.get(act.leadId)} />)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === "leads" && (
            <>
              <div className="head"><h1>Leady</h1><p>Widok tabeli do oceny na Vercel.</p></div>
              <div className="table">
                <div className="thead"><div>Klient</div><div>Status</div><div>Źródło</div><div>Wartość</div><div>Aktywne zadania</div></div>
                {leads.map((lead) => {
                  const active = acts.filter((a) => a.leadId === lead.id && a.status === "pending")
                  const over = active.filter((a) => a.at.slice(0, 10) < TODAY).length
                  return (
                    <div className="tr" key={lead.id}>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}><Avatar name={lead.name} /><div><div className="title">{lead.name}</div><div className="sub">{lead.company}</div></div></div>
                      <div><StatusBadge status={lead.status} /></div>
                      <div className="sub">{lead.source}</div>
                      <div className="value">{lead.value.toLocaleString("pl-PL")} zł</div>
                      <div className="sub">{active.length ? `${active.length}${over ? ` (${over}↑)` : ""}` : "—"}</div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {tab === "tasks" && <div className="panel">{acts.filter((a) => a.status === "pending").map((act) => <ActRow key={act.id} act={act} lead={leadMap.get(act.leadId)} />)}</div>}
          {tab === "calendar" && <div className="panel"><div className="row"><div className="grow"><div className="title">Kalendarz</div><div className="sub">Na teraz wrzuciłem lekki placeholder pod review online.</div></div></div></div>}
        </section>
      </div>
    </main>
  )
}

function TopCard({ title, value, color, onClick }: { title: string; value: number; color: string; onClick: () => void }) {
  return <button className="card" onClick={onClick}><div className="k" style={{ color }}>{title}</div><div className="v" style={{ color }}>{value}</div></button>
}

function LeadMini({ lead }: { lead: Lead }) {
  return <div className="row"><Avatar name={lead.name} /><div className="grow"><div className="title">{lead.name}</div><div className="sub">{lead.company}</div></div><StatusBadge status={lead.status} /></div>
}

function ActRow({ act, lead }: { act: Activity; lead?: Lead }) {
  const icon = act.type === "call" ? "◎" : act.type === "follow_up" ? "↩" : act.type === "reminder" ? "◷" : "☑"
  const color = act.type === "call" ? "#36c98d" : act.type === "follow_up" ? "#f59e0b" : act.type === "reminder" ? "#ff6b6b" : "#4da3ff"
  const date = act.at.slice(0, 10)
  const time = act.at.slice(11, 16)
  const label = date === TODAY ? `dziś ${time}` : date === "2026-04-03" ? `wczoraj ${time}` : `2 dni temu ${time}`
  return <div className="row"><div className="grow"><div className="title"><span style={{ color }}>{icon}</span> {act.title}</div><div className="sub">{label}{lead ? ` · ${lead.name}` : ""}</div></div>{date < TODAY ? <div style={{ color: "#ff6b6b", fontWeight: 700 }}>ZALEGŁE</div> : null}</div>
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").slice(0, 2).map((part) => part[0]).join("")
  return <span className="avatar">{initials}</span>
}

function StatusBadge({ status }: { status: LeadStatus }) {
  const meta = statusMeta[status]
  return <span className="badge" style={{ color: meta.color, background: meta.bg }}>{meta.label}</span>
}
