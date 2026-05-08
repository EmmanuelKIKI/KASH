import { redirect } from 'next/navigation';
import { createClient } from '@/infrastructure/supabase/server';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { MobileHeader } from '@/components/dashboard/MobileHeader';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) redirect('/auth/login');

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7FAFC]">
      <Sidebar profile={profile} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileHeader profile={profile} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
