import { createClient } from '@/infrastructure/supabase/server';
import { GREETINGS } from '@/core/constants';
import { formatCurrency, getInitials } from '@/core/utils';
import { TrendUpSVG, ProjectsSVG, InvoiceSVG, PlusSVG } from '@/components/ui/Icons';
import Link from 'next/link';
import { RevenueChart } from '@/components/dashboard/RevenueChart';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url, email')
    .eq('id', user!.id)
    .single();

  const { data: projects } = await supabase
    .from('projects')
    .select('amount, status, created_at')
    .eq('user_id', user!.id);

  const { data: externalIncomes } = await supabase
    .from('external_incomes')
    .select('amount, received_at')
    .eq('user_id', user!.id);

  const { data: invoices } = await supabase
    .from('invoices')
    .select('amount, status, due_date, created_at')
    .eq('user_id', user!.id);

  const now = new Date();

  // Stats globales
  const totalProjects = (projects ?? []).reduce((s, p) => s + Number(p.amount), 0);
  const totalExternal = (externalIncomes ?? []).reduce((s, e) => s + Number(e.amount), 0);
  const totalRevenue = totalProjects + totalExternal;
  const paidInvoices = (invoices ?? []).filter((i) => i.status === 'payee').reduce((s, i) => s + Number(i.amount), 0);
  const activeProjects = (projects ?? []).filter((p) => p.status === 'en_cours').length;

  // Statuts factures avec "en retard"
  const allInvoices = invoices ?? [];
  const invoiceStats = {
    brouillon: { count: 0, amount: 0 },
    envoyee: { count: 0, amount: 0 },
    payee: { count: 0, amount: 0 },
    en_retard: { count: 0, amount: 0 },
    annulee: { count: 0, amount: 0 },
  };
  for (const inv of allInvoices) {
    const isLate = inv.status === 'envoyee' && inv.due_date && new Date(inv.due_date) < now;
    const key = isLate ? 'en_retard' : inv.status as keyof typeof invoiceStats;
    if (key in invoiceStats) {
      invoiceStats[key].count += 1;
      invoiceStats[key].amount += Number(inv.amount);
    }
  }

  // Données graphique : 12 derniers mois
  const monthlyData: { month: string; label: string; amount: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const key = `${year}-${String(month + 1).padStart(2, '0')}`;
    const labels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

    const projectsAmt = (projects ?? [])
      .filter((p) => {
        const pd = new Date(p.created_at);
        return pd.getFullYear() === year && pd.getMonth() === month;
      })
      .reduce((s, p) => s + Number(p.amount), 0);

    const externalAmt = (externalIncomes ?? [])
      .filter((e) => {
        const ed = new Date(e.received_at);
        return ed.getFullYear() === year && ed.getMonth() === month;
      })
      .reduce((s, e) => s + Number(e.amount), 0);

    monthlyData.push({ month: key, label: labels[month], amount: projectsAmt + externalAmt });
  }

  const greeting = GREETINGS.getGreeting(profile?.full_name?.split(' ')[0] ?? 'vous');
  const motivation = GREETINGS.getMotivation();

  const stats = [
    {
      label: "Chiffre d'affaires total",
      value: formatCurrency(totalRevenue),
      sub: 'Projets + Revenus externes',
      icon: TrendUpSVG,
      color: 'text-[#00A36C]',
      bg: 'bg-[#00A36C]/10',
    },
    {
      label: 'Projets actifs',
      value: activeProjects.toString(),
      sub: `${projects?.length ?? 0} projet(s) au total`,
      icon: ProjectsSVG,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Factures encaissées',
      value: formatCurrency(paidInvoices),
      sub: `${invoiceStats.payee.count} facture(s) payée(s)`,
      icon: InvoiceSVG,
      color: 'text-[#F6AD55]',
      bg: 'bg-[#F6AD55]/10',
    },
    {
      label: 'Revenus externes',
      value: formatCurrency(totalExternal),
      sub: 'Hors projets KASH',
      icon: PlusSVG,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  const invoiceCards = [
    { key: 'brouillon', label: 'Brouillon', color: 'bg-gray-100 text-gray-600 border-gray-200', dot: 'bg-gray-400' },
    { key: 'envoyee', label: 'Envoyée', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
    { key: 'payee', label: 'Payée', color: 'bg-[#00A36C]/10 text-[#00A36C] border-[#00A36C]/20', dot: 'bg-[#00A36C]' },
    { key: 'en_retard', label: 'En retard', color: 'bg-red-50 text-red-600 border-red-200', dot: 'bg-red-500' },
  ] as const;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Salutation */}
      <div className="flex items-center gap-4 mb-8">
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.full_name}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-[#00A36C] flex-shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-[#00A36C] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {getInitials(profile?.full_name ?? 'U')}
          </div>
        )}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A202C]">{greeting}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{motivation}</p>
        </div>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="stat-card">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={20} color="currentColor" className={color} />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#1A202C] mb-1">{value}</p>
            <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
            <p className="text-xs text-gray-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* Graphique revenus */}
      <div className="card mb-6">
        <RevenueChart data={monthlyData} />
      </div>

      {/* Cartes statuts factures */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {invoiceCards.map(({ key, label, color, dot }) => {
          const stat = invoiceStats[key];
          return (
            <div key={key} className={`rounded-2xl border p-4 ${color}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full ${dot}`} />
                <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
              </div>
              <p className="text-2xl font-bold mb-0.5">{stat.count}</p>
              <p className="text-xs opacity-80">{formatCurrency(stat.amount)}</p>
            </div>
          );
        })}
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/dashboard/projects/new" className="card-hover flex items-center gap-4 cursor-pointer group">
          <div className="w-12 h-12 bg-[#00A36C]/10 rounded-xl flex items-center justify-center group-hover:bg-[#00A36C] transition-colors">
            <ProjectsSVG size={22} className="text-[#00A36C] group-hover:text-white" />
          </div>
          <div>
            <p className="font-semibold text-[#1A202C]">Nouveau projet</p>
            <p className="text-sm text-gray-500">Ajouter un projet client</p>
          </div>
        </Link>

        <Link href="/dashboard/invoices/new" className="card-hover flex items-center gap-4 cursor-pointer group">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
            <InvoiceSVG size={22} className="text-blue-600 group-hover:text-white" />
          </div>
          <div>
            <p className="font-semibold text-[#1A202C]">Nouvelle facture</p>
            <p className="text-sm text-gray-500">Créer et envoyer une facture</p>
          </div>
        </Link>

        <Link href="/dashboard/external-incomes/new" className="card-hover flex items-center gap-4 cursor-pointer group">
          <div className="w-12 h-12 bg-[#F6AD55]/10 rounded-xl flex items-center justify-center group-hover:bg-[#F6AD55] transition-colors">
            <PlusSVG size={22} className="text-[#F6AD55] group-hover:text-white" />
          </div>
          <div>
            <p className="font-semibold text-[#1A202C]">Revenu externe</p>
            <p className="text-sm text-gray-500">Chariow Market, Fiverr…</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
