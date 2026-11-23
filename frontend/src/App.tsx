import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Flame,
  Droplets,
  Wind,
  Zap,
  Cpu,
  Building,
  ArrowUpRight,
  Lock,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Copy,
  Check,
  ClipboardCheck,
  ChevronRight,
  Sparkles,
  FileText,
} from 'lucide-react';
import {
  BRAND,
  STANDARDS_8,
  SERVICES,
  PORTFOLIO_FILTERS,
  PORTFOLIO_PROJECTS,
  PARTNER_PILLARS,
  ABOUT_STATS,
  PRINCIPLES_5,
  ORDER_CATALOG,
  OrderCategoryId,
  TabId,
  ServiceItem,
  LeadModalContext,
} from './data/sdvData';
import { useTelegram } from './hooks/useTelegram';
import { BlueprintPattern } from './components/BlueprintPattern';
import { AcousticWidget } from './components/AcousticWidget';
import { BottomNav } from './components/BottomNav';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { LeadBottomSheet } from './components/LeadBottomSheet';
import { PrivacyModal } from './components/PrivacyModal';

const SERVICE_ICONS: Record<ServiceItem['icon'], React.ComponentType<{ className?: string }>> = {
  compass: Compass,
  flame: Flame,
  droplets: Droplets,
  wind: Wind,
  zap: Zap,
  cpu: Cpu,
  building: Building,
};

export default function App() {
  const { userName, hapticImpact, hapticSuccess, hapticSelection, sendLeadData, useBackButton } =
    useTelegram();

  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [leadContext, setLeadContext] = useState<LeadModalContext | null>(null);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [portfolioFilter, setPortfolioFilter] = useState<string>('Все');
  const [orderCategory, setOrderCategory] = useState<OrderCategoryId>('order_project');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2600);
  }, []);

  const handleBack = useCallback(() => {
    hapticImpact('light');
    if (privacyOpen) {
      setPrivacyOpen(false);
    } else if (leadContext) {
      setLeadContext(null);
    } else if (selectedService) {
      setSelectedService(null);
    }
  }, [privacyOpen, leadContext, selectedService, hapticImpact]);

  useBackButton(Boolean(privacyOpen || leadContext || selectedService), handleBack);

  const filteredProjects = useMemo(() => {
    if (portfolioFilter === 'Все') return PORTFOLIO_PROJECTS;
    return PORTFOLIO_PROJECTS.filter((p) => p.categories.includes(portfolioFilter));
  }, [portfolioFilter]);

  const openLead = (ctx: LeadModalContext) => {
    hapticImpact('medium');
    setLeadContext(ctx);
  };

  const handleTabSelect = (tab: TabId) => {
    if (tab === activeTab) return;
    hapticImpact('light');
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyAddress = async () => {
    hapticImpact('light');
    try {
      await navigator.clipboard.writeText(BRAND.address);
      setCopiedAddress(true);
      showToast('Адрес офиса скопирован');
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch {
      showToast(BRAND.address);
    }
  };

  const handleLeadSubmit = (payload: Record<string, unknown>) => {
    hapticSuccess();
    const sent = sendLeadData(payload);
    if (!sent) {
      showToast('Заявка зафиксирована (режим предпросмотра)');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F5F5F7] safe-pb">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[420px] h-[240px] bg-[#C8A97E]/[0.07] blur-[95px] rounded-full pointer-events-none" />

      <header className="sticky top-0 z-30 glass-elevated border-x-0 border-t-0">
        <div className="mx-auto max-w-md px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C8A97E] to-[#8C6D46] flex items-center justify-center text-[#0B0D10] font-extrabold text-xs tracking-tighter">
              СДВ
            </div>
            <div>
              <p className="text-xs font-extrabold tracking-tight text-[#F5F5F7] leading-none">
                СДВ Инжиниринг
              </p>
              <p className="text-[10px] text-[#8E95A2] mt-0.5">{BRAND.domain} • Москва и МО</p>
            </div>
          </div>

          <a
            href={`tel:${BRAND.phoneRaw}`}
            onClick={() => hapticImpact('light')}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] border border-white/10 px-3 py-1.5 text-[11px] font-semibold text-[#C8A97E] active:scale-95 transition-transform"
          >
            <Phone className="w-3 h-3" />
            <span>Позвонить</span>
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 pt-4">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <section className="relative glass-card rounded-[28px] p-5 overflow-hidden">
                <BlueprintPattern
                  variant="hero"
                  className="absolute inset-0 w-full h-full opacity-70"
                />
                <div className="relative z-10 space-y-4">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#C8A97E]/15 border border-[#C8A97E]/30 px-3 py-1 text-[11px] font-semibold text-[#C8A97E]">
                    <Lock className="w-3 h-3" />
                    <span>Москва и МО • NDA по умолчанию</span>
                  </div>

                  <h1 className="text-[23px] font-extrabold tracking-tight leading-[1.18] text-[#F5F5F7]">
                    Инженерные системы премиального дома под ключ: тепло, вода, воздух, свет без
                    сбоев и переделок
                  </h1>

                  <p className="text-xs leading-relaxed text-[#8E95A2]">
                    Проект, поставка, монтаж, пуско-наладка и сервис одной командой. Паспорт
                    инженерии, фото скрытых работ, замеры шума и понятные регламенты ТО.
                  </p>

                  <div className="flex flex-col gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => openLead({ mode: 'estimate_48h' })}
                      className="w-full py-3.5 px-4 rounded-2xl bg-[#C8A97E] text-[#0B0D10] font-extrabold text-sm tracking-tight shadow-[0_10px_28px_rgba(200,169,126,0.28)] active:scale-[0.98] transition-transform"
                    >
                      Получить план и смету за 48 часов
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => openLead({ mode: 'consultation' })}
                        className="w-full py-3 px-3 rounded-2xl bg-white/[0.05] border border-white/10 text-[#F5F5F7] font-semibold text-xs active:scale-[0.98] transition-transform"
                      >
                        Консультация
                      </button>
                      <button
                        type="button"
                        onClick={() => openLead({ mode: 'audit' })}
                        className="w-full py-3 px-3 rounded-2xl bg-white/[0.05] border border-white/10 text-[#F5F5F7] font-semibold text-xs active:scale-[0.98] transition-transform"
                      >
                        Аудит объекта
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <AcousticWidget onInteract={hapticSelection} />

              <section className="space-y-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#C8A97E] font-semibold">
                    Почему выбирают СДВ
                  </p>
                  <h2 className="text-lg font-extrabold text-[#F5F5F7]">8 стандартов работы</h2>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {STANDARDS_8.map((item, idx) => (
                    <div key={idx} className="glass-card rounded-2xl p-3.5 flex flex-col justify-between">
                      <span className="tabular-nums text-[11px] font-extrabold text-[#C8A97E] mb-2">
                        {item.metric}
                      </span>
                      <div>
                        <h3 className="text-xs font-bold text-[#F5F5F7] leading-snug mb-1">
                          {item.title}
                        </h3>
                        <p className="text-[11px] leading-relaxed text-[#8E95A2]">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl p-5 bg-gradient-to-br from-[#191D24] to-[#111419] border border-[#C8A97E]/30 space-y-3">
                <div className="flex items-center gap-2 text-[#C8A97E]">
                  <ClipboardCheck className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em]">
                    Антикризисное подключение
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-[#F5F5F7] leading-snug">
                  Аудит текущих этапов работ
                </h3>
                <p className="text-xs leading-relaxed text-[#8E95A2]">
                  Если на объекте возникли задержки или нарушена культура производства работ, мы
                  проведём диагностику систем, проверим узлы и подготовим приоритизированный план
                  исправлений.
                </p>
                <button
                  type="button"
                  onClick={() => openLead({ mode: 'audit' })}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C8A97E] pt-1"
                >
                  <span>Получить аудит этапов работ</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-extrabold text-[#F5F5F7]">Полный цикл решений</h2>
                  <button
                    type="button"
                    onClick={() => handleTabSelect('services')}
                    className="text-xs font-semibold text-[#C8A97E]"
                  >
                    Все 7 услуг
                  </button>
                </div>
                <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
                  {SERVICES.slice(0, 4).map((service) => {
                    const Icon = SERVICE_ICONS[service.icon];
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => {
                          hapticImpact('light');
                          setSelectedService(service);
                        }}
                        className="shrink-0 w-[225px] text-left glass-card rounded-2xl p-4 space-y-2.5 active:scale-[0.98] transition-transform"
                      >
                        <div className="flex items-center justify-between">
                          <div className="w-9 h-9 rounded-xl bg-[#C8A97E]/12 border border-[#C8A97E]/25 flex items-center justify-center text-[#C8A97E]">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-bold text-[#8E95A2] tabular-nums">
                            {service.code}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-[#F5F5F7] leading-snug">
                          {service.shortTitle}
                        </h3>
                        <p className="text-[11px] leading-relaxed text-[#8E95A2] line-clamp-2">
                          {service.tagline}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-extrabold text-[#F5F5F7]">Реализованные объекты</h2>
                  <button
                    type="button"
                    onClick={() => handleTabSelect('portfolio')}
                    className="text-xs font-semibold text-[#C8A97E]"
                  >
                    Все 9 кейсов
                  </button>
                </div>
                <div className="glass-card rounded-3xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#C8A97E]">
                      Рублёво-Успенское шоссе • NDA
                    </span>
                    <span className="tabular-nums text-xs font-extrabold text-[#F5F5F7]">
                      3 500 м²
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#F5F5F7]">
                    Монолитно-кирпичный дом 3 500 м²
                  </h3>
                  <p className="text-xs text-[#8E95A2] leading-relaxed">
                    Отопление, водоснабжение, канализация, тёплый пол и монтаж финишной сантехники.
                    Срок реализации — 8 месяцев.
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      openLead({
                        mode: 'office_viewing',
                        projectTitle: 'Монолитно-кирпичный дом 3 500 м², Рублёво-Успенское шоссе',
                      })
                    }
                    className="w-full py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-xs font-bold text-[#F5F5F7]"
                  >
                    Заявка на просмотр узлов в офисе
                  </button>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#C8A97E] font-semibold">
                  Быстрый заказ услуги
                </p>
                <h1 className="text-2xl font-extrabold tracking-tight text-[#F5F5F7]">
                  Проект, монтаж, ТО и аудит
                </h1>
                <p className="text-xs text-[#8E95A2] leading-relaxed">
                  Выберите нужный формат работ и инженерную систему — откроется форма с подбором параметров.
                </p>
              </div>

              {/* Interactive 4-Category Order Matrix */}
              {(() => {
                const currentCat =
                  ORDER_CATALOG.find((c) => c.id === orderCategory) ?? ORDER_CATALOG[0];
                return (
                  <section className="glass-card rounded-3xl p-4 space-y-3.5 border-[#C8A97E]/25">
                    <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-[#0B0D10]/80 border border-white/[0.06]">
                      {ORDER_CATALOG.map((cat) => {
                        const active = cat.id === orderCategory;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              hapticSelection();
                              setOrderCategory(cat.id);
                            }}
                            className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all ${
                              active
                                ? 'bg-[#C8A97E] text-[#0B0D10] shadow-sm'
                                : 'text-[#8E95A2] hover:text-[#F5F5F7]'
                            }`}
                          >
                            {cat.tabLabel}
                          </button>
                        );
                      })}
                    </div>

                    <div className="space-y-1">
                      <h2 className="text-sm font-extrabold text-[#F5F5F7]">{currentCat.title}</h2>
                      <p className="text-[11px] text-[#8E95A2] leading-snug">
                        {currentCat.subtitle}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {currentCat.items.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() =>
                            openLead({
                              mode: currentCat.id,
                              serviceTitle: item,
                              customCta: `${currentCat.title}: ${item}`,
                            })
                          }
                          className="text-left rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] px-3 py-2.5 flex items-center justify-between gap-2 active:scale-[0.98] transition-all"
                        >
                          <span className="text-xs font-semibold text-[#F5F5F7] leading-tight">
                            {item}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-[#C8A97E] shrink-0" />
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => openLead({ mode: 'consultation' })}
                      className="w-full py-3 rounded-2xl bg-[#C8A97E]/12 border border-[#C8A97E]/35 text-xs font-bold text-[#C8A97E] active:scale-[0.98] transition-transform"
                    >
                      Получить консультацию инженера
                    </button>
                  </section>
                );
              })()}

              <div className="pt-2 space-y-1">
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#8E95A2] font-semibold">
                  Подробно о направлениях
                </p>
                <h2 className="text-lg font-extrabold text-[#F5F5F7]">
                  7 инженерных разделов под ключ
                </h2>
              </div>

              <div className="space-y-3">
                {SERVICES.map((service) => {
                  const Icon = SERVICE_ICONS[service.icon];
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => {
                        hapticImpact('light');
                        setSelectedService(service);
                      }}
                      className="w-full text-left glass-card rounded-3xl p-4 flex items-start gap-3.5 active:scale-[0.985] transition-transform"
                    >
                      <div className="w-11 h-11 rounded-2xl bg-[#C8A97E]/12 border border-[#C8A97E]/25 flex items-center justify-center text-[#C8A97E] shrink-0 mt-0.5">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#C8A97E] tabular-nums">
                            {service.code}
                          </span>
                          <ChevronRight className="w-4 h-4 text-[#8E95A2]" />
                        </div>
                        <h3 className="text-sm font-bold text-[#F5F5F7] leading-snug mb-1">
                          {service.title}
                        </h3>
                        <p className="text-xs leading-relaxed text-[#8E95A2]">{service.tagline}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'portfolio' && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#C8A97E] font-semibold">
                  Реализованные дома и резиденции
                </p>
                <h1 className="text-2xl font-extrabold tracking-tight text-[#F5F5F7]">
                  Объекты под NDA
                </h1>
              </div>

              <div className="rounded-2xl bg-[#C8A97E]/10 border border-[#C8A97E]/25 p-3.5 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-[#C8A97E] shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed text-[#F5F5F7]/90">
                  Все объекты реализованы с соблюдением строгой конфиденциальности (NDA). Фотографии
                  узлов, паспорта и инженерные решения показываем лично в нашем офисе.
                </p>
              </div>

              <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
                {PORTFOLIO_FILTERS.map((filter) => {
                  const active = portfolioFilter === filter;
                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => {
                        hapticSelection();
                        setPortfolioFilter(filter);
                      }}
                      className={`shrink-0 px-3.5 py-2 rounded-full text-xs font-bold transition-all border ${
                        active
                          ? 'bg-[#C8A97E] text-[#0B0D10] border-[#C8A97E]'
                          : 'bg-white/[0.04] text-[#8E95A2] border-white/[0.08]'
                      }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-3.5">
                {filteredProjects.map((project) => (
                  <article
                    key={project.id}
                    className="glass-card rounded-3xl overflow-hidden flex flex-col"
                  >
                    <div className="relative h-28 bg-[#0E1116] border-b border-white/[0.06] p-4 flex flex-col justify-between overflow-hidden">
                      <BlueprintPattern
                        variant={project.accentType}
                        className="absolute inset-0 w-full h-full opacity-90"
                      />
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#0B0D10]/80 border border-white/10 px-2.5 py-1 text-[10px] font-semibold text-[#C8A97E]">
                          <Lock className="w-2.5 h-2.5" />
                          Фото в офисе (NDA)
                        </span>
                        <span className="tabular-nums text-sm font-extrabold text-[#F5F5F7] bg-[#0B0D10]/80 px-2.5 py-0.5 rounded-lg border border-white/10">
                          {project.area}
                        </span>
                      </div>
                      <p className="relative z-10 text-[11px] font-semibold text-[#8E95A2]">
                        {project.location}
                      </p>
                    </div>

                    <div className="p-4 space-y-3">
                      <h3 className="text-base font-extrabold text-[#F5F5F7] leading-snug">
                        {project.title}
                      </h3>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] px-3 py-2">
                          <span className="block text-[10px] text-[#8E95A2]">Проектирование</span>
                          <span className="tabular-nums text-xs font-bold text-[#F5F5F7]">
                            {project.designTime}
                          </span>
                        </div>
                        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] px-3 py-2">
                          <span className="block text-[10px] text-[#8E95A2]">Срок реализации</span>
                          <span className="tabular-nums text-xs font-bold text-[#F5F5F7]">
                            {project.buildTime}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs leading-relaxed text-[#8E95A2]">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {project.scope.map((tag, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.07] text-[#F5F5F7]/85"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          openLead({
                            mode: 'office_viewing',
                            projectTitle: `${project.title}, ${project.location}`,
                          })
                        }
                        className="w-full mt-1 py-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] border border-[#C8A97E]/30 text-xs font-bold text-[#C8A97E] active:scale-[0.98] transition-all"
                      >
                        Заявка на просмотр в офисе
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'partners' && (
            <motion.div
              key="partners"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div className="glass-card rounded-[28px] p-5 space-y-3 relative overflow-hidden">
                <BlueprintPattern
                  variant="fachwerk"
                  className="absolute inset-0 w-full h-full opacity-45"
                />
                <div className="relative z-10 space-y-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C8A97E]/15 border border-[#C8A97E]/30 px-3 py-1 text-[11px] font-semibold text-[#C8A97E]">
                    <Sparkles className="w-3 h-3" />
                    B2B • Архитекторам и дизайнерам
                  </span>
                  <h1 className="text-2xl font-extrabold tracking-tight leading-tight text-[#F5F5F7]">
                    Надёжный инженерный партнёр для проектных команд
                  </h1>
                  <p className="text-xs leading-relaxed text-[#8E95A2]">
                    Помогаем реализовывать сложные объекты без коллизий. Совместная работа по NDA,
                    расчёты по шуму, воздухообмену и прозрачные регламенты коммуникаций.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {PARTNER_PILLARS.map((pillar, idx) => (
                  <div key={idx} className="glass-card rounded-2xl p-4 flex items-start gap-3">
                    <span className="tabular-nums text-xs font-extrabold text-[#C8A97E] bg-[#C8A97E]/10 border border-[#C8A97E]/25 rounded-lg px-2 py-0.5 mt-0.5">
                      0{idx + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-[#F5F5F7] mb-1">{pillar.title}</h3>
                      <p className="text-xs leading-relaxed text-[#8E95A2]">{pillar.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl p-5 bg-gradient-to-br from-[#191D24] to-[#111419] border border-[#C8A97E]/30 space-y-3.5">
                <div className="flex items-center gap-2 text-[#C8A97E]">
                  <FileText className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em]">
                    Шаблон ТЗ по инженерии
                  </span>
                </div>
                <h2 className="text-lg font-extrabold text-[#F5F5F7]">Обсудим совместный проект?</h2>
                <p className="text-xs leading-relaxed text-[#8E95A2]">
                  Передадим шаблон ТЗ по инженерии и покажем наш подход к рабочей документации и
                  BIM-моделям. Работаем открыто, точно и без коллизий.
                </p>
                <button
                  type="button"
                  onClick={() => openLead({ mode: 'partner_b2b' })}
                  className="w-full py-3.5 rounded-2xl bg-[#C8A97E] text-[#0B0D10] font-extrabold text-sm shadow-[0_8px_24px_rgba(200,169,126,0.25)] active:scale-[0.98] transition-transform"
                >
                  Предложить совместный проект
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#C8A97E] font-semibold">
                  О компании
                </p>
                <h1 className="text-2xl font-extrabold tracking-tight text-[#F5F5F7]">
                  СДВ — инженерные системы премиальных домов
                </h1>
                <p className="text-xs leading-relaxed text-[#8E95A2]">
                  Проектируем и внедряем премиальные системы для загородных резиденций. Гарантируем
                  полную приватность, передаём объект с комплектом исполнительной документации и
                  фото скрытых работ.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {ABOUT_STATS.map((stat, idx) => (
                  <div
                    key={idx}
                    className={`glass-card rounded-2xl p-4 ${
                      stat.fullWidth ? 'col-span-2 flex items-center justify-between gap-4' : ''
                    }`}
                  >
                    <p className="tabular-nums text-2xl font-extrabold text-[#C8A97E]">
                      {stat.value}
                    </p>
                    <p className="text-[11px] leading-snug text-[#8E95A2] mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <section className="space-y-2.5">
                <h2 className="text-sm font-extrabold uppercase tracking-[0.1em] text-[#8E95A2]">
                  Инженерная культура во всём
                </h2>
                {PRINCIPLES_5.map((p, idx) => (
                  <div key={idx} className="glass-card rounded-2xl p-3.5 flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-[#C8A97E] shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xs font-bold text-[#F5F5F7]">{p.title}</h3>
                      <p className="text-[11px] leading-relaxed text-[#8E95A2] mt-0.5">
                        {p.description}
                      </p>
                    </div>
                  </div>
                ))}
              </section>

              <section className="glass-card rounded-3xl p-5 space-y-3.5 border-[#C8A97E]/25">
                <h2 className="text-base font-extrabold text-[#F5F5F7]">Контакты и офис</h2>

                <a
                  href={`tel:${BRAND.phoneRaw}`}
                  onClick={() => hapticImpact('light')}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]"
                >
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#C8A97E]" />
                    <span className="tabular-nums text-sm font-bold text-[#F5F5F7]">
                      {BRAND.phone}
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#8E95A2]" />
                </a>

                <a
                  href={`mailto:${BRAND.email}`}
                  onClick={() => hapticImpact('light')}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#C8A97E]" />
                    <span className="text-sm font-bold text-[#F5F5F7]">{BRAND.email}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#8E95A2]" />
                </a>

                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2.5">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#C8A97E] shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-[#F5F5F7] leading-snug">
                      {BRAND.address}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleCopyAddress}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/[0.05] text-[11px] font-bold text-[#F5F5F7]"
                    >
                      {copiedAddress ? (
                        <Check className="w-3.5 h-3.5 text-[#C8A97E]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-[#C8A97E]" />
                      )}
                      <span>{copiedAddress ? 'Скопировано' : 'Копировать'}</span>
                    </button>
                    <a
                      href={BRAND.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => hapticImpact('light')}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/[0.05] text-[11px] font-bold text-[#C8A97E]"
                    >
                      <span>Яндекс Карты</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openLead({ mode: 'question' })}
                  className="w-full py-3.5 rounded-2xl bg-[#C8A97E] text-[#0B0D10] font-extrabold text-sm active:scale-[0.98] transition-transform"
                >
                  Задать вопрос специалисту
                </button>
              </section>

              <footer className="text-center space-y-2 pt-2 pb-4">
                <button
                  type="button"
                  onClick={() => {
                    hapticImpact('light');
                    setPrivacyOpen(true);
                  }}
                  className="text-[11px] font-semibold text-[#C8A97E] underline underline-offset-4"
                >
                  Политика конфиденциальности
                </button>
                <p className="text-[10px] leading-relaxed text-[#8E95A2]/80 px-2">{BRAND.legal}</p>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} onSelect={handleTabSelect} />

      <ServiceDetailModal
        service={selectedService}
        onClose={() => {
          hapticImpact('light');
          setSelectedService(null);
        }}
        onRequestService={(service) => {
          openLead({
            mode: 'estimate_48h',
            serviceTitle: service.shortTitle,
            customCta: service.ctaLabel,
          });
        }}
        onTap={hapticSelection}
      />

      <LeadBottomSheet
        context={leadContext}
        initialName={userName}
        onClose={() => {
          hapticImpact('light');
          setLeadContext(null);
        }}
        onSubmitPayload={handleLeadSubmit}
        onOpenPrivacy={() => setPrivacyOpen(true)}
        onTap={hapticSelection}
      />

      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-[70] glass-elevated px-4 py-2 rounded-full text-xs font-semibold text-[#C8A97E] shadow-xl whitespace-nowrap"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
