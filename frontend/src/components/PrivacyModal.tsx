import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield } from 'lucide-react';
import { BRAND } from '../data/sdvData';

interface PrivacyModalProps {
  open: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ open, onClose }) => (
  <AnimatePresence>
    {open && (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative z-10 w-full max-w-md max-h-[80vh] overflow-y-auto rounded-3xl bg-[#12151A] border border-white/10 p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#C8A97E]">
              <Shield className="w-4 h-4" />
              <h3 className="text-sm font-bold text-[#F5F5F7]">Политика конфиденциальности</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-[#8E95A2]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-[#8E95A2]">
            <p>
              {BRAND.name} ({BRAND.domain}) уважает приватность каждого клиента и работает по
              договору о неразглашении (NDA) по умолчанию.
            </p>
            <p>
              Переданные через формы заявки данные (имя, номер телефона, параметры объекта и
              комментарий) используются исключительно для подготовки инженерного плана, сметы,
              аудита или согласования встречи в офисе по адресу: {BRAND.address}.
            </p>
            <p>
              Мы не передаём персональные данные третьим лицам и не публикуем адреса, фотографии
              интерьеров или личные данные владельцев объектов. По любым вопросам обработки данных
              обращайтесь на {BRAND.email} или по телефону {BRAND.phone}.
            </p>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
