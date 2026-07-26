import {
  Download,
  Eye,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PAGE_SIZE, STATUS_BADGE, STATUS_LABEL } from '../constants';
import { usePaymentsStore } from '../store';
import type { Invoice } from '../types';
import { daysUntilDue, formatDate, formatINR } from '../utils';

type Props = {
  invoices: Invoice[];
  totalFiltered: number;
  totalPages: number;
  onView: (id: string) => void;
  onDownload: (invoice: Invoice) => void;
};

export function InvoiceTable({
  invoices,
  totalFiltered,
  totalPages,
  onView,
  onDownload,
}: Props) {
  const selectedId = usePaymentsStore((s) => s.selectedInvoiceId);
  const page = usePaymentsStore((s) => s.page);
  const setPage = usePaymentsStore((s) => s.setPage);
  const start = (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, totalFiltered);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      {/* Desktop table */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-4 py-3">Invoice No.</th>
              <th className="px-4 py-3">Client / Booking</th>
              <th className="px-4 py-3">Event Date</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Advance</th>
              <th className="px-4 py-3">Pending</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Due Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map((inv) => {
              const due = daysUntilDue(inv.dueDate);
              const active = selectedId === inv.id;
              return (
                <tr
                  key={inv.id}
                  onClick={() => onView(inv.id)}
                  className={cn(
                    'cursor-pointer transition hover:bg-slate-50/80',
                    active && 'bg-[#F3EEFF]/50',
                  )}
                >
                  <td className="px-4 py-3.5 font-bold text-[#6B46FE]">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      {inv.client.avatar ? (
                        <img
                          src={inv.client.avatar}
                          alt=""
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3EEFF] text-xs font-bold text-[#6B46FE]">
                          {inv.client.name.charAt(0)}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-800">{inv.client.name}</p>
                        <p className="truncate text-xs text-slate-400">{inv.bookingName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{formatDate(inv.eventDate)}</td>
                  <td className="px-4 py-3.5">
                    <p className="font-bold tabular-nums text-slate-900">{formatINR(inv.total)}</p>
                    <p className="text-[10px] font-semibold text-slate-400">+ GST</p>
                  </td>
                  <td className="px-4 py-3.5 font-semibold tabular-nums text-emerald-600">
                    {formatINR(inv.advance)}
                  </td>
                  <td className="px-4 py-3.5 font-semibold tabular-nums text-amber-600">
                    {formatINR(inv.pending)}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={cn(
                        'inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold',
                        STATUS_BADGE[inv.status],
                      )}
                    >
                      {STATUS_LABEL[inv.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-slate-600">{formatDate(inv.dueDate)}</p>
                    <p
                      className={cn(
                        'text-[11px] font-semibold',
                        due.overdue ? 'text-rose-600' : 'text-slate-400',
                      )}
                    >
                      {due.label}
                    </p>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        aria-label="View invoice"
                        onClick={(e) => {
                          e.stopPropagation();
                          onView(inv.id);
                        }}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-[#6B46FE]"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Download invoice"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDownload(inv);
                        }}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-[#6B46FE]"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="More actions"
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 p-3 lg:hidden">
        {invoices.map((inv) => {
          const due = daysUntilDue(inv.dueDate);
          return (
            <button
              key={inv.id}
              type="button"
              onClick={() => onView(inv.id)}
              className="w-full rounded-2xl border border-slate-100 bg-white p-3.5 text-left shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-[#6B46FE]">{inv.invoiceNumber}</p>
                  <p className="mt-0.5 font-bold text-slate-900">{inv.client.name}</p>
                  <p className="text-xs text-slate-400">{inv.bookingName}</p>
                </div>
                <span
                  className={cn(
                    'rounded-full border px-2 py-0.5 text-[10px] font-bold',
                    STATUS_BADGE[inv.status],
                  )}
                >
                  {STATUS_LABEL[inv.status]}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-slate-50 p-2">
                  <p className="text-[10px] font-semibold text-slate-400">Total</p>
                  <p className="text-xs font-extrabold">{formatINR(inv.total)}</p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-2">
                  <p className="text-[10px] font-semibold text-emerald-600">Paid</p>
                  <p className="text-xs font-extrabold text-emerald-700">{formatINR(inv.advance)}</p>
                </div>
                <div className="rounded-xl bg-amber-50 p-2">
                  <p className="text-[10px] font-semibold text-amber-600">Pending</p>
                  <p className="text-xs font-extrabold text-amber-700">{formatINR(inv.pending)}</p>
                </div>
              </div>
              <p className={cn('mt-2 text-[11px] font-semibold', due.overdue ? 'text-rose-600' : 'text-slate-400')}>
                Due {formatDate(inv.dueDate)} · {due.label}
              </p>
            </button>
          );
        })}
      </div>

      {invoices.length === 0 ? (
        <div className="px-4 py-16 text-center text-sm text-slate-400">No invoices match your filters.</div>
      ) : null}

      <div className="flex flex-col gap-2 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-400">
          Showing {totalFiltered === 0 ? 0 : start} to {end} of {totalFiltered} invoices
        </p>
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={cn(
                'h-8 min-w-8 rounded-lg px-2 text-xs font-bold transition',
                page === p
                  ? 'bg-[#6B46FE] text-white'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100',
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
