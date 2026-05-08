'use client';

import { useState } from 'react';
import { createClient } from '@/infrastructure/supabase/client';
import { DownloadSVG } from '@/components/ui/Icons';

export default function ExportPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [period, setPeriod] = useState('current_month');
  const [type, setType] = useState('all');

  async function handleExport(format: 'csv' | 'excel') {
    setLoading(format);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const now = new Date();
    let fromDate: string;

    if (period === 'current_month') {
      fromDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    } else if (period === 'current_year') {
      fromDate = new Date(now.getFullYear(), 0, 1).toISOString();
    } else {
      fromDate = new Date(now.getFullYear() - 1, 0, 1).toISOString();
    }

    const rows: { Type: string; Source: string; Montant: number; Date: string; Statut?: string }[] = [];

    if (type === 'all' || type === 'projects') {
      const { data: projects } = await supabase
        .from('projects')
        .select('title, amount, status, created_at')
        .eq('user_id', user!.id)
        .gte('created_at', fromDate);
      (projects ?? []).forEach((p) =>
        rows.push({ Type: 'Projet', Source: p.title, Montant: Number(p.amount), Date: p.created_at.split('T')[0], Statut: p.status })
      );
    }

    if (type === 'all' || type === 'invoices') {
      const { data: invoices } = await supabase
        .from('invoices')
        .select('client_name, amount, status, created_at')
        .eq('user_id', user!.id)
        .gte('created_at', fromDate);
      (invoices ?? []).forEach((i) =>
        rows.push({ Type: 'Facture', Source: i.client_name, Montant: Number(i.amount), Date: i.created_at.split('T')[0], Statut: i.status })
      );
    }

    if (type === 'all' || type === 'external') {
      const { data: ext } = await supabase
        .from('external_incomes')
        .select('source, amount, received_at')
        .eq('user_id', user!.id)
        .gte('received_at', fromDate);
      (ext ?? []).forEach((e) =>
        rows.push({ Type: 'Revenu externe', Source: e.source, Montant: Number(e.amount), Date: e.received_at })
      );
    }

    if (format === 'csv') {
      const headers = ['Type', 'Source', 'Montant (FCFA)', 'Date', 'Statut'];
      const csvContent = [
        headers.join(';'),
        ...rows.map((r) => [r.Type, r.Source, r.Montant, r.Date, r.Statut ?? ''].join(';')),
      ].join('\n');

      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `KASH_Export_${period}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const { utils, writeFile } = await import('xlsx');
      const ws = utils.json_to_sheet(rows);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, 'KASH Export');
      writeFile(wb, `KASH_Export_${period}.xlsx`);
    }

    setLoading(null);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A202C]">Exportation</h1>
        <p className="text-gray-500 text-sm mt-1">Téléchargez vos données en CSV ou Excel</p>
      </div>

      <div className="card space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#1A202C] mb-2">Période</label>
          <select value={period} onChange={(e) => setPeriod(e.target.value)} className="input-field">
            <option value="current_month">Mois en cours</option>
            <option value="current_year">Année en cours</option>
            <option value="last_year">Année précédente</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1A202C] mb-2">Type de données</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="input-field">
            <option value="all">Tout (projets + factures + revenus)</option>
            <option value="projects">Projets uniquement</option>
            <option value="invoices">Factures uniquement</option>
            <option value="external">Revenus externes uniquement</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <button
            onClick={() => handleExport('csv')}
            disabled={loading !== null}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <DownloadSVG size={18} />
            {loading === 'csv' ? 'Export...' : 'Exporter CSV'}
          </button>
          <button
            onClick={() => handleExport('excel')}
            disabled={loading !== null}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <DownloadSVG size={18} />
            {loading === 'excel' ? 'Export...' : 'Exporter Excel'}
          </button>
        </div>
      </div>
    </div>
  );
}
