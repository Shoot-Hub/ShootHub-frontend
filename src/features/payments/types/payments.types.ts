export type InvoiceStatus =
  | 'paid'
  | 'pending'
  | 'partially_paid'
  | 'overdue'
  | 'cancelled'
  | 'refunded';

export type PaymentMethod =
  | 'cash'
  | 'upi'
  | 'credit_card'
  | 'debit_card'
  | 'bank_transfer'
  | 'cheque'
  | 'online';

export type PaymentInstallmentType =
  | 'advance'
  | 'second'
  | 'final'
  | 'partial'
  | 'refund';

export type InvoiceLineItem = {
  id: string;
  description: string;
  qty: number;
  rate: number;
  amount: number;
};

export type PaymentRecord = {
  id: string;
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  type: PaymentInstallmentType;
  paidAt: string;
  reference?: string;
  note?: string;
  status: 'success' | 'failed' | 'pending';
};

export type InvoiceParty = {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  avatar?: string;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  client: InvoiceParty;
  photographer: InvoiceParty;
  bookingName: string;
  eventName: string;
  eventDate: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceLineItem[];
  subTotal: number;
  discount: number;
  sgstPercent: number;
  cgstPercent: number;
  sgstAmount: number;
  cgstAmount: number;
  total: number;
  advance: number;
  pending: number;
  status: InvoiceStatus;
  paymentMethod?: PaymentMethod;
  notes?: string;
  terms?: string;
  createdAt: string;
  payments: PaymentRecord[];
};

export type PaymentsOverview = {
  totalRevenue: number;
  advanceReceived: number;
  pendingAmount: number;
  paidAmount: number;
  overduePayments: number;
  gstCollected: number;
  monthlyEarnings: number;
  upcomingPayments: number;
  trends: {
    totalRevenue: number;
    advanceReceived: number;
    pendingAmount: number;
    paidAmount: number;
    overduePayments: number;
  };
};

export type RevenuePoint = {
  date: string;
  label: string;
  revenue: number;
};

export type PaymentStatusSlice = {
  status: InvoiceStatus;
  label: string;
  value: number;
  percent: number;
  color: string;
};

export type InvoiceFilters = {
  search: string;
  status: InvoiceStatus | 'all';
  paymentMethod: PaymentMethod | 'all';
  dateRange: 'all' | '7d' | '30d' | '90d' | 'year';
};

export type CreateInvoiceInput = {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  bookingName: string;
  eventName: string;
  eventDate: string;
  dueDate: string;
  items: Array<{ description: string; qty: number; rate: number }>;
  discount: number;
  advance: number;
  notes?: string;
  terms?: string;
};

/** Future payment gateway readiness */
export type FuturePaymentGateways = {
  razorpay: boolean;
  stripe: boolean;
  phonepe: boolean;
  googlePay: boolean;
  gstApi: boolean;
  autoInvoice: boolean;
  autoReminder: boolean;
  subscriptionBilling: boolean;
  refundManagement: boolean;
};
