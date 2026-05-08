import Link from 'next/link';
import { KashLogoSVG } from '@/components/ui/KashLogoSVG';

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard">
          <KashLogoSVG width={120} height={40} />
        </Link>
        <Link href="/dashboard" className="text-sm text-[#00A36C] hover:underline font-medium">
          Retour
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-[#1A202C] mb-2">Mentions Légales</h1>
        <p className="text-gray-500 text-sm mb-10">Conformément aux dispositions légales en vigueur</p>

        <div className="space-y-8 text-[#1A202C]">
          <section>
            <h2 className="text-lg font-bold mb-3">Éditeur du site</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Nom</span>
                <span className="font-semibold">Emmanuel KIKI</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Qualité</span>
                <span className="font-semibold">Développeur indépendant</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Contact</span>
                <span className="font-semibold">dotomikiki@gmail.com</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">WhatsApp</span>
                <span className="font-semibold">+229 01 40 43 55 00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Pays</span>
                <span className="font-semibold">Bénin</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">Hébergement</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Hébergeur frontend</span>
                <span className="font-semibold">Vercel Inc.</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Base de données</span>
                <span className="font-semibold">Supabase (AWS)</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">Propriété intellectuelle</h2>
            <p className="text-gray-600 leading-relaxed">
              L'ensemble du contenu de la plateforme KASH (design, code, marque, logo) est la propriété exclusive
              d'Emmanuel KIKI. Toute reproduction, même partielle, est interdite sans autorisation préalable écrite.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              KASH utilise des cookies fonctionnels essentiels au bon fonctionnement de l'application (authentification,
              session). Aucun cookie publicitaire ou de tracking tiers n'est utilisé.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">Droit applicable</h2>
            <p className="text-gray-600 leading-relaxed">
              Les présentes mentions légales sont régies par le droit béninois. Tout litige sera soumis à la
              compétence des tribunaux compétents de Cotonou, Bénin.
            </p>
          </section>
        </div>
      </main>

      <footer className="text-center py-8 text-xs text-gray-400 border-t border-gray-100 mt-8">
        Développé par Emmanuel KIKI &copy; {new Date().getFullYear()} – KASH
      </footer>
    </div>
  );
}
