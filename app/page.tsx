"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Bell,
  BrainCircuit,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  Command,
  FileText,
  FlaskConical,
  Gauge,
  HeartPulse,
  History,
  LayoutDashboard,
  Menu,
  Microscope,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  X,
} from "lucide-react";

type MarkerStatus = "normal" | "watch" | "high";
type Patient = {
  id: string;
  name: string;
  initials: string;
  age: number;
  eye: "OD" | "OS";
  procedure: string;
  operationDate: string;
  doctor: string;
  visitDate: string;
  day: number;
  risk: number;
  trend: number;
  confidence: number;
  history: number[];
  markers: { name: string; value: number; unit: string; status: MarkerStatus; delta: string }[];
};

const PATIENTS: Patient[] = [
  {
    id: "CR-0318",
    name: "Иванов Иван Иванович",
    initials: "ИИ",
    age: 56,
    eye: "OD",
    procedure: "Сквозная кератопластика",
    operationDate: "12.04.2025",
    doctor: "Смирнова Е.А.",
    visitDate: "14.05.2026",
    day: 397,
    risk: 72,
    trend: 14,
    confidence: 93,
    history: [28, 34, 39, 48, 58, 64, 72],
    markers: [
      { name: "IL-6", value: 14.8, unit: "пг/мл", status: "high", delta: "+18%" },
      { name: "VEGF", value: 212, unit: "пг/мл", status: "high", delta: "+11%" },
      { name: "TNF-α", value: 9.4, unit: "пг/мл", status: "watch", delta: "+4%" },
      { name: "Эндотелий", value: 1820, unit: "кл/мм²", status: "watch", delta: "−7%" },
    ],
  },
  {
    id: "CR-0241",
    name: "Петрова Анна Сергеевна",
    initials: "ПА",
    age: 43,
    eye: "OS",
    procedure: "DMEK",
    operationDate: "03.02.2026",
    doctor: "Смирнова Е.А.",
    visitDate: "20.05.2026",
    day: 106,
    risk: 19,
    trend: -6,
    confidence: 96,
    history: [36, 31, 28, 25, 23, 21, 19],
    markers: [
      { name: "IL-6", value: 5.1, unit: "пг/мл", status: "normal", delta: "−8%" },
      { name: "VEGF", value: 74, unit: "пг/мл", status: "normal", delta: "−6%" },
      { name: "TNF-α", value: 3.9, unit: "пг/мл", status: "normal", delta: "−3%" },
      { name: "Эндотелий", value: 2410, unit: "кл/мм²", status: "normal", delta: "+2%" },
    ],
  },
  {
    id: "CR-0196",
    name: "Кузнецов Михаил Олегович",
    initials: "КМ",
    age: 61,
    eye: "OD",
    procedure: "DSAEK",
    operationDate: "18.11.2025",
    doctor: "Орлова Н.В.",
    visitDate: "18.05.2026",
    day: 181,
    risk: 41,
    trend: 4,
    confidence: 90,
    history: [29, 31, 33, 34, 37, 39, 41],
    markers: [
      { name: "IL-6", value: 8.9, unit: "пг/мл", status: "watch", delta: "+5%" },
      { name: "VEGF", value: 131, unit: "пг/мл", status: "watch", delta: "+7%" },
      { name: "TNF-α", value: 6.7, unit: "пг/мл", status: "watch", delta: "+2%" },
      { name: "Эндотелий", value: 2050, unit: "кл/мм²", status: "normal", delta: "−2%" },
    ],
  },
];

function riskLabel(risk: number) {
  if (risk >= 65) return "Высокий риск";
  if (risk >= 35) return "Умеренный риск";
  return "Низкий риск";
}

function RiskArc({ value }: { value: number }) {
  const radius = 72;
  const circumference = Math.PI * radius;
  const offset = circumference * (1 - value / 100);
  return (
    <div className="riskArc">
      <svg viewBox="0 0 180 104" aria-label={`Риск ${value}%`}>
        <path className="arcBase" d="M 18 90 A 72 72 0 0 1 162 90" />
        <path
          className={`arcValue ${value >= 65 ? "danger" : value >= 35 ? "warning" : "safe"}`}
          d="M 18 90 A 72 72 0 0 1 162 90"
          pathLength="100"
          strokeDasharray="100"
          strokeDashoffset={100 - value}
        />
      </svg>
      <div className="riskNumber"><strong>{value}%</strong><span>{riskLabel(value)}</span></div>
    </div>
  );
}

function CorneaProfile({ risk }: { risk: number }) {
  const inflammation = Math.min(92, Math.round(risk * 1.08));
  const endothelial = Math.max(38, 100 - Math.round(risk * 0.57));
  return (
    <div className="corneaProfile">
      <div className="corneaVisual" aria-label="Цифровой профиль трансплантата">
        <div className="corneaGlow" />
        <div className="layer epithelium"><span>Эпителий</span></div>
        <div className="layer stroma"><span>Строма</span></div>
        <div className="layer graft"><span>Трансплантат</span></div>
        <div className="layer endothelium"><span>Эндотелий</span></div>
        <div className="signalDots"><i/><i/><i/><i/><i/></div>
      </div>
      <div className="profileMetrics">
        <div><span>Барьерная функция</span><b>78%</b><em><i style={{ width: "78%" }} /></em></div>
        <div><span>Состояние эндотелия</span><b>{endothelial}%</b><em><i style={{ width: `${endothelial}%` }} /></em></div>
        <div><span>Воспалительная активность</span><b>{inflammation}%</b><em className="warm"><i style={{ width: `${inflammation}%` }} /></em></div>
      </div>
    </div>
  );
}

function TrendChart({ values }: { values: number[] }) {
  const points = values.map((v, i) => `${8 + (i / (values.length - 1)) * 84},${92 - v * 0.75}`).join(" ");
  const area = `8,94 ${points} 92,94`;
  return (
    <svg className="trendChart" viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Динамика риска">
      <defs>
        <linearGradient id="lineGradient" x1="0" x2="1"><stop stopColor="#0f766e"/><stop offset="1" stopColor="#38bdf8"/></linearGradient>
        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#2dd4bf" stopOpacity=".22"/><stop offset="1" stopColor="#2dd4bf" stopOpacity="0"/></linearGradient>
      </defs>
      <g className="chartGrid"><line x1="0" y1="25" x2="100" y2="25"/><line x1="0" y1="50" x2="100" y2="50"/><line x1="0" y1="75" x2="100" y2="75"/></g>
      <polygon points={area} fill="url(#areaGradient)" />
      <polyline points={points} fill="none" stroke="url(#lineGradient)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      {values.map((v, i) => <circle key={i} cx={8 + (i / (values.length - 1)) * 84} cy={92 - v * 0.75} r="1.8" />)}
    </svg>
  );
}

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [commandOpen, setCommandOpen] = useState(false);
  const [mode, setMode] = useState<"clinical" | "research">("clinical");
  const [mobileMenu, setMobileMenu] = useState(false);
  const patient = PATIENTS[selected];

  const assessment = useMemo(() => {
    if (patient.risk >= 65) return "За последние 30 дней отмечается ускорение воспалительной активности. Наибольший вклад в прогноз вносят повышение IL-6 и VEGF, а также снижение плотности эндотелиальных клеток.";
    if (patient.risk >= 35) return "Выявлена умеренная воспалительная активность без признаков резкого ухудшения. Рекомендуется сократить интервал наблюдения и сопоставить показатели с данными визуализации.";
    return "Состояние трансплантата стабильное. Биомаркеры и динамика риска остаются в благоприятном диапазоне, признаков активного иммунологического ответа не выявлено.";
  }, [patient]);

  return (
    <main className="appShell">
      <aside className={`sidebar ${mobileMenu ? "open" : ""}`}>
        <div className="brand"><div className="brandMark">A</div><div><strong>AURELIA</strong><span>Clinical Edition</span></div></div>
        <nav>
          <button className={mode === "clinical" ? "active" : ""} onClick={() => { setMode("clinical"); setMobileMenu(false); }}><Stethoscope/>Рабочее место</button>
          <button><Users/>Пациенты</button>
          <button><History/>Наблюдение</button>
          <button className={mode === "research" ? "active" : ""} onClick={() => { setMode("research"); setMobileMenu(false); }}><FlaskConical/>Исследования</button>
          <button><FileText/>Отчёты</button>
        </nav>
        <div className="sidebarBottom">
          <button><CircleHelp/>Справка</button>
          <button><Settings/>Настройки</button>
          <div className="doctor"><span>ЕС</span><div><b>Елена Смирнова</b><small>Врач-офтальмолог</small></div></div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <button className="mobileMenuButton" onClick={() => setMobileMenu(v => !v)}><Menu/></button>
          <button className="globalSearch" onClick={() => setCommandOpen(true)}><Search/><span>Поиск пациента, отчёта или исследования</span><kbd>⌘ K</kbd></button>
          <div className="topActions"><span className="systemStatus"><i/>Система работает</span><button className="iconButton"><Bell/></button></div>
        </header>

        {mode === "clinical" ? (
          <>
            <section className="patientHeader">
              <div className="patientMain">
                <div className="patientAvatar">{patient.initials}</div>
                <div>
                  <div className="patientMeta"><span>{patient.id}</span><i/>Последний визит: {patient.visitDate}</div>
                  <h1>{patient.name}</h1>
                  <p>{patient.age} лет · {patient.eye} · {patient.procedure}</p>
                </div>
              </div>
              <div className="patientPicker">{PATIENTS.map((p, i) => <button key={p.id} className={i === selected ? "selected" : ""} onClick={() => setSelected(i)}>{p.initials}</button>)}</div>
              <button className="primaryButton"><FileText/>Сформировать отчёт</button>
            </section>

            <section className="summaryStrip">
              <div><span>Дата операции</span><strong>{patient.operationDate}</strong></div>
              <div><span>После операции</span><strong>{patient.day} дней</strong></div>
              <div><span>Лечащий врач</span><strong>{patient.doctor}</strong></div>
              <div><span>Достоверность прогноза</span><strong>{patient.confidence}%</strong></div>
            </section>

            <div className="clinicalGrid">
              <section className="panel riskPanel">
                <div className="panelHeader"><div><span className="eyebrow">ТЕКУЩАЯ ОЦЕНКА</span><h2>Риск отторжения</h2></div><Gauge/></div>
                <RiskArc value={patient.risk}/>
                <div className="riskTrend"><span>Изменение за 30 дней</span><strong className={patient.trend > 0 ? "up" : "down"}>{patient.trend > 0 ? "+" : ""}{patient.trend}%</strong></div>
              </section>

              <section className="panel profilePanel">
                <div className="panelHeader"><div><span className="eyebrow">ЦИФРОВОЙ ПРОФИЛЬ</span><h2>Состояние трансплантата</h2></div><Microscope/></div>
                <CorneaProfile risk={patient.risk}/>
              </section>

              <section className="panel insightPanel">
                <div className="panelHeader"><div><span className="eyebrow">КЛИНИЧЕСКОЕ ЗАКЛЮЧЕНИЕ</span><h2>Оценка системы</h2></div><BrainCircuit/></div>
                <p className="assessment">{assessment}</p>
                <div className="drivers">
                  <span>Ключевые факторы</span>
                  <div><b>IL-6</b><em>повышен</em></div>
                  <div><b>VEGF</b><em>повышен</em></div>
                  <div><b>Плотность эндотелия</b><em>снижается</em></div>
                </div>
                <div className="recommendation"><Sparkles/><div><span>Рекомендуемое действие</span><b>{patient.risk >= 65 ? "Контроль через 14 дней" : patient.risk >= 35 ? "Контроль через 30 дней" : "Плановый контроль через 3 месяца"}</b></div><ChevronRight/></div>
              </section>
            </div>

            <section className="panel timelinePanel">
              <div className="panelHeader"><div><span className="eyebrow">ДИНАМИКА НАБЛЮДЕНИЯ</span><h2>История риска</h2></div><button className="ghostButton">Все визиты <ArrowRight/></button></div>
              <div className="timelineContent">
                <div className="chartWrap"><TrendChart values={patient.history}/><div className="chartLabels"><span>Операция</span><span>1 мес.</span><span>3 мес.</span><span>6 мес.</span><span>9 мес.</span><span>12 мес.</span><span>Сегодня</span></div></div>
                <div className="latestVisit"><span>Последнее измерение</span><strong>{patient.risk}%</strong><p>Риск увеличился на {Math.abs(patient.trend)}% за последние 30 дней.</p><button>Открыть визит <ChevronRight/></button></div>
              </div>
            </section>

            <section className="biomarkerSection">
              <div className="sectionTitle"><div><span className="eyebrow">ЛАБОРАТОРНЫЕ ДАННЫЕ</span><h2>Биомаркеры</h2></div><button className="ghostButton"><CalendarDays/>14 мая 2026</button></div>
              <div className="biomarkerGrid">{patient.markers.map(marker => (
                <article key={marker.name} className={`biomarkerCard ${marker.status}`}>
                  <div className="markerTop"><span>{marker.name}</span><i/></div>
                  <strong>{marker.value}<small>{marker.unit}</small></strong>
                  <div className="markerBottom"><span>к прошлому визиту</span><b>{marker.delta}</b></div>
                </article>
              ))}</div>
            </section>

            <section className="planPanel">
              <div><span className="eyebrow">ПЛАН НАБЛЮДЕНИЯ</span><h2>Следующие действия</h2><p>Рекомендации сформированы на основании клинических данных и прогноза модели.</p></div>
              <div className="checklist">
                <div><i><Check/></i><span><b>Повторная оценка IL-6 и VEGF</b><small>через 14 дней</small></span></div>
                <div><i><Check/></i><span><b>Спекулярная микроскопия</b><small>оценка плотности эндотелия</small></span></div>
                <div><i><Check/></i><span><b>Осмотр офтальмолога</b><small>контроль состояния трансплантата</small></span></div>
              </div>
            </section>
          </>
        ) : <ResearchView/>}
      </section>

      {commandOpen && <div className="overlay" onClick={() => setCommandOpen(false)}><div className="commandPalette" onClick={e => e.stopPropagation()}><div className="commandInput"><Search/><input autoFocus placeholder="Введите имя пациента или команду…"/><button onClick={() => setCommandOpen(false)}><X/></button></div><div className="commandItems"><span>БЫСТРЫЕ ДЕЙСТВИЯ</span>{["Открыть карту пациента", "Сравнить последние визиты", "Сформировать клинический отчёт", "Открыть исследовательский модуль", "Экспортировать данные когорты"].map((item, i) => <button key={item}><i>{i + 1}</i><b>{item}</b><ChevronRight/></button>)}</div></div></div>}
    </main>
  );
}

function ResearchView() {
  return (
    <section className="researchView">
      <div className="researchHero"><div><span className="eyebrow">ИССЛЕДОВАТЕЛЬСКИЙ МОДУЛЬ</span><h1>Аналитика модели</h1><p>Оценка дискриминационной способности, калибровки и клинической полезности модели прогнозирования.</p></div><button className="primaryButton"><FileText/>Экспорт отчёта</button></div>
      <div className="metricGrid">
        <article><span>AUROC</span><strong>0,91</strong><small>95% ДИ: 0,87–0,94</small></article>
        <article><span>Чувствительность</span><strong>86%</strong><small>при пороге 0,42</small></article>
        <article><span>Специфичность</span><strong>82%</strong><small>валидационная выборка</small></article>
        <article><span>Brier score</span><strong>0,11</strong><small>хорошая калибровка</small></article>
      </div>
      <div className="researchCharts">
        <article className="panel"><div className="panelHeader"><div><span className="eyebrow">КАЧЕСТВО МОДЕЛИ</span><h2>ROC-кривая</h2></div><ShieldCheck/></div><svg viewBox="0 0 320 220"><line className="axisLine" x1="35" y1="190" x2="300" y2="190"/><line className="axisLine" x1="35" y1="20" x2="35" y2="190"/><line className="diagLine" x1="35" y1="190" x2="300" y2="20"/><path className="rocLine" d="M35 190 C45 115, 75 65, 128 43 C183 21, 246 20, 300 20"/></svg><div className="chartCaption"><span>Ложноположительная доля</span><b>AUROC 0,91</b></div></article>
        <article className="panel"><div className="panelHeader"><div><span className="eyebrow">КЛИНИЧЕСКАЯ ИНТЕРПРЕТАЦИЯ</span><h2>Важность признаков</h2></div><Activity/></div><div className="featureList">{[["IL-6",92],["VEGF",81],["Плотность эндотелия",68],["Эпизод отторжения",56],["Толщина роговицы",43]].map(([name, value]) => <div key={String(name)}><span>{name}</span><em><i style={{width:`${value}%`}}/></em><b>{value}%</b></div>)}</div></article>
      </div>
    </section>
  );
}
