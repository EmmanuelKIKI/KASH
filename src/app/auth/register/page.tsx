'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/infrastructure/supabase/client';
import { EyeOpenSVG, EyeClosedSVG, LockSVG, MailSVG, UserSVG } from '@/components/ui/Icons';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (authError) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="card shadow-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A202C]">Créer un compte</h1>
        <p className="text-gray-500 mt-1 text-sm">Rejoignez KASH et maîtrisez vos finances</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-[#1A202C] mb-2">
            Nom complet
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <UserSVG />
            </span>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Emmanuel KIKI"
              required
              className="input-field pl-10"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#1A202C] mb-2">
            Adresse email
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <MailSVG />
            </span>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              className="input-field pl-10"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#1A202C] mb-2">
            Mot de passe
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <LockSVG />
            </span>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8 caractères minimum"
              required
              className="input-field pl-10 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00A36C] transition-colors"
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              {showPassword ? <EyeClosedSVG /> : <EyeOpenSVG />}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Création en cours...' : 'Créer mon compte'}
        </button>
      </form>

      <p className="mt-4 text-xs text-gray-400 text-center">
        En créant un compte, vous acceptez nos{' '}
        <Link href="/legal/cgu" className="text-[#00A36C] hover:underline">CGU</Link>{' '}
        et notre{' '}
        <Link href="/legal/confidentialite" className="text-[#00A36C] hover:underline">
          Politique de confidentialité
        </Link>.
      </p>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Déjà un compte ?{' '}
          <Link href="/auth/login" className="text-[#00A36C] font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
