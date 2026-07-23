"use client";

import { useMemo, useState } from "react";
import {
  Activity, BarChart3, Bell, BookOpen, ChevronRight, CircleHelp, Download,
  FileText, FlaskConical, Home, Layers3, Microscope, Plus, Search, Settings,
  ShieldCheck, Sparkles, Stethoscope, UserRound, Users, X, History, SlidersHorizontal,
  Eye, CalendarDays, CheckCircle2, Printer, Dna, Gauge, ScanLine
} from "lucide-react";

type View = "home"|"patients"|"observation"|"research"|"reports"|"help"|"settings";
type Marker = {name:string; group:string; value:number; unit:string; ref:string; delta:number; weight:number};

type Patient = {
  id:string; name:string; age:number; eye:"OD"|"OS"; procedure:string; operationDate:string;
  doctor:string; risk:number; confidence:number; status:string; history:number[];
};

const patient: Patient = {
  id:"CR-0318", name:"Иванов Иван Иванович", age:56, eye:"OD",
  procedure:"Сквозная кератопластика", operationDate:"12.04.2025",
  doctor:"Смирнова Е.А.", risk:72, confidence:93, status:"Требует внимания",
  history:[24,29,36,44,53,63,72]
};

const markers: Marker[] = [
  {name:"IL-1β",group:"Провоспалительные",value:8.7,unit:"пг/мл",ref:"0–5",delta:19,weight:63},
  {name:"IL-2",group:"Т-клеточный ответ",value:11.2,unit:"пг/мл",ref:"2–10",delta:8,weight:38},
  {name:"IL-4",group:"Регуляторные",value:3.8,unit:"пг/мл",ref:"2–6",delta:-3,weight:16},
  {name:"IL-6",group:"Провоспалительные",value:14.8,unit:"пг/мл",ref:"0–7",delta:18,weight:92},
  {name:"IL-8",group:"Хемокины",value:19.4,unit:"пг/мл",ref:"0–15",delta:13,weight:59},
  {name:"IL-10",group:"Регуляторные",value:4.1,unit:"пг/мл",ref:"3–9",delta:-7,weight:29},
  {name:"IL-12p70",group:"Т-клеточный ответ",value:6.3,unit:"пг/мл",ref:"1–5",delta:9,weight:41},
  {name:"IL-17A",group:"Th17-ответ",value:9.6,unit:"пг/мл",ref:"0–6",delta:16,weight:71},
  {name:"IL-18",group:"Провоспалительные",value:168,unit:"пг/мл",ref:"80–150",delta:11,weight:54},
  {name:"IL-23",group:"Th17-ответ",value:14.2,unit:"пг/мл",ref:"0–10",delta:14,weight:66},
  {name:"TNF-α",group:"Провоспалительные",value:9.4,unit:"пг/мл",ref:"0–8",delta:10,weight:57},
  {name:"IFN-γ",group:"Т-клеточный ответ",value:17.5,unit:"пг/мл",ref:"4–15",delta:12,weight:62},
  {name:"VEGF-A",group:"Ангиогенез",value:212,unit:"пг/мл",ref:"50–180",delta:11,weight:81},
  {name:"MCP-1",group:"Хемокины",value:286,unit:"пг/мл",ref:"120–250",delta:14,weight:48},
  {name:"MMP-9",group:"Ремоделирование",value:48,unit:"нг/мл",ref:"15–40",delta:15,weight:52},
  {name:"CRP",group:"Системное воспаление",value:6.4,unit:"мг/л",ref:"0–5",delta:7,weight:27},
  {name:"Плотность эндотелия",group:"Структурные",value:1820,unit:"кл/мм²",ref:">2000",delta:-7,weight:74},
  {name:"Толщина роговицы",group:"Структурные",value:565,unit:"мкм",ref:"500–550",delta:5,weight:46},
];

const nav = [
  ["home","Главная",Home],["patients","Пациенты",Users],["observation","Наблюдение",History],
  ["research","Исследования",FlaskConical],["reports","Отчёты",FileText]
] as const;

function RiskCore({risk}:{risk:number}){
  const [mode,setMode]=useState<"Риск"|"Иммунный профиль"|"Траектория">("Риск");
  const [focus,setFocus]=useState(0);
  const top=markers.slice().sort((a,b)=>b.weight-a.weight).slice(0,8);
  return <section className="heroModel">
    <div className="heroTop">
      <div><span className="eyebrow">AURELIA INTELLIGENCE CORE</span><h2>Цифровая модель трансплантата</h2></div>
      <div className="segmented">{(["Риск","Иммунный профиль","Траектория"] as const).map(m=><button key={m} onClick={()=>setMode(m)} className={mode===m?"active":""}>{m}</button>)}</div>
    </div>
    <div className="modelGrid">
      <div className="modelStage">
        <div className="ambient a1"/><div className="ambient a2"/>
        {mode==="Риск" && <div className="riskUniverse">
          <svg viewBox="0 0 500 500" className="orbitalSvg">
            <defs>
              <radialGradient id="core"><stop offset="0" stopColor="#fff"/><stop offset=".45" stopColor="#c9fff8"/><stop offset="1" stopColor="#0d6d78"/></radialGradient>
              <linearGradient id="ring"><stop stopColor="#4ee1cf"/><stop offset=".55" stopColor="#5ba6ff"/><stop offset="1" stopColor="#ff7c8c"/></linearGradient>
              <filter id="glow"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <circle cx="250" cy="250" r="174" fill="none" stroke="#dce9ee" strokeWidth="1" strokeDasharray="2 9"/>
            <circle cx="250" cy="250" r="136" fill="none" stroke="url(#ring)" strokeWidth="18" strokeLinecap="round" strokeDasharray={`${risk*8.5} 900`} transform="rotate(-90 250 250)" filter="url(#glow)"/>
            <circle cx="250" cy="250" r="104" fill="url(#core)" opacity=".98"/>
            <circle cx="250" cy="250" r="78" fill="#061e2a" opacity=".9"/>
            {top.map((m,i)=>{const a=(i/top.length)*Math.PI*2-Math.PI/2;const r=174;const x=250+Math.cos(a)*r;const y=250+Math.sin(a)*r;return <g key={m.name} className="node" onClick={()=>setFocus(i)}><line x1="250" y1="250" x2={x} y2={y} stroke="#9bc3cd" strokeOpacity=".22"/><circle cx={x} cy={y} r={focus===i?14:9} fill={m.delta>10?"#ff7c8c":"#54d7ca"}/><text x={x} y={y+26} textAnchor="middle">{m.name}</text></g>})}
          </svg>
          <div className="coreLabel"><strong>{risk}%</strong><span>риск отторжения</span><small>горизонт 90 дней</small></div>
        </div>}
        {mode==="Иммунный профиль" && <div className="constellation">
          {top.map((m,i)=><button key={m.name} onClick={()=>setFocus(i)} className={focus===i?"active":""} style={{left:`${12+(i%4)*23}%`,top:`${16+Math.floor(i/4)*42+(i%2)*7}%`}}><i style={{transform:`scale(${.75+m.weight/220})`}}/><span>{m.name}</span><b>{m.value}</b></button>)}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">{top.slice(0,-1).map((_,i)=><line key={i} x1={18+(i%4)*23} y1={22+Math.floor(i/4)*42+(i%2)*7} x2={18+((i+1)%4)*23} y2={22+Math.floor((i+1)/4)*42+((i+1)%2)*7}/>)}</svg>
        </div>}
        {mode==="Траектория" && <div className="trajectory"><svg viewBox="0 0 700 300" preserveAspectRatio="none"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#39cabd" stopOpacity=".35"/><stop offset="1" stopColor="#39cabd" stopOpacity="0"/></linearGradient></defs><path className="area" d="M30 250 C120 230 160 215 220 188 C300 150 340 130 410 116 C500 98 565 67 670 40 L670 280 L30 280 Z"/><path d="M30 250 C120 230 160 215 220 188 C300 150 340 130 410 116 C500 98 565 67 670 40"/><line x1="30" y1="120" x2="670" y2="120" className="threshold"/><text x="40" y="112">клинический порог</text></svg><div className="timeLabels"><span>Операция</span><span>3 мес.</span><span>6 мес.</span><span>9 мес.</span><span>12 мес.</span><span>Сегодня</span></div></div>}
      </div>
      <aside className="modelInspector">
        <span className="eyebrow">ВЫБРАННЫЙ СИГНАЛ</span><h3>{top[focus].name}</h3>
        <div className="signalValue"><strong>{top[focus].value}</strong><span>{top[focus].unit}</span></div>
        <p>{top[focus].group}. Изменение к предыдущему визиту: <b>{top[focus].delta>0?"+":""}{top[focus].delta}%</b>.</p>
        <div className="driver"><span>Вклад в прогноз</span><b>{top[focus].weight}%</b><em><i style={{width:`${top[focus].weight}%`}}/></em></div>
        <button className="ghostButton"><ScanLine/>Открыть полный профиль<ChevronRight/></button>
      </aside>
    </div>
  </section>
}

function Shell(){
  const [view,setView]=useState<View>("home"); const [query,setQuery]=useState(""); const [toast,setToast]=useState("");
  const notify=(s:string)=>{setToast(s);setTimeout(()=>setToast(""),2200)};
  return <div className="appShell">
    <aside className="sidebar">
      <div className="brand"><div className="brandMark">A</div><div><b>AURELIA</b><span>Clinical Intelligence</span></div></div>
      <nav>{nav.map(([id,label,Icon])=><button key={id} className={view===id?"active":""} onClick={()=>setView(id)}><Icon/><span>{label}</span></button>)}</nav>
      <div className="sideBottom"><button className={view==="help"?"active":""} onClick={()=>setView("help")}><CircleHelp/><span>Справка</span></button><button className={view==="settings"?"active":""} onClick={()=>setView("settings")}><Settings/><span>Настройки</span></button><div className="doctor"><UserRound/><div><b>Смирнова Е.А.</b><span>Офтальмолог</span></div></div></div>
    </aside>
    <main>
      <header><div className="search"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Поиск пациента, отчёта или показателя"/></div><button className="iconButton" onClick={()=>notify("Новых уведомлений нет")}><Bell/></button><button className="statusPill"><i/>Система готова</button></header>
      <div className="content">
        {view==="home"&&<Home notify={notify}/>} {view==="patients"&&<Patients/>} {view==="observation"&&<Observation/>}
        {view==="research"&&<Research/>} {view==="reports"&&<Reports notify={notify}/>} {view==="help"&&<Help/>} {view==="settings"&&<SettingsView notify={notify}/>} 
      </div>
      {toast&&<div className="toast"><CheckCircle2/>{toast}</div>}
    </main>
  </div>
}

function Home({notify}:{notify:(s:string)=>void}){return <>
  <section className="patientBar"><div className="patientIdentity"><div className="avatar">ИИ</div><div><span>{patient.id} · визит 14.05.2026</span><h1>{patient.name}</h1><p>{patient.age} лет · {patient.eye} · {patient.procedure}</p></div></div><div className="patientRisk"><span>Текущий риск</span><strong>{patient.risk}%</strong><small>{patient.status}</small></div><button className="primaryButton" onClick={()=>notify("Карта пациента открыта")}><Eye/>Открыть карту</button></section>
  <RiskCore risk={patient.risk}/>
  <section className="decisionStrip"><div><Sparkles/><span>Клинический приоритет</span><b>Контроль через 14 дней</b></div><p>Рост IL-6, IL-17A и VEGF-A вместе со снижением плотности эндотелия формирует неблагоприятную траекторию.</p><button onClick={()=>notify("План наблюдения открыт")}>Открыть план<ChevronRight/></button></section>
</>}

function Patients(){return <div className="split"><section className="panel"><div className="sectionTitle"><div><span className="eyebrow">РЕЕСТР</span><h2>Пациенты</h2></div><button className="primaryButton"><Plus/>Добавить</button></div>{[patient,{...patient,id:"CR-0241",name:"Петрова Анна Сергеевна",risk:19,status:"Стабильно"},{...patient,id:"CR-0196",name:"Кузнецов Михаил Олегович",risk:41,status:"Наблюдение"}].map((p,i)=><button className="patientRow" key={p.id}><span>{i===0?"ИИ":i===1?"ПА":"КМ"}</span><div><b>{p.name}</b><small>{p.id} · {p.procedure}</small></div><em>{p.risk}%</em><ChevronRight/></button>)}</section><section className="panel detail"><span className="eyebrow">КАРТА ПАЦИЕНТА</span><h2>{patient.name}</h2><p>{patient.procedure}, {patient.eye}</p><div className="facts"><div><span>Дата операции</span><b>{patient.operationDate}</b></div><div><span>Лечащий врач</span><b>{patient.doctor}</b></div><div><span>Риск</span><b>{patient.risk}%</b></div><div><span>Достоверность</span><b>{patient.confidence}%</b></div></div><div className="clinicalNote"><Stethoscope/><div><b>Клинический статус</b><p>Требуется сокращение интервала наблюдения и расширенная оценка иммунного профиля.</p></div></div></section></div>}

function Observation(){const [group,setGroup]=useState("Все");const groups=["Все",...Array.from(new Set(markers.map(m=>m.group)))];const filtered=group==="Все"?markers:markers.filter(m=>m.group===group);return <>
  <section className="panel"><div className="sectionTitle"><div><span className="eyebrow">МОЛЕКУЛЯРНЫЙ ПРОФИЛЬ</span><h2>Биомаркеры и клинические признаки</h2></div><button className="secondaryButton"><CalendarDays/>Архив визитов</button></div><div className="filterRow">{groups.map(g=><button key={g} onClick={()=>setGroup(g)} className={group===g?"active":""}>{g}</button>)}</div><div className="markerTable"><div className="markerHead"><span>Показатель</span><span>Значение</span><span>Референс</span><span>Динамика</span><span>Вклад</span></div>{filtered.map(m=><div className="markerRow" key={m.name}><span><b>{m.name}</b><small>{m.group}</small></span><span>{m.value} {m.unit}</span><span>{m.ref}</span><span className={m.delta>0?"up":"down"}>{m.delta>0?"+":""}{m.delta}%</span><span><em><i style={{width:`${m.weight}%`}}/></em>{m.weight}%</span></div>)}</div></section>
</>}

function Research(){return <><div className="metrics">{[["AUROC","0,91"],["Чувствительность","86%"],["Специфичность","82%"],["Brier score","0,11"]].map(([a,b])=><article key={a}><span>{a}</span><strong>{b}</strong><small>валидационная выборка</small></article>)}</div><div className="split equal"><section className="panel"><div className="sectionTitle"><div><span className="eyebrow">КАЧЕСТВО МОДЕЛИ</span><h2>ROC-кривая</h2></div><ShieldCheck/></div><svg className="roc" viewBox="0 0 500 320"><line x1="60" y1="270" x2="450" y2="270"/><line x1="60" y1="40" x2="60" y2="270"/><line className="diag" x1="60" y1="270" x2="450" y2="40"/><path d="M60 270 C78 170 130 100 215 65 C300 28 382 42 450 40"/></svg></section><section className="panel"><div className="sectionTitle"><div><span className="eyebrow">ОБЪЯСНЕНИЕ</span><h2>Важность признаков</h2></div><BarChart3/></div><div className="importance">{markers.slice().sort((a,b)=>b.weight-a.weight).slice(0,10).map(m=><div key={m.name}><span>{m.name}</span><em><i style={{width:`${m.weight}%`}}/></em><b>{m.weight}%</b></div>)}</div></section></div></>}

function makeReport(title:string,kind:string){
  const rows=markers.map(m=>`<tr><td>${m.name}</td><td>${m.value} ${m.unit}</td><td>${m.ref}</td><td>${m.delta>0?"+":""}${m.delta}%</td><td>${m.weight}%</td></tr>`).join("");
  const html=`<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>${title}</title><style>body{font-family:Arial,sans-serif;margin:42px;color:#142a36}h1{font-size:30px}h2{margin-top:34px}header{border-bottom:3px solid #0f766e;padding-bottom:18px}small{color:#607582}table{width:100%;border-collapse:collapse;margin-top:16px}td,th{padding:10px;border-bottom:1px solid #dce6ea;text-align:left}.risk{font-size:44px;color:#c7495b}.box{padding:18px;background:#f3f8f8;border-radius:14px}.footer{margin-top:42px;font-size:12px;color:#748590}@media print{button{display:none}}</style></head><body><header><b>AURELIA Clinical Intelligence</b><h1>${title}</h1><small>Сформировано 23.07.2026 · Документ: ${kind}</small></header><h2>Пациент</h2><p><b>${patient.name}</b><br>${patient.id} · ${patient.age} лет · ${patient.eye}<br>${patient.procedure}</p><div class="box"><div>Прогнозируемый риск</div><div class="risk">${patient.risk}%</div><b>Достоверность ${patient.confidence}%</b></div><h2>Клиническое заключение</h2><p>Выявлена неблагоприятная динамика воспалительного профиля. Наибольший вклад в прогноз вносят IL-6, VEGF-A, плотность эндотелия, IL-17A и IL-23. Рекомендуется контроль через 14 дней, повторное исследование панели цитокинов и спекулярная микроскопия.</p><h2>Лабораторные и структурные признаки</h2><table><thead><tr><th>Показатель</th><th>Значение</th><th>Референс</th><th>Динамика</th><th>Вклад</th></tr></thead><tbody>${rows}</tbody></table><h2>План наблюдения</h2><ol><li>Повторная панель цитокинов через 14 дней.</li><li>Спекулярная микроскопия эндотелия.</li><li>Оценка толщины роговицы и признаков отёка.</li><li>Очный осмотр офтальмолога.</li></ol><div class="footer">Отчёт является инструментом поддержки принятия решений и не заменяет клиническое заключение врача.</div></body></html>`;
  const blob=new Blob([html],{type:"text/html;charset=utf-8"}); const url=URL.createObjectURL(blob); const a=document.createElement("a");a.href=url;a.download=title.replaceAll(" ","-")+".html";a.click();URL.revokeObjectURL(url);
}

function Reports({notify}:{notify:(s:string)=>void}){const reports=[{t:"Полное клиническое заключение",d:"Пациент, прогноз, ключевые факторы, рекомендации и план наблюдения.",i:Stethoscope},{t:"Расширенный иммунологический профиль",d:"18 биомаркеров, референсы, динамика и вклад каждого признака.",i:Dna},{t:"Отчёт по динамике трансплантата",d:"Визиты, риск, структурные показатели и ключевые события.",i:Activity},{t:"Валидационный отчёт модели",d:"ROC, калибровка, метрики, важность признаков и ограничения.",i:FlaskConical}];return <div className="reportGrid">{reports.map((r,i)=>{const Icon=r.i;return <article key={r.t}><div className="reportBadge"><Icon/></div><span>{i===3?"Исследовательский документ":patient.id}</span><h2>{r.t}</h2><p>{r.d}</p><div className="reportMeta"><span>HTML · печать в PDF</span><span>Полная версия</span></div><div className="reportActions"><button onClick={()=>{makeReport(r.t,String(i));notify("Отчёт сформирован")}}><Download/>Скачать</button><button onClick={()=>{makeReport(r.t,String(i));notify("Открыт режим печати")}}><Printer/>Печать</button></div></article>})}</div>}

function Help(){return <section className="panel prose"><BookOpen/><span className="eyebrow">СПРАВОЧНЫЙ ЦЕНТР</span><h2>Работа с AURELIA</h2>{["Интерпретация риска","Биомаркеры и референсы","Формирование отчёта","Ограничения модели"].map(x=><details key={x}><summary>{x}<ChevronRight/></summary><p>Раздел содержит клинические и технические пояснения, необходимые для корректной интерпретации результатов системы.</p></details>)}</section>}
function SettingsView({notify}:{notify:(s:string)=>void}){return <section className="settingsCards">{["Интерфейс","Уведомления","Отчёты","Безопасность"].map((x,i)=><article key={x}><h2>{x}</h2><label><span>{i===0?"Компактный режим":i===1?"Критические изменения":i===2?"Включать графики":"Двухфакторный вход"}</span><input type="checkbox" defaultChecked={i>0} onChange={()=>notify("Настройка сохранена")}/></label><label><span>{i===0?"Плавные анимации":i===1?"Напоминания о визитах":i===2?"Объяснение модели":"Журнал действий"}</span><input type="checkbox" defaultChecked onChange={()=>notify("Настройка сохранена")}/></label></article>)}</section>}

export default function Page(){return <Shell/>}
