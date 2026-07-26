import type { ReactNode } from 'react';
import {
  Download,
  Link2,
  MessageCircle,
  MoreHorizontal,
  Share2,
  Wallet,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { METHOD_LABEL, STATUS_BADGE, STATUS_LABEL } from '../constants';
import { usePaymentsStore } from '../store';
import type { Invoice } from '../types';
import { formatDate, formatINR } from '../utils';

type Props = {
  invoice: Invoice;
  onRecordPayment: () => void;
  onClose: () => void;
};

export function InvoicePreviewPanel({ invoice, onRecordPayment, onClose }: Props) {
  const tab = usePaymentsStore((s) => s.previewTab);
  const setPreviewTab = usePaymentsStore((s) => s.setPreviewTab);
  const paidPct = invoice.total > 0 ? Math.round((invoice.advance / invoice.total) * 100) : 0;
  const pendingPct = 100 - paidPct;

  const shareLink = `${window.location.origin}/pay/${invoice.invoiceNumber}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareLink);
    toast.success('Payment link copied');
  };

  const downloadTxt = () => {
    const lines = [
      `ShootHub Invoice — ${invoice.invoiceNumber}`,
      `Client: ${invoice.client.name}`,
      `Booking: ${invoice.bookingName}`,
      `Total: ${formatINR(invoice.total)}`,
      `Advance: ${formatINR(invoice.advance)}`,
      `Pending: ${formatINR(invoice.pending)}`,
      '',
      ...invoice.items.map(
        (i) => `${i.description} | Qty ${i.qty} | ${formatINR(i.amount)}`,
      ),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${invoice.invoiceNumber}.txt`;
    a.click();
    toast.success('Invoice downloaded');
  };

  return (
    <aside className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div className="flex gap-1 rounded-xl bg-slate-50 p-1">
          {(['details', 'history'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setPreviewTab(t)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition',
                tab === t ? 'bg-white text-[#6B46FE] shadow-sm' : 'text-slate-500',
              )}
            >
              {t === 'details' ? 'Invoice Details' : 'Payment History'}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50"
          aria-label="Close preview"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-sm font-extrabold text-slate-900">{invoice.invoiceNumber}</p>
            <p className="text-xs text-slate-400">
              Issued {formatDate(invoice.issueDate)} · Due {formatDate(invoice.dueDate)}
            </p>
          </div>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={downloadTxt}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-slate-600"
            >
              <Download className="h-3.5 w-3.5" />
              PDF
            </button>
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-slate-600"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>
          </div>
        </div>

        {tab === 'details' ? (
          <>
            {/* Mini invoice document */}
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="border-b border-slate-200 bg-white px-4 py-3">
                <p className="text-sm font-extrabold text-[#6B46FE]">ShootHub</p>
                <p className="text-[10px] text-slate-400">Professional Photography Invoice</p>
              </div>
              <div className="grid gap-3 px-4 py-3 text-[11px] sm:grid-cols-2">
                <div>
                  <p className="font-bold uppercase tracking-wide text-slate-400">From</p>
                  <p className="mt-1 font-semibold text-slate-800">{invoice.photographer.name}</p>
                  <p className="text-slate-500">{invoice.photographer.email}</p>
                  <p className="text-slate-500">{invoice.photographer.phone}</p>
                </div>
                <div>
                  <p className="font-bold uppercase tracking-wide text-slate-400">Bill To</p>
                  <p className="mt-1 font-semibold text-slate-800">{invoice.client.name}</p>
                  <p className="text-slate-500">{invoice.client.email}</p>
                  <p className="text-slate-500">{invoice.client.phone}</p>
                </div>
              </div>
              <div className="border-t border-slate-200 px-4 py-2 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">{invoice.eventName}</span>
                {' · '}
                {formatDate(invoice.eventDate)}
              </div>
              <table className="w-full text-[11px]">
                <thead className="bg-slate-100 text-left text-slate-400">
                  <tr>
                    <th className="px-4 py-2 font-bold">Description</th>
                    <th className="px-2 py-2 font-bold">Qty</th>
                    <th className="px-2 py-2 font-bold">Rate</th>
                    <th className="px-4 py-2 text-right font-bold">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {invoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2 text-slate-700">{item.description}</td>
                      <td className="px-2 py-2">{item.qty}</td>
                      <td className="px-2 py-2">{formatINR(item.rate)}</td>
                      <td className="px-4 py-2 text-right font-semibold">
                        {formatINR(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="space-y-1 border-t border-slate-200 bg-white px-4 py-3 text-[11px]">
                <Row label="Sub Total" value={formatINR(invoice.subTotal)} />
                {invoice.discount > 0 ? (
                  <Row label="Discount" value={`- ${formatINR(invoice.discount)}`} />
                ) : null}
                <Row label={`SGST (${invoice.sgstPercent}%)`} value={formatINR(invoice.sgstAmount)} />
                <Row label={`CGST (${invoice.cgstPercent}%)`} value={formatINR(invoice.cgstAmount)} />
                <Row label="Total" value={formatINR(invoice.total)} bold />
                <Row label="Advance Received" value={formatINR(invoice.advance)} />
              </div>
              {invoice.pending > 0 ? (
                <div className="bg-rose-600 px-4 py-2.5 text-center text-xs font-extrabold text-white">
                  Pending Amount: {formatINR(invoice.pending)}
                </div>
              ) : (
                <div className="bg-emerald-600 px-4 py-2.5 text-center text-xs font-extrabold text-white">
                  Fully Paid
                </div>
              )}
            </div>

            {/* Payment summary bars */}
            <div className="mt-4 space-y-3">
              <p className="text-xs font-extrabold text-slate-900">Payment Summary</p>
              <SummaryBar label="Total" value={formatINR(invoice.total)} pct={100} color="bg-slate-300" />
              <SummaryBar label="Paid" value={formatINR(invoice.advance)} pct={paidPct} color="bg-teal-500" />
              <SummaryBar
                label="Pending"
                value={formatINR(invoice.pending)}
                pct={pendingPct}
                color="bg-rose-500"
              />
            </div>
          </>
        ) : (
          <ul className="mt-2 space-y-2">
            {invoice.payments.length === 0 ? (
              <li className="rounded-xl bg-slate-50 px-3 py-8 text-center text-xs text-slate-400">
                No payments recorded yet.
              </li>
            ) : (
              invoice.payments.map((p) => (
                <li
                  key={p.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-slate-800">{formatINR(p.amount)}</p>
                    <span className="text-[10px] font-bold uppercase text-emerald-600">
                      {p.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {METHOD_LABEL[p.method]} · {p.type} · {formatDate(p.paidAt)}
                  </p>
                  {p.reference ? (
                    <p className="text-[10px] text-slate-400">Ref: {p.reference}</p>
                  ) : null}
                </li>
              ))
            )}
          </ul>
        )}

        <div className="mt-4">
          <span
            className={cn(
              'inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold',
              STATUS_BADGE[invoice.status],
            )}
          >
            {STATUS_LABEL[invoice.status]}
          </span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="border-t border-slate-100 px-4 py-3">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Quick Actions
        </p>
        <div className="flex items-center justify-around">
          <ActionBtn
            label="Record Payment"
            onClick={onRecordPayment}
            icon={<Wallet className="h-4 w-4" />}
          />
          <ActionBtn
            label="WhatsApp"
            onClick={() =>
              toast.success('Reminder drafted for WhatsApp (frontend only)')
            }
            icon={<MessageCircle className="h-4 w-4" />}
          />
          <ActionBtn
            label="Payment Link"
            onClick={copyLink}
            icon={<Link2 className="h-4 w-4" />}
          />
          <ActionBtn
            label="More"
            onClick={() => toast('More actions — Email / SMS / Duplicate')}
            icon={<MoreHorizontal className="h-4 w-4" />}
          />
        </div>
      </div>
    </aside>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className={`flex justify-between ${bold ? 'font-extrabold text-slate-900' : 'text-slate-600'}`}>
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

function SummaryBar({
  label,
  value,
  pct,
  color,
}: {
  label: string;
  value: string;
  pct: number;
  color: string;
}) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-[11px] font-semibold">
        <span className="text-slate-500">{label}</span>
        <span className="tabular-nums text-slate-800">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
      </div>
    </div>
  );
}

function ActionBtn({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1 text-[10px] font-semibold text-slate-500 hover:text-[#6B46FE]"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-600 ring-1 ring-slate-100 hover:bg-[#F3EEFF] hover:text-[#6B46FE]">
        {icon}
      </span>
      {label}
    </button>
  );
}
