import { useMemo, useState } from 'react';
import {
  CheckCheck,
  Filter,
  Info,
  MoreVertical,
  Paperclip,
  Phone,
  Search,
  Send,
  Smile,
  SquarePen,
  Video,
} from 'lucide-react';
import { conversations } from '../data/messagesData';

type MessageTab = 'all' | 'unread' | 'bookings';

export function MessagesPage() {
  const [activeTab, setActiveTab] = useState<MessageTab>('all');
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState(conversations[0]?.id ?? '');
  const [draft, setDraft] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return conversations.filter((c) => {
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q);
      if (activeTab === 'unread') return matchesQuery && c.unread > 0;
      if (activeTab === 'bookings') return matchesQuery && Boolean(c.booking);
      return matchesQuery;
    });
  }, [activeTab, query]);

  const active = conversations.find((c) => c.id === activeId) ?? filtered[0] ?? null;
  const unreadCount = conversations.reduce((sum, c) => sum + c.unread, 0);

  return (
    <section className="flex h-[calc(100dvh-8rem)] min-h-[560px] flex-col overflow-hidden rounded-2xl border border-[#EEF0F4] bg-white shadow-[0_4px_20px_-8px_rgba(17,24,39,0.08)] lg:h-[calc(100vh-8.5rem)]">
      <div className="grid min-h-0 flex-1 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* Conversation list */}
        <div className="flex min-h-0 flex-col border-b border-[#EEF0F4] lg:border-b-0 lg:border-r">
          <div className="shrink-0 space-y-3 border-b border-[#EEF0F4] p-4">
            <div>
              <h2 className="text-xl font-bold text-[#1A1A2E]">Messages</h2>
              <p className="mt-0.5 text-xs text-[#8B93A1]">
                Chat with photographers about your bookings and shoots.
              </p>
            </div>
            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A4B0]" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="h-10 w-full rounded-xl border border-[#EEF0F4] bg-[#F8F9FB] py-2 pl-9 pr-3 text-sm outline-none focus:border-[#6B46FE]/40 focus:bg-white focus:ring-2 focus:ring-[#6B46FE]/15"
                />
              </div>
              <button
                type="button"
                aria-label="Filter"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#EEF0F4] text-[#636E72] hover:text-[#6B46FE]"
              >
                <Filter className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-2">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'unread', label: 'Unread' },
                  { id: 'bookings', label: 'Bookings' },
                ] as const
              ).map((tab) => {
                const activeTabState = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                      activeTabState
                        ? 'bg-[#6B46FE] text-white'
                        : 'bg-[#F8F9FB] text-[#5B6472] hover:text-[#6B46FE]'
                    }`}
                  >
                    {tab.label}
                    {tab.id === 'unread' && unreadCount > 0 ? (
                      <span
                        className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] ${
                          activeTabState ? 'bg-white text-[#6B46FE]' : 'bg-[#6B46FE] text-white'
                        }`}
                      >
                        {unreadCount}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {filtered.map((chat) => {
              const selected = active?.id === chat.id;
              return (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => setActiveId(chat.id)}
                  className={`relative flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors ${
                    selected ? 'bg-[#F3EEFF]' : 'hover:bg-[#F8F9FB]'
                  }`}
                >
                  {selected ? (
                    <span className="absolute inset-y-3 left-0 w-[3px] rounded-r-full bg-[#6B46FE]" />
                  ) : null}
                  <div className="relative shrink-0">
                    <img
                      src={chat.avatar}
                      alt=""
                      className="h-11 w-11 rounded-full object-cover"
                    />
                    {chat.online ? (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#1B9C5A]" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-bold text-[#1A1A2E]">{chat.name}</p>
                      <span className="shrink-0 text-[11px] text-[#A0A4B0]">{chat.time}</span>
                    </div>
                    <div className="mt-0.5 flex items-center justify-between gap-2">
                      <p className="truncate text-xs text-[#8B93A1]">{chat.lastMessage}</p>
                      {chat.unread > 0 ? (
                        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#6B46FE] px-1.5 text-[10px] font-bold text-white">
                          {chat.unread}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat window */}
        {active ? (
          <div className="flex min-h-0 flex-col">
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#EEF0F4] px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative">
                  <img
                    src={active.avatar}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  {active.online ? (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#1B9C5A]" />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#1A1A2E]">{active.name}</p>
                  <p className="text-[11px] font-medium text-[#1B9C5A]">
                    {active.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="hidden h-9 w-9 items-center justify-center rounded-xl text-[#636E72] hover:bg-[#F8F9FB] hover:text-[#6B46FE] sm:flex"
                  aria-label="Call"
                >
                  <Phone className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="hidden h-9 w-9 items-center justify-center rounded-xl text-[#636E72] hover:bg-[#F8F9FB] hover:text-[#6B46FE] sm:flex"
                  aria-label="Video"
                >
                  <Video className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[#636E72] hover:bg-[#F8F9FB] hover:text-[#6B46FE]"
                  aria-label="Info"
                >
                  <Info className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[#636E72] hover:bg-[#F8F9FB] hover:text-[#6B46FE]"
                  aria-label="More"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="ml-1 hidden items-center gap-1.5 rounded-xl bg-[#6B46FE] px-3 py-2 text-xs font-bold text-white sm:inline-flex"
                >
                  <SquarePen className="h-3.5 w-3.5" />
                  New Message
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-[#FAFBFC] p-4">
              {active.booking ? (
                <div className="flex flex-col gap-3 rounded-2xl border border-[#EEF0F4] bg-white p-3 sm:flex-row sm:items-center">
                  <img
                    src={active.booking.coverImage}
                    alt=""
                    className="h-16 w-full rounded-xl object-cover sm:h-14 sm:w-20"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-[#1A1A2E]">{active.booking.title}</p>
                      <span className="rounded-full bg-[#E8F8EF] px-2 py-0.5 text-[10px] font-bold text-[#1B9C5A]">
                        {active.booking.status}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-[#8B93A1]">
                      {active.booking.date} · {active.booking.time} · {active.booking.venue},{' '}
                      {active.booking.city}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-xl border border-[#6B46FE] px-3 py-2 text-xs font-semibold text-[#6B46FE] hover:bg-[#F3EEFF]"
                  >
                    View Booking
                  </button>
                </div>
              ) : null}

              <div className="flex justify-center">
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#A0A4B0] shadow-sm">
                  Today
                </span>
              </div>

              {active.messages.map((msg) => {
                const mine = msg.sender === 'me';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm sm:max-w-[70%] ${
                        mine
                          ? 'rounded-br-md bg-[#F3EEFF] text-[#1A1A2E]'
                          : 'rounded-bl-md bg-white text-[#1A1A2E] shadow-sm'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <div
                        className={`mt-1 flex items-center gap-1 text-[10px] ${
                          mine ? 'justify-end text-[#8B93A1]' : 'text-[#A0A4B0]'
                        }`}
                      >
                        <span>{msg.time}</span>
                        {mine ? <CheckCheck className="h-3 w-3 text-[#6B46FE]" /> : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="shrink-0 border-t border-[#EEF0F4] bg-white p-3 sm:p-4">
              <div className="flex items-center gap-2 rounded-2xl border border-[#EEF0F4] bg-[#F8F9FB] px-2 py-1.5">
                <button
                  type="button"
                  aria-label="Attach"
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[#636E72] hover:text-[#6B46FE]"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type your message..."
                  className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#A0A4B0]"
                />
                <button
                  type="button"
                  aria-label="Emoji"
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[#636E72] hover:text-[#6B46FE]"
                >
                  <Smile className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Send"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6B46FE] text-white shadow-md shadow-[#6B46FE]/25 hover:bg-[#5530e8]"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center text-sm text-[#8B93A1]">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </section>
  );
}
