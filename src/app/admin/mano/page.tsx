import { createClient } from '@/infrastructure/supabase/server';
import { formatCurrency } from '@/core/utils';
import { UsersSVG, ProjectsSVG, TrendUpSVG, BarChartSVG } from '@/components/ui/Icons';

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'freelance');

  const { count: activeUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'freelance')
    .eq('is_active', true);

  const { count: totalProjects } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true });

  const { data: projectsVol } = await supabase
    .from('projects')
    .select('amount');

  const { data: externalVol } = await supabase
    .from('external_incomes')
    .select('amount');

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const { count: newUsersThisMonth } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'freelance')
    .gte('created_at', firstDayOfMonth);

  const totalVolume =
    (projectsVol ?? []).reduce((s, p) => s + Number(p.amount), 0) +
    (externalVol ?? []).reduce((s, e) => s + Number(e.amount), 0);

  const stats = [
    {
      label: 'Utilisateurs inscrits',
      value: (totalUsers ?? 0).toString(),
      sub: `${activeUsers ?? 0} actifs`,
      icon: UsersSVG,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Nouveaux ce mois',
      value: (newUsersThisMonth ?? 0).toString(),
      sub: 'Inscriptions récentes',
      icon: BarChartSVG,
      color: 'text-[#00A36C]',
      bg: 'bg-[#00A36C]/10',
    },
    {
      label: 'Projets créés',
      value: (totalProjects ?? 0).toString(),
      sub: 'Sur toute la plateforme',
      icon: ProjectsSVG,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Volume de transactions',
      value: formatCurrency(totalVolume),
      sub: 'Projets + Revenus externes',
      icon: TrendUpSVG,
      color: 'text-[#F6AD55]',
      bg: 'bg-[#F6AD55]/10',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A202C]">Vue globale</h1>
        <p className="text-gray-500 text-sm mt-1">Statistiques de croissance KASH</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="stat-card">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
              <Icon size={20} className={color} />
            </div>
            <p className="text-2xl font-bold text-[#1A202C] mb-1">{value}</p>
            <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
            <p className="text-xs text-gray-400">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
