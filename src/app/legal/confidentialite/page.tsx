import Link from 'next/link';
import { KashLogoSVG } from '@/components/ui/KashLogoSVG';

export default function ConfidentialitePage() {
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
        <h1 className="text-3xl font-bold text-[#1A202C] mb-2">Politique de Confidentialité</h1>
        <p className="text-gray-500 text-sm mb-10">Dernière mise à jour : janvier 2025</p>

        <div className="space-y-8 text-[#1A202C]">
          <section>
            <h2 className="text-lg font-bold mb-3">1. Données collectées</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Dans le cadre de l'utilisation de KASH, nous collectons les données suivantes :
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A36C] mt-2 flex-shrink-0" />
                Nom complet et adresse email (à l'inscription)
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A36C] mt-2 flex-shrink-0" />
                Numéro de téléphone (optionnel)
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A36C] mt-2 flex-shrink-0" />
                Données financières (projets, factures, revenus) saisies par l'utilisateur
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A36C] mt-2 flex-shrink-0" />
                Photo de profil et preuves de paiement (fichiers uploadés)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">2. Utilisation des données</h2>
            <p className="text-gray-600 leading-relaxed">
              Les données collectées sont utilisées exclusivement pour le fonctionnement de la plateforme KASH :
              authentification, affichage du tableau de bord, génération de rapports et exportations. Aucune donnée
              n'est partagée avec des tiers ou utilisée à des fins commerciales.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">3. Stockage et sécurité</h2>
            <p className="text-gray-600 leading-relaxed">
              Les données sont stockées de manière sécurisée sur Supabase (infrastructure AWS). Les mots de passe
              sont chiffrés. Les accès aux données sont contrôlés par des politiques de sécurité strictes
              (Row Level Security) garantissant que chaque utilisateur n'accède qu'à ses propres données.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">4. Droits de l'utilisateur</h2>
            <p className="text-gray-600 leading-relaxed">
              Conformément aux lois applicables, vous disposez d'un droit d'accès, de rectification et de suppression
              de vos données. Pour exercer ces droits, contactez Emmanuel KIKI à l'adresse dotomikiki@gmail.com ou
              via WhatsApp au +229 01 40 43 55 00.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">5. Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              KASH utilise uniquement des cookies de session nécessaires à l'authentification. Ils sont supprimés
              automatiquement à la déconnexion. Aucun cookie publicitaire ou de tracking n'est déposé.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">6. Contact</h2>
            <p className="text-gray-600 leading-relaxed">
              Pour toute question relative à cette politique de confidentialité :<br />
              <strong>Emmanuel KIKI</strong> – dotomikiki@gmail.com – WhatsApp +229 01 40 43 55 00
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
