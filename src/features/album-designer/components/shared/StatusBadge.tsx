import type { AlbumStatus } from '../../types';
import { cn } from '@/lib/utils';

const STYLES: Record<AlbumStatus, string> = {
  draft: 'bg-[#F3EEFF] text-[#6B46FE]',
  in_progress: 'bg-[#FFF4E5] text-[#E0A100]',
  completed: 'bg-[#E4F8ED] text-[#28C76F]',
};

const LABELS: Record<AlbumStatus, string> = {
  draft: 'Draft',
  in_progress: 'In Progress',
  completed: 'Completed',
};

export function StatusBadge({ status }: { status: AlbumStatus }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold',
        STYLES[status],
      )}
    >
      {LABELS[status]}
    </span>
  );
}
