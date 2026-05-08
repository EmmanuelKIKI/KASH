import Link from 'next/link';
import { KashLogoSVG } from '@/components/ui/KashLogoSVG';

export default function CGUPage() {
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
        <h1 className="text-3xl font-bold text-[#1A202C] mb-2">Conditions Générales d'Utilisation</h1>
        <p className="text-gray-500 text-sm mb-10">Dernière mise à jour : janvier 2025</p>

        <div className="space-y-8 text-[#1A202C]">
          <section>
            <h2 className="text-lg font-bold mb-3">1. Présentation de KASH</h2>
            <p className="text-gray-600 leading-relaxed">
              KASH est une plateforme de gestion financière destinée aux freelances, développée et éditée par Emmanuel KIKI.
              Elle permet la gestion des projets, la création de factures et le suivi des revenus.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">2. Accès au service</h2>
            <p className="text-gray-600 leading-relaxed">
              L'accès à KASH nécessite la création d'un compte avec une adresse email valide et un mot de passe sécurisé.
              L'utilisateur est responsable de la confidentialité de ses identifiants de connexion.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">3. Utilisation du service</h2>
            <p className="text-gray-600 leading-relaxed">
              L'utilisateur s'engage à utiliser KASH conformément aux lois en vigueur et à ne pas tenter de compromettre
              la sécurité de la plateforme. Toute utilisation frauduleuse entraînera la suspension immédiate du compte.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">4. Données personnelles</h2>
            <p className="text-gray-600 leading-relaxed">
              Les données collectées (nom, email, informations financières) sont utilisées uniquement dans le cadre
              du service KASH. Elles ne sont pas revendues à des tiers. Consultez notre{' '}
              <Link href="/legal/confidentialite" className="text-[#00A36C] hover:underline">
                politique de confidentialité
              </Link>{' '}
              pour plus de détails.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">5. Responsabilité</h2>
            <p className="text-gray-600 leading-relaxed">
              Emmanuel KIKI ne saurait être tenu responsable de toute perte financière résultant d'une utilisation
              incorrecte de la plateforme. L'utilisateur est seul responsable de l'exactitude des données saisies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">6. Modification des CGU</h2>
            <p className="text-gray-600 leading-relaxed">
              Les présentes CGU peuvent être modifiées à tout moment. L'utilisateur sera notifié de toute modification
              significative par email ou via la plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">7. Contact</h2>
            <p className="text-gray-600 leading-relaxed">
              Pour toute question relative aux présentes CGU, contactez Emmanuel KIKI via WhatsApp au +229 01 40 43 55 00.
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
