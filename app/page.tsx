"use client";

import { useState } from "react";
import {
  Activity, ArrowRight, BarChart3, Bell, BookOpen, CalendarDays, CheckCircle2,
  ChevronRight, CircleHelp, ClipboardList, Download, Eye, FileText, FlaskConical,
  Gauge, History, Home, Layers3, Menu, Microscope, Plus, Search, Settings,
  ShieldCheck, Sparkles, Stethoscope, UserRound, Users, X, RotateCcw, ScanLine, GitCompare, Save
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

function GraftIntelligenceCanvas({ risk, onOpen }: { risk:number; onOpen:()=>void }) {
  const [mode,setMode] = useState<"Томография"|"Эндотелий"|"Прогноз">("Томография");
  const [zone,setZone] = useState<"Центр"|"Парацентр"|"Периферия">("Центр");
  const [visit,setVisit] = useState(6);
  const [compare,setCompare] = useState(false);
  const [probe,setProbe] = useState({x:280,y:195});
  const visits=[28,34,39,48,58,64,risk];
  const zoneData={
    "Центр":{thickness:565, density:1820, edema:"умеренный", signal:78},
    "Парацентр":{thickness:548, density:1960, edema:"минимальный", signal:51},
    "Периферия":{thickness:531, density:2140, edema:"не выявлен", signal:24},
  }[zone];
  const cells=Array.from({length:72},(_,i)=>({
    x:44+(i%12)*39+(i%2)*4,
    y:42+Math.floor(i/12)*37+(i%3)*2,
    s:15+(i%4),
    hot:(i*17+visit*11)%29<5
  }));
  const heatPoints=[
    {x:230,y:150,r:72,o:.56},{x:320,y:208,r:58,o:.42},{x:195,y:250,r:46,o:.31},
    {x:355,y:126,r:36,o:.25},{x:285,y:292,r:50,o:.18}
  ];
  return <section className="intelligenceCanvas">
    <div className="canvasHeader">
      <div><span className="eyebrow">ЦИФРОВОЙ ФЕНОТИП ТРАНСПЛАНТАТА</span><h2>Карта состояния роговицы</h2></div>
      <div className="canvasModes">{(["Томография","Эндотелий","Прогноз"] as const).map(x=><button key={x} className={mode===x?"active":""} onClick={()=>setMode(x)}>{x}</button>)}</div>
    </div>
    <div className="canvasLayout">
      <div className="imagingStage">
        <div className="stageMeta"><span>OD · визит {visit+1}/7</span><span>Достоверность 93%</span></div>
        {mode==="Томография" && <svg className="clinicalMap" viewBox="0 0 560 390" role="img" aria-label="Интерактивная карта толщины и воспалительной активности роговицы" onClick={(e)=>{const r=e.currentTarget.getBoundingClientRect(); const x=(e.clientX-r.left)*560/r.width; const y=(e.clientY-r.top)*390/r.height; setProbe({x,y}); const d=Math.hypot(x-280,y-195); setZone(d<62?"Центр":d<112?"Парацентр":"Периферия")}}>
          <defs>
            <radialGradient id="baseMap"><stop offset="0" stopColor="#c9fbf5"/><stop offset=".48" stopColor="#7fe3dc"/><stop offset=".78" stopColor="#30aeb1"/><stop offset="1" stopColor="#0d5f77"/></radialGradient>
            <radialGradient id="warm"><stop stopColor="#ff5f68" stopOpacity=".9"/><stop offset=".45" stopColor="#ffad64" stopOpacity=".46"/><stop offset="1" stopColor="#ffad64" stopOpacity="0"/></radialGradient>
            <filter id="blur24"><feGaussianBlur stdDeviation="16"/></filter>
            <clipPath id="mapClip"><circle cx="280" cy="195" r="148"/></clipPath>
          </defs>
          <circle cx="280" cy="195" r="160" fill="#f8ffff" stroke="#d7e8ec" strokeWidth="1.5"/>
          <circle cx="280" cy="195" r="148" fill="url(#baseMap)"/>
          <g clipPath="url(#mapClip)">{heatPoints.map((h,i)=><circle key={i} cx={h.x} cy={h.y} r={h.r} fill="url(#warm)" opacity={h.o+(visit*.035)} filter="url(#blur24)"/>)}</g>
          {[48,92,126].map((r,i)=><circle key={r} cx="280" cy="195" r={r} fill="none" stroke="#eaffff" strokeOpacity={.7-i*.14} strokeWidth="1"/>) }
          {[0,45,90,135].map(a=><line key={a} x1="132" y1="195" x2="428" y2="195" transform={`rotate(${a} 280 195)`} stroke="#eaffff" strokeOpacity=".28"/>) }
          <circle cx="280" cy="195" r={zone==="Центр"?52:zone==="Парацентр"?98:142} fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="7 8" className="selectedRing"/>
          {compare&&<circle cx="280" cy="195" r="118" fill="none" stroke="#142d43" strokeWidth="2" strokeDasharray="3 7" opacity=".65"/>}
          <g className="scanProbe" transform={`translate(${probe.x} ${probe.y})`}><circle r="13" fill="none" stroke="#fff" strokeWidth="2"/><line x1="-20" y1="0" x2="20" y2="0" stroke="#fff"/><line x1="0" y1="-20" x2="0" y2="20" stroke="#fff"/><circle r="3" fill="#fff"/></g>
          <text x="280" y="188" textAnchor="middle" className="mapValue">{zoneData.thickness}</text><text x="280" y="210" textAnchor="middle" className="mapUnit">мкм</text>
          <g className="mapLegend"><rect x="452" y="92" width="10" height="190" rx="5" fill="url(#legend)"/><text x="470" y="103">600</text><text x="470" y="191">550</text><text x="470" y="282">500</text></g>
          <defs><linearGradient id="legend" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ef5964"/><stop offset=".35" stopColor="#f5bd63"/><stop offset=".65" stopColor="#62d8d2"/><stop offset="1" stopColor="#0d6078"/></linearGradient></defs>
        </svg>}
        {mode==="Эндотелий" && <svg className="cellMosaic" viewBox="0 0 560 390" role="img" aria-label="Мозаика эндотелиальных клеток">
          <defs><filter id="cellGlow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
          <rect x="42" y="28" width="476" height="316" rx="30" fill="#071d2a"/>
          {cells.map((c,i)=><polygon key={i} points={`${c.x},${c.y-c.s} ${c.x+c.s*.86},${c.y-c.s*.5} ${c.x+c.s*.86},${c.y+c.s*.5} ${c.x},${c.y+c.s} ${c.x-c.s*.86},${c.y+c.s*.5} ${c.x-c.s*.86},${c.y-c.s*.5}`} fill={c.hot?"rgba(255,104,112,.26)":"rgba(58,204,194,.08)"} stroke={c.hot?"#ff6870":"#55d7ce"} strokeOpacity={c.hot?.95:.42} strokeWidth={c.hot?1.8:1}/>) }
          <text x="62" y="324" className="mosaicLabel">Клеточная мозаика · центральная зона</text>
          <text x="498" y="324" textAnchor="end" className="mosaicDensity">1820 кл/мм²</text>
        </svg>}
        {mode==="Прогноз" && <div className="forecastStage">
          <div className="forecastOrb"><svg viewBox="0 0 260 260"><circle cx="130" cy="130" r="102"/><circle className="riskArc" cx="130" cy="130" r="102" strokeDasharray={`${visits[visit]*6.4} 650`}/></svg><div><strong>{visits[visit]}%</strong><span>риск отторжения</span></div></div>
          <div className="forecastNarrative"><span className="eyebrow">ПРОГНОЗ НА 90 ДНЕЙ</span><h3>{visits[visit]>=65?"Требуется раннее вмешательство":"Состояние контролируемое"}</h3><p>Модель оценивает вероятность иммунологического отторжения с учётом динамики биомаркеров, плотности эндотелия и предыдущих визитов.</p><div className="forecastDrivers"><span><i style={{width:"86%"}}/>IL-6</span><span><i style={{width:"74%"}}/>VEGF</span><span><i style={{width:"61%"}}/>Эндотелий</span></div></div>
        </div>}
        <div className="imagingTools"><button className={compare?"active":""} onClick={()=>setCompare(!compare)}><GitCompare/>Сравнение</button><button onClick={()=>setProbe({x:280,y:195})}><RotateCcw/>Сброс</button></div>
        <div className="zoneTabs">{(["Центр","Парацентр","Периферия"] as const).map(x=><button key={x} className={zone===x?"active":""} onClick={()=>setZone(x)}>{x}</button>)}</div>
      </div>
      <aside className="clinicalInspector">
        <span className="eyebrow">ВЫБРАННАЯ ЗОНА</span><h3>{zone}</h3>
        <div className="inspectorMetrics"><div><span>Толщина</span><strong>{zoneData.thickness}<small> мкм</small></strong></div><div><span>Эндотелий</span><strong>{zoneData.density}<small> кл/мм²</small></strong></div><div><span>Отёк</span><strong className="textValue">{zoneData.edema}</strong></div></div>
        <div className="signalScore"><div><span>Воспалительный сигнал</span><b>{zoneData.signal}%</b></div><em><i style={{width:`${zoneData.signal}%`}}/></em></div>
        <p>Центральная зона демонстрирует наибольшую совокупную нагрузку. Основной вклад формируют рост IL-6 и снижение плотности эндотелиальных клеток.</p>
        <button className="secondaryBtn" onClick={onOpen}>Открыть полное исследование <ArrowRight/></button>
      </aside>
    </div>
    <div className="timeRail"><div className="railTop"><span>Динамика по визитам</span><b>{["Операция","1 месяц","3 месяца","6 месяцев","9 месяцев","12 месяцев","Сегодня"][visit]} · {visits[visit]}%</b></div><input type="range" min="0" max="6" value={visit} onChange={e=>setVisit(Number(e.target.value))}/><div className="railDots">{visits.map((v,i)=><button key={i} className={visit===i?"active":""} onClick={()=>setVisit(i)}><i/><span>{i===0?"Операция":i===6?"Сегодня":`${i*2-1} мес.`}</span></button>)}</div></div>
  </section>;
}

export default function Page(){
  const [view,setView]=useState<View>("home");
  const [selected,setSelected]=useState(0);
  const [menu,setMenu]=useState(false);
  const [search,setSearch]=useState("");
  const [palette,setPalette]=useState(false);
  const [action,setAction]=useState<string|null>(null);
  const [toast,setToast]=useState<string|null>(null);
  const patient=PATIENTS[selected];
  const title = NAV.find(n=>n.id===view)?.label || (view==="help"?"Справка":"Настройки");
  const chooseView=(v:View)=>{setView(v);setMenu(false)};
  const runAction=(name:string)=>setAction(name);
  const notify=(message:string)=>{setToast(message);setTimeout(()=>setToast(null),2200)};

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
        <div className="topRight"><span className="live"><i/>Система работает</span><button className="roundBtn" onClick={()=>runAction("Уведомления")} aria-label="Уведомления"><Bell/></button></div>
      </header>
      <div className="pageTop"><div><span className="eyebrow">AURELIA CLINICAL EDITION</span><h1>{title}</h1></div>{view!=="home"&&<button className="secondaryBtn" onClick={()=>setView("home")}><Home/>На главную</button>}</div>

      {view==="home" && <HomeView patient={patient} onProfile={()=>setView("patients")} onObservation={()=>setView("observation")} onResearch={()=>setView("research")} onAction={runAction} />}
      {view==="patients" && <PatientsView selected={selected} setSelected={setSelected} patient={patient} onAction={runAction}/>} 
      {view==="observation" && <ObservationView patient={patient} onAction={runAction}/>} 
      {view==="research" && <ResearchView onAction={runAction}/>}
      {view==="reports" && <ReportsView patient={patient} notify={notify}/>} 
      {view==="help" && <HelpView/>}
      {view==="settings" && <SettingsView notify={notify}/>}
    </section>

    {toast&&<div className="toast"><CheckCircle2/>{toast}</div>}
    {action&&<ActionDialog title={action} patient={patient} onClose={()=>setAction(null)} onConfirm={()=>{notify("Изменения сохранены");setAction(null)}}/>}
    {palette&&<div className="overlay" onClick={()=>setPalette(false)}><div className="palette" onClick={e=>e.stopPropagation()}><div className="paletteInput"><Search/><input autoFocus value={search} onChange={e=>setSearch(e.target.value)} placeholder="Пациент, раздел или действие…"/><button onClick={()=>setPalette(false)}><X/></button></div><div className="paletteItems">{[...NAV,{id:"settings" as View,label:"Настройки",icon:Settings}].filter(x=>x.label.toLowerCase().includes(search.toLowerCase())).map(x=>{const I=x.icon;return <button key={x.id} onClick={()=>{chooseView(x.id);setPalette(false);setSearch("")}}><I/><span>{x.label}</span><ChevronRight/></button>})}</div></div></div>}
  </main>
}

function HomeView({patient,onProfile,onObservation,onResearch,onAction}:{patient:Patient;onProfile:()=>void;onObservation:()=>void;onResearch:()=>void;onAction:(s:string)=>void}){
  const recommendation=patient.risk>=65?"Контроль через 14 дней":"Плановое наблюдение";
  return <>
    <section className="patientCommand">
      <div className="avatar">{patient.initials}</div>
      <div className="patientIdentity"><span>{patient.id} · {patient.visitDate}</span><h2>{patient.name}</h2><p>{patient.age} лет · {patient.eye} · {patient.procedure}</p></div>
      <div className="commandRisk"><span>Текущий риск</span><strong>{patient.risk}%</strong><small>{patient.status}</small></div>
      <button className="primaryBtn" onClick={onProfile}>Карта пациента <ArrowRight/></button>
    </section>
    <GraftIntelligenceCanvas risk={patient.risk} onOpen={onResearch}/>
    <section className="clinicalStrip">
      <div className="stripLead"><Sparkles/><div><span className="eyebrow">КЛИНИЧЕСКИЙ ПРИОРИТЕТ</span><h3>{recommendation}</h3></div></div>
      <p>Рост воспалительного сигнала в центральной зоне. Следующее действие — повторная оценка биомаркеров через 14 дней.</p>
      <button className="secondaryBtn" onClick={onObservation}>Открыть план <ChevronRight/></button>
    </section>
  </>;
}

function PatientsView({selected,setSelected,patient,onAction}:{selected:number;setSelected:(n:number)=>void;patient:Patient;onAction:(s:string)=>void}){
  return <div className="twoColumn"><section className="listPanel"><div className="sectionHeader"><div><span className="eyebrow">РЕЕСТР</span><h2>Пациенты</h2></div><button className="primaryBtn" onClick={()=>onAction("Новый пациент")}><Plus/>Добавить</button></div><div className="patientList">{PATIENTS.map((p,i)=><button key={p.id} className={selected===i?"selected":""} onClick={()=>setSelected(i)}><span className="listAvatar">{p.initials}</span><span><b>{p.name}</b><small>{p.id} · {p.procedure}</small></span><em className={p.risk>=65?"high":p.risk>=35?"watch":"safe"}>{p.risk}%</em></button>)}</div></section><section className="detailPanel"><div className="detailHero"><div className="avatar large">{patient.initials}</div><div><span className="eyebrow">КАРТА ПАЦИЕНТА</span><h2>{patient.name}</h2><p>{patient.age} лет · {patient.eye} · {patient.procedure}</p></div></div><div className="detailGrid">{[["Дата операции",patient.operationDate],["Последний визит",patient.visitDate],["Лечащий врач",patient.doctor],["Достоверность",patient.confidence+"%"]].map(([a,b])=><div key={a}><span>{a}</span><b>{b}</b></div>)}</div><div className="noteCard"><Stethoscope/><div><b>Текущее состояние</b><p>Требуется сокращение интервала наблюдения и повторная оценка воспалительных биомаркеров.</p></div></div></section></div>;
}

function ObservationView({patient,onAction}:{patient:Patient;onAction:(s:string)=>void}){return <><section className="widePanel"><div className="sectionHeader"><div><span className="eyebrow">ДИНАМИКА</span><h2>История наблюдения</h2></div><button className="secondaryBtn" onClick={()=>onAction("Архив визитов")}><CalendarDays/>Все визиты</button></div><div className="bigChart"><MiniTrend values={patient.history}/><div className="visitLabels"><span>Операция<br/><b>28%</b></span><span>1 мес.<br/><b>34%</b></span><span>3 мес.<br/><b>39%</b></span><span>6 мес.<br/><b>48%</b></span><span>9 мес.<br/><b>58%</b></span><span>12 мес.<br/><b>64%</b></span><span>Сегодня<br/><b>72%</b></span></div></div></section><div className="cards3">{[["IL-6","14,8 пг/мл","+18%"],["VEGF","212 пг/мл","+11%"],["Эндотелий","1820 кл/мм²","−7%"]].map(([a,b,c])=><article key={a}><span>{a}</span><strong>{b}</strong><small>{c} к прошлому визиту</small></article>)}</div><section className="widePanel"><div className="sectionHeader"><div><span className="eyebrow">ПЛАН</span><h2>Следующие действия</h2></div></div><div className="taskList">{["Повторить IL-6 и VEGF через 14 дней","Выполнить спекулярную микроскопию","Провести осмотр офтальмолога"].map((x,i)=><button key={x} onClick={()=>onAction(x)}><CheckCircle2/><span><b>{x}</b><small>{i===0?"Приоритетное действие":"Запланировано"}</small></span><ChevronRight/></button>)}</div></section></>}

function ResearchView({onAction}:{onAction:(s:string)=>void}){return <><div className="researchToolbar"><button className="primaryBtn" onClick={()=>onAction("Новый анализ когорты")}><Plus/>Новый анализ</button><button className="secondaryBtn" onClick={()=>onAction("Сравнение моделей")}><GitCompare/>Сравнить модели</button></div><div className="metricCards">{[["AUROC","0,91"],["Чувствительность","86%"],["Специфичность","82%"],["Brier score","0,11"]].map(([a,b])=><article key={a}><span>{a}</span><strong>{b}</strong><small>валидационная выборка</small></article>)}</div><div className="twoColumn equal"><section className="widePanel"><div className="sectionHeader"><div><span className="eyebrow">КАЧЕСТВО МОДЕЛИ</span><h2>ROC-кривая</h2></div><ShieldCheck/></div><svg className="roc" viewBox="0 0 400 260"><line x1="50" y1="220" x2="365" y2="220"/><line x1="50" y1="25" x2="50" y2="220"/><line className="diag" x1="50" y1="220" x2="365" y2="25"/><path d="M50 220 C65 132 108 76 175 48 C245 20 311 25 365 25"/></svg></section><section className="widePanel"><div className="sectionHeader"><div><span className="eyebrow">ИНТЕРПРЕТАЦИЯ</span><h2>Важность признаков</h2></div><BarChart3/></div><div className="featureBars">{[["IL-6",92],["VEGF",81],["Плотность эндотелия",68],["Эпизод отторжения",56],["Толщина роговицы",43]].map(([n,v])=><div key={String(n)}><span>{n}</span><em><i style={{width:`${v}%`}}/></em><b>{v}%</b></div>)}</div></section></div></>}

function ReportsView({patient,notify}:{patient:Patient;notify:(s:string)=>void}){const download=(title:string)=>{const blob=new Blob([`AURELIA\n${title}\nПациент: ${patient.name}\nРиск: ${patient.risk}%`],{type:"text/plain;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=title.replaceAll(" ","-")+".txt";a.click();URL.revokeObjectURL(url);notify("Отчёт подготовлен к скачиванию")};return <div className="reportsGrid">{["Клиническое заключение","Динамика наблюдения","Отчёт по биомаркерам","Исследовательский отчёт"].map((x,i)=><article key={x}><div className="reportIcon">{i===3?<FlaskConical/>:<FileText/>}</div><span>{i===3?"Исследование":"Пациент: "+patient.id}</span><h2>{x}</h2><p>Готовый структурированный документ для просмотра, печати или экспорта.</p><button className="secondaryBtn" onClick={()=>download(x)}><Download/>Скачать отчёт</button></article>)}</div>}
function HelpView(){const faq=[["Как интерпретировать риск?","Риск отражает прогноз модели на ближайшие 90 дней. Решение принимается врачом с учётом осмотра, динамики и дополнительных исследований."],["Как добавить новый визит?","Откройте раздел «Наблюдение», затем архив визитов и выберите добавление новой записи."],["Как сформировать отчёт?","В разделе «Отчёты» выберите тип документа и нажмите кнопку скачивания."],["Что означает достоверность прогноза?","Это техническая оценка уверенности модели в конкретном прогнозе, а не гарантия клинического исхода."]];return <section className="widePanel prose"><BookOpen/><h2>Справочный центр AURELIA</h2><p>Здесь собраны инструкции по работе с пациентами, интерпретации прогнозов и исследовательским модулем.</p><div className="faq">{faq.map(([q,a])=><details key={q}><summary>{q}<ChevronRight/></summary><p>{a}</p></details>)}</div></section>}
function SettingsView({notify}:{notify:(s:string)=>void}){return <section className="settingsPanel" onChange={()=>notify("Настройка сохранена")}><div><h2>Интерфейс</h2><label><span>Компактный режим</span><input type="checkbox"/></label><label><span>Показывать системный статус</span><input type="checkbox" defaultChecked/></label></div><div><h2>Уведомления</h2><label><span>Критическое изменение риска</span><input type="checkbox" defaultChecked/></label><label><span>Предстоящий визит</span><input type="checkbox" defaultChecked/></label></div><div><h2>Отчёты</h2><label><span>Добавлять объяснение модели</span><input type="checkbox" defaultChecked/></label><label><span>Включать графики</span><input type="checkbox" defaultChecked/></label></div></section>}

function ActionDialog({title,patient,onClose,onConfirm}:{title:string;patient:Patient;onClose:()=>void;onConfirm:()=>void}){return <div className="overlay" onClick={onClose}><div className="actionDialog" onClick={e=>e.stopPropagation()}><div className="dialogTop"><div><span className="eyebrow">AURELIA · ДЕЙСТВИЕ</span><h2>{title}</h2></div><button className="roundBtn" onClick={onClose}><X/></button></div><p>Пациент: <b>{patient.name}</b></p><div className="dialogFields"><label>Комментарий<textarea placeholder="Добавьте клиническую заметку…"/></label><label>Дата выполнения<input type="date"/></label></div><div className="dialogActions"><button className="secondaryBtn" onClick={onClose}>Отмена</button><button className="primaryBtn" onClick={onConfirm}><CheckCircle2/>Подтвердить</button></div></div></div>}
