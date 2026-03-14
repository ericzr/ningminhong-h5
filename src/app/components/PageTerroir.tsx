import { motion } from "motion/react";
import { MapPin, Sun, Thermometer, Mountain } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const features = [
  { icon: Sun, label: "充足日照", value: "3000+ h/年", desc: "年均日照时数" },
  { icon: Thermometer, label: "昼夜温差", value: "15°C", desc: "平均昼夜温差" },
  { icon: Mountain, label: "砂石土壤", value: "pH 8.0", desc: "透气碱性土质" },
  { icon: MapPin, label: "北纬 38°", value: "黄金纬度", desc: "世界级产区带" },
];

export function PageTerroir() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden py-20">
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1764438432342-eccb4a489d52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW5leWFyZCUyMHdpbmUlMjByZWdpb24lMjBtYXAlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzczNDIxODE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="产区"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#0a0f1e]/92 via-[#0a0f1e]/85 to-[#1a0f2e]/90"
          style={{ background: "linear-gradient(to bottom right, rgba(10,15,30,0.92), rgba(10,15,30,0.85), rgba(26,15,46,0.90))" }}
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
            产区背书
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-[#c0a86e] to-transparent mb-8" />
        </motion.div>

        {/* Map indicator */}
        <motion.div
          className="relative rounded-2xl overflow-hidden mb-10 border border-[#c0a86e]/20"
          style={{ background: "linear-gradient(135deg, rgba(107,92,231,0.08) 0%, rgba(192,168,110,0.08) 100%)" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <motion.div
                className="w-3 h-3 rounded-full bg-[#c0a86e]"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-[#c0a86e]" style={{ fontSize: "13px", fontFamily: "'Inter', sans-serif" }}>
                闽宁镇产业园区 · 核心产区
              </span>
            </div>
            <p className="text-[#a0a8b8]" style={{ fontSize: "14px", lineHeight: 1.8, fontFamily: "'Noto Serif SC', serif" }}>
              扎根中国葡萄酒核心产区——宁夏贺兰山东麓、闽宁镇。充足日照、昼夜温差、透气砂石土壤，赋予葡萄世界级的品质基因。
            </p>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              className="p-4 rounded-xl border border-[#1e2640] backdrop-blur-sm"
              style={{ background: "rgba(15, 20, 40, 0.6)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
            >
              <f.icon className="w-5 h-5 text-[#c0a86e] mb-2" />
              <p className="text-[#f0e6d0] mb-1" style={{ fontSize: "18px", fontFamily: "'Inter', sans-serif" }}>{f.value}</p>
              <p className="text-[#5a6178]" style={{ fontSize: "12px" }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Mission */}
        <motion.div
          className="p-6 rounded-2xl border border-[#6b5ce7]/20"
          style={{ background: "linear-gradient(135deg, rgba(107,92,231,0.06) 0%, rgba(15,20,40,0.8) 100%)" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-[#6b5ce7] mb-2" style={{ fontSize: "13px", fontFamily: "'Inter', sans-serif" }}>破局而出的时代使命</p>
          <p className="text-[#a0a8b8]" style={{ fontSize: "14px", lineHeight: 1.8, fontFamily: "'Noto Serif SC', serif" }}>
            在几百家传统酒庄的红海中，宁闽红不只传承风土，更以<span className="text-[#c0a86e]">"数字化 + AI + 机器人"</span>重构产业标准。
          </p>
        </motion.div>
      </div>
    </section>
  );
}