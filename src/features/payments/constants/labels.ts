import type {
  FuturePaymentGateways,
  InvoiceStatus,
  PaymentMethod,
} from '../types';

export const STATUS_LABEL: Record<InvoiceStatus, string> = {
  paid: 'Paid',
  pending: 'Pending',
  partially_paid: 'Partially Paid',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export const STATUS_BADGE: Record<InvoiceStatus, string> = {
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  pending: 'bg-amber-50 text-amber-700 border-amber-100',
  partially_paid: 'bg-sky-50 text-sky-700 border-sky-100',
  overdue: 'bg-rose-50 text-rose-700 border-rose-100',
  cancelled: 'bg-slate-100 text-slate-500 border-slate-200',
  refunded: 'bg-violet-50 text-violet-700 border-violet-100',
};

export const METHOD_LABEL: Record<PaymentMethod, string> = {
  cash: 'Cash',
  upi: 'UPI',
  credit_card: 'Credit Card',
  debit_card: 'Debit Card',
  bank_transfer: 'Bank Transfer',
  cheque: 'Cheque',
  online: 'Online Payment',
};

export const DEFAULT_TERMS =
  'Payment due within the stated due date. Advance is non-refundable. Final delivery after full settlement.';

export const FUTURE_GATEWAYS: FuturePaymentGateways = {
  razorpay: false,
  stripe: false,
  phonepe: false,
  googlePay: false,
  gstApi: false,
  autoInvoice: false,
  autoReminder: true,
  subscriptionBilling: false,
  refundManagement: false,
};

export const PAGE_SIZE = 5;
