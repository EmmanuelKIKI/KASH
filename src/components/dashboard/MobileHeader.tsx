'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { KashLogoSVG } from '@/components/ui/KashLogoSVG';
import { MenuSVG, CloseSVG, DashboardSVG, ProjectsSVG, InvoiceSVG, PlusSVG, UploadSVG, DownloadSVG, UserSVG, LogoutSVG, HelpSVG } from '@/components/ui/Icons';
import { createClient } from '@/infrastructure/supabase/client';
import type { Profile } from '@/core/types';
import { getInitials } from '@/core/utils';

const NAV = [
  { label: 'Tableau de bord', href: '/dashboard', icon: DashboardSVG },
  { label: 'Projets', href: '/dashboard/projects', icon: ProjectsSVG },
  { label: 'Factures', href: '/dashboard/invoices', icon: InvoiceSVG },
  { label: 'Revenus externes', href: '/dashboard/external-incomes', icon: PlusSVG },
  { label: 'Preuves de paiement', href: '/dashboard/payment-proofs', icon: UploadSVG },
  { label: 'Exportation', href: '/dashboard/export', icon: DownloadSVG },
  { label: 'Profil', href: '/dashboard/profile', icon: UserSVG },
];

export function MobileHeader({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <header className="md:hidden flex items-center justify-between px-4 py-4 bg-[#1A202C] border-b border-white/10">
      <KashLogoSVG width={100} height={34} />
      <div className="flex items-center gap-3">
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt={profile.full_name} className="w-8 h-8 rounded-full object-cover ring-2 ring-[#00A36C]" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#00A36C] flex items-center justify-center text-white text-xs font-bold">
            {getInitials(profile.full_name)}
          </div>
        )}
        <button onClick={() => setOpen(true)} className="text-white p-1" aria-label="Ouvrir le menu">
          <MenuSVG size={24} />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative ml-auto w-72 bg-[#1A202C] h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <KashLogoSVG width={100} height={34} />
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white" aria-label="Fermer">
                <CloseSVG size={22} />
              </button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-1">
              {NAV.map(({ label, href, icon: Icon }) => {
                const isActive = href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive ? 'bg-[#00A36C] text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                );
              })}
              <Link
                href="/dashboard/aide"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  pathname === '/dashboard/aide'
                    ? 'bg-[#25D366]/20 text-[#25D366]'
                    : 'text-gray-400 hover:text-[#25D366] hover:bg-[#25D366]/10'
                }`}
              >
                <HelpSVG size={18} />
                Aide & Support
              </Link>
            </nav>
            <div className="px-4 py-4 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
              >
                <LogoutSVG size={18} />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
