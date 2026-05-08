# KASH – Gérer. Encaisser. Grandir.

Plateforme de gestion financière pour freelances.  
**Développé par Emmanuel KIKI**

---

## Stack technique

- **Framework** : Next.js 14+ (App Router) + TypeScript
- **Backend / DB** : Supabase (Auth, PostgreSQL, Storage)
- **Styling** : Tailwind CSS
- **Icônes** : SVG inline (aucun émoji dans l'interface)
- **Export** : XLSX + CSV natif

---

## Installation

### 1. Cloner et installer les dépendances

```bash
npm install
```

### 2. Configurer les variables d'environnement

Copier `.env.local.example` en `.env.local` et remplir :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_ADMIN_EMAIL=dotomikiki@gmail.com
NEXT_PUBLIC_WHATSAPP_NUMBER=2290140435500
```

### 3. Configurer Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Aller dans **SQL Editor**
3. Copier-coller et exécuter le contenu du fichier `supabase_schema.sql`
4. Vérifier que les buckets `avatars` et `payment-proofs` sont créés dans **Storage**

### 4. Lancer en développement

```bash
npm run dev
```

### 5. Build production

```bash
npm run build
npm start
```

---

## Architecture des dossiers

```
src/
├── app/
│   ├── auth/
│   │   ├── login/          # Page de connexion
│   │   └── register/       # Page d'inscription
│   ├── dashboard/
│   │   ├── page.tsx        # Tableau de bord principal
│   │   ├── projects/       # Gestion des projets (CRUD)
│   │   ├── invoices/       # Gestion des factures (CRUD)
│   │   ├── external-incomes/ # Revenus externes
│   │   ├── payment-proofs/ # Upload preuves de paiement
│   │   ├── export/         # Export CSV / Excel
│   │   └── profile/        # Profil utilisateur
│   ├── admin/
│   │   └── mano/           # Dashboard admin (Emmanuel KIKI)
│   │       ├── page.tsx    # Vue globale stats
│   │       ├── users/      # Gestion utilisateurs
│   │       └── transactions/ # Vue transactions globale
│   ├── legal/
│   │   ├── cgu/            # CGU
│   │   ├── mentions/       # Mentions légales
│   │   └── confidentialite/ # Politique de confidentialité
│   ├── not-found.tsx       # Page 404 personnalisée
│   └── layout.tsx          # Layout racine (PWA, fonts)
├── components/
│   ├── ui/                 # Composants de base (Icons, Logo, WhatsApp)
│   ├── dashboard/          # Composants dashboard (Sidebar, MobileHeader)
│   ├── admin/              # Composants admin
│   └── legal/              # Bandeau cookies
├── core/
│   ├── types/              # Types TypeScript centraux
│   ├── constants/          # Constantes (salutations, labels, nav)
│   └── utils/              # Utilitaires (formatCurrency, formatDate...)
└── infrastructure/
    ├── supabase/            # Clients Supabase (browser, server, middleware)
    └── services/            # Services externes
```

---

## Accès Admin

URL : `/admin/mano`  
Email admin : `dotomikiki@gmail.com`  
Le rôle admin est attribué automatiquement à cet email lors de l'inscription via le trigger SQL.

---

## Fonctionnalités

| Fonctionnalité | Statut |
|---|---|
| Connexion / Inscription | ✅ |
| Salutations dynamiques par heure | ✅ |
| Photo de profil (upload Supabase) | ✅ |
| Gestion projets (CRUD complet) | ✅ |
| Gestion tâches par projet | ✅ |
| Gestion factures (CRUD + marquer payée) | ✅ |
| Revenus externes (Chariow Market, etc.) | ✅ |
| Upload preuves de paiement | ✅ |
| Export CSV / Excel | ✅ |
| Dashboard admin (stats, users, transactions) | ✅ |
| Suspension / activation comptes | ✅ |
| Pages légales (CGU, Mentions, Confidentialité) | ✅ |
| Bandeau cookies | ✅ |
| Bouton WhatsApp flottant | ✅ |
| Page 404 personnalisée | ✅ |
| PWA (manifest + themeColor) | ✅ |
| Middleware auth + protection admin | ✅ |
| Row Level Security Supabase | ✅ |

---

## Déploiement sur Vercel

1. Pousser le code sur GitHub
2. Connecter le repo sur [vercel.com](https://vercel.com)
3. Ajouter les variables d'environnement dans les settings Vercel
4. Déployer

---

## Support

WhatsApp : **+229 01 40 43 55 00**  
Email : dotomikiki@gmail.com

---

*Développé avec soin par **Emmanuel KIKI** – KASH © 2025*
