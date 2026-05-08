import { redirect } from 'next/navigation';
import { createClient } from '@/infrastructure/supabase/server';
import { KashLogoSVG } from '@/components/ui/KashLogoSVG';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, email')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') redirect('/dashboard');

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7FAFC]">
      <AdminSidebar profile={profile} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div />
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00A36C]" />
            <span className="text-sm font-medium text-[#1A202C]">Admin – {profile.full_name}</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
