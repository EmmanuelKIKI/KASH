import Link from 'next/link';
import { KashLogoSVG } from '@/components/ui/KashLogoSVG';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7FAFC] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-8">
          <KashLogoSVG width={160} height={54} />
        </div>

        {/* 404 SVG illustration */}
        <svg
          width="200"
          height="120"
          viewBox="0 0 200 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto mb-8"
        >
          <text x="0" y="90" fontSize="90" fontWeight="900" fontFamily="Georgia, serif" fill="#1A202C" opacity="0.08">404</text>
          <circle cx="100" cy="60" r="40" fill="#00A36C" opacity="0.08"/>
          <path d="M80 60 L100 40 L120 60 L100 80 Z" fill="#00A36C" opacity="0.3"/>
          <circle cx="100" cy="60" r="16" fill="#00A36C" opacity="0.6"/>
          <text x="92" y="66" fontSize="16" fontWeight="bold" fontFamily="sans-serif" fill="white">?</text>
        </svg>

        <h1 className="text-3xl font-bold text-[#1A202C] mb-3">Page introuvable</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Cette page n'existe pas ou a été déplacée.<br />
          Retournez sur votre tableau de bord KASH.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard" className="btn-primary">
            Tableau de bord
          </Link>
          <Link href="/auth/login" className="btn-secondary">
            Se connecter
          </Link>
        </div>

        <p className="mt-10 text-xs text-gray-400">
          Développé par Emmanuel KIKI &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
