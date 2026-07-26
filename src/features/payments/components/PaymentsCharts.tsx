import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { PaymentStatusSlice, RevenuePoint } from '../types';
import { formatINR } from '../utils';

type RevenueProps = {
  data: RevenuePoint[];
};

export function RevenueOverviewChart({ data }: RevenueProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">Revenue Overview</h3>
          <p className="text-xs text-slate-400">Monthly earnings trend</p>
        </div>
      </div>
      <div className="h-56 w-full sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6B46FE" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#6B46FE" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F4" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={(v) => `₹${Math.round(v / 1000)}k`}
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip
              formatter={(value) => [formatINR(Number(value ?? 0)), 'Revenue']}
              contentStyle={{
                borderRadius: 12,
                border: '1px solid #EEF0F4',
                boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#6B46FE"
              strokeWidth={2.5}
              fill="url(#revFill)"
              activeDot={{ r: 5, fill: '#6B46FE' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

type StatusProps = {
  slices: PaymentStatusSlice[];
  totalLabel: string;
};

export function PaymentStatusChart({ slices, totalLabel }: StatusProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-2">
        <h3 className="text-sm font-extrabold text-slate-900">Payment Status</h3>
        <p className="text-xs text-slate-400">Distribution by invoice status</p>
      </div>
      <div className="relative mx-auto h-52 w-full max-w-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="percent"
              nameKey="label"
              innerRadius={58}
              outerRadius={84}
              paddingAngle={3}
              strokeWidth={0}
            >
              {slices.map((s) => (
                <Cell key={s.status} fill={s.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value}%`, String(name)]}
              contentStyle={{ borderRadius: 12, border: '1px solid #EEF0F4' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total</p>
          <p className="text-sm font-extrabold text-slate-900">{totalLabel}</p>
        </div>
      </div>
      <ul className="mt-2 space-y-1.5">
        {slices.map((s) => (
          <li key={s.status} className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-2 font-semibold text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
              {s.label}
            </span>
            <span className="font-bold tabular-nums text-slate-800">{s.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
