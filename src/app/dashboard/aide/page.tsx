'use client';

import { useState } from 'react';
import { KASH_CONFIG } from '@/core/constants';
import { WhatsAppSVG, SendSVG, HelpSVG, PhoneSVG, MailSVG } from '@/components/ui/Icons';

const SUBJECTS = [
  'Problème de connexion',
  'Question sur les factures',
  'Problème avec un projet',
  'Question sur les revenus externes',
  'Problème d\'export PDF',
  'Question sur mon profil',
  'Signaler un bug',
  'Autre',
];

export default function AidePage() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  function handleSend() {
    if (!subject || !message.trim()) return;
    const text = encodeURIComponent(`[KASH Support]\nObjet : ${subject}\n\n${message}`);
    const url = `https://wa.me/${KASH_CONFIG.WHATSAPP_NUMBER}?text=${text}`;
    window.open(url, '_blank');
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#25D366]/10 rounded-xl flex items-center justify-center">
            <HelpSVG size={20} color="#25D366" />
          </div>
          <h1 className="text-2xl font-bold text-[#1A202C]">Aide & Support</h1>
        </div>
        <p className="text-gray-500 text-sm">
          Une question ou un problème ? Envoyez-nous un message directement sur WhatsApp.
        </p>
      </div>

      {/* Contact card */}
      <div className="card mb-6 bg-gradient-to-br from-[#00A36C]/5 to-[#25D366]/5 border-[#00A36C]/20">
        <p className="text-sm font-semibold text-[#1A202C] mb-4">Nous contacter directement</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#25D366]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <WhatsAppSVG size={18} color="#25D366" />
            </div>
            <div>
              <p className="text-xs text-gray-500">WhatsApp</p>
              <p className="text-sm font-bold text-[#1A202C]">+229 01 40 43 55 00</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#00A36C]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <MailSVG size={18} color="#00A36C" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-bold text-[#1A202C]">dotomikiki@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <h2 className="font-semibold text-[#1A202C] mb-5">Envoyer un message</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1A202C] mb-2">
              Objet <span className="text-red-400">*</span>
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="input-field"
            >
              <option value="">Choisir un objet...</option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A202C] mb-2">
              Message <span className="text-red-400">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Décrivez votre problème ou votre question en détail..."
              rows={5}
              className="input-field resize-none"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!subject || !message.trim()}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40"
            style={{ background: !subject || !message.trim() ? undefined : '#25D366' }}
          >
            {sent ? (
              <>✓ WhatsApp ouvert avec votre message</>
            ) : (
              <>
                <WhatsAppSVG size={18} />
                <SendSVG size={16} />
                Envoyer sur WhatsApp
              </>
            )}
          </button>

          <p className="text-xs text-gray-400 text-center">
            En cliquant, WhatsApp s'ouvre avec votre message pré-rempli. Appuyez sur Envoyer dans WhatsApp pour le transmettre.
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="card mt-6">
        <h2 className="font-semibold text-[#1A202C] mb-4">Questions fréquentes</h2>
        <div className="space-y-3">
          {[
            {
              q: 'Comment créer une facture PDF ?',
              a: 'Ouvrez une facture depuis "Factures", puis cliquez sur le bouton "Télécharger PDF" en haut à droite.',
            },
            {
              q: 'Comment changer mon mot de passe ?',
              a: 'La gestion du mot de passe se fait via votre email. Utilisez "Mot de passe oublié" sur la page de connexion.',
            },
            {
              q: 'Comment ajouter un revenu non lié à un projet ?',
              a: 'Allez dans "Revenus externes" et cliquez sur "Nouveau revenu". Vous pouvez indiquer la source (Fiverr, virement, etc.).',
            },
          ].map(({ q, a }) => (
            <div key={q} className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm font-semibold text-[#1A202C] mb-1">{q}</p>
              <p className="text-sm text-gray-500">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
