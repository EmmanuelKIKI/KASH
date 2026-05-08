// ============================================================
// KASH – Constantes globales
// ============================================================

export const KASH_CONFIG = {
  APP_NAME: 'KASH',
  TAGLINE: 'Gérer. Encaisser. Grandir.',
  DEVELOPER: 'Emmanuel KIKI',
  ADMIN_EMAIL: 'dotomikiki@gmail.com',
  WHATSAPP_NUMBER: '2290140435500',
  WHATSAPP_URL: 'https://wa.me/2290140435500',
  CURRENCY: 'XOF' as const,
  CURRENCY_SYMBOL: 'F CFA',
};

export const GREETINGS = {
  getGreeting: (name: string): string => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return `Bonjour, ${name}`;
    if (hour >= 12 && hour < 14) return `Bon après-midi, ${name}`;
    if (hour >= 14 && hour < 18) return `Bonne journée, ${name}`;
    if (hour >= 18 && hour < 21) return `Bonsoir, ${name}`;
    if (hour >= 21 && hour < 23) return `Il se fait tard, ${name}`;
    return `Bonne nuit, ${name}`;
  },
  getMotivation: (): string => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Nouvelle journée, nouvelles opportunités.';
    if (hour >= 12 && hour < 14) return 'Continuez sur votre lancée.';
    if (hour >= 14 && hour < 18) return 'L\'après-midi est encore productive.';
    if (hour >= 18 && hour < 21) return 'Faites le point sur votre journée.';
    return 'Reposez-vous, demain sera meilleur.';
  },
};

export const PROJECT_STATUS_LABELS: Record<string, string> = {
  en_cours: 'En cours',
  termine: 'Terminé',
  annule: 'Annulé',
  en_attente: 'En attente',
};

export const TASK_STATUS_LABELS: Record<string, string> = {
  a_faire: 'À faire',
  en_cours: 'En cours',
  termine: 'Terminé',
};

export const INVOICE_STATUS_LABELS: Record<string, string> = {
  brouillon: 'Brouillon',
  envoyee: 'Envoyée',
  payee: 'Payée',
  annulee: 'Annulée',
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  mobile_money: 'Mobile Money',
  virement: 'Virement bancaire',
  especes: 'Espèces',
  autre: 'Autre',
};

export const INCOME_SOURCES = [
  'Chariow Market',
  'Fiverr',
  'Upwork',
  'Malt',
  'LinkedIn',
  'Direct client',
  'Autre',
];

export const NAV_ITEMS = [
  { label: 'Tableau de bord', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Projets', href: '/dashboard/projects', icon: 'Briefcase' },
  { label: 'Factures', href: '/dashboard/invoices', icon: 'FileText' },
  { label: 'Revenus externes', href: '/dashboard/external-incomes', icon: 'PlusCircle' },
  { label: 'Preuves de paiement', href: '/dashboard/payment-proofs', icon: 'Upload' },
  { label: 'Exportation', href: '/dashboard/export', icon: 'Download' },
  { label: 'Profil', href: '/dashboard/profile', icon: 'User' },
];

export const ADMIN_NAV_ITEMS = [
  { label: 'Vue globale', href: '/admin/mano', icon: 'BarChart2' },
  { label: 'Utilisateurs', href: '/admin/mano/users', icon: 'Users' },
  { label: 'Transactions', href: '/admin/mano/transactions', icon: 'TrendingUp' },
];
