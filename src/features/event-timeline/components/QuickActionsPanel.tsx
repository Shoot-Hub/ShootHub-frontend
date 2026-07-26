import {
  Bell,
  CalendarPlus,
  Download,
  Pencil,
  Share2,
} from 'lucide-react';

type Props = {
  onAdd: () => void;
  onEdit: () => void;
  onRemind: () => void;
  onShare: () => void;
  onDownload: () => void;
};

const ACTIONS = [
  { key: 'add', label: 'Add New Event', icon: CalendarPlus },
  { key: 'edit', label: 'Edit Timeline', icon: Pencil },
  { key: 'remind', label: 'Send Reminder', icon: Bell },
  { key: 'share', label: 'Share Timeline', icon: Share2 },
  { key: 'download', label: 'Download Schedule', icon: Download },
] as const;

export function QuickActionsPanel({
  onAdd,
  onEdit,
  onRemind,
  onShare,
  onDownload,
}: Props) {
  const handlers = {
    add: onAdd,
    edit: onEdit,
    remind: onRemind,
    share: onShare,
    download: onDownload,
  } as const;

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-extrabold text-slate-900">Quick Actions</h3>
      <ul className="mt-2 space-y-0.5">
        {ACTIONS.map(({ key, label, icon: Icon }) => (
          <li key={key}>
            <button
              type="button"
              onClick={handlers[key]}
              className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2.5 text-left text-sm font-semibold text-slate-600 transition hover:bg-[#F3EEFF] hover:text-[#6B46FE]"
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
