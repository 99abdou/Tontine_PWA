// ===== ENUMS =====
export type UserRole = 'admin' | 'organizer' | 'participant';

export type TontineType = 'rotative' | 'epargne' | 'personnalisee';
export type TontineFrequency = 'hebdomadaire' | 'bimensuel' | 'mensuel';
export type TontineStatus = 'brouillon' | 'active' | 'en_pause' | 'terminee' | 'annulee';
export type BeneficiaryOrder = 'fixe' | 'aleatoire' | 'manuel';
export type DistributionMode = 'rotation' | 'tirage' | 'choix';

export type MembershipStatus = 'invite' | 'actif' | 'suspendu' | 'archive';

export type ContributionStatus = 'a_venir' | 'en_attente' | 'partiellement_paye' | 'paye' | 'en_retard' | 'annule' | 'litige';

export type PaymentMethod = 'wave' | 'orange_money' | 'free_money' | 'especes' | 'virement' | 'autre';
export type PaymentStatus = 'en_attente' | 'confirme' | 'annule';

export type PayoutStatus = 'programme' | 'collecte_en_cours' | 'pret' | 'verse' | 'en_retard' | 'suspendu';

export type NotificationType = 'rappel_cotisation' | 'confirmation_paiement' | 'retard_paiement' | 'versement_programme' | 'versement_effectue' | 'invitation' | 'general';
export type NotificationChannel = 'whatsapp' | 'email' | 'in_app';
export type NotificationStatus = 'en_attente' | 'envoyee' | 'echouee' | 'lue';

export type SubscriptionPlan = 'gratuit' | 'standard' | 'premium';
export type SubscriptionStatus = 'actif' | 'expire' | 'annule';

// ===== INTERFACES =====
export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  is_active: boolean;
  date_joined: string;
}

export interface Tontine {
  id: string;
  organizer: User;
  name: string;
  description: string;
  tontine_type: TontineType;
  contribution_amount: number;
  currency: string;
  frequency: TontineFrequency;
  participant_limit: number;
  start_date: string;
  end_date: string;
  payment_day: number;
  first_payout_date: string;
  distribution_mode: DistributionMode;
  beneficiary_order: BeneficiaryOrder;
  status: TontineStatus;
  rules: string;
  created_at: string;
  updated_at: string;
  member_count?: number;
  total_collected?: number;
  total_expected?: number;
  current_period?: number;
  total_periods?: number;
  next_payout_date?: string;
}

export interface Membership {
  id: string;
  tontine: Tontine;
  participant: User;
  status: MembershipStatus;
  joined_at: string;
  position: number;
  accepted_rules_at?: string;
}

export interface Contribution {
  id: string;
  tontine: Tontine;
  membership: Membership;
  period_number: number;
  expected_amount: number;
  paid_amount: number;
  due_date: string;
  status: ContributionStatus;
  created_at: string;
}

export interface Payment {
  id: string;
  contribution: Contribution;
  amount: number;
  payment_method: PaymentMethod;
  reference: string;
  proof?: string;
  received_at: string;
  recorded_by: User;
  comment: string;
  status: PaymentStatus;
  created_at: string;
}

export interface Payout {
  id: string;
  tontine: Tontine;
  beneficiary: Membership;
  round_number: number;
  expected_amount: number;
  actual_amount: number;
  planned_date: string;
  paid_at?: string;
  payment_method?: PaymentMethod;
  reference?: string;
  proof?: string;
  status: PayoutStatus;
}

export interface Notification {
  id: string;
  user: User;
  tontine?: Tontine;
  notification_type: NotificationType;
  channel: NotificationChannel;
  message: string;
  status: NotificationStatus;
  sent_at?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user: User;
  action: string;
  entity_type: string;
  entity_id: string;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  reason?: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  organizer: User;
  plan: SubscriptionPlan;
  start_date: string;
  end_date: string;
  status: SubscriptionStatus;
}

export interface DashboardStats {
  active_tontines: number;
  total_participants: number;
  total_collected: number;
  total_expected: number;
  overdue_count: number;
  upcoming_payouts: number;
  collection_rate: number;
}

export interface Transaction {
  id: string;
  type: 'payment' | 'payout';
  member_name: string;
  tontine_name: string;
  amount: number;
  method?: PaymentMethod;
  date: string;
  status: string;
}

export interface ContributionMatrixCell {
  contribution_id: string;
  member_id: string;
  member_name: string;
  period_number: number;
  expected_amount: number;
  paid_amount: number;
  status: ContributionStatus;
  due_date: string;
}

export interface ChartDataPoint {
  month: string;
  collected: number;
  expected: number;
}

// Auth
export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}
