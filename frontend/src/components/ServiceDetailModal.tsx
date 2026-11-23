import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react';
import { ServiceItem } from '../data/sdvData';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onRequestService: (service: ServiceItem) => void;
  onTap: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onRequestService,
  onTap,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <AnimatePresence>
      {service && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          className="fixed inset-0 z-50 bg-[#0B0D10] overflow-y-auto"
        >
          <div className="sticky top-0 z-20 glass-elevated border-x-0 border-t-0 px-4 py-3.5 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 text-sm font-semibold text-[#F5F5F7] active:opacity-70"
            >
              <ArrowLeft className="w-4 h-4 text-[#C8A97E]" />
              <span>Назад</span>
            </button>
            <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#C8A97E] tabular-nums">
              {service.code}
            </span>
          </div>

          <div className="mx-auto max-w-md px-4 pt-5 pb-28 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#C8A97E]/12 border border-[#C8A97E]/30 px-3 py-1 text-[11px] font-semibold text-[#C8A97E]">
                <Sparkles className="w-3 h-3" />
                <span>{service.title}</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight leading-tight text-[#F5F5F7]">
                {service.heroTitle}
              </h1>
              <p className="text-sm leading-relaxed text-[#8E95A2]">{service.heroSubtitle}</p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xs uppercase tracking-[0.14em] font-bold text-[#8E95A2]">
                Ключевые преимущества
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {service.pillars.map((pillar, idx) => (
                  <div key={idx} className="glass-card rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <span className="tabular-nums text-xs font-extrabold text-[#C8A97E] bg-[#C8A97E]/10 border border-[#C8A97E]/25 rounded-lg px-2 py-0.5 mt-0.5">
                        0{idx + 1}
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-[#F5F5F7] mb-1">{pillar.title}</h3>
                        <p className="text-xs leading-relaxed text-[#8E95A2]">
                          {pillar.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-3xl p-5 border-[#C8A97E]/20">
              <h2 className="text-sm font-bold text-[#F5F5F7] mb-3.5">
                Инженерные стандарты СДВ по разделу
              </h2>
              <ul className="space-y-2.5">
                {service.standards.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-[#F5F5F7]/90">
                    <CheckCircle2 className="w-4 h-4 text-[#C8A97E] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2.5">
              <h2 className="text-xs uppercase tracking-[0.14em] font-bold text-[#8E95A2]">
                Отвечаем на частые вопросы
              </h2>
              {service.faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="glass-card rounded-2xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => {
                        onTap();
                        setOpenFaq(isOpen ? null : idx);
                      }}
                      className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left"
                    >
                      <span className="text-xs font-bold text-[#F5F5F7] leading-snug">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#C8A97E] shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 text-xs leading-relaxed text-[#8E95A2] border-t border-white/[0.06] pt-3">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 z-30 glass-elevated border-x-0 border-b-0 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.85rem)]">
            <div className="mx-auto max-w-md">
              <button
                type="button"
                onClick={() => onRequestService(service)}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#C8A97E] text-[#0B0D10] font-bold text-sm tracking-tight shadow-[0_8px_28px_rgba(200,169,126,0.3)] active:scale-[0.98] transition-transform"
              >
                {service.ctaLabel}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
