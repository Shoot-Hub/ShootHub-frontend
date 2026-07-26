import { motion } from 'framer-motion';
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Clock3,
  IndianRupee,
  TriangleAlert,
  Wallet,
} from 'lucide-react';
import type { PaymentsOverview } from '../types';
import { formatINR } from '../utils';

type Props = {
  overview: PaymentsOverview;
};

const CARDS = [
  {
    key: 'totalRevenue' as const,
    label: 'Total Revenue',
    icon: IndianRupee,
    iconBg: 'bg-[#F3EEFF] text-[#6B46FE]',
    trendKey: 'totalRevenue' as const,
  },
  {
    key: 'advanceReceived' as const,
    label: 'Advance Received',
    icon: Wallet,
    iconBg: 'bg-emerald-50 text-emerald-600',
    trendKey: 'advanceReceived' as const,
  },
  {
    key: 'pendingAmount' as const,
    label: 'Pending Amount',
    icon: Clock3,
    iconBg: 'bg-amber-50 text-amber-600',
    trendKey: 'pendingAmount' as const,
  },
  {
    key: 'paidAmount' as const,
    label: 'Paid Amount',
    icon: Banknote,
    iconBg: 'bg-teal-50 text-teal-600',
    trendKey: 'paidAmount' as const,
  },
  {
    key: 'overduePayments' as const,
    label: 'Overdue Payments',
    icon: TriangleAlert,
    iconBg: 'bg-rose-50 text-rose-600',
    trendKey: 'overduePayments' as const,
  },
] as const;

export function PaymentsStatsRow({ overview }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {CARDS.map((card, i) => {
        const Icon = card.icon;
        const trend = overview.trends[card.trendKey];
        const up = trend >= 0;
        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg}`}>
                <Icon className="h-5 w-5" />
              </span>
              <span
                className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}
              >
                {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {Math.abs(trend)}%
              </span>
            </div>
            <p className="mt-3 text-xl font-extrabold tabular-nums text-slate-900">
              {formatINR(overview[card.key])}
            </p>
            <p className="mt-0.5 text-xs font-semibold text-slate-500">{card.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
