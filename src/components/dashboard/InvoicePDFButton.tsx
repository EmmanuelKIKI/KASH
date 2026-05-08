'use client';

import { useState } from 'react';
import type { Invoice } from '@/core/types';
import type { Profile } from '@/core/types';
import { FilePdfSVG } from '@/components/ui/Icons';

interface Props {
  invoice: Invoice;
  profile: Profile;
}

const INVOICE_STATUS_FR: Record<string, string> = {
  brouillon: 'Brouillon',
  envoyee: 'Envoyée',
  payee: 'Payée',
  annulee: 'Annulée',
};

function pad(n: number) { return String(n).padStart(2, '0'); }

function fmtDate(dateStr: string | null) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function fmtAmount(amount: number) {
  return amount.toLocaleString('fr-FR') + ' F CFA';
}

// KASH logo encoded as inline SVG data URI for PDF
const KASH_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 54" width="160" height="54">
  <rect width="160" height="54" fill="none"/>
  <rect x="0" y="0" width="48" height="48" rx="10" fill="#00A36C"/>
  <text x="24" y="36" font-family="Arial Black,sans-serif" font-size="28" font-weight="900" fill="white" text-anchor="middle">K</text>
  <text x="68" y="36" font-family="Arial Black,sans-serif" font-size="30" font-weight="900" fill="#1A202C">KASH</text>
</svg>`;

const LOGO_DATA_URI = `data:image/svg+xml;base64,${btoa(KASH_LOGO_SVG)}`;

function buildPdfHtml(invoice: Invoice, profile: Profile): string {
  const statusColor: Record<string, string> = {
    brouillon: '#6B7280',
    envoyee: '#3B82F6',
    payee: '#00A36C',
    annulee: '#EF4444',
  };
  const statusBg: Record<string, string> = {
    brouillon: '#F3F4F6',
    envoyee: '#EFF6FF',
    payee: '#F0FDF4',
    annulee: '#FEF2F2',
  };
  const color = statusColor[invoice.status] ?? '#6B7280';
  const bg = statusBg[invoice.status] ?? '#F3F4F6';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Inter',Arial,sans-serif; background:#fff; color:#1A202C; padding:0; }
  .page { max-width:794px; margin:0 auto; padding:48px 56px; min-height:1123px; display:flex; flex-direction:column; }
  .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:40px; }
  .logo-area img { height:42px; }
  .invoice-meta { text-align:right; }
  .invoice-meta .invoice-number { font-size:13px; color:#6B7280; font-weight:500; }
  .invoice-meta .invoice-title { font-size:24px; font-weight:800; color:#1A202C; margin:4px 0; }
  .status-badge { display:inline-block; padding:4px 12px; border-radius:20px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; background:${bg}; color:${color}; }
  .divider { border:none; border-top:1px solid #E5E7EB; margin:28px 0; }
  .parties { display:flex; gap:40px; margin-bottom:32px; }
  .party { flex:1; }
  .party-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#9CA3AF; margin-bottom:8px; }
  .party-name { font-size:15px; font-weight:700; color:#1A202C; margin-bottom:4px; }
  .party-info { font-size:12px; color:#6B7280; line-height:1.6; }
  .dates { display:flex; gap:24px; margin-bottom:32px; }
  .date-block { flex:1; background:#F9FAFB; border-radius:12px; padding:14px 16px; }
  .date-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#9CA3AF; margin-bottom:4px; }
  .date-value { font-size:13px; font-weight:600; color:#1A202C; }
  .amount-section { background:linear-gradient(135deg,#00A36C 0%,#007A52 100%); border-radius:16px; padding:28px 32px; margin-bottom:32px; display:flex; justify-content:space-between; align-items:center; }
  .amount-label { font-size:13px; font-weight:600; color:rgba(255,255,255,0.8); margin-bottom:4px; }
  .amount-value { font-size:32px; font-weight:800; color:#fff; letter-spacing:-0.5px; }
  .amount-status { text-align:right; }
  .amount-status .badge { display:inline-block; padding:6px 16px; border-radius:20px; background:rgba(255,255,255,0.2); color:#fff; font-size:12px; font-weight:700; }
  .notes { background:#FFFBEB; border-left:3px solid #F6AD55; border-radius:0 8px 8px 0; padding:14px 16px; margin-bottom:24px; }
  .notes-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#92400E; margin-bottom:6px; }
  .notes-text { font-size:13px; color:#78350F; line-height:1.5; }
  .spacer { flex:1; }
  .footer { border-top:1px solid #E5E7EB; padding-top:20px; display:flex; justify-content:space-between; align-items:center; }
  .footer-left { font-size:11px; color:#9CA3AF; }
  .footer-brand { font-size:12px; font-weight:700; color:#00A36C; }
  .footer-tagline { font-size:10px; color:#9CA3AF; }
  ${invoice.paid_at ? `.paid-stamp { position:absolute; top:140px; right:56px; transform:rotate(-15deg); border:3px solid #00A36C; color:#00A36C; padding:6px 18px; border-radius:6px; font-size:22px; font-weight:900; opacity:.25; text-transform:uppercase; letter-spacing:2px; }` : ''}
</style>
</head>
<body>
<div class="page" style="position:relative">
  ${invoice.paid_at ? `<div class="paid-stamp">PAYÉE</div>` : ''}

  <!-- Header -->
  <div class="header">
    <div class="logo-area">
      <img src="${LOGO_DATA_URI}" alt="KASH" />
      <div style="font-size:10px;color:#9CA3AF;margin-top:6px;font-weight:500">Gérer. Encaisser. Grandir.</div>
    </div>
    <div class="invoice-meta">
      <div class="invoice-number">${invoice.invoice_number}</div>
      <div class="invoice-title">FACTURE</div>
      <span class="status-badge">${INVOICE_STATUS_FR[invoice.status] ?? invoice.status}</span>
    </div>
  </div>

  <hr class="divider"/>

  <!-- Parties -->
  <div class="parties">
    <div class="party">
      <div class="party-label">De</div>
      <div class="party-name">${profile.full_name}</div>
      <div class="party-info">
        ${profile.email}${profile.phone ? `<br/>${profile.phone}` : ''}
      </div>
    </div>
    <div class="party">
      <div class="party-label">Pour</div>
      <div class="party-name">${invoice.client_name}</div>
      <div class="party-info">
        ${invoice.client_email ? invoice.client_email : ''}${invoice.client_phone ? `<br/>${invoice.client_phone}` : ''}
      </div>
    </div>
  </div>

  <!-- Dates -->
  <div class="dates">
    <div class="date-block">
      <div class="date-label">Date d'émission</div>
      <div class="date-value">${fmtDate(invoice.created_at)}</div>
    </div>
    ${invoice.due_date ? `
    <div class="date-block">
      <div class="date-label">Date d'échéance</div>
      <div class="date-value">${fmtDate(invoice.due_date)}</div>
    </div>` : ''}
    ${invoice.paid_at ? `
    <div class="date-block" style="border:1px solid #D1FAE5;">
      <div class="date-label" style="color:#065F46;">Payée le</div>
      <div class="date-value" style="color:#00A36C;">${fmtDate(invoice.paid_at)}</div>
    </div>` : ''}
  </div>

  <!-- Montant -->
  <div class="amount-section">
    <div>
      <div class="amount-label">Montant total</div>
      <div class="amount-value">${fmtAmount(Number(invoice.amount))}</div>
    </div>
    <div class="amount-status">
      <div class="badge">${INVOICE_STATUS_FR[invoice.status] ?? invoice.status}</div>
    </div>
  </div>

  <!-- Notes -->
  ${invoice.notes ? `
  <div class="notes">
    <div class="notes-label">Notes</div>
    <div class="notes-text">${invoice.notes}</div>
  </div>` : ''}

  <div class="spacer"/>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-left">
      Document généré le ${fmtDate(new Date().toISOString())}
    </div>
    <div style="text-align:right;">
      <div class="footer-brand">KASH</div>
      <div class="footer-tagline">Gérer. Encaisser. Grandir.</div>
    </div>
  </div>
</div>
</body>
</html>`;
}

export function InvoicePDFButton({ invoice, profile }: Props) {
  const [loading, setLoading] = useState(false);

  async function downloadPDF() {
    setLoading(true);
    try {
      const html = buildPdfHtml(invoice, profile);

      // Open print-ready page in new tab
      const win = window.open('', '_blank');
      if (!win) {
        alert('Autorisez les pop-ups pour télécharger le PDF.');
        setLoading(false);
        return;
      }

      win.document.write(html);
      win.document.close();

      // Wait for fonts/images then print
      win.addEventListener('load', () => {
        setTimeout(() => {
          win.print();
          setLoading(false);
        }, 600);
      });

      // Fallback if load already fired
      setTimeout(() => {
        if (win.document.readyState === 'complete') {
          win.print();
          setLoading(false);
        }
      }, 1200);
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={downloadPDF}
      disabled={loading}
      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#F6AD55]/10 text-[#C05621] hover:bg-[#F6AD55]/20 transition-colors disabled:opacity-50"
    >
      <FilePdfSVG size={14} />
      {loading ? 'Génération...' : 'Télécharger PDF'}
    </button>
  );
}
