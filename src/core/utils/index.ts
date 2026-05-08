// ============================================================
// KASH – Utilitaires
// ============================================================

export function formatCurrency(amount: number, currency = 'XOF'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString));
}

export function formatDateShort(dateString: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString));
}

export function generateInvoiceNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `KASH-${year}${month}-${random}`;
}

export function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    en_cours: 'bg-blue-100 text-blue-800',
    termine: 'bg-green-100 text-green-800',
    annule: 'bg-red-100 text-red-800',
    en_attente: 'bg-yellow-100 text-yellow-800',
    a_faire: 'bg-gray-100 text-gray-700',
    brouillon: 'bg-gray-100 text-gray-700',
    envoyee: 'bg-blue-100 text-blue-800',
    payee: 'bg-green-100 text-green-800',
    annulee: 'bg-red-100 text-red-800',
  };
  return colors[status] ?? 'bg-gray-100 text-gray-700';
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '…';
}

export function getMonthName(monthIndex: number): string {
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
  ];
  return months[monthIndex] ?? '';
}

export function getCurrentMonthYear(): string {
  const now = new Date();
  return `${getMonthName(now.getMonth())} ${now.getFullYear()}`;
}
