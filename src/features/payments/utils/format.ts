import type { CreateInvoiceInput, Invoice, InvoiceFilters, InvoiceStatus } from '../types';

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatINRCompact(amount: number): string {
  if (amount >= 10000000) return `₹ ${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹ ${(amount / 100000).toFixed(2)} L`;
  return formatINR(amount);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function daysUntilDue(dueDate: string, now = Date.now()): { label: string; overdue: boolean } {
  const diff = Math.ceil((new Date(dueDate).getTime() - now) / 86400000);
  if (diff < 0) return { label: `${Math.abs(diff)} Days Overdue`, overdue: true };
  if (diff === 0) return { label: 'Due Today', overdue: false };
  return { label: `${diff} Days Left`, overdue: false };
}

export function filterInvoices(invoices: Invoice[], filters: InvoiceFilters): Invoice[] {
  const q = filters.search.trim().toLowerCase();
  return invoices.filter((inv) => {
    if (filters.status !== 'all' && inv.status !== filters.status) return false;
    if (filters.paymentMethod !== 'all' && inv.paymentMethod !== filters.paymentMethod) return false;
    if (q) {
      const hay = [
        inv.invoiceNumber,
        inv.client.name,
        inv.client.phone,
        inv.bookingName,
        inv.eventName,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (filters.dateRange !== 'all') {
      const days =
        filters.dateRange === '7d' ? 7 : filters.dateRange === '30d' ? 30 : filters.dateRange === '90d' ? 90 : 365;
      const cutoff = Date.now() - days * 86400000;
      if (new Date(inv.createdAt).getTime() < cutoff) return false;
    }
    return true;
  });
}

export function computeLineAmount(qty: number, rate: number) {
  return Math.round(qty * rate);
}

export function buildInvoiceFromInput(
  input: CreateInvoiceInput,
  photographer: Invoice['photographer'],
  nextNumber: string,
): Invoice {
  const items = input.items.map((item, i) => ({
    id: `new-li-${i}`,
    description: item.description,
    qty: item.qty,
    rate: item.rate,
    amount: computeLineAmount(item.qty, item.rate),
  }));
  const subTotal = items.reduce((s, i) => s + i.amount, 0);
  const afterDiscount = Math.max(0, subTotal - input.discount);
  const sgstPercent = 9;
  const cgstPercent = 9;
  const sgstAmount = Math.round(afterDiscount * (sgstPercent / 100));
  const cgstAmount = Math.round(afterDiscount * (cgstPercent / 100));
  const total = afterDiscount + sgstAmount + cgstAmount;
  const advance = Math.min(input.advance, total);
  const pending = Math.max(0, total - advance);

  let status: InvoiceStatus = 'pending';
  if (pending === 0) status = 'paid';
  else if (advance > 0) status = 'partially_paid';

  return {
    id: `inv-${Date.now()}`,
    invoiceNumber: nextNumber,
    client: {
      name: input.clientName,
      email: input.clientEmail,
      phone: input.clientPhone,
    },
    photographer,
    bookingName: input.bookingName,
    eventName: input.eventName,
    eventDate: input.eventDate,
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: input.dueDate,
    items,
    subTotal,
    discount: input.discount,
    sgstPercent,
    cgstPercent,
    sgstAmount,
    cgstAmount,
    total,
    advance,
    pending,
    status,
    notes: input.notes,
    terms: input.terms,
    createdAt: new Date().toISOString(),
    payments:
      advance > 0
        ? [
            {
              id: `pay-${Date.now()}`,
              invoiceId: `inv-${Date.now()}`,
              amount: advance,
              method: 'upi',
              type: 'advance',
              paidAt: new Date().toISOString(),
              status: 'success',
            },
          ]
        : [],
  };
}

export function invoicesToCsv(invoices: Invoice[]): string {
  const header = [
    'Invoice No',
    'Client',
    'Booking',
    'Event Date',
    'Amount',
    'Advance',
    'Pending',
    'Status',
    'Due Date',
  ].join(',');
  const rows = invoices.map((i) =>
    [
      i.invoiceNumber,
      `"${i.client.name}"`,
      `"${i.bookingName}"`,
      i.eventDate,
      i.total,
      i.advance,
      i.pending,
      i.status,
      i.dueDate,
    ].join(','),
  );
  return [header, ...rows].join('\n');
}

export function downloadTextFile(filename: string, content: string, mime = 'text/plain') {
  const blob = new Blob([content], { type: mime });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
