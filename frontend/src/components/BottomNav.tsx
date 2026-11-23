import React from 'react';
import { motion } from 'framer-motion';
import { Home, Layers, Building2, Handshake, Info } from 'lucide-react';
import { TabId } from '../data/sdvData';

interface BottomNavProps {
  activeTab: TabId;
  onSelect: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'home', label: 'Главная', icon: Home },
  { id: 'services', label: 'Услуги', icon: Layers },
  { id: 'portfolio', label: 'Объекты', icon: Building2 },
  { id: 'partners', label: 'Партнёрам', icon: Handshake },
  { id: 'about', label: 'О СДВ', icon: Info },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelect }) => {
  return (
    <nav
      aria-label="Основная навигация"
      className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.65rem)] pt-2 pointer-events-none"
    >
      <div className="mx-auto max-w-md glass-elevated rounded-[26px] p-1.5 shadow-[0_14px_40px_rgba(0,0,0,0.65)] pointer-events-auto">
        <div className="grid grid-cols-5 gap-0.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelect(tab.id)}
                className="relative flex flex-col items-center justify-center py-2 px-1 rounded-[20px] transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute inset-0 rounded-[20px] bg-[#C8A97E]/15 border border-[#C8A97E]/30"
                  />
                )}
                <Icon
                  className={`relative z-10 w-[19px] h-[19px] mb-1 transition-colors ${
                    isActive ? 'text-[#C8A97E]' : 'text-[#8E95A2]'
                  }`}
                />
                <span
                  className={`relative z-10 text-[10px] font-semibold tracking-tight leading-none transition-colors ${
                    isActive ? 'text-[#F5F5F7]' : 'text-[#8E95A2]'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
