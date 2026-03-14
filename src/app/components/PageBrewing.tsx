import { motion } from "motion/react";
import { Beaker, BarChart3 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState, useEffect } from "react";

const fermentationData = [
  { day: "D1", sugar: 24.0, alcohol: 0.8 },
  { day: "D2", sugar: 22.1, alcohol: 2.0 },
  { day: "D3", sugar: 19.8, alcohol: 3.4 },
  { day: "D4", sugar: 17.2, alcohol: 4.9 },
  { day: "D5", sugar: 14.5, alcohol: 6.2 },
  { day: "D6", sugar: 12.0, alcohol: 7.5 },
  { day: "D7", sugar: 9.3, alcohol: 8.8 },
  { day: "D8", sugar: 7.1, alcohol: 10.0 },
  { day: "D9", sugar: 5.0, alcohol: 11.2 },
  { day: "D10", sugar: 3.2, alcohol: 12.1 },
  { day: "D11", sugar: 1.8, alcohol: 13.0 },
  { day: "D12", sugar: 0.5, alcohol: 13.8 },
];

const flavorData = [
  { subject: "果香", A: 92, B: 78 },
  { subject: "花香", A: 85, B: 65 },
  { subject: "单宁", A: 88, B: 82 },
  { subject: "酸度", A: 75, B: 70 },
  { subject: "酒体", A: 90, B: 75 },
  { subject: "余韵", A: 95, B: 68 },
];

function CustomAreaChart() {
  const w = 440;
  const h = 180;
  const padL = 35;
  const padR = 10;
  const padT = 10;
  const padB = 25;
  const cw = w - padL - padR;
  const ch = h - padT - padB;

  const maxSugar = 25;
  const maxAlcohol = 15;

  const sugarPoints = fermentationData.map((d, i) => {
    const x = padL + (i / (fermentationData.length - 1)) * cw;
    const y = padT + (1 - d.sugar / maxSugar) * ch;
    return `${x},${y}`;
  });

  const alcoholPoints = fermentationData.map((d, i) => {
    const x = padL + (i / (fermentationData.length - 1)) * cw;
    const y = padT + (1 - d.alcohol / maxAlcohol) * ch;
    return `${x},${y}`;
  });

  const sugarArea = `${padL},${padT + ch} ${sugarPoints.join(" ")} ${padL + cw},${padT + ch}`;
  const alcoholArea = `${padL},${padT + ch} ${alcoholPoints.join(" ")} ${padL + cw},${padT + ch}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: 180 }}>
      {/* Y axis labels */}
      {[0, 5, 10, 15, 20, 25].map((v) => {
        const y = padT + (1 - v / maxSugar) * ch;
        return (
          <g key={`y-${v}`}>
            <line x1={padL} y1={y} x2={padL + cw} y2={y} stroke="rgba(90,97,120,0.15)" strokeWidth={0.5} />
            <text x={padL - 5} y={y + 3} fill="#5a6178" fontSize="9" textAnchor="end">{v}</text>
          </g>
        );
      })}
      {/* X axis labels */}
      {fermentationData.map((d, i) => {
        const x = padL + (i / (fermentationData.length - 1)) * cw;
        return (
          <text key={`x-${i}`} x={x} y={h - 5} fill="#5a6178" fontSize="9" textAnchor="middle">{d.day}</text>
        );
      })}
      {/* Sugar area */}
      <polygon points={sugarArea} fill="#c0a86e" opacity={0.12} />
      <polyline points={sugarPoints.join(" ")} fill="none" stroke="#c0a86e" strokeWidth={2} />
      {/* Alcohol area */}
      <polygon points={alcoholArea} fill="#6b5ce7" opacity={0.12} />
      <polyline points={alcoholPoints.join(" ")} fill="none" stroke="#6b5ce7" strokeWidth={2} />
      {/* Data dots */}
      {fermentationData.map((d, i) => {
        const x = padL + (i / (fermentationData.length - 1)) * cw;
        return (
          <g key={`dots-${i}`}>
            <circle cx={x} cy={padT + (1 - d.sugar / maxSugar) * ch} r={2.5} fill="#c0a86e" />
            <circle cx={x} cy={padT + (1 - d.alcohol / maxAlcohol) * ch} r={2.5} fill="#6b5ce7" />
          </g>
        );
      })}
    </svg>
  );
}

function CustomRadarChart() {
  const cx = 150;
  const cy = 120;
  const r = 85;
  const n = flavorData.length;

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    const dist = (value / 100) * r;
    return { x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist };
  };

  const gridLevels = [20, 40, 60, 80, 100];

  const polygonA = flavorData.map((d, i) => {
    const p = getPoint(i, d.A);
    return `${p.x},${p.y}`;
  }).join(" ");

  const polygonB = flavorData.map((d, i) => {
    const p = getPoint(i, d.B);
    return `${p.x},${p.y}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 300 240" className="w-full" style={{ maxHeight: 220 }}>
      {/* Grid */}
      {gridLevels.map((level) => {
        const points = Array.from({ length: n }, (_, i) => {
          const p = getPoint(i, level);
          return `${p.x},${p.y}`;
        }).join(" ");
        return <polygon key={`grid-${level}`} points={points} fill="none" stroke="rgba(107,92,231,0.12)" strokeWidth={0.5} />;
      })}
      {/* Axis lines */}
      {flavorData.map((_, i) => {
        const p = getPoint(i, 100);
        return <line key={`axis-${i}`} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(107,92,231,0.12)" strokeWidth={0.5} />;
      })}
      {/* Data polygon B (traditional) */}
      <polygon points={polygonB} fill="#6b5ce7" fillOpacity={0.06} stroke="#6b5ce7" strokeWidth={1} strokeDasharray="4 4" />
      {/* Data polygon A (AI) */}
      <polygon points={polygonA} fill="#c0a86e" fillOpacity={0.12} stroke="#c0a86e" strokeWidth={2} />
      {/* Data points A */}
      {flavorData.map((d, i) => {
        const p = getPoint(i, d.A);
        return <circle key={`dotA-${i}`} cx={p.x} cy={p.y} r={3} fill="#c0a86e" />;
      })}
      {/* Labels */}
      {flavorData.map((d, i) => {
        const p = getPoint(i, 115);
        return (
          <text key={`label-${i}`} x={p.x} y={p.y} fill="#5a6178" fontSize="11" textAnchor="middle" dominantBaseline="middle">
            {d.subject}
          </text>
        );
      })}
    </svg>
  );
}

export function PageBrewing() {
  const [temp, setTemp] = useState(25.3);
  const [pressure, setPressure] = useState(1.02);

  useEffect(() => {
    const timer = setInterval(() => {
      setTemp(25 + Math.random() * 2);
      setPressure(1 + Math.random() * 0.05);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden py-20">
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1710020125176-d3a105b6c5b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5lJTIwZmVybWVudGF0aW9uJTIwdGFuayUyMHN0YWlubGVzcyUyMHN0ZWVsJTIwd2luZXJ5fGVufDF8fHx8MTc3MzQyMTgxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="智慧酿造"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e]/95 via-[#0a0f1e]/90 to-[#0a0f1e]/95" />
      </div>

      <div className="relative z-10 w-full max-w-xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-[#f0e6d0] mb-2" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "clamp(24px, 5vw, 32px)" }}>
            智慧酿造与数字酒窖
          </h2>
          <p className="text-[#a0a8b8] mb-2" style={{ fontSize: "14px" }}>算力与时间的艺术</p>
          <div className="w-16 h-px bg-gradient-to-r from-[#c0a86e] to-transparent mb-8" />
        </motion.div>

        {/* Fermentation Digital Twin */}
        <motion.div
          className="rounded-2xl border border-[#c0a86e]/20 overflow-hidden mb-6"
          style={{ background: "rgba(15, 20, 40, 0.75)" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Beaker className="w-4 h-4 text-[#6b5ce7]" />
              <span className="text-[#c0a86e]" style={{ fontSize: "14px" }}>发酵过程数字孪生</span>
            </div>

            {/* Live metrics */}
            <div className="flex gap-4 mb-4">
              <div className="flex-1 p-3 rounded-lg border border-[#1e2640]" style={{ background: "rgba(15,20,40,0.5)" }}>
                <p className="text-[#5a6178]" style={{ fontSize: "10px" }}>发酵温度</p>
                <motion.p
                  key={`temp-${temp}`}
                  className="text-[#c0a86e]"
                  style={{ fontSize: "18px", fontFamily: "'Inter', sans-serif" }}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                >
                  {temp.toFixed(1)}°C
                </motion.p>
              </div>
              <div className="flex-1 p-3 rounded-lg border border-[#1e2640]" style={{ background: "rgba(15,20,40,0.5)" }}>
                <p className="text-[#5a6178]" style={{ fontSize: "10px" }}>罐内压力</p>
                <motion.p
                  key={`pressure-${pressure}`}
                  className="text-[#6b5ce7]"
                  style={{ fontSize: "18px", fontFamily: "'Inter', sans-serif" }}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                >
                  {pressure.toFixed(2)} atm
                </motion.p>
              </div>
            </div>

            <p className="text-[#a0a8b8] mb-4" style={{ fontSize: "13px", lineHeight: 1.8, fontFamily: "'Noto Serif SC', serif" }}>
              传感器实时监控发酵罐内的糖度下降与酒精生成速率，AI 根据历史优质年份数据动态微调温控系统，确保风味物质的完美萃取。
            </p>

            {/* Chart */}
            <CustomAreaChart />
            <div className="flex justify-center gap-6 mt-2">
              <span className="flex items-center gap-1 text-[#5a6178]" style={{ fontSize: "10px" }}>
                <span className="w-2 h-2 rounded-full bg-[#c0a86e]" /> 糖度 (°Bx)
              </span>
              <span className="flex items-center gap-1 text-[#5a6178]" style={{ fontSize: "10px" }}>
                <span className="w-2 h-2 rounded-full bg-[#6b5ce7]" /> 酒精度 (%)
              </span>
            </div>
          </div>
        </motion.div>

        {/* AI Blending */}
        <motion.div
          className="rounded-2xl border border-[#6b5ce7]/20 overflow-hidden"
          style={{ background: "rgba(15, 20, 40, 0.75)" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-[#6b5ce7]" />
              <span className="text-[#c0a86e]" style={{ fontSize: "14px" }}>AI 辅助调配</span>
            </div>
            <p className="text-[#a0a8b8] mb-4" style={{ fontSize: "13px", lineHeight: 1.8, fontFamily: "'Noto Serif SC', serif" }}>
              记录成百上千种基酒的理化指标与风味雷达图，辅助酿酒师进行最优比例调配，锁定宁闽红的标志性口感。
            </p>

            {/* Radar Chart */}
            <CustomRadarChart />
            <div className="flex justify-center gap-6 mt-1">
              <span className="flex items-center gap-1 text-[#5a6178]" style={{ fontSize: "10px" }}>
                <span className="w-2 h-2 rounded-full bg-[#c0a86e]" /> AI 推荐方案
              </span>
              <span className="flex items-center gap-1 text-[#5a6178]" style={{ fontSize: "10px" }}>
                <span className="w-2 h-2 rounded-full bg-[#6b5ce7]" /> 传统方案
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
