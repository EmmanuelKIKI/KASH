'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { KashLogoSVG } from '@/components/ui/KashLogoSVG';
import { BarChartSVG, UsersSVG, TrendUpSVG, LogoutSVG, ShieldSVG } from '@/components/ui/Icons';
import { createClient } from '@/infrastructure/supabase/client';

const NAV = [
  { label: 'Vue globale', href: '/admin/mano', icon: BarChartSVG },
  { label: 'Utilisateurs', href: '/admin/mano/users', icon: UsersSVG },
  { label: 'Transactions', href: '/admin/mano/transactions', icon: TrendUpSVG },
];

interface AdminSidebarProps {
  profile: { full_name: string; email: string; role: string };
}

export function AdminSidebar({ profile }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  }

  return (
    <aside className="flex flex-col w-64 bg-[#1A202C] h-screen flex-shrink-0">
      <div className="px-6 py-6 border-b border-white/10">
        <KashLogoSVG width={130} height={44} />
        <div className="flex items-center gap-2 mt-3">
          <ShieldSVG size={14} color="#F6AD55" />
          <span className="text-xs font-semibold text-[#F6AD55] uppercase tracking-wider">Administration</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {NAV.map(({ label, href, icon: Icon }) => {
          const isActive = href === '/admin/mano'
            ? pathname === '/admin/mano'
            : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[#F6AD55] text-[#1A202C]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <div className="px-4 py-2 mb-2">
          <p className="text-white text-sm font-semibold truncate">{profile.full_name}</p>
          <p className="text-gray-500 text-xs truncate">{profile.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogoutSVG size={18} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
