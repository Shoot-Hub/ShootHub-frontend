import { Download, Search } from 'lucide-react';
import { STATUS_LABEL, METHOD_LABEL } from '../constants';
import { usePaymentsStore } from '../store';
import type { InvoiceStatus, PaymentMethod } from '../types';

type Props = {
  onExport: () => void;
};

export function InvoiceFiltersBar({ onExport }: Props) {
  const filters = usePaymentsStore((s) => s.filters);
  const setFilters = usePaymentsStore((s) => s.setFilters);

  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative min-w-0 flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          placeholder="Search invoice, client, booking, phone..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#6B46FE]/40 focus:ring-2 focus:ring-[#6B46FE]/10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value as InvoiceStatus | 'all' })}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none"
          aria-label="Filter by status"
        >
          <option value="all">Status</option>
          {(Object.keys(STATUS_LABEL) as InvoiceStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>

        <select
          value={filters.paymentMethod}
          onChange={(e) =>
            setFilters({ paymentMethod: e.target.value as PaymentMethod | 'all' })
          }
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none"
          aria-label="Filter by payment method"
        >
          <option value="all">Payment Method</option>
          {(Object.keys(METHOD_LABEL) as PaymentMethod[]).map((m) => (
            <option key={m} value={m}>
              {METHOD_LABEL[m]}
            </option>
          ))}
        </select>

        <select
          value={filters.dateRange}
          onChange={(e) =>
            setFilters({
              dateRange: e.target.value as typeof filters.dateRange,
            })
          }
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none"
          aria-label="Filter by date range"
        >
          <option value="all">Date Range</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="year">This year</option>
        </select>

        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>
    </div>
  );
}
