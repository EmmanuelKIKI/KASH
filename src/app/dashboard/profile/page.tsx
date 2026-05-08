'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/infrastructure/supabase/client';
import { UserSVG, MailSVG, PhoneSVG, UploadSVG, CheckSVG } from '@/components/ui/Icons';
import { getInitials } from '@/core/utils';
import type { Profile } from '@/core/types';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ full_name: '', phone: '' });
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase.from('profiles').select('*').eq('id', user!.id).single();
    if (data) {
      setProfile(data);
      setForm({ full_name: data.full_name, phone: data.phone ?? '' });
    }
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('profiles').update({
      full_name: form.full_name,
      phone: form.phone || null,
    }).eq('id', user!.id);
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    await loadProfile();
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split('.').pop();
    const path = `${profile.id}/avatar.${ext}`;
    await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    await supabase.from('profiles').update({ avatar_url: data.publicUrl + '?t=' + Date.now() }).eq('id', profile.id);
    setUploading(false);
    await loadProfile();
  }

  if (loading) return <div className="text-center py-16 text-gray-400">Chargement...</div>;
  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A202C]">Mon profil</h1>
        <p className="text-gray-500 text-sm mt-1">Gérez vos informations personnelles</p>
      </div>

      {/* Avatar */}
      <div className="card mb-6">
        <div className="flex items-center gap-6">
          <div className="relative flex-shrink-0">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-[#00A36C]"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-[#00A36C] flex items-center justify-center text-white text-2xl font-bold">
                {getInitials(profile.full_name)}
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-[#1A202C] text-lg">{profile.full_name}</p>
            <p className="text-gray-500 text-sm mb-3">{profile.email}</p>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="btn-secondary text-sm py-2 px-4 flex items-center gap-2"
            >
              <UploadSVG size={15} />
              {uploading ? 'Upload...' : 'Changer la photo'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="card">
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#1A202C] mb-2">Nom complet *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <UserSVG size={18} />
              </span>
              <input
                value={form.full_name}
                onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                required
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A202C] mb-2">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <MailSVG size={18} />
              </span>
              <input value={profile.email} disabled className="input-field pl-10 opacity-60 cursor-not-allowed" />
            </div>
            <p className="text-xs text-gray-400 mt-1">L'email ne peut pas être modifié.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A202C] mb-2">Téléphone</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <PhoneSVG size={18} />
              </span>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+229 ..."
                className="input-field pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? 'Enregistrement...' : success ? (
                <><CheckSVG size={16} /> Enregistré</>
              ) : 'Enregistrer'}
            </button>
            {success && (
              <span className="text-sm text-[#00A36C] font-medium">Profil mis à jour.</span>
            )}
          </div>
        </form>
      </div>

      {/* Infos compte */}
      <div className="card mt-4">
        <p className="text-sm font-medium text-[#1A202C] mb-3">Informations du compte</p>
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex justify-between">
            <span>Rôle</span>
            <span className="font-medium text-[#1A202C] capitalize">{profile.role}</span>
          </div>
          <div className="flex justify-between">
            <span>Devise</span>
            <span className="font-medium text-[#1A202C]">FCFA (XOF)</span>
          </div>
          <div className="flex justify-between">
            <span>Statut</span>
            <span className={`font-medium ${profile.is_active ? 'text-[#00A36C]' : 'text-red-500'}`}>
              {profile.is_active ? 'Actif' : 'Suspendu'}
            </span>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-8">
        Développé par Emmanuel KIKI
      </p>
    </div>
  );
}
