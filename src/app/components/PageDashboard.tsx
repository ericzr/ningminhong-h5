import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Cpu, Thermometer, Droplets, Sun, Wind, Activity,
  Bot, Eye, Grape, Wine, Warehouse, BarChart3,
  AlertTriangle, CheckCircle, Zap, Database,
  TrendingUp, TrendingDown, Gauge, Timer,
  Monitor, Maximize2, Minimize2, X,
} from "lucide-react";

// ─── Shared types & helpers ───
interface SensorReading {
  value: number;
  unit: string;
  status: "normal" | "warning" | "critical";
  trend: "up" | "down" | "stable";
}

function statusColor(s: "normal" | "warning" | "critical") {
  return s === "normal" ? "#4ade80" : s === "warning" ? "#facc15" : "#ef4444";
}

function trendIcon(t: "up" | "down" | "stable") {
  if (t === "up") return <TrendingUp className="w-3 h-3 text-[#4ade80]" />;
  if (t === "down") return <TrendingDown className="w-3 h-3 text-[#ef4444]" />;
  return <Activity className="w-3 h-3 text-[#5a6178]" />;
}

function randomInRange(min: number, max: number, decimals = 1) {
  return parseFloat((min + Math.random() * (max - min)).toFixed(decimals));
}

// ─── Mini sparkline chart ───
function Sparkline({ data, color, width = 120, height = 32 }: { data: number[]; color: string; width?: number; height?: number }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  const areaPoints = `0,${height} ${points} ${width},${height}`;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="block">
      <defs>
        <linearGradient id={`sp-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#sp-${color.replace("#", "")})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} />
    </svg>
  );
}

// ─── Circular gauge ───
function CircularGauge({ value, max, label, color, size = 72 }: { value: number; max: number; label: string; color: string; size?: number }) {
  const r = (size - 8) / 2;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const offset = circumference * (1 - pct);
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(107,92,231,0.12)" strokeWidth={3} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <text x={size / 2} y={size / 2 - 2} fill="#f0e6d0" fontSize="13" textAnchor="middle" dominantBaseline="middle" fontFamily="'Inter', sans-serif">
          {value.toFixed(1)}
        </text>
        <text x={size / 2} y={size / 2 + 12} fill="#5a6178" fontSize="8" textAnchor="middle" dominantBaseline="middle">
          {label}
        </text>
      </svg>
    </div>
  );
}

// ─── Panel wrapper ───
function DashPanel({ title, icon: Icon, tag, children, className = "", delay = 0 }: {
  title: string; icon: React.ElementType; tag?: string; children: React.ReactNode; className?: string; delay?: number;
}) {
  return (
    <motion.div
      className={`rounded-xl border border-[#1e2640]/80 overflow-hidden flex flex-col ${className}`}
      style={{ background: "rgba(10, 15, 30, 0.85)", backdropFilter: "blur(12px)" }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#1e2640]/60">
        <Icon className="w-3.5 h-3.5 text-[#6b5ce7]" />
        <span className="text-[#c0a86e] flex-1" style={{ fontSize: "12px" }}>{title}</span>
        {tag && (
          <motion.span
            className="px-1.5 py-0.5 rounded text-[#4ade80] border border-[#4ade80]/20"
            style={{ fontSize: "9px", background: "rgba(74,222,128,0.06)" }}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {tag}
          </motion.span>
        )}
      </div>
      <div className="flex-1 p-3.5 overflow-hidden">{children}</div>
    </motion.div>
  );
}

// ─── 1. AI Planting Monitor ───
function PlantingModule() {
  const [sensors, setSensors] = useState<Record<string, SensorReading>>({
    soilTemp: { value: 22.4, unit: "°C", status: "normal", trend: "stable" },
    soilMoisture: { value: 68.2, unit: "%", status: "normal", trend: "up" },
    light: { value: 847, unit: "lux", status: "normal", trend: "stable" },
    wind: { value: 2.3, unit: "m/s", status: "normal", trend: "down" },
    ph: { value: 7.2, unit: "pH", status: "normal", trend: "stable" },
    ndvi: { value: 0.82, unit: "", status: "normal", trend: "up" },
  });
  const [tempHistory, setTempHistory] = useState<number[]>([22.1, 22.4, 22.3, 22.8, 22.5, 22.4, 22.6, 22.9, 23.1, 22.7]);
  const [moistHistory, setMoistHistory] = useState<number[]>([65, 66, 67, 68, 67.5, 68, 69, 68.2, 67.8, 68.5]);

  useEffect(() => {
    const t = setInterval(() => {
      const newTemp = randomInRange(21, 24);
      const newMoist = randomInRange(64, 72);
      setSensors({
        soilTemp: { value: newTemp, unit: "°C", status: newTemp > 23.5 ? "warning" : "normal", trend: newTemp > 22.5 ? "up" : "down" },
        soilMoisture: { value: newMoist, unit: "%", status: newMoist > 70 ? "warning" : "normal", trend: newMoist > 68 ? "up" : "down" },
        light: { value: randomInRange(600, 1000, 0), unit: "lux", status: "normal", trend: "stable" },
        wind: { value: randomInRange(1, 4), unit: "m/s", status: "normal", trend: "stable" },
        ph: { value: randomInRange(6.8, 7.6), unit: "pH", status: "normal", trend: "stable" },
        ndvi: { value: randomInRange(0.7, 0.9, 2), unit: "", status: "normal", trend: "up" },
      });
      setTempHistory(h => [...h.slice(-9), newTemp]);
      setMoistHistory(h => [...h.slice(-9), newMoist]);
    }, 2500);
    return () => clearInterval(t);
  }, []);

  const sensorMeta = [
    { key: "soilTemp", icon: Thermometer, label: "土壤温度" },
    { key: "soilMoisture", icon: Droplets, label: "土壤湿度" },
    { key: "light", icon: Sun, label: "光照强度" },
    { key: "wind", icon: Wind, label: "风速" },
    { key: "ph", icon: Activity, label: "土壤 pH" },
    { key: "ndvi", icon: Cpu, label: "NDVI 植被指数" },
  ];

  return (
    <DashPanel title="AI 种植监测中心" icon={Cpu} tag="实时" delay={0.1}>
      <div className="grid grid-cols-3 gap-2.5 mb-3.5">
        {sensorMeta.map((m) => {
          const s = sensors[m.key];
          return (
            <div key={m.key} className="p-2.5 rounded-lg border border-[#1e2640]/50" style={{ background: "rgba(15,20,40,0.5)" }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <m.icon className="w-3 h-3 text-[#6b5ce7]" />
                <span className="text-[#5a6178]" style={{ fontSize: "9px" }}>{m.label}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[#f0e6d0]" style={{ fontSize: "14px", fontFamily: "'Inter'" }}>
                  {s.value}{s.unit}
                </span>
                {trendIcon(s.trend)}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor(s.status) }} />
                <span style={{ fontSize: "8px", color: statusColor(s.status) }}>
                  {s.status === "normal" ? "正常" : s.status === "warning" ? "警告" : "异常"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-2.5 rounded-lg border border-[#1e2640]/50" style={{ background: "rgba(15,20,40,0.4)" }}>
          <p className="text-[#5a6178] mb-1.5" style={{ fontSize: "9px" }}>温度趋势 (24h)</p>
          <Sparkline data={tempHistory} color="#c0a86e" />
        </div>
        <div className="p-2.5 rounded-lg border border-[#1e2640]/50" style={{ background: "rgba(15,20,40,0.4)" }}>
          <p className="text-[#5a6178] mb-1.5" style={{ fontSize: "9px" }}>湿度趋势 (24h)</p>
          <Sparkline data={moistHistory} color="#6b5ce7" />
        </div>
      </div>
      <motion.div
        className="mt-3 p-2.5 rounded-lg border border-[#c0a86e]/15"
        style={{ background: "rgba(192,168,110,0.04)" }}
        animate={{ borderColor: ["rgba(192,168,110,0.15)", "rgba(192,168,110,0.3)", "rgba(192,168,110,0.15)"] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="flex items-center gap-1.5 mb-1.5">
          <Zap className="w-3 h-3 text-[#c0a86e]" />
          <span className="text-[#c0a86e]" style={{ fontSize: "9px" }}>AI 决策输出</span>
        </div>
        <p className="text-[#a0a8b8]" style={{ fontSize: "10px", lineHeight: 1.6 }}>
          建议 A3 区域启动微灌 15min · B1 区域叶面追肥 · 无人机 09:00 巡检
        </p>
      </motion.div>
    </DashPanel>
  );
}

// ─── 2. Robot Harvest Demo ───
function HarvestModule() {
  const [robotStats, setRobotStats] = useState({
    active: 6, total: 8, harvested: 12480, speed: 1.2, accuracy: 99.2,
  });
  const sortQueue = [
    { id: 1, type: "成熟果", grade: "A+", pass: true, sugar: 24.2 },
    { id: 2, type: "青果", grade: "C", pass: false, sugar: 14.1 },
    { id: 3, type: "成熟果", grade: "A", pass: true, sugar: 23.8 },
  ];
  const [scanIdx, setScanIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setRobotStats(prev => ({
        ...prev,
        harvested: prev.harvested + Math.floor(Math.random() * 5),
        speed: randomInRange(1.0, 1.5),
        accuracy: randomInRange(98.5, 99.8),
      }));
      setScanIdx(i => (i + 1) % 3);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const current = sortQueue[scanIdx];

  return (
    <DashPanel title="机器人采摘演示" icon={Bot} tag="运行中" delay={0.2}>
      <div className="flex gap-2.5 mb-3.5">
        <div className="flex-1 p-2.5 rounded-lg border border-[#1e2640]/50 text-center" style={{ background: "rgba(15,20,40,0.5)" }}>
          <p className="text-[#5a6178]" style={{ fontSize: "9px" }}>在线机器人</p>
          <p className="text-[#4ade80]" style={{ fontSize: "18px", fontFamily: "'Inter'" }}>
            {robotStats.active}<span className="text-[#5a6178]" style={{ fontSize: "11px" }}>/{robotStats.total}</span>
          </p>
        </div>
        <div className="flex-1 p-2.5 rounded-lg border border-[#1e2640]/50 text-center" style={{ background: "rgba(15,20,40,0.5)" }}>
          <p className="text-[#5a6178]" style={{ fontSize: "9px" }}>已采摘</p>
          <p className="text-[#c0a86e]" style={{ fontSize: "18px", fontFamily: "'Inter'" }}>
            {robotStats.harvested.toLocaleString()}<span className="text-[#5a6178]" style={{ fontSize: "9px" }}> 串</span>
          </p>
        </div>
        <div className="flex-1 p-2.5 rounded-lg border border-[#1e2640]/50 text-center" style={{ background: "rgba(15,20,40,0.5)" }}>
          <p className="text-[#5a6178]" style={{ fontSize: "9px" }}>识别精度</p>
          <p className="text-[#6b5ce7]" style={{ fontSize: "18px", fontFamily: "'Inter'" }}>{robotStats.accuracy}%</p>
        </div>
      </div>
      <div className="p-2.5 rounded-lg border border-[#6b5ce7]/20" style={{ background: "rgba(107,92,231,0.04)" }}>
        <div className="flex items-center gap-1.5 mb-2">
          <Eye className="w-3 h-3 text-[#6b5ce7]" />
          <span className="text-[#c0a86e]" style={{ fontSize: "10px" }}>光学分拣实时流</span>
          <motion.span className="ml-auto text-[#6b5ce7]" style={{ fontSize: "9px" }} animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }}>扫描中</motion.span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={scanIdx} className="flex items-center justify-between p-2 rounded border"
            style={{ borderColor: current.pass ? "rgba(74,222,128,0.2)" : "rgba(239,68,68,0.2)", background: current.pass ? "rgba(74,222,128,0.04)" : "rgba(239,68,68,0.04)" }}
            initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2">
              {current.pass ? <CheckCircle className="w-3.5 h-3.5 text-[#4ade80]" /> : <AlertTriangle className="w-3.5 h-3.5 text-[#ef4444]" />}
              <div>
                <p className="text-[#f0e6d0]" style={{ fontSize: "11px" }}>{current.type} · {current.grade}</p>
                <p className="text-[#5a6178]" style={{ fontSize: "9px" }}>糖度 {current.sugar}°Bx</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full" style={{ fontSize: "9px", color: current.pass ? "#4ade80" : "#ef4444", background: current.pass ? "rgba(74,222,128,0.1)" : "rgba(239,68,68,0.1)" }}>
              {current.pass ? "通过" : "剔除"}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </DashPanel>
  );
}

// ─── 3. Digital Wine Cellar ───
function CellarModule() {
  const [barrels, setBarrels] = useState([
    { id: "OAK-A01", type: "法国橡木桶", age: 186, temp: 14.2, humidity: 72, fill: 95, vintage: "2025" },
    { id: "OAK-A02", type: "美国橡木桶", age: 124, temp: 14.5, humidity: 71, fill: 88, vintage: "2025" },
    { id: "OAK-B01", type: "法国橡木桶", age: 365, temp: 13.8, humidity: 73, fill: 92, vintage: "2024" },
    { id: "OAK-B02", type: "斯洛文尼亚桶", age: 280, temp: 14.0, humidity: 72, fill: 90, vintage: "2024" },
  ]);
  const [selectedBarrel, setSelectedBarrel] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setBarrels(prev => prev.map(b => ({ ...b, temp: randomInRange(13.5, 15, 1), humidity: randomInRange(69, 75, 0) })));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const sel = barrels[selectedBarrel];

  return (
    <DashPanel title="数字酒窖" icon={Wine} tag="监控中" delay={0.3}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3">
        {barrels.map((b, i) => (
          <button key={b.id} onClick={() => setSelectedBarrel(i)} className="p-1.5 rounded-lg border text-center transition-all cursor-pointer"
            style={{ borderColor: i === selectedBarrel ? "rgba(192,168,110,0.4)" : "rgba(30,38,64,0.5)", background: i === selectedBarrel ? "rgba(192,168,110,0.08)" : "rgba(15,20,40,0.5)" }}>
            <Wine className="w-3 h-3 mx-auto mb-0.5" style={{ color: i === selectedBarrel ? "#c0a86e" : "#5a6178" }} />
            <p style={{ fontSize: "8px", color: i === selectedBarrel ? "#c0a86e" : "#5a6178" }}>{b.id}</p>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="p-2 rounded-lg border border-[#1e2640]/50" style={{ background: "rgba(15,20,40,0.5)" }}>
          <p className="text-[#5a6178] mb-1" style={{ fontSize: "9px" }}>桶型</p>
          <p className="text-[#f0e6d0]" style={{ fontSize: "11px" }}>{sel.type}</p>
          <p className="text-[#5a6178] mt-0.5" style={{ fontSize: "9px" }}>年份: {sel.vintage}</p>
        </div>
        <div className="p-2 rounded-lg border border-[#1e2640]/50" style={{ background: "rgba(15,20,40,0.5)" }}>
          <p className="text-[#5a6178] mb-1" style={{ fontSize: "9px" }}>陈酿天数</p>
          <p className="text-[#c0a86e]" style={{ fontSize: "18px", fontFamily: "'Inter'" }}>{sel.age}</p>
          <p className="text-[#5a6178] mt-0.5" style={{ fontSize: "9px" }}>灌装率 {sel.fill}%</p>
        </div>
      </div>
      <div className="flex gap-2">
        <CircularGauge value={sel.temp} max={20} label="温度°C" color="#c0a86e" size={64} />
        <CircularGauge value={sel.humidity} max={100} label="湿度%" color="#6b5ce7" size={64} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-[#5a6178]" style={{ fontSize: "9px" }}>桶内状态</p>
            <div className="flex items-center gap-1 mt-1">
              <CheckCircle className="w-3 h-3 text-[#4ade80]" />
              <span className="text-[#4ade80]" style={{ fontSize: "10px" }}>环境优良</span>
            </div>
          </div>
        </div>
      </div>
    </DashPanel>
  );
}

// ─── 4. Brewing Monitor ───
function BrewingModule() {
  const [tanks, setTanks] = useState([
    { id: "T-01", stage: "主发酵", day: 5, temp: 25.3, sugar: 14.5, alcohol: 6.2, co2: 1.02, status: "active" as const },
    { id: "T-02", stage: "苹乳发酵", day: 18, temp: 18.1, sugar: 0.8, alcohol: 13.5, co2: 0.42, status: "active" as const },
    { id: "T-03", stage: "冷稳定", day: 30, temp: -2.0, sugar: 0.2, alcohol: 14.1, co2: 0.11, status: "stable" as const },
  ]);
  const [activeTank, setActiveTank] = useState(0);
  const [fermentHistory, setFermentHistory] = useState<number[]>([24, 22.1, 19.8, 17.2, 14.5]);

  useEffect(() => {
    const t = setInterval(() => {
      setTanks(prev => prev.map(tank => ({
        ...tank,
        temp: tank.stage === "冷稳定" ? randomInRange(-3, -1) : randomInRange(tank.stage === "主发酵" ? 24 : 17, tank.stage === "主发酵" ? 27 : 19),
        co2: randomInRange(0.1, 1.2),
      })));
      setFermentHistory(h => [...h.slice(-7), randomInRange(3, 24)]);
    }, 2500);
    return () => clearInterval(t);
  }, []);

  const tank = tanks[activeTank];

  return (
    <DashPanel title="酿造过程监测" icon={Gauge} tag="实时" delay={0.4}>
      <div className="flex gap-1.5 mb-3">
        {tanks.map((t, i) => (
          <button key={t.id} onClick={() => setActiveTank(i)} className="flex-1 p-1.5 rounded-lg border text-center transition-all cursor-pointer"
            style={{ borderColor: i === activeTank ? "rgba(107,92,231,0.5)" : "rgba(30,38,64,0.5)", background: i === activeTank ? "rgba(107,92,231,0.1)" : "rgba(15,20,40,0.5)" }}>
            <p style={{ fontSize: "10px", color: i === activeTank ? "#6b5ce7" : "#5a6178" }}>{t.id}</p>
            <p style={{ fontSize: "8px", color: "#5a6178" }}>{t.stage}</p>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3">
        {[
          { label: "温度", value: `${tank.temp.toFixed(1)}°C`, color: "#c0a86e" },
          { label: "糖度", value: `${tank.sugar}°Bx`, color: "#f0e6d0" },
          { label: "酒精度", value: `${tank.alcohol}%`, color: "#6b5ce7" },
          { label: "CO₂", value: `${tank.co2.toFixed(2)} atm`, color: "#4ade80" },
        ].map(d => (
          <div key={d.label} className="p-1.5 rounded-lg text-center border border-[#1e2640]/50" style={{ background: "rgba(15,20,40,0.5)" }}>
            <p className="text-[#5a6178]" style={{ fontSize: "8px" }}>{d.label}</p>
            <motion.p key={d.value} style={{ fontSize: "13px", fontFamily: "'Inter'", color: d.color }} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }}>{d.value}</motion.p>
          </div>
        ))}
      </div>
      <div className="p-2 rounded-lg border border-[#1e2640]/50" style={{ background: "rgba(15,20,40,0.4)" }}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[#5a6178]" style={{ fontSize: "9px" }}>发酵曲线 (糖度变化)</span>
          <span className="text-[#c0a86e]" style={{ fontSize: "9px" }}>第 {tank.day} 天</span>
        </div>
        <Sparkline data={fermentHistory} color="#c0a86e" width={180} height={36} />
      </div>
    </DashPanel>
  );
}

// ─── 5. Storage Monitor ───
function StorageModule() {
  const [zones, setZones] = useState([
    { name: "A区 · 恒温窖", temp: 14.2, humidity: 72, bottles: 12800, capacity: 15000, status: "normal" as const },
    { name: "B区 · 陈年窖", temp: 13.5, humidity: 74, bottles: 8400, capacity: 10000, status: "normal" as const },
    { name: "C区 · 待出库", temp: 16.0, humidity: 65, bottles: 3200, capacity: 5000, status: "warning" as const },
  ]);
  const alerts = [
    { time: "14:32", msg: "C区温度偏高 0.5°C，已自动调节", level: "warning" as const },
    { time: "12:10", msg: "A区新入库 200 瓶赤霞珠 2025", level: "info" as const },
    { time: "09:45", msg: "全区域环境检测通过", level: "normal" as const },
  ];

  useEffect(() => {
    const t = setInterval(() => {
      setZones(prev => prev.map(z => ({
        ...z,
        temp: randomInRange(z.name.includes("陈年") ? 13 : z.name.includes("待出") ? 15 : 13.5, z.name.includes("待出") ? 17 : 15),
        humidity: randomInRange(64, 76, 0),
      })));
    }, 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <DashPanel title="储存环境监测" icon={Warehouse} tag="24/7" delay={0.5}>
      <div className="space-y-2 mb-3">
        {zones.map(z => (
          <div key={z.name} className="p-2 rounded-lg border border-[#1e2640]/50 flex items-center gap-3" style={{ background: "rgba(15,20,40,0.5)" }}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor(z.status) }} />
                <span className="text-[#f0e6d0] truncate" style={{ fontSize: "10px" }}>{z.name}</span>
              </div>
              <span className="text-[#5a6178]" style={{ fontSize: "9px" }}>{z.temp.toFixed(1)}°C · {z.humidity}%RH</span>
              <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ background: "rgba(107,92,231,0.12)" }}>
                <motion.div className="h-full rounded-full"
                  style={{ background: z.bottles / z.capacity > 0.9 ? "#facc15" : "#6b5ce7", width: `${(z.bottles / z.capacity) * 100}%` }}
                  initial={{ width: 0 }} whileInView={{ width: `${(z.bottles / z.capacity) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1 }} />
              </div>
              <p className="text-[#5a6178] mt-0.5" style={{ fontSize: "8px" }}>{z.bottles.toLocaleString()} / {z.capacity.toLocaleString()} 瓶</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-2 rounded-lg border border-[#1e2640]/50" style={{ background: "rgba(15,20,40,0.4)" }}>
        <div className="flex items-center gap-1 mb-1.5">
          <Database className="w-3 h-3 text-[#6b5ce7]" />
          <span className="text-[#5a6178]" style={{ fontSize: "9px" }}>最近告警</span>
        </div>
        <div className="space-y-1">
          {alerts.map((a, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <span className="text-[#5a6178] shrink-0" style={{ fontSize: "8px" }}>{a.time}</span>
              <span className="truncate" style={{ fontSize: "9px", color: a.level === "warning" ? "#facc15" : a.level === "normal" ? "#4ade80" : "#a0a8b8" }}>{a.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </DashPanel>
  );
}

// ─── Screen content (shared between mockup and fullscreen) ───
function ScreenContent({ time, isFullscreen, onToggle, isMobileDirect = false }: { time: Date; isFullscreen: boolean; onToggle: () => void; isMobileDirect?: boolean }) {
  return (
    <div className={`w-full ${isFullscreen ? "p-4 md:p-10" : isMobileDirect ? "p-0" : "p-4 md:p-6"}`}>
      <div className="flex items-center justify-between mb-3 md:mb-4 gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <motion.div className="w-2 h-2 rounded-full bg-[#4ade80] shrink-0" animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
            <span className="text-[#6b5ce7] tracking-widest truncate" style={{ fontSize: isFullscreen ? "12px" : "10px", fontFamily: "'Inter'" }}>宁闽红 AI 指挥中心</span>
          </div>
          <h3 className="text-[#f0e6d0] truncate" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: isFullscreen ? "24px" : "16px" }}>
            宁闽红 · 智慧运营中枢
          </h3>
        </div>
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <div className="text-right">
            <p className="text-[#c0a86e]" style={{ fontSize: isFullscreen ? "18px" : "13px", fontFamily: "'Inter', monospace" }}>
              {time.toLocaleTimeString("zh-CN", { hour12: false })}
            </p>
            <p className="text-[#5a6178] hidden sm:block" style={{ fontSize: isFullscreen ? "11px" : "9px" }}>
              {time.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric", weekday: "short" })}
            </p>
          </div>
          <div className="hidden md:flex flex-col gap-0.5 pl-3 border-l border-[#1e2640]">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
              <span className="text-[#5a6178]" style={{ fontSize: "8px" }}>系统在线</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
              <span className="text-[#5a6178]" style={{ fontSize: "8px" }}>AI 引擎就绪</span>
            </div>
          </div>
          <button onClick={onToggle} className="p-1.5 rounded-lg border border-[#1e2640]/60 cursor-pointer transition-all hover:border-[#6b5ce7]/50 hover:bg-[#6b5ce7]/10" style={{ background: "rgba(10,15,30,0.7)" }}
            title={isFullscreen ? "退出全屏" : "全屏查看"}>
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-[#6b5ce7]" /> : <Maximize2 className="w-3.5 h-3.5 text-[#6b5ce7]" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-3 md:mb-4">
        {[
          { label: "监控葡萄园", value: "2,400 亩", icon: Grape, color: "#4ade80" },
          { label: "在线机器人", value: "6 / 8", icon: Bot, color: "#6b5ce7" },
          { label: "发酵罐", value: "3 运行中", icon: Gauge, color: "#c0a86e" },
          { label: "酒窖库存", value: "24,400 瓶", icon: Wine, color: "#f0e6d0" },
          { label: "AI 决策/日", value: "1,284 次", icon: Cpu, color: "#6b5ce7" },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-1.5 p-2 rounded-lg border border-[#1e2640]/60" style={{ background: "rgba(10,15,30,0.7)" }}>
            <s.icon className="w-3.5 h-3.5 shrink-0" style={{ color: s.color }} />
            <div className="min-w-0">
              <p className="text-[#5a6178] truncate" style={{ fontSize: "8px" }}>{s.label}</p>
              <p className="text-[#f0e6d0] truncate" style={{ fontSize: isFullscreen ? "13px" : "11px", fontFamily: "'Inter'" }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-min">
        <div><PlantingModule /></div>
        <div><HarvestModule /></div>
        <div><CellarModule /></div>
        <div className="sm:col-span-2"><BrewingModule /></div>
        <div><StorageModule /></div>
      </div>

      <div className="mt-3 text-center">
        <p className="text-[#5a6178]" style={{ fontSize: "9px" }}>宁闽红 AI 酒庄 · 数字化运营中枢 · 数据每 3 秒更新</p>
      </div>
    </div>
  );
}

// ─── Main Dashboard with 3D tilt + fullscreen ───
export function PageDashboard() {
  const [time, setTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const mockupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!isFullscreen) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setIsFullscreen(false); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [isFullscreen]);

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isFullscreen]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!mockupRef.current) return;
    const r = mockupRef.current.getBoundingClientRect();
    const cX = r.left + r.width / 2;
    const cY = r.top + r.height / 2;
    setTilt({
      x: ((cY - e.clientY) / (r.height / 2)) * 3,
      y: ((e.clientX - cX) / (r.width / 2)) * 4,
    });
  }, []);

  const handleMouseLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);
  const toggleFs = useCallback(() => setIsFullscreen(p => !p), []);

  return (
    <>
      <section className="relative flex flex-col items-center justify-center overflow-hidden py-12 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-[#060a18] to-[#0a0f1e]" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6">
          {/* Section header */}
          <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <p className="text-[#6b5ce7] tracking-widest mb-3" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "12px" }}>数字化指挥中心</p>
            <h2 className="text-[#f0e6d0] mb-2" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "clamp(24px, 5vw, 32px)" }}>AI 数字大屏</h2>
            <p className="text-[#a0a8b8] mb-2" style={{ fontSize: "14px" }}>全链路数字化运营指挥中心</p>
            <div className="w-16 h-px mx-auto bg-gradient-to-r from-transparent via-[#c0a86e] to-transparent" />
            <p className="text-[#5a6178] mt-4 max-w-lg mx-auto" style={{ fontSize: "13px", lineHeight: 1.8, fontFamily: "'Noto Serif SC', serif" }}>
              整合种植监测、采摘分拣、酿造控制、酒窖管理与储存环境五大核心模块，实现从葡萄园到酒窖的全链路可视化管控。
            </p>
          </motion.div>

          {/* Mobile: direct responsive content (no mockup) */}
          <div className="block md:hidden">
            <motion.div
              className="rounded-xl border border-[#1e2640]/60 overflow-hidden"
              style={{ background: "rgba(10,15,30,0.85)", backdropFilter: "blur(12px)" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, #060a18 0%, #0a0f1e 50%, #060a18 100%)" }}>
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(107,92,231,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(107,92,231,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                <div className="relative p-4">
                  <ScreenContent time={time} isFullscreen={false} onToggle={toggleFs} isMobileDirect />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Desktop: 3D tilt Mac Mockup */}
          <div className="hidden md:block" ref={mockupRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ perspective: 1200 }}>
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              animate={{ rotateX: tilt.x, rotateY: tilt.y }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Screen */}
              <div className="relative mx-auto rounded-t-2xl overflow-hidden" style={{ border: "2px solid #2a2a2a", borderBottom: "none", background: "linear-gradient(180deg, #1a1a1a 0%, #111 100%)" }}>
                {/* Camera notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center" style={{ width: 80, height: 20, background: "#1a1a1a", borderRadius: "0 0 10px 10px" }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: "#333", border: "1px solid #444" }} />
                </div>

                {/* Title Bar */}
                <div className="flex items-center gap-2 px-4 py-2 border-b border-[#2a2a2a]" style={{ background: "linear-gradient(180deg, #2d2d2d 0%, #252525 100%)" }}>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-md" style={{ background: "rgba(255,255,255,0.06)", maxWidth: 280 }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M5 1C3.067 1 1.5 2.567 1.5 4.5V5.5C1.5 7.433 3.067 9 5 9C6.933 9 8.5 7.433 8.5 5.5V4.5C8.5 2.567 6.933 1 5 1Z" stroke="#666" strokeWidth="1" />
                        <rect x="3.5" y="4.5" width="3" height="2.5" rx="0.5" stroke="#666" strokeWidth="0.8" />
                      </svg>
                      <span className="text-[#888] truncate" style={{ fontSize: "10px", fontFamily: "'Inter', sans-serif" }}>ai-dashboard.ningminhong.com</span>
                    </div>
                  </div>
                  <button onClick={toggleFs} className="flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer transition-all hover:bg-white/10" title="全屏查看">
                    <Maximize2 className="w-3 h-3 text-[#888]" />
                    <span className="text-[#888] hidden md:inline" style={{ fontSize: "10px" }}>全屏查看</span>
                  </button>
                </div>

                {/* Screen content */}
                <div className="relative overflow-y-auto overflow-x-hidden" style={{ background: "linear-gradient(180deg, #060a18 0%, #0a0f1e 50%, #060a18 100%)", maxHeight: "65vh" }}>
                  <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(107,92,231,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(107,92,231,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                  <div className="relative">
                    <ScreenContent time={time} isFullscreen={false} onToggle={toggleFs} />
                  </div>
                </div>
              </div>

              {/* Hinge */}
              <div className="h-3 mx-auto" style={{ background: "linear-gradient(180deg, #1a1a1a 0%, #333 40%, #222 100%)", borderLeft: "2px solid #2a2a2a", borderRight: "2px solid #2a2a2a", borderBottom: "2px solid #2a2a2a", borderRadius: "0 0 2px 2px" }} />

              {/* Base */}
              <div className="relative">
                <div className="h-4 mx-auto rounded-b-xl" style={{ background: "linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)", width: "70%", border: "1px solid #333", borderTop: "none" }} />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-md" style={{ width: "15%", height: 3, background: "linear-gradient(180deg, #333 0%, #2a2a2a 100%)" }} />
              </div>

              {/* Glow that shifts with tilt */}
              <motion.div
                className="mx-auto mt-3 h-8 rounded-full blur-2xl opacity-30"
                style={{ width: "60%", background: "radial-gradient(ellipse, rgba(107,92,231,0.3) 0%, rgba(192,168,110,0.15) 50%, transparent 100%)" }}
                animate={{ x: tilt.y * 3 }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Fullscreen overlay */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div className="fixed inset-0 z-[9999] flex flex-col" style={{ background: "linear-gradient(180deg, #060a18 0%, #0a0f1e 50%, #060a18 100%)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(107,92,231,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(107,92,231,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            <div className="relative z-10 flex items-center justify-between px-4 md:px-6 py-3 border-b border-[#1e2640]/40" style={{ background: "rgba(10,15,30,0.9)" }}>
              <div className="flex items-center gap-2 min-w-0">
                <Monitor className="w-4 h-4 text-[#6b5ce7] shrink-0" />
                <span className="text-[#c0a86e] truncate" style={{ fontSize: "13px", fontFamily: "'Inter'" }}>全屏模式 · AI 数字大屏</span>
              </div>
              <button onClick={toggleFs} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1e2640] cursor-pointer transition-all hover:border-[#ef4444]/40 hover:bg-[#ef4444]/10" style={{ background: "rgba(15,20,40,0.6)" }}>
                <X className="w-3.5 h-3.5 text-[#a0a8b8]" />
                <span className="text-[#a0a8b8]" style={{ fontSize: "11px" }}>退出全屏</span>
                <span className="text-[#5a6178] ml-1 hidden md:inline" style={{ fontSize: "9px", border: "1px solid rgba(90,97,120,0.3)", borderRadius: 3, padding: "1px 4px" }}>ESC</span>
              </button>
            </div>
            <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden">
              <div className="max-w-7xl mx-auto">
                <ScreenContent time={time} isFullscreen={true} onToggle={toggleFs} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
