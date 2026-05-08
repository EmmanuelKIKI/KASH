import { createClient } from '@/infrastructure/supabase/server';
import Link from 'next/link';
import { formatCurrency, formatDateShort } from '@/core/utils';
import { PlusSVG, TrendUpSVG } from '@/components/ui/Icons';

export default async function ExternalIncomesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: incomes } = await supabase
    .from('external_incomes')
    .select('*')
    .eq('user_id', user!.id)
    .order('received_at', { ascending: false });

  const total = (incomes ?? []).reduce((s, i) => s + Number(i.amount), 0);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A202C]">Revenus externes</h1>
          <p className="text-gray-500 text-sm mt-1">Chariow Market, Fiverr, Upwork et autres</p>
        </div>
        <Link href="/dashboard/external-incomes/new" className="btn-primary flex items-center gap-2">
          <PlusSVG size={18} />
          Ajouter
        </Link>
      </div>

      <div className="stat-card mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#F6AD55]/10 rounded-xl flex items-center justify-center">
            <TrendUpSVG size={20} color="#F6AD55" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total revenus externes</p>
            <p className="text-2xl font-bold text-[#1A202C]">{formatCurrency(total)}</p>
          </div>
        </div>
      </div>

      {!incomes || incomes.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-16 h-16 bg-[#F6AD55]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <PlusSVG size={28} color="#F6AD55" />
          </div>
          <p className="font-semibold text-[#1A202C] text-lg mb-2">Aucun revenu externe</p>
          <p className="text-gray-500 text-sm mb-6">Ajoutez vos revenus provenant d'autres plateformes.</p>
          <Link href="/dashboard/external-incomes/new" className="btn-primary inline-flex items-center gap-2">
            <PlusSVG size={16} />
            Ajouter un revenu
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {incomes.map((income) => (
            <div key={income.id} className="card flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-[#1A202C]">{income.source}</p>
                {income.description && (
                  <p className="text-sm text-gray-500 mt-0.5">{income.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">Reçu le {formatDateShort(income.received_at)}</p>
              </div>
              <p className="font-bold text-[#F6AD55] text-lg flex-shrink-0">
                +{formatCurrency(income.amount)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
