"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Bell,
  BrainCircuit,
  ChevronDown,
  CircleGauge,
  Command,
  Download,
  FileText,
  FlaskConical,
  HeartPulse,
  LayoutDashboard,
  Menu,
  Microscope,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TrendingDown,
  TrendingUp,
  UserRound,
  Users,
  X,
} from "lucide-react";

type RiskLevel = "Low" | "Moderate" | "High";
type NavKey = "overview" | "patients" | "research" | "governance";

type Visit = {
  date: string;
  il1: number;
  il6: number;
  tnf: number;
  vegf: number;
  tgfb: number;
  risk: number;
};

type Patient = {
  id: string;
  initials: string;
  name: string;
  age: number;
  sex: "M" | "F";
  surgery: "DMEK" | "DSAEK" | "DALK" | "PKP";
  graft: "Primary" | "Repeat";
  daysPostOp: number;
  nextReview: string;
  risk: number;
  probability: number;
  trend: number;
  confidence: number;
  visits: Visit[];
  drivers: { label: string; impact: number; direction: "up" | "down" }[];
};

const patients: Patient[] = [
  {
    id: "CR-0241",
    initials: "AM",
    name: "Alex Morgan",
    age: 58,
    sex: "F",
    surgery: "DMEK",
    graft: "Primary",
    daysPostOp: 92,
    nextReview: "24 Jul",
    risk: 18,
    probability: 14,
    trend: -6,
    confidence: 92,
    visits: [
      { date: "04 May", il1: 4.2, il6: 6.8, tnf: 4.9, vegf: 38, tgfb: 35, risk: 26 },
      { date: "04 Jun", il1: 3.8, il6: 5.9, tnf: 4.3, vegf: 34, tgfb: 37, risk: 22 },
      { date: "04 Jul", il1: 3.2, il6: 5.1, tnf: 3.9, vegf: 31, tgfb: 39, risk: 18 },
    ],
    drivers: [
      { label: "Stable endothelial profile", impact: 9, direction: "down" },
      { label: "VEGF within range", impact: 7, direction: "down" },
      { label: "Primary graft", impact: 5, direction: "down" },
      { label: "Early postoperative phase", impact: 3, direction: "up" },
    ],
  },
  {
    id: "CR-0318",
    initials: "JK",
    name: "James Kim",
    age: 66,
    sex: "M",
    surgery: "PKP",
    graft: "Repeat",
    daysPostOp: 144,
    nextReview: "25 Jul",
    risk: 72,
    probability: 68,
    trend: 14,
    confidence: 88,
    visits: [
      { date: "14 May", il1: 7.4, il6: 10.3, tnf: 8.1, vegf: 68, tgfb: 31, risk: 44 },
      { date: "14 Jun", il1: 9.2, il6: 13.8, tnf: 9.7, vegf: 81, tgfb: 27, risk: 58 },
      { date: "14 Jul", il1: 11.6, il6: 16.4, tnf: 12.2, vegf: 96, tgfb: 24, risk: 72 },
    ],
    drivers: [
      { label: "Severe neovascularization", impact: 19, direction: "up" },
      { label: "Repeat graft", impact: 14, direction: "up" },
      { label: "Rising VEGF", impact: 12, direction: "up" },
      { label: "Low TGF-β", impact: 5, direction: "up" },
    ],
  },
  {
    id: "CR-0196",
    initials: "RS",
    name: "Rina Shah",
    age: 49,
    sex: "F",
    surgery: "DSAEK",
    graft: "Primary",
    daysPostOp: 61,
    nextReview: "28 Jul",
    risk: 41,
    probability: 38,
    trend: 4,
    confidence: 90,
    visits: [
      { date: "08 May", il1: 5.2, il6: 7.1, tnf: 5.8, vegf: 45, tgfb: 34, risk: 33 },
      { date: "08 Jun", il1: 5.8, il6: 8.4, tnf: 6.3, vegf: 51, tgfb: 32, risk: 37 },
      { date: "08 Jul", il1: 6.4, il6: 9.1, tnf: 7.0, vegf: 57, tgfb: 30, risk: 41 },
    ],
    drivers: [
      { label: "Moderate inflammatory trend", impact: 8, direction: "up" },
      { label: "VEGF elevation", impact: 6, direction: "up" },
      { label: "Primary graft", impact: 4, direction: "down" },
      { label: "Stable clinical examination", impact: 3, direction: "down" },
    ],
  },
  {
    id: "CR-0275",
    initials: "LP",
    name: "Leo Park",
    age: 43,
    sex: "M",
    surgery: "DALK",
    graft: "Primary",
    daysPostOp: 188,
    nextReview: "30 Jul",
    risk: 27,
    probability: 23,
    trend: -2,
    confidence: 94,
    visits: [
      { date: "18 May", il1: 4.9, il6: 6.9, tnf: 5.1, vegf: 42, tgfb: 36, risk: 31 },
      { date: "18 Jun", il1: 4.5, il6: 6.2, tnf: 4.8, vegf: 40, tgfb: 37, risk: 29 },
      { date: "18 Jul", il1: 4.1, il6: 5.8, tnf: 4.6, vegf: 39, tgfb: 38, risk: 27 },
    ],
    drivers: [
      { label: "Stable biomarker panel", impact: 8, direction: "down" },
      { label: "DALK procedure", impact: 6, direction: "down" },
      { label: "No prior rejection", impact: 5, direction: "down" },
      { label: "Residual inflammation", impact: 2, direction: "up" },
    ],
  },
];

function levelFor(risk: number): RiskLevel {
  if (risk >= 60) return "High";
  if (risk >= 30) return "Moderate";
  return "Low";
}

function riskClass(risk: number) {
  return risk >= 60 ? "risk-high" : risk >= 30 ? "risk-mid" : "risk-low";
}

function Sparkline({ values }: { values: number[] }) {
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 100;
      const y = 100 - value;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="sparkline" aria-hidden="true">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RiskOrb({ value, label }: { value: number; label: string }) {
  const circumference = 2 * Math.PI * 53;
  const dash = (value / 100) * circumference;
  return (
    <div className="riskOrbWrap">
      <svg viewBox="0 0 120 120" className="riskOrb">
        <circle cx="60" cy="60" r="53" className="riskOrbTrack" />
        <circle
          cx="60"
          cy="60"
          r="53"
          className="riskOrbProgress"
          strokeDasharray={`${dash} ${circumference - dash}`}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className="riskOrbContent">
        <strong>{value}%</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

function TrendPanel({ patient }: { patient: Patient }) {
  const points = patient.visits
    .map((visit, index) => {
      const x = (index / Math.max(patient.visits.length - 1, 1)) * 100;
      const y = 100 - visit.risk;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="trendPanel">
      <div className="sectionHeader compact">
        <div>
          <span className="eyebrow">Longitudinal trajectory</span>
          <h3>Risk evolution</h3>
        </div>
        <div className={`trendChip ${patient.trend > 0 ? "up" : "down"}`}>
          {patient.trend > 0 ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
          {patient.trend > 0 ? "+" : ""}{patient.trend}%
        </div>
      </div>
      <div className="lineChart">
        <div className="chartGrid" />
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6ae7cf" />
              <stop offset="100%" stopColor="#7ba7ff" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(106,231,207,.30)" />
              <stop offset="100%" stopColor="rgba(106,231,207,0)" />
            </linearGradient>
          </defs>
          <polygon points={`0,100 ${points} 100,100`} fill="url(#areaGradient)" />
          <polyline points={points} fill="none" stroke="url(#lineGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {patient.visits.map((visit, index) => {
            const x = (index / Math.max(patient.visits.length - 1, 1)) * 100;
            const y = 100 - visit.risk;
            return <circle key={visit.date} cx={x} cy={y} r="2.5" fill="#dffdf7" />;
          })}
        </svg>
      </div>
      <div className="chartLabels">
        {patient.visits.map((visit) => <span key={visit.date}>{visit.date}</span>)}
      </div>
    </div>
  );
}

function MarkerMatrix({ patient }: { patient: Patient }) {
  const latest = patient.visits[patient.visits.length - 1];
  const rows = [
    ["IL-1β", latest.il1, 8],
    ["IL-6", latest.il6, 10],
    ["TNF-α", latest.tnf, 8],
    ["VEGF", latest.vegf, 60],
    ["TGF-β", latest.tgfb, 40],
  ] as const;

  return (
    <div className="markerMatrix">
      {rows.map(([label, value, reference]) => {
        const ratio = Math.min((value / reference) * 70, 100);
        return (
          <div className="markerRow" key={label}>
            <div>
              <strong>{label}</strong>
              <span>{value}</span>
            </div>
            <div className="markerTrack"><div className="markerFill" style={{ width: `${ratio}%` }} /></div>
            <small>{value > reference ? "Elevated" : "Within range"}</small>
          </div>
        );
      })}
    </div>
  );
}

function DriverBars({ patient }: { patient: Patient }) {
  const max = Math.max(...patient.drivers.map((d) => d.impact));
  return (
    <div className="driverList">
      {patient.drivers.map((driver) => (
        <div className="driverRow" key={driver.label}>
          <div className="driverMeta">
            <span>{driver.label}</span>
            <strong>{driver.direction === "up" ? "+" : "−"}{driver.impact}%</strong>
          </div>
          <div className="driverTrack">
            <div
              className={`driverFill ${driver.direction}`}
              style={{ width: `${(driver.impact / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function Sidebar({ active, setActive, open, setOpen }: { active: NavKey; setActive: (key: NavKey) => void; open: boolean; setOpen: (open: boolean) => void }) {
  const links: { key: NavKey; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: "Command center", icon: <LayoutDashboard size={18} /> },
    { key: "patients", label: "Patient intelligence", icon: <Users size={18} /> },
    { key: "research", label: "Research studio", icon: <FlaskConical size={18} /> },
    { key: "governance", label: "Model governance", icon: <ShieldCheck size={18} /> },
  ];
  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="brand">
        <div className="brandMark"><Sparkles size={18} /></div>
        <div><strong>AURELIA</strong><span>Corneal Intelligence</span></div>
        <button className="iconButton mobileOnly" onClick={() => setOpen(false)}><X size={18} /></button>
      </div>
      <nav>
        <span className="navLabel">Workspace</span>
        {links.map((link) => (
          <button
            key={link.key}
            className={`navItem ${active === link.key ? "active" : ""}`}
            onClick={() => { setActive(link.key); setOpen(false); }}
          >
            {link.icon}<span>{link.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebarPulse">
        <div className="pulseTop"><span className="pulseDot" />System operational</div>
        <p>Clinical demo environment</p>
        <div className="pulseMetric"><span>Model confidence</span><strong>91.2%</strong></div>
      </div>
      <div className="profileCard">
        <div className="avatar">HP</div>
        <div><strong>Dr. Huy Pham</strong><span>Research workspace</span></div>
        <MoreHorizontal size={18} />
      </div>
    </aside>
  );
}

function Overview({ selected, setSelected }: { selected: Patient; setSelected: (patient: Patient) => void }) {
  const highCount = patients.filter((p) => p.risk >= 60).length;
  const avgRisk = Math.round(patients.reduce((sum, p) => sum + p.risk, 0) / patients.length);

  return (
    <>
      <section className="heroPanel">
        <div className="heroCopy">
          <span className="heroKicker"><span />Clinical intelligence, reimagined</span>
          <h1>See rejection risk<br />before it becomes visible.</h1>
          <p>A longitudinal AI workspace for corneal graft surveillance, biomarker interpretation and research-grade decision support.</p>
          <div className="heroActions">
            <button className="primaryButton"><Plus size={17} />New assessment</button>
            <button className="secondaryButton"><FileText size={17} />Generate briefing</button>
          </div>
        </div>
        <div className="heroSignal">
          <div className="signalHalo haloOne" />
          <div className="signalHalo haloTwo" />
          <div className="signalCore">
            <div className="signalInner"><BrainCircuit size={34} /><strong>91.2%</strong><span>system confidence</span></div>
          </div>
          <div className="signalBadge badgeOne"><span>12</span>active alerts</div>
          <div className="signalBadge badgeTwo"><span>284</span>patient journeys</div>
        </div>
      </section>

      <section className="metricStrip">
        <article><div className="metricIcon mint"><Users size={18} /></div><div><span>Active cohort</span><strong>284</strong><small>+18 this quarter</small></div></article>
        <article><div className="metricIcon violet"><CircleGauge size={18} /></div><div><span>Mean risk score</span><strong>{avgRisk}%</strong><small>−3.2% vs last month</small></div></article>
        <article><div className="metricIcon coral"><HeartPulse size={18} /></div><div><span>High-risk cases</span><strong>{highCount}</strong><small>1 requires review</small></div></article>
        <article><div className="metricIcon blue"><Microscope size={18} /></div><div><span>Validated visits</span><strong>1,492</strong><small>98.4% complete</small></div></article>
      </section>

      <section className="mainGrid">
        <div className="patientRail panel">
          <div className="sectionHeader">
            <div><span className="eyebrow">Priority queue</span><h2>Patient intelligence</h2></div>
            <button className="textButton">View all <ArrowRight size={15} /></button>
          </div>
          <div className="patientList">
            {patients.map((patient) => (
              <button key={patient.id} onClick={() => setSelected(patient)} className={`patientRow ${selected.id === patient.id ? "selected" : ""}`}>
                <div className={`patientAvatar ${riskClass(patient.risk)}`}>{patient.initials}</div>
                <div className="patientIdentity"><strong>{patient.name}</strong><span>{patient.id} · {patient.surgery}</span></div>
                <div className="patientMiniTrend"><Sparkline values={patient.visits.map((v) => v.risk)} /></div>
                <div className={`riskPill ${riskClass(patient.risk)}`}><strong>{patient.risk}%</strong><span>{levelFor(patient.risk)}</span></div>
              </button>
            ))}
          </div>
        </div>

        <div className="clinicalCanvas panel">
          <div className="clinicalTop">
            <div className="patientHeadline">
              <div className={`patientAvatar xl ${riskClass(selected.risk)}`}>{selected.initials}</div>
              <div><span className="eyebrow">Selected patient</span><h2>{selected.name}</h2><p>{selected.id} · {selected.age} years · {selected.surgery} · {selected.graft} graft</p></div>
            </div>
            <button className="secondaryButton small"><Download size={16} />Clinical report</button>
          </div>

          <div className="clinicalSummary">
            <RiskOrb value={selected.risk} label={`${levelFor(selected.risk)} risk`} />
            <div className="summaryNarrative">
              <div className="insightBadge"><Sparkles size={15} />Aurelia Insight</div>
              <h3>{selected.trend > 0 ? "Risk is accelerating across recent visits." : "Risk trajectory is improving."}</h3>
              <p>{selected.trend > 0 ? "The current pattern is driven by inflammatory escalation and vascular activity. Consider an earlier review window." : "Biomarkers remain stable with a favourable longitudinal pattern. Continue current surveillance cadence."}</p>
              <div className="summaryFacts">
                <div><span>Rejection probability</span><strong>{selected.probability}%</strong></div>
                <div><span>Model confidence</span><strong>{selected.confidence}%</strong></div>
                <div><span>Next review</span><strong>{selected.nextReview}</strong></div>
              </div>
            </div>
          </div>

          <TrendPanel patient={selected} />
        </div>

        <div className="rightStack">
          <div className="panel compactPanel">
            <div className="sectionHeader compact"><div><span className="eyebrow">Biomarker panel</span><h3>Latest laboratory profile</h3></div><Activity size={18} /></div>
            <MarkerMatrix patient={selected} />
          </div>
          <div className="panel compactPanel">
            <div className="sectionHeader compact"><div><span className="eyebrow">Explainability</span><h3>Primary risk drivers</h3></div><BrainCircuit size={18} /></div>
            <DriverBars patient={selected} />
          </div>
        </div>
      </section>
    </>
  );
}

function PatientsView({ selected, setSelected }: { selected: Patient; setSelected: (patient: Patient) => void }) {
  return (
    <section className="pageSection">
      <div className="pageHero"><div><span className="eyebrow">Patient intelligence</span><h1>Every patient. One longitudinal truth.</h1><p>Unified graft surveillance across clinical events, biomarkers and model-generated risk.</p></div><button className="primaryButton"><Plus size={17} />Add patient</button></div>
      <div className="dataToolbar"><div className="searchBox"><Search size={17} /><input placeholder="Search patients, IDs or procedures" /></div><button className="filterButton">Risk status <ChevronDown size={15} /></button><button className="filterButton">Procedure <ChevronDown size={15} /></button></div>
      <div className="patientTable panel">
        <div className="tableHead"><span>Patient</span><span>Procedure</span><span>Post-op</span><span>Risk</span><span>Trajectory</span><span>Next review</span><span /></div>
        {patients.map((patient) => (
          <button className={`tableRow ${selected.id === patient.id ? "selected" : ""}`} key={patient.id} onClick={() => setSelected(patient)}>
            <div className="tablePatient"><div className={`patientAvatar ${riskClass(patient.risk)}`}>{patient.initials}</div><div><strong>{patient.name}</strong><span>{patient.id}</span></div></div>
            <span>{patient.surgery} · {patient.graft}</span>
            <span>{patient.daysPostOp} days</span>
            <div className={`riskPill ${riskClass(patient.risk)}`}><strong>{patient.risk}%</strong><span>{levelFor(patient.risk)}</span></div>
            <span className={patient.trend > 0 ? "positiveTrend" : "negativeTrend"}>{patient.trend > 0 ? "+" : ""}{patient.trend}%</span>
            <span>{patient.nextReview}</span>
            <MoreHorizontal size={17} />
          </button>
        ))}
      </div>
    </section>
  );
}

function ResearchView() {
  return (
    <section className="pageSection">
      <div className="pageHero"><div><span className="eyebrow">Research studio</span><h1>Evidence, not decoration.</h1><p>Model performance, calibration and cohort-level survival analysis in one governed workspace.</p></div><button className="secondaryButton"><Download size={17} />Export cohort</button></div>
      <div className="researchGrid">
        <div className="panel researchPanel wide"><div className="sectionHeader"><div><span className="eyebrow">Discrimination</span><h2>Receiver operating characteristic</h2></div><div className="bigMetric"><strong>0.87</strong><span>AUC</span></div></div><div className="researchChart"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><line x1="0" y1="100" x2="100" y2="0" className="diagonal" /><polyline points="0,100 9,68 20,45 36,27 55,15 78,6 100,0" className="rocLine" /></svg></div><div className="chartFooter"><span>1 − specificity</span><span>Sensitivity</span></div></div>
        <div className="panel researchPanel"><div className="sectionHeader compact"><div><span className="eyebrow">Calibration</span><h3>Observed vs predicted</h3></div><span className="statusTag">Brier 0.11</span></div><div className="researchChart smallChart"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><line x1="0" y1="100" x2="100" y2="0" className="diagonal" /><polyline points="0,98 20,82 40,64 60,42 80,21 100,3" className="calibrationLine" /></svg></div></div>
        <div className="panel researchPanel"><div className="sectionHeader compact"><div><span className="eyebrow">Survival</span><h3>Graft survival curve</h3></div><span className="statusTag">12 months</span></div><div className="researchChart smallChart"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points="0,5 15,5 15,12 32,12 32,21 50,21 50,33 72,33 72,49 100,49" className="survivalLine" /></svg></div></div>
        <div className="panel researchPanel wide"><div className="sectionHeader"><div><span className="eyebrow">Population distribution</span><h2>Risk stratification</h2></div><span className="statusTag">n = 284</span></div><div className="distributionBars"><div><span>Low risk</span><div className="distributionTrack"><i style={{ width: "48%" }} /></div><strong>48%</strong></div><div><span>Moderate risk</span><div className="distributionTrack"><i style={{ width: "37%" }} /></div><strong>37%</strong></div><div><span>High risk</span><div className="distributionTrack"><i style={{ width: "15%" }} /></div><strong>15%</strong></div></div></div>
      </div>
      <div className="disclaimer"><ShieldCheck size={18} /><div><strong>Research-use environment</strong><p>All metrics are demonstrative and must not be interpreted as externally validated clinical performance.</p></div></div>
    </section>
  );
}

function GovernanceView() {
  const cards = [
    ["Model card", "Version 0.8.4", "Current", BrainCircuit],
    ["Dataset lineage", "284 patients · 1,492 visits", "Complete", Microscope],
    ["Bias review", "Last reviewed 18 Jul 2026", "Passed", ShieldCheck],
    ["Clinical protocol", "Research use only", "Restricted", Stethoscope],
  ] as const;
  return (
    <section className="pageSection">
      <div className="pageHero"><div><span className="eyebrow">Model governance</span><h1>Trust is a product feature.</h1><p>Transparent model lineage, data quality, limitations and validation readiness.</p></div></div>
      <div className="governanceGrid">
        {cards.map(([title, value, status, Icon]) => <article className="panel governanceCard" key={title}><div className="governanceIcon"><Icon size={21} /></div><span className="eyebrow">{title}</span><h3>{value}</h3><div className="governanceStatus"><span />{status}</div></article>)}
      </div>
      <div className="panel governanceDetail"><div className="sectionHeader"><div><span className="eyebrow">Deployment readiness</span><h2>Clinical validation pathway</h2></div><span className="statusTag warning">3 of 6 complete</span></div><div className="readinessList">{["Technical validation", "Internal retrospective validation", "Calibration review", "Prospective pilot", "External validation", "Regulatory assessment"].map((item, index) => <div className={`readinessItem ${index < 3 ? "done" : ""}`} key={item}><span>{index < 3 ? "✓" : index + 1}</span><strong>{item}</strong><small>{index < 3 ? "Complete" : "Pending"}</small></div>)}</div></div>
    </section>
  );
}

export default function Home() {
  const [active, setActive] = useState<NavKey>("overview");
  const [selected, setSelected] = useState<Patient>(patients[1]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  const title = useMemo(() => ({ overview: "Command center", patients: "Patient intelligence", research: "Research studio", governance: "Model governance" }[active]), [active]);

  return (
    <div className="appShell">
      <Sidebar active={active} setActive={setActive} open={menuOpen} setOpen={setMenuOpen} />
      <main className="workspace">
        <header className="topbar">
          <div className="topbarLeft"><button className="iconButton mobileOnly" onClick={() => setMenuOpen(true)}><Menu size={19} /></button><div><span>Workspace</span><strong>{title}</strong></div></div>
          <div className="topbarActions">
            <button className="commandSearch" onClick={() => setCommandOpen(true)}><Search size={16} /><span>Search anything</span><kbd><Command size={12} />K</kbd></button>
            <button className="iconButton"><Bell size={18} /><i /></button>
            <button className="topAvatar">HP</button>
          </div>
        </header>
        <div className="content">
          {active === "overview" && <Overview selected={selected} setSelected={setSelected} />}
          {active === "patients" && <PatientsView selected={selected} setSelected={setSelected} />}
          {active === "research" && <ResearchView />}
          {active === "governance" && <GovernanceView />}
        </div>
      </main>
      {commandOpen && <div className="commandOverlay" onClick={() => setCommandOpen(false)}><div className="commandPalette" onClick={(event) => event.stopPropagation()}><div className="commandInput"><Search size={18} /><input autoFocus placeholder="Search patients, actions or research views…" /><button onClick={() => setCommandOpen(false)}>ESC</button></div><div className="commandGroup"><span>Quick actions</span><button><Plus size={17} />Create new assessment</button><button><UserRound size={17} />Open patient CR-0318</button><button><FileText size={17} />Generate clinical briefing</button></div></div></div>}
    </div>
  );
}
