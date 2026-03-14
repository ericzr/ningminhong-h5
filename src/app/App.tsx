import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ParticleBackground } from "./components/ParticleBackground";
import { PageCover } from "./components/PageCover";
import { PageTerroir } from "./components/PageTerroir";
import { PageFarming } from "./components/PageFarming";
import { PageHarvest } from "./components/PageHarvest";
import { PageBrewing } from "./components/PageBrewing";
import { PageTraceability } from "./components/PageTraceability";
import { PageVision } from "./components/PageVision";
import { PageDashboard } from "./components/PageDashboard";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import stickyLogo from "@/assets/16786e6b4dc0ad2a714a3e4fccb975aad96fd311.png";

export default function App() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const rect = contentRef.current.getBoundingClientRect();
        setShowHeader(rect.top <= 0);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleStart = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="w-full min-h-screen overflow-x-hidden"
      style={{
        background:
          "linear-gradient(180deg, #0a0f1e 0%, #0d1225 50%, #0a0f1e 100%)",
        fontFamily: "'Noto Serif SC', 'Inter', sans-serif",
      }}
    >
      <ParticleBackground />

      {/* Sticky logo header */}
      <AnimatePresence>
        {showHeader && (
          <motion.header
            className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center"
            style={{
              height: 56,
              background: "rgba(10, 15, 30, 0.75)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderBottom: "1px solid rgba(192, 168, 110, 0.12)",
            }}
            initial={{ y: -56, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -56, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <ImageWithFallback
              src={stickyLogo}
              alt="宁闽红 AI 酒庄"
              className="h-8 w-8 object-contain"
              style={{
                filter: "brightness(0) saturate(100%) invert(73%) sepia(20%) saturate(600%) hue-rotate(10deg) brightness(90%) contrast(85%)",
              }}
            />
          </motion.header>
        )}
      </AnimatePresence>

      {/* Navigation dots */}
      <nav className="fixed right-3 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {[
          "封面",
          "产区",
          "种植",
          "采摘",
          "酿造",
          "溯源",
          "大屏",
          "合作",
        ].map((label, i) => (
          <button
            key={label}
            onClick={() => {
              const sections =
                document.querySelectorAll("section");
              sections[i]?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            className="group relative w-3 h-3 rounded-full border border-[#c0a86e]/30 cursor-pointer transition-all duration-300 hover:border-[#c0a86e] hover:bg-[#c0a86e]/20"
            style={{ background: "rgba(15,20,40,0.6)" }}
            title={label}
          >
            <span
              className="absolute right-6 top-1/2 -translate-y-1/2 text-[#c0a86e] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
              style={{ fontSize: "11px" }}
            >
              {label}
            </span>
          </button>
        ))}
      </nav>

      <PageCover onStart={handleStart} />
      <div ref={contentRef}>
        <PageTerroir />
      </div>
      <PageFarming />
      <PageHarvest />
      <PageBrewing />
      <PageTraceability />
      <PageDashboard />
      <PageVision />
    </div>
  );
}