// ============================================================
// KASH – Types centraux
// ============================================================

export type UserRole = 'freelance' | 'admin';
export type Currency = 'XOF';
export type ProjectStatus = 'en_cours' | 'termine' | 'annule' | 'en_attente';
export type TaskStatus = 'a_faire' | 'en_cours' | 'termine';
export type InvoiceStatus = 'brouillon' | 'envoyee' | 'payee' | 'annulee';
export type PaymentMethod = 'mobile_money' | 'virement' | 'especes' | 'autre';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  phone: string | null;
  role: UserRole;
  is_active: boolean;
  currency: Currency;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  client_name: string | null;
  description: string | null;
  status: ProjectStatus;
  amount: number;
  currency: Currency;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  project_id: string | null;
  invoice_number: string;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  amount: number;
  currency: Currency;
  status: InvoiceStatus;
  due_date: string | null;
  paid_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExternalIncome {
  id: string;
  user_id: string;
  source: string;
  description: string | null;
  amount: number;
  currency: Currency;
  received_at: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentProof {
  id: string;
  user_id: string;
  invoice_id: string | null;
  external_income_id: string | null;
  file_url: string;
  file_name: string;
  file_size: number | null;
  payment_method: PaymentMethod;
  notes: string | null;
  created_at: string;
}

export interface DashboardStats {
  total_revenue: number;
  projects_count: number;
  invoices_paid: number;
  external_incomes_total: number;
  monthly_revenue: MonthlyRevenue[];
}

export interface MonthlyRevenue {
  month: string;
  amount: number;
}

export interface AdminStats {
  total_users: number;
  active_users: number;
  total_projects: number;
  total_transactions_volume: number;
  new_users_this_month: number;
}
