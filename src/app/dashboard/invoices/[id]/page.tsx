import { createClient } from '@/infrastructure/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency, formatDate, getStatusColor } from '@/core/utils';
import { INVOICE_STATUS_LABELS, KASH_CONFIG } from '@/core/constants';
import { InvoiceActions } from '@/components/dashboard/InvoiceActions';
import { InvoicePDFButton } from '@/components/dashboard/InvoicePDFButton';

interface Props {
  params: { id: string };
}

export default async function InvoiceDetailPage({ params }: Props) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: invoice }, { data: profile }] = await Promise.all([
    supabase.from('invoices').select('*').eq('id', params.id).eq('user_id', user!.id).single(),
    supabase.from('profiles').select('full_name, email, phone, avatar_url, role, is_active, currency, created_at, updated_at, id').eq('id', user!.id).single(),
  ]);

  if (!invoice) notFound();

  // Calcul dynamique "en retard"
  const isLate = invoice.status === 'envoyee' && invoice.due_date && new Date(invoice.due_date) < new Date();
  const displayStatus = isLate ? 'En retard' : INVOICE_STATUS_LABELS[invoice.status];
  const displayBadgeClass = isLate ? 'badge bg-red-50 text-red-600' : `badge ${getStatusColor(invoice.status)}`;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/invoices" className="text-sm text-gray-500 hover:text-[#00A36C] transition-colors mb-2 inline-block">
          ← Retour aux factures
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-mono text-gray-400 mb-1">{invoice.invoice_number}</p>
            <h1 className="text-2xl font-bold text-[#1A202C]">{invoice.client_name}</h1>
          </div>
          <span className={displayBadgeClass}>{displayStatus}</span>
        </div>
      </div>

      <div className="card mb-4">
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <p className="text-sm text-gray-500 mb-1">Montant</p>
            <p className="text-3xl font-bold text-[#1A202C]">{formatCurrency(invoice.amount)}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {profile && <InvoicePDFButton invoice={invoice} profile={profile} />}
            <InvoiceActions invoice={invoice} />
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-gray-100">
          {invoice.client_email && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Email client</span>
              <span className="font-medium text-[#1A202C]">{invoice.client_email}</span>
            </div>
          )}
          {invoice.client_phone && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Téléphone client</span>
              <span className="font-medium text-[#1A202C]">{invoice.client_phone}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Créée le</span>
            <span className="font-medium text-[#1A202C]">{formatDate(invoice.created_at)}</span>
          </div>
          {invoice.due_date && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Échéance</span>
              <span className={`font-medium ${isLate ? 'text-red-500' : 'text-[#1A202C]'}`}>
                {formatDate(invoice.due_date)}{isLate ? ' · En retard' : ''}
              </span>
            </div>
          )}
          {invoice.paid_at && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Payée le</span>
              <span className="font-medium text-[#00A36C]">{formatDate(invoice.paid_at)}</span>
            </div>
          )}
        </div>

        {invoice.notes && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Notes</p>
            <p className="text-sm text-[#1A202C] leading-relaxed">{invoice.notes}</p>
          </div>
        )}
      </div>

      <div className="card">
        <p className="text-xs text-gray-400 text-center">
          Facture éditée par {KASH_CONFIG.DEVELOPER} via KASH – Gérer. Encaisser. Grandir.
        </p>
      </div>
    </div>
  );
}
