import { motion } from "motion/react";
import { Cpu, Droplets, Wind, Thermometer, Sun, Activity } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState, useEffect } from "react";

const sensorData = [
  { icon: Thermometer, label: "土壤温度", value: "22.4°C", status: "正常" },
  { icon: Droplets, label: "土壤湿度", value: "68.2%", status: "适中" },
  { icon: Sun, label: "光照强度", value: "847 lux", status: "充足" },
  { icon: Wind, label: "风速", value: "2.3 m/s", status: "微风" },
];

function LiveCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setVal((v) => {
        if (v >= target) return target;
        return v + Math.ceil(target / 40);
      });
    }, 50);
    return () => clearInterval(timer);
  }, [target]);
  return <>{Math.min(val, target).toLocaleString()}{suffix}</>;
}

export function PageFarming() {
  const [activeSensor, setActiveSensor] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActiveSensor((s) => (s + 1) % sensorData.length), 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden py-20">
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1654643352875-127916dec2de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcm9uZSUyMGFncmljdWx0dXJlJTIwcHJlY2lzaW9uJTIwZmFybWluZyUyMHZpbmV5YXJkfGVufDF8fHx8MTc3MzQyMTgxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="精准农业"
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
            AI 赋能种植
          </h2>
          <p className="text-[#a0a8b8] mb-2" style={{ fontSize: "14px" }}>空地一体化精准农业</p>
          <div className="w-16 h-px bg-gradient-to-r from-[#c0a86e] to-transparent mb-8" />
        </motion.div>

        {/* Drone section */}
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
              <Cpu className="w-4 h-4 text-[#6b5ce7]" />
              <span className="text-[#c0a86e]" style={{ fontSize: "14px" }}>无人机多光谱巡检</span>
            </div>
            <p className="text-[#a0a8b8] mb-5" style={{ fontSize: "13px", lineHeight: 1.8, fontFamily: "'Noto Serif SC', serif" }}>
              利用无人机航测结合视觉算法，构建葡萄园三维数字孪生。精准识别病虫害、评估藤蔓长势与缺水缺肥情况。
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "巡检面积", val: 2400, suffix: " 亩" },
                { label: "识别精度", val: 99, suffix: "%" },
                { label: "响应时间", val: 15, suffix: " min" },
              ].map((s) => (
                <div key={s.label} className="text-center p-3 rounded-lg" style={{ background: "rgba(107,92,231,0.08)" }}>
                  <p className="text-[#c0a86e]" style={{ fontSize: "20px", fontFamily: "'Inter', sans-serif" }}>
                    <LiveCounter target={s.val} suffix={s.suffix} />
                  </p>
                  <p className="text-[#5a6178] mt-1" style={{ fontSize: "11px" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* IoT section */}
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
              <Activity className="w-4 h-4 text-[#6b5ce7]" />
              <span className="text-[#c0a86e]" style={{ fontSize: "14px" }}>地表 IoT 物联网</span>
              <motion.span
                className="ml-auto px-2 py-0.5 rounded-full text-[#4ade80] border border-[#4ade80]/30"
                style={{ fontSize: "10px", background: "rgba(74,222,128,0.08)" }}
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ● 实时
              </motion.span>
            </div>
            <p className="text-[#a0a8b8] mb-5" style={{ fontSize: "13px", lineHeight: 1.8, fontFamily: "'Noto Serif SC', serif" }}>
              土壤温湿度、光照、风速数据 24 小时实时上传云端，AI 大模型动态输出最优灌溉和施肥策略，实现"滴水级别"的精准微灌。
            </p>

            {/* Sensor cards */}
            <div className="grid grid-cols-2 gap-3">
              {sensorData.map((s, i) => (
                <motion.div
                  key={s.label}
                  className="p-3 rounded-lg border transition-colors duration-500"
                  style={{
                    background: activeSensor === i ? "rgba(192,168,110,0.08)" : "rgba(15,20,40,0.5)",
                    borderColor: activeSensor === i ? "rgba(192,168,110,0.3)" : "rgba(30,38,64,0.5)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <s.icon className="w-3.5 h-3.5 text-[#6b5ce7]" />
                    <span className="text-[#5a6178]" style={{ fontSize: "11px" }}>{s.label}</span>
                  </div>
                  <p className="text-[#f0e6d0]" style={{ fontSize: "16px", fontFamily: "'Inter', sans-serif" }}>{s.value}</p>
                  <p className="text-[#4ade80] mt-1" style={{ fontSize: "10px" }}>{s.status}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
