import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  FileSpreadsheet,
  ClipboardCheck,
  Lock,
  Handshake,
  MessageSquare,
  CheckCircle2,
  Compass,
  Wrench,
  ShieldCheck,
  PhoneCall,
} from 'lucide-react';
import {
  LeadModalContext,
  ORDER_CATALOG,
  CONSULTATION_TOPICS,
} from '../data/sdvData';

interface LeadBottomSheetProps {
  context: LeadModalContext | null;
  initialName: string;
  onClose: () => void;
  onSubmitPayload: (payload: Record<string, unknown>) => void;
  onOpenPrivacy: () => void;
  onTap: () => void;
}

const AREA_CHIPS = ['<200 м²', '200–500 м²', '500–1000 м²', '1000+ м²'];
const DEFAULT_SYSTEM_CHIPS = [
  'Отопление',
  'Котельная',
  'Вода и канализация',
  'Электроснабжение',
  'Вентиляция',
  'Умный дом',
  'Тёплый пол',
  'Дренаж (участка / фундамента)',
];

function formatRuPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  let normalized = digits;
  if (normalized.startsWith('8')) normalized = '7' + normalized.slice(1);
  if (normalized.length > 0 && !normalized.startsWith('7')) normalized = '7' + normalized;
  normalized = normalized.slice(0, 11);

  if (normalized.length === 0) return '';
  let out = '+7';
  if (normalized.length > 1) out += ` (${normalized.slice(1, 4)}`;
  if (normalized.length >= 4) out += ')';
  if (normalized.length > 4) out += ` ${normalized.slice(4, 7)}`;
  if (normalized.length > 7) out += `-${normalized.slice(7, 9)}`;
  if (normalized.length > 9) out += `-${normalized.slice(9, 11)}`;
  return out;
}

export const LeadBottomSheet: React.FC<LeadBottomSheetProps> = ({
  context,
  initialName,
  onClose,
  onSubmitPayload,
  onOpenPrivacy,
  onTap,
}) => {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [area, setArea] = useState<string>('');
  const [stage, setStage] = useState<string>('');
  const [selectedSystems, setSelectedSystems] = useState<string[]>([]);
  const [agreed, setAgreed] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (context) {
      setName(initialName);
      setSubmitted(false);
      setComment('');
      setArea('');
      setStage('');
      setSelectedSystems(context.serviceTitle ? [context.serviceTitle] : []);
    }
  }, [context, initialName]);

  const catalogMatch = ORDER_CATALOG.find((c) => c.id === context?.mode);

  const meta = (() => {
    if (catalogMatch) {
      const iconMap = {
        order_project: Compass,
        order_mount: Wrench,
        order_service: ShieldCheck,
        audit: ClipboardCheck,
      };
      return {
        title: catalogMatch.title,
        subtitle: catalogMatch.subtitle,
        badge: context?.serviceTitle
          ? `${catalogMatch.tabLabel} • ${context.serviceTitle}`
          : catalogMatch.title,
        icon: iconMap[catalogMatch.id],
        cta: context?.customCta || catalogMatch.ctaLabel,
        showArea: catalogMatch.showArea,
        systemsList: catalogMatch.items,
        stageLabel: catalogMatch.stageLabel,
        stageOptions: catalogMatch.stageOptions,
      };
    }

    switch (context?.mode) {
      case 'consultation':
        return {
          title: 'Получить консультацию',
          subtitle: 'Инженер-куратор ответит на вопросы, подскажет по системам и бюджету в течение часа.',
          badge: 'Консультация инженера',
          icon: PhoneCall,
          cta: 'Получить консультацию',
          showArea: true,
          systemsList: DEFAULT_SYSTEM_CHIPS,
          stageLabel: 'Тема консультации',
          stageOptions: CONSULTATION_TOPICS,
        };
      case 'office_viewing':
        return {
          title: 'Закрытый просмотр в офисе (NDA)',
          subtitle:
            'Покажем фотографии скрытых работ, паспорта и узлы лично в офисе на ул. Электродная, 11.',
          badge: context.projectTitle || 'Объект под NDA',
          icon: Lock,
          cta: 'Записаться на просмотр',
          showArea: false,
          systemsList: [] as string[],
          stageLabel: '',
          stageOptions: [] as string[],
        };
      case 'partner_b2b':
        return {
          title: 'Совместный проект / Шаблон ТЗ',
          subtitle:
            'Передадим шаблон ТЗ по инженерии и обсудим увязку разделов по NDA без коллизий.',
          badge: 'Архитекторам и дизайнерам',
          icon: Handshake,
          cta: 'Предложить проект',
          showArea: true,
          systemsList: [] as string[],
          stageLabel: 'Формат сотрудничества',
          stageOptions: ['Нужен шаблон ТЗ', 'Есть объект в работе', 'Авторский надзор'],
        };
      case 'question':
        return {
          title: 'Вопрос инженеру-куратору',
          subtitle: 'Ответим по существу, с расчётами и примерами решений в течение часа.',
          badge: 'Консультация',
          icon: MessageSquare,
          cta: 'Отправить вопрос',
          showArea: false,
          systemsList: [] as string[],
          stageLabel: 'Тема вопроса',
          stageOptions: CONSULTATION_TOPICS,
        };
      default:
        return {
          title: 'План и смета за 48 часов',
          subtitle: 'Заполните короткую форму — подготовим расчёт и ответим на все вопросы.',
          badge: context?.serviceTitle || 'Расчёт под ключ',
          icon: FileSpreadsheet,
          cta: context?.customCta || 'Получить план и смету',
          showArea: true,
          systemsList: DEFAULT_SYSTEM_CHIPS,
          stageLabel: 'Стадия объекта',
          stageOptions: ['Есть проект / план', 'Идёт стройка', 'Только планируем'],
        };
    }
  })();

  const Icon = meta.icon;
  const phoneDigits = phone.replace(/\D/g, '');
  const canSubmit = name.trim().length >= 2 && phoneDigits.length === 11 && agreed;

  const toggleSystem = (sys: string) => {
    onTap();
    setSelectedSystems((prev) =>
      prev.includes(sys) ? prev.filter((item) => item !== sys) : [...prev, sys]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !context) return;

    onSubmitPayload({
      mode: context.mode,
      contextBadge: meta.badge,
      projectTitle: context.projectTitle ?? null,
      serviceTitle: context.serviceTitle ?? null,
      name: name.trim(),
      phone,
      area: area || null,
      stage: stage || null,
      systems: selectedSystems,
      comment: comment.trim() || null,
    });
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {context && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 360, damping: 34 }}
            className="relative z-10 w-full max-w-md max-h-[92vh] overflow-y-auto rounded-t-[30px] bg-[#12151A] border-t border-white/10 px-5 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)]"
          >
            <div className="mx-auto w-10 h-1 rounded-full bg-white/20 mb-4" />

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center space-y-4"
              >
                <div className="mx-auto w-16 h-16 rounded-full bg-[#C8A97E]/15 border border-[#C8A97E]/40 flex items-center justify-center text-[#C8A97E]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-extrabold text-[#F5F5F7]">Заявка принята</h3>
                  <p className="text-sm text-[#8E95A2] leading-relaxed">
                    Инженер-куратор СДВ свяжется с вами в течение часа и подберёт удобный формат
                    встречи или расчёта.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 w-full py-3.5 rounded-2xl bg-[#C8A97E] text-[#0B0D10] font-bold text-sm"
                >
                  Вернуться в приложение
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#C8A97E]/15 border border-[#C8A97E]/30 flex items-center justify-center text-[#C8A97E] shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="inline-block text-[10px] font-bold uppercase tracking-[0.12em] text-[#C8A97E] mb-0.5">
                        {meta.badge}
                      </span>
                      <h3 className="text-lg font-extrabold text-[#F5F5F7] leading-snug">
                        {meta.title}
                      </h3>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-[#8E95A2]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs leading-relaxed text-[#8E95A2]">{meta.subtitle}</p>

                {/* Contextual Smart Selectors */}
                {(meta.showArea || meta.systemsList.length > 0 || meta.stageOptions.length > 0) && (
                  <div className="space-y-3 pt-1">
                    {meta.systemsList.length > 0 && (
                      <div>
                        <label className="block text-[11px] font-semibold text-[#8E95A2] mb-2">
                          Выберите разделы / системы (можно несколько)
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {meta.systemsList.map((sys) => {
                            const active = selectedSystems.includes(sys);
                            return (
                              <button
                                key={sys}
                                type="button"
                                onClick={() => toggleSystem(sys)}
                                className={`py-1.5 px-2.5 rounded-xl text-[11px] font-semibold border transition-all ${
                                  active
                                    ? 'bg-[#C8A97E]/20 border-[#C8A97E] text-[#F5F5F7]'
                                    : 'bg-white/[0.03] border-white/[0.08] text-[#8E95A2]'
                                }`}
                              >
                                {sys}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {meta.showArea && (
                      <div>
                        <label className="block text-[11px] font-semibold text-[#8E95A2] mb-2">
                          Ориентировочная площадь дома
                        </label>
                        <div className="grid grid-cols-4 gap-1.5">
                          {AREA_CHIPS.map((chip) => {
                            const active = area === chip;
                            return (
                              <button
                                key={chip}
                                type="button"
                                onClick={() => {
                                  onTap();
                                  setArea(active ? '' : chip);
                                }}
                                className={`tabular-nums py-2 px-1 rounded-xl text-[11px] font-bold border transition-all ${
                                  active
                                    ? 'bg-[#C8A97E]/20 border-[#C8A97E] text-[#F5F5F7]'
                                    : 'bg-white/[0.03] border-white/[0.08] text-[#8E95A2]'
                                }`}
                              >
                                {chip}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {meta.stageOptions.length > 0 && (
                      <div>
                        <label className="block text-[11px] font-semibold text-[#8E95A2] mb-2">
                          {meta.stageLabel}
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {meta.stageOptions.map((opt) => {
                            const active = stage === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                  onTap();
                                  setStage(active ? '' : opt);
                                }}
                                className={`py-1.5 px-3 rounded-xl text-[11px] font-semibold border transition-all ${
                                  active
                                    ? 'bg-[#C8A97E]/20 border-[#C8A97E] text-[#F5F5F7]'
                                    : 'bg-white/[0.03] border-white/[0.08] text-[#8E95A2]'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#8E95A2] mb-1.5">
                      Ваше имя
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Алексей"
                      required
                      className="w-full rounded-2xl bg-[#0B0D10] border border-white/10 px-4 py-3 text-sm text-[#F5F5F7] placeholder:text-[#8E95A2]/50 focus:outline-none focus:border-[#C8A97E]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#8E95A2] mb-1.5">
                      Номер телефона
                    </label>
                    <input
                      type="tel"
                      inputMode="tel"
                      value={phone}
                      onChange={(e) => setPhone(formatRuPhone(e.target.value))}
                      placeholder="+7 (999) 000-00-00"
                      required
                      className="w-full tabular-nums rounded-2xl bg-[#0B0D10] border border-white/10 px-4 py-3 text-sm text-[#F5F5F7] placeholder:text-[#8E95A2]/50 focus:outline-none focus:border-[#C8A97E]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#8E95A2] mb-1.5">
                      Комментарий (необязательно)
                    </label>
                    <textarea
                      rows={2}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Локация, особенности объекта или ваш вопрос..."
                      className="w-full rounded-2xl bg-[#0B0D10] border border-white/10 px-4 py-2.5 text-sm text-[#F5F5F7] placeholder:text-[#8E95A2]/50 focus:outline-none focus:border-[#C8A97E] resize-none"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded accent-[#C8A97E]"
                  />
                  <span className="text-[11px] leading-snug text-[#8E95A2]">
                    Даю согласие на обработку персональных данных и принимаю{' '}
                    <button
                      type="button"
                      onClick={onOpenPrivacy}
                      className="text-[#C8A97E] underline underline-offset-2"
                    >
                      политику конфиденциальности
                    </button>
                    .
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full py-3.5 px-5 rounded-2xl bg-[#C8A97E] text-[#0B0D10] font-extrabold text-sm tracking-tight disabled:opacity-40 active:scale-[0.98] transition-all shadow-[0_8px_24px_rgba(200,169,126,0.25)]"
                >
                  {meta.cta}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
