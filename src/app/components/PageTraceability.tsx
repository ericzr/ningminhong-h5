import { motion } from "motion/react";
import { Shield, Link, Camera, Truck, Grape, Warehouse, QrCode } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const timelineSteps = [
  { icon: Grape, label: "葡萄采摘", date: "2025.09.15", detail: "A3 地块 · 赤霞珠 · 糖度 24.8°Bx", hash: "0x7a3f...e2c1" },
  { icon: Camera, label: "无人机巡检", date: "2025.09.15", detail: "日照 9.2h · 病虫害检测: 无", hash: "0x8b4e...f3d2" },
  { icon: Warehouse, label: "发酵入罐", date: "2025.09.16", detail: "T-07 号发酵罐 · 控温 25.5°C", hash: "0x9c5f...a4e3" },
  { icon: Warehouse, label: "橡木桶陈酿", date: "2025.12.20", detail: "法国橡木桶 · 12 个月", hash: "0xad6g...b5f4" },
  { icon: Truck, label: "灌装出厂", date: "2026.12.22", detail: "批次 NMH-2026-A089", hash: "0xbe7h...c6g5" },
  { icon: Link, label: "物流上链", date: "2026.12.25", detail: "冷链运输 · 温度 16°C 恒温", hash: "0xcf8i...d7h6" },
];

export function PageTraceability() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden py-20">
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1733483405754-ffb78f2fd646?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5lJTIwYm90dGxlJTIwYmFyY29kZSUyMHNjYW5uaW5nJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzM0MjE4MjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="溯源"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e]/95 via-[#0a0f1e]/92 to-[#0a0f1e]/95" />
      </div>

      <div className="relative z-10 w-full max-w-xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-[#f0e6d0] mb-2" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "clamp(24px, 5vw, 32px)" }}>
            全链路溯源
          </h2>
          <p className="text-[#a0a8b8] mb-2" style={{ fontSize: "14px" }}>不可篡改的信任</p>
          <div className="w-16 h-px bg-gradient-to-r from-[#c0a86e] to-transparent mb-8" />
        </motion.div>

        {/* QR Code scan demo */}
        <motion.div
          className="rounded-2xl border border-[#c0a86e]/20 overflow-hidden mb-6"
          style={{ background: "rgba(15, 20, 40, 0.75)" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl border border-[#c0a86e]/30 flex items-center justify-center" style={{ background: "rgba(192,168,110,0.08)" }}>
                <QrCode className="w-6 h-6 text-[#c0a86e]" />
              </div>
              <div>
                <p className="text-[#f0e6d0]" style={{ fontSize: "14px" }}>一瓶一码 · 数字履历</p>
                <p className="text-[#5a6178]" style={{ fontSize: "11px" }}>基于区块链的食品防伪溯源</p>
              </div>
              <Shield className="w-5 h-5 text-[#4ade80] ml-auto" />
            </div>
            <p className="text-[#a0a8b8] mb-4" style={{ fontSize: "13px", lineHeight: 1.8, fontFamily: "'Noto Serif SC', serif" }}>
              消费者、渠道商扫码，即可查看这瓶酒的专属"数字履历"——从哪一块葡萄地采摘、当天的日照时长、无人机巡检记录、酿造周期到物流轨迹，全面上链，杜绝篡改。
            </p>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          className="rounded-2xl border border-[#6b5ce7]/20 overflow-hidden"
          style={{ background: "rgba(15, 20, 40, 0.75)" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="p-5">
            <p className="text-[#c0a86e] mb-5" style={{ fontSize: "14px" }}>
              供应链时间轴 · 宁闽红赤霞珠 2025
            </p>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-5 top-2 bottom-2 w-px bg-gradient-to-b from-[#c0a86e]/40 via-[#6b5ce7]/30 to-[#6b5ce7]/10" />

              {timelineSteps.map((step, i) => (
                <motion.div
                  key={`step-${i}`}
                  className="relative pl-14 pb-6 last:pb-0"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                >
                  {/* Node */}
                  <div className="absolute left-3 top-0.5 w-5 h-5 rounded-full border border-[#c0a86e]/40 flex items-center justify-center" style={{ background: "rgba(15,20,40,0.8)" }}>
                    <step.icon className="w-2.5 h-2.5 text-[#c0a86e]" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#f0e6d0]" style={{ fontSize: "13px" }}>{step.label}</span>
                      <span className="text-[#5a6178]" style={{ fontSize: "10px" }}>{step.date}</span>
                    </div>
                    <p className="text-[#a0a8b8]" style={{ fontSize: "12px" }}>{step.detail}</p>
                    <p className="text-[#6b5ce7] mt-1" style={{ fontSize: "10px", fontFamily: "'Inter', monospace" }}>
                      <Link className="w-2.5 h-2.5 inline mr-1" />
                      {step.hash}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-5 p-3 rounded-lg border border-[#4ade80]/20 flex items-center gap-2" style={{ background: "rgba(74,222,128,0.05)" }}>
              <Shield className="w-4 h-4 text-[#4ade80]" />
              <span className="text-[#4ade80]" style={{ fontSize: "11px" }}>
                全部数据已上链验证 · 不可篡改
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}