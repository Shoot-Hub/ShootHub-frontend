import {
  DEMO_INVOICES,
  DEMO_OVERVIEW,
  DEMO_REVENUE_SERIES,
  DEMO_STATUS_SLICES,
} from '../constants';
import type {
  CreateInvoiceInput,
  Invoice,
  PaymentsOverview,
  PaymentStatusSlice,
  RevenuePoint,
} from '../types';
import { buildInvoiceFromInput } from '../utils';

/** In-memory demo DB — swap for real API later without changing hooks */
let invoicesDb: Invoice[] = [...DEMO_INVOICES];

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

export const paymentsKeys = {
  all: ['payments'] as const,
  overview: () => [...paymentsKeys.all, 'overview'] as const,
  revenue: () => [...paymentsKeys.all, 'revenue'] as const,
  statusSlices: () => [...paymentsKeys.all, 'status-slices'] as const,
  invoices: () => [...paymentsKeys.all, 'invoices'] as const,
  invoice: (id: string) => [...paymentsKeys.all, 'invoice', id] as const,
};

export async function fetchPaymentsOverview(): Promise<PaymentsOverview> {
  await delay();
  return DEMO_OVERVIEW;
}

export async function fetchRevenueSeries(): Promise<RevenuePoint[]> {
  await delay();
  return DEMO_REVENUE_SERIES;
}

export async function fetchPaymentStatusSlices(): Promise<PaymentStatusSlice[]> {
  await delay();
  return DEMO_STATUS_SLICES;
}

export async function fetchInvoices(): Promise<Invoice[]> {
  await delay();
  return [...invoicesDb];
}

export async function fetchInvoiceById(id: string): Promise<Invoice | null> {
  await delay();
  return invoicesDb.find((i) => i.id === id || i.invoiceNumber === id) ?? null;
}

export async function createInvoice(input: CreateInvoiceInput): Promise<Invoice> {
  await delay(400);
  const photographer = invoicesDb[0]?.photographer ?? {
    name: 'ShootHub Creator',
    email: 'creator@shoothub.com',
    phone: '+91 90000 00000',
  };
  const nextNumber = `INV-2024-${String(100 + invoicesDb.length + 1).padStart(3, '0')}`;
  const invoice = buildInvoiceFromInput(input, photographer, nextNumber);
  invoicesDb = [invoice, ...invoicesDb];
  return invoice;
}

export async function recordPayment(
  invoiceId: string,
  amount: number,
  method: Invoice['paymentMethod'] = 'upi',
): Promise<Invoice> {
  await delay(350);
  invoicesDb = invoicesDb.map((inv) => {
    if (inv.id !== invoiceId) return inv;
    const paid = Math.min(amount, inv.pending);
    const advance = inv.advance + paid;
    const pending = Math.max(0, inv.total - advance);
    const status =
      pending === 0 ? 'paid' : advance > 0 ? 'partially_paid' : inv.status;
    return {
      ...inv,
      advance,
      pending,
      status,
      paymentMethod: method,
      payments: [
        ...inv.payments,
        {
          id: `pay-${Date.now()}`,
          invoiceId,
          amount: paid,
          method: method || 'upi',
          type: pending === 0 ? 'final' : 'partial',
          paidAt: new Date().toISOString(),
          status: 'success' as const,
        },
      ],
    };
  });
  const updated = invoicesDb.find((i) => i.id === invoiceId);
  if (!updated) throw new Error('Invoice not found');
  return updated;
}
