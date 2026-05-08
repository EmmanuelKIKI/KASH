'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/infrastructure/supabase/client';
import { BanSVG, RefreshSVG } from '@/components/ui/Icons';

interface UserToggleButtonProps {
  userId: string;
  isActive: boolean;
}

export function UserToggleButton({ userId, isActive }: UserToggleButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggle() {
    setLoading(true);
    const supabase = createClient();
    await supabase
      .from('profiles')
      .update({ is_active: !isActive })
      .eq('id', userId);
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
        isActive
          ? 'text-red-600 bg-red-50 hover:bg-red-100'
          : 'text-[#00A36C] bg-[#00A36C]/10 hover:bg-[#00A36C]/20'
      }`}
    >
      {loading ? (
        <div className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
      ) : isActive ? (
        <BanSVG size={14} />
      ) : (
        <RefreshSVG size={14} />
      )}
      {isActive ? 'Suspendre' : 'Réactiver'}
    </button>
  );
}
