export type View = "home" | "patients" | "observation" | "research" | "reports" | "help" | "settings";
export type TwinMode = "fusion" | "anatomy" | "explorer" | "heat" | "network" | "timeline" | "forecast" | "simulation";
export type Marker = { name: string; group: string; value: number; unit: string; ref: string; delta: number; weight: number; status: "high" | "low" | "normal" };

export type Patient = {
  id: string; name: string; age: number; eye: "OD" | "OS"; procedure: string; operationDate: string;
  doctor: string; risk: number; confidence: number; status: string; history: number[];
};

export const patient: Patient = {
  id: "CR-0318", name: "Иванов Иван Иванович", age: 56, eye: "OD",
  procedure: "Сквозная кератопластика", operationDate: "12.04.2025",
  doctor: "Смирнова Е.А.", risk: 72, confidence: 93, status: "Требует внимания",
  history: [24, 29, 36, 44, 53, 63, 72]
};

export const markers: Marker[] = [
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
