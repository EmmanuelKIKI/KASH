'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/infrastructure/supabase/client';
import Link from 'next/link';

interface Props {
  params: { id: string };
}

export default function EditInvoicePage({ params }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    amount: '',
    status: 'brouillon',
    due_date: '',
    notes: '',
  });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from('invoices').select('*').eq('id', params.id).single();
      if (data) {
        setForm({
          client_name: data.client_name,
          client_email: data.client_email ?? '',
          client_phone: data.client_phone ?? '',
          amount: String(data.amount),
          status: data.status,
          due_date: data.due_date ?? '',
          notes: data.notes ?? '',
        });
      }
      setLoading(false);
    }
    load();
  }, [params.id]);

  const set = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase.from('invoices').update({
      client_name: form.client_name,
      client_email: form.client_email || null,
      client_phone: form.client_phone || null,
      amount: parseFloat(form.amount) || 0,
      status: form.status,
      due_date: form.due_date || null,
      notes: form.notes || null,
    }).eq('id', params.id);

    if (err) {
      setError('Erreur lors de la mise à jour.');
      setSaving(false);
      return;
    }
    router.push(`/dashboard/invoices/${params.id}`);
  }

  if (loading) return <div className="text-center py-16 text-gray-400">Chargement...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href={`/dashboard/invoices/${params.id}`} className="text-sm text-gray-500 hover:text-[#00A36C] transition-colors mb-2 inline-block">
          ← Retour à la facture
        </Link>
        <h1 className="text-2xl font-bold text-[#1A202C]">Modifier la facture</h1>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#1A202C] mb-2">Nom du client *</label>
            <input value={form.client_name} onChange={(e) => set('client_name', e.target.value)} required className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A202C] mb-2">Email client</label>
              <input type="email" value={form.client_email} onChange={(e) => set('client_email', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A202C] mb-2">Téléphone</label>
              <input value={form.client_phone} onChange={(e) => set('client_phone', e.target.value)} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A202C] mb-2">Montant (F CFA) *</label>
            <input type="number" min="0" step="100" value={form.amount} onChange={(e) => set('amount', e.target.value)} required className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A202C] mb-2">Statut</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)} className="input-field">
                <option value="brouillon">Brouillon</option>
                <option value="envoyee">Envoyée</option>
                <option value="payee">Payée</option>
                <option value="annulee">Annulée</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A202C] mb-2">Échéance</label>
              <input type="date" value={form.due_date} onChange={(e) => set('due_date', e.target.value)} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A202C] mb-2">Notes</label>
            <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={3} className="input-field resize-none" />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <Link href={`/dashboard/invoices/${params.id}`} className="btn-secondary">Annuler</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
