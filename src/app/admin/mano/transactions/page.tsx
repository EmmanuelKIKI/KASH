/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/infrastructure/supabase/server';
import { formatCurrency, formatDateShort, getStatusColor } from '@/core/utils';
import { PROJECT_STATUS_LABELS } from '@/core/constants';

function getFullName(profiles: any): string {
  if (!profiles) return '-';
  if (Array.isArray(profiles)) return profiles[0]?.full_name ?? '-';
  return profiles.full_name ?? '-';
}

export default async function AdminTransactionsPage() {
  const supabase = createClient();

  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, amount, status, created_at, profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(100);

  const { data: external } = await supabase
    .from('external_incomes')
    .select('id, source, amount, received_at, profiles(full_name)')
    .order('received_at', { ascending: false })
    .limit(100);

  const typedProjects = (projects ?? []) as any[];
  const typedExternal = (external ?? []) as any[];

  const totalProjects = typedProjects.reduce((s: number, p: any) => s + Number(p.amount), 0);
  const totalExternal = typedExternal.reduce((s: number, e: any) => s + Number(e.amount), 0);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A202C]">Transactions</h1>
        <p className="text-gray-500 text-sm mt-1">Vue consolidee de toute l activite financiere</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="stat-card">
          <p className="text-sm text-gray-500 mb-1">Volume projets</p>
          <p className="text-xl font-bold text-[#1A202C]">{formatCurrency(totalProjects)}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500 mb-1">Volume revenus externes</p>
          <p className="text-xl font-bold text-[#F6AD55]">{formatCurrency(totalExternal)}</p>
        </div>
      </div>

      <div className="card mb-6 overflow-hidden p-0">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-[#1A202C]">Projets</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Projet</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Freelance</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Montant</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Statut</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {typedProjects.map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-3 text-sm font-medium text-[#1A202C]">{p.title}</td>
                  <td className="px-6 py-3 text-sm text-gray-500">{getFullName(p.profiles)}</td>
                  <td className="px-6 py-3 text-sm font-semibold text-[#00A36C]">{formatCurrency(Number(p.amount))}</td>
                  <td className="px-6 py-3">
                    <span className={`badge ${getStatusColor(p.status)}`}>{PROJECT_STATUS_LABELS[p.status]}</span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-400">{formatDateShort(p.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-[#1A202C]">Revenus externes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Source</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Freelance</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Montant</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {typedExternal.map((e: any) => (
                <tr key={e.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-3 text-sm font-medium text-[#1A202C]">{e.source}</td>
                  <td className="px-6 py-3 text-sm text-gray-500">{getFullName(e.profiles)}</td>
                  <td className="px-6 py-3 text-sm font-semibold text-[#F6AD55]">{formatCurrency(Number(e.amount))}</td>
                  <td className="px-6 py-3 text-sm text-gray-400">{formatDateShort(e.received_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
