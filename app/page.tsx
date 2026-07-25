"use client";

import { useMemo, useState } from "react";
import {
  Bell, CalendarDays, ChevronRight, ClipboardList, Eye, FileText,
  History, Home, Microscope, Search, Settings, UserRound, Users
} from "lucide-react";
import { DigitalTwin } from "../components/digital-twin/DigitalTwin";
import { markers, patient, type TwinMode } from "../lib/clinical-data";

type View = "today" | "patients" | "exam" | "documents" | "analytics";

const navigation = [
  ["today", "Сегодня", Home],
  ["patients", "Пациенты", Users],
  ["exam", "Осмотр", Microscope],
  ["documents", "Документы", FileText],
  ["analytics", "Аналитика", History],
] as const;

const keyMetrics = [
  { label: "Центральная пахиметрия", value: "565", unit: "мкм", change: "+27", tone: "warning" },
  { label: "Плотность эндотелия", value: "1820", unit: "кл/мм²", change: "−7%", tone: "danger" },
  { label: "Острота зрения", value: "0,45", unit: "decimal", change: "−0,10", tone: "danger" },
];

const visits = [
  { date: "14 мая", title: "Контрольный осмотр", note: "Риск вырос до 72%", active: true },
  { date: "28 апр", title: "AS-OCT и пахиметрия", note: "CCT 552 мкм" },
  { date: "02 апр", title: "Плановый визит", note: "Состояние стабильное" },
];

function Sidebar({ view, onChange }: { view: View; onChange: (view: View) => void }) {
  return <aside className="sidebar">
    <div className="brand"><div className="brandSymbol">A</div><div><strong>AURELIA</strong><span>Clinical workspace</span></div></div>
    <nav>{navigation.map(([id, label, Icon]) => <button key={id} className={view === id ? "active" : ""} onClick={() => onChange(id)}><Icon/><span>{label}</span></button>)}</nav>
    <div className="sidebarFooter"><button><Settings/><span>Настройки</span></button><div className="doctor"><UserRound/><div><strong>Смирнова Е.А.</strong><span>Офтальмолог</span></div></div></div>
  </aside>;
}

function Header() {
  return <header className="topbar"><div className="globalSearch"><Search/><input placeholder="Найти пациента, исследование или документ" /></div><div className="topbarActions"><span className="systemStatus"><i/>Система доступна</span><button aria-label="Уведомления"><Bell/></button></div></header>;
}

function Today({ onOpenExam }: { onOpenExam: () => void }) {
  const [mode] = useState<TwinMode>("fusion");
  const topSignals = useMemo(() => markers.slice().sort((a,b) => b.weight - a.weight).slice(0,3), []);
  return <div className="workspace">
    <section className="patientBar">
      <div className="patientMain"><div className="patientAvatar">ИИ</div><div><span className="overline">ПАЦИЕНТ · {patient.id}</span><h1>{patient.name}</h1><p>{patient.eye} · {patient.procedure} · операция {patient.operationDate}</p></div></div>
      <div className="attentionBadge"><span>Требует внимания</span><strong>Контроль в течение 48 часов</strong></div>
      <button className="primaryAction" onClick={onOpenExam}>Открыть осмотр<ChevronRight/></button>
    </section>

    <section className="clinicalHero">
      <div className="eyePanel"><div className="panelHeading"><div><span className="overline">DIGITAL CORNEA TWIN</span><h2>Передний отрезок глаза</h2></div><span className="syncState"><i/>Синхронизировано</span></div><div className="eyeStage"><DigitalTwin mode={mode} time={10} selected={0} onSelect={() => {}}/></div></div>
      <aside className="summaryPanel">
        <span className="overline">КЛИНИЧЕСКАЯ СВОДКА</span>
        <div className="riskRow"><div><strong>{patient.risk}%</strong><span>риск осложнения</span></div><em>+9 п.п. с прошлого визита</em></div>
        <h2>Есть признаки ухудшения состояния трансплантата</h2>
        <p>Утолщение роговицы и снижение плотности эндотелия требуют очной оценки и сравнения с предыдущими исследованиями.</p>
        <div className="summaryActions"><button className="primaryAction" onClick={onOpenExam}>Открыть осмотр<ChevronRight/></button><button className="secondaryAction"><History/>Сравнить исследования</button></div>
        <div className="aiNote"><span>Основание сводки</span><p>{topSignals.map(x => x.name).join(" · ")}. Достоверность модели {patient.confidence}%.</p></div>
      </aside>
    </section>

    <section className="metricsSection"><div className="sectionHeader"><div><span className="overline">ИЗМЕНЕНИЯ С ПОСЛЕДНЕГО ВИЗИТА</span><h2>Три показателя, требующие внимания</h2></div><button className="textAction">Все показатели<ChevronRight/></button></div><div className="metricGrid">{keyMetrics.map(metric => <article key={metric.label}><span>{metric.label}</span><div><strong>{metric.value}</strong><small>{metric.unit}</small></div><em className={metric.tone}>{metric.change}</em></article>)}</div></section>

    <section className="lowerGrid"><div className="timelineCard"><div className="sectionHeader"><div><span className="overline">ДИНАМИКА</span><h2>Последние визиты</h2></div><CalendarDays/></div><div className="timeline">{visits.map(visit => <div key={visit.date} className={visit.active ? "active" : ""}><span>{visit.date}</span><i/><div><strong>{visit.title}</strong><p>{visit.note}</p></div></div>)}</div></div><div className="nextStepCard"><ClipboardList/><span className="overline">СЛЕДУЮЩИЙ ШАГ</span><h2>Провести очный контроль</h2><p>Щелевая лампа, пахиметрия, ВГД и оценка эндотелия. После осмотра обновить клинический статус.</p><button className="primaryAction" onClick={onOpenExam}>Начать осмотр<ChevronRight/></button></div></section>
  </div>;
}

function Placeholder({ title, description }: { title: string; description: string }) {
  return <div className="workspace"><section className="placeholder"><span className="overline">AURELIA 6.0</span><h1>{title}</h1><p>{description}</p><button className="primaryAction">Продолжить<ChevronRight/></button></section></div>;
}

export default function Page() {
  const [view, setView] = useState<View>("today");
  const content = view === "today" ? <Today onOpenExam={() => setView("exam")}/> :
    view === "patients" ? <Placeholder title="Пациенты" description="Поиск, список наблюдения и быстрый доступ к карточке пациента."/> :
    view === "exam" ? <Placeholder title="Осмотр пациента" description="Клинические данные, исследования и заключение в одном последовательном рабочем сценарии."/> :
    view === "documents" ? <Placeholder title="Документы" description="Заключения, протоколы и согласия без смешивания с ежедневной клинической работой."/> :
    <Placeholder title="Аналитика" description="Полные биомаркеры и исследовательские данные доступны отдельно от основного рабочего интерфейса."/>;
  return <div className="appShell"><Sidebar view={view} onChange={setView}/><main><Header/>{content}</main></div>;
}
