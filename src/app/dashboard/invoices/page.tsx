import { createClient } from '@/infrastructure/supabase/server';
import Link from 'next/link';
import { formatCurrency, formatDateShort, getStatusColor } from '@/core/utils';
import { INVOICE_STATUS_LABELS } from '@/core/constants';
import { InvoiceSVG, PlusSVG } from '@/components/ui/Icons';

export default async function InvoicesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false });

  const total = (invoices ?? []).reduce((s, i) => s + Number(i.amount), 0);
  const paid = (invoices ?? []).filter((i) => i.status === 'payee').reduce((s, i) => s + Number(i.amount), 0);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A202C]">Factures</h1>
          <p className="text-gray-500 text-sm mt-1">{invoices?.length ?? 0} facture(s)</p>
        </div>
        <Link href="/dashboard/invoices/new" className="btn-primary flex items-center gap-2">
          <PlusSVG size={18} />
          Nouvelle facture
        </Link>
      </div>

      {/* Résumé */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="stat-card">
          <p className="text-sm text-gray-500 mb-1">Total facturé</p>
          <p className="text-xl font-bold text-[#1A202C]">{formatCurrency(total)}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500 mb-1">Total encaissé</p>
          <p className="text-xl font-bold text-[#00A36C]">{formatCurrency(paid)}</p>
        </div>
      </div>

      {!invoices || invoices.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <InvoiceSVG size={28} color="#3B82F6" />
          </div>
          <p className="font-semibold text-[#1A202C] text-lg mb-2">Aucune facture</p>
          <p className="text-gray-500 text-sm mb-6">Créez votre première facture et encaissez.</p>
          <Link href="/dashboard/invoices/new" className="btn-primary inline-flex items-center gap-2">
            <PlusSVG size={16} />
            Créer une facture
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <Link
              key={invoice.id}
              href={`/dashboard/invoices/${invoice.id}`}
              className="card-hover flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-mono text-sm text-gray-400">{invoice.invoice_number}</p>
                  <span className={`badge ${getStatusColor(invoice.status)}`}>
                    {INVOICE_STATUS_LABELS[invoice.status]}
                  </span>
                </div>
                <p className="font-semibold text-[#1A202C] truncate">{invoice.client_name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Créée le {formatDateShort(invoice.created_at)}
                  {invoice.due_date && ` · Échéance ${formatDateShort(invoice.due_date)}`}
                </p>
              </div>
              <p className="font-bold text-[#1A202C] text-lg flex-shrink-0">
                {formatCurrency(invoice.amount)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
