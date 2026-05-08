'use client';

import { useState, useEffect } from 'react';
import { CookieSVG, CheckSVG } from '@/components/ui/Icons';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('kash_cookie_consent');
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem('kash_cookie_consent', 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-24 md:max-w-sm z-40 bg-[#1A202C] text-white rounded-2xl shadow-2xl p-5">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-[#00A36C] mt-0.5 flex-shrink-0">
          <CookieSVG size={22} color="#00A36C" />
        </span>
        <div>
          <p className="font-semibold text-sm mb-1">Cookies</p>
          <p className="text-xs text-gray-300 leading-relaxed">
            KASH utilise des cookies essentiels pour assurer le bon fonctionnement de la plateforme.
            En continuant, vous acceptez leur utilisation.
          </p>
        </div>
      </div>
      <button
        onClick={accept}
        className="w-full flex items-center justify-center gap-2 bg-[#00A36C] hover:bg-[#008f5d] text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
      >
        <CheckSVG size={16} />
        Accepter
      </button>
    </div>
  );
}
