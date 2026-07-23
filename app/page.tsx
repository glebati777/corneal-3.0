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
type TwinMode = "anatomy" | "explorer" | "heat" | "network" | "timeline" | "forecast" | "simulation";
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
  {id:"anatomy",label:"Диагностическая станция",icon:Microscope},
  {id:"explorer",label:"3D Cornea Explorer",icon:Layers3},
  {id:"heat",label:"Карта активности",icon:ScanLine},
  {id:"network",label:"Сеть биомаркеров",icon:Network},
  {id:"timeline",label:"Машина времени",icon:Clock3},
  {id:"forecast",label:"Прогноз 90 дней",icon:ChartNoAxesCombined},
  {id:"simulation",label:"Сценарии лечения",icon:SlidersHorizontal}
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
  const [mode,setMode]=useState<TwinMode>("anatomy"); const [time,setTime]=useState(10); const [selected,setSelected]=useState(0); const [fullscreen,setFullscreen]=useState(false); const [compare,setCompare]=useState(false);
  const [adherence,setAdherence]=useState(82); const [therapy,setTherapy]=useState(64); const [monitoring,setMonitoring]=useState(78);
  const top=useMemo(()=>markers.slice().sort((a,b)=>b.weight-a.weight).slice(0,14),[]); const signal=top[selected];
  const simulatedRisk=Math.max(18,Math.round(patient.risk-(adherence*.18+therapy*.16+monitoring*.08-18)));
  return <section className={`worldTwin ${fullscreen?"fullscreen":""}`}>
    <div className="twinHeader"><div><span className="eyebrow">AURELIA CLINICAL INTELLIGENCE 2.0 · CORNEAL TWIN GEN 5</span><h2>Мультимодальная модель трансплантата</h2><p>Единое клиническое пространство: AS-OCT, 3D-реконструкция, эндотелий, пахиметрия, биомаркеры и объяснение модели синхронизированы по визиту.</p></div><div className="twinActions"><button className={compare?"active":""} onClick={()=>setCompare(!compare)} title="Сравнить с прошлым визитом"><History/></button><button onClick={()=>{setTime(10);setSelected(0);setMode("anatomy");setAdherence(82);setTherapy(64);setMonitoring(78)}} title="Сбросить"><RotateCcw/></button><button onClick={()=>setFullscreen(!fullscreen)} title="Развернуть"><Maximize2/></button></div></div>
    <div className="modeRail">{twinModes.map(({id,label,icon:Icon})=><button key={id} className={mode===id?"active":""} onClick={()=>setMode(id)}><Icon/><span>{label}</span></button>)}</div>
    <div className="twinBody"><div className={`visualStage ${compare?"compareOn":""}`}><DigitalTwin mode={mode} time={time} selected={selected} onSelect={setSelected}/><div className="stageBadge"><i/><span>{compare?"Сравнение: +30 дней":"Модель синхронизирована"}</span><b>14.05.2026</b></div><div className="modelTelemetry"><span><i/> AS-OCT 14.05.2026</span><span><i/> ECD 1820 кл/мм²</span><span><i/> CCT 565 µm</span></div>{compare&&<div className="comparisonCard"><span>Изменение с прошлого визита</span><strong>+14%</strong><small>IL-6 ↑18% · VEGF-A ↑11% · ECD ↓7%</small></div>}</div>
      <aside className="inspector"><span className="eyebrow">{mode==="simulation"?"CLINICAL SCENARIO ENGINE":"КЛИНИЧЕСКИЙ СИГНАЛ"}</span><h3>{mode==="network"?signal.name:mode==="forecast"?"Прогноз при наблюдении":mode==="simulation"?"Персональный сценарий":mode==="explorer"?"Слои роговицы":"Риск отторжения"}</h3><div className="inspectorValue"><strong>{mode==="network"?signal.value:mode==="forecast"?43:mode==="simulation"?simulatedRisk:mode==="explorer"?5:patient.risk}</strong><span>{mode==="network"?signal.unit:mode==="explorer"?"слоёв":"%"}</span></div>
      {mode==="simulation"?<div className="scenarioControls"><label><span>Приверженность терапии <b>{adherence}%</b></span><input type="range" min="30" max="100" value={adherence} onChange={e=>setAdherence(+e.target.value)}/></label><label><span>Интенсивность терапии <b>{therapy}%</b></span><input type="range" min="20" max="100" value={therapy} onChange={e=>setTherapy(+e.target.value)}/></label><label><span>Частота мониторинга <b>{monitoring}%</b></span><input type="range" min="30" max="100" value={monitoring} onChange={e=>setMonitoring(+e.target.value)}/></label><div className="scenarioDelta"><span>Ожидаемое изменение</span><b>−{patient.risk-simulatedRisk} п.п.</b><small>Расчёт демонстрационный и не заменяет врачебное решение</small></div></div>:<><p>{mode==="network"?`${signal.group}. Динамика ${signal.delta>0?"+":""}${signal.delta}% относительно предыдущего визита.`:mode==="forecast"?"Ожидаемое снижение риска до 43% за 90 дней при выполнении предложенного протокола наблюдения.":"Рост центральной толщины, снижение эндотелиальной плотности и провоспалительный профиль согласованно повышают риск. Визуализация использует демонстрационные данные пациента."}</p><div className="impact"><span>{mode==="network"?"Вклад в прогноз":"Достоверность"}</span><b>{mode==="network"?signal.weight:patient.confidence}%</b><em><i style={{width:`${mode==="network"?signal.weight:patient.confidence}%`}}/></em></div><div className="miniSignals">{top.slice(0,4).map((m,i)=><button key={m.name} onClick={()=>{setMode("network");setSelected(i)}}><span>{m.name}</span><b>{m.weight}%</b></button>)}</div></>}
      <div className="decisionStack"><button className="decision"><span>Следующее действие</span><b>{mode==="simulation"?"Сохранить сценарий":"Контроль через 14 дней"}</b><ChevronRight/></button><button className="darkButton" onClick={onOpen}>Открыть исследование<ArrowUpRight/></button></div></aside>
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

function HomeScreen({go,open}:{go:(v:View)=>void;open:()=>void}){return <><section className="patientHero"><div className="patientIdentity"><div className="avatar">ИИ</div><div><span>{patient.id} · последний визит 14.05.2026</span><h1>{patient.name}</h1><p>{patient.age} лет · {patient.eye} · {patient.procedure}</p></div></div><div className="heroRisk"><span>Риск отторжения</span><strong>{patient.risk}%</strong><small>↑ 14% за 30 дней</small></div><button className="darkButton" onClick={()=>go("patients")}>Открыть профиль<ChevronRight/></button></section><WorldClassTwin onOpen={open}/><section className="priorityBar"><div><Sparkles/><span>Приоритет системы</span><b>Контроль через 14 дней</b></div><p>Повторить панель IL-6, IL-17A, IL-23, VEGF-A и выполнить спекулярную микроскопию.</p><button onClick={()=>go("observation")}>Открыть план<ChevronRight/></button></section></>}

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

function Patients({notify}:{notify:(s:string)=>void}){const [active,setActive]=useState(0);const [visits,setVisits]=useState(false);const [visitIndex,setVisitIndex]=useState(0);const list=[patient,{...patient,id:"CR-0241",name:"Петрова Анна Сергеевна",risk:19,status:"Стабильно"},{...patient,id:"CR-0196",name:"Кузнецов Михаил Олегович",risk:41,status:"Наблюдение"}];const p=list[active];return <><div className="split"><section className="panel"><div className="sectionTitle"><div><span className="eyebrow">РЕЕСТР</span><h2>Пациенты</h2></div><button className="darkButton small" onClick={()=>notify("Форма добавления пациента готова к заполнению")}><Plus/>Добавить</button></div>{list.map((item,i)=><button className={`patientRow ${i===active?"active":""}`} key={item.id} onClick={()=>setActive(i)}><span>{item.name.split(" ").slice(0,2).map(s=>s[0]).join("")}</span><div><b>{item.name}</b><small>{item.id} · {item.procedure}</small></div><em>{item.risk}%</em><ChevronRight/></button>)}</section><section className="panel detail"><div className="sectionTitle"><div><span className="eyebrow">КАРТА ПАЦИЕНТА</span><h2>{p.name}</h2></div><button className="iconText" onClick={()=>notify("Режим редактирования активирован")}><SlidersHorizontal/>Редактировать</button></div><p>{p.procedure}, {p.eye}</p><div className="facts"><div><span>Дата операции</span><b>{p.operationDate}</b></div><div><span>Лечащий врач</span><b>{p.doctor}</b></div><div><span>Риск</span><b>{p.risk}%</b></div><div><span>Достоверность</span><b>{p.confidence}%</b></div></div><div className="clinicalNote"><Stethoscope/><div><b>Клинический статус</b><p>{p.status}. Последняя открытая точка: визит {visitIndex+1}.</p></div></div><div className="quickGrid"><button onClick={()=>setVisits(true)}><CalendarDays/><span>Визиты</span><ChevronRight/></button><button onClick={()=>notify("Исследования пациента загружены")}><Microscope/><span>Исследования</span><ChevronRight/></button><button onClick={()=>notify("Документы пациента загружены")}><FileText/><span>Документы</span><ChevronRight/></button></div></section></div>{visits&&<VisitDrawer patientName={p.name} close={()=>setVisits(false)} onSelect={setVisitIndex}/>}</>}

function Observation({notify}:{notify:(s:string)=>void}){const [group,setGroup]=useState("Все");const [selected,setSelected]=useState<Marker|null>(null);const [visits,setVisits]=useState(false);const [visitIndex,setVisitIndex]=useState(0);const groups=["Все",...Array.from(new Set(markers.map(m=>m.group)))];const filtered=group==="Все"?markers:markers.filter(m=>m.group===group);return <><section className="panel"><div className="sectionTitle"><div><span className="eyebrow">МОЛЕКУЛЯРНЫЙ И КЛИНИЧЕСКИЙ ПРОФИЛЬ</span><h2>40 анализируемых признаков</h2><p className="sectionLead">Иммунология, ангиогенез, ремоделирование и морфометрия трансплантата. Активный визит: {visitIndex+1}.</p></div><button className="iconText" onClick={()=>setVisits(true)}><CalendarDays/>Архив визитов</button></div><div className="filterRow">{groups.map(g=><button key={g} className={group===g?"active":""} onClick={()=>setGroup(g)}>{g}</button>)}</div><div className="markerTable"><div className="markerHead"><span>Показатель</span><span>Значение</span><span>Референс</span><span>Динамика</span><span>Вклад</span></div>{filtered.map(m=><button className="markerRow" key={m.name} onClick={()=>setSelected(m)}><span><b>{m.name}</b><small>{m.group}</small></span><span>{m.value} {m.unit}</span><span>{m.ref}</span><span className={m.delta>0?"up":"down"}>{m.delta>0?"+":""}{m.delta}%</span><span><em><i style={{width:`${m.weight}%`}}/></em>{m.weight}%</span></button>)}</div></section>{visits&&<VisitDrawer patientName={patient.name} close={()=>setVisits(false)} onSelect={i=>{setVisitIndex(i);notify(`Открыт визит ${i+1}`)}}/>}{selected&&<Modal title={selected.name} close={()=>setSelected(null)}><div className="markerModal"><strong>{selected.value}</strong><span>{selected.unit}</span></div><p>{selected.group}. Референсный диапазон: {selected.ref}. Изменение относительно прошлого визита: {selected.delta>0?"+":""}{selected.delta}%.</p><div className="impact"><span>Вклад в прогноз</span><b>{selected.weight}%</b><em><i style={{width:`${selected.weight}%`}}/></em></div></Modal>}</>}

function Research({notify}:{notify:(s:string)=>void}){return <><div className="metrics">{[["AUROC","0,91"],["Чувствительность","86%"],["Специфичность","82%"],["Brier score","0,11"]].map(([a,b])=><article key={a}><span>{a}</span><strong>{b}</strong><small>валидационная выборка</small></article>)}</div><div className="split equal"><section className="panel"><div className="sectionTitle"><div><span className="eyebrow">КАЧЕСТВО МОДЕЛИ</span><h2>ROC-кривая</h2></div><button className="iconText" onClick={()=>notify("Данные ROC экспортированы")}><Download/>Экспорт</button></div><svg className="roc" viewBox="0 0 500 320"><line x1="60" y1="270" x2="450" y2="270"/><line x1="60" y1="40" x2="60" y2="270"/><line className="diag" x1="60" y1="270" x2="450" y2="40"/><path d="M60 270 C78 170 130 100 215 65 C300 28 382 42 450 40"/></svg></section><section className="panel"><div className="sectionTitle"><div><span className="eyebrow">ОБЪЯСНЕНИЕ</span><h2>Важность признаков</h2></div><ChartNoAxesCombined/></div><div className="importance">{markers.slice().sort((a,b)=>b.weight-a.weight).slice(0,12).map(m=><button key={m.name} onClick={()=>notify(`${m.name}: вклад ${m.weight}%`)}><span>{m.name}</span><em><i style={{width:`${m.weight}%`}}/></em><b>{m.weight}%</b></button>)}</div></section></div><section className="panel actionPanel"><div><Dna/><div><span className="eyebrow">COHORT LAB</span><h2>Анализ исследовательской когорты</h2><p>Сравнение подгрупп, калибровки и устойчивости модели.</p></div></div><button className="darkButton" onClick={()=>notify("Новый анализ когорты создан")}>Создать анализ<Plus/></button></section></>}

function makeReport(title:string){const rows=markers.map(m=>`<tr><td>${m.name}</td><td>${m.value} ${m.unit}</td><td>${m.ref}</td><td>${m.delta>0?"+":""}${m.delta}%</td><td>${m.weight}%</td></tr>`).join("");const html=`<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>${title}</title><style>body{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;margin:48px;color:#102532;line-height:1.55}header{border-bottom:1px solid #d9e5e8;padding-bottom:22px}h1{font-size:34px}h2{margin-top:36px}.risk{font-size:52px;font-weight:800}.box{padding:22px;background:#f1f7f7;border-radius:18px;margin:24px 0}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.grid div{border:1px solid #e0e9eb;padding:14px;border-radius:12px}table{width:100%;border-collapse:collapse;font-size:12px}th,td{padding:9px;border-bottom:1px solid #e2eaec;text-align:left}.foot{margin-top:42px;font-size:11px;color:#6f818b}@media print{button{display:none}}</style></head><body><header><b>AURELIA Clinical Intelligence</b><h1>${title}</h1><small>Сформировано 23.07.2026</small></header><h2>Executive summary</h2><div class="box"><div>Риск отторжения</div><div class="risk">${patient.risk}%</div><b>Достоверность ${patient.confidence}%</b></div><div class="grid"><div><small>Пациент</small><br><b>${patient.name}</b></div><div><small>Операция</small><br><b>${patient.procedure}</b></div><div><small>Глаз</small><br><b>${patient.eye}</b></div></div><h2>Клиническое заключение</h2><p>Неблагоприятная динамика формируется сочетанием IL-6, IL-17A, IL-23, VEGF-A, CXCL10 и снижением плотности эндотелия. Рекомендуется сокращённый интервал наблюдения.</p><h2>Полная панель признаков</h2><table><thead><tr><th>Показатель</th><th>Значение</th><th>Референс</th><th>Динамика</th><th>Вклад</th></tr></thead><tbody>${rows}</tbody></table><h2>План</h2><ol><li>Повторить расширенную цитокиновую панель через 14 дней.</li><li>Выполнить спекулярную микроскопию и пахиметрию.</li><li>Оценить клинические признаки воспаления и прозрачность трансплантата.</li><li>Сопоставить результаты с предыдущим визитом.</li></ol><div class="foot">Система поддержки принятия решений. Итоговую интерпретацию выполняет врач.</div></body></html>`;const blob=new Blob([html],{type:"text/html;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=title.replaceAll(" ","-")+".html";a.click();URL.revokeObjectURL(url)}

function Reports({notify}:{notify:(s:string)=>void}){const [preview,setPreview]=useState<string|null>(null);const [section,setSection]=useState("summary");const reports=[{t:"Полное клиническое заключение",d:"Executive summary, цифровой двойник, полный профиль признаков и план наблюдения.",i:Stethoscope},{t:"Иммунологический профиль",d:"Интерлейкины, хемокины, факторы роста, VEGF и показатели ремоделирования.",i:Dna},{t:"Динамика трансплантата",d:"Траектория риска, визиты, пахиметрия и состояние эндотелия.",i:Activity},{t:"Валидация модели",d:"ROC, калибровка, метрики, важность признаков и ограничения.",i:ShieldCheck}];return <><section className="reportStudio"><div><span className="eyebrow">AURELIA REPORT STUDIO</span><h1>Клинические отчёты</h1><p>Интерактивные документы с цифровым двойником, объяснением модели и полной панелью признаков.</p></div><button className="darkButton" onClick={()=>{makeReport("Полное клиническое заключение");notify("Полный отчёт сформирован")}}><Download/>Сформировать полный отчёт</button></section><div className="reportGrid">{reports.map(r=>{const Icon=r.i;return <article key={r.t}><div className="reportTop"><div className="reportBadge"><Icon/></div><span>Полная версия</span></div><h2>{r.t}</h2><p>{r.d}</p><div className="reportMeta"><span>40 признаков</span><span>Готов к печати</span></div><div className="reportActions"><button onClick={()=>setPreview(r.t)}><Eye/>Просмотр</button><button onClick={()=>{makeReport(r.t);notify("Отчёт сформирован")}}><Download/>Скачать</button><button onClick={()=>{makeReport(r.t);notify("Открыт файл для печати")}}><Printer/></button></div></article>})}{preview&&<Modal title={preview} close={()=>setPreview(null)}><div className="reportPreview"><div className="reportTabs">{[["summary","Резюме"],["markers","Биомаркеры"],["twin","Цифровой двойник"],["plan","План"]].map(([id,label])=><button key={id} className={section===id?"active":""} onClick={()=>setSection(id)}>{label}</button>)}</div><span>AURELIA Clinical Intelligence</span><h2>{patient.name}</h2><div className="previewRisk"><small>Риск отторжения</small><strong>{patient.risk}%</strong><b>Достоверность {patient.confidence}%</b></div>{section==="summary"&&<><h3>Ключевой вывод</h3><p>Рост IL-6, IL-17A, VEGF-A и CXCL10 в сочетании со снижением плотности эндотелия требует контроля через 14 дней.</p></>}{section==="markers"&&<div className="previewMarkers">{markers.slice().sort((a,b)=>b.weight-a.weight).slice(0,8).map(m=><div key={m.name}><b>{m.name}</b><span>{m.value} {m.unit}</span><em>{m.weight}%</em></div>)}</div>}{section==="twin"&&<div className="previewTwin"><Layers3/><div><b>Digital Corneal Twin</b><p>Синхронизирован с визитом 14.05.2026. Выявлены воспалительная активность и снижение эндотелиального резерва.</p></div></div>}{section==="plan"&&<ol className="previewPlan"><li>Расширенная цитокиновая панель через 14 дней.</li><li>Спекулярная микроскопия и пахиметрия.</li><li>Повторная оценка риска после получения данных.</li></ol>}<button className="darkButton" onClick={()=>makeReport(preview)}><Download/>Скачать полный отчёт</button></div></Modal>}</div></>}

function Help(){return <section className="panel prose"><BookOpen/><span className="eyebrow">СПРАВОЧНЫЙ ЦЕНТР</span><h2>Работа с AURELIA</h2>{["Интерпретация риска","Цифровой двойник","Биомаркеры и референсы","Формирование отчёта","Ограничения модели"].map(x=><details key={x}><summary>{x}<ChevronRight/></summary><p>Раздел содержит клинические и технические пояснения, необходимые для корректной интерпретации результатов системы.</p></details>)}</section>}
function SettingsView({notify}:{notify:(s:string)=>void}){return <section className="settingsCards">{["Интерфейс","Уведомления","Отчёты","Безопасность"].map((x,i)=><article key={x}><h2>{x}</h2><label><span>{i===0?"Плавные анимации":i===1?"Критические изменения":i===2?"Включать графики":"Двухфакторный вход"}</span><input type="checkbox" defaultChecked onChange={()=>notify("Настройка сохранена")}/></label><label><span>{i===0?"Компактная навигация":i===1?"Напоминания о визитах":i===2?"Объяснение модели":"Журнал действий"}</span><input type="checkbox" defaultChecked={i>0} onChange={()=>notify("Настройка сохранена")}/></label></article>)}</section>}

function Modal({title,close,children}:{title:string;close:()=>void;children:React.ReactNode}){return <div className="modalBackdrop" onMouseDown={close}><div className="modal" onMouseDown={e=>e.stopPropagation()}><div className="modalHead"><div><span className="eyebrow">AURELIA</span><h2>{title}</h2></div><button onClick={close}><X/></button></div>{children}</div></div>}

export default function Page(){return <Shell/>}
