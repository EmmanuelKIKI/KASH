'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/infrastructure/supabase/client';
import Link from 'next/link';

interface Props {
  params: { id: string };
}

export default function EditProjectPage({ params }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    client_name: '',
    description: '',
    amount: '',
    status: 'en_cours',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('id', params.id)
        .single();
      if (data) {
        setForm({
          title: data.title,
          client_name: data.client_name ?? '',
          description: data.description ?? '',
          amount: String(data.amount),
          status: data.status,
          start_date: data.start_date ?? '',
          end_date: data.end_date ?? '',
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
    const { error: err } = await supabase
      .from('projects')
      .update({
        title: form.title,
        client_name: form.client_name || null,
        description: form.description || null,
        amount: parseFloat(form.amount) || 0,
        status: form.status,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
      })
      .eq('id', params.id);

    if (err) {
      setError('Erreur lors de la mise à jour.');
      setSaving(false);
      return;
    }
    router.push(`/dashboard/projects/${params.id}`);
  }

  if (loading) return <div className="text-center py-16 text-gray-400">Chargement...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href={`/dashboard/projects/${params.id}`} className="text-sm text-gray-500 hover:text-[#00A36C] transition-colors mb-2 inline-block">
          ← Retour au projet
        </Link>
        <h1 className="text-2xl font-bold text-[#1A202C]">Modifier le projet</h1>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#1A202C] mb-2">Titre *</label>
            <input value={form.title} onChange={(e) => set('title', e.target.value)} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A202C] mb-2">Client</label>
            <input value={form.client_name} onChange={(e) => set('client_name', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A202C] mb-2">Montant (F CFA) *</label>
            <input type="number" min="0" step="100" value={form.amount} onChange={(e) => set('amount', e.target.value)} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A202C] mb-2">Statut</label>
            <select value={form.status} onChange={(e) => set('status', e.target.value)} className="input-field">
              <option value="en_cours">En cours</option>
              <option value="en_attente">En attente</option>
              <option value="termine">Terminé</option>
              <option value="annule">Annulé</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A202C] mb-2">Date de début</label>
              <input type="date" value={form.start_date} onChange={(e) => set('start_date', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A202C] mb-2">Date de fin</label>
              <input type="date" value={form.end_date} onChange={(e) => set('end_date', e.target.value)} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A202C] mb-2">Description</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} className="input-field resize-none" />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <Link href={`/dashboard/projects/${params.id}`} className="btn-secondary">Annuler</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
