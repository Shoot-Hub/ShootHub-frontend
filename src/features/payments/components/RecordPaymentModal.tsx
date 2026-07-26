import { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { METHOD_LABEL } from '../constants';
import { useRecordPayment } from '../hooks';
import type { Invoice, PaymentMethod } from '../types';
import { formatINR } from '../utils';

type Props = {
  invoice: Invoice;
  open: boolean;
  onClose: () => void;
};

export function RecordPaymentModal({ invoice, open, onClose }: Props) {
  const record = useRecordPayment();
  const [amount, setAmount] = useState(String(invoice.pending || 0));
  const [method, setMethod] = useState<PaymentMethod>('upi');

  if (!open) return null;

  const submit = async () => {
    const value = Number(amount);
    if (!value || value <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    try {
      await record.mutateAsync({ invoiceId: invoice.id, amount: value, method });
      toast.success('Payment recorded');
      onClose();
    } catch {
      toast.error('Could not record payment');
    }
  };

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Record Payment</h3>
            <p className="text-xs text-slate-400">
              {invoice.invoiceNumber} · Pending {formatINR(invoice.pending)}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-50">
            <X className="h-4 w-4" />
          </button>
        </div>

        <label className="mt-4 block text-xs font-bold text-slate-600">
          Amount (₹)
          <input
            type="number"
            min={1}
            max={invoice.pending}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#6B46FE]/40"
          />
        </label>

        <label className="mt-3 block text-xs font-bold text-slate-600">
          Payment Method
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as PaymentMethod)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none"
          >
            {(Object.keys(METHOD_LABEL) as PaymentMethod[]).map((m) => (
              <option key={m} value={m}>
                {METHOD_LABEL[m]}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void submit()}
            disabled={record.isPending || invoice.pending <= 0}
            className="flex-1 rounded-xl bg-[#6B46FE] py-2.5 text-sm font-bold text-white disabled:opacity-50"
          >
            {record.isPending ? 'Saving…' : 'Save Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}
