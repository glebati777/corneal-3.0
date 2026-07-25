"use client";

import { useEffect, useMemo, useRef } from "react";
import { markers, type Marker, type TwinMode } from "../../lib/clinical-data";

export function DigitalTwin({mode, time, selected, onSelect}:{mode:TwinMode;time:number;selected:number;onSelect:(n:number)=>void}){
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


