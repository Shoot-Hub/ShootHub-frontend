import { ScanFace } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../shared/GlassCard';

interface AiFaceSearchCardProps {
  ready: boolean;
  facesIndexed: number;
}

export function AiFaceSearchCard({ ready, facesIndexed }: AiFaceSearchCardProps) {
  return (
    <GlassCard className="relative overflow-hidden p-5 sm:p-6" hover={false}>
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#6B46FE]/10 blur-2xl" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#6B46FE] text-white shadow-lg shadow-[#6B46FE]/30">
            <ScanFace className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-base font-bold text-[#111827]">AI Face Search</h3>
            <p className="mt-1 text-sm text-[#6B7280]">
              {ready
                ? `${facesIndexed} faces indexed across your shared galleries.`
                : 'Face indexing will unlock once galleries are shared.'}
            </p>
          </div>
        </div>
        <Link
          to="/user/ai-face-search"
          className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-[#111827] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-black"
        >
          Find My Photos
        </Link>
      </div>
    </GlassCard>
  );
}
