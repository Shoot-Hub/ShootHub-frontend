import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CalendarCheck2,
  CheckCheck,
  CreditCard,
  Heart,
  Images,
  MessageSquare,
  Sparkles,
  Star,
  Wallet,
} from 'lucide-react';
import {
  notificationPreferences,
  notificationTabs,
  unreadSummary,
  userNotifications,
  type NotificationCategory,
  type UserNotification,
} from '../data/notificationsData';

const iconMap: Record<
  UserNotification['icon'],
  { icon: typeof Bell; bg: string; color: string }
> = {
  calendar: { icon: CalendarCheck2, bg: 'bg-[#F3EEFF]', color: 'text-[#6B46FE]' },
  payment: { icon: Wallet, bg: 'bg-[#E8F8EF]', color: 'text-[#1B9C5A]' },
  message: { icon: MessageSquare, bg: 'bg-[#E8F1FF]', color: 'text-[#2F6FED]' },
  gallery: { icon: Images, bg: 'bg-[#FFF1E8]', color: 'text-[#E67E22]' },
  star: { icon: Star, bg: 'bg-[#FFF8E8]', color: 'text-[#F5A623]' },
  system: { icon: Bell, bg: 'bg-[#F3F4F8]', color: 'text-[#636E72]' },
  promo: { icon: Sparkles, bg: 'bg-[#F3EEFF]', color: 'text-[#6B46FE]' },
};

const prefIcons: Record<string, typeof Bell> = {
  bookings: CalendarCheck2,
  payments: CreditCard,
  messages: MessageSquare,
  galleries: Images,
  reviews: Star,
  promotions: Heart,
};

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<NotificationCategory>('all');
  const [items, setItems] = useState(userNotifications);
  const [prefs, setPrefs] = useState(notificationPreferences);

  const filtered = useMemo(() => {
    if (activeTab === 'all') return items;
    return items.filter((n) => n.category === activeTab);
  }, [activeTab, items]);

  const unreadCount = items.filter((n) => n.unread).length;

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markOneRead = (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  const togglePref = (id: string) => {
    setPrefs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)),
    );
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">Notifications</h2>
          <p className="mt-1 text-sm text-[#8B93A1]">
            Stay updated on bookings, deliveries, and messages.
          </p>
        </div>
        <button
          type="button"
          onClick={markAllRead}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#6B46FE] transition-colors hover:text-[#5530e8]"
        >
          <CheckCheck className="h-4 w-4" />
          Mark all as read
        </button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {notificationTabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition-all ${
                    active
                      ? 'border-[#6B46FE] bg-[#6B46FE] text-white shadow-sm shadow-[#6B46FE]/25'
                      : 'border-[#EEF0F4] bg-white text-[#2D3436] hover:border-[#6B46FE]/30 hover:text-[#6B46FE]'
                  }`}
                >
                  {tab.label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      active ? 'bg-white/20 text-white' : 'bg-[#F3EEFF] text-[#6B46FE]'
                    }`}
                  >
                    {tab.id === 'all' ? unreadCount : tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#EEF0F4] bg-white px-6 py-16 text-center">
              <Bell className="mx-auto h-8 w-8 text-[#C5C9D4]" />
              <p className="mt-3 text-sm font-semibold text-[#2D3436]">No notifications</p>
              <p className="mt-1 text-xs text-[#8B93A1]">You&apos;re all caught up in this category.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((item) => {
                const meta = iconMap[item.icon];
                const Icon = meta.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => markOneRead(item.id)}
                    className={`flex w-full gap-3 rounded-2xl border p-4 text-left transition-all sm:gap-4 sm:p-5 ${
                      item.unread
                        ? 'border-[#E8E0FF] bg-[#FCFAFF] shadow-[0_4px_16px_-8px_rgba(107,70,254,0.15)]'
                        : 'border-[#EEF0F4] bg-white hover:border-[#6B46FE]/20'
                    }`}
                  >
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        item.unread ? 'bg-[#6B46FE]' : 'bg-[#D1D5DB]'
                      }`}
                    />
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${meta.bg}`}
                    >
                      <Icon className={`h-5 w-5 ${meta.color}`} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="text-sm font-bold text-[#1A1A2E] sm:text-[15px]">
                          {item.title}
                        </h3>
                        <span className="shrink-0 text-[11px] font-medium text-[#A0A4B0]">
                          {item.time}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-[#5B6472] sm:text-sm">
                        {item.description}
                      </p>

                      {(item.thumbnail || item.amount || item.actionLabel) && (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt=""
                              className="h-12 w-16 rounded-lg object-cover"
                            />
                          ) : null}
                          {item.amount ? (
                            <span className="rounded-lg bg-[#E8F8EF] px-2.5 py-1.5 text-xs font-bold text-[#1B9C5A]">
                              {item.amount}
                            </span>
                          ) : null}
                          {item.actionLabel ? (
                            <span className="rounded-xl border border-[#6B46FE] px-3 py-1.5 text-xs font-semibold text-[#6B46FE]">
                              {item.actionLabel}
                            </span>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-[#EEF0F4] bg-white p-5 shadow-[0_4px_16px_-8px_rgba(17,24,39,0.08)]">
            <h3 className="text-sm font-bold text-[#1A1A2E]">Notification Preferences</h3>
            <div className="mt-4 space-y-3">
              {prefs.map((pref) => {
                const Icon = prefIcons[pref.id] ?? Bell;
                return (
                  <div key={pref.id} className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F3EEFF] text-[#6B46FE]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-semibold text-[#2D3436]">{pref.label}</span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={pref.enabled}
                      onClick={() => togglePref(pref.id)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        pref.enabled ? 'bg-[#6B46FE]' : 'bg-[#D1D5DB]'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          pref.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-[#EEF0F4] bg-white p-5 shadow-[0_4px_16px_-8px_rgba(17,24,39,0.08)]">
            <h3 className="text-sm font-bold text-[#1A1A2E]">Unread Summary</h3>
            <ul className="mt-4 space-y-2.5">
              {unreadSummary.map((row) => (
                <li key={row.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[#5B6472]">{row.label}</span>
                  <span
                    className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-bold ${
                      row.count > 0
                        ? 'bg-[#F3EEFF] text-[#6B46FE]'
                        : 'bg-[#F3F4F8] text-[#A0A4B0]'
                    }`}
                  >
                    {row.count}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              to="/user/notifications"
              className="mt-4 block w-full rounded-xl border border-[#EEF0F4] py-2.5 text-center text-sm font-semibold text-[#6B46FE] transition-colors hover:bg-[#F3EEFF]"
            >
              View All Notifications
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
