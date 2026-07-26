import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Download, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { ShootHubLoader } from '@/components/ShootHubLoader';
import { STATUS_BADGE, STATUS_LABEL } from '../constants';
import { useInvoice, useRecordPayment } from '../hooks';
import { cn } from '@/lib/utils';
import { formatDate, formatINR } from '../utils';

/**
 * Client-facing payment screen.
 * Route: /pay/:invoiceNumber
 */
export function ClientPaymentPage() {
  const { invoiceNumber = '' } = useParams<{ invoiceNumber: string }>();
  const { data: invoice, isLoading, refetch } = useInvoice(invoiceNumber);
  const record = useRecordPayment();
  const [paying, setPaying] = useState(false);

  const summary = useMemo(() => {
    if (!invoice) return null;
    return {
      due: invoice.pending,
      paid: invoice.advance,
      total: invoice.total,
    };
  }, [invoice]);

  const payNow = async () => {
    if (!invoice || invoice.pending <= 0) return;
    setPaying(true);
    try {
      // Frontend-only simulation — ready to swap for Razorpay/Stripe later
      await record.mutateAsync({
        invoiceId: invoice.id,
        amount: invoice.pending,
        method: 'online',
      });
      await refetch();
      toast.success('Payment successful (demo)');
    } catch {
      toast.error('Payment failed');
    } finally {
      setPaying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <ShootHubLoader size="lg" label="Loading invoice…" />
      </div>
    );
  }

  if (!invoice || !summary) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 px-4">
        <p className="text-sm font-semibold text-slate-600">Invoice not found</p>
        <Link to="/" className="text-sm font-bold text-[#6B46FE]">
          Go home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F3EEFF] via-white to-slate-50 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-lg overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-[0_24px_60px_-28px_rgba(107,70,254,0.35)] backdrop-blur-xl"
      >
        <div className="bg-gradient-to-r from-[#6B46FE] to-[#8B5CF6] px-6 py-5 text-white">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">
            ShootHub Secure Pay
          </p>
          <h1 className="mt-1 text-xl font-extrabold">{invoice.photographer.name}</h1>
          <p className="text-sm text-white/80">{invoice.bookingName}</p>
        </div>

        <div className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400">{invoice.invoiceNumber}</p>
              <p className="font-extrabold text-slate-900">{invoice.client.name}</p>
            </div>
            <span
              className={cn(
                'rounded-full border px-2.5 py-0.5 text-[11px] font-bold',
                STATUS_BADGE[invoice.status],
              )}
            >
              {STATUS_LABEL[invoice.status]}
            </span>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Amount Due
            </p>
            <p className="mt-1 text-3xl font-extrabold tabular-nums text-slate-900">
              {formatINR(summary.due)}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl bg-white p-2.5">
                <p className="text-slate-400">Total</p>
                <p className="font-bold">{formatINR(summary.total)}</p>
              </div>
              <div className="rounded-xl bg-white p-2.5">
                <p className="text-slate-400">Already Paid</p>
                <p className="font-bold text-emerald-600">{formatINR(summary.paid)}</p>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            Event: <span className="font-semibold text-slate-700">{invoice.eventName}</span>
            <br />
            Date: <span className="font-semibold text-slate-700">{formatDate(invoice.eventDate)}</span>
          </div>

          {summary.due > 0 ? (
            <button
              type="button"
              onClick={() => void payNow()}
              disabled={paying}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#6B46FE] to-[#8B5CF6] py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#6B46FE]/30 disabled:opacity-60"
            >
              {paying ? 'Processing…' : `Pay Now · ${formatINR(summary.due)}`}
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 py-3.5 text-sm font-extrabold text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
              Payment Complete
            </div>
          )}

          <button
            type="button"
            onClick={() => toast.success('Invoice download started (demo)')}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 text-sm font-bold text-slate-600"
          >
            <Download className="h-4 w-4" />
            Download Invoice
          </button>

          <div>
            <p className="text-xs font-extrabold text-slate-900">Transaction History</p>
            <ul className="mt-2 space-y-1.5">
              {invoice.payments.length === 0 ? (
                <li className="rounded-xl bg-slate-50 px-3 py-4 text-center text-xs text-slate-400">
                  No transactions yet
                </li>
              ) : (
                invoice.payments.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs"
                  >
                    <span className="text-slate-500">{formatDate(p.paidAt)}</span>
                    <span className="font-bold tabular-nums text-slate-800">
                      {formatINR(p.amount)}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>

          <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            Encrypted checkout · Ready for Razorpay / Stripe
          </p>
        </div>
      </motion.div>
    </div>
  );
}
