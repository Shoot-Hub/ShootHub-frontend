import { useMemo, useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { ShootHubLoader } from '@/components/ShootHubLoader';
import {
  CreateInvoiceModal,
  InvoiceFiltersBar,
  InvoicePreviewPanel,
  InvoiceTable,
  PaymentStatusChart,
  PaymentsStatsRow,
  RecordPaymentModal,
  RevenueOverviewChart,
} from '../components';
import {
  useInvoices,
  usePaymentStatusSlices,
  usePaymentsOverview,
  useRevenueSeries,
} from '../hooks';
import { usePaymentsStore } from '../store';
import { downloadTextFile, formatINR, invoicesToCsv } from '../utils';

export function PaymentsDashboardPage() {
  const overviewQ = usePaymentsOverview();
  const revenueQ = useRevenueSeries();
  const slicesQ = usePaymentStatusSlices();
  const invoicesQ = useInvoices();

  const selectedId = usePaymentsStore((s) => s.selectedInvoiceId);
  const setSelected = usePaymentsStore((s) => s.setSelectedInvoiceId);
  const createOpen = usePaymentsStore((s) => s.createOpen);
  const setCreateOpen = usePaymentsStore((s) => s.setCreateOpen);

  const [recordOpen, setRecordOpen] = useState(false);

  const selectedInvoice = useMemo(
    () => invoicesQ.data?.find((i) => i.id === selectedId) ?? null,
    [invoicesQ.data, selectedId],
  );

  const loading =
    overviewQ.isLoading || revenueQ.isLoading || slicesQ.isLoading || invoicesQ.isLoading;

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <ShootHubLoader size="lg" label="Loading invoices…" />
      </div>
    );
  }

  if (!overviewQ.data || !revenueQ.data || !slicesQ.data) {
    return (
      <div className="py-20 text-center text-sm text-rose-600">Failed to load payments data</div>
    );
  }

  const exportCsv = () => {
    const csv = invoicesToCsv(invoicesQ.filtered);
    downloadTextFile('shoothub-invoices.csv', csv, 'text/csv');
    toast.success('Exported CSV');
  };

  const downloadInvoice = (inv: (typeof invoicesQ.filtered)[number]) => {
    const text = [
      inv.invoiceNumber,
      inv.client.name,
      inv.bookingName,
      `Total ${formatINR(inv.total)}`,
      `Pending ${formatINR(inv.pending)}`,
    ].join('\n');
    downloadTextFile(`${inv.invoiceNumber}.txt`, text);
    toast.success('Invoice downloaded');
  };

  const donutTotal = formatINR(
    slicesQ.data.reduce((s, x) => s + x.value, 0),
  );

  return (
    <div className="space-y-5 pb-24 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            Invoices & Payments
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Track revenue, advances, and client settlements in one place.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-1.5 self-start rounded-xl bg-gradient-to-r from-[#6B46FE] to-[#8B5CF6] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#6B46FE]/25 transition hover:brightness-105"
        >
          <Plus className="h-4 w-4" />
          Create Invoice
          <ChevronDown className="h-4 w-4 opacity-80" />
        </button>
      </div>

      <PaymentsStatsRow overview={overviewQ.data} />

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <RevenueOverviewChart data={revenueQ.data} />
        <PaymentStatusChart slices={slicesQ.data} totalLabel={donutTotal} />
      </div>

      {/* Secondary metrics strip */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'GST Collected', value: formatINR(overviewQ.data.gstCollected) },
          { label: 'Monthly Earnings', value: formatINR(overviewQ.data.monthlyEarnings) },
          { label: 'Upcoming Payments', value: formatINR(overviewQ.data.upcomingPayments) },
          {
            label: 'Recent Transactions',
            value: String(
              invoicesQ.data?.reduce((n, i) => n + i.payments.length, 0) ?? 0,
            ),
          },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-2xl border border-slate-100 bg-white/80 px-4 py-3 shadow-sm backdrop-blur"
          >
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {m.label}
            </p>
            <p className="mt-1 text-lg font-extrabold tabular-nums text-slate-900">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
        <div className={`min-w-0 flex-1 space-y-3 ${selectedInvoice ? 'xl:max-w-[calc(100%-360px)]' : ''}`}>
          <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900">Invoices</h2>
            </div>
            <InvoiceFiltersBar onExport={exportCsv} />
          </div>

          <InvoiceTable
            invoices={invoicesQ.pageItems}
            totalFiltered={invoicesQ.totalFiltered}
            totalPages={invoicesQ.totalPages}
            onView={setSelected}
            onDownload={downloadInvoice}
          />
        </div>

        {selectedInvoice ? (
          <div className="w-full shrink-0 xl:sticky xl:top-24 xl:w-[340px]">
            <InvoicePreviewPanel
              invoice={selectedInvoice}
              onClose={() => setSelected(null)}
              onRecordPayment={() => setRecordOpen(true)}
            />
          </div>
        ) : null}
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6B46FE] py-3 text-sm font-bold text-white"
        >
          <Plus className="h-4 w-4" />
          Create Invoice
        </button>
      </div>

      <CreateInvoiceModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(id) => setSelected(id)}
      />

      {selectedInvoice ? (
        <RecordPaymentModal
          invoice={selectedInvoice}
          open={recordOpen}
          onClose={() => setRecordOpen(false)}
        />
      ) : null}
    </div>
  );
}
