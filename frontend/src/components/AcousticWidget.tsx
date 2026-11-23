import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, ShieldCheck } from 'lucide-react';
import { ACOUSTIC_LEVELS } from '../data/sdvData';

interface AcousticWidgetProps {
  onInteract: () => void;
}

export const AcousticWidget: React.FC<AcousticWidgetProps> = ({ onInteract }) => {
  const [selectedId, setSelectedId] = useState<string>(ACOUSTIC_LEVELS[0].id);
  const current = ACOUSTIC_LEVELS.find((l) => l.id === selectedId) ?? ACOUSTIC_LEVELS[0];

  return (
    <section className="glass-card rounded-3xl p-5 relative overflow-hidden">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#C8A97E]/15 border border-[#C8A97E]/30 flex items-center justify-center text-[#C8A97E]">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#C8A97E] font-semibold">
              Акустический стандарт
            </p>
            <h3 className="text-base font-bold text-[#F5F5F7]">Тихий дом ≤25 дБ</h3>
          </div>
        </div>
        <span className="tabular-nums text-xl font-extrabold text-[#C8A97E]">
          {current.range}
        </span>
      </div>

      <div className="space-y-2.5">
        {ACOUSTIC_LEVELS.map((item) => {
          const isSelected = item.id === selectedId;
          const widthPct = Math.min(100, Math.round((item.db / 55) * 100));

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onInteract();
                setSelectedId(item.id);
              }}
              className={`w-full text-left rounded-2xl p-3 transition-all border ${
                isSelected
                  ? 'bg-white/[0.07] border-[#C8A97E]/50'
                  : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-[#F5F5F7] pr-2">{item.label}</span>
                <span
                  className={`tabular-nums font-bold shrink-0 ${
                    item.highlight ? 'text-[#C8A97E]' : 'text-[#8E95A2]'
                  }`}
                >
                  {item.range}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  initial={false}
                  animate={{ width: `${widthPct}%` }}
                  transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                  className={`h-full rounded-full ${
                    item.highlight
                      ? 'bg-gradient-to-r from-[#C8A97E]/70 to-[#C8A97E]'
                      : item.db > 40
                      ? 'bg-red-400/70'
                      : 'bg-white/30'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>

      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 rounded-2xl bg-[#0B0D10]/70 border border-white/[0.06] p-3.5"
      >
        <p className="text-xs leading-relaxed text-[#F5F5F7]/90">{current.note}</p>
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-[#C8A97E]">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>Замеры шумомером при приёмке — стандарт, а не доп. услуга.</span>
        </div>
      </motion.div>
    </section>
  );
};
