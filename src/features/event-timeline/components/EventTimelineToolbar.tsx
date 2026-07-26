import { Download, Plus, Printer, Share2 } from 'lucide-react';

type Props = {
  onShare: () => void;
  onDownloadPdf: () => void;
  onPrint: () => void;
  onAddEvent: () => void;
};

export function EventTimelineToolbar({
  onShare,
  onDownloadPdf,
  onPrint,
  onAddEvent,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-extrabold tracking-tight text-[#2e1065] sm:text-2xl">
          Event Timeline
        </h1>
        <p className="mt-0.5 text-sm text-slate-500">Your complete wedding day schedule</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onDownloadPdf}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </button>
        <button
          type="button"
          onClick={onPrint}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          <Printer className="h-4 w-4" />
          Print
        </button>
        <button
          type="button"
          onClick={onShare}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#6B46FE] px-3.5 py-2 text-sm font-bold text-white shadow-lg shadow-[#6B46FE]/25 transition hover:bg-[#5A2FE0]"
        >
          <Share2 className="h-4 w-4" />
          Share Timeline
        </button>
        <button
          type="button"
          onClick={onAddEvent}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#6B46FE]/25 bg-[#F3EEFF] px-3.5 py-2 text-sm font-bold text-[#6B46FE] transition hover:bg-[#EBE4FF]"
        >
          <Plus className="h-4 w-4" />
          Add Event
        </button>
      </div>
    </div>
  );
}
