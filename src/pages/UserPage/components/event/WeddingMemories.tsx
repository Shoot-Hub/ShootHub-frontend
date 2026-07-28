import type { MemoryHighlight } from '../../types/dashboard.types';

interface WeddingMemoriesProps {
  memories: MemoryHighlight[];
}

export function WeddingMemories({ memories }: WeddingMemoriesProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {memories.map((memory, index) => (
        <article
          key={memory.id}
          className={`group relative overflow-hidden rounded-3xl shadow-[0_16px_40px_-16px_rgba(17,24,39,0.35)] ${
            index === 0 ? 'sm:row-span-1 min-h-[280px]' : 'min-h-[220px]'
          }`}
        >
          <img
            src={memory.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <h3 className="text-base font-bold text-white">{memory.title}</h3>
            <p className="mt-1 text-xs text-white/75">{memory.caption}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
