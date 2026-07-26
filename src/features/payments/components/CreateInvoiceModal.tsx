import { useFieldArray, useForm } from 'react-hook-form';
import type { ReactNode } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { DEFAULT_TERMS } from '../constants';
import { useCreateInvoice } from '../hooks';
import type { CreateInvoiceInput } from '../types';
import { computeLineAmount, formatINR } from '../utils';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
};

type FormValues = CreateInvoiceInput;

export function CreateInvoiceModal({ open, onClose, onCreated }: Props) {
  const create = useCreateInvoice();
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      bookingName: '',
      eventName: '',
      eventDate: '',
      dueDate: '',
      discount: 0,
      advance: 0,
      notes: '',
      terms: DEFAULT_TERMS,
      items: [{ description: 'Photography Package', qty: 1, rate: 50000 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const items = watch('items');
  const discount = Number(watch('discount') || 0);
  const advance = Number(watch('advance') || 0);

  const subTotal = items.reduce(
    (s, i) => s + computeLineAmount(Number(i.qty) || 0, Number(i.rate) || 0),
    0,
  );
  const afterDiscount = Math.max(0, subTotal - discount);
  const tax = Math.round(afterDiscount * 0.18);
  const total = afterDiscount + tax;

  if (!open) return null;

  const onSubmit = handleSubmit(async (values) => {
    try {
      const inv = await create.mutateAsync({
        ...values,
        discount: Number(values.discount) || 0,
        advance: Number(values.advance) || 0,
        items: values.items.map((i) => ({
          description: i.description,
          qty: Number(i.qty) || 1,
          rate: Number(i.rate) || 0,
        })),
      });
      toast.success(`Invoice ${inv.invoiceNumber} created`);
      reset();
      onCreated(inv.id);
      onClose();
    } catch {
      toast.error('Could not create invoice');
    }
  });

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/45 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Create invoice"
        className="flex max-h-[94dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Create Invoice</h2>
            <p className="text-xs text-slate-400">Fill details and generate a client-ready invoice</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-50">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto px-5 py-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Client Name" error={errors.clientName?.message}>
              <input
                {...register('clientName', { required: 'Required' })}
                className="field"
                placeholder="Client full name"
              />
            </Field>
            <Field label="Phone">
              <input {...register('clientPhone')} className="field" placeholder="+91..." />
            </Field>
            <Field label="Email">
              <input {...register('clientEmail')} type="email" className="field" placeholder="email@..." />
            </Field>
            <Field label="Booking Name" error={errors.bookingName?.message}>
              <input
                {...register('bookingName', { required: 'Required' })}
                className="field"
                placeholder="Rohan & Priya Wedding"
              />
            </Field>
            <Field label="Event Name" error={errors.eventName?.message}>
              <input
                {...register('eventName', { required: 'Required' })}
                className="field"
                placeholder="Wedding Photography"
              />
            </Field>
            <Field label="Event Date" error={errors.eventDate?.message}>
              <input {...register('eventDate', { required: 'Required' })} type="date" className="field" />
            </Field>
            <Field label="Due Date" error={errors.dueDate?.message}>
              <input {...register('dueDate', { required: 'Required' })} type="date" className="field" />
            </Field>
            <Field label="Discount (₹)">
              <input {...register('discount')} type="number" min={0} className="field" />
            </Field>
            <Field label="Advance Received (₹)">
              <input {...register('advance')} type="number" min={0} className="field" />
            </Field>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-extrabold text-slate-900">Line Items</p>
              <button
                type="button"
                onClick={() => append({ description: '', qty: 1, rate: 0 })}
                className="inline-flex items-center gap-1 rounded-lg bg-[#F3EEFF] px-2.5 py-1.5 text-xs font-bold text-[#6B46FE]"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Item
              </button>
            </div>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[1fr_70px_100px_36px] gap-2">
                  <input
                    {...register(`items.${index}.description` as const, { required: true })}
                    placeholder="Description"
                    className="field"
                  />
                  <input
                    {...register(`items.${index}.qty` as const)}
                    type="number"
                    min={1}
                    className="field"
                  />
                  <input
                    {...register(`items.${index}.rate` as const)}
                    type="number"
                    min={0}
                    className="field"
                  />
                  <button
                    type="button"
                    disabled={fields.length === 1}
                    onClick={() => remove(index)}
                    className="flex items-center justify-center rounded-xl text-rose-500 hover:bg-rose-50 disabled:opacity-30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-semibold tabular-nums text-slate-800">{formatINR(subTotal)}</span>
            </div>
            <div className="mt-1 flex justify-between text-slate-500">
              <span>GST (18%)</span>
              <span className="font-semibold tabular-nums text-slate-800">{formatINR(tax)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 font-extrabold text-slate-900">
              <span>Grand Total</span>
              <span className="tabular-nums text-[#6B46FE]">{formatINR(total)}</span>
            </div>
            <div className="mt-1 flex justify-between text-xs text-amber-600">
              <span>Pending after advance</span>
              <span className="font-bold tabular-nums">
                {formatINR(Math.max(0, total - advance))}
              </span>
            </div>
          </div>

          <Field label="Notes">
            <textarea {...register('notes')} rows={2} className="field resize-none" />
          </Field>
          <Field label="Terms">
            <textarea {...register('terms')} rows={2} className="field resize-none" />
          </Field>

          <div className="sticky bottom-0 -mx-5 mt-4 flex gap-2 border-t border-slate-100 bg-white px-5 py-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={create.isPending}
              className="flex-1 rounded-xl bg-gradient-to-r from-[#6B46FE] to-[#8B5CF6] py-2.5 text-sm font-bold text-white shadow-lg shadow-[#6B46FE]/25 disabled:opacity-60"
            >
              {create.isPending ? 'Creating…' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .field {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .field:focus {
          border-color: rgba(107, 70, 254, 0.4);
          box-shadow: 0 0 0 3px rgba(107, 70, 254, 0.1);
          background: white;
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="mt-3 block text-xs font-bold text-slate-600 sm:mt-0">
      {label}
      <div className="mt-1">{children}</div>
      {error ? <span className="mt-0.5 text-[11px] font-semibold text-rose-500">{error}</span> : null}
    </label>
  );
}
