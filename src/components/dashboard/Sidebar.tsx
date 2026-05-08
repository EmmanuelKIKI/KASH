'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { KashLogoSVG } from '@/components/ui/KashLogoSVG';
import {
  DashboardSVG, ProjectsSVG, InvoiceSVG, PlusSVG,
  UploadSVG, DownloadSVG, UserSVG, LogoutSVG, HelpSVG,
} from '@/components/ui/Icons';
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

interface SidebarProps {
  profile: Profile;
}

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#1A202C] h-screen flex-shrink-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <KashLogoSVG width={130} height={44} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {NAV.map(({ label, href, icon: Icon }) => {
          const isActive = href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[#00A36C] text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={18} color="currentColor" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Aide - séparé en bas */}
      <div className="px-4 pb-2">
        <Link
          href="/dashboard/aide"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
            pathname === '/dashboard/aide'
              ? 'bg-[#25D366]/20 text-[#25D366]'
              : 'text-gray-400 hover:text-[#25D366] hover:bg-[#25D366]/10'
          }`}
        >
          <HelpSVG size={18} color="currentColor" />
          Aide & Support
        </Link>
      </div>

      {/* Profil + déconnexion */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#00A36C]"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#00A36C] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {getInitials(profile.full_name)}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{profile.full_name}</p>
            <p className="text-gray-500 text-xs truncate">{profile.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-150"
        >
          <LogoutSVG size={18} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
