'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/infrastructure/supabase/client';
import { INCOME_SOURCES } from '@/core/constants';
import Link from 'next/link';

export default function NewExternalIncomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    source: '',
    description: '',
    amount: '',
    received_at: new Date().toISOString().split('T')[0],
  });

  const set = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { error: err } = await supabase.from('external_incomes').insert({
      user_id: user!.id,
      source: form.source,
      description: form.description || null,
      amount: parseFloat(form.amount) || 0,
      received_at: form.received_at,
      currency: 'XOF',
    });

    if (err) {
      setError('Erreur lors de l\'ajout du revenu.');
      setLoading(false);
      return;
    }

    router.push('/dashboard/external-incomes');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href="/dashboard/external-incomes" className="text-sm text-gray-500 hover:text-[#00A36C] transition-colors mb-2 inline-block">
          ← Retour aux revenus externes
        </Link>
        <h1 className="text-2xl font-bold text-[#1A202C]">Ajouter un revenu externe</h1>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#1A202C] mb-2">Source *</label>
            <select value={form.source} onChange={(e) => set('source', e.target.value)} required className="input-field">
              <option value="">Sélectionnez une source</option>
              {INCOME_SOURCES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A202C] mb-2">Montant (F CFA) *</label>
            <input type="number" min="0" step="100" value={form.amount} onChange={(e) => set('amount', e.target.value)} required placeholder="25000" className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A202C] mb-2">Date de réception *</label>
            <input type="date" value={form.received_at} onChange={(e) => set('received_at', e.target.value)} required className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A202C] mb-2">Description</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} placeholder="Détails du paiement..." className="input-field resize-none" />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Ajout...' : 'Ajouter le revenu'}
            </button>
            <Link href="/dashboard/external-incomes" className="btn-secondary">Annuler</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
