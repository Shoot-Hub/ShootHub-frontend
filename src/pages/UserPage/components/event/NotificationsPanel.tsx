import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { DashboardNotification } from '../../types/dashboard.types';
import { GlassCard } from '../shared/GlassCard';

interface NotificationsPanelProps {
  notifications: DashboardNotification[];
}

export function NotificationsPanel({ notifications }: NotificationsPanelProps) {
  return (
    <GlassCard className="p-5 sm:p-6" hover={false}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-[#6B46FE]" />
          <h3 className="text-sm font-bold text-[#111827]">Notifications</h3>
        </div>
        <Link to="/user/notifications" className="text-xs font-semibold text-[#6B46FE]">
          View all
        </Link>
      </div>

      <ul className="space-y-3">
        {notifications.map((item) => (
          <li
            key={item.id}
            className={`rounded-2xl border px-3.5 py-3 ${
              item.unread ? 'border-[#6B46FE]/20 bg-[#F8F6FF]' : 'border-[#F3F4F6] bg-[#FAFAFA]'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-bold text-[#111827]">{item.title}</p>
              {item.unread ? (
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#6B46FE]" />
              ) : null}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-[#6B7280]">{item.message}</p>
            <p className="mt-1.5 text-[10px] font-semibold text-[#9CA3AF]">{item.time}</p>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
