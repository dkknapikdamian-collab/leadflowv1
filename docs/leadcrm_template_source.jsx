import { useState, useMemo } from "react"

const C = {
  bg:'#0d0d0d', sidebar:'#141414', card:'#1a1a1a', cardHover:'#202020',
  border:'#252525', borderLight:'#303030', accent:'#f59e0b', accentDim:'rgba(245,158,11,0.11)',
  t1:'#f0ede8', t2:'#9a9690', t3:'#555250',
  success:'#4ade80', danger:'#f87171', info:'#60a5fa', purple:'#a78bfa',
}

const STATUS = {
  new:{label:'Nowy',color:'#60a5fa',bg:'rgba(96,165,250,0.11)'},
  replied:{label:'Odpisane',color:'#a78bfa',bg:'rgba(167,139,250,0.11)'},
  waiting:{label:'Czeka',color:'#fbbf24',bg:'rgba(251,191,36,0.11)'},
  followup_today:{label:'Follow-up dziś',color:'#f87171',bg:'rgba(248,113,113,0.11)'},
  interested:{label:'Zainteresowany',color:'#34d399',bg:'rgba(52,211,153,0.11)'},
  won:{label:'Wygrany',color:'#4ade80',bg:'rgba(74,222,128,0.11)'},
  lost:{label:'Przegrany',color:'#6b7280',bg:'rgba(107,114,128,0.11)'},
}

const ATYPE = {
  task:{label:'Zadanie',icon:'☑',color:'#60a5fa'},
  follow_up:{label:'Follow-up',icon:'↩',color:'#f59e0b'},
  meeting:{label:'Spotkanie',icon:'⊞',color:'#a78bfa'},
  call:{label:'Rozmowa',icon:'◎',color:'#34d399'},
  email:{label:'E-mail',icon:'✉',color:'#60a5fa'},
  reminder:{label:'Przypomnienie',icon:'◷',color:'#f87171'},
  note:{label:'Notatka',icon:'✎',color:'#6b7280'},
}

const PRIORITY = {
  high:{label:'Wysoki',color:'#f87171'},
  medium:{label:'Średni',color:'#fbbf24'},
  low:{label:'Niski',color:'#6b7280'},
}

let _id = 200
const uid = () => ++_id

const TODAY = new Date().toISOString().slice(0,10)
const addDays = (n) => new Date(new Date(TODAY).getTime()+n*86400000).toISOString().slice(0,10)
const D = { m2:addDays(-2), m1:addDays(-1), d0:TODAY, p1:addDays(1), p2:addDays(2), p3:addDays(3) }

const fmtDate = d => {
  if(!d) return '—'
  const s=d.slice(0,10)
  if(s===D.d0) return 'dziś'
  if(s===D.m1) return 'wczoraj'
  if(s===D.p1) return 'jutro'
  const diff=Math.round((new Date(s)-new Date(TODAY))/86400000)
  if(diff<0) return `${-diff} dni temu`
  return s
}
const fmtTime = iso => iso?.slice(11,16)||''
const initials = n => n.split(' ').slice(0,2).map(x=>x[0]).join('')
const isOverdue = a => { const d=aDate(a); return a.status==='pending'&&d&&d.slice(0,10)<TODAY }
const isToday = a => { const d=aDate(a); return d&&d.slice(0,10)===TODAY }
const isTomorrow = a => { const d=aDate(a); return d&&d.slice(0,10)===D.p1 }
const aDate = a => a.start_at||a.due_at

const LEADS_INIT = [
  {id:1,name:'Marcin Kowalski',company:'TechFlow Sp. z o.o.',email:'marcin@techflow.pl',phone:'+48 600 123 456',source:'LinkedIn',status:'followup_today',priority:'high',value:8500,notes:'Zainteresowany pakietem Enterprise. Czeka na ofertę.'},
  {id:2,name:'Ania Nowak',company:'Nowak Design Studio',email:'ania@nowakdesign.pl',phone:'+48 512 987 654',source:'Polecenie',status:'interested',priority:'high',value:3200,notes:'Polecona przez Pawła. Szuka rebrandingu.'},
  {id:3,name:'Piotr Zając',company:'Zając Consulting',email:'piotr@zajac.pl',phone:'+48 601 555 321',source:'Strona www',status:'waiting',priority:'medium',value:5000,notes:'Wysłałem ofertę. Czeka na decyzję zarządu.'},
  {id:4,name:'Karolina Wiśniewska',company:'Wiśniewska PR',email:'karolina@wisniewska.pl',phone:'+48 798 111 222',source:'LinkedIn',status:'new',priority:'medium',value:2800,notes:'Wstępne zainteresowanie social media.'},
  {id:5,name:'Tomasz Błaszczyk',company:'Błaszczyk IT Solutions',email:'tomasz@blaszczyk.pl',phone:'+48 501 777 888',source:'Cold outreach',status:'new',priority:'high',value:12000,notes:'Duży projekt migracji danych. Kluczowy lead miesiąca.'},
  {id:6,name:'Monika Jabłońska',company:'Jabłońska Finanse',email:'monika@jablonska.pl',phone:'+48 609 444 555',source:'Polecenie',status:'replied',priority:'low',value:1500,notes:'Odpisała na maila. Chce demo w przyszłym tygodniu.'},
  {id:7,name:'Agata Szymańska',company:'Szymańska Legal',email:'agata@szymanska.pl',phone:'+48 511 888 999',source:'Strona www',status:'won',priority:'high',value:6500,notes:'Podpisana umowa! Projekt startuje 15.04.'},
  {id:8,name:'Sylwia Kowalczyk',company:'Kowalczyk E-commerce',email:'sylwia@kowalczyk.pl',phone:'+48 505 333 444',source:'Polecenie',status:'interested',priority:'high',value:9500,notes:'Szuka agencji do Google Ads.'},
]

const ACTS_INIT = [
  {id:uid(),lead_id:1,type:'follow_up',title:'Odpisać na wiadomość Marcina',description:'Czeka na szczegóły oferty Enterprise',due_at:`${D.d0}T11:00`,start_at:null,end_at:null,status:'pending',priority:'high',show_in_tasks:true,show_in_calendar:true,completed_at:null,created_at:`${D.m2}T08:00`},
  {id:uid(),lead_id:1,type:'meeting',title:'Demo systemu — Marcin',description:'Google Meet, link wysłany mailem',due_at:null,start_at:`${D.p1}T14:00`,end_at:`${D.p1}T14:30`,status:'pending',priority:'high',show_in_tasks:true,show_in_calendar:true,completed_at:null,created_at:`${D.m1}T09:00`},
  {id:uid(),lead_id:2,type:'task',title:'Przygotować brief rebrandingowy',description:'Na podstawie rozmowy z Anią',due_at:`${D.d0}T09:00`,start_at:null,end_at:null,status:'pending',priority:'high',show_in_tasks:true,show_in_calendar:false,completed_at:null,created_at:`${D.m1}T10:00`},
  {id:uid(),lead_id:3,type:'reminder',title:'Zadzwonić w sprawie oferty',description:'Oferta wysłana 2 tygodnie temu — brak odpowiedzi',due_at:`${D.m1}T10:00`,start_at:null,end_at:null,status:'pending',priority:'medium',show_in_tasks:true,show_in_calendar:true,completed_at:null,created_at:`${D.m2}T08:00`},
  {id:uid(),lead_id:4,type:'email',title:'Wysłać propozycję social media',description:'Kwartalna oferta + case studies',due_at:`${D.p1}T16:00`,start_at:null,end_at:null,status:'pending',priority:'medium',show_in_tasks:true,show_in_calendar:false,completed_at:null,created_at:`${D.d0}T08:00`},
  {id:uid(),lead_id:5,type:'call',title:'Rozmowa wstępna — Tomasz',description:'Omówić zakres projektu migracji',due_at:null,start_at:`${D.d0}T15:00`,end_at:`${D.d0}T15:30`,status:'pending',priority:'high',show_in_tasks:true,show_in_calendar:true,completed_at:null,created_at:`${D.m1}T08:00`},
  {id:uid(),lead_id:6,type:'meeting',title:'Demo dla Moniki',description:'Prezentacja panelu klienta',due_at:null,start_at:`${D.p2}T11:00`,end_at:`${D.p2}T11:30`,status:'pending',priority:'medium',show_in_tasks:true,show_in_calendar:true,completed_at:null,created_at:`${D.d0}T08:00`},
  {id:uid(),lead_id:8,type:'follow_up',title:'Wysłać case studies Google Ads',description:'Obiecałem po wczorajszej rozmowie',due_at:`${D.m2}T12:00`,start_at:null,end_at:null,status:'pending',priority:'high',show_in_tasks:true,show_in_calendar:true,completed_at:null,created_at:`${D.m2}T08:00`},
  {id:uid(),lead_id:2,type:'note',title:'Notatka ze spotkania',description:'Ania: nowe logo, kolory marki, strona www. Budżet ~3k zł.',due_at:null,start_at:null,end_at:null,status:'done',priority:'low',show_in_tasks:false,show_in_calendar:false,completed_at:`${D.m1}T10:00`,created_at:`${D.m1}T10:00`},
  {id:uid(),lead_id:7,type:'task',title:'Wysłać umowę do podpisu',description:'',due_at:`${D.m2}T09:00`,start_at:null,end_at:null,status:'done',priority:'high',show_in_tasks:true,show_in_calendar:false,completed_at:`${D.m2}T10:00`,created_at:`${D.m2}T08:00`},
  {id:uid(),lead_id:5,type:'follow_up',title:'Potwierdzić termin rozmowy',description:'',due_at:`${D.p3}T10:00`,start_at:null,end_at:null,status:'pending',priority:'medium',show_in_tasks:true,show_in_calendar:true,completed_at:null,created_at:`${D.d0}T08:00`},
]

// ─── tiny components ──────────────────────────────────────────────────────────
function Avatar({name,size=34}) {
  const bg=['#1d4ed8','#7c3aed','#0891b2','#b45309','#047857']
  return <div style={{width:size,height:size,borderRadius:'50%',background:bg[name.charCodeAt(0)%bg.length],display:'flex',alignItems:'center',justifyContent:'center',fontSize:size*.34,fontWeight:600,color:'#fff',flexShrink:0,letterSpacing:'.04em'}}>{initials(name)}</div>
}
function StatusBadge({status,small}) {
  const st=STATUS[status]||STATUS.new
  return <span style={{background:st.bg,color:st.color,borderRadius:6,padding:small?'2px 7px':'3px 9px',fontSize:small?11:12,fontWeight:500,whiteSpace:'nowrap'}}>{st.label}</span>
}
function PriDot({p}) {
  return <span style={{width:6,height:6,borderRadius:'50%',background:PRIORITY[p]?.color||'#6b7280',display:'inline-block',marginRight:5,flexShrink:0}}/>
}
function NavItem({icon,label,active,onClick,badge}) {
  return (
    <button onClick={onClick} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:7,background:active?C.accentDim:'none',border:active?'1px solid rgba(245,158,11,0.2)':'1px solid transparent',color:active?C.accent:C.t2,cursor:'pointer',width:'100%',textAlign:'left',fontSize:13,fontWeight:active?600:400,transition:'all .12s'}}>
      <span style={{fontSize:14,opacity:active?1:.5}}>{icon}</span><span>{label}</span>
      {badge>0&&<span style={{marginLeft:'auto',background:C.danger,color:'#fff',borderRadius:20,padding:'1px 7px',fontSize:10,fontWeight:700}}>{badge}</span>}
    </button>
  )
}
function Lbl({children}) { return <div style={{fontSize:11,color:C.t3,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:5}}>{children}</div> }
function Field({label,children}) { return <div style={{display:'flex',flexDirection:'column',gap:4}}><Lbl>{label}</Lbl>{children}</div> }
function Inp(props) { return <input {...props} style={{width:'100%',background:C.card,border:`1px solid ${C.border}`,color:C.t1,borderRadius:7,padding:'9px 11px',fontSize:13,outline:'none',fontFamily:'inherit',boxSizing:'border-box',...props.style}}/> }
function Sel({value,onChange,children,style}) { return <select value={value} onChange={onChange} style={{background:C.card,border:`1px solid ${C.border}`,color:C.t1,borderRadius:7,padding:'8px 10px',fontSize:13,cursor:'pointer',...style}}>{children}</select> }

// ─── ActivityCard ─────────────────────────────────────────────────────────────
function ACard({a,lead,onToggle,onClick,compact}) {
  const [hov,setHov]=useState(false)
  const at=ATYPE[a.type]||ATYPE.task
  const ov=isOverdue(a), done=a.status==='done'
  const d=aDate(a)
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{display:'flex',alignItems:'flex-start',gap:10,padding:compact?'9px 12px':'12px 14px',background:hov?C.cardHover:C.card,border:`1px solid ${ov&&!done?'rgba(248,113,113,.3)':hov?C.borderLight:C.border}`,borderRadius:8,transition:'all .1s',opacity:done?.5:1}}>
      {onToggle&&<button onClick={e=>{e.stopPropagation();onToggle(a.id)}} style={{width:17,height:17,borderRadius:4,border:`1.5px solid ${done?C.success:C.borderLight}`,background:done?C.success:'none',flexShrink:0,cursor:'pointer',marginTop:2,display:'flex',alignItems:'center',justifyContent:'center',color:'#000',fontSize:10,fontWeight:700,padding:0}}>{done&&'✓'}</button>}
      <div style={{flex:1,minWidth:0,cursor:onClick?'pointer':'default'}} onClick={onClick}>
        <div style={{display:'flex',alignItems:'center',gap:7,flexWrap:'wrap'}}>
          <span style={{color:at.color,fontSize:12,flexShrink:0}}>{at.icon}</span>
          <span style={{fontSize:13,fontWeight:500,color:done?C.t3:C.t1,textDecoration:done?'line-through':'none',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1}}>{a.title}</span>
          {ov&&!done&&<span style={{fontSize:10,color:C.danger,fontWeight:600,flexShrink:0}}>ZALEGŁE</span>}
        </div>
        {!compact&&a.description&&<div style={{fontSize:12,color:C.t3,marginTop:3,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.description}</div>}
        <div style={{display:'flex',alignItems:'center',gap:8,marginTop:3}}>
          {d&&<span style={{fontSize:11,color:ov&&!done?C.danger:C.t3}}>{fmtDate(d.slice(0,10))}{fmtTime(d)?' '+fmtTime(d):''}</span>}
          {lead&&<span style={{fontSize:11,color:C.info}}>· {lead.name}</span>}
        </div>
      </div>
    </div>
  )
}

function SecHead({title,accent,count}) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
      <div style={{width:3,height:13,background:accent,borderRadius:2}}/>
      <span style={{fontSize:12,fontWeight:600,color:C.t1,textTransform:'uppercase',letterSpacing:'.07em'}}>{title}</span>
      {count>0&&<span style={{fontSize:10,color:accent,background:accent+'22',padding:'1px 7px',borderRadius:20,fontWeight:700}}>{count}</span>}
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function DashboardView({leads,acts,onSelLead}) {
  const todayA=acts.filter(a=>a.show_in_tasks&&a.status==='pending'&&isToday(a))
  const overdueA=acts.filter(a=>a.show_in_tasks&&isOverdue(a))
  const todayMeet=acts.filter(a=>a.show_in_calendar&&(a.type==='meeting'||a.type==='call')&&isToday(a)&&a.status==='pending')
  const noContact=leads.filter(l=>{
    if(l.status==='won'||l.status==='lost') return false
    const doneActs=acts.filter(a=>a.lead_id===l.id&&a.status==='done')
    if(!doneActs.length) return true
    const last=doneActs.map(a=>aDate(a)||a.created_at).filter(Boolean).sort().pop()
    return !last||Math.floor((new Date()-new Date(last))/86400000)>=5
  })
  const stats=[{l:'Wszystkie leady',v:leads.length,c:C.t1},{l:'Zadania dziś',v:todayA.length,c:C.danger},{l:'Zaległe',v:overdueA.length,c:'#fbbf24'},{l:'Spotkania dziś',v:todayMeet.length,c:C.purple}]
  return (
    <div style={{flex:1,overflowY:'auto',padding:'28px 32px'}}>
      <div style={{marginBottom:28}}>
        <div style={{fontSize:22,fontWeight:700,color:C.t1,letterSpacing:'-.02em'}}>Dzisiaj</div>
        <div style={{fontSize:13,color:C.t2,marginTop:4}}>{new Date().toLocaleDateString('pl-PL',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:30}}>
        {stats.map((s,i)=>(
          <div key={i} style={{background:C.card,borderRadius:10,padding:'16px 18px',border:`1px solid ${C.border}`}}>
            <div style={{fontSize:11,color:C.t3,marginBottom:8,textTransform:'uppercase',letterSpacing:'.06em'}}>{s.l}</div>
            <div style={{fontSize:28,fontWeight:700,color:s.c,letterSpacing:'-.03em'}}>{s.v}</div>
          </div>
        ))}
      </div>
      {todayMeet.length>0&&<section style={{marginBottom:22}}><SecHead title="Spotkania i rozmowy dziś" accent={C.purple} count={todayMeet.length}/><div style={{display:'flex',flexDirection:'column',gap:6}}>{todayMeet.map(a=><ACard key={a.id} a={a} lead={leads.find(l=>l.id===a.lead_id)} compact/>)}</div></section>}
      {overdueA.length>0&&<section style={{marginBottom:22}}><SecHead title="Zaległe — wymagają działania" accent={C.danger} count={overdueA.length}/><div style={{display:'flex',flexDirection:'column',gap:6}}>{overdueA.map(a=><ACard key={a.id} a={a} lead={leads.find(l=>l.id===a.lead_id)} compact/>)}</div></section>}
      {todayA.length>0&&<section style={{marginBottom:22}}><SecHead title="Do zrobienia dziś" accent={C.accent} count={todayA.length}/><div style={{display:'flex',flexDirection:'column',gap:6}}>{todayA.map(a=><ACard key={a.id} a={a} lead={leads.find(l=>l.id===a.lead_id)} compact/>)}</div></section>}
      {noContact.length>0&&<section style={{marginBottom:22}}><SecHead title="Bez kontaktu 5+ dni" accent={C.t3} count={noContact.length}/>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {noContact.map(l=>(
            <div key={l.id} onClick={()=>onSelLead(l)} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 13px',background:C.card,border:`1px solid ${C.border}`,borderRadius:8,cursor:'pointer'}}
              onMouseEnter={e=>e.currentTarget.style.background=C.cardHover} onMouseLeave={e=>e.currentTarget.style.background=C.card}>
              <Avatar name={l.name} size={28}/><PriDot p={l.priority}/>
              <span style={{fontSize:13,fontWeight:500,color:C.t1,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{l.name}</span>
              <span style={{fontSize:12,color:C.t3,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{l.company}</span>
              <StatusBadge status={l.status} small/>
            </div>
          ))}
        </div>
      </section>}
      {todayA.length===0&&overdueA.length===0&&todayMeet.length===0&&<div style={{textAlign:'center',padding:'60px 0',color:C.t3,fontSize:14}}><div style={{fontSize:36,marginBottom:12}}>✓</div>Wszystko ogarnięte na dziś!</div>}
    </div>
  )
}

// ─── Tasks ────────────────────────────────────────────────────────────────────
function TasksView({leads,acts,onToggle,onAdd}) {
  const [tab,setTab]=useState('today')
  const buckets={
    today:acts.filter(a=>a.show_in_tasks&&a.status==='pending'&&isToday(a)),
    tomorrow:acts.filter(a=>a.show_in_tasks&&a.status==='pending'&&isTomorrow(a)),
    overdue:acts.filter(a=>a.show_in_tasks&&isOverdue(a)),
    done:acts.filter(a=>a.status==='done'&&a.show_in_tasks),
  }
  const tabs=[{k:'today',l:'Dziś'},{k:'tomorrow',l:'Jutro'},{k:'overdue',l:'Zaległe'},{k:'done',l:'Zrobione'}]
  const list=buckets[tab]||[]
  return (
    <div style={{flex:1,overflowY:'auto',padding:'28px 32px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:22}}>
        <div>
          <div style={{fontSize:22,fontWeight:700,color:C.t1,letterSpacing:'-.02em'}}>Zadania</div>
          <div style={{fontSize:13,color:C.t2,marginTop:4}}>Jedno źródło — wszystkie działania z leadami i kalendarza</div>
        </div>
        <button onClick={onAdd} style={{background:C.accent,border:'none',color:'#000',borderRadius:8,padding:'9px 15px',fontSize:13,fontWeight:600,cursor:'pointer'}}>+ Nowe działanie</button>
      </div>
      <div style={{display:'flex',borderBottom:`1px solid ${C.border}`,marginBottom:20}}>
        {tabs.map(t=>{
          const n=buckets[t.k].length
          return <button key={t.k} onClick={()=>setTab(t.k)} style={{padding:'10px 18px',background:'none',border:'none',borderBottom:tab===t.k?`2px solid ${C.accent}`:'2px solid transparent',color:tab===t.k?C.accent:C.t2,cursor:'pointer',fontSize:13,fontWeight:tab===t.k?600:400,display:'flex',alignItems:'center',gap:6,transition:'color .12s'}}>
            {t.l}{n>0&&<span style={{background:t.k==='overdue'?'rgba(248,113,113,.2)':C.accentDim,color:t.k==='overdue'?C.danger:C.accent,borderRadius:20,padding:'1px 7px',fontSize:10,fontWeight:700}}>{n}</span>}
          </button>
        })}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:6}}>
        {list.map(a=><ACard key={a.id} a={a} lead={leads.find(l=>l.id===a.lead_id)} onToggle={onToggle}/>)}
        {list.length===0&&<div style={{textAlign:'center',padding:'48px 0',color:C.t3,fontSize:13}}>{tab==='overdue'?'Brak zaległych — świetnie!':tab==='done'?'Brak ukończonych.':'Brak zadań w tej sekcji.'}</div>}
      </div>
    </div>
  )
}

// ─── Calendar ─────────────────────────────────────────────────────────────────
function CalendarView({leads,acts,onAdd}) {
  const [off,setOff]=useState(0)
  const weekStart=useMemo(()=>{
    const d=new Date(TODAY); d.setDate(d.getDate()-d.getDay()+1+off*7); return d.toISOString().slice(0,10)
  },[off])
  const days=useMemo(()=>Array.from({length:7},(_,i)=>{const d=new Date(weekStart);d.setDate(d.getDate()+i);return d.toISOString().slice(0,10)}),[weekStart])
  const DN=['Pon','Wt','Śr','Czw','Pt','Sob','Nd']
  const actsDay=day=>acts.filter(a=>a.show_in_calendar&&aDate(a)?.slice(0,10)===day).sort((a,b)=>(aDate(a)||'').localeCompare(aDate(b)||''))
  const wLbl=`${new Date(weekStart).toLocaleDateString('pl-PL',{day:'numeric',month:'short'})} – ${new Date(days[6]).toLocaleDateString('pl-PL',{day:'numeric',month:'short',year:'numeric'})}`
  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',padding:'28px 32px',overflow:'hidden'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20,flexShrink:0}}>
        <div>
          <div style={{fontSize:22,fontWeight:700,color:C.t1,letterSpacing:'-.02em'}}>Kalendarz</div>
          <div style={{fontSize:13,color:C.t2,marginTop:4}}>{wLbl}</div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>setOff(0)} style={{background:C.card,border:`1px solid ${C.border}`,color:C.t2,borderRadius:7,padding:'7px 12px',fontSize:12,cursor:'pointer'}}>Dziś</button>
          <button onClick={()=>setOff(o=>o-1)} style={{background:C.card,border:`1px solid ${C.border}`,color:C.t2,borderRadius:7,padding:'7px 10px',fontSize:13,cursor:'pointer'}}>‹</button>
          <button onClick={()=>setOff(o=>o+1)} style={{background:C.card,border:`1px solid ${C.border}`,color:C.t2,borderRadius:7,padding:'7px 10px',fontSize:13,cursor:'pointer'}}>›</button>
          <button onClick={onAdd} style={{background:C.accent,border:'none',color:'#000',borderRadius:7,padding:'8px 14px',fontSize:12,fontWeight:600,cursor:'pointer'}}>+ Dodaj</button>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:8,flex:1,overflowY:'auto',alignContent:'start'}}>
        {days.map((day,i)=>{
          const isT=day===TODAY, dayActs=actsDay(day)
          return (
            <div key={day}>
              <div style={{textAlign:'center',padding:'8px 4px',borderRadius:7,background:isT?C.accentDim:'transparent',border:isT?'1px solid rgba(245,158,11,.25)':`1px solid ${C.border}`,marginBottom:6}}>
                <div style={{fontSize:11,color:isT?C.accent:C.t3,fontWeight:600,textTransform:'uppercase',letterSpacing:'.07em'}}>{DN[i]}</div>
                <div style={{fontSize:18,fontWeight:700,color:isT?C.accent:C.t1,letterSpacing:'-.02em',marginTop:2}}>{new Date(day).getDate()}</div>
              </div>
              {dayActs.map(a=>{
                const at=ATYPE[a.type]||ATYPE.task
                const lead=leads.find(l=>l.id===a.lead_id)
                const ov=isOverdue(a)
                return (
                  <div key={a.id} style={{background:a.status==='done'?'rgba(255,255,255,.02)':ov?'rgba(248,113,113,.07)':at.color+'15',border:`1px solid ${a.status==='done'?C.border:ov?'rgba(248,113,113,.25)':at.color+'30'}`,borderRadius:6,padding:'7px 8px',marginBottom:5,opacity:a.status==='done'?.5:1}}>
                    <div style={{fontSize:10,color:at.color,fontWeight:600,marginBottom:2}}>{at.icon} {fmtTime(aDate(a))}</div>
                    <div style={{fontSize:11,color:C.t1,fontWeight:500,lineHeight:1.35,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{a.title}</div>
                    {lead&&<div style={{fontSize:10,color:C.t3,marginTop:3,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{lead.name}</div>}
                  </div>
                )
              })}
              {dayActs.length===0&&<div style={{height:36,border:`1px dashed ${C.border}`,borderRadius:6,opacity:.35}}/>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Leads list ───────────────────────────────────────────────────────────────
function LeadsView({leads,acts,onSel,onAdd}) {
  const [q,setQ]=useState('')
  const [fs,setFs]=useState('all')
  const fl=leads.filter(l=>(!q||l.name.toLowerCase().includes(q.toLowerCase())||l.company.toLowerCase().includes(q.toLowerCase()))&&(fs==='all'||l.status===fs))
  return (
    <div style={{flex:1,overflowY:'auto',padding:'28px 32px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:22}}>
        <div>
          <div style={{fontSize:22,fontWeight:700,color:C.t1,letterSpacing:'-.02em'}}>Leady</div>
          <div style={{fontSize:13,color:C.t2,marginTop:4}}>{fl.length} z {leads.length} kontaktów</div>
        </div>
        <button onClick={onAdd} style={{background:C.accent,border:'none',color:'#000',borderRadius:8,padding:'9px 15px',fontSize:13,fontWeight:600,cursor:'pointer'}}>+ Dodaj lead</button>
      </div>
      <div style={{display:'flex',gap:10,marginBottom:16}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Szukaj..." style={{flex:1,background:C.card,border:`1px solid ${C.border}`,color:C.t1,borderRadius:8,padding:'8px 12px',fontSize:13,outline:'none',fontFamily:'inherit'}}/>
        <Sel value={fs} onChange={e=>setFs(e.target.value)}>
          <option value="all">Wszystkie statusy</option>
          {Object.entries(STATUS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
        </Sel>
      </div>
      <div style={{background:C.card,borderRadius:10,border:`1px solid ${C.border}`,overflow:'hidden'}}>
        <div style={{display:'grid',gridTemplateColumns:'2fr 1.2fr 1fr 1fr .9fr',padding:'9px 14px',borderBottom:`1px solid ${C.border}`}}>
          {['Klient','Status','Źródło','Wartość','Aktywne zadania'].map(h=><div key={h} style={{fontSize:11,fontWeight:600,color:C.t3,textTransform:'uppercase',letterSpacing:'.07em'}}>{h}</div>)}
        </div>
        {fl.map((lead,i)=>{
          const la=acts.filter(a=>a.lead_id===lead.id&&a.show_in_tasks&&a.status==='pending')
          const ov=la.filter(a=>isOverdue(a)).length
          return (
            <div key={lead.id} onClick={()=>onSel(lead)} style={{display:'grid',gridTemplateColumns:'2fr 1.2fr 1fr 1fr .9fr',padding:'11px 14px',cursor:'pointer',borderBottom:i===fl.length-1?'none':`1px solid ${C.border}`,transition:'background .1s'}}
              onMouseEnter={e=>e.currentTarget.style.background=C.cardHover} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <div style={{display:'flex',alignItems:'center',gap:9}}><Avatar name={lead.name} size={28}/><div><div style={{fontSize:13,fontWeight:500,color:C.t1}}>{lead.name}</div><div style={{fontSize:11,color:C.t3}}>{lead.company}</div></div></div>
              <div style={{display:'flex',alignItems:'center'}}><StatusBadge status={lead.status} small/></div>
              <div style={{display:'flex',alignItems:'center',fontSize:12,color:C.t2}}>{lead.source}</div>
              <div style={{display:'flex',alignItems:'center',fontSize:12,fontWeight:500,color:C.accent}}>{lead.value?`${lead.value.toLocaleString('pl-PL')} zł`:'—'}</div>
              <div style={{display:'flex',alignItems:'center',fontSize:12,gap:5}}>
                {la.length>0?<><span style={{color:ov?C.danger:C.t2}}>{la.length}</span>{ov>0&&<span style={{color:C.danger,fontSize:10,fontWeight:600}}>({ov}↑)</span>}</>:<span style={{color:C.t3}}>—</span>}
              </div>
            </div>
          )
        })}
        {fl.length===0&&<div style={{padding:'36px',textAlign:'center',color:C.t3,fontSize:13}}>Brak wyników</div>}
      </div>
    </div>
  )
}

// ─── Lead Drawer ──────────────────────────────────────────────────────────────
function LeadDrawer({lead,leads,acts,onClose,onUpdateLead,onAddAct,onToggleAct}) {
  const [tab,setTab]=useState('info')
  const [aiResult,setAiResult]=useState('')
  const [aiLoading,setAiLoading]=useState(false)
  const [na,setNa]=useState({type:'follow_up',title:'',due_at:'',start_at:'',description:'',priority:'medium',show_in_tasks:true,show_in_calendar:true})
  const leadActs=acts.filter(a=>a.lead_id===lead.id).sort((a,b)=>(aDate(b)||b.created_at||'').localeCompare(aDate(a)||a.created_at||''))
  const isCalE=na.type==='meeting'||na.type==='call'

  async function genAI(type) {
    setAiLoading(true);setAiResult('')
    const p={followup:`Napisz naturalny follow-up email do ${lead.name} (${lead.company}). Kontekst: ${lead.notes}. Max 3-4 zdania po polsku.`,noresponse:`Wiadomość do ${lead.name} który nie odpisał. Krótko bez wyrzutów po polsku. Max 3 zdania.`,closing:`Wiadomość domykająca dla ${lead.name} (${lead.company}). Kontekst: ${lead.notes}. Max 3-4 zdania po polsku.`}
    try{const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,messages:[{role:'user',content:p[type]}]})});const d=await r.json();setAiResult(d.content?.[0]?.text||'Brak odpowiedzi')}
    catch{setAiResult('Błąd generowania.')}
    setAiLoading(false)
  }

  function submitAct() {
    if(!na.title.trim()) return
    onAddAct({...na,id:uid(),lead_id:lead.id,status:'pending',completed_at:null,created_at:new Date().toISOString(),
      due_at:!isCalE&&na.due_at?`${na.due_at}T09:00`:null,
      start_at:isCalE&&na.start_at?na.start_at:null,end_at:null})
    setNa({type:'follow_up',title:'',due_at:'',start_at:'',description:'',priority:'medium',show_in_tasks:true,show_in_calendar:true})
    setTab('historia')
  }

  return (
    <div style={{position:'fixed',top:0,right:0,bottom:0,width:440,background:C.sidebar,borderLeft:`1px solid ${C.borderLight}`,display:'flex',flexDirection:'column',zIndex:100,boxShadow:'-16px 0 48px rgba(0,0,0,.5)'}}>
      <div style={{padding:'15px 20px',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',gap:12}}>
        <Avatar name={lead.name} size={40}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:600,fontSize:15,color:C.t1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{lead.name}</div>
          <div style={{fontSize:12,color:C.t2}}>{lead.company}</div>
        </div>
        <StatusBadge status={lead.status} small/>
        <button onClick={onClose} style={{background:'none',border:'none',color:C.t3,cursor:'pointer',fontSize:20,padding:'2px 6px',marginLeft:4}}>×</button>
      </div>
      <div style={{display:'flex',borderBottom:`1px solid ${C.border}`}}>
        {[['info','Dane'],['historia','Historia'],['akcja','+ Akcja'],['ai','AI']].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:'9px 0',background:'none',border:'none',borderBottom:tab===k?`2px solid ${C.accent}`:'2px solid transparent',color:tab===k?C.accent:C.t2,cursor:'pointer',fontSize:12,fontWeight:500,textTransform:'uppercase',letterSpacing:'.07em',transition:'color .12s'}}>{l}</button>
        ))}
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'16px 20px'}}>
        {tab==='info'&&(
          <div style={{display:'flex',flexDirection:'column',gap:13}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <Field label="Status">
                <Sel value={lead.status} onChange={e=>onUpdateLead({...lead,status:e.target.value})} style={{width:'100%'}}>
                  {Object.entries(STATUS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                </Sel>
              </Field>
              <Field label="Wartość"><span style={{color:C.accent,fontSize:14,fontWeight:600}}>{lead.value?.toLocaleString('pl-PL')} zł</span></Field>
            </div>
            <Field label="E-mail"><span style={{color:C.info,fontSize:13}}>{lead.email}</span></Field>
            <Field label="Telefon"><span style={{color:C.t1,fontSize:13}}>{lead.phone}</span></Field>
            <Field label="Źródło"><span style={{color:C.t1,fontSize:13}}>{lead.source}</span></Field>
            {lead.notes&&<div style={{background:C.card,borderRadius:8,padding:'12px 14px'}}>
              <Lbl>Notatka</Lbl>
              <div style={{color:C.t2,fontSize:13,lineHeight:1.6}}>{lead.notes}</div>
            </div>}
            <div>
              <Lbl>Aktywne zadania ({leadActs.filter(a=>a.status==='pending'&&a.show_in_tasks).length})</Lbl>
              {leadActs.filter(a=>a.status==='pending'&&a.show_in_tasks).slice(0,4).map(a=>(
                <div key={a.id} style={{display:'flex',alignItems:'center',gap:7,padding:'6px 0',borderBottom:`1px solid ${C.border}`}}>
                  <span style={{fontSize:12,color:(ATYPE[a.type]||ATYPE.task).color,flexShrink:0}}>{(ATYPE[a.type]||ATYPE.task).icon}</span>
                  <span style={{fontSize:12,color:isOverdue(a)?C.danger:C.t1,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.title}</span>
                  <span style={{fontSize:10,color:isOverdue(a)?C.danger:C.t3,flexShrink:0}}>{fmtDate(aDate(a)?.slice(0,10))}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab==='historia'&&(
          <div style={{display:'flex',flexDirection:'column',gap:7}}>
            {leadActs.length===0&&<div style={{textAlign:'center',padding:'32px 0',color:C.t3,fontSize:13}}>Brak historii dla tego leada.</div>}
            {leadActs.map(a=><ACard key={a.id} a={a} onToggle={a.show_in_tasks?onToggleAct:null} compact/>)}
          </div>
        )}
        {tab==='akcja'&&(
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <div>
              <Lbl>Typ działania</Lbl>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6}}>
                {Object.entries(ATYPE).filter(([k])=>k!=='note').map(([k,v])=>(
                  <button key={k} onClick={()=>setNa(a=>({...a,type:k}))} style={{padding:'8px 4px',background:na.type===k?v.color+'1f':C.card,border:`1px solid ${na.type===k?v.color+'55':C.border}`,borderRadius:7,cursor:'pointer',fontSize:11,color:na.type===k?v.color:C.t2,fontWeight:na.type===k?600:400,textAlign:'center'}}>
                    {v.icon} {v.label}
                  </button>
                ))}
              </div>
            </div>
            <Field label="Tytuł *"><Inp value={na.title} onChange={e=>setNa(a=>({...a,title:e.target.value}))} placeholder={`np. Oddzwonić do ${lead.name.split(' ')[0]}`}/></Field>
            <Field label={isCalE?'Data i godzina':'Termin'}>
              <input type={isCalE?'datetime-local':'date'} value={isCalE?na.start_at:na.due_at} onChange={e=>setNa(a=>isCalE?{...a,start_at:e.target.value}:{...a,due_at:e.target.value})} style={{background:C.card,border:`1px solid ${C.border}`,color:C.t1,borderRadius:7,padding:'8px 10px',fontSize:13,outline:'none'}}/>
            </Field>
            <Field label="Opis (opcjonalnie)"><textarea value={na.description} onChange={e=>setNa(a=>({...a,description:e.target.value}))} rows={2} style={{width:'100%',background:C.card,border:`1px solid ${C.border}`,color:C.t1,borderRadius:7,padding:'8px 11px',fontSize:13,outline:'none',fontFamily:'inherit',resize:'none',boxSizing:'border-box'}}/></Field>
            <div style={{display:'flex',gap:16}}>
              {[['show_in_tasks','Zadania'],['show_in_calendar','Kalendarz']].map(([k,l])=>(
                <label key={k} style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:C.t2,cursor:'pointer'}}>
                  <input type="checkbox" checked={na[k]} onChange={e=>setNa(a=>({...a,[k]:e.target.checked}))} style={{accentColor:C.accent}}/>{l}
                </label>
              ))}
            </div>
            <button onClick={submitAct} style={{background:C.accent,border:'none',color:'#000',borderRadius:8,padding:'10px',fontSize:13,fontWeight:600,cursor:'pointer',marginTop:4}}>Dodaj działanie</button>
          </div>
        )}
        {tab==='ai'&&(
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            <div style={{fontSize:12,color:C.t2,lineHeight:1.6,marginBottom:4}}>Generuj wiadomości dla {lead.name.split(' ')[0]}.</div>
            {[{k:'followup',l:'↩ Napisz follow-up'},{k:'noresponse',l:'◈ Brak odpowiedzi'},{k:'closing',l:'◉ Zamknij rozmowę'}].map(b=>(
              <button key={b.k} onClick={()=>genAI(b.k)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:'11px 14px',cursor:'pointer',textAlign:'left',color:C.t1,fontSize:13,fontWeight:500}}>{b.l}</button>
            ))}
            {aiLoading&&<div style={{padding:'18px',textAlign:'center',color:C.t2,fontSize:12}}>
              <div style={{display:'inline-block',width:16,height:16,border:`2px solid ${C.accent}`,borderTopColor:'transparent',borderRadius:'50%',animation:'spin .8s linear infinite'}}/>
              <div style={{marginTop:8}}>Generuję...</div>
            </div>}
            {aiResult&&!aiLoading&&<div style={{background:C.accentDim,border:'1px solid rgba(245,158,11,.25)',borderRadius:8,padding:'14px'}}>
              <Lbl>Propozycja</Lbl>
              <div style={{color:C.t1,fontSize:13,lineHeight:1.7,whiteSpace:'pre-wrap',marginTop:4}}>{aiResult}</div>
              <button onClick={()=>navigator.clipboard?.writeText(aiResult)} style={{marginTop:10,background:'rgba(245,158,11,.15)',border:'1px solid rgba(245,158,11,.3)',color:C.accent,borderRadius:6,padding:'5px 12px',fontSize:11,cursor:'pointer',fontWeight:500}}>Kopiuj</button>
            </div>}
          </div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

// ─── Add Modal ────────────────────────────────────────────────────────────────
function AddModal({type,leads,onAdd,onClose}) {
  const isLead=type==='lead'
  const [f,setF]=useState(isLead
    ?{name:'',company:'',email:'',phone:'',source:'LinkedIn',status:'new',priority:'medium',value:'',notes:''}
    :{type:'follow_up',title:'',lead_id:leads[0]?.id||'',due_at:'',start_at:'',description:'',priority:'medium',show_in_tasks:true,show_in_calendar:true}
  )
  const set=(k,v)=>setF(x=>({...x,[k]:v}))
  const isCalE=f.type==='meeting'||f.type==='call'
  function submit() {
    if(isLead){if(!f.name.trim()) return;onAdd({...f,id:uid(),value:parseInt(f.value)||0,created_at:new Date().toISOString()})}
    else{if(!f.title.trim()) return;onAdd({...f,id:uid(),lead_id:parseInt(f.lead_id),status:'pending',completed_at:null,created_at:new Date().toISOString(),due_at:!isCalE&&f.due_at?`${f.due_at}T09:00`:null,start_at:isCalE&&f.start_at?f.start_at:null,end_at:null})}
    onClose()
  }
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200}}>
      <div style={{background:C.sidebar,borderRadius:12,border:`1px solid ${C.borderLight}`,padding:'24px',width:460,maxHeight:'90vh',overflowY:'auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
          <div style={{fontSize:16,fontWeight:700,color:C.t1}}>{isLead?'Nowy lead':'Nowe działanie'}</div>
          <button onClick={onClose} style={{background:'none',border:'none',color:C.t3,cursor:'pointer',fontSize:20}}>×</button>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {isLead?(
            <>
              {[['name','Imię i nazwisko *'],['company','Firma'],['email','E-mail'],['phone','Telefon']].map(([k,l])=>(
                <Field key={k} label={l}><Inp value={f[k]} onChange={e=>set(k,e.target.value)}/></Field>
              ))}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <Field label="Źródło"><Sel value={f.source} onChange={e=>set('source',e.target.value)} style={{width:'100%'}}>{['LinkedIn','Polecenie','Strona www','Cold outreach','Instagram','Inne'].map(s=><option key={s}>{s}</option>)}</Sel></Field>
                <Field label="Wartość (zł)"><Inp type="number" value={f.value} onChange={e=>set('value',e.target.value)}/></Field>
              </div>
              <Field label="Notatka"><textarea value={f.notes} onChange={e=>set('notes',e.target.value)} rows={2} style={{width:'100%',background:C.card,border:`1px solid ${C.border}`,color:C.t1,borderRadius:7,padding:'8px 11px',fontSize:13,outline:'none',fontFamily:'inherit',resize:'none',boxSizing:'border-box'}}/></Field>
            </>
          ):(
            <>
              <div>
                <Lbl>Typ</Lbl>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6}}>
                  {Object.entries(ATYPE).filter(([k])=>k!=='note').map(([k,v])=>(
                    <button key={k} onClick={()=>set('type',k)} style={{padding:'8px 5px',background:f.type===k?v.color+'1f':C.card,border:`1px solid ${f.type===k?v.color+'55':C.border}`,borderRadius:7,cursor:'pointer',fontSize:11,color:f.type===k?v.color:C.t2,fontWeight:f.type===k?600:400,textAlign:'center'}}>{v.icon} {v.label}</button>
                  ))}
                </div>
              </div>
              <Field label="Lead"><Sel value={f.lead_id} onChange={e=>set('lead_id',e.target.value)} style={{width:'100%'}}>{leads.map(l=><option key={l.id} value={l.id}>{l.name} — {l.company}</option>)}</Sel></Field>
              <Field label="Tytuł *"><Inp value={f.title} onChange={e=>set('title',e.target.value)}/></Field>
              <Field label={isCalE?'Data i godzina':'Termin'}>
                <input type={isCalE?'datetime-local':'date'} value={isCalE?f.start_at:f.due_at} onChange={e=>set(isCalE?'start_at':'due_at',e.target.value)} style={{background:C.card,border:`1px solid ${C.border}`,color:C.t1,borderRadius:7,padding:'8px 10px',fontSize:13,outline:'none'}}/>
              </Field>
              <Field label="Opis"><Inp value={f.description} onChange={e=>set('description',e.target.value)}/></Field>
              <div style={{display:'flex',gap:16}}>
                {[['show_in_tasks','Zadania'],['show_in_calendar','Kalendarz']].map(([k,l])=>(
                  <label key={k} style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:C.t2,cursor:'pointer'}}>
                    <input type="checkbox" checked={f[k]} onChange={e=>set(k,e.target.checked)} style={{accentColor:C.accent}}/>{l}
                  </label>
                ))}
              </div>
            </>
          )}
          <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:4}}>
            <button onClick={onClose} style={{background:'none',border:`1px solid ${C.border}`,color:C.t2,borderRadius:7,padding:'9px 16px',fontSize:13,cursor:'pointer'}}>Anuluj</button>
            <button onClick={submit} style={{background:C.accent,border:'none',color:'#000',borderRadius:7,padding:'9px 16px',fontSize:13,fontWeight:600,cursor:'pointer'}}>Dodaj</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── App root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view,setView]=useState('dashboard')
  const [leads,setLeads]=useState(LEADS_INIT)
  const [acts,setActs]=useState(ACTS_INIT)
  const [selLead,setSelLead]=useState(null)
  const [modal,setModal]=useState(null)

  const toggleAct=id=>setActs(as=>as.map(a=>a.id===id?{...a,status:a.status==='done'?'pending':'done',completed_at:a.status==='done'?null:new Date().toISOString()}:a))
  const addAct=act=>setActs(as=>[act,...as])
  const updLead=l=>{setLeads(ls=>ls.map(x=>x.id===l.id?l:x));setSelLead(l)}
  const addLead=l=>setLeads(ls=>[l,...ls])
  const fromModal=d=>modal==='lead'?addLead(d):addAct(d)

  const overdueN=acts.filter(a=>a.show_in_tasks&&isOverdue(a)).length
  const todayN=acts.filter(a=>a.show_in_tasks&&a.status==='pending'&&isToday(a)).length

  const nav=[
    {key:'dashboard',icon:'◈',label:'Dzisiaj',badge:overdueN+todayN},
    {key:'tasks',icon:'☑',label:'Zadania',badge:overdueN},
    {key:'calendar',icon:'⊞',label:'Kalendarz',badge:0},
    {key:'leads',icon:'◉',label:'Leady',badge:0},
  ]

  return (
    <div style={{display:'flex',height:'100vh',background:C.bg,fontFamily:'-apple-system,"SF Pro Display",BlinkMacSystemFont,"Segoe UI",sans-serif',overflow:'hidden'}}>
      <div style={{width:192,flexShrink:0,background:C.sidebar,borderRight:`1px solid ${C.border}`,display:'flex',flexDirection:'column',padding:'18px 10px 14px'}}>
        <div style={{padding:'4px 8px 18px',borderBottom:`1px solid ${C.border}`,marginBottom:14}}>
          <div style={{fontSize:16,fontWeight:800,color:C.t1,letterSpacing:'-.03em'}}>Lead<span style={{color:C.accent}}>Desk</span></div>
          <div style={{fontSize:10,color:C.t3,marginTop:2,letterSpacing:'.05em',textTransform:'uppercase'}}>Solo CRM</div>
        </div>
        <nav style={{display:'flex',flexDirection:'column',gap:2,flex:1}}>
          {nav.map(item=><NavItem key={item.key} {...item} active={view===item.key} onClick={()=>{setView(item.key);setSelLead(null)}}/>)}
        </nav>
        <div style={{borderTop:`1px solid ${C.border}`,paddingTop:12,display:'flex',flexDirection:'column',gap:6}}>
          <button onClick={()=>setModal('activity')} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 12px',borderRadius:7,background:'none',border:`1px solid ${C.border}`,color:C.t2,cursor:'pointer',fontSize:12,width:'100%',textAlign:'left',transition:'all .12s'}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.color=C.accent}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.t2}}>
            <span>+</span> Nowe działanie
          </button>
          <div style={{display:'flex',alignItems:'center',gap:8,padding:'6px 8px'}}>
            <div style={{width:26,height:26,borderRadius:'50%',background:C.accentDim,border:'1px solid rgba(245,158,11,.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:C.accent}}>D</div>
            <div style={{fontSize:12,fontWeight:500,color:C.t1}}>Demo</div>
          </div>
        </div>
      </div>
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',minWidth:0}}>
        {view==='dashboard'&&<DashboardView leads={leads} acts={acts} onSelLead={setSelLead}/>}
        {view==='tasks'&&<TasksView leads={leads} acts={acts} onToggle={toggleAct} onAdd={()=>setModal('activity')}/>}
        {view==='calendar'&&<CalendarView leads={leads} acts={acts} onAdd={()=>setModal('activity')}/>}
        {view==='leads'&&<LeadsView leads={leads} acts={acts} onSel={setSelLead} onAdd={()=>setModal('lead')}/>}
      </div>
      {selLead&&<LeadDrawer lead={selLead} leads={leads} acts={acts} onClose={()=>setSelLead(null)} onUpdateLead={updLead} onAddAct={act=>{addAct(act);}} onToggleAct={toggleAct}/>}
      {modal&&<AddModal type={modal} leads={leads} onAdd={fromModal} onClose={()=>setModal(null)}/>}
    </div>
  )
}
