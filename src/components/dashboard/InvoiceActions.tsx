'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/infrastructure/supabase/client';
import { EditSVG, TrashSVG, CheckSVG } from '@/components/ui/Icons';
import type { Invoice } from '@/core/types';

export function InvoiceActions({ invoice }: { invoice: Invoice }) {
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  async function markAsPaid() {
    setLoading(true);
    const supabase = createClient();
    await supabase.from('invoices').update({
      status: 'payee',
      paid_at: new Date().toISOString(),
    }).eq('id', invoice.id);
    setLoading(false);
    router.refresh();
  }

  async function handleDelete() {
    setLoading(true);
    const supabase = createClient();
    await supabase.from('invoices').delete().eq('id', invoice.id);
    router.push('/dashboard/invoices');
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {invoice.status !== 'payee' && (
        <button
          onClick={markAsPaid}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#00A36C]/10 text-[#00A36C] hover:bg-[#00A36C]/20 transition-colors"
        >
          <CheckSVG size={14} />
          Marquer payée
        </button>
      )}
      <button
        onClick={() => router.push(`/dashboard/invoices/${invoice.id}/edit`)}
        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
      >
        <EditSVG size={14} />
        Modifier
      </button>
      {!confirmDelete ? (
        <button
          onClick={() => setConfirmDelete(true)}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
        >
          <TrashSVG size={14} />
          Supprimer
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Confirmer ?</span>
          <button onClick={handleDelete} disabled={loading} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-600 text-white">
            {loading ? '...' : 'Oui'}
          </button>
          <button onClick={() => setConfirmDelete(false)} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600">Non</button>
        </div>
      )}
    </div>
  );
}
