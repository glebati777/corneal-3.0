"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, Bell, BookOpen, CalendarDays, CheckCircle2, ChevronRight, CircleHelp,
  Download, Eye, FileText, FlaskConical, Home as HomeIcon, Microscope, Plus,
  Printer, Search, Settings, ShieldCheck, Sparkles, Stethoscope, UserRound, Users,
  History, SlidersHorizontal, X, Dna, Layers3, ScanLine, Network, Clock3,
  ChartNoAxesCombined, ClipboardList, ArrowUpRight, RotateCcw, Maximize2, Play, Pause, Save, Gauge, WandSparkles
} from "lucide-react";

type View = "home" | "patients" | "observation" | "research" | "reports" | "help" | "settings";
type TwinMode = "fusion" | "anatomy" | "explorer" | "heat" | "network" | "timeline" | "forecast" | "simulation";
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
  {id:"fusion",label:"Живая модель глаза",icon:Eye},
  {id:"anatomy",label:"Диагностика",icon:Microscope},
  {id:"timeline",label:"Динамика",icon:Clock3},
  {id:"simulation",label:"Сценарий лечения",icon:Stethoscope}
];

function DigitalTwin({mode, time, selected, onSelect}:{mode:TwinMode;time:number;selected:number;onSelect:(n:number)=>void}){
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({x:0,y:0});
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
      const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,"#07151d");bg.addColorStop(1,"#0b2029");ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
      if(mode==="fusion") drawEyeModel(ctx,w,h,time,pointer.current.x,pointer.current.y,frame.current);
      if(mode==="anatomy") drawWorkstation(ctx,w,h,time,pointer.current.x,pointer.current.y,frame.current);
      if(mode==="explorer") drawCorneaExplorer(ctx,w,h,time,pointer.current.x,pointer.current.y,frame.current);
      if(mode==="heat") drawPachymetry(ctx,w,h,time,pointer.current.x,pointer.current.y);
      if(mode==="network") drawNetwork(ctx,w,h,w/2,h/2,top,selected,frame.current);
      if(mode==="timeline") drawLongitudinal(ctx,w,h,time);
      if(mode==="forecast" || mode==="simulation") drawForecast(ctx,w,h,time,frame.current);
      raf=requestAnimationFrame(draw);
    };
    draw(); return()=>cancelAnimationFrame(raf);
  },[mode,time,selected,top]);

  const pointerMove=(e:React.PointerEvent<HTMLCanvasElement>)=>{const r=e.currentTarget.getBoundingClientRect();pointer.current.x=(e.clientX-r.left)/r.width;pointer.current.y=(e.clientY-r.top)/r.height};
  const click=(e:React.MouseEvent<HTMLCanvasElement>)=>{if(mode!=="network")return;const r=e.currentTarget.getBoundingClientRect();const x=e.clientX-r.left,y=e.clientY-r.top;const cx=r.width/2,cy=r.height/2;let best=0,dist=1e9;top.forEach((_,i)=>{const a=(i/top.length)*Math.PI*2-Math.PI/2;const rr=Math.min(r.width,r.height)*(.29+(i%3)*.025);const nx=cx+Math.cos(a)*rr,ny=cy+Math.sin(a)*rr*.72;const d=Math.hypot(x-nx,y-ny);if(d<dist){dist=d;best=i}});if(dist<52)onSelect(best)};
  return <canvas ref={canvasRef} className="twinCanvas clinicalCanvas" onPointerMove={pointerMove} onPointerLeave={()=>{pointer.current={x:0,y:0}}} onClick={click}/>;
}


function drawEyeModel(ctx:CanvasRenderingContext2D,w:number,h:number,time:number,px:number,py:number,t:number){
  const cx=w*.5, cy=h*.515, R=Math.min(w,h)*.36;
  const targetX=((px||.5)-.5)*R*.13, targetY=((py||.5)-.5)*R*.075;
  const microX=Math.sin(t*.73)*R*.006+Math.sin(t*1.91)*R*.002;
  const microY=Math.cos(t*.61)*R*.004;
  const ix=cx+targetX+microX, iy=cy+targetY+microY;
  const cycle=(t*.10)%1;
  const blink=cycle>.972?Math.sin((cycle-.972)/.028*Math.PI):0;
  const aperture=R*(.58-blink*.56);

  const bg=ctx.createRadialGradient(cx,cy,R*.05,cx,cy,R*2.15);
  bg.addColorStop(0,'#172126'); bg.addColorStop(.48,'#0b1115'); bg.addColorStop(1,'#030506');
  ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);

  // Subtle studio rim behind the eye.
  const halo=ctx.createRadialGradient(cx,cy,R*.65,cx,cy,R*1.65);
  halo.addColorStop(0,'rgba(117,154,160,.10)');halo.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=halo;ctx.beginPath();ctx.ellipse(cx,cy,R*1.7,R*1.22,0,0,Math.PI*2);ctx.fill();

  // Periorbital tissue with asymmetric photographic shading and fine grain.
  const skin=ctx.createRadialGradient(cx-R*.25,cy-R*.28,R*.08,cx,cy,R*1.62);
  skin.addColorStop(0,'#d7b9ad');skin.addColorStop(.32,'#b18a7e');skin.addColorStop(.66,'#74554f');skin.addColorStop(1,'#271d20');
  ctx.fillStyle=skin;ctx.beginPath();ctx.ellipse(cx,cy,R*1.57,R*1.06,0,0,Math.PI*2);ctx.fill();
  for(let i=0;i<1500;i++){
    const a=(i*2.399963)% (Math.PI*2), rr=Math.sqrt(((i*67)%997)/997);
    const x=cx+Math.cos(a)*rr*R*1.48, y=cy+Math.sin(a)*rr*R*.98;
    const alpha=.006+((i*19)%13)/5000;
    ctx.fillStyle=i%4===0?`rgba(255,235,224,${alpha})`:`rgba(55,32,34,${alpha})`;
    ctx.fillRect(x,y,.7,.7);
  }

  // Eye opening clip.
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx-R*1.39,cy);
  ctx.bezierCurveTo(cx-R*.90,cy-aperture,cx+R*.91,cy-aperture*1.01,cx+R*1.39,cy);
  ctx.bezierCurveTo(cx+R*.90,cy+aperture*.88,cx-R*.88,cy+aperture*.93,cx-R*1.39,cy);
  ctx.closePath();ctx.clip();

  // Sclera: warm white, blue-grey depth and limbal darkening.
  const scl=ctx.createRadialGradient(cx-R*.30,cy-R*.24,R*.06,cx,cy,R*1.45);
  scl.addColorStop(0,'#fffdf7');scl.addColorStop(.35,'#f4f1e9');scl.addColorStop(.70,'#d8dcda');scl.addColorStop(1,'#77878c');
  ctx.fillStyle=scl;ctx.fillRect(cx-R*1.5,cy-R, R*3,R*2);
  const sclShadow=ctx.createLinearGradient(0,cy-aperture,0,cy+aperture);
  sclShadow.addColorStop(0,'rgba(31,35,38,.28)');sclShadow.addColorStop(.22,'rgba(0,0,0,0)');sclShadow.addColorStop(.76,'rgba(0,0,0,0)');sclShadow.addColorStop(1,'rgba(45,35,38,.24)');
  ctx.fillStyle=sclShadow;ctx.fillRect(0,cy-aperture-10,w,aperture*2+20);

  // Organic conjunctival vessels with branching.
  for(let i=0;i<22;i++){
    const side=i%2?-1:1, baseY=cy-R*.48+(i%11)*R*.096;
    const startX=cx+side*R*.68, endX=cx+side*R*1.35;
    ctx.strokeStyle=`rgba(126,48,55,${.045+(i%4)*.015})`;ctx.lineWidth=.45+(i%3)*.18;
    ctx.beginPath();ctx.moveTo(startX,baseY);
    ctx.bezierCurveTo(cx+side*R*.88,baseY+Math.sin(i*.9)*R*.05,cx+side*R*1.12,baseY-Math.cos(i*.61)*R*.05,endX,baseY+Math.sin(i*.37)*R*.035);ctx.stroke();
    if(i%3===0){
      const bx=cx+side*R*1.01, by=baseY+Math.sin(i*.9)*R*.02;
      ctx.globalAlpha=.8;ctx.beginPath();ctx.moveTo(bx,by);ctx.quadraticCurveTo(bx+side*R*.10,by-R*.045,bx+side*R*.18,by-R*.085);ctx.stroke();ctx.globalAlpha=1;
    }
  }

  const irisR=R*.515;
  // Limbal ring with optical depth.
  const limbal=ctx.createRadialGradient(ix,iy,irisR*.84,ix,iy,irisR*1.16);
  limbal.addColorStop(0,'rgba(14,23,24,0)');limbal.addColorStop(.66,'rgba(22,37,39,.25)');limbal.addColorStop(1,'rgba(7,13,15,.88)');
  ctx.fillStyle=limbal;ctx.beginPath();ctx.arc(ix,iy,irisR*1.14,0,Math.PI*2);ctx.fill();

  // Iris base with non-uniform pigmentation.
  const iris=ctx.createRadialGradient(ix-R*.07,iy-R*.09,R*.03,ix,iy,irisR);
  iris.addColorStop(0,'#19251e');iris.addColorStop(.18,'#4d4a31');iris.addColorStop(.43,'#777052');iris.addColorStop(.72,'#435447');iris.addColorStop(1,'#142426');
  ctx.fillStyle=iris;ctx.beginPath();ctx.arc(ix,iy,irisR,0,Math.PI*2);ctx.fill();

  // Dense iris stroma: thousands of irregular fibres and furrows.
  for(let i=0;i<880;i++){
    const a=i/880*Math.PI*2 + .015*Math.sin(i*.37);
    const inner=R*(.145+.02*Math.sin(i*.91));
    const outer=R*(.485+.018*Math.sin(i*.31));
    const mid=R*(.28+.035*Math.sin(i*.17));
    const warm=i%13===0, dark=i%5===0;
    ctx.strokeStyle=warm?'rgba(210,178,112,.21)':dark?'rgba(18,28,24,.27)':'rgba(151,158,113,.12)';
    ctx.lineWidth=warm?.72:.32;
    ctx.beginPath();ctx.moveTo(ix+Math.cos(a)*inner,iy+Math.sin(a)*inner);
    ctx.quadraticCurveTo(ix+Math.cos(a+.02*Math.sin(i))*mid,iy+Math.sin(a+.02*Math.sin(i))*mid,ix+Math.cos(a)*outer,iy+Math.sin(a)*outer);ctx.stroke();
  }
  // Contraction furrows.
  for(let j=0;j<5;j++){
    ctx.strokeStyle=`rgba(8,18,17,${.16-j*.018})`;ctx.lineWidth=.7;
    ctx.beginPath();
    for(let i=0;i<=160;i++){const a=i/160*Math.PI*2;const rr=R*(.34+j*.027+.008*Math.sin(a*8+j));const x=ix+Math.cos(a)*rr,y=iy+Math.sin(a)*rr;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.closePath();ctx.stroke();
  }
  // Crypts and collarette.
  ctx.strokeStyle='rgba(222,196,133,.22)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(ix,iy,R*.255,0,Math.PI*2);ctx.stroke();
  for(let i=0;i<34;i++){const a=i/34*Math.PI*2+.16,rr=R*(.26+(i%5)*.037);ctx.fillStyle=`rgba(9,17,14,${.20+(i%4)*.035})`;ctx.beginPath();ctx.ellipse(ix+Math.cos(a)*rr,iy+Math.sin(a)*rr,R*(.018+(i%3)*.005),R*.007,a,0,Math.PI*2);ctx.fill()}

  const pr=R*(.143+.004*Math.sin(t*.28));
  ctx.strokeStyle='rgba(44,38,26,.82)';ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(ix,iy,pr*1.085,0,Math.PI*2);ctx.stroke();
  const pupil=ctx.createRadialGradient(ix-R*.025,iy-R*.02,0,ix,iy,pr);
  pupil.addColorStop(0,'#000');pupil.addColorStop(.82,'#010202');pupil.addColorStop(1,'#0b0f0d');ctx.fillStyle=pupil;ctx.beginPath();ctx.arc(ix,iy,pr,0,Math.PI*2);ctx.fill();

  // Corneal dome: refraction, tear film and multiple realistic reflections.
  const cor=ctx.createRadialGradient(ix-R*.19,iy-R*.26,R*.02,ix,iy,R*.72);
  cor.addColorStop(0,'rgba(255,255,255,.34)');cor.addColorStop(.10,'rgba(255,255,255,.08)');cor.addColorStop(.58,'rgba(173,207,208,.018)');cor.addColorStop(1,'rgba(92,133,140,.16)');
  ctx.fillStyle=cor;ctx.beginPath();ctx.arc(ix,iy,R*.705,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='rgba(213,234,233,.20)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(ix,iy,R*.705,0,Math.PI*2);ctx.stroke();

  // Graft boundary and interrupted sutures.
  ctx.strokeStyle='rgba(218,226,218,.28)';ctx.lineWidth=.9;ctx.setLineDash([2.5,4]);ctx.beginPath();ctx.arc(ix,iy,R*.575,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
  for(let i=0;i<16;i++){const a=i/16*Math.PI*2+.055;ctx.strokeStyle='rgba(213,220,214,.23)';ctx.lineWidth=.65;ctx.beginPath();ctx.moveTo(ix+Math.cos(a)*R*.55,iy+Math.sin(a)*R*.55);ctx.lineTo(ix+Math.cos(a)*R*.63,iy+Math.sin(a)*R*.63);ctx.stroke()}

  // Restrained inflammatory region.
  const hx=ix+R*.285,hy=iy-R*.205;
  const edema=ctx.createRadialGradient(hx,hy,0,hx,hy,R*.18);
  edema.addColorStop(0,'rgba(168,70,75,.17)');edema.addColorStop(.55,'rgba(155,61,67,.055)');edema.addColorStop(1,'rgba(150,60,65,0)');
  ctx.fillStyle=edema;ctx.beginPath();ctx.arc(hx,hy,R*.20,0,Math.PI*2);ctx.fill();

  // Studio softbox reflections and tear meniscus.
  ctx.fillStyle='rgba(255,255,255,.78)';ctx.beginPath();ctx.ellipse(ix-R*.245,iy-R*.30,R*.105,R*.027,-.55,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.36)';ctx.beginPath();ctx.ellipse(ix-R*.10,iy-R*.39,R*.035,R*.018,-.4,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.16)';ctx.beginPath();ctx.ellipse(ix+R*.22,iy+R*.18,R*.050,R*.014,-.5,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='rgba(246,255,255,.26)';ctx.lineWidth=1.8;ctx.beginPath();ctx.arc(ix,iy,R*.67,.13*Math.PI,.87*Math.PI);ctx.stroke();
  ctx.restore();

  // Anatomically shaped lids, lid margins and lashes.
  const close=blink*R*.58, upper=cy-R*.04+close, lower=cy+R*.035-close*.88;
  const upperSkin=ctx.createLinearGradient(0,cy-R,0,cy);upperSkin.addColorStop(0,'#4e3839');upperSkin.addColorStop(.62,'#9d776f');upperSkin.addColorStop(1,'#6e4d4a');
  ctx.fillStyle=upperSkin;ctx.beginPath();ctx.moveTo(cx-R*1.48,upper);ctx.bezierCurveTo(cx-R*.88,cy-R*.70+close,cx+R*.90,cy-R*.71+close,cx+R*1.48,upper);ctx.lineTo(cx+R*1.58,cy-R*1.16);ctx.lineTo(cx-R*1.58,cy-R*1.16);ctx.closePath();ctx.fill();
  const lowerSkin=ctx.createLinearGradient(0,cy,0,cy+R);lowerSkin.addColorStop(0,'#9f786e');lowerSkin.addColorStop(.65,'#684b49');lowerSkin.addColorStop(1,'#2b2225');
  ctx.fillStyle=lowerSkin;ctx.beginPath();ctx.moveTo(cx-R*1.48,lower);ctx.bezierCurveTo(cx-R*.88,cy+R*.62-close*.88,cx+R*.90,cy+R*.62-close*.88,cx+R*1.48,lower);ctx.lineTo(cx+R*1.58,cy+R*1.17);ctx.lineTo(cx-R*1.58,cy+R*1.17);ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(48,29,32,.82)';ctx.lineWidth=2.1;ctx.beginPath();ctx.moveTo(cx-R*1.39,upper);ctx.bezierCurveTo(cx-R*.82,cy-R*.63+close,cx+R*.84,cy-R*.65+close,cx+R*1.39,upper);ctx.stroke();
  ctx.strokeStyle='rgba(76,44,45,.62)';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(cx-R*1.38,lower);ctx.bezierCurveTo(cx-R*.84,cy+R*.57-close*.88,cx+R*.86,cy+R*.58-close*.88,cx+R*1.38,lower);ctx.stroke();
  if(blink<.48){for(let i=0;i<30;i++){const q=i/29,x=cx-R*1.14+q*R*2.28,y=cy-R*(.50-.15*Math.pow((q-.5)*2,2));ctx.strokeStyle=`rgba(25,18,20,${.35+(i%4)*.08})`;ctx.lineWidth=.55;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+(q-.5)*R*.022,y-R*.038,x+(q-.5)*R*.045,y-R*(.07+(i%3)*.012));ctx.stroke()}}

  // Clinical annotations are intentionally quiet and outside the anatomy.
  label(ctx,'DIGITAL EYE TWIN 5.0 · CLINICAL RENDER',24,28);
  label(ctx,'Синтетическая модель переднего сегмента · PKP · OD',24,h-22);
  label(ctx,'РИСК 72%',w-24,28,'right');
}

function drawBiofield(ctx:CanvasRenderingContext2D,w:number,h:number,time:number,px:number,py:number,t:number){
  grid(ctx,w,h); const cx=w*.48,cy=h*.5; const R=Math.min(w,h)*.31;
  const risk=.35+time*.045; const tilt=((px||.5)-.5)*.34; ctx.save();ctx.translate(cx,cy);ctx.rotate(tilt);
  for(let layer=0;layer<5;layer++){const rr=R-layer*15;const wave=Math.sin(t*1.5+layer)*3;ctx.beginPath();for(let i=0;i<=180;i++){const a=Math.PI+i/180*Math.PI;const x=Math.cos(a)*rr;const y=Math.sin(a)*(rr*.46+wave)+layer*10; i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.strokeStyle=layer===4?'rgba(241,188,104,.9)':`rgba(91,220,205,${.72-layer*.1})`;ctx.lineWidth=layer===0?2.5:1.4;ctx.stroke()}
  const hotX=R*.36,hotY=-R*.04;for(let ring=0;ring<5;ring++){const pulse=(t*25+ring*18)%90;ctx.beginPath();ctx.arc(hotX,hotY,pulse,0,Math.PI*2);ctx.strokeStyle=`rgba(243,104,130,${Math.max(0,.32-pulse/300)})`;ctx.stroke()}
  for(let i=0;i<42;i++){const a=i*.73+t*(.18+(i%5)*.012);const rr=35+(i*29)%Math.max(40,R-20);const x=Math.cos(a)*rr,y=Math.sin(a)*rr*.48;ctx.fillStyle=i%7===0?'rgba(244,113,137,.9)':'rgba(85,226,209,.72)';ctx.beginPath();ctx.arc(x,y,1.5+(i%3),0,Math.PI*2);ctx.fill()}ctx.restore();
  const gx=24,gy=h-135,gw=w-48;ctx.strokeStyle='rgba(142,207,212,.18)';ctx.beginPath();ctx.moveTo(gx,gy+75);ctx.lineTo(gx+gw,gy+75);ctx.stroke();ctx.beginPath();for(let i=0;i<=100;i++){const x=gx+gw*i/100;const y=gy+58-Math.sin(i*.16+t*1.8)*8-(i/100)*risk*32-Math.exp(-((i-68)**2)/180)*risk*26;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.strokeStyle='#52d4c5';ctx.lineWidth=2.3;ctx.stroke();
  label(ctx,'AURELIA BIOFIELD · spatiotemporal graft model',24,28);label(ctx,'Иммунный поток',24,54);label(ctx,`${Math.round(risk*100)}% activity`,w-24,28,'right');label(ctx,'Пульсация отражает синтетическую динамику воспаления и эндотелиального стресса',24,h-22);
}

function grid(ctx:CanvasRenderingContext2D,w:number,h:number){ctx.save();ctx.strokeStyle="rgba(142,203,214,.055)";ctx.lineWidth=1;for(let x=0;x<w;x+=32){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}for(let y=0;y<h;y+=32){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}ctx.restore()}
function label(ctx:CanvasRenderingContext2D,text:string,x:number,y:number,align:CanvasTextAlign="left"){ctx.font="600 11px Inter,Arial";ctx.fillStyle="rgba(202,231,236,.82)";ctx.textAlign=align;ctx.fillText(text,x,y);ctx.textAlign="left"}

function drawWorkstation(ctx:CanvasRenderingContext2D,w:number,h:number,time:number,px:number,py:number,t:number){
  const gap=10, topH=h*.57, lowerY=topH+gap, lowerH=h-lowerY;
  const leftW=w*.38, midW=w*.29;
  ctx.save();
  ctx.fillStyle="#07151d";ctx.fillRect(0,0,w,h);
  // AS-OCT main viewport
  ctx.save();ctx.beginPath();ctx.rect(0,0,w,topH);ctx.clip();drawOCT(ctx,w,topH,time,px,py,t);ctx.restore();
  // panel separators
  ctx.strokeStyle="rgba(133,202,207,.18)";ctx.lineWidth=1;
  ctx.strokeRect(.5,lowerY+.5,leftW-gap/2,lowerH-1);
  ctx.strokeRect(leftW+gap/2,lowerY+.5,midW-gap,lowerH-1);
  ctx.strokeRect(leftW+midW+gap/2,lowerY+.5,w-leftW-midW-gap/2-.5,lowerH-1);
  // Endothelial mosaic (deterministic irregular cells)
  const ex=12,ey=lowerY+28,ew=leftW-24,eh=lowerH-40;
  label(ctx,"SPECULAR MICROSCOPY · ENDOTHELIUM",12,lowerY+18);
  ctx.save();ctx.beginPath();ctx.rect(ex,ey,ew,eh);ctx.clip();
  ctx.fillStyle="#0a222b";ctx.fillRect(ex,ey,ew,eh);
  const cols=11,rows=6,cw=ew/cols,ch=eh/rows;
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
    const seed=(r*37+c*19)%13;const cx=ex+(c+.5+(r%2)*.16)*cw;const cy=ey+(r+.5)*ch;
    const rx=cw*(.46+(seed%3)*.035),ry=ch*(.46+((seed+2)%4)*.025);
    ctx.beginPath();for(let k=0;k<6;k++){const a=Math.PI/3*k+.08*Math.sin(seed+k);const xx=cx+Math.cos(a)*rx*(1+.08*Math.sin(seed*k+1));const yy=cy+Math.sin(a)*ry*(1+.07*Math.cos(seed+k));k?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy)}ctx.closePath();
    const abnormal=(seed===2||seed===7||seed===11);ctx.fillStyle=abnormal?"rgba(235,151,98,.13)":"rgba(73,199,185,.06)";ctx.fill();ctx.strokeStyle=abnormal?"rgba(239,163,104,.66)":"rgba(154,220,216,.47)";ctx.lineWidth=.7;ctx.stroke();
  }
  ctx.restore();label(ctx,"ECD 1820 кл/мм² · CV 38% · HEX 43%",12,h-10);
  // Pachymetry mini map
  const mx=leftW+gap/2,my=lowerY,mw=midW-gap,mh=lowerH;
  label(ctx,"PACHYMETRY · µm",mx+12,my+18);
  const ccx=mx+mw*.46,ccy=my+mh*.57,maxR=Math.min(mw,mh)*.36;
  const rings=[{r:1,v:565},{r:.72,v:578},{r:.46,v:593},{r:.22,v:607}];
  rings.forEach((o,i)=>{const g=ctx.createRadialGradient(ccx,ccy,maxR*o.r*.25,ccx,ccy,maxR*o.r);g.addColorStop(0,i>1?"rgba(239,155,97,.72)":"rgba(231,198,107,.65)");g.addColorStop(1,i===0?"rgba(67,197,181,.20)":"rgba(108,200,215,.12)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(ccx,ccy,maxR*o.r,0,Math.PI*2);ctx.fill();ctx.strokeStyle="rgba(210,235,235,.22)";ctx.stroke()});
  [[0,-.62,548],[.55,-.2,571],[.48,.48,589],[-.45,.45,576],[-.58,-.2,559],[0,0,607]].forEach(([dx,dy,v])=>{label(ctx,String(v),ccx+Number(dx)*maxR,ccy+Number(dy)*maxR,"center")});
  // SHAP explanation
  const sx=leftW+midW+gap/2,sy=lowerY,sw=w-sx,sh=lowerH;
  label(ctx,"AI EXPLAINABILITY · SHAP",sx+12,sy+18);
  const feats=[['IL-6',.92,1],['VEGF-A',.81,1],['ECD',.74,-1],['IL-17A',.71,1],['CCT',.46,1]] as const;
  const zero=sx+sw*.52,scale=sw*.34;
  ctx.strokeStyle="rgba(199,229,231,.25)";ctx.beginPath();ctx.moveTo(zero,sy+30);ctx.lineTo(zero,h-20);ctx.stroke();
  feats.forEach((f,i)=>{const yy=sy+42+i*24;const len=f[1]*scale*.66;ctx.fillStyle=f[2]>0?"rgba(239,113,135,.82)":"rgba(67,203,187,.82)";ctx.fillRect(f[2]>0?zero:zero-len,yy-8,len,10);label(ctx,f[0],sx+12,yy);label(ctx,`${f[2]>0?'+':'−'}${Math.round(f[1]*5.2)} п.п.`,sx+sw-12,yy,"right")});
  // synchronized cursor
  if(px>0&&py>0){const cxp=px*w,cyp=py*h;ctx.strokeStyle="rgba(255,255,255,.38)";ctx.setLineDash([3,4]);ctx.beginPath();ctx.moveTo(cxp,0);ctx.lineTo(cxp,h);ctx.moveTo(0,cyp);ctx.lineTo(w,cyp);ctx.stroke();ctx.setLineDash([]);}
  ctx.restore();
}

function drawOCT(ctx:CanvasRenderingContext2D,w:number,h:number,time:number,px:number,py:number,t:number){
  grid(ctx,w,h); const left=42,right=w-42,mid=h*.48,span=right-left; const progression=time/10;
  const top=(x:number)=>mid-82-Math.pow((x-w/2)/(span*.53),2)*34;
  const thickness=(x:number)=>78+progression*16+22*Math.exp(-Math.pow((x-w*.67)/(span*.13),2));
  const bottom=(x:number)=>top(x)+thickness(x);
  const tissue=ctx.createLinearGradient(0,mid-100,0,mid+85);tissue.addColorStop(0,"rgba(214,246,245,.88)");tissue.addColorStop(.08,"rgba(125,207,210,.34)");tissue.addColorStop(.72,"rgba(63,138,151,.2)");tissue.addColorStop(1,"rgba(194,239,235,.76)");
  ctx.beginPath();for(let i=0;i<=240;i++){const x=left+i*span/240,y=top(x);i?ctx.lineTo(x,y):ctx.moveTo(x,y)}for(let i=240;i>=0;i--){const x=left+i*span/240;ctx.lineTo(x,bottom(x))}ctx.closePath();ctx.fillStyle=tissue;ctx.fill();
  for(let n=0;n<2400;n++){const x=left+((n*73)%997)/997*span;const y=top(x)+(((n*193)%991)/991)*thickness(x);const edge=Math.min((y-top(x))/12,(bottom(x)-y)/12,1);ctx.fillStyle=`rgba(210,244,244,${(.018+((n*17)%10)/1000)*edge})`;ctx.fillRect(x,y,1.1,1.1)}
  ctx.strokeStyle="rgba(224,255,252,.94)";ctx.lineWidth=2.4;ctx.beginPath();for(let i=0;i<=240;i++){const x=left+i*span/240;i?ctx.lineTo(x,top(x)):ctx.moveTo(x,top(x))}ctx.stroke();
  ctx.strokeStyle="rgba(123,236,222,.72)";ctx.lineWidth=1.7;ctx.beginPath();for(let i=0;i<=240;i++){const x=left+i*span/240;i?ctx.lineTo(x,bottom(x)):ctx.moveTo(x,bottom(x))}ctx.stroke();
  const graftL=w*.23,graftR=w*.78;[graftL,graftR].forEach(x=>{ctx.strokeStyle="rgba(255,187,107,.9)";ctx.lineWidth=1.3;ctx.setLineDash([4,5]);ctx.beginPath();ctx.moveTo(x,top(x)-22);ctx.lineTo(x,bottom(x)+24);ctx.stroke();ctx.setLineDash([])});
  // focal edema and keratic precipitates
  const hotX=w*.67;const halo=ctx.createRadialGradient(hotX,bottom(hotX)-16,1,hotX,bottom(hotX)-16,72);halo.addColorStop(0,"rgba(255,102,124,.28)");halo.addColorStop(1,"rgba(255,102,124,0)");ctx.fillStyle=halo;ctx.fillRect(hotX-80,bottom(hotX)-90,160,120);
  for(let i=0;i<18;i++){const x=w*.57+((i*47)%100)/100*w*.21;const y=bottom(x)+5+((i*31)%13);ctx.fillStyle=i%4===0?"rgba(255,111,133,.95)":"rgba(255,206,144,.72)";ctx.beginPath();ctx.arc(x,y,1.5+(i%3)*.6,0,Math.PI*2);ctx.fill()}
  // dynamic scan line
  const scanX=left+(px||(.5+.42*Math.sin(t*.25)))*span;ctx.strokeStyle="rgba(71,229,213,.52)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(scanX,34);ctx.lineTo(scanX,h-35);ctx.stroke();
  // caliper at center
  const cx=w/2;ctx.strokeStyle="rgba(120,229,217,.8)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(cx,top(cx));ctx.lineTo(cx,bottom(cx));ctx.stroke();[top(cx),bottom(cx)].forEach(y=>{ctx.beginPath();ctx.moveTo(cx-8,y);ctx.lineTo(cx+8,y);ctx.stroke()});
  label(ctx,`${Math.round(thickness(cx)*6.05)} µm`,cx+12,(top(cx)+bottom(cx))/2+4);
  label(ctx,"AS-OCT · B-scan",24,27);label(ctx,"graft-host junction",graftL-8,top(graftL)-29,"center");label(ctx,"локальный отёк",hotX,bottom(hotX)+43,"center");
  // specular inset
  const iw=150,ih=108,ix=w-iw-20,iy=20;ctx.fillStyle="rgba(3,16,23,.84)";ctx.fillRect(ix,iy,iw,ih);ctx.strokeStyle="rgba(115,190,198,.35)";ctx.strokeRect(ix,iy,iw,ih);
  const cell=14;for(let row=0;row<7;row++)for(let col=0;col<10;col++){const jitter=((row*17+col*29)%7)-3;const x=ix+9+col*cell+(row%2)*7,y=iy+15+row*13;ctx.strokeStyle=(row+col)%11===0?"rgba(255,105,126,.75)":"rgba(129,214,207,.34)";ctx.beginPath();for(let k=0;k<6;k++){const a=Math.PI/3*k;const xx=x+Math.cos(a)*(6+jitter*.12),yy=y+Math.sin(a)*(5.4-jitter*.08);k?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy)}ctx.closePath();ctx.stroke()}
  ctx.fillStyle="rgba(5,18,24,.88)";ctx.fillRect(ix,iy+ih-22,iw,22);label(ctx,"ECD 1820 · CV 38% · HEX 43%",ix+8,iy+ih-7);
}


function drawCorneaExplorer(ctx:CanvasRenderingContext2D,w:number,h:number,time:number,px:number,py:number,t:number){
  grid(ctx,w,h);
  const cx=w*.48, cy=h*.50;
  const yaw=(px||.5)-.5, pitch=(py||.5)-.5;
  const layers=[
    {name:"Эпителий",thickness:"52 µm",status:"Без изменений",rx:w*.34,ry:h*.20,offset:-18,stroke:"rgba(198,247,240,.92)",fill:"rgba(96,216,200,.08)"},
    {name:"Боуменова мембрана",thickness:"12 µm",status:"Интактна",rx:w*.32,ry:h*.185,offset:-8,stroke:"rgba(155,226,218,.78)",fill:"rgba(79,176,172,.055)"},
    {name:"Строма",thickness:`${468+time*3} µm`,status:time>7?"Локальный отёк":"Стабильно",rx:w*.30,ry:h*.17,offset:6,stroke:"rgba(102,196,196,.74)",fill:"rgba(66,156,172,.08)"},
    {name:"Десцеметова мембрана",thickness:"10 µm",status:"Без разрывов",rx:w*.285,ry:h*.15,offset:18,stroke:"rgba(87,169,190,.75)",fill:"rgba(58,120,166,.06)"},
    {name:"Эндотелий",thickness:"ECD 1820",status:"Снижен резерв",rx:w*.27,ry:h*.135,offset:30,stroke:"rgba(239,184,101,.9)",fill:"rgba(239,184,101,.06)"}
  ];
  ctx.save();ctx.translate(cx,cy);ctx.rotate(yaw*.18);
  layers.forEach((L,i)=>{
    const y=L.offset+pitch*24;
    ctx.beginPath();ctx.ellipse(0,y,L.rx,L.ry+yaw*18,0,Math.PI,Math.PI*2);
    ctx.strokeStyle=L.stroke;ctx.lineWidth=i===4?2.2:1.4;ctx.stroke();
    ctx.beginPath();ctx.ellipse(0,y+28,L.rx,L.ry+yaw*18,0,0,Math.PI);ctx.strokeStyle=L.stroke;ctx.globalAlpha=.55;ctx.stroke();ctx.globalAlpha=1;
    ctx.beginPath();ctx.ellipse(0,y+14,L.rx,L.ry+yaw*18,0,0,Math.PI*2);ctx.fillStyle=L.fill;ctx.fill();
  });
  const edemaX=w*.10, edemaY=-h*.035;ctx.beginPath();ctx.ellipse(edemaX,edemaY,w*.09,h*.055,0,0,Math.PI*2);ctx.fillStyle=`rgba(238,111,130,${.10+time*.008})`;ctx.fill();ctx.strokeStyle="rgba(246,143,157,.65)";ctx.setLineDash([5,5]);ctx.stroke();ctx.setLineDash([]);
  ctx.restore();
  label(ctx,"3D CORNEA EXPLORER · drag cursor to rotate",24,28);
  label(ctx,"Синтетическая реконструкция · не диагностическое изображение",24,h-22);
  const boxX=w-235, boxY=54;ctx.fillStyle="rgba(4,18,25,.78)";ctx.strokeStyle="rgba(137,207,211,.18)";ctx.lineWidth=1;roundRect(ctx,boxX,boxY,210,220,16);ctx.fill();ctx.stroke();
  layers.forEach((L,i)=>{const yy=boxY+30+i*36;ctx.fillStyle=L.stroke;ctx.fillRect(boxX+16,yy-7,8,8);label(ctx,L.name,boxX+32,yy);ctx.font="600 10px Inter,Arial";ctx.fillStyle="rgba(225,241,243,.72)";ctx.textAlign="right";ctx.fillText(L.thickness,boxX+194,yy);ctx.textAlign="left"});
  label(ctx,"Зона интереса",boxX+16,boxY+198);ctx.font="700 11px Inter,Arial";ctx.fillStyle="#ef8a9b";ctx.textAlign="right";ctx.fillText("Парацентральный отёк",boxX+194,boxY+198);ctx.textAlign="left";
}
function roundRect(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function drawPachymetry(ctx:CanvasRenderingContext2D,w:number,h:number,time:number,px:number,py:number){
  grid(ctx,w,h);const cx=w*.46,cy=h*.52,R=Math.min(w,h)*.35;const vals=[565,571,582,593,604,588,576,569,561,557,574,598,612,601,586,570];
  const color=(v:number)=>v<555?"#43c5b5":v<575?"#6cc8d7":v<595?"#e7c66b":v<610?"#ef9b61":"#f16f82";
  for(let ring=3;ring>=0;ring--){const ro=R*(ring+1)/4,ri=R*ring/4;for(let s=0;s<8;s++){const a0=-Math.PI/2+s*Math.PI/4,a1=a0+Math.PI/4;const v=vals[(ring*3+s)%vals.length]+Math.round(time*1.6);ctx.beginPath();ctx.arc(cx,cy,ro,a0,a1);ctx.arc(cx,cy,ri,a1,a0,true);ctx.closePath();ctx.fillStyle=color(v);ctx.globalAlpha=.72;ctx.fill();ctx.globalAlpha=1;ctx.strokeStyle="rgba(4,28,35,.5)";ctx.stroke();if(ring>0||s%2===0){const a=(a0+a1)/2,rr=(ro+ri)/2;ctx.font="700 10px Inter,Arial";ctx.fillStyle="#071c24";ctx.textAlign="center";ctx.fillText(String(v),cx+Math.cos(a)*rr,cy+Math.sin(a)*rr+3)}}}
  ctx.textAlign="left";[.25,.5,.75,1].forEach(q=>{ctx.strokeStyle="rgba(221,247,246,.3)";ctx.beginPath();ctx.arc(cx,cy,R*q,0,Math.PI*2);ctx.stroke()});ctx.strokeStyle="rgba(226,248,247,.45)";ctx.beginPath();ctx.moveTo(cx-R,cy);ctx.lineTo(cx+R,cy);ctx.moveTo(cx,cy-R);ctx.lineTo(cx,cy+R);ctx.stroke();
  const sx=cx+(px-.5)*R*2,sy=cy+(py-.5)*R*2;if(Math.hypot(sx-cx,sy-cy)<R){ctx.strokeStyle="#fff";ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(sx,sy,9,0,Math.PI*2);ctx.stroke()}
  label(ctx,"PACHYMETRY MAP · µm",24,27);label(ctx,"Δ CCT +28 µm / 30 дней",w-24,27,"right");
  const lx=w-132,ly=h*.39;[["<555","#43c5b5"],["555–574","#6cc8d7"],["575–594","#e7c66b"],["595–609","#ef9b61"],["≥610","#f16f82"]].forEach(([a,c],i)=>{ctx.fillStyle=c;ctx.fillRect(lx,ly+i*25,12,12);label(ctx,a,lx+20,ly+10+i*25)});
}

function drawNetwork(ctx:CanvasRenderingContext2D,w:number,h:number,cx:number,cy:number,top:Marker[],selected:number,t:number){
  grid(ctx,w,h);const pts=top.map((m,i)=>{const a=i/top.length*Math.PI*2-Math.PI/2;const rr=Math.min(w,h)*(.29+(i%3)*.025);return{x:cx+Math.cos(a)*rr,y:cy+Math.sin(a)*rr*.72,m}});
  pts.forEach((p,i)=>{for(let j=i+1;j<pts.length;j++){if((i+j)%4===0||j===i+1){const q=pts[j];ctx.strokeStyle=i===selected||j===selected?"rgba(54,211,194,.52)":"rgba(123,177,188,.14)";ctx.lineWidth=i===selected||j===selected?1.6:.8;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.quadraticCurveTo(cx+(p.x+q.x-cx*2)*.12,cy+(p.y+q.y-cy*2)*.12,q.x,q.y);ctx.stroke()}}});
  pts.forEach((p,i)=>{const pulse=1+Math.sin(t*3+i)*.06;const r=(7+p.m.weight*.09)*pulse;ctx.fillStyle=i===selected?"#f5ffff":p.m.status==="high"?"#ef7588":"#46cdbc";ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fill();ctx.font=i===selected?"700 12px Inter,Arial":"600 10px Inter,Arial";ctx.fillStyle="rgba(221,242,244,.92)";ctx.textAlign="center";ctx.fillText(p.m.name,p.x,p.y+r+17)});ctx.textAlign="left";label(ctx,"MOLECULAR INTERACTION GRAPH · exploratory",24,27)
}

function drawLongitudinal(ctx:CanvasRenderingContext2D,w:number,h:number,time:number){
  grid(ctx,w,h);const pad=60,top=54,bottom=h-60,usable=w-pad*2,visits=["12.04","10.05","14.07","12.10","15.01","14.03","14.05"];const risk=[24,29,36,44,53,63,72],cct=[528,531,536,542,548,557,565],ecd=[2310,2240,2160,2075,1980,1905,1820];
  const lines=[{data:risk,min:0,max:100,c:"#ef7187",name:"Риск %"},{data:cct,min:500,max:620,c:"#e8bd63",name:"CCT µm"},{data:ecd,min:1600,max:2500,c:"#45cbbb",name:"ECD кл/мм²"}];
  lines.forEach(s=>{ctx.strokeStyle=s.c;ctx.lineWidth=2.5;ctx.beginPath();s.data.forEach((v,i)=>{const x=pad+i*usable/(s.data.length-1),y=bottom-(v-s.min)/(s.max-s.min)*(bottom-top);i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke()});
  visits.forEach((v,i)=>{const x=pad+i*usable/(visits.length-1);ctx.strokeStyle="rgba(170,207,213,.13)";ctx.beginPath();ctx.moveTo(x,top);ctx.lineTo(x,bottom);ctx.stroke();ctx.fillStyle="rgba(185,216,221,.65)";ctx.font="500 9px Inter,Arial";ctx.textAlign="center";ctx.fillText(v,x,bottom+22)});ctx.textAlign="left";
  lines.forEach((s,i)=>{ctx.fillStyle=s.c;ctx.fillRect(24,26+i*18,10,3);label(ctx,s.name,41,30+i*18)});const idx=Math.round(time/10*6),x=pad+idx*usable/6;ctx.strokeStyle="rgba(255,255,255,.72)";ctx.setLineDash([4,5]);ctx.beginPath();ctx.moveTo(x,top);ctx.lineTo(x,bottom);ctx.stroke();ctx.setLineDash([])
}

function drawForecast(ctx:CanvasRenderingContext2D,w:number,h:number,time:number,t:number){
  grid(ctx,w,h);const pad=70,base=h-68,usable=w-pad*2;const risk=[72,68,64,59,53,48,43],upper=[80,77,75,71,67,63,60],lower=[64,59,53,47,39,33,27];
  const y=(v:number)=>base-(v/100)*(base-52),x=(i:number)=>pad+i*usable/(risk.length-1);
  ctx.beginPath();upper.forEach((v,i)=>i?ctx.lineTo(x(i),y(v)):ctx.moveTo(x(i),y(v)));for(let i=lower.length-1;i>=0;i--)ctx.lineTo(x(i),y(lower[i]));ctx.closePath();ctx.fillStyle="rgba(75,203,187,.13)";ctx.fill();
  ctx.beginPath();risk.forEach((v,i)=>i?ctx.lineTo(x(i),y(v)):ctx.moveTo(x(i),y(v)));ctx.strokeStyle="#43cbbb";ctx.lineWidth=3;ctx.stroke();
  risk.forEach((v,i)=>{ctx.fillStyle=i===0?"#ef7187":"#e8ffff";ctx.beginPath();ctx.arc(x(i),y(v),i===0?7:4.5,0,Math.PI*2);ctx.fill();label(ctx,`${v}%`,x(i),y(v)-14,"center");ctx.fillStyle="rgba(185,214,219,.65)";ctx.font="500 9px Inter,Arial";ctx.textAlign="center";ctx.fillText(i===0?"Сегодня":`+${i*15} д.`,x(i),base+23)});ctx.textAlign="left";label(ctx,"Персональная траектория · 80% interval",24,27);label(ctx,"Демонстрационная модель, не терапевтическая рекомендация",w-24,h-20,"right")
}


function WorldClassTwin({onOpen}:{onOpen:()=>void}){
  const [mode,setMode]=useState<TwinMode>("fusion"); const [time,setTime]=useState(10); const [selected,setSelected]=useState(0); const [fullscreen,setFullscreen]=useState(false); const [compare,setCompare]=useState(false); const [playing,setPlaying]=useState(false); const [result,setResult]=useState("");
  const [adherence,setAdherence]=useState(82); const [therapy,setTherapy]=useState(64); const [monitoring,setMonitoring]=useState(78);
  const top=useMemo(()=>markers.slice().sort((a,b)=>b.weight-a.weight).slice(0,14),[]); const signal=top[selected];
  const simulatedRisk=Math.max(18,Math.round(patient.risk-(adherence*.18+therapy*.16+monitoring*.08-18)));
  useEffect(()=>{if(!playing)return;const id=window.setInterval(()=>setTime(v=>v>=10?0:v+1),650);return()=>window.clearInterval(id)},[playing]);
  return <section className={`worldTwin ${fullscreen?"fullscreen":""}`}>
    <div className="twinHeader"><div><span className="eyebrow">AURELIA CLINICAL INTELLIGENCE 4.0 · DIGITAL EYE TWIN</span><h2>Живая модель глаза и трансплантата</h2><p>Фотореалистичная модель переднего отрезка, четыре ключевых показателя и один следующий клинический шаг — без информационного шума.</p></div><div className="twinActions"><button className={playing?"active":""} onClick={()=>setPlaying(v=>!v)} title={playing?"Пауза":"Воспроизвести динамику"}>{playing?<Pause/>:<Play/>}</button><button className={compare?"active":""} onClick={()=>setCompare(!compare)} title="Сравнить с прошлым визитом"><History/></button><button onClick={()=>{setTime(10);setSelected(0);setMode("fusion");setAdherence(82);setTherapy(64);setMonitoring(78)}} title="Сбросить"><RotateCcw/></button><button onClick={()=>setFullscreen(!fullscreen)} title="Развернуть"><Maximize2/></button></div></div>
    <div className="modeRail">{twinModes.map(({id,label,icon:Icon})=><button key={id} className={mode===id?"active":""} onClick={()=>setMode(id)}><Icon/><span>{label}</span></button>)}</div>
    <div className="twinBody"><div className={`visualStage ${compare?"compareOn":""}`}><DigitalTwin mode={mode} time={time} selected={selected} onSelect={setSelected}/><div className="stageBadge"><i/><span>{compare?"Сравнение: +30 дней":"Модель синхронизирована"}</span><b>14.05.2026</b></div><div className="modelTelemetry"><span><i/> AS-OCT 14.05.2026</span><span><i/> ECD 1820 кл/мм²</span><span><i/> CCT 565 µm</span></div>{compare&&<div className="comparisonCard"><span>Изменение с прошлого визита</span><strong>+14%</strong><small>IL-6 ↑18% · VEGF-A ↑11% · ECD ↓7%</small></div>}</div>
      <aside className="inspector"><span className="eyebrow">{mode==="simulation"?"CLINICAL SCENARIO ENGINE":"КЛИНИЧЕСКИЙ СИГНАЛ"}</span><h3>{mode==="network"?signal.name:mode==="fusion"?"Глаз и зона трансплантата":mode==="forecast"?"Прогноз при наблюдении":mode==="simulation"?"Персональный сценарий":mode==="explorer"?"Слои роговицы":"Риск отторжения"}</h3><div className="inspectorValue"><strong>{mode==="network"?signal.value:mode==="forecast"?43:mode==="simulation"?simulatedRisk:mode==="explorer"?5:mode==="fusion"?patient.risk:patient.risk}</strong><span>{mode==="network"?signal.unit:mode==="explorer"?"слоёв":mode==="fusion"?"%":"%"}</span></div>
      {mode==="simulation"?<div className="treatmentPlan"><div className="planAlert"><ShieldCheck/><div><b>Срочная очная оценка</b><span>Демонстрационный маршрут при подозрении на эндотелиальное отторжение после PKP. Не заменяет назначение врача.</span></div></div><div className="planPhases"><article><span>01 · СЕГОДНЯ</span><h4>Подтвердить диагноз</h4><p>Осмотр роговичного хирурга, щелевая лампа, острота зрения, ВГД, пахиметрия, AS-OCT и фотофиксация.</p><strong>Критично: исключить инфекционный и герпетический кератит до усиления иммуносупрессии.</strong></article><article><span>02 · ПОСЛЕ ПОДТВЕРЖДЕНИЯ</span><h4>Интенсивная местная терапия</h4><p>Основой лечения острого отторжения являются местные кортикостероиды. Конкретный препарат, частоту и длительность определяет офтальмолог с учётом тяжести и противопоказаний.</p><strong>Опубликованные протоколы тяжёлых эпизодов описывают очень частое применение в первые сутки.</strong></article><article><span>03 · 24–48 ЧАСОВ</span><h4>Оценить ответ</h4><p>Повторить осмотр, ВГД и пахиметрию; оценить прозрачность трансплантата, клетки/преципитаты и динамику отёка.</p><strong>При отсутствии ответа или тяжёлом течении — эскалация только под наблюдением специалиста.</strong></article><article><span>04 · ПОСЛЕ СТАБИЛИЗАЦИИ</span><h4>Постепенное снижение и профилактика</h4><p>Индивидуальное постепенное снижение частоты лечения, затем обсуждение длительной низкодозовой профилактики.</p><strong>Контролировать ВГД, катаракту, поверхность глаза и инфекционные осложнения.</strong></article></div><div className="evidenceNote"><b>Доказательная база:</b> клинические обзоры и руководства по отторжению трансплантата роговицы; долгосрочная низкодозовая стероидная профилактика изучалась в рандомизированном исследовании. Все дозировки и назначения требуют очного подтверждения.</div></div>:<><p>{mode==="network"?`${signal.group}. Динамика ${signal.delta>0?"+":""}${signal.delta}% относительно предыдущего визита.`:mode==="fusion"?"Анимированная фронтальная модель показывает роговицу, радужку, зрачок, границу трансплантата и локальную зону воспалительной активности.":mode==="forecast"?"Ожидаемое снижение риска до 43% за 90 дней при выполнении предложенного протокола наблюдения.":"Рост центральной толщины, снижение эндотелиальной плотности и провоспалительный профиль согласованно повышают риск. Визуализация использует демонстрационные данные пациента."}</p><div className="impact"><span>{mode==="network"?"Вклад в прогноз":"Достоверность"}</span><b>{mode==="network"?signal.weight:patient.confidence}%</b><em><i style={{width:`${mode==="network"?signal.weight:patient.confidence}%`}}/></em></div><div className="miniSignals">{top.slice(0,4).map((m,i)=><button key={m.name} onClick={()=>{setMode("network");setSelected(i)}}><span>{m.name}</span><b>{m.weight}%</b></button>)}</div></>}
      <div className="decisionStack"><button className="decision" onClick={()=>setResult(mode==="simulation"?`План сохранён в черновики: срочный осмотр сегодня, контроль через 24–48 часов и мониторинг ВГД.`:"План создан: контрольный визит через 14 дней, AS-OCT, ECD и панель IL-6/IL-17A/VEGF-A.")}><span>Следующее действие</span><b>{mode==="simulation"?"Сохранить план":"Создать план контроля"}</b><ChevronRight/></button><button className="darkButton" onClick={onOpen}>Открыть исследование<ArrowUpRight/></button></div>{result&&<div className="actionResult" aria-live="polite"><CheckCircle2/><div><b>Действие выполнено</b><span>{result}</span></div><button onClick={()=>setResult("")}><X/></button></div>}</aside>
    </div>
    <div className="timeControl"><div><Clock3/><span>Состояние модели</span><b>{time===10?"Сегодня":`${time*40} дней после операции`}</b></div><input aria-label="Время" type="range" min="0" max="10" value={time} onChange={e=>setTime(Number(e.target.value))}/><div className="timeTicks"><span>Операция</span><span>3 мес.</span><span>6 мес.</span><span>9 мес.</span><span>Сегодня</span></div></div>
  </section>
}

function Shell(){
  const [view,setView]=useState<View>("home"); const [toast,setToast]=useState(""); const [modal,setModal]=useState<string|null>(null); const [query,setQuery]=useState(""); const [palette,setPalette]=useState(false); const [alerts,setAlerts]=useState(false);
  const notify=(s:string)=>{setToast(s);window.setTimeout(()=>setToast(""),2200)};
  useEffect(()=>{const fn=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();setPalette(v=>!v)}if(e.key==="Escape"){setPalette(false);setAlerts(false)}};window.addEventListener("keydown",fn);return()=>window.removeEventListener("keydown",fn)},[]);
  const paletteItems=[...nav,["help","Справка",CircleHelp],["settings","Настройки",Settings]] as const;
  return <div className="appShell"><aside className="sidebar"><div className="brand"><div className="brandMark"><span/></div><div><b>AURELIA</b><span>Clinical Intelligence</span></div></div><nav>{nav.map(([id,label,Icon])=><button key={id} onClick={()=>setView(id)} className={view===id?"active":""}><Icon/><span>{label}</span></button>)}</nav><div className="sideBottom"><button onClick={()=>setView("help")} className={view==="help"?"active":""}><CircleHelp/><span>Справка</span></button><button onClick={()=>setView("settings")} className={view==="settings"?"active":""}><Settings/><span>Настройки</span></button><div className="doctor"><UserRound/><div><b>Смирнова Е.А.</b><span>Врач-офтальмолог</span></div></div></div></aside>
  <main><header><button className="search" onClick={()=>setPalette(true)}><Search/><span>{query||"Поиск пациента, отчёта или показателя"}</span><kbd>⌘ K</kbd></button><div className="headerRight"><span className="system"><i/>Система работает</span><button className="roundButton alertButton" onClick={()=>setAlerts(true)}><Bell/><i>2</i></button></div></header><div className="content">{view==="home"&&<HomeScreen go={setView} open={()=>setModal("study")}/>} {view==="patients"&&<Patients notify={notify}/>} {view==="observation"&&<Observation notify={notify}/>} {view==="research"&&<Research notify={notify}/>} {view==="reports"&&<Reports notify={notify}/>} {view==="help"&&<Help/>} {view==="settings"&&<SettingsView notify={notify}/>}</div>{toast&&<div className="toast"><CheckCircle2/>{toast}</div>}</main>
  {palette&&<div className="commandBackdrop" onMouseDown={()=>setPalette(false)}><div className="commandPalette" onMouseDown={e=>e.stopPropagation()}><div className="commandSearch"><Search/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Найти раздел, пациента или показатель..."/><kbd>ESC</kbd></div><div className="commandGroup"><span>Навигация</span>{paletteItems.filter(([,label])=>label.toLowerCase().includes(query.toLowerCase())).map(([id,label,Icon])=><button key={id} onClick={()=>{setView(id as View);setPalette(false);setQuery("")}}><Icon/><span>{label}</span><kbd>↵</kbd></button>)}</div><div className="commandGroup"><span>Быстрые действия</span><button onClick={()=>{setPalette(false);setModal("study")}}><Sparkles/><span>Открыть полное исследование</span><kbd>↵</kbd></button><button onClick={()=>{setPalette(false);setView("reports")}}><FileText/><span>Сформировать клинический отчёт</span><kbd>↵</kbd></button></div></div></div>}
  {alerts&&<Modal title="Центр уведомлений" close={()=>setAlerts(false)}><div className="alertList"><button onClick={()=>{setAlerts(false);setView("observation")}}><span className="alertCritical"><Activity/></span><div><b>Рост риска у Иванова И.И.</b><p>Риск увеличился на 14% за 30 дней.</p><small>2 минуты назад</small></div><ChevronRight/></button><button onClick={()=>{setAlerts(false);setView("patients")}}><span><CalendarDays/></span><div><b>Контрольный визит через 14 дней</b><p>Необходимо подтвердить запись пациента.</p><small>Сегодня</small></div><ChevronRight/></button></div></Modal>}
  {modal&&<Modal title="Полное исследование" close={()=>setModal(null)}><div className="modalSummary"><div><span>Пациент</span><b>{patient.name}</b></div><div><span>Риск</span><b>{patient.risk}%</b></div><div><span>Достоверность</span><b>{patient.confidence}%</b></div></div><h3>Клиническая интерпретация</h3><p>Наблюдается согласованное повышение провоспалительных цитокинов, ангиогенных факторов и маркеров ремоделирования с одновременным снижением плотности и регулярности эндотелиальных клеток.</p><button className="darkButton" onClick={()=>{setModal(null);setView("observation")}}>Перейти к данным<ChevronRight/></button></Modal>}
  </div>
}

function HomeScreen({go,open}:{go:(v:View)=>void;open:()=>void}){return <><section className="patientHero compactHero"><div className="patientIdentity"><div className="avatar">ИИ</div><div><span>{patient.id} · последний визит 14.05.2026</span><h1>{patient.name}</h1><p>{patient.age} лет · {patient.eye} · {patient.procedure}</p></div></div><div className="heroRisk"><span>Риск отторжения</span><strong>{patient.risk}%</strong><small>требует очной оценки</small></div><button className="darkButton" onClick={()=>go("patients")}>Профиль<ChevronRight/></button></section><section className="homeVitals" aria-label="Ключевые показатели"><article><span>Эндотелий</span><strong>1 820</strong><small>кл/мм² · снижено</small></article><article><span>Пахиметрия</span><strong>565</strong><small>мкм · +28 за 30 дней</small></article><article><span>IL-6</span><strong>14,8</strong><small>пг/мл · повышен</small></article><article><span>Достоверность</span><strong>93%</strong><small>модель согласована</small></article></section><WorldClassTwin onOpen={open}/></>}

function VisitDrawer({patientName,close,onSelect}:{patientName:string;close:()=>void;onSelect:(v:number)=>void}){
  const visits=[
    {date:"14.05.2026",day:"Сегодня",risk:72,cct:565,ecd:1820,il6:14.8,status:"Активная динамика"},
    {date:"14.03.2026",day:"−61 день",risk:63,cct:557,ecd:1905,il6:12.5,status:"Нарастание риска"},
    {date:"15.01.2026",day:"−119 дней",risk:53,cct:548,ecd:1980,il6:10.4,status:"Требует контроля"},
    {date:"12.10.2025",day:"−214 дней",risk:44,cct:542,ecd:2075,il6:8.9,status:"Умеренный риск"},
    {date:"14.07.2025",day:"−304 дня",risk:36,cct:536,ecd:2160,il6:7.2,status:"Стабильно"},
    {date:"12.04.2025",day:"Операция",risk:24,cct:528,ecd:2310,il6:5.1,status:"Исходная точка"}
  ];
  const [active,setActive]=useState(0);const v=visits[active];
  return <div className="drawerBackdrop" onMouseDown={e=>{if(e.target===e.currentTarget)close()}}><section className="visitDrawer" role="dialog" aria-modal="true" aria-label="История визитов"><header><div><span className="eyebrow">LONGITUDINAL PATIENT RECORD</span><h2>История визитов · {patientName}</h2><p>Выбор визита синхронно обновляет OCT, эндотелий, пахиметрию и оценку риска.</p></div><button onClick={close}><X/></button></header><div className="visitWorkspace"><nav className="visitList">{visits.map((item,i)=><button key={item.date} className={active===i?"active":""} onClick={()=>{setActive(i);onSelect(i)}}><i/><div><b>{item.date}</b><span>{item.day} · {item.status}</span></div><strong>{item.risk}%</strong><ChevronRight/></button>)}</nav><div className="visitDetail"><div className="visitMetrics"><article><span>AI-риск</span><strong>{v.risk}%</strong><small>{active===0?"+9 п.п. к визиту":"Архивная оценка"}</small></article><article><span>CCT</span><strong>{v.cct}</strong><small>мкм</small></article><article><span>ECD</span><strong>{v.ecd}</strong><small>кл/мм²</small></article><article><span>IL-6</span><strong>{v.il6}</strong><small>пг/мл</small></article></div><div className="visitStudy"><div className="miniOct"><span>AS-OCT · {v.date}</span><svg viewBox="0 0 520 190" role="img" aria-label="Синтетический OCT-срез"><defs><linearGradient id="tissue" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d9faf6" stopOpacity=".9"/><stop offset="1" stopColor="#42aeb4" stopOpacity=".2"/></linearGradient></defs><path d={`M18 112 Q260 ${40-active*2} 502 112 L502 ${145+active*3} Q260 ${95+active*3} 18 ${145+active*3} Z`} fill="url(#tissue)"/><path d={`M18 112 Q260 ${40-active*2} 502 112`} fill="none" stroke="#eafffb" strokeWidth="4"/><path d={`M18 ${145+active*3} Q260 ${95+active*3} 502 ${145+active*3}`} fill="none" stroke="#6fd6cf" strokeWidth="2"/><line x1="260" y1="50" x2="260" y2="135" stroke="#f2c66d" strokeDasharray="4 4"/><text x="270" y="90" fill="#f2d88e" fontSize="11">{v.cct} µm</text></svg></div><div className="visitNarrative"><span className="eyebrow">КЛИНИЧЕСКОЕ РЕЗЮМЕ</span><h3>{v.status}</h3><p>{active===0?"Согласованное повышение толщины трансплантата, IL-6 и модельного риска при снижении эндотелиального резерва.":"Архивная точка продольной траектории. Данные сохранены для сравнения и анализа скорости изменений."}</p><button className="darkButton" onClick={()=>{onSelect(active);close()}}>Открыть визит в цифровом двойнике<ArrowUpRight/></button></div></div></div></div></section></div>
}


type ClinicalDocumentId = "conclusion" | "operation" | "consent";
type DocumentTab = "document" | "history" | "signatures" | "sources";

const clinicalDocuments:{id:ClinicalDocumentId;title:string;code:string;version:string;status:string;meta:string;date:string;summary:string}[]=[
  {id:"conclusion",title:"Клиническое заключение",code:"AUR-CLN-0318",version:"v3.2",status:"Проверено",meta:"6 страниц · печатная форма",date:"14.05.2026",summary:"Структурированное заключение: жалобы, щелевая лампа, AS-OCT, пахиметрия, ECD, интерпретация и маршрут наблюдения."},
  {id:"operation",title:"Протокол операции",code:"AUR-OPR-0247",version:"v1.0",status:"Подписано",meta:"5 страниц · архив",date:"12.04.2025",summary:"Демонстрационный протокол сквозной кератопластики: идентификация, ключевые этапы, контроль герметичности и послеоперационный статус."},
  {id:"consent",title:"Информированное добровольное согласие",code:"AUR-CNS-0246",version:"v1.1",status:"Подписано",meta:"7 страниц · архив",date:"11.04.2025",summary:"Учебный шаблон согласия: цель, ожидаемая польза, альтернативы, существенные риски, обязанности и признаки осложнений."}
];

const documentHistory:Record<ClinicalDocumentId,{version:string;date:string;author:string;change:string}[]>={
  conclusion:[
    {version:"v3.2",date:"14.05.2026 · 16:42",author:"Смирнова Е.А.",change:"Добавлены результаты AS-OCT, CCT и ECD; уточнена формулировка срочного маршрута."},
    {version:"v3.1",date:"14.05.2026 · 15:18",author:"AURELIA AI",change:"Сформирован черновик клинического резюме на основе активного визита."},
    {version:"v3.0",date:"14.05.2026 · 14:54",author:"Лабораторная система",change:"Импортированы биомаркеры и результаты морфометрии."}
  ],
  operation:[
    {version:"v1.0",date:"12.04.2025 · 12:34",author:"Смирнова Е.А.",change:"Финальный протокол подписан и помещён в архив."},
    {version:"v0.9",date:"12.04.2025 · 11:58",author:"Операционная",change:"Внесены сведения о трансплантате, швах и состоянии передней камеры."}
  ],
  consent:[
    {version:"v1.1",date:"11.04.2025 · 17:12",author:"Смирнова Е.А.",change:"Добавлено разъяснение пожизненного риска отторжения и необходимости срочного обращения."},
    {version:"v1.0",date:"11.04.2025 · 16:45",author:"Иванов И.И.",change:"Подтверждено ознакомление с рисками, альтернативами и послеоперационными обязанностями."}
  ]
};

function documentHtml(id:ClinicalDocumentId){
 const doc=clinicalDocuments.find(d=>d.id===id)!;
 const common=`<div class="demo"><b>ДЕМОНСТРАЦИОННАЯ УЧЕБНАЯ ФОРМА</b><span>Не является официальной медицинской записью, назначением или формой конкретной клиники.</span></div><section class="patient"><div><small>Пациент</small><b>${patient.name}</b></div><div><small>ID</small><b>${patient.id}</b></div><div><small>Дата рождения</small><b>18.09.1969</b></div><div><small>Глаз</small><b>${patient.eye}</b></div><div><small>Операция</small><b>${patient.procedure}</b></div><div><small>Врач</small><b>${patient.doctor}</b></div></section>`;
 const sources=`<section class="references"><h2>Клинические источники</h2><ol><li>American Academy of Ophthalmology. About Corneal Transplantation. Updated 2025.</li><li>EyeWiki. Corneal Allograft Rejection and Failure. Updated 2025.</li><li>NHS. Cornea transplant: recovery, risks and urgent symptoms.</li><li>Moorfields Eye Hospital. Corneal transplantation: penetrating keratoplasty.</li></ol><p>Формулировки адаптированы для учебного интерфейса. Решения о диагностике и терапии принимает офтальмолог после очного обследования.</p></section>`;
 const footer=`<footer><span>${doc.code} · ${doc.version}</span><span>AURELIA Clinical Intelligence · educational prototype</span><span>Страница <b class="pageNumber"></b></span></footer>`;
 let body='';
 if(id==='conclusion')body=`${common}<section><div class="sectionHead"><span>01</span><h2>Повод для обращения и анамнез</h2></div><p>Снижение зрения, эпизоды покраснения и светобоязни правого глаза после сквозной кератопластики. По данным продольного наблюдения отмечаются увеличение центральной толщины трансплантата и снижение эндотелиального резерва.</p></section><section><div class="sectionHead"><span>02</span><h2>Осмотр переднего отрезка</h2></div><table><tr><th>Параметр</th><th>Результат</th><th>Клиническое значение</th></tr><tr><td>Острота зрения OD</td><td>0,45</td><td>Снижение относительно целевого уровня</td></tr><tr><td>ВГД</td><td>18 мм рт. ст.</td><td>В пределах указанного диапазона</td></tr><tr><td>Щелевая лампа</td><td>Умеренный отёк трансплантата; единичные преципитаты</td><td>Требует дифференциации иммунной реакции и инфекции</td></tr><tr><td>Флюоресцеин</td><td>Эпителиального дефекта не выявлено</td><td>Контроль целостности эпителия</td></tr></table></section><section><div class="sectionHead"><span>03</span><h2>Инструментальные исследования</h2></div><div class="metricGrid"><article><small>Центральная пахиметрия</small><strong>565 мкм</strong><span>+28 мкм / 30 дней</span></article><article><small>Плотность эндотелия</small><strong>1 820</strong><span>кл/мм² · снижена</span></article><article><small>Hexagonality</small><strong>43%</strong><span>снижена</span></article><article><small>CV клеток</small><strong>38%</strong><span>повышен</span></article></div><p><b>AS-OCT:</b> умеренное увеличение толщины трансплантата без признаков расхождения интерфейса. Данные должны интерпретироваться совместно с биомикроскопией.</p></section><section class="assessment"><div class="sectionHead"><span>04</span><h2>Клиническая оценка</h2></div><h3>Подозрение на реакцию отторжения трансплантата роговицы</h3><p>Сочетание симптомов, отёка трансплантата, увеличения CCT и снижения ECD требует срочного очного осмотра роговичным хирургом. До назначения противовоспалительной терапии необходимо исключить инфекционный кератит и другие причины дисфункции трансплантата.</p></section><section><div class="sectionHead"><span>05</span><h2>Маршрут наблюдения</h2></div><ol class="timeline"><li><b>В тот же день</b><span>Щелевая лампа, флюоресцеиновая проба, ВГД, фотофиксация; оценка инфекции и состояния швов.</span></li><li><b>После подтверждения диагноза</b><span>Лечение исключительно по назначению офтальмолога; местные кортикостероиды являются основной терапией острого иммунного отторжения согласно EyeWiki.</span></li><li><b>Через 24–48 часов</b><span>Контроль симптомов, прозрачности, CCT, ВГД и ответа на назначенную терапию.</span></li><li><b>Срочно вне графика</b><span>При боли, покраснении, светобоязни или снижении зрения.</span></li></ol></section><section class="signatures"><div><small>Врач-офтальмолог</small><b>Смирнова Е.А.</b><span>электронная подпись · 14.05.2026 16:42</span></div><div class="qr"><i></i><span>${doc.code}<br>${doc.version}</span></div></section>${sources}`;
 if(id==='operation')body=`${common}<section><div class="sectionHead"><span>01</span><h2>Предоперационные данные</h2></div><table><tr><th>Диагноз</th><td>Помутнение и функциональная декомпенсация роговицы OD</td></tr><tr><th>Планируемая операция</th><td>Сквозная кератопластика OD</td></tr><tr><th>Анестезия</th><td>Вид анестезии определяется анестезиологом и хирургом; учебная запись</td></tr><tr><th>Верификация</th><td>Личность, сторона операции, согласие и донорский материал проверены</td></tr></table></section><section><div class="sectionHead"><span>02</span><h2>Ход операции</h2></div><ol class="steps"><li><b>Подготовка</b><span>Обработка операционного поля, стерильное укрытие, установка векорасширителя.</span></li><li><b>Трепанация</b><span>Центрация и трепанация роговицы реципиента с удалением патологически изменённой ткани.</span></li><li><b>Донорский трансплантат</b><span>Подготовлен донорский диск соответствующего диаметра; идентификатор в учебной форме обезличен.</span></li><li><b>Фиксация</b><span>Трансплантат центрирован и фиксирован 16 отдельными нейлоновыми швами 10-0 с последовательным контролем натяжения.</span></li><li><b>Завершение</b><span>Передняя камера восстановлена; герметичность раны и положение трансплантата проверены.</span></li></ol></section><section><div class="sectionHead"><span>03</span><h2>Интраоперационный результат</h2></div><div class="metricGrid"><article><small>Трансплантат</small><strong>Центрирован</strong><span>положение стабильное</span></article><article><small>Швы</small><strong>16 × 10-0</strong><span>отдельные нейлоновые</span></article><article><small>Передняя камера</small><strong>Сформирована</strong><span>стабильна</span></article><article><small>Осложнения</small><strong>Не отмечены</strong><span>в демонстрационной записи</span></article></div></section><section><div class="sectionHead"><span>04</span><h2>Послеоперационный план</h2></div><ul><li>Контрольный осмотр на следующий день и далее по индивидуальному графику.</li><li>Местная терапия — только согласно назначениям хирурга.</li><li>Защитный режим, исключение трения глаза, травмы и несогласованных нагрузок.</li><li>Срочная связь с офтальмологической службой при боли, покраснении, светобоязни или ухудшении зрения.</li></ul></section><section class="signatures"><div><small>Оперирующий хирург</small><b>Смирнова Е.А.</b><span>электронная подпись · 12.04.2025 12:34</span></div><div class="qr"><i></i><span>${doc.code}<br>${doc.version}</span></div></section>${sources}`;
 if(id==='consent')body=`${common}<section><div class="sectionHead"><span>01</span><h2>Предлагаемое вмешательство</h2></div><p>Сквозная кератопластика — хирургическая замена центральной части патологически изменённой роговицы донорской тканью на всю толщину.</p></section><section><div class="sectionHead"><span>02</span><h2>Ожидаемая польза и ограничения</h2></div><p>Цель — восстановить прозрачность и анатомическую целостность роговицы и потенциально улучшить зрение. Итоговая острота зрения не гарантируется и зависит от астигматизма, состояния сетчатки, зрительного нерва и других заболеваний глаза.</p></section><section><div class="sectionHead"><span>03</span><h2>Возможные альтернативы</h2></div><ul><li>Продолжение консервативного лечения и оптической коррекции, когда это допустимо.</li><li>Другой тип кератопластики, если он анатомически и клинически показан.</li><li>Отказ от операции с риском сохранения или прогрессирования имеющихся нарушений.</li></ul></section><section class="riskSection"><div class="sectionHead"><span>04</span><h2>Существенные риски</h2></div><div class="riskGrid"><article><b>Трансплантат</b><span>Иммунологическое отторжение, первичная или поздняя недостаточность, необходимость повторной трансплантации.</span></article><article><b>Инфекция и заживление</b><span>Инфекция, воспаление, дефект эпителия, замедленное заживление, расхождение раны.</span></article><article><b>Внутриглазные осложнения</b><span>Повышение ВГД/глаукома, катаракта, кровотечение, повреждение других структур глаза.</span></article><article><b>Зрительный результат</b><span>Высокий или нерегулярный астигматизм, необходимость очков, линз, коррекции швов или дополнительной операции.</span></article></div></section><section class="urgent"><h2>Когда обращаться срочно</h2><p>После трансплантации покраснение глаза, боль, светобоязнь и ухудшение зрения могут быть признаками серьёзного осложнения, включая отторжение. NHS и Moorfields рекомендуют немедленно связаться с офтальмологической службой.</p></section><section><div class="sectionHead"><span>05</span><h2>Послеоперационные обязанности</h2></div><p>Использовать назначенные капли, посещать контрольные осмотры, не тереть глаз, соблюдать защитный режим и сообщать врачу о любых новых симптомах. Риск отторжения не ограничивается ранним послеоперационным периодом, поэтому длительное наблюдение остаётся важным.</p></section><section class="consentChecks"><label><i>✓</i><span>Мне объяснены цель, ожидаемая польза, ограничения и альтернативы операции.</span></label><label><i>✓</i><span>Мне объяснены существенные риски и возможность повторного вмешательства.</span></label><label><i>✓</i><span>Я понимаю признаки, при которых требуется срочная офтальмологическая помощь.</span></label><label><i>✓</i><span>У меня была возможность задать вопросы и получить понятные ответы.</span></label></section><section class="signatures two"><div><small>Пациент</small><b>Иванов Иван Иванович</b><span>демонстрационная подпись · 11.04.2025 16:45</span></div><div><small>Врач</small><b>Смирнова Е.А.</b><span>демонстрационная подпись · 11.04.2025 17:12</span></div><div class="qr"><i></i><span>${doc.code}<br>${doc.version}</span></div></section>${sources}`;
 return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>${doc.title}</title><style>@page{size:A4;margin:16mm 14mm 18mm}*{box-sizing:border-box}body{font-family:Inter,Arial,sans-serif;color:#162a33;margin:0;background:#e9eef0;line-height:1.55}.page{position:relative;width:min(900px,calc(100% - 40px));margin:28px auto;background:#fff;padding:48px 56px 34px;box-shadow:0 16px 50px #102b3920}.masthead{display:grid;grid-template-columns:1fr auto;gap:30px;border-bottom:2px solid #173846;padding-bottom:22px}.brand b{font-size:15px;letter-spacing:.19em}.brand span{display:block;font-size:10px;color:#72868e;margin-top:5px}.docMeta{text-align:right}.docMeta b,.docMeta span{display:block}.docMeta b{font-size:12px}.docMeta span{font-size:10px;color:#6f838c}.title{margin:32px 0 20px}.title span{font-size:10px;letter-spacing:.16em;color:#188b80;font-weight:800}.title h1{font-size:32px;line-height:1.15;margin:7px 0 8px}.title p{font-size:12px;color:#6f828a;margin:0}.demo{display:flex;gap:14px;border:1px solid #e8bdc4;background:#fff7f8;padding:13px 15px;margin:20px 0;border-radius:6px}.demo b{font-size:10px;white-space:nowrap;color:#9c4554}.demo span{font-size:10px;color:#6f5960}.patient{display:grid;grid-template-columns:2fr .8fr 1fr .55fr 1.6fr 1.2fr;border:1px solid #dce5e7;margin:18px 0 30px}.patient div{padding:10px 12px;border-right:1px solid #e2eaec}.patient div:last-child{border:0}.patient small,.patient b{display:block}.patient small{font-size:8px;text-transform:uppercase;letter-spacing:.08em;color:#81939a}.patient b{font-size:10px;margin-top:3px}section{margin:27px 0;break-inside:avoid}.sectionHead{display:flex;align-items:center;gap:11px;border-bottom:1px solid #dfe8ea;padding-bottom:7px;margin-bottom:13px}.sectionHead span{font-size:9px;font-weight:800;color:#159387}.sectionHead h2{font-size:17px;margin:0}p,li,td,th{font-size:11px}table{width:100%;border-collapse:collapse}th,td{padding:9px 10px;border-bottom:1px solid #e2e9eb;text-align:left;vertical-align:top}th{font-size:9px;text-transform:uppercase;letter-spacing:.05em;color:#70838b;background:#f5f8f9}.metricGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:9px}.metricGrid article{border:1px solid #dfe8ea;padding:13px;border-radius:7px}.metricGrid small,.metricGrid strong,.metricGrid span{display:block}.metricGrid small{font-size:8px;color:#788b93}.metricGrid strong{font-size:17px;margin:5px 0}.metricGrid span{font-size:9px;color:#667b84}.assessment,.urgent{border-left:4px solid #e27586;background:#fff7f8;padding:18px 20px}.assessment .sectionHead{border:0;padding:0}.assessment h3{font-size:17px;margin:8px 0}.timeline,.steps{list-style:none;padding:0}.timeline li,.steps li{display:grid;grid-template-columns:150px 1fr;gap:16px;padding:10px 0;border-bottom:1px solid #e5ecee}.timeline b,.steps b{font-size:10px}.timeline span,.steps span{font-size:11px;color:#536b75}.riskGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.riskGrid article{border:1px solid #e2e8ea;padding:14px;border-radius:7px}.riskGrid b,.riskGrid span{display:block}.riskGrid b{font-size:11px}.riskGrid span{font-size:10px;color:#5f747d;margin-top:5px}.urgent{border-color:#d9a641;background:#fffaf0}.urgent h2{font-size:17px;margin:0 0 7px}.consentChecks{display:grid;gap:8px}.consentChecks label{display:grid;grid-template-columns:22px 1fr;gap:9px;border:1px solid #dfe7e9;padding:10px}.consentChecks i{width:18px;height:18px;border-radius:50%;background:#eaf7f5;color:#168d82;display:grid;place-items:center;font-size:10px;font-style:normal}.consentChecks span{font-size:10px}.signatures{display:grid;grid-template-columns:1fr auto;gap:20px;align-items:end;border-top:1px solid #dce5e7;padding-top:20px}.signatures.two{grid-template-columns:1fr 1fr auto}.signatures small,.signatures b,.signatures span{display:block}.signatures small{font-size:8px;color:#7b8e96}.signatures b{font-size:12px;margin:5px 0}.signatures span{font-size:9px;color:#6c818a}.qr{display:flex;align-items:center;gap:8px}.qr i{width:48px;height:48px;background:repeating-conic-gradient(#17323d 0 25%,#fff 0 50%) 0/12px 12px;border:4px solid #fff;outline:1px solid #cad7da}.qr span{font-size:8px!important}.references{border-top:1px solid #dce5e7;padding-top:18px}.references h2{font-size:13px}.references li,.references p{font-size:9px;color:#637780}footer{display:flex;justify-content:space-between;border-top:1px solid #dfe7e9;padding-top:12px;margin-top:34px;font-size:8px;color:#71848c}.pageNumber:after{content:"1"}@media print{body{background:#fff}.page{width:auto;margin:0;padding:0;box-shadow:none}.demo{break-inside:avoid}footer{position:fixed;bottom:0;left:0;right:0}.pageNumber:after{content:counter(page)}}@media(max-width:720px){.page{width:100%;margin:0;padding:28px 22px}.patient{grid-template-columns:1fr 1fr}.metricGrid,.riskGrid{grid-template-columns:1fr 1fr}.masthead{grid-template-columns:1fr}.docMeta{text-align:left}.timeline li,.steps li{grid-template-columns:1fr}.signatures,.signatures.two{grid-template-columns:1fr}}</style></head><body><main class="page"><header class="masthead"><div class="brand"><b>AURELIA</b><span>CLINICAL INTELLIGENCE · DOCUMENT CONTROL</span></div><div class="docMeta"><b>${doc.code}</b><span>${doc.version} · ${doc.status}</span></div></header><div class="title"><span>КЛИНИЧЕСКИЙ ДОКУМЕНТ</span><h1>${doc.title}</h1><p>${doc.date} · сформировано для демонстрационного пациента</p></div>${body}${footer}</main></body></html>`;
}

function downloadClinicalDocument(id:ClinicalDocumentId){const doc=clinicalDocuments.find(d=>d.id===id)!;const blob=new Blob([documentHtml(id)],{type:"text/html;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`${doc.code}-${doc.version}.html`;a.click();URL.revokeObjectURL(url)}

function DocumentWorkspace({initial,onClose,notify}:{initial?:ClinicalDocumentId;onClose:()=>void;notify:(s:string)=>void}){
 const [active,setActive]=useState<ClinicalDocumentId>(initial||"conclusion");const [tab,setTab]=useState<DocumentTab>("document");const [zoom,setZoom]=useState(92);const frame=useRef<HTMLIFrameElement>(null);const doc=clinicalDocuments.find(d=>d.id===active)!;
 const print=()=>{frame.current?.contentWindow?.focus();frame.current?.contentWindow?.print()};
 return <div className="documentCenter" role="dialog" aria-modal="true" aria-label="Центр клинических документов"><header className="dcTop"><div className="dcBrand"><ShieldCheck/><div><span>AURELIA DOCUMENT CONTROL</span><b>{patient.name}</b></div></div><div className="dcTopMeta"><span>{patient.id}</span><span>{patient.eye}</span><span>{patient.procedure}</span></div><button className="dcClose" onClick={onClose}><X/></button></header><div className="dcBody"><aside className="dcSidebar"><div className="dcPatient"><div>ИИ</div><span><b>{patient.name}</b><small>{patient.id} · {patient.eye}</small></span></div><nav>{clinicalDocuments.map(d=><button key={d.id} className={active===d.id?"active":""} onClick={()=>{setActive(d.id);setTab("document")}}><FileText/><span><b>{d.title}</b><small>{d.date} · {d.version}</small></span><i>{d.status}</i></button>)}</nav><div className="dcCompliance"><ShieldCheck/><div><b>Учебная среда</b><span>Документы не являются официальными медзаписями и не содержат реальных подписей.</span></div></div></aside><main className="dcMain"><div className="dcHeader"><div><span className="eyebrow">{doc.code} · {doc.version}</span><h2>{doc.title}</h2><p>{doc.summary}</p></div><div className="dcActions"><button onClick={()=>setZoom(v=>Math.max(70,v-10))}>−</button><span>{zoom}%</span><button onClick={()=>setZoom(v=>Math.min(120,v+10))}>+</button><button onClick={print}><Printer/>Печать / PDF</button><button className="primary" onClick={()=>{downloadClinicalDocument(active);notify("Экспортирована автономная HTML-версия документа")}}><Download/>Экспорт</button></div></div><div className="dcTabs">{([['document','Документ'],['history','История версий'],['signatures','Подписи'],['sources','Источники']] as [DocumentTab,string][]).map(([id,label])=><button key={id} className={tab===id?"active":""} onClick={()=>setTab(id)}>{label}</button>)}</div><section className="dcContent">{tab==='document'&&<div className="dcCanvas"><div style={{width:`${zoom}%`}}><iframe ref={frame} title={doc.title} srcDoc={documentHtml(active)}/></div></div>}{tab==='history'&&<div className="dcInfoPanel"><div className="dcInfoHead"><History/><div><h3>История версий</h3><p>Аудит изменений для демонстрационного документа.</p></div></div><div className="versionList">{documentHistory[active].map((v,i)=><article key={v.version}><i className={i===0?'current':''}/><div><span>{v.version} {i===0&&<em>Текущая</em>}</span><b>{v.change}</b><small>{v.date} · {v.author}</small></div></article>)}</div></div>}{tab==='signatures'&&<div className="dcInfoPanel"><div className="dcInfoHead"><ShieldCheck/><div><h3>Контроль подписей</h3><p>Демонстрация статусов, без юридически значимой электронной подписи.</p></div></div><div className="signatureCards"><article><UserRound/><div><span>Ответственный врач</span><b>Смирнова Е.А.</b><small>Подтверждено · 14.05.2026 16:42</small></div><CheckCircle2/></article>{active==='consent'&&<article><UserRound/><div><span>Пациент</span><b>Иванов Иван Иванович</b><small>Ознакомлен · 11.04.2025 16:45</small></div><CheckCircle2/></article>}<article className="hash"><ClipboardList/><div><span>Контрольная запись</span><b>{doc.code}-{doc.version}-7F3A</b><small>Локальный демонстрационный идентификатор</small></div></article></div></div>}{tab==='sources'&&<div className="dcInfoPanel"><div className="dcInfoHead"><BookOpen/><div><h3>Источники клинических формулировок</h3><p>Ссылки предназначены для проверки, а не для автоматического назначения лечения.</p></div></div><div className="sourceCards"><a href="https://www.aao.org/eye-health/treatments/about-corneal-transplantation" target="_blank" rel="noreferrer"><b>American Academy of Ophthalmology</b><span>About Corneal Transplantation · 2025</span><ArrowUpRight/></a><a href="https://eyewiki.org/Corneal_Allograft_Rejection_and_Failure" target="_blank" rel="noreferrer"><b>EyeWiki / AAO</b><span>Corneal Allograft Rejection and Failure · 2025</span><ArrowUpRight/></a><a href="https://www.nhs.uk/tests-and-treatments/cornea-transplant/" target="_blank" rel="noreferrer"><b>NHS</b><span>Cornea transplant: recovery, risks and urgent symptoms</span><ArrowUpRight/></a><a href="https://www.moorfields.nhs.uk/for-patients/information-hub/corneal-transplantation-penetrating-keratoplasty" target="_blank" rel="noreferrer"><b>Moorfields Eye Hospital</b><span>Penetrating keratoplasty patient information</span><ArrowUpRight/></a></div></div>}</section></main></div></div>
}

function Patients({notify}:{notify:(s:string)=>void}){
  const [active,setActive]=useState(0);const [visits,setVisits]=useState(false);const [visitIndex,setVisitIndex]=useState(0);const [action,setAction]=useState<string|null>(null);const [documents,setDocuments]=useState(false);
  const list=[patient,{...patient,id:"CR-0241",name:"Петрова Анна Сергеевна",risk:19,status:"Стабильно"},{...patient,id:"CR-0196",name:"Кузнецов Михаил Олегович",risk:41,status:"Наблюдение"}];const p=list[active];
  return <><div className="split"><section className="panel"><div className="sectionTitle"><div><span className="eyebrow">РЕЕСТР</span><h2>Пациенты</h2></div><button className="darkButton small" onClick={()=>setAction("add")}><Plus/>Добавить</button></div>{list.map((item,i)=><button className={`patientRow ${i===active?"active":""}`} key={item.id} onClick={()=>setActive(i)}><span>{item.name.split(" ").slice(0,2).map(s=>s[0]).join("")}</span><div><b>{item.name}</b><small>{item.id} · {item.procedure}</small></div><em>{item.risk}%</em><ChevronRight/></button>)}</section><section className="panel detail"><div className="sectionTitle"><div><span className="eyebrow">КАРТА ПАЦИЕНТА</span><h2>{p.name}</h2></div><button className="iconText" onClick={()=>setAction("edit")}><SlidersHorizontal/>Редактировать</button></div><p>{p.procedure}, {p.eye}</p><div className="facts"><div><span>Дата операции</span><b>{p.operationDate}</b></div><div><span>Лечащий врач</span><b>{p.doctor}</b></div><div><span>Риск</span><b>{p.risk}%</b></div><div><span>Достоверность</span><b>{p.confidence}%</b></div></div><div className="clinicalNote"><Stethoscope/><div><b>Клинический статус</b><p>{p.status}. Последняя открытая точка: визит {visitIndex+1}.</p></div></div><div className="quickGrid"><button onClick={()=>setVisits(true)}><CalendarDays/><span>Визиты</span><ChevronRight/></button><button onClick={()=>setAction("studies")}><Microscope/><span>Исследования</span><ChevronRight/></button><button onClick={()=>setDocuments(true)}><FileText/><span>Документы</span><ChevronRight/></button></div></section></div>{visits&&<VisitDrawer patientName={p.name} close={()=>setVisits(false)} onSelect={setVisitIndex}/>} {documents&&<DocumentWorkspace onClose={()=>setDocuments(false)} notify={notify}/>} {action&&<Modal title={action==="add"?"Новый пациент":action==="edit"?"Редактирование карты":"Исследования пациента"} close={()=>setAction(null)}>{action==="add"||action==="edit"?<div className="formGrid"><label>ФИО<input defaultValue={action==="edit"?p.name:""} placeholder="Фамилия Имя Отчество"/></label><label>ID пациента<input defaultValue={action==="edit"?p.id:""} placeholder="CR-0000"/></label><label>Процедура<select defaultValue={p.procedure}><option>Сквозная кератопластика</option><option>DMEK</option><option>DSAEK</option></select></label><label>Глаз<select defaultValue={p.eye}><option>OD</option><option>OS</option></select></label><button className="darkButton" onClick={()=>{notify(action==="add"?"Пациент добавлен в демонстрационный реестр":"Изменения карты сохранены");setAction(null)}}><Save/>Сохранить</button></div>:<div className="studyList">{[["AS-OCT","14.05.2026","565 µm"],["Спекулярная микроскопия","14.05.2026","ECD 1820"],["Пахиметрия","14.05.2026","Δ +28 µm"]].map(x=><button key={x[0]} onClick={()=>notify(`${x[0]} открыто`)}><Microscope/><div><b>{x[0]}</b><span>{x[1]}</span></div><strong>{x[2]}</strong><ChevronRight/></button>)}</div>}</Modal>}</>}

type PacsVisit={date:string;label:string;risk:number;cct:number;ecd:number;cv:number;hex:number;il6:number;note:string};
const pacsVisits:PacsVisit[]=[
 {date:"14.05.2026",label:"Текущий визит",risk:72,cct:565,ecd:1820,cv:38,hex:43,il6:14.8,note:"Умеренное утолщение трансплантата и снижение эндотелиального резерва."},
 {date:"18.03.2026",label:"Контроль",risk:58,cct:548,ecd:1945,cv:35,hex:47,il6:12.5,note:"Нарастание полимегатизма при сохранённой прозрачности оптической зоны."},
 {date:"10.12.2025",label:"Плановый визит",risk:41,cct:531,ecd:2088,cv:32,hex:52,il6:9.4,note:"Стабильная морфология трансплантата без выраженного отёка."},
 {date:"20.08.2025",label:"Послеоперационный контроль",risk:29,cct:518,ecd:2210,cv:29,hex:57,il6:7.1,note:"Ранний послеоперационный период, показатели в ожидаемом диапазоне."}
];

type PacsTool="window"|"zoom"|"pan"|"measure"|"annotate";
function useCanvasSize(ref:React.RefObject<HTMLCanvasElement|null>,draw:(ctx:CanvasRenderingContext2D,w:number,h:number,dpr:number)=>void,deps:any[]){
 useEffect(()=>{const c=ref.current;if(!c)return;let raf=0;const render=()=>{const r=c.getBoundingClientRect();const d=Math.min(window.devicePixelRatio||1,2);if(c.width!==Math.round(r.width*d)||c.height!==Math.round(r.height*d)){c.width=Math.round(r.width*d);c.height=Math.round(r.height*d)}const x=c.getContext('2d');if(!x)return;x.setTransform(d,0,0,d,0,0);x.clearRect(0,0,r.width,r.height);draw(x,r.width,r.height,d);raf=requestAnimationFrame(render)};render();return()=>cancelAnimationFrame(raf)},deps);
}

function OctViewport({visit,compare,tool,zoom,offset,onMeasure}:{visit:PacsVisit;compare?:PacsVisit;tool:PacsTool;zoom:number;offset:{x:number;y:number};onMeasure:(v:number)=>void}){
 const ref=useRef<HTMLCanvasElement>(null);const drag=useRef<{x:number;y:number}|null>(null);const [measure,setMeasure]=useState<{a:{x:number;y:number},b:{x:number;y:number}}|null>(null);
 useCanvasSize(ref,(ctx,w,h)=>{ctx.fillStyle='#05090d';ctx.fillRect(0,0,w,h);ctx.save();ctx.translate(offset.x,offset.y);ctx.scale(zoom,zoom);const W=w/zoom,H=h/zoom;const seed=visit.cct;
  const noise=(x:number,y:number)=>Math.sin(x*.17+y*.11+seed)*.5+Math.sin(x*.043-y*.08)*.5;
  const img=ctx.createImageData(Math.max(1,Math.floor(W)),Math.max(1,Math.floor(H)));for(let y=0;y<img.height;y++){for(let x=0;x<img.width;x++){const top=H*.31+Math.pow((x-W/2)/(W*.58),2)*H*.24;const thick=H*(.16+(visit.cct-510)/900);const bot=top+thick;let v=4+Math.random()*3;if(y>top&&y<bot){const edge=Math.min(y-top,bot-y);v=30+80*Math.exp(-edge*.18)+48*(noise(x,y)+1)/2;if(Math.abs(x-W*.66)<W*.1&&visit.risk>55)v+=26*Math.exp(-Math.abs(y-(top+thick*.55))*.04)}const i=(y*img.width+x)*4;img.data[i]=v*.58;img.data[i+1]=v*.9;img.data[i+2]=v;img.data[i+3]=255}}ctx.putImageData(img,0,0);
  ctx.strokeStyle='rgba(190,255,247,.72)';ctx.lineWidth=1.2/zoom;ctx.beginPath();for(let x=0;x<W;x+=3){const y=H*.31+Math.pow((x-W/2)/(W*.58),2)*H*.24;x?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke();
  ctx.strokeStyle='rgba(55,189,178,.75)';ctx.beginPath();for(let x=0;x<W;x+=3){const top=H*.31+Math.pow((x-W/2)/(W*.58),2)*H*.24;const y=top+H*(.16+(visit.cct-510)/900);x?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke();
  const gx=W*.19, gx2=W*.81;ctx.setLineDash([5/zoom,5/zoom]);ctx.strokeStyle='rgba(244,201,95,.8)';[gx,gx2].forEach(x=>{ctx.beginPath();ctx.moveTo(x,H*.34);ctx.lineTo(x,H*.7);ctx.stroke()});ctx.setLineDash([]);
  ctx.restore();ctx.fillStyle='rgba(7,19,25,.72)';ctx.fillRect(12,12,170,47);ctx.fillStyle='#dffbf6';ctx.font='600 11px sans-serif';ctx.fillText(`AS-OCT · ${visit.date}`,24,31);ctx.fillStyle='#7ea5ad';ctx.font='9px sans-serif';ctx.fillText(`CCT ${visit.cct} µm · 8.0 mm scan`,24,48);
  const rulerX=w-54;ctx.strokeStyle='rgba(255,255,255,.5)';ctx.beginPath();ctx.moveTo(rulerX,40);ctx.lineTo(rulerX,h-35);ctx.stroke();for(let y=40;y<h-34;y+=25){ctx.beginPath();ctx.moveTo(rulerX-5,y);ctx.lineTo(rulerX+5,y);ctx.stroke()}
  if(compare){ctx.fillStyle='rgba(12,38,45,.84)';ctx.fillRect(w-220,12,154,47);ctx.fillStyle='#dffbf6';ctx.font='600 10px sans-serif';ctx.fillText(`Сравнение: ${compare.date}`,w-208,31);ctx.fillStyle='#f0c96c';ctx.fillText(`Δ CCT ${visit.cct-compare.cct>0?'+':''}${visit.cct-compare.cct} µm`,w-208,48)}
  if(measure){ctx.strokeStyle='#ffd36e';ctx.fillStyle='#ffd36e';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(measure.a.x,measure.a.y);ctx.lineTo(measure.b.x,measure.b.y);ctx.stroke();[measure.a,measure.b].forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);ctx.fill()});const px=Math.hypot(measure.b.x-measure.a.x,measure.b.y-measure.a.y);const um=Math.round(px*2.15);ctx.fillStyle='rgba(20,26,28,.9)';ctx.fillRect((measure.a.x+measure.b.x)/2-34,(measure.a.y+measure.b.y)/2-24,68,18);ctx.fillStyle='#ffe6a5';ctx.font='600 10px sans-serif';ctx.textAlign='center';ctx.fillText(`${um} µm`,(measure.a.x+measure.b.x)/2,(measure.a.y+measure.b.y)/2-11);ctx.textAlign='left'}
 },[visit,compare,zoom,offset,measure]);
 return <canvas ref={ref} className={`pacsCanvas tool-${tool}`} onPointerDown={e=>{const r=e.currentTarget.getBoundingClientRect();const p={x:e.clientX-r.left,y:e.clientY-r.top};if(tool==='measure'){setMeasure({a:p,b:p});drag.current=p}else drag.current=p}} onPointerMove={e=>{if(!drag.current)return;const r=e.currentTarget.getBoundingClientRect();const p={x:e.clientX-r.left,y:e.clientY-r.top};if(tool==='measure'&&measure)setMeasure({...measure,b:p})}} onPointerUp={()=>{if(measure){const v=Math.round(Math.hypot(measure.b.x-measure.a.x,measure.b.y-measure.a.y)*2.15);onMeasure(v)}drag.current=null}}/>;
}

function SpecularViewport({visit}:{visit:PacsVisit}){const ref=useRef<HTMLCanvasElement>(null);useCanvasSize(ref,(ctx,w,h)=>{ctx.fillStyle='#071116';ctx.fillRect(0,0,w,h);const cell=Math.max(12,Math.sqrt(1000000/visit.ecd)*.52);const cols=Math.ceil(w/cell)+2,rows=Math.ceil(h/(cell*.86))+2;ctx.lineWidth=.75;for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const x=c*cell+(r%2)*cell*.5-10,y=r*cell*.86-10;const jitter=(Math.sin(c*12.3+r*3.7+visit.cv)*.5+.5)*(visit.cv-25)*.08;const rad=cell*.58+jitter;ctx.beginPath();for(let k=0;k<6;k++){const a=Math.PI/3*k;const px=x+Math.cos(a)*(rad*(k%2?1.03:.96)),py=y+Math.sin(a)*(rad*(1+Math.sin(c+r)*.035));k?ctx.lineTo(px,py):ctx.moveTo(px,py)}ctx.closePath();const shade=28+Math.round((Math.sin(c*.9+r*1.7)+1)*10);ctx.fillStyle=`rgb(${shade},${shade+8},${shade+11})`;ctx.fill();ctx.strokeStyle='rgba(176,222,224,.52)';ctx.stroke()}ctx.fillStyle='rgba(5,15,19,.82)';ctx.fillRect(12,12,178,66);ctx.fillStyle='#d7f7f2';ctx.font='600 11px sans-serif';ctx.fillText('СПЕКУЛЯРНАЯ МИКРОСКОПИЯ',23,31);ctx.fillStyle='#82a7ae';ctx.font='9px sans-serif';ctx.fillText(`ECD ${visit.ecd} кл/мм²`,23,48);ctx.fillText(`CV ${visit.cv}% · HEX ${visit.hex}%`,23,63);ctx.strokeStyle='#fff';ctx.beginPath();ctx.moveTo(w-100,h-28);ctx.lineTo(w-30,h-28);ctx.stroke();ctx.fillStyle='#fff';ctx.font='8px sans-serif';ctx.fillText('100 µm',w-98,h-34)},[visit]);return <canvas ref={ref} className="pacsCanvas"/>}

function PachymetryViewport({visit}:{visit:PacsVisit}){const ref=useRef<HTMLCanvasElement>(null);const [hover,setHover]=useState<{x:number;y:number;v:number}|null>(null);useCanvasSize(ref,(ctx,w,h)=>{ctx.fillStyle='#0a1419';ctx.fillRect(0,0,w,h);const cx=w*.45,cy=h*.52,R=Math.min(w,h)*.38;const grd=ctx.createRadialGradient(cx,cy,0,cx,cy,R);grd.addColorStop(0,visit.cct>550?'#e6c75a':'#59b986');grd.addColorStop(.26,'#73c384');grd.addColorStop(.48,'#46a7a7');grd.addColorStop(.72,'#3f72b1');grd.addColorStop(1,'#263f78');ctx.fillStyle=grd;ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.fill();ctx.save();ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.clip();for(let r=.2;r<=1;r+=.2){ctx.strokeStyle='rgba(255,255,255,.27)';ctx.beginPath();ctx.arc(cx,cy,R*r,0,Math.PI*2);ctx.stroke()}for(let a=0;a<Math.PI*2;a+=Math.PI/6){ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*R,cy+Math.sin(a)*R);ctx.stroke()}ctx.restore();ctx.fillStyle='#e7faf7';ctx.font='700 22px sans-serif';ctx.textAlign='center';ctx.fillText(String(visit.cct),cx,cy+7);ctx.font='9px sans-serif';ctx.fillText('µm · CCT',cx,cy+23);ctx.textAlign='left';const lx=w-96,ly=42,lh=h-84;const lg=ctx.createLinearGradient(0,ly,0,ly+lh);lg.addColorStop(0,'#e9c84d');lg.addColorStop(.28,'#6ac17f');lg.addColorStop(.55,'#48a3aa');lg.addColorStop(1,'#263f78');ctx.fillStyle=lg;ctx.fillRect(lx,ly,14,lh);ctx.fillStyle='#cde3e6';ctx.font='8px sans-serif';[650,600,550,500,450].forEach((v,i)=>ctx.fillText(String(v),lx+22,ly+i*lh/4+4));if(hover){ctx.fillStyle='rgba(4,14,18,.88)';ctx.fillRect(hover.x+12,hover.y-35,76,27);ctx.fillStyle='#fff';ctx.font='600 10px sans-serif';ctx.fillText(`${hover.v} µm`,hover.x+22,hover.y-18)}},[visit,hover]);return <canvas ref={ref} className="pacsCanvas" onPointerMove={e=>{const r=e.currentTarget.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,cx=r.width*.45,cy=r.height*.52,R=Math.min(r.width,r.height)*.38,d=Math.hypot(x-cx,y-cy);setHover(d<R?{x,y,v:Math.round(visit.cct+d/R*62+Math.sin(x*.08+y*.05)*7)}:null)}} onPointerLeave={()=>setHover(null)}/>}

function Observation({notify}:{notify:(s:string)=>void}){
 const [visitIndex,setVisitIndex]=useState(0),[compareIndex,setCompareIndex]=useState<number|null>(1),[mode,setMode]=useState<'oct'|'specular'|'pachymetry'>('oct'),[tool,setTool]=useState<PacsTool>('window'),[zoom,setZoom]=useState(1),[offset]=useState({x:0,y:0}),[measurement,setMeasurement]=useState<number|null>(null),[cine,setCine]=useState(false);const visit=pacsVisits[visitIndex];
 useEffect(()=>{if(!cine)return;const id=setInterval(()=>setVisitIndex(v=>(v+1)%pacsVisits.length),1400);return()=>clearInterval(id)},[cine]);
 return <section className="pacsWorkstation"><header className="pacsHeader"><div><span className="eyebrow">AURELIA IMAGING · PACS WORKSTATION</span><h2>Передний отрезок · {patient.eye}</h2><p>{patient.name} · {patient.id} · {patient.procedure}</p></div><div className="pacsHeaderMetrics"><article><span>AI-риск</span><b>{visit.risk}%</b></article><article><span>CCT</span><b>{visit.cct} µm</b></article><article><span>ECD</span><b>{visit.ecd}</b></article><button onClick={()=>notify('Исследование добавлено в клинический отчёт')}><FileText/>В отчёт</button></div></header><div className="pacsLayout"><aside className="studyRail"><div className="railTitle"><b>Исследования</b><span>{pacsVisits.length} визита</span></div>{pacsVisits.map((v,i)=><button key={v.date} className={visitIndex===i?'active':''} onClick={()=>setVisitIndex(i)}><i/><div><b>{v.date}</b><span>{v.label}</span><small>OCT · SP · PACHY</small></div><strong>{v.risk}%</strong></button>)}<div className="railCompare"><span>Сравнить с</span><select value={compareIndex??''} onChange={e=>setCompareIndex(e.target.value===''?null:Number(e.target.value))}><option value="">Без сравнения</option>{pacsVisits.map((v,i)=>i!==visitIndex&&<option key={v.date} value={i}>{v.date}</option>)}</select></div></aside><main className="viewerArea"><div className="pacsToolbar"><div className="modalityTabs"><button className={mode==='oct'?'active':''} onClick={()=>setMode('oct')}><ScanLine/>AS-OCT</button><button className={mode==='specular'?'active':''} onClick={()=>setMode('specular')}><Microscope/>Эндотелий</button><button className={mode==='pachymetry'?'active':''} onClick={()=>setMode('pachymetry')}><Gauge/>Пахиметрия</button></div><div className="toolGroup">{(['window','zoom','pan','measure','annotate'] as PacsTool[]).map(t=><button key={t} className={tool===t?'active':''} onClick={()=>setTool(t)} title={t}>{t==='window'?'W/L':t==='zoom'?'Zoom':t==='pan'?'Pan':t==='measure'?'Measure':'Note'}</button>)}<button onClick={()=>setZoom(z=>Math.max(.75,z-.15))}>−</button><span>{Math.round(zoom*100)}%</span><button onClick={()=>setZoom(z=>Math.min(2.2,z+.15))}>+</button><button className={cine?'active':''} onClick={()=>setCine(v=>!v)}>{cine?<Pause/>:<Play/>}</button><button onClick={()=>{setZoom(1);setMeasurement(null)}}><RotateCcw/></button></div></div><div className="viewportGrid"><div className="primaryViewport">{mode==='oct'&&<OctViewport visit={visit} compare={compareIndex!==null?pacsVisits[compareIndex]:undefined} tool={tool} zoom={zoom} offset={offset} onMeasure={v=>{setMeasurement(v);notify(`Измерение сохранено: ${v} µm`)}}/>}{mode==='specular'&&<SpecularViewport visit={visit}/>} {mode==='pachymetry'&&<PachymetryViewport visit={visit}/>}<div className="viewportCorner"><span>{mode==='oct'?'B-SCAN 8.0 MM':mode==='specular'?'CENTER · AUTO COUNT':'AXIAL MAP'}</span><b>OD</b></div></div><aside className="analysisPanel"><div className="analysisStatus"><i className={visit.risk>60?'warn':''}/><div><b>{visit.risk>60?'Требует проверки':'Стабильная динамика'}</b><span>Автоматизированная оценка качества: 92%</span></div></div><div className="metricMatrix"><article><span>CCT</span><b>{visit.cct}</b><small>µm</small></article><article><span>ECD</span><b>{visit.ecd}</b><small>кл/мм²</small></article><article><span>CV</span><b>{visit.cv}%</b><small>{visit.cv>33?'выше':'норма'}</small></article><article><span>HEX</span><b>{visit.hex}%</b><small>{visit.hex<50?'снижена':'норма'}</small></article></div>{measurement&&<div className="savedMeasure"><ScanLine/><div><b>Линейное измерение</b><span>{measurement} µm · сохранено в серии</span></div><button onClick={()=>setMeasurement(null)}><X/></button></div>}<div className="trendBlock"><div><b>Продольная динамика</b><span>4 визита</span></div><svg viewBox="0 0 260 90"><polyline points={pacsVisits.slice().reverse().map((v,i)=>`${15+i*75},${76-(v.cct-500)*.55}`).join(' ')} fill="none" stroke="#49c4b4" strokeWidth="2"/>{pacsVisits.slice().reverse().map((v,i)=><circle key={v.date} cx={15+i*75} cy={76-(v.cct-500)*.55} r="3.5" fill="#dffbf5" stroke="#49c4b4"/>)}</svg><small>CCT увеличилась на {pacsVisits[0].cct-pacsVisits[3].cct} µm с августа 2025</small></div><div className="clinicalInterpretation"><span className="eyebrow">ИНТЕРПРЕТАЦИЯ</span><p>{visit.note}</p><button onClick={()=>notify('Черновик заключения обновлён данными активного визита')}><WandSparkles/>Обновить заключение</button></div></aside></div><footer className="seriesStrip">{['AS-OCT radial','AS-OCT horizontal','Specular center','Pachymetry axial'].map((x,i)=><button key={x} className={(mode==='oct'&&i<2)||(mode==='specular'&&i===2)||(mode==='pachymetry'&&i===3)?'active':''} onClick={()=>setMode(i<2?'oct':i===2?'specular':'pachymetry')}><span className={`thumb thumb${i}`}/><div><b>{x}</b><small>{visit.date} · OD</small></div></button>)}</footer></main></div></section>
}

function Research({notify}:{notify:(s:string)=>void}){const [analysis,setAnalysis]=useState(false);const [feature,setFeature]=useState<Marker|null>(null);return <><div className="metrics">{[["AUROC","0,91"],["Чувствительность","86%"],["Специфичность","82%"],["Brier score","0,11"]].map(([a,b])=><article key={a}><span>{a}</span><strong>{b}</strong><small>валидационная выборка</small></article>)}</div><div className="split equal"><section className="panel"><div className="sectionTitle"><div><span className="eyebrow">КАЧЕСТВО МОДЕЛИ</span><h2>ROC-кривая</h2></div><button className="iconText" onClick={()=>{downloadCsv();notify("ROC CSV скачан")}}><Download/>Экспорт</button></div><svg className="roc" viewBox="0 0 500 320"><line x1="60" y1="270" x2="450" y2="270"/><line x1="60" y1="40" x2="60" y2="270"/><line className="diag" x1="60" y1="270" x2="450" y2="40"/><path d="M60 270 C78 170 130 100 215 65 C300 28 382 42 450 40"/></svg></section><section className="panel"><div className="sectionTitle"><div><span className="eyebrow">ОБЪЯСНЕНИЕ</span><h2>Важность признаков</h2></div><ChartNoAxesCombined/></div><div className="importance">{markers.slice().sort((a,b)=>b.weight-a.weight).slice(0,12).map(m=><button key={m.name} onClick={()=>setFeature(m)}><span>{m.name}</span><em><i style={{width:`${m.weight}%`}}/></em><b>{m.weight}%</b></button>)}</div></section></div><section className="panel actionPanel"><div><Dna/><div><span className="eyebrow">COHORT LAB</span><h2>Анализ исследовательской когорты</h2><p>Сравнение подгрупп, калибровки и устойчивости модели.</p></div></div><button className="darkButton" onClick={()=>setAnalysis(true)}>Создать анализ<Plus/></button></section>{feature&&<Modal title={feature.name} close={()=>setFeature(null)}><div className="markerModal"><strong>{feature.weight}%</strong><span>вклад</span></div><p>{feature.group}. Значение {feature.value} {feature.unit}; динамика {feature.delta>0?"+":""}{feature.delta}%. Признак повышает модельную оценку риска.</p></Modal>}{analysis&&<Modal title="Новый когортный анализ" close={()=>setAnalysis(false)}><div className="formGrid"><label>Тип трансплантации<select><option>Все типы</option><option>Сквозная кератопластика</option><option>DMEK</option></select></label><label>Горизонт прогноза<select><option>90 дней</option><option>180 дней</option><option>365 дней</option></select></label><label>Минимальный размер<input type="number" defaultValue="120"/></label><button className="darkButton" onClick={()=>{setAnalysis(false);notify("Когортный анализ рассчитан: n=184, AUROC 0,89")}}><Gauge/>Рассчитать</button></div></Modal>}</>}
function makeReport(title:string){const rows=markers.map(m=>`<tr><td>${m.name}</td><td>${m.value} ${m.unit}</td><td>${m.ref}</td><td>${m.delta>0?"+":""}${m.delta}%</td><td>${m.weight}%</td></tr>`).join("");const html=`<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>${title}</title><style>body{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;margin:48px;color:#102532;line-height:1.55}header{border-bottom:1px solid #d9e5e8;padding-bottom:22px}h1{font-size:34px}h2{margin-top:36px}.risk{font-size:52px;font-weight:800}.box{padding:22px;background:#f1f7f7;border-radius:18px;margin:24px 0}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.grid div{border:1px solid #e0e9eb;padding:14px;border-radius:12px}table{width:100%;border-collapse:collapse;font-size:12px}th,td{padding:9px;border-bottom:1px solid #e2eaec;text-align:left}.foot{margin-top:42px;font-size:11px;color:#6f818b}@media print{button{display:none}}</style></head><body><header><b>AURELIA Clinical Intelligence</b><h1>${title}</h1><small>Сформировано 23.07.2026</small></header><h2>Executive summary</h2><div class="box"><div>Риск отторжения</div><div class="risk">${patient.risk}%</div><b>Достоверность ${patient.confidence}%</b></div><div class="grid"><div><small>Пациент</small><br><b>${patient.name}</b></div><div><small>Операция</small><br><b>${patient.procedure}</b></div><div><small>Глаз</small><br><b>${patient.eye}</b></div></div><h2>Клиническое заключение</h2><p>Неблагоприятная динамика формируется сочетанием IL-6, IL-17A, IL-23, VEGF-A, CXCL10 и снижением плотности эндотелия. Рекомендуется сокращённый интервал наблюдения.</p><h2>Полная панель признаков</h2><table><thead><tr><th>Показатель</th><th>Значение</th><th>Референс</th><th>Динамика</th><th>Вклад</th></tr></thead><tbody>${rows}</tbody></table><h2>План</h2><ol><li>Повторить расширенную цитокиновую панель через 14 дней.</li><li>Выполнить спекулярную микроскопию и пахиметрию.</li><li>Оценить клинические признаки воспаления и прозрачность трансплантата.</li><li>Сопоставить результаты с предыдущим визитом.</li></ol><div class="foot">Система поддержки принятия решений. Итоговую интерпретацию выполняет врач.</div></body></html>`;const blob=new Blob([html],{type:"text/html;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=title.replaceAll(" ","-")+".html";a.click();URL.revokeObjectURL(url)}

function Reports({notify}:{notify:(s:string)=>void}){const [preview,setPreview]=useState<string|null>(null);const [section,setSection]=useState("summary");const reports=[{t:"Полное клиническое заключение",d:"Executive summary, цифровой двойник, полный профиль признаков и план наблюдения.",i:Stethoscope},{t:"Иммунологический профиль",d:"Интерлейкины, хемокины, факторы роста, VEGF и показатели ремоделирования.",i:Dna},{t:"Динамика трансплантата",d:"Траектория риска, визиты, пахиметрия и состояние эндотелия.",i:Activity},{t:"Валидация модели",d:"ROC, калибровка, метрики, важность признаков и ограничения.",i:ShieldCheck}];return <><section className="reportStudio"><div><span className="eyebrow">AURELIA REPORT STUDIO</span><h1>Клинические отчёты</h1><p>Интерактивные документы с цифровым двойником, объяснением модели и полной панелью признаков.</p></div><button className="darkButton" onClick={()=>{makeReport("Полное клиническое заключение");notify("Полный отчёт сформирован")}}><Download/>Сформировать полный отчёт</button></section><div className="reportGrid">{reports.map(r=>{const Icon=r.i;return <article key={r.t}><div className="reportTop"><div className="reportBadge"><Icon/></div><span>Полная версия</span></div><h2>{r.t}</h2><p>{r.d}</p><div className="reportMeta"><span>40 признаков</span><span>Готов к печати</span></div><div className="reportActions"><button onClick={()=>setPreview(r.t)}><Eye/>Просмотр</button><button onClick={()=>{makeReport(r.t);notify("Отчёт сформирован")}}><Download/>Скачать</button><button onClick={()=>{makeReport(r.t);notify("Открыт файл для печати")}}><Printer/></button></div></article>})}{preview&&<Modal title={preview} close={()=>setPreview(null)}><div className="reportPreview"><div className="reportTabs">{[["summary","Резюме"],["markers","Биомаркеры"],["twin","Цифровой двойник"],["plan","План"]].map(([id,label])=><button key={id} className={section===id?"active":""} onClick={()=>setSection(id)}>{label}</button>)}</div><span>AURELIA Clinical Intelligence</span><h2>{patient.name}</h2><div className="previewRisk"><small>Риск отторжения</small><strong>{patient.risk}%</strong><b>Достоверность {patient.confidence}%</b></div>{section==="summary"&&<><h3>Ключевой вывод</h3><p>Рост IL-6, IL-17A, VEGF-A и CXCL10 в сочетании со снижением плотности эндотелия требует контроля через 14 дней.</p></>}{section==="markers"&&<div className="previewMarkers">{markers.slice().sort((a,b)=>b.weight-a.weight).slice(0,8).map(m=><div key={m.name}><b>{m.name}</b><span>{m.value} {m.unit}</span><em>{m.weight}%</em></div>)}</div>}{section==="twin"&&<div className="previewTwin"><Layers3/><div><b>Digital Corneal Twin</b><p>Синхронизирован с визитом 14.05.2026. Выявлены воспалительная активность и снижение эндотелиального резерва.</p></div></div>}{section==="plan"&&<ol className="previewPlan"><li>Расширенная цитокиновая панель через 14 дней.</li><li>Спекулярная микроскопия и пахиметрия.</li><li>Повторная оценка риска после получения данных.</li></ol>}<button className="darkButton" onClick={()=>makeReport(preview)}><Download/>Скачать полный отчёт</button></div></Modal>}</div></>}

function Help(){return <section className="panel prose"><BookOpen/><span className="eyebrow">СПРАВОЧНЫЙ ЦЕНТР</span><h2>Работа с AURELIA</h2>{["Интерпретация риска","Цифровой двойник","Биомаркеры и референсы","Формирование отчёта","Ограничения модели"].map(x=><details key={x}><summary>{x}<ChevronRight/></summary><p>Раздел содержит клинические и технические пояснения, необходимые для корректной интерпретации результатов системы.</p></details>)}</section>}
function SettingsView({notify}:{notify:(s:string)=>void}){return <section className="settingsCards">{["Интерфейс","Уведомления","Отчёты","Безопасность"].map((x,i)=><article key={x}><h2>{x}</h2><label><span>{i===0?"Плавные анимации":i===1?"Критические изменения":i===2?"Включать графики":"Двухфакторный вход"}</span><input type="checkbox" defaultChecked onChange={()=>notify("Настройка сохранена")}/></label><label><span>{i===0?"Компактная навигация":i===1?"Напоминания о визитах":i===2?"Объяснение модели":"Журнал действий"}</span><input type="checkbox" defaultChecked={i>0} onChange={()=>notify("Настройка сохранена")}/></label></article>)}</section>}

function Modal({title,close,children}:{title:string;close:()=>void;children:React.ReactNode}){return <div className="modalBackdrop" onMouseDown={close}><div className="modal" onMouseDown={e=>e.stopPropagation()}><div className="modalHead"><div><span className="eyebrow">AURELIA</span><h2>{title}</h2></div><button onClick={close}><X/></button></div>{children}</div></div>}

export default function Page(){return <Shell/>}
