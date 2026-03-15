import { motion } from "motion/react";
import { Zap } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import logoImg from "@/assets/1a45ef0b07b8b28b42bbbaedc04d1acd371889a3.png";

interface PageCoverProps {
  onStart: () => void;
}

export function PageCover({ onStart }: PageCoverProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1759682737813-52e4a6442311?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW5leWFyZCUyMG1vdW50YWluJTIwbGFuZHNjYXBlJTIwcm93cyUyMGdyYXBldmluZXN8ZW58MXx8fHwxNzczNDIxODI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="贺兰山东麓葡萄园"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e]/85 via-[#0a0f1e]/70 to-[#0a0f1e]/95"
          style={{ background: "linear-gradient(to bottom, rgba(10,15,30,0.85), rgba(10,15,30,0.70), rgba(10,15,30,0.95))" }}
        />
      </div>

      {/* Data flow lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-[#c0a86e]/30 to-transparent"
            style={{
              top: `${15 + i * 20}%`,
              left: 0,
              right: 0,
            }}
            animate={{
              x: ["-100%", "100%"],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "linear",
            }}
          />
        ))}
        {/* Vertical code rain effect */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`v-${i}`}
            className="absolute w-px bg-gradient-to-b from-transparent via-[#6b5ce7]/20 to-transparent"
            style={{
              left: `${8 + i * 16}%`,
              top: 0,
              height: "60%",
            }}
            animate={{
              y: ["-60%", "160%"],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: 6 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {/* Logo/Badge */}
          <motion.div
            className="w-20 h-20 mx-auto mb-8 flex items-center justify-center"
            animate={{ filter: ["drop-shadow(0 0 8px rgba(192,168,110,0.15))", "drop-shadow(0 0 16px rgba(192,168,110,0.35))", "drop-shadow(0 0 8px rgba(192,168,110,0.15))"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <ImageWithFallback
              src={logoImg}
              alt="宁闽红 AI 酒庄"
              className="w-20 h-20 object-contain"
              style={{
                filter: "brightness(0) saturate(100%) invert(73%) sepia(20%) saturate(600%) hue-rotate(10deg) brightness(90%) contrast(85%)",
              }}
            />
          </motion.div>

          <h1
            className="text-[#f0e6d0] mb-4"
            style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "clamp(28px, 6vw, 42px)", lineHeight: 1.3 }}
          >
            宁闽红 AI 酒庄
          </h1>
          <p
            className="text-[#c0a86e] mb-3 tracking-widest"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(12px, 2.5vw, 15px)" }}
          >
            贺兰山东麓的"新质生产力"
          </p>
          <motion.div
            className="w-24 h-px mx-auto my-6 bg-gradient-to-r from-transparent via-[#c0a86e] to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
          />
          <p
            className="text-[#a0a8b8] mb-12"
            style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "clamp(14px, 3vw, 18px)", lineHeight: 1.8 }}
          >
            当北纬 38° 的黄金风土，遇见未来算力
          </p>
        </motion.div>

        <motion.button
          onClick={onStart}
          className="group relative px-10 py-4 border border-[#c0a86e]/50 rounded-full cursor-pointer overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(192,168,110,0.1) 0%, rgba(107,92,231,0.1) 100%)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          whileHover={{ scale: 1.05, borderColor: "rgba(192,168,110,0.8)" }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#c0a86e]/20 to-[#6b5ce7]/20"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <span className="relative flex items-center gap-3 text-[#c0a86e]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px" }}>
            <Zap className="w-4 h-4" />
            启动 AI 引擎
          </span>
        </motion.button>

        <motion.p
          className="mt-8 text-[#5a6178]"
          style={{ fontSize: "12px", fontFamily: "'Inter', sans-serif" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          向下滑动探索
        </motion.p>
      </div>
    </section>
  );
}