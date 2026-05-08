'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/infrastructure/supabase/client';
import Link from 'next/link';

interface Props {
  params: { id: string };
}

export default function NewTaskPage({ params }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'a_faire',
    due_date: '',
  });

  const set = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { error: err } = await supabase.from('tasks').insert({
      project_id: params.id,
      user_id: user!.id,
      title: form.title,
      description: form.description || null,
      status: form.status,
      due_date: form.due_date || null,
    });

    if (err) {
      setError('Erreur lors de la création de la tâche.');
      setLoading(false);
      return;
    }
    router.push(`/dashboard/projects/${params.id}`);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href={`/dashboard/projects/${params.id}`} className="text-sm text-gray-500 hover:text-[#00A36C] transition-colors mb-2 inline-block">
          ← Retour au projet
        </Link>
        <h1 className="text-2xl font-bold text-[#1A202C]">Nouvelle tâche</h1>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#1A202C] mb-2">Titre de la tâche *</label>
            <input value={form.title} onChange={(e) => set('title', e.target.value)} required placeholder="Ex: Maquette UI" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A202C] mb-2">Statut</label>
            <select value={form.status} onChange={(e) => set('status', e.target.value)} className="input-field">
              <option value="a_faire">À faire</option>
              <option value="en_cours">En cours</option>
              <option value="termine">Terminé</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A202C] mb-2">Date d'échéance</label>
            <input type="date" value={form.due_date} onChange={(e) => set('due_date', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A202C] mb-2">Description</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} className="input-field resize-none" placeholder="Détails de la tâche..." />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Création...' : 'Créer la tâche'}
            </button>
            <Link href={`/dashboard/projects/${params.id}`} className="btn-secondary">Annuler</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
