import { Heart, MessageCircle, Send, Bookmark, Volume2, VolumeX } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ReelActionsProps = {
  likes: string;
  comments: string;
  shares: string;
  liked: boolean;
  saved: boolean;
  muted: boolean;
  onLike: () => void;
  onSave: () => void;
  onMute: () => void;
};

function ActionButton({
  label,
  displayLabel,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  displayLabel?: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className="flex flex-col items-center gap-1 text-white disabled:opacity-60"
      aria-label={label}
    >
      <span
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-full bg-black/35 backdrop-blur-sm transition-transform active:scale-90',
          active && 'bg-white/20',
        )}
      >
        {children}
      </span>
      <span className="text-[11px] font-semibold drop-shadow-md">{displayLabel ?? label}</span>
    </button>
  );
}

export function ReelActions({
  likes,
  comments,
  shares,
  liked,
  saved,
  muted,
  onLike,
  onSave,
  onMute,
}: ReelActionsProps) {
  return (
    <div className="absolute bottom-28 right-3 z-20 flex flex-col items-center gap-4 sm:right-4">
      <ActionButton label={`Like, ${likes}`} displayLabel={likes} active={liked} onClick={onLike}>
        <Heart
          className={cn('h-6 w-6', liked ? 'fill-rose-500 text-rose-500' : 'text-white')}
          strokeWidth={liked ? 0 : 2}
        />
      </ActionButton>
      <ActionButton label={`Comments, ${comments}`} displayLabel={comments} disabled>
        <MessageCircle className="h-6 w-6 text-white" strokeWidth={2} />
      </ActionButton>
      <ActionButton label={`Shares, ${shares}`} displayLabel={shares} disabled>
        <Send className="h-5 w-5 text-white" strokeWidth={2} />
      </ActionButton>
      <ActionButton label={saved ? 'Saved' : 'Save'} active={saved} onClick={onSave}>
        <Bookmark
          className={cn('h-6 w-6', saved ? 'fill-white text-white' : 'text-white')}
          strokeWidth={2}
        />
      </ActionButton>
      <ActionButton label={muted ? 'Unmute' : 'Mute'} onClick={onMute}>
        {muted ? (
          <VolumeX className="h-5 w-5 text-white" strokeWidth={2} />
        ) : (
          <Volume2 className="h-5 w-5 text-white" strokeWidth={2} />
        )}
      </ActionButton>
    </div>
  );
}
