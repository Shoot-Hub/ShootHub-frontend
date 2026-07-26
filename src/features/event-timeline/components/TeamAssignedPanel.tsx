import { MessageCircle, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import type { TimelineTeamMember } from '../types';

type Props = {
  team: TimelineTeamMember[];
};

export function TeamAssignedPanel({ team }: Props) {
  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-extrabold text-slate-900">Team Assigned</h3>
      <ul className="mt-3 space-y-2.5">
        {team.slice(0, 5).map((member) => (
          <li key={member.id} className="flex items-center gap-2.5">
            <img
              src={member.avatar}
              alt={member.name}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-white shadow"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-800">{member.name}</p>
              <p className="truncate text-[11px] text-slate-400">{member.roleLabel}</p>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                aria-label={`Call ${member.name}`}
                onClick={() => toast.success(member.phone ? `Calling ${member.name}` : 'No phone on file')}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-[#F3EEFF] hover:text-[#6B46FE]"
              >
                <Phone className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                aria-label={`Message ${member.name}`}
                onClick={() => toast.success(`Opening chat with ${member.name}`)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-[#F3EEFF] hover:text-[#6B46FE]"
              >
                <MessageCircle className="h-3.5 w-3.5" />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => toast('Full team roster — coming soon')}
        className="mt-3 w-full rounded-xl border border-slate-200 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
      >
        View Full Team
      </button>
    </section>
  );
}
