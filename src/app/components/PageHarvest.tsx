import { motion } from "motion/react";
import { Eye, Scan, Check, X } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState, useEffect } from "react";

const sortingItems = [
  { id: 1, label: "成熟果", quality: "A+", pass: true, sugar: "24.2°Bx", color: "#4ade80" },
  { id: 2, label: "成熟果", quality: "A", pass: true, sugar: "23.8°Bx", color: "#4ade80" },
  { id: 3, label: "青果", quality: "C", pass: false, sugar: "14.1°Bx", color: "#ef4444" },
  { id: 4, label: "成熟果", quality: "A+", pass: true, sugar: "25.0°Bx", color: "#4ade80" },
  { id: 5, label: "霉烂果", quality: "F", pass: false, sugar: "N/A", color: "#ef4444" },
  { id: 6, label: "成熟果", quality: "A", pass: true, sugar: "23.5°Bx", color: "#4ade80" },
];

export function PageHarvest() {
  const [currentItem, setCurrentItem] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentItem((c) => (c + 1) % sortingItems.length);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  const item = sortingItems[currentItem];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden py-20">
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1582772168790-9e7441942224?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2JvdGljJTIwYXJtJTIwaGFydmVzdCUyMGF1dG9tYXRpb24lMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3MzQyMTgxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="机器人采摘"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e]/93 via-[#0a0f1e]/88 to-[#0a0f1e]/95"
          style={{ background: "linear-gradient(to bottom, rgba(10,15,30,0.93), rgba(10,15,30,0.88), rgba(10,15,30,0.95))" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-[#f0e6d0] mb-2" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "clamp(24px, 5vw, 32px)" }}>
            机器人采摘与分拣
          </h2>
          <p className="text-[#a0a8b8] mb-2" style={{ fontSize: "14px" }}>极致的品质把控</p>
          <div className="w-16 h-px bg-gradient-to-r from-[#c0a86e] to-transparent mb-8" />
        </motion.div>

        {/* Vision Picking */}
        <motion.div
          className="rounded-2xl border border-[#c0a86e]/20 overflow-hidden mb-6"
          style={{ background: "rgba(15, 20, 40, 0.7)" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-4 h-4 text-[#6b5ce7]" />
              <span className="text-[#c0a86e]" style={{ fontSize: "14px" }}>机器视觉采摘</span>
            </div>
            <p className="text-[#a0a8b8] mb-5" style={{ fontSize: "13px", lineHeight: 1.8, fontFamily: "'Noto Serif SC', serif" }}>
              采摘机器人搭载双目视觉系统与柔性机械臂，AI 算法判断葡萄串的成熟度与糖酸比，仅在最佳时刻进行无损采摘。
            </p>

            {/* Visual demo */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "双目视觉", desc: "3D 空间定位" },
                { label: "柔性机械臂", desc: "无损采摘" },
                { label: "AI 判断", desc: "最优时机" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  className="text-center p-3 rounded-lg border border-[#1e2640]"
                  style={{ background: "rgba(107,92,231,0.06)" }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.15 }}
                >
                  <div className="w-8 h-8 mx-auto mb-2 rounded-full border border-[#6b5ce7]/30 flex items-center justify-center">
                    <span className="text-[#6b5ce7]" style={{ fontSize: "14px", fontFamily: "'Inter', sans-serif" }}>{i + 1}</span>
                  </div>
                  <p className="text-[#f0e6d0]" style={{ fontSize: "12px" }}>{item.label}</p>
                  <p className="text-[#5a6178] mt-0.5" style={{ fontSize: "10px" }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Optical Sorting */}
        <motion.div
          className="rounded-2xl border border-[#6b5ce7]/20 overflow-hidden"
          style={{ background: "rgba(15, 20, 40, 0.7)" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Scan className="w-4 h-4 text-[#6b5ce7]" />
              <span className="text-[#c0a86e]" style={{ fontSize: "14px" }}>毫秒级光学分拣</span>
              <motion.span
                className="ml-auto px-2 py-0.5 rounded-full text-[#6b5ce7] border border-[#6b5ce7]/30"
                style={{ fontSize: "10px", background: "rgba(107,92,231,0.08)" }}
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                扫描中
              </motion.span>
            </div>
            <p className="text-[#a0a8b8] mb-5" style={{ fontSize: "13px", lineHeight: 1.8, fontFamily: "'Noto Serif SC', serif" }}>
              葡萄入塔后，经过高帧率摄像机全方位扫描，AI 剔除青果、霉烂果及杂质，确保每一颗进入发酵罐的葡萄都完美无瑕。
            </p>

            {/* Live sorting animation */}
            <motion.div
              key={currentItem}
              className="p-4 rounded-xl border"
              style={{
                borderColor: item.pass ? "rgba(74,222,128,0.3)" : "rgba(239,68,68,0.3)",
                background: item.pass ? "rgba(74,222,128,0.05)" : "rgba(239,68,68,0.05)",
              }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {item.pass ? (
                      <Check className="w-4 h-4 text-[#4ade80]" />
                    ) : (
                      <X className="w-4 h-4 text-[#ef4444]" />
                    )}
                    <span className="text-[#f0e6d0]" style={{ fontSize: "14px" }}>
                      {item.label}
                    </span>
                    <span
                      className="px-1.5 py-0.5 rounded"
                      style={{
                        fontSize: "10px",
                        color: item.color,
                        background: item.pass ? "rgba(74,222,128,0.1)" : "rgba(239,68,68,0.1)",
                      }}
                    >
                      {item.quality}
                    </span>
                  </div>
                  <p className="text-[#5a6178]" style={{ fontSize: "11px" }}>
                    糖度: {item.sugar}
                  </p>
                </div>
                <span
                  className="px-3 py-1 rounded-full"
                  style={{
                    fontSize: "11px",
                    color: item.pass ? "#4ade80" : "#ef4444",
                    background: item.pass ? "rgba(74,222,128,0.1)" : "rgba(239,68,68,0.1)",
                    border: `1px solid ${item.pass ? "rgba(74,222,128,0.2)" : "rgba(239,68,68,0.2)"}`,
                  }}
                >
                  {item.pass ? "通过" : "剔除"}
                </span>
              </div>
            </motion.div>

            <div className="flex justify-between mt-4 px-1">
              <span className="text-[#4ade80]" style={{ fontSize: "11px" }}>
                ✓ 通过率: 94.7%
              </span>
              <span className="text-[#5a6178]" style={{ fontSize: "11px" }}>
                已分拣: {(currentItem + 1).toLocaleString()} / {sortingItems.length}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
