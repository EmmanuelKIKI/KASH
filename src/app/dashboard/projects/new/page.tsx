'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/infrastructure/supabase/client';
import Link from 'next/link';

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  const set = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { error: err } = await supabase.from('projects').insert({
      user_id: user!.id,
      title: form.title,
      client_name: form.client_name || null,
      description: form.description || null,
      amount: parseFloat(form.amount) || 0,
      status: form.status,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      currency: 'XOF',
    });

    if (err) {
      setError('Erreur lors de la création du projet.');
      setLoading(false);
      return;
    }

    router.push('/dashboard/projects');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href="/dashboard/projects" className="text-sm text-gray-500 hover:text-[#00A36C] transition-colors mb-2 inline-block">
          ← Retour aux projets
        </Link>
        <h1 className="text-2xl font-bold text-[#1A202C]">Nouveau projet</h1>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#1A202C] mb-2">Titre du projet *</label>
            <input value={form.title} onChange={(e) => set('title', e.target.value)} required placeholder="Ex: Site e-commerce Boutique ABC" className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A202C] mb-2">Nom du client</label>
            <input value={form.client_name} onChange={(e) => set('client_name', e.target.value)} placeholder="Ex: Jean Dupont" className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A202C] mb-2">Montant (F CFA) *</label>
            <input type="number" min="0" step="100" value={form.amount} onChange={(e) => set('amount', e.target.value)} required placeholder="150000" className="input-field" />
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
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} placeholder="Décrivez le projet..." className="input-field resize-none" />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Création...' : 'Créer le projet'}
            </button>
            <Link href="/dashboard/projects" className="btn-secondary">Annuler</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
