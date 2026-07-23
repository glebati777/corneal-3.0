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
  const [layer,setLayer] = useState<"Обзор"|"Эпителий"|"Строма"|"Трансплантат"|"Эндотелий">("Обзор");
  const [tilt,setTilt] = useState({x:0,y:0});
  const layers = ["Обзор","Эпителий","Строма","Трансплантат","Эндотелий"] as const;
  const info:Record<string,{title:string;text:string;metric:string}> = {
    "Обзор":{title:"Цифровой профиль",text:"Интерактивная модель объединяет клинические данные, биомаркеры и динамику наблюдения.",metric:`Риск ${risk}%`},
    "Эпителий":{title:"Эпителий",text:"Поверхностный слой без выраженных признаков повреждения.",metric:"Стабильно"},
    "Строма":{title:"Строма",text:"Умеренное увеличение толщины; динамика требует наблюдения.",metric:"565 мкм"},
    "Трансплантат":{title:"Трансплантат",text:"Сохраняется прозрачность, однако воспалительный профиль усиливается.",metric:"68% стабильности"},
    "Эндотелий":{title:"Эндотелий",text:"Плотность клеток снизилась относительно предыдущего визита.",metric:"1820 кл/мм²"},
  };
  return <section className="heroExplorer" onMouseMove={e=>{const r=e.currentTarget.getBoundingClientRect();setTilt({x:(e.clientX-r.left-r.width/2)/r.width*12,y:(e.clientY-r.top-r.height/2)/r.height*10})}} onMouseLeave={()=>setTilt({x:0,y:0})}>
    <div className="heroCopy">
      <span className="eyebrow">ИНТЕРАКТИВНАЯ МОДЕЛЬ</span>
      <h2>{info[layer].title}</h2>
      <p>{info[layer].text}</p>
      <div className="heroMetric"><strong>{info[layer].metric}</strong><span>Обновлено сегодня</span></div>
      <div className="layerTabs">{layers.map(x=><button key={x} className={layer===x?"active":""} onClick={()=>setLayer(x)}>{x}</button>)}</div>
    </div>
    <div className="corneaStage" style={{transform:`rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`}}>
      <div className="orbit orbit1"/><div className="orbit orbit2"/>
      <div className={`corneaLayer epi ${layer==="Эпителий"?"selected":""}`}><span/></div>
      <div className={`corneaLayer stro ${layer==="Строма"?"selected":""}`}><span/></div>
      <div className={`corneaLayer graft ${layer==="Трансплантат"?"selected":""}`}><span/></div>
      <div className={`corneaLayer endo ${layer==="Эндотелий"?"selected":""}`}><span/></div>
      <div className="core"><Eye/></div>
      {layer==="Обзор" && <><i className="signal s1"/><i className="signal s2"/><i className="signal s3"/></>}
    </div>
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
    <section className="patientRibbon">
      <div className="avatar">{patient.initials}</div><div className="patientIdentity"><span>{patient.id} · последний визит {patient.visitDate}</span><h2>{patient.name}</h2><p>{patient.age} лет · {patient.eye} · {patient.procedure}</p></div>
      <div className="riskCompact"><span>Риск отторжения</span><strong>{patient.risk}%</strong><small className={patient.risk>=65?"dangerText":""}>{patient.status}</small></div>
      <div className="ribbonTrend"><MiniTrend values={patient.history}/><span>{patient.trend>0?"+":""}{patient.trend}% за 30 дней</span></div>
      <button className="primaryBtn" onClick={onProfile}>Открыть профиль <ArrowRight/></button>
    </section>
    <div className="homeGrid">
      <CorneaExplorer risk={patient.risk}/>
      <aside className="decisionPanel">
        <span className="eyebrow">ГЛАВНОЕ НА СЕГОДНЯ</span><h2>Клиническое решение</h2>
        <div className="decisionStatus"><Sparkles/><div><b>{recommendation}</b><span>Повторить IL-6, VEGF и оценку эндотелия</span></div></div>
        <p>За последние 30 дней отмечается ускорение воспалительной активности. Основной вклад в прогноз вносят IL-6, VEGF и снижение плотности эндотелия.</p>
        <button className="textBtn" onClick={onObservation}>Открыть план наблюдения <ChevronRight/></button>
      </aside>
    </div>
    <section className="quickActions"><button onClick={onObservation}><History/><span><b>Последний визит</b><small>14 мая 2026</small></span><ChevronRight/></button><button><ClipboardList/><span><b>Сформировать отчёт</b><small>Клиническое заключение</small></span><ChevronRight/></button><button><CalendarDays/><span><b>Следующее действие</b><small>Контроль через 14 дней</small></span><ChevronRight/></button></section>
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
