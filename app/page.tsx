"use client";

import { useMemo, useState } from "react";
import {
  Activity, ArrowRight, BarChart3, Bell, BookOpen, CalendarDays, CheckCircle2,
  ChevronRight, CircleHelp, ClipboardList, Download, Eye, FileText, FlaskConical,
  Gauge, History, Home, Layers3, Menu, Microscope, Plus, Search, Settings,
  ShieldCheck, Sparkles, Stethoscope, UserRound, Users, X
} from "lucide-react";

type View = "home" | "patients" | "observation" | "research" | "reports" | "help" | "settings";
type Status = "Стабильно" | "Наблюдение" | "Высокий риск";
type Patient = {
  id: string; name: string; initials: string; age: number; eye: "OD" | "OS";
  procedure: string; operationDate: string; doctor: string; visitDate: string;
  risk: number; confidence: number; trend: number; status: Status;
  history: number[];
};

const PATIENTS: Patient[] = [
  { id:"CR-0318", name:"Иванов Иван Иванович", initials:"ИИ", age:56, eye:"OD", procedure:"Сквозная кератопластика", operationDate:"12.04.2025", doctor:"Смирнова Е.А.", visitDate:"14.05.2026", risk:72, confidence:93, trend:14, status:"Высокий риск", history:[28,34,39,48,58,64,72] },
  { id:"CR-0241", name:"Петрова Анна Сергеевна", initials:"ПА", age:43, eye:"OS", procedure:"DMEK", operationDate:"03.02.2026", doctor:"Смирнова Е.А.", visitDate:"20.05.2026", risk:19, confidence:96, trend:-6, status:"Стабильно", history:[36,31,28,25,23,21,19] },
  { id:"CR-0196", name:"Кузнецов Михаил Олегович", initials:"КМ", age:61, eye:"OD", procedure:"DSAEK", operationDate:"18.11.2025", doctor:"Орлова Н.В.", visitDate:"18.05.2026", risk:41, confidence:90, trend:4, status:"Наблюдение", history:[29,31,33,34,37,39,41] },
];

const NAV: {id:View; label:string; icon:any}[] = [
  {id:"home", label:"Главная", icon:Home},
  {id:"patients", label:"Пациенты", icon:Users},
  {id:"observation", label:"Наблюдение", icon:History},
  {id:"research", label:"Исследования", icon:FlaskConical},
  {id:"reports", label:"Отчёты", icon:FileText},
];

function MiniTrend({ values }: { values:number[] }) {
  const pts = values.map((v,i)=>`${8+(i/(values.length-1))*84},${88-v*.72}`).join(" ");
  return <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="miniTrend" aria-label="Динамика риска">
    <defs><linearGradient id="mt" x1="0" x2="1"><stop stopColor="#0f766e"/><stop offset="1" stopColor="#38bdf8"/></linearGradient></defs>
    <line x1="4" y1="78" x2="96" y2="78"/><polyline points={pts}/>{values.map((v,i)=><circle key={i} cx={8+(i/(values.length-1))*84} cy={88-v*.72} r="2"/>)}
  </svg>;
}

function CorneaExplorer({ risk }: { risk:number }) {
  const [mode,setMode] = useState<"Слои"|"Активность"|"Прогноз">("Слои");
  const [focus,setFocus] = useState<"Трансплантат"|"Эндотелий"|"Строма"|"Эпителий">("Трансплантат");
  const [rotation,setRotation] = useState({x:-7,y:10});
  const [visit,setVisit] = useState(6);
  const visits=[28,34,39,48,58,64,risk];
  const meta={
    "Трансплантат":{value:"68%",label:"индекс стабильности",detail:"Прозрачность сохранена. В центральной зоне определяется нарастание иммунной активности."},
    "Эндотелий":{value:"1820",label:"клеток/мм²",detail:"Плотность снижена на 7% к предыдущему визиту. Требуется контроль динамики."},
    "Строма":{value:"565",label:"мкм",detail:"Умеренное утолщение без признаков выраженного отёка."},
    "Эпителий":{value:"97%",label:"целостность",detail:"Поверхностный слой стабилен, дефекты эпителизации не выявлены."},
  }[focus];
  const move=(e:React.PointerEvent<HTMLElement>)=>{const r=e.currentTarget.getBoundingClientRect();setRotation({x:-10+(e.clientY-r.top)/r.height*12,y:-14+(e.clientX-r.left)/r.width*28})};
  return <section className="twinShell">
    <div className="twinTop">
      <div><span className="eyebrow">ЦИФРОВОЙ ДВОЙНИК ТРАНСПЛАНТАТА</span><h2>Состояние роговицы в реальном времени</h2></div>
      <div className="modeSwitch">{(["Слои","Активность","Прогноз"] as const).map(x=><button key={x} className={mode===x?"active":""} onClick={()=>setMode(x)}>{x}</button>)}</div>
    </div>
    <div className="twinBody">
      <div className="twinViewport" onPointerMove={move} onPointerLeave={()=>setRotation({x:-7,y:10})}>
        <div className="scanGrid"/>
        <svg className={`corneaWorld mode-${mode.toLowerCase()}`} viewBox="0 0 760 520" style={{transform:`rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`}} role="img" aria-label="Интерактивная пространственная модель роговицы">
          <defs>
            <radialGradient id="iris" cx="50%" cy="45%"><stop offset="0" stopColor="#8bf4e6"/><stop offset=".35" stopColor="#24b6b0"/><stop offset=".72" stopColor="#0a6f79"/><stop offset="1" stopColor="#062b45"/></radialGradient>
            <linearGradient id="glassA" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffffff" stopOpacity=".92"/><stop offset=".4" stopColor="#b9f4ef" stopOpacity=".46"/><stop offset="1" stopColor="#47b9dd" stopOpacity=".18"/></linearGradient>
            <linearGradient id="glassB" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f8ffff" stopOpacity=".82"/><stop offset="1" stopColor="#0e8f98" stopOpacity=".3"/></linearGradient>
            <filter id="soft"><feGaussianBlur stdDeviation="7"/></filter>
            <filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <clipPath id="dome"><ellipse cx="380" cy="250" rx="230" ry="145"/></clipPath>
          </defs>
          <ellipse cx="380" cy="403" rx="275" ry="42" fill="#0b6c79" opacity=".1" filter="url(#soft)"/>
          {[1,2,3,4].map(i=><ellipse key={i} cx="380" cy="360" rx={245+i*22} ry={56+i*8} fill="none" stroke="#39aeb7" strokeOpacity={.18-i*.025} strokeWidth="1"/>)}
          <g className="worldLayers">
            <ellipse onClick={()=>setFocus("Эндотелий")} className={focus==="Эндотелий"?"focusLayer":""} cx="380" cy="338" rx="220" ry="76" fill="url(#glassB)" stroke="#167f88" strokeOpacity=".55"/>
            <path onClick={()=>setFocus("Строма")} className={focus==="Строма"?"focusLayer":""} d="M157 294 C182 165 578 165 603 294 L589 330 C555 405 205 405 171 330 Z" fill="url(#glassA)" stroke="#4caec2" strokeOpacity=".58"/>
            <path onClick={()=>setFocus("Трансплантат")} className={focus==="Трансплантат"?"focusLayer":""} d="M211 288 C235 197 525 197 549 288 C522 333 238 333 211 288Z" fill="#69d7d0" fillOpacity=".26" stroke="#22b5ae" strokeWidth="2"/>
            <path onClick={()=>setFocus("Эпителий")} className={focus==="Эпителий"?"focusLayer":""} d="M151 280 C172 105 588 105 609 280 C580 210 180 210 151 280Z" fill="#f5ffff" fillOpacity=".5" stroke="#b7e9ed"/>
            <ellipse cx="380" cy="250" rx="91" ry="58" fill="url(#iris)" opacity=".93"/>
            <ellipse cx="380" cy="250" rx="38" ry="27" fill="#041b2c"/>
            <ellipse cx="356" cy="224" rx="22" ry="10" fill="#fff" opacity=".35" filter="url(#soft)"/>
          </g>
          {mode!=="Слои" && <g className="activityField" clipPath="url(#dome)">
            {Array.from({length:22}).map((_,i)=>{const x=205+(i*79)%350,y=165+(i*47)%170,r=2+(i%4);return <circle key={i} cx={x} cy={y} r={r} fill={i%3===0?"#ff6b72":"#f6b44b"} opacity={.35+(i%5)*.1} filter="url(#glow)"/>})}
          </g>}
          {mode==="Прогноз" && <g className="riskHalo"><ellipse cx="380" cy="285" rx="245" ry="132" fill="none" stroke="#ef6a72" strokeWidth="8" strokeDasharray={`${risk*6} 600`} strokeLinecap="round"/><text x="380" y="455" textAnchor="middle" className="svgRisk">ПРОГНОЗ РИСКА {visits[visit]}%</text></g>}
          <g className="labels">
            <line x1="175" y1="170" x2="78" y2="130"/><circle cx="175" cy="170" r="4"/><text x="36" y="124">ЭПИТЕЛИЙ</text>
            <line x1="181" y1="258" x2="70" y2="258"/><circle cx="181" cy="258" r="4"/><text x="28" y="252">СТРОМА</text>
            <line x1="548" y1="290" x2="670" y2="248"/><circle cx="548" cy="290" r="4"/><text x="676" y="242">ТРАНСПЛАНТАТ</text>
            <line x1="548" y1="348" x2="675" y2="374"/><circle cx="548" cy="348" r="4"/><text x="681" y="380">ЭНДОТЕЛИЙ</text>
          </g>
        </svg>
        <div className="viewportTools"><button title="Сбросить положение" onClick={()=>setRotation({x:-7,y:10})}><Layers3/></button><span>Перемещайте курсор для обзора</span></div>
      </div>
      <aside className="twinInspector">
        <span className="eyebrow">ВЫБРАННЫЙ СЛОЙ</span><h3>{focus}</h3>
        <div className="inspectorValue"><strong>{meta.value}</strong><span>{meta.label}</span></div>
        <p>{meta.detail}</p>
        <div className="focusButtons">{(["Эпителий","Строма","Трансплантат","Эндотелий"] as const).map(x=><button key={x} className={focus===x?"active":""} onClick={()=>setFocus(x)}><i/><span>{x}</span><ChevronRight/></button>)}</div>
      </aside>
    </div>
    <div className="visitScrubber"><div className="scrubHeader"><span>Ретроспектива состояния</span><b>{["Операция","1 месяц","3 месяца","6 месяцев","9 месяцев","12 месяцев","Сегодня"][visit]} · риск {visits[visit]}%</b></div><input type="range" min="0" max="6" value={visit} onChange={e=>setVisit(Number(e.target.value))}/><div className="scrubLabels"><span>Операция</span><span>3 мес.</span><span>6 мес.</span><span>12 мес.</span><span>Сегодня</span></div></div>
  </section>;
}

export default function Page(){
  const [view,setView]=useState<View>("home");
  const [selected,setSelected]=useState(0);
  const [menu,setMenu]=useState(false);
  const [search,setSearch]=useState("");
  const [palette,setPalette]=useState(false);
  const patient=PATIENTS[selected];
  const title = NAV.find(n=>n.id===view)?.label || (view==="help"?"Справка":"Настройки");
  const chooseView=(v:View)=>{setView(v);setMenu(false)};

  return <main className="appShell">
    <aside className={`sidebar ${menu?"open":""}`}>
      <div className="brand"><div className="brandSymbol"><span/></div><div><strong>AURELIA</strong><small>Clinical Edition</small></div></div>
      <nav>{NAV.map(item=>{const I=item.icon;return <button key={item.id} className={view===item.id?"active":""} onClick={()=>chooseView(item.id)}><I/><span>{item.label}</span></button>})}</nav>
      <div className="sideBottom">
        <button className={view==="help"?"active":""} onClick={()=>chooseView("help")}><CircleHelp/><span>Справка</span></button>
        <button className={view==="settings"?"active":""} onClick={()=>chooseView("settings")}><Settings/><span>Настройки</span></button>
        <div className="doctor"><span>ЕС</span><div><b>Елена Смирнова</b><small>Врач-офтальмолог</small></div></div>
      </div>
    </aside>

    <section className="workspace">
      <header className="topbar">
        <button className="menuBtn" onClick={()=>setMenu(!menu)}><Menu/></button>
        <button className="searchBox" onClick={()=>setPalette(true)}><Search/><span>Поиск пациента или команды</span><kbd>⌘ K</kbd></button>
        <div className="topRight"><span className="live"><i/>Система работает</span><button className="roundBtn"><Bell/></button></div>
      </header>
      <div className="pageTop"><div><span className="eyebrow">AURELIA CLINICAL EDITION</span><h1>{title}</h1></div>{view!=="home"&&<button className="secondaryBtn" onClick={()=>setView("home")}><Home/>На главную</button>}</div>

      {view==="home" && <HomeView patient={patient} onProfile={()=>setView("patients")} onObservation={()=>setView("observation")} />}
      {view==="patients" && <PatientsView selected={selected} setSelected={setSelected} patient={patient}/>} 
      {view==="observation" && <ObservationView patient={patient}/>} 
      {view==="research" && <ResearchView/>}
      {view==="reports" && <ReportsView patient={patient}/>} 
      {view==="help" && <HelpView/>}
      {view==="settings" && <SettingsView/>}
    </section>

    {palette&&<div className="overlay" onClick={()=>setPalette(false)}><div className="palette" onClick={e=>e.stopPropagation()}><div className="paletteInput"><Search/><input autoFocus value={search} onChange={e=>setSearch(e.target.value)} placeholder="Пациент, раздел или действие…"/><button onClick={()=>setPalette(false)}><X/></button></div><div className="paletteItems">{[...NAV,{id:"settings" as View,label:"Настройки",icon:Settings}].filter(x=>x.label.toLowerCase().includes(search.toLowerCase())).map(x=>{const I=x.icon;return <button key={x.id} onClick={()=>{chooseView(x.id);setPalette(false);setSearch("")}}><I/><span>{x.label}</span><ChevronRight/></button>})}</div></div></div>}
  </main>
}

function HomeView({patient,onProfile,onObservation}:{patient:Patient;onProfile:()=>void;onObservation:()=>void}){
  const recommendation=patient.risk>=65?"Контроль через 14 дней":"Плановое наблюдение";
  return <>
    <section className="patientCommand">
      <div className="avatar">{patient.initials}</div>
      <div className="patientIdentity"><span>{patient.id} · {patient.visitDate}</span><h2>{patient.name}</h2><p>{patient.age} лет · {patient.eye} · {patient.procedure}</p></div>
      <div className="commandRisk"><span>Текущий риск</span><strong>{patient.risk}%</strong><small>{patient.status}</small></div>
      <button className="primaryBtn" onClick={onProfile}>Карта пациента <ArrowRight/></button>
    </section>
    <CorneaExplorer risk={patient.risk}/>
    <section className="clinicalStrip">
      <div className="stripLead"><Sparkles/><div><span className="eyebrow">КЛИНИЧЕСКИЙ ПРИОРИТЕТ</span><h3>{recommendation}</h3></div></div>
      <p>Рост IL-6 и VEGF на фоне снижения плотности эндотелия. Рекомендуется повторная оценка биомаркеров и спекулярная микроскопия.</p>
      <button className="secondaryBtn" onClick={onObservation}>Открыть план <ChevronRight/></button>
    </section>
  </>;
}

function PatientsView({selected,setSelected,patient}:{selected:number;setSelected:(n:number)=>void;patient:Patient}){
  return <div className="twoColumn"><section className="listPanel"><div className="sectionHeader"><div><span className="eyebrow">РЕЕСТР</span><h2>Пациенты</h2></div><button className="primaryBtn"><Plus/>Добавить</button></div><div className="patientList">{PATIENTS.map((p,i)=><button key={p.id} className={selected===i?"selected":""} onClick={()=>setSelected(i)}><span className="listAvatar">{p.initials}</span><span><b>{p.name}</b><small>{p.id} · {p.procedure}</small></span><em className={p.risk>=65?"high":p.risk>=35?"watch":"safe"}>{p.risk}%</em></button>)}</div></section><section className="detailPanel"><div className="detailHero"><div className="avatar large">{patient.initials}</div><div><span className="eyebrow">КАРТА ПАЦИЕНТА</span><h2>{patient.name}</h2><p>{patient.age} лет · {patient.eye} · {patient.procedure}</p></div></div><div className="detailGrid">{[["Дата операции",patient.operationDate],["Последний визит",patient.visitDate],["Лечащий врач",patient.doctor],["Достоверность",patient.confidence+"%"]].map(([a,b])=><div key={a}><span>{a}</span><b>{b}</b></div>)}</div><div className="noteCard"><Stethoscope/><div><b>Текущее состояние</b><p>Требуется сокращение интервала наблюдения и повторная оценка воспалительных биомаркеров.</p></div></div></section></div>;
}

function ObservationView({patient}:{patient:Patient}){return <><section className="widePanel"><div className="sectionHeader"><div><span className="eyebrow">ДИНАМИКА</span><h2>История наблюдения</h2></div><button className="secondaryBtn"><CalendarDays/>Все визиты</button></div><div className="bigChart"><MiniTrend values={patient.history}/><div className="visitLabels"><span>Операция<br/><b>28%</b></span><span>1 мес.<br/><b>34%</b></span><span>3 мес.<br/><b>39%</b></span><span>6 мес.<br/><b>48%</b></span><span>9 мес.<br/><b>58%</b></span><span>12 мес.<br/><b>64%</b></span><span>Сегодня<br/><b>72%</b></span></div></div></section><div className="cards3">{[["IL-6","14,8 пг/мл","+18%"],["VEGF","212 пг/мл","+11%"],["Эндотелий","1820 кл/мм²","−7%"]].map(([a,b,c])=><article key={a}><span>{a}</span><strong>{b}</strong><small>{c} к прошлому визиту</small></article>)}</div><section className="widePanel"><div className="sectionHeader"><div><span className="eyebrow">ПЛАН</span><h2>Следующие действия</h2></div></div><div className="taskList">{["Повторить IL-6 и VEGF через 14 дней","Выполнить спекулярную микроскопию","Провести осмотр офтальмолога"].map((x,i)=><div key={x}><CheckCircle2/><span><b>{x}</b><small>{i===0?"Приоритетное действие":"Запланировано"}</small></span><ChevronRight/></div>)}</div></section></>}

function ResearchView(){return <><div className="metricCards">{[["AUROC","0,91"],["Чувствительность","86%"],["Специфичность","82%"],["Brier score","0,11"]].map(([a,b])=><article key={a}><span>{a}</span><strong>{b}</strong><small>валидационная выборка</small></article>)}</div><div className="twoColumn equal"><section className="widePanel"><div className="sectionHeader"><div><span className="eyebrow">КАЧЕСТВО МОДЕЛИ</span><h2>ROC-кривая</h2></div><ShieldCheck/></div><svg className="roc" viewBox="0 0 400 260"><line x1="50" y1="220" x2="365" y2="220"/><line x1="50" y1="25" x2="50" y2="220"/><line className="diag" x1="50" y1="220" x2="365" y2="25"/><path d="M50 220 C65 132 108 76 175 48 C245 20 311 25 365 25"/></svg></section><section className="widePanel"><div className="sectionHeader"><div><span className="eyebrow">ИНТЕРПРЕТАЦИЯ</span><h2>Важность признаков</h2></div><BarChart3/></div><div className="featureBars">{[["IL-6",92],["VEGF",81],["Плотность эндотелия",68],["Эпизод отторжения",56],["Толщина роговицы",43]].map(([n,v])=><div key={String(n)}><span>{n}</span><em><i style={{width:`${v}%`}}/></em><b>{v}%</b></div>)}</div></section></div></>}

function ReportsView({patient}:{patient:Patient}){return <div className="reportsGrid">{["Клиническое заключение","Динамика наблюдения","Отчёт по биомаркерам","Исследовательский отчёт"].map((x,i)=><article key={x}><div className="reportIcon">{i===3?<FlaskConical/>:<FileText/>}</div><span>{i===3?"Исследование":"Пациент: "+patient.id}</span><h2>{x}</h2><p>Готовый структурированный документ для просмотра, печати или экспорта.</p><button className="secondaryBtn"><Download/>Скачать PDF</button></article>)}</div>}
function HelpView(){return <section className="widePanel prose"><BookOpen/><h2>Справочный центр AURELIA</h2><p>Здесь собраны инструкции по работе с пациентами, интерпретации прогнозов и исследовательским модулем.</p><div className="faq">{["Как интерпретировать риск?","Как добавить новый визит?","Как сформировать отчёт?","Что означает достоверность прогноза?"].map(x=><button key={x}>{x}<ChevronRight/></button>)}</div></section>}
function SettingsView(){return <section className="settingsPanel"><div><h2>Интерфейс</h2><label><span>Компактный режим</span><input type="checkbox"/></label><label><span>Показывать системный статус</span><input type="checkbox" defaultChecked/></label></div><div><h2>Уведомления</h2><label><span>Критическое изменение риска</span><input type="checkbox" defaultChecked/></label><label><span>Предстоящий визит</span><input type="checkbox" defaultChecked/></label></div><div><h2>Отчёты</h2><label><span>Добавлять объяснение модели</span><input type="checkbox" defaultChecked/></label><label><span>Включать графики</span><input type="checkbox" defaultChecked/></label></div></section>}
