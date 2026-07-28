import { CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatINR } from '../../data/dashboardData';
import type { PaymentSummary } from '../../types/dashboard.types';
import { GlassCard } from '../shared/GlassCard';

interface PaymentsCardProps {
  payments: PaymentSummary;
}

export function PaymentsCard({ payments }: PaymentsCardProps) {
  const paidPct = Math.round((payments.paid / payments.total) * 100);

  return (
    <GlassCard className="p-5 sm:p-6" hover={false}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B46FE]">
            Payments
          </p>
          <h3 className="mt-1 text-lg font-bold text-[#111827]">Booking balance</h3>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F3EEFF] text-[#6B46FE]">
          <CreditCard className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-[#9CA3AF]">Total</p>
          <p className="mt-1 text-sm font-bold text-[#111827]">{formatINR(payments.total)}</p>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-[#9CA3AF]">Paid</p>
          <p className="mt-1 text-sm font-bold text-emerald-600">{formatINR(payments.paid)}</p>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-[#9CA3AF]">Pending</p>
          <p className="mt-1 text-sm font-bold text-amber-600">{formatINR(payments.pending)}</p>
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#F3F4F6]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#6B46FE] to-[#8A60FF]"
          style={{ width: `${paidPct}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-[#6B7280]">
        Next due {formatINR(payments.nextDueAmount)} on {payments.nextDueDate}
      </p>

      <Link
        to="/user/payments"
        className="mt-5 inline-flex w-full items-center justify-center rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm font-bold text-[#111827] transition-colors hover:border-[#6B46FE]/30 hover:text-[#6B46FE]"
      >
        Manage payments
      </Link>
    </GlassCard>
  );
}
