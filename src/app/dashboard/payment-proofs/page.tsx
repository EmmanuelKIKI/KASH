'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/infrastructure/supabase/client';
import { UploadSVG, CheckSVG } from '@/components/ui/Icons';
import { PAYMENT_METHOD_LABELS } from '@/core/constants';
import { formatDate } from '@/core/utils';
import type { PaymentProof } from '@/core/types';
import Link from 'next/link';

export default function PaymentProofsPage() {
  const [proofs, setProofs] = useState<PaymentProof[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('mobile_money');
  const [notes, setNotes] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProofs();
  }, []);

  async function loadProofs() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from('payment_proofs')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });
    setProofs(data ?? []);
    setLoading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setSuccess(false);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const ext = file.name.split('.').pop();
    const path = `${user!.id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('payment-proofs')
      .upload(path, file);

    if (uploadError) {
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('payment-proofs')
      .getPublicUrl(path);

    await supabase.from('payment_proofs').insert({
      user_id: user!.id,
      file_url: urlData.publicUrl,
      file_name: file.name,
      file_size: file.size,
      payment_method: paymentMethod,
      notes: notes || null,
    });

    setSuccess(true);
    setNotes('');
    setUploading(false);
    await loadProofs();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A202C]">Preuves de paiement</h1>
        <p className="text-gray-500 text-sm mt-1">Uploadez vos screenshots Mobile Money</p>
      </div>

      {/* Upload zone */}
      <div className="card mb-6">
        <h2 className="font-semibold text-[#1A202C] mb-4">Ajouter une preuve</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-[#1A202C] mb-2">Méthode de paiement</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="input-field">
              <option value="mobile_money">Mobile Money</option>
              <option value="virement">Virement bancaire</option>
              <option value="especes">Espèces</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A202C] mb-2">Notes</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ex: MTN Mobile Money" className="input-field" />
          </div>
        </div>

        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-full border-2 border-dashed border-[#00A36C]/30 hover:border-[#00A36C] rounded-xl p-8 flex flex-col items-center gap-3 transition-colors group"
        >
          <div className="w-12 h-12 bg-[#00A36C]/10 group-hover:bg-[#00A36C]/20 rounded-xl flex items-center justify-center transition-colors">
            {uploading ? (
              <div className="w-5 h-5 border-2 border-[#00A36C] border-t-transparent rounded-full animate-spin" />
            ) : success ? (
              <CheckSVG size={22} color="#00A36C" />
            ) : (
              <UploadSVG size={22} color="#00A36C" />
            )}
          </div>
          <div className="text-center">
            <p className="font-medium text-[#1A202C]">
              {uploading ? 'Upload en cours...' : success ? 'Fichier uploadé avec succès' : 'Cliquez pour uploader'}
            </p>
            <p className="text-sm text-gray-500">PNG, JPG, PDF – max 10 Mo</p>
          </div>
        </button>
        <input ref={fileRef} type="file" accept="image/*,application/pdf" onChange={handleUpload} className="hidden" />
      </div>

      {/* Liste */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Chargement...</div>
      ) : proofs.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">Aucune preuve de paiement enregistrée.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {proofs.map((proof) => (
            <div key={proof.id} className="card flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-[#1A202C] truncate max-w-xs">{proof.file_name}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {PAYMENT_METHOD_LABELS[proof.payment_method]} · {formatDate(proof.created_at)}
                </p>
                {proof.notes && <p className="text-xs text-gray-400 mt-0.5">{proof.notes}</p>}
              </div>
              <a
                href={proof.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm py-2 px-4 flex-shrink-0"
              >
                Voir
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
