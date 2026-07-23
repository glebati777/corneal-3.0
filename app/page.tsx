"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, Bell, BookOpen, CalendarDays, CheckCircle2, ChevronRight, CircleHelp,
  Download, Eye, FileText, FlaskConical, Home as HomeIcon, Microscope, Plus,
  Printer, Search, Settings, ShieldCheck, Sparkles, Stethoscope, UserRound, Users,
  History, SlidersHorizontal, X, Dna, Layers3, ScanLine, Network, Clock3,
  ChartNoAxesCombined, ClipboardList, ArrowUpRight, RotateCcw, Maximize2
} from "lucide-react";

type View = "home" | "patients" | "observation" | "research" | "reports" | "help" | "settings";
type TwinMode = "anatomy" | "heat" | "network" | "timeline" | "forecast";
type Marker = { name: string; group: string; value: number; unit: string; ref: string; delta: number; weight: number; status: "high" | "low" | "normal" };

type Patient = {
  id: string; name: string; age: number; eye: "OD" | "OS"; procedure: string; operationDate: string;
  doctor: string; risk: number; confidence: number; status: string; history: number[];
};

const patient: Patient = {
  id: "CR-0318", name: "Иванов Иван Иванович", age: 56, eye: "OD",
  procedure: "Сквозная кератопластика", operationDate: "12.04.2025",
  doctor: "Смирнова Е.А.", risk: 72, confidence: 93, status: "Требует внимания",
  history: [24, 29, 36, 44, 53, 63, 72]
};

const markers: Marker[] = [
  {name:"IL-1β",group:"Провоспалительные",value:8.7,unit:"пг/мл",ref:"0–5",delta:19,weight:63,status:"high"},
  {name:"IL-2",group:"Т-клеточный ответ",value:11.2,unit:"пг/мл",ref:"2–10",delta:8,weight:38,status:"high"},
  {name:"IL-4",group:"Регуляторные",value:3.8,unit:"пг/мл",ref:"2–6",delta:-3,weight:16,status:"normal"},
  {name:"IL-5",group:"Th2-ответ",value:5.7,unit:"пг/мл",ref:"1–5",delta:4,weight:22,status:"high"},
  {name:"IL-6",group:"Провоспалительные",value:14.8,unit:"пг/мл",ref:"0–7",delta:18,weight:92,status:"high"},
  {name:"IL-7",group:"Гомеостаз лимфоцитов",value:7.9,unit:"пг/мл",ref:"2–8",delta:2,weight:19,status:"normal"},
  {name:"IL-8 / CXCL8",group:"Хемокины",value:19.4,unit:"пг/мл",ref:"0–15",delta:13,weight:59,status:"high"},
  {name:"IL-9",group:"Th9-ответ",value:4.8,unit:"пг/мл",ref:"1–5",delta:3,weight:17,status:"normal"},
  {name:"IL-10",group:"Регуляторные",value:4.1,unit:"пг/мл",ref:"3–9",delta:-7,weight:29,status:"low"},
  {name:"IL-12p70",group:"Т-клеточный ответ",value:6.3,unit:"пг/мл",ref:"1–5",delta:9,weight:41,status:"high"},
  {name:"IL-13",group:"Th2-ответ",value:6.8,unit:"пг/мл",ref:"2–7",delta:1,weight:14,status:"normal"},
  {name:"IL-15",group:"NK-клеточный ответ",value:9.1,unit:"пг/мл",ref:"3–8",delta:7,weight:33,status:"high"},
  {name:"IL-17A",group:"Th17-ответ",value:9.6,unit:"пг/мл",ref:"0–6",delta:16,weight:71,status:"high"},
  {name:"IL-18",group:"Провоспалительные",value:168,unit:"пг/мл",ref:"80–150",delta:11,weight:54,status:"high"},
  {name:"IL-21",group:"Т-клеточный ответ",value:10.4,unit:"пг/мл",ref:"3–9",delta:8,weight:39,status:"high"},
  {name:"IL-22",group:"Барьерный ответ",value:14.1,unit:"пг/мл",ref:"5–14",delta:3,weight:21,status:"high"},
  {name:"IL-23",group:"Th17-ответ",value:14.2,unit:"пг/мл",ref:"0–10",delta:14,weight:66,status:"high"},
  {name:"IL-27",group:"Иммунорегуляция",value:18.7,unit:"пг/мл",ref:"8–20",delta:1,weight:18,status:"normal"},
  {name:"TNF-α",group:"Провоспалительные",value:9.4,unit:"пг/мл",ref:"0–8",delta:10,weight:57,status:"high"},
  {name:"IFN-γ",group:"Т-клеточный ответ",value:17.5,unit:"пг/мл",ref:"4–15",delta:12,weight:62,status:"high"},
  {name:"TGF-β1",group:"Факторы роста",value:42,unit:"нг/мл",ref:"20–40",delta:6,weight:36,status:"high"},
  {name:"VEGF-A",group:"Ангиогенез",value:212,unit:"пг/мл",ref:"50–180",delta:11,weight:81,status:"high"},
  {name:"VEGF-C",group:"Ангиогенез",value:138,unit:"пг/мл",ref:"60–130",delta:7,weight:47,status:"high"},
  {name:"PDGF-BB",group:"Факторы роста",value:94,unit:"пг/мл",ref:"40–100",delta:2,weight:24,status:"normal"},
  {name:"FGF-2",group:"Факторы роста",value:12.8,unit:"пг/мл",ref:"3–12",delta:5,weight:31,status:"high"},
  {name:"EGF",group:"Факторы роста",value:31,unit:"пг/мл",ref:"15–35",delta:-1,weight:15,status:"normal"},
  {name:"MCP-1 / CCL2",group:"Хемокины",value:286,unit:"пг/мл",ref:"120–250",delta:14,weight:48,status:"high"},
  {name:"IP-10 / CXCL10",group:"Хемокины",value:322,unit:"пг/мл",ref:"100–280",delta:12,weight:58,status:"high"},
  {name:"RANTES / CCL5",group:"Хемокины",value:76,unit:"пг/мл",ref:"30–70",delta:7,weight:34,status:"high"},
  {name:"MMP-2",group:"Ремоделирование",value:172,unit:"нг/мл",ref:"100–160",delta:6,weight:37,status:"high"},
  {name:"MMP-9",group:"Ремоделирование",value:48,unit:"нг/мл",ref:"15–40",delta:15,weight:52,status:"high"},
  {name:"TIMP-1",group:"Ремоделирование",value:121,unit:"нг/мл",ref:"100–150",delta:-2,weight:13,status:"normal"},
  {name:"CRP",group:"Системное воспаление",value:6.4,unit:"мг/л",ref:"0–5",delta:7,weight:27,status:"high"},
  {name:"Плотность эндотелия",group:"Структурные",value:1820,unit:"кл/мм²",ref:">2000",delta:-7,weight:74,status:"low"},
  {name:"Hexagonality",group:"Структурные",value:43,unit:"%",ref:">50",delta:-6,weight:51,status:"low"},
  {name:"CV клеток",group:"Структурные",value:38,unit:"%",ref:"<33",delta:8,weight:49,status:"high"},
  {name:"Центральная пахиметрия",group:"Структурные",value:565,unit:"мкм",ref:"500–550",delta:5,weight:46,status:"high"},
  {name:"Толщина трансплантата",group:"Структурные",value:593,unit:"мкм",ref:"520–570",delta:7,weight:44,status:"high"},
  {name:"ВГД",group:"Клинические",value:18,unit:"мм рт. ст.",ref:"10–21",delta:1,weight:12,status:"normal"},
  {name:"Острота зрения",group:"Клинические",value:0.45,unit:"decimal",ref:">0.6",delta:-9,weight:43,status:"low"}
];

const nav = [
  ["home", "Главная", HomeIcon], ["patients", "Пациенты", Users], ["observation", "Наблюдение", History],
  ["research", "Исследования", FlaskConical], ["reports", "Отчёты", FileText]
] as const;

const twinModes: {id:TwinMode;label:string;icon:typeof Layers3}[] = [
  {id:"anatomy",label:"Цифровой двойник",icon:Layers3},
  {id:"heat",label:"Карта активности",icon:ScanLine},
  {id:"network",label:"Сеть биомаркеров",icon:Network},
  {id:"timeline",label:"Машина времени",icon:Clock3},
  {id:"forecast",label:"Прогноз 90 дней",icon:ChartNoAxesCombined}
];

function DigitalTwin({mode, time, selected, onSelect}:{mode:TwinMode;time:number;selected:number;onSelect:(n:number)=>void}){
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({x:0,y:0,down:false});
  const frame = useRef(0);
  const top = useMemo(()=>markers.slice().sort((a,b)=>b.weight-a.weight).slice(0,14),[]);

  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d"); if(!ctx) return;
    let raf=0;
    const draw=()=>{
      const rect=canvas.getBoundingClientRect(); const dpr=Math.min(window.devicePixelRatio||1,2);
      if(canvas.width!==Math.floor(rect.width*dpr)||canvas.height!==Math.floor(rect.height*dpr)){canvas.width=Math.floor(rect.width*dpr);canvas.height=Math.floor(rect.height*dpr)}
      ctx.setTransform(dpr,0,0,dpr,0,0); const w=rect.width,h=rect.height; ctx.clearRect(0,0,w,h); frame.current+=0.012;
      const cx=w*.5+pointer.current.x*10, cy=h*.47+pointer.current.y*7;
      const grd=ctx.createRadialGradient(cx,cy,20,cx,cy,Math.min(w,h)*.6);grd.addColorStop(0,"rgba(69,220,205,.15)");grd.addColorStop(.45,"rgba(64,155,255,.07)");grd.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=grd;ctx.fillRect(0,0,w,h);
      if(mode==="anatomy") drawAnatomy(ctx,w,h,cx,cy,time,frame.current);
      if(mode==="heat") drawHeat(ctx,w,h,cx,cy,time,frame.current);
      if(mode==="network") drawNetwork(ctx,w,h,cx,cy,top,selected,frame.current);
      if(mode==="timeline") drawTimeline(ctx,w,h,time,frame.current);
      if(mode==="forecast") drawForecast(ctx,w,h,time,frame.current);
      raf=requestAnimationFrame(draw);
    };
    draw(); return()=>cancelAnimationFrame(raf);
  },[mode,time,selected,top]);

  const pointerMove=(e:React.PointerEvent<HTMLCanvasElement>)=>{const r=e.currentTarget.getBoundingClientRect();pointer.current.x=((e.clientX-r.left)/r.width-.5)*2;pointer.current.y=((e.clientY-r.top)/r.height-.5)*2};
  const click=(e:React.MouseEvent<HTMLCanvasElement>)=>{if(mode!=="network")return;const r=e.currentTarget.getBoundingClientRect();const x=e.clientX-r.left,y=e.clientY-r.top;const cx=r.width/2,cy=r.height/2;let best=0,dist=1e9;top.forEach((_,i)=>{const a=(i/top.length)*Math.PI*2-Math.PI/2;const rr=Math.min(r.width,r.height)*(.29+(i%3)*.025);const nx=cx+Math.cos(a)*rr,ny=cy+Math.sin(a)*rr*.72;const d=Math.hypot(x-nx,y-ny);if(d<dist){dist=d;best=i}});if(dist<52)onSelect(best)};
  return <canvas ref={canvasRef} className="twinCanvas" onPointerMove={pointerMove} onPointerLeave={()=>{pointer.current={x:0,y:0,down:false}}} onClick={click}/>;
}

function drawAnatomy(ctx:CanvasRenderingContext2D,w:number,h:number,cx:number,cy:number,time:number,t:number){
  const layers=[
    {y:-72,rx:190,ry:42,c1:"rgba(190,248,244,.48)",c2:"rgba(36,168,178,.06)",label:"Эпителий"},
    {y:-28,rx:220,ry:60,c1:"rgba(111,196,255,.34)",c2:"rgba(48,111,198,.05)",label:"Строма"},
    {y:28,rx:204,ry:55,c1:"rgba(75,218,196,.32)",c2:"rgba(12,128,119,.07)",label:"Трансплантат"},
    {y:82,rx:174,ry:37,c1:"rgba(255,130,143,.22)",c2:"rgba(176,43,73,.05)",label:"Эндотелий"}
  ];
  layers.forEach((l,i)=>{const yy=cy+l.y+(time-5)*(i*.9);ctx.save();ctx.translate(cx,yy);ctx.rotate(Math.sin(t*.45+i)*.008);const g=ctx.createRadialGradient(0,-l.ry*.2,10,0,0,l.rx);g.addColorStop(0,l.c1);g.addColorStop(1,l.c2);ctx.fillStyle=g;ctx.strokeStyle=i===3?"rgba(255,113,132,.42)":"rgba(96,214,207,.35)";ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(0,0,l.rx,l.ry,0,0,Math.PI*2);ctx.fill();ctx.stroke();for(let k=0;k<8;k++){ctx.strokeStyle="rgba(255,255,255,.12)";ctx.beginPath();ctx.ellipse(0,0,l.rx*(1-k*.08),l.ry*(1-k*.08),0,0,Math.PI*2);ctx.stroke()}ctx.restore();
    ctx.font="600 12px Inter,Arial";ctx.fillStyle="rgba(88,110,126,.78)";ctx.fillText(l.label,cx-l.rx-96,yy+4);ctx.strokeStyle="rgba(110,147,160,.25)";ctx.beginPath();ctx.moveTo(cx-l.rx-10,yy);ctx.lineTo(cx-l.rx-82,yy);ctx.stroke();
  });
  for(let i=0;i<22;i++){const a=i/22*Math.PI*2+t*.06;const r=122+(i%5)*13;const x=cx+Math.cos(a)*r,y=cy+70+Math.sin(a)*r*.24;ctx.fillStyle=i%4===0?"rgba(255,91,114,.7)":"rgba(75,213,198,.38)";ctx.beginPath();ctx.arc(x,y,1.8+(i%3),0,Math.PI*2);ctx.fill()}
}
function drawHeat(ctx:CanvasRenderingContext2D,w:number,h:number,cx:number,cy:number,time:number,t:number){
  const R=Math.min(w,h)*.34;ctx.save();ctx.translate(cx,cy);ctx.scale(1,.72);for(let r=R;r>8;r-=5){const v=(r/R);const heat=Math.sin(v*8+time*.18)+Math.cos(v*5-t*.2);const hue=178-heat*32-(1-v)*42;ctx.strokeStyle=`hsla(${hue},78%,${52+heat*6}%,.62)`;ctx.lineWidth=6;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.stroke()}for(let i=0;i<70;i++){const a=i*2.399+t*.03;const rr=Math.sqrt(i/70)*R*.92;const x=Math.cos(a)*rr,y=Math.sin(a)*rr;const hot=(Math.sin(i*1.7+time*.6)+1)/2;ctx.fillStyle=`rgba(255,${80+hot*100},${110+hot*30},${.12+hot*.42})`;ctx.beginPath();ctx.arc(x,y,2+hot*4,0,Math.PI*2);ctx.fill()}ctx.restore();ctx.strokeStyle="rgba(19,91,107,.24)";ctx.setLineDash([4,8]);ctx.beginPath();ctx.ellipse(cx,cy,R,R*.72,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.font="600 12px Inter,Arial";ctx.fillStyle="rgba(82,104,119,.72)";ctx.fillText("Карта воспалительной активности",24,30)}
function drawNetwork(ctx:CanvasRenderingContext2D,w:number,h:number,cx:number,cy:number,top:Marker[],selected:number,t:number){
  const pts=top.map((m,i)=>{const a=i/top.length*Math.PI*2-Math.PI/2;const rr=Math.min(w,h)*(.29+(i%3)*.025);return{x:cx+Math.cos(a)*rr,y:cy+Math.sin(a)*rr*.72,m}});
  pts.forEach((p,i)=>{for(let j=i+1;j<pts.length;j++){if((i+j)%4===0||j===i+1){const q=pts[j];ctx.strokeStyle=i===selected||j===selected?"rgba(54,211,194,.46)":"rgba(99,137,153,.12)";ctx.lineWidth=i===selected||j===selected?1.6:.8;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.quadraticCurveTo(cx+(p.x+q.x-cx*2)*.12,cy+(p.y+q.y-cy*2)*.12,q.x,q.y);ctx.stroke()}}});
  pts.forEach((p,i)=>{const pulse=1+Math.sin(t*3+i)*.08;const r=(7+p.m.weight*.09)*pulse;const g=ctx.createRadialGradient(p.x,p.y,1,p.x,p.y,r*2.3);g.addColorStop(0,i===selected?"rgba(255,255,255,1)":p.m.status==="high"?"rgba(255,115,132,.95)":"rgba(69,218,200,.95)");g.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,r*2.3,0,Math.PI*2);ctx.fill();ctx.fillStyle=i===selected?"#fff":p.m.status==="high"?"#ff7285":"#45d5c4";ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fill();ctx.font=i===selected?"700 13px Inter,Arial":"600 11px Inter,Arial";ctx.fillStyle="rgba(37,61,76,.88)";ctx.textAlign="center";ctx.fillText(p.m.name,p.x,p.y+r+18)});ctx.textAlign="left";
}
function drawTimeline(ctx:CanvasRenderingContext2D,w:number,h:number,time:number,t:number){
  const pad=48,base=h*.72,vals=[24,29,36,44,53,63,72];ctx.strokeStyle="rgba(76,110,125,.11)";for(let i=0;i<4;i++){const y=base-i*52;ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(w-pad,y);ctx.stroke()}const pts=vals.map((v,i)=>({x:pad+i*(w-pad*2)/(vals.length-1),y:base-v*2.35}));const g=ctx.createLinearGradient(0,0,w,0);g.addColorStop(0,"#32cdbb");g.addColorStop(.65,"#3aa9ef");g.addColorStop(1,"#ff667d");ctx.strokeStyle=g;ctx.lineWidth=4;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();pts.forEach((p,i)=>{const active=i===Math.round(time/10*(vals.length-1));ctx.fillStyle=active?"#ff667d":"#fff";ctx.strokeStyle=active?"rgba(255,102,125,.28)":"#28bbaa";ctx.lineWidth=active?9:3;ctx.beginPath();ctx.arc(p.x,p.y,active?8:5,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.font="600 11px Inter,Arial";ctx.fillStyle="rgba(72,93,106,.75)";ctx.textAlign="center";ctx.fillText(`${vals[i]}%`,p.x,p.y-18)});ctx.textAlign="left";const idx=Math.round(time/10*(vals.length-1));const p=pts[idx];ctx.strokeStyle="rgba(255,102,125,.2)";ctx.setLineDash([5,7]);ctx.beginPath();ctx.moveTo(p.x,38);ctx.lineTo(p.x,base+20);ctx.stroke();ctx.setLineDash([])}

function drawForecast(ctx:CanvasRenderingContext2D,w:number,h:number,time:number,t:number){
  const pad=70, base=h-68, usable=w-pad*2; const risk=[72,68,64,59,53,48,43];
  ctx.strokeStyle="rgba(126,151,166,.22)";ctx.lineWidth=1;
  for(let i=0;i<5;i++){const y=55+i*(base-55)/4;ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(w-pad,y);ctx.stroke()}
  const grad=ctx.createLinearGradient(0,55,0,base);grad.addColorStop(0,"rgba(255,92,121,.28)");grad.addColorStop(1,"rgba(40,203,184,.04)");
  ctx.beginPath();risk.forEach((v,i)=>{const x=pad+i*usable/(risk.length-1);const y=base-(v/100)*(base-55);if(i===0)ctx.moveTo(x,y);else ctx.bezierCurveTo(x-usable/18,y,x-usable/18,y,x,y)});ctx.lineTo(w-pad,base);ctx.lineTo(pad,base);ctx.closePath();ctx.fillStyle=grad;ctx.fill();
  ctx.beginPath();risk.forEach((v,i)=>{const x=pad+i*usable/(risk.length-1);const y=base-(v/100)*(base-55);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});ctx.strokeStyle="#28bba9";ctx.lineWidth=4;ctx.lineCap="round";ctx.lineJoin="round";ctx.stroke();
  risk.forEach((v,i)=>{const x=pad+i*usable/(risk.length-1),y=base-(v/100)*(base-55);const pulse=i===0?2+Math.sin(t*3)*2:0;ctx.beginPath();ctx.arc(x,y,6+pulse,0,Math.PI*2);ctx.fillStyle=i===0?"rgba(255,94,120,.9)":"#fff";ctx.fill();ctx.strokeStyle=i===0?"#ff617c":"#28bba9";ctx.lineWidth=3;ctx.stroke();ctx.font="700 11px Inter,Arial";ctx.fillStyle="#365160";ctx.textAlign="center";ctx.fillText(`${v}%`,x,y-17);ctx.font="500 9px Inter,Arial";ctx.fillStyle="#8497a2";ctx.fillText(i===0?"Сегодня":`+${i*15} дней`,x,base+24)});
  ctx.textAlign="left";ctx.fillStyle="#728894";ctx.font="600 10px Inter,Arial";ctx.fillText("Персонализированная траектория при выполнении плана наблюдения",pad,32);
}

function WorldClassTwin({onOpen}:{onOpen:()=>void}){
  const [mode,setMode]=useState<TwinMode>("anatomy"); const [time,setTime]=useState(10); const [selected,setSelected]=useState(0); const [fullscreen,setFullscreen]=useState(false); const [compare,setCompare]=useState(false);
  const top=useMemo(()=>markers.slice().sort((a,b)=>b.weight-a.weight).slice(0,14),[]); const signal=top[selected];
  return <section className={`worldTwin ${fullscreen?"fullscreen":""}`}>
    <div className="twinHeader"><div><span className="eyebrow">AURELIA DIGITAL CORNEAL TWIN</span><h2>Живая модель трансплантата</h2><p>Анатомия, иммунология и прогноз синхронизированы по времени.</p></div><div className="twinActions"><button className={compare?"active":""} onClick={()=>setCompare(!compare)} title="Сравнить с прошлым визитом"><History/></button><button onClick={()=>{setTime(10);setSelected(0);setMode("anatomy")}} title="Сбросить"><RotateCcw/></button><button onClick={()=>setFullscreen(!fullscreen)} title="Развернуть"><Maximize2/></button></div></div>
    <div className="modeRail">{twinModes.map(({id,label,icon:Icon})=><button key={id} className={mode===id?"active":""} onClick={()=>setMode(id)}><Icon/><span>{label}</span></button>)}</div>
    <div className="twinBody"><div className={`visualStage ${compare?"compareOn":""}`}><DigitalTwin mode={mode} time={time} selected={selected} onSelect={setSelected}/><div className="stageBadge"><i/><span>{compare?"Сравнение: +30 дней":"Модель обновлена"}</span><b>14.05.2026</b></div>{compare&&<div className="comparisonCard"><span>Изменение с прошлого визита</span><strong>+14%</strong><small>IL-6 ↑18% · VEGF-A ↑11% · ECD ↓7%</small></div>}</div>
      <aside className="inspector"><span className="eyebrow">КЛИНИЧЕСКИЙ СИГНАЛ</span><h3>{mode==="network"?signal.name:mode==="forecast"?"Прогноз при наблюдении":"Риск отторжения"}</h3><div className="inspectorValue"><strong>{mode==="network"?signal.value:mode==="forecast"?43:patient.risk}</strong><span>{mode==="network"?signal.unit:"%"}</span></div><p>{mode==="network"?`${signal.group}. Динамика ${signal.delta>0?"+":""}${signal.delta}% относительно предыдущего визита.`:mode==="forecast"?"Ожидаемое снижение риска до 43% за 90 дней при выполнении предложенного протокола наблюдения.":"Неблагоприятная траектория формируется сочетанием иммунных и структурных изменений."}</p><div className="impact"><span>{mode==="network"?"Вклад в прогноз":"Достоверность"}</span><b>{mode==="network"?signal.weight:patient.confidence}%</b><em><i style={{width:`${mode==="network"?signal.weight:patient.confidence}%`}}/></em></div><div className="miniSignals">{top.slice(0,4).map((m,i)=><button key={m.name} onClick={()=>{setMode("network");setSelected(i)}}><span>{m.name}</span><b>{m.weight}%</b></button>)}</div><div className="decisionStack"><button className="decision"><span>Следующее действие</span><b>Контроль через 14 дней</b><ChevronRight/></button><button className="darkButton" onClick={onOpen}>Открыть исследование<ArrowUpRight/></button></div></aside>
    </div>
    <div className="timeControl"><div><Clock3/><span>Состояние модели</span><b>{time===10?"Сегодня":`${time*40} дней после операции`}</b></div><input aria-label="Время" type="range" min="0" max="10" value={time} onChange={e=>setTime(Number(e.target.value))}/><div className="timeTicks"><span>Операция</span><span>3 мес.</span><span>6 мес.</span><span>9 мес.</span><span>Сегодня</span></div></div>
  </section>
}

function Shell(){
  const [view,setView]=useState<View>("home"); const [toast,setToast]=useState(""); const [modal,setModal]=useState<string|null>(null); const [query,setQuery]=useState("");
  const notify=(s:string)=>{setToast(s);window.setTimeout(()=>setToast(""),2200)};
  return <div className="appShell"><aside className="sidebar"><div className="brand"><div className="brandMark"><span/></div><div><b>AURELIA</b><span>Clinical Intelligence</span></div></div><nav>{nav.map(([id,label,Icon])=><button key={id} onClick={()=>setView(id)} className={view===id?"active":""}><Icon/><span>{label}</span></button>)}</nav><div className="sideBottom"><button onClick={()=>setView("help")} className={view==="help"?"active":""}><CircleHelp/><span>Справка</span></button><button onClick={()=>setView("settings")} className={view==="settings"?"active":""}><Settings/><span>Настройки</span></button><div className="doctor"><UserRound/><div><b>Смирнова Е.А.</b><span>Врач-офтальмолог</span></div></div></div></aside>
  <main><header><div className="search"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")notify(query?`Поиск: ${query}`:"Введите запрос")}} placeholder="Поиск пациента, отчёта или показателя"/></div><div className="headerRight"><span className="system"><i/>Система работает</span><button className="roundButton" onClick={()=>notify("Новых уведомлений нет")}><Bell/></button></div></header><div className="content">{view==="home"&&<HomeScreen go={setView} open={()=>setModal("study")}/>} {view==="patients"&&<Patients notify={notify}/>} {view==="observation"&&<Observation notify={notify}/>} {view==="research"&&<Research notify={notify}/>} {view==="reports"&&<Reports notify={notify}/>} {view==="help"&&<Help/>} {view==="settings"&&<SettingsView notify={notify}/>}</div>{toast&&<div className="toast"><CheckCircle2/>{toast}</div>}</main>
  {modal&&<Modal title="Полное исследование" close={()=>setModal(null)}><div className="modalSummary"><div><span>Пациент</span><b>{patient.name}</b></div><div><span>Риск</span><b>{patient.risk}%</b></div><div><span>Достоверность</span><b>{patient.confidence}%</b></div></div><h3>Клиническая интерпретация</h3><p>Наблюдается согласованное повышение провоспалительных цитокинов, ангиогенных факторов и маркеров ремоделирования с одновременным снижением плотности и регулярности эндотелиальных клеток.</p><button className="darkButton" onClick={()=>{setModal(null);setView("observation")}}>Перейти к данным<ChevronRight/></button></Modal>}
  </div>
}

function HomeScreen({go,open}:{go:(v:View)=>void;open:()=>void}){return <><section className="patientHero"><div className="patientIdentity"><div className="avatar">ИИ</div><div><span>{patient.id} · последний визит 14.05.2026</span><h1>{patient.name}</h1><p>{patient.age} лет · {patient.eye} · {patient.procedure}</p></div></div><div className="heroRisk"><span>Риск отторжения</span><strong>{patient.risk}%</strong><small>↑ 14% за 30 дней</small></div><button className="darkButton" onClick={()=>go("patients")}>Открыть профиль<ChevronRight/></button></section><WorldClassTwin onOpen={open}/><section className="priorityBar"><div><Sparkles/><span>Приоритет системы</span><b>Контроль через 14 дней</b></div><p>Повторить панель IL-6, IL-17A, IL-23, VEGF-A и выполнить спекулярную микроскопию.</p><button onClick={()=>go("observation")}>Открыть план<ChevronRight/></button></section></>}

function Patients({notify}:{notify:(s:string)=>void}){const [active,setActive]=useState(0);const list=[patient,{...patient,id:"CR-0241",name:"Петрова Анна Сергеевна",risk:19,status:"Стабильно"},{...patient,id:"CR-0196",name:"Кузнецов Михаил Олегович",risk:41,status:"Наблюдение"}];const p=list[active];return <div className="split"><section className="panel"><div className="sectionTitle"><div><span className="eyebrow">РЕЕСТР</span><h2>Пациенты</h2></div><button className="darkButton small" onClick={()=>notify("Форма добавления пациента открыта")}><Plus/>Добавить</button></div>{list.map((item,i)=><button className={`patientRow ${i===active?"active":""}`} key={item.id} onClick={()=>setActive(i)}><span>{item.name.split(" ").slice(0,2).map(s=>s[0]).join("")}</span><div><b>{item.name}</b><small>{item.id} · {item.procedure}</small></div><em>{item.risk}%</em><ChevronRight/></button>)}</section><section className="panel detail"><div className="sectionTitle"><div><span className="eyebrow">КАРТА ПАЦИЕНТА</span><h2>{p.name}</h2></div><button className="iconText" onClick={()=>notify("Редактирование открыто")}><SlidersHorizontal/>Редактировать</button></div><p>{p.procedure}, {p.eye}</p><div className="facts"><div><span>Дата операции</span><b>{p.operationDate}</b></div><div><span>Лечащий врач</span><b>{p.doctor}</b></div><div><span>Риск</span><b>{p.risk}%</b></div><div><span>Достоверность</span><b>{p.confidence}%</b></div></div><div className="clinicalNote"><Stethoscope/><div><b>Клинический статус</b><p>{p.status}. Требуется персонализированный график наблюдения.</p></div></div><div className="quickGrid"><button onClick={()=>notify("История визитов открыта")}><CalendarDays/><span>Визиты</span><ChevronRight/></button><button onClick={()=>notify("Исследования открыты")}><Microscope/><span>Исследования</span><ChevronRight/></button><button onClick={()=>notify("Документы открыты")}><FileText/><span>Документы</span><ChevronRight/></button></div></section></div>}

function Observation({notify}:{notify:(s:string)=>void}){const [group,setGroup]=useState("Все");const [selected,setSelected]=useState<Marker|null>(null);const groups=["Все",...Array.from(new Set(markers.map(m=>m.group)))];const filtered=group==="Все"?markers:markers.filter(m=>m.group===group);return <><section className="panel"><div className="sectionTitle"><div><span className="eyebrow">МОЛЕКУЛЯРНЫЙ И КЛИНИЧЕСКИЙ ПРОФИЛЬ</span><h2>40 анализируемых признаков</h2></div><button className="iconText" onClick={()=>notify("Архив визитов открыт")}><CalendarDays/>Архив визитов</button></div><div className="filterRow">{groups.map(g=><button key={g} className={group===g?"active":""} onClick={()=>setGroup(g)}>{g}</button>)}</div><div className="markerTable"><div className="markerHead"><span>Показатель</span><span>Значение</span><span>Референс</span><span>Динамика</span><span>Вклад</span></div>{filtered.map(m=><button className="markerRow" key={m.name} onClick={()=>setSelected(m)}><span><b>{m.name}</b><small>{m.group}</small></span><span>{m.value} {m.unit}</span><span>{m.ref}</span><span className={m.delta>0?"up":"down"}>{m.delta>0?"+":""}{m.delta}%</span><span><em><i style={{width:`${m.weight}%`}}/></em>{m.weight}%</span></button>)}</div></section>{selected&&<Modal title={selected.name} close={()=>setSelected(null)}><div className="markerModal"><strong>{selected.value}</strong><span>{selected.unit}</span></div><p>{selected.group}. Референсный диапазон: {selected.ref}. Изменение относительно прошлого визита: {selected.delta>0?"+":""}{selected.delta}%.</p><div className="impact"><span>Вклад в прогноз</span><b>{selected.weight}%</b><em><i style={{width:`${selected.weight}%`}}/></em></div></Modal>}</>}

function Research({notify}:{notify:(s:string)=>void}){return <><div className="metrics">{[["AUROC","0,91"],["Чувствительность","86%"],["Специфичность","82%"],["Brier score","0,11"]].map(([a,b])=><article key={a}><span>{a}</span><strong>{b}</strong><small>валидационная выборка</small></article>)}</div><div className="split equal"><section className="panel"><div className="sectionTitle"><div><span className="eyebrow">КАЧЕСТВО МОДЕЛИ</span><h2>ROC-кривая</h2></div><button className="iconText" onClick={()=>notify("Данные ROC экспортированы")}><Download/>Экспорт</button></div><svg className="roc" viewBox="0 0 500 320"><line x1="60" y1="270" x2="450" y2="270"/><line x1="60" y1="40" x2="60" y2="270"/><line className="diag" x1="60" y1="270" x2="450" y2="40"/><path d="M60 270 C78 170 130 100 215 65 C300 28 382 42 450 40"/></svg></section><section className="panel"><div className="sectionTitle"><div><span className="eyebrow">ОБЪЯСНЕНИЕ</span><h2>Важность признаков</h2></div><ChartNoAxesCombined/></div><div className="importance">{markers.slice().sort((a,b)=>b.weight-a.weight).slice(0,12).map(m=><button key={m.name} onClick={()=>notify(`${m.name}: вклад ${m.weight}%`)}><span>{m.name}</span><em><i style={{width:`${m.weight}%`}}/></em><b>{m.weight}%</b></button>)}</div></section></div><section className="panel actionPanel"><div><Dna/><div><span className="eyebrow">COHORT LAB</span><h2>Анализ исследовательской когорты</h2><p>Сравнение подгрупп, калибровки и устойчивости модели.</p></div></div><button className="darkButton" onClick={()=>notify("Новый анализ когорты создан")}>Создать анализ<Plus/></button></section></>}

function makeReport(title:string){const rows=markers.map(m=>`<tr><td>${m.name}</td><td>${m.value} ${m.unit}</td><td>${m.ref}</td><td>${m.delta>0?"+":""}${m.delta}%</td><td>${m.weight}%</td></tr>`).join("");const html=`<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>${title}</title><style>body{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;margin:48px;color:#102532;line-height:1.55}header{border-bottom:1px solid #d9e5e8;padding-bottom:22px}h1{font-size:34px}h2{margin-top:36px}.risk{font-size:52px;font-weight:800}.box{padding:22px;background:#f1f7f7;border-radius:18px;margin:24px 0}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.grid div{border:1px solid #e0e9eb;padding:14px;border-radius:12px}table{width:100%;border-collapse:collapse;font-size:12px}th,td{padding:9px;border-bottom:1px solid #e2eaec;text-align:left}.foot{margin-top:42px;font-size:11px;color:#6f818b}@media print{button{display:none}}</style></head><body><header><b>AURELIA Clinical Intelligence</b><h1>${title}</h1><small>Сформировано 23.07.2026</small></header><h2>Executive summary</h2><div class="box"><div>Риск отторжения</div><div class="risk">${patient.risk}%</div><b>Достоверность ${patient.confidence}%</b></div><div class="grid"><div><small>Пациент</small><br><b>${patient.name}</b></div><div><small>Операция</small><br><b>${patient.procedure}</b></div><div><small>Глаз</small><br><b>${patient.eye}</b></div></div><h2>Клиническое заключение</h2><p>Неблагоприятная динамика формируется сочетанием IL-6, IL-17A, IL-23, VEGF-A, CXCL10 и снижением плотности эндотелия. Рекомендуется сокращённый интервал наблюдения.</p><h2>Полная панель признаков</h2><table><thead><tr><th>Показатель</th><th>Значение</th><th>Референс</th><th>Динамика</th><th>Вклад</th></tr></thead><tbody>${rows}</tbody></table><h2>План</h2><ol><li>Повторить расширенную цитокиновую панель через 14 дней.</li><li>Выполнить спекулярную микроскопию и пахиметрию.</li><li>Оценить клинические признаки воспаления и прозрачность трансплантата.</li><li>Сопоставить результаты с предыдущим визитом.</li></ol><div class="foot">Система поддержки принятия решений. Итоговую интерпретацию выполняет врач.</div></body></html>`;const blob=new Blob([html],{type:"text/html;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=title.replaceAll(" ","-")+".html";a.click();URL.revokeObjectURL(url)}

function Reports({notify}:{notify:(s:string)=>void}){const [preview,setPreview]=useState<string|null>(null);const [section,setSection]=useState("summary");const reports=[{t:"Полное клиническое заключение",d:"Executive summary, цифровой двойник, полный профиль признаков и план наблюдения.",i:Stethoscope},{t:"Иммунологический профиль",d:"Интерлейкины, хемокины, факторы роста, VEGF и показатели ремоделирования.",i:Dna},{t:"Динамика трансплантата",d:"Траектория риска, визиты, пахиметрия и состояние эндотелия.",i:Activity},{t:"Валидация модели",d:"ROC, калибровка, метрики, важность признаков и ограничения.",i:ShieldCheck}];return <><section className="reportStudio"><div><span className="eyebrow">AURELIA REPORT STUDIO</span><h1>Клинические отчёты</h1><p>Интерактивные документы с цифровым двойником, объяснением модели и полной панелью признаков.</p></div><button className="darkButton" onClick={()=>{makeReport("Полное клиническое заключение");notify("Полный отчёт сформирован")}}><Download/>Сформировать полный отчёт</button></section><div className="reportGrid">{reports.map(r=>{const Icon=r.i;return <article key={r.t}><div className="reportTop"><div className="reportBadge"><Icon/></div><span>Полная версия</span></div><h2>{r.t}</h2><p>{r.d}</p><div className="reportMeta"><span>40 признаков</span><span>Готов к печати</span></div><div className="reportActions"><button onClick={()=>setPreview(r.t)}><Eye/>Просмотр</button><button onClick={()=>{makeReport(r.t);notify("Отчёт сформирован")}}><Download/>Скачать</button><button onClick={()=>{makeReport(r.t);notify("Открыт файл для печати")}}><Printer/></button></div></article>})}{preview&&<Modal title={preview} close={()=>setPreview(null)}><div className="reportPreview"><div className="reportTabs">{[["summary","Резюме"],["markers","Биомаркеры"],["twin","Цифровой двойник"],["plan","План"]].map(([id,label])=><button key={id} className={section===id?"active":""} onClick={()=>setSection(id)}>{label}</button>)}</div><span>AURELIA Clinical Intelligence</span><h2>{patient.name}</h2><div className="previewRisk"><small>Риск отторжения</small><strong>{patient.risk}%</strong><b>Достоверность {patient.confidence}%</b></div>{section==="summary"&&<><h3>Ключевой вывод</h3><p>Рост IL-6, IL-17A, VEGF-A и CXCL10 в сочетании со снижением плотности эндотелия требует контроля через 14 дней.</p></>}{section==="markers"&&<div className="previewMarkers">{markers.slice().sort((a,b)=>b.weight-a.weight).slice(0,8).map(m=><div key={m.name}><b>{m.name}</b><span>{m.value} {m.unit}</span><em>{m.weight}%</em></div>)}</div>}{section==="twin"&&<div className="previewTwin"><Layers3/><div><b>Digital Corneal Twin</b><p>Синхронизирован с визитом 14.05.2026. Выявлены воспалительная активность и снижение эндотелиального резерва.</p></div></div>}{section==="plan"&&<ol className="previewPlan"><li>Расширенная цитокиновая панель через 14 дней.</li><li>Спекулярная микроскопия и пахиметрия.</li><li>Повторная оценка риска после получения данных.</li></ol>}<button className="darkButton" onClick={()=>makeReport(preview)}><Download/>Скачать полный отчёт</button></div></Modal>}</div></>}

function Help(){return <section className="panel prose"><BookOpen/><span className="eyebrow">СПРАВОЧНЫЙ ЦЕНТР</span><h2>Работа с AURELIA</h2>{["Интерпретация риска","Цифровой двойник","Биомаркеры и референсы","Формирование отчёта","Ограничения модели"].map(x=><details key={x}><summary>{x}<ChevronRight/></summary><p>Раздел содержит клинические и технические пояснения, необходимые для корректной интерпретации результатов системы.</p></details>)}</section>}
function SettingsView({notify}:{notify:(s:string)=>void}){return <section className="settingsCards">{["Интерфейс","Уведомления","Отчёты","Безопасность"].map((x,i)=><article key={x}><h2>{x}</h2><label><span>{i===0?"Плавные анимации":i===1?"Критические изменения":i===2?"Включать графики":"Двухфакторный вход"}</span><input type="checkbox" defaultChecked onChange={()=>notify("Настройка сохранена")}/></label><label><span>{i===0?"Компактная навигация":i===1?"Напоминания о визитах":i===2?"Объяснение модели":"Журнал действий"}</span><input type="checkbox" defaultChecked={i>0} onChange={()=>notify("Настройка сохранена")}/></label></article>)}</section>}

function Modal({title,close,children}:{title:string;close:()=>void;children:React.ReactNode}){return <div className="modalBackdrop" onMouseDown={close}><div className="modal" onMouseDown={e=>e.stopPropagation()}><div className="modalHead"><div><span className="eyebrow">AURELIA</span><h2>{title}</h2></div><button onClick={close}><X/></button></div>{children}</div></div>}

export default function Page(){return <Shell/>}
