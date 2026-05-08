'use client';

import { KASH_CONFIG } from '@/core/constants';
import { WhatsAppSVG } from './Icons';

export function WhatsAppButton() {
  return (
    <a
      href={KASH_CONFIG.WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter le support KASH via WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
    >
      <WhatsAppSVG size={28} />
    </a>
  );
}
