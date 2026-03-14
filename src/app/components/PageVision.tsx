import { motion } from "motion/react";
import {
  Building2,
  Handshake,
  FileText,
  ArrowRight,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";

export function PageVision() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    type: "渠道合伙人",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden py-20">
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1725101671209-cf29e5627a24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3aW5lcnklMjBidWlsZGluZyUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzM0MjE4MjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="酒庄愿景"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e]/95 via-[#0a0f1e]/90 to-[#0a0f1e]/95"
          style={{ background: "linear-gradient(to bottom, rgba(10,15,30,0.95), rgba(10,15,30,0.90), rgba(10,15,30,0.95))" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2
            className="text-[#f0e6d0] mb-2"
            style={{
              fontFamily: "'Noto Serif SC', serif",
              fontSize: "clamp(24px, 5vw, 32px)",
            }}
          >
            合作愿景
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-[#c0a86e] to-transparent mb-8" />
        </motion.div>

        {/* For Government */}
        <motion.div
          className="rounded-2xl border border-[#c0a86e]/20 overflow-hidden mb-8"
          style={{ background: "rgba(15, 20, 40, 0.75)" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-4 h-4 text-[#c0a86e]" />
              <span
                className="text-[#c0a86e]"
                style={{ fontSize: "14px" }}
              >
                产业升级
              </span>
            </div>
            <p
              className="text-[#a0a8b8]"
              style={{
                fontSize: "13px",
                lineHeight: 1.8,
                fontFamily: "'Noto Serif SC', serif",
              }}
            >
              响应产业升级号召，打造现代农业与工业 4.0 融合的
              <span className="text-[#c0a86e]">示范标杆</span>
              ，带动闽宁镇农旅与科技产业双管齐下。以新质生产力驱动传统葡萄酒产业转型升级，创造就业、提升产值、树立宁夏产区的智能化名片。
            </p>

            <div className="my-5 mx-auto w-2/3 h-px bg-gradient-to-r from-transparent via-[#c0a86e]/30 to-transparent" />

            <div className="flex items-center gap-2 mb-4">
              <Handshake className="w-4 h-4 text-[#6b5ce7]" />
              <span
                className="text-[#c0a86e]"
                style={{ fontSize: "14px" }}
              >
                渠道共赢
              </span>
            </div>
            <p
              className="text-[#a0a8b8]"
              style={{
                fontSize: "13px",
                lineHeight: 1.8,
                fontFamily: "'Noto Serif SC', serif",
              }}
            >
              以科技赋能品质，以溯源保障信任。告别传统同质化竞争，拥抱葡萄酒行业的
              <span className="text-[#6b5ce7]">下一个时代</span>
              。每一瓶宁闽红都自带数字信任背书，让您的客户从第一口就建立信心。
            </p>
          </div>
        </motion.div>

        {/* CTA Form */}
        <motion.div
          className="rounded-2xl border border-[#c0a86e]/30 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(192,168,110,0.08) 0%, rgba(107,92,231,0.08) 100%)",
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="p-5">
            {!submitted ? (
              <>
                <p
                  className="text-[#f0e6d0] mb-5 text-center"
                  style={{
                    fontSize: "16px",
                    fontFamily: "'Noto Serif SC', serif",
                  }}
                >
                  开启合作
                </p>

                {/* Action buttons */}
                <div className="flex justify-center mb-6">
                  <button
                    onClick={() =>
                      setFormData((d) => ({
                        ...d,
                        type: "预约参观",
                      }))
                    }
                    className="p-3 px-6 rounded-xl border cursor-pointer transition-all duration-300"
                    style={{
                      borderColor: "rgba(192,168,110,0.5)",
                      background: "rgba(192,168,110,0.1)",
                    }}
                  >
                    <Building2
                      className="w-4 h-4 mx-auto mb-2"
                      style={{ color: "#c0a86e" }}
                    />
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#c0a86e",
                      }}
                    >
                      预约参观
                    </p>
                  </button>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <input
                    type="text"
                    placeholder="您的姓名"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((d) => ({
                        ...d,
                        name: e.target.value,
                      }))
                    }
                    required
                    className="w-full p-3 rounded-xl border border-[#1e2640] text-[#f0e6d0] placeholder-[#3a4260] outline-none focus:border-[#c0a86e]/50 transition-colors"
                    style={{
                      background: "rgba(15,20,40,0.6)",
                      fontSize: "13px",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="公司/机构名称"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData((d) => ({
                        ...d,
                        company: e.target.value,
                      }))
                    }
                    required
                    className="w-full p-3 rounded-xl border border-[#1e2640] text-[#f0e6d0] placeholder-[#3a4260] outline-none focus:border-[#c0a86e]/50 transition-colors"
                    style={{
                      background: "rgba(15,20,40,0.6)",
                      fontSize: "13px",
                    }}
                  />
                  <input
                    type="tel"
                    placeholder="联系电话"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((d) => ({
                        ...d,
                        phone: e.target.value,
                      }))
                    }
                    required
                    className="w-full p-3 rounded-xl border border-[#1e2640] text-[#f0e6d0] placeholder-[#3a4260] outline-none focus:border-[#c0a86e]/50 transition-colors"
                    style={{
                      background: "rgba(15,20,40,0.6)",
                      fontSize: "13px",
                    }}
                  />
                  <motion.button
                    type="submit"
                    className="w-full py-3.5 rounded-xl border border-[#c0a86e]/50 text-[#c0a86e] flex items-center justify-center gap-2 cursor-pointer"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(192,168,110,0.15) 0%, rgba(107,92,231,0.1) 100%)",
                      fontSize: "14px",
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    提交申请
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </form>
              </>
            ) : (
              <motion.div
                className="text-center py-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 rounded-full border border-[#4ade80]/30 flex items-center justify-center"
                  style={{
                    background: "rgba(74,222,128,0.08)",
                  }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span style={{ fontSize: "28px" }}>✓</span>
                </motion.div>
                <p
                  className="text-[#f0e6d0] mb-2"
                  style={{
                    fontSize: "18px",
                    fontFamily: "'Noto Serif SC', serif",
                  }}
                >
                  申请已提交
                </p>
                <p
                  className="text-[#a0a8b8]"
                  style={{ fontSize: "13px" }}
                >
                  我们的团队将在 24 小时内与您取得联系
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <p
            className="text-[#5a6178]"
            style={{
              fontSize: "11px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            宁闽红 AI 酒庄 · 贺兰山东麓 · 闽宁镇
          </p>
          <p
            className="text-[#3a4260] mt-1"
            style={{ fontSize: "10px" }}
          >
            © 2026 宁闽红酒庄 All Rights Reserved
          </p>
        </motion.div>
      </div>
    </section>
  );
}