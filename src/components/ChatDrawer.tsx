import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCheck,
  ListFilter,
  MessageCircle,
  Search,
  Send,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

type ChatDrawerProps = {
  open: boolean;
  onClose: () => void;
};

type ChatPreview = {
  id: string;
  name: string;
  initials: string;
  color: string;
  preview: string;
  time: string;
  unread: number;
};

type ChatMessage = {
  id: string;
  text: string;
  time: string;
  isMe: boolean;
};

const conversations: ChatPreview[] = [
  {
    id: '1',
    name: 'Arla Moore',
    initials: 'AM',
    color: 'from-[#6B46FE] to-[#8A60FF]',
    preview: 'Sure, I can do your wedding tomorrow!',
    time: '2m',
    unread: 2,
  },
  {
    id: '2',
    name: 'Kabir Rao',
    initials: 'KR',
    color: 'from-[#0ea5a3] to-[#14b8a6]',
    preview: 'Sending the reel draft tonight.',
    time: '1h',
    unread: 1,
  },
  {
    id: '3',
    name: 'Noor Fatima',
    initials: 'NF',
    color: 'from-[#1e293b] to-[#334155]',
    preview: 'Drone package starts at ₹38,000.',
    time: 'Yesterday',
    unread: 3,
  },
  {
    id: '4',
    name: 'Ishaan Verma',
    initials: 'IV',
    color: 'from-[#ff8a00] to-[#ea580c]',
    preview: 'Studio is free this Saturday.',
    time: 'Mon',
    unread: 0,
  },
  {
    id: '5',
    name: 'Meher Das',
    initials: 'MD',
    color: 'from-[#F472B6] to-[#EC4899]',
    preview: 'Pre-wedding dates look good.',
    time: 'Sun',
    unread: 0,
  },
];

const demoThread: ChatMessage[] = [
  {
    id: 'm1',
    text: 'Hi! I saw your ShootHub profile — looking for a wedding photographer.',
    time: '10:24 AM',
    isMe: true,
  },
  {
    id: 'm2',
    text: 'Hello! Thank you for reaching out 😊 When is the wedding?',
    time: '10:26 AM',
    isMe: false,
  },
  {
    id: 'm3',
    text: 'December 12 in Mumbai. Do you have availability?',
    time: '10:28 AM',
    isMe: true,
  },
  {
    id: 'm4',
    text: 'Sure, I can do your wedding tomorrow!',
    time: '10:30 AM',
    isMe: false,
  },
];

export function ChatDrawer({ open, onClose }: ChatDrawerProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState(demoThread);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) {
      setActiveId(null);
      setDraft('');
      setQuery('');
      return;
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeId) setActiveId(null);
        else onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, activeId]);

  const activeChat = conversations.find((c) => c.id === activeId);
  const filtered = conversations.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()),
  );

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        text,
        time: 'Now',
        isMe: true,
      },
    ]);
    setDraft('');
  };

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[10050]" role="dialog" aria-modal="true" aria-label="Chat">
          <motion.button
            type="button"
            aria-label="Close chat"
            className="absolute inset-0 bg-[#0F172A]/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute inset-y-0 right-0 flex w-full max-w-[380px] flex-col overflow-hidden rounded-l-[20px] bg-white shadow-[-16px_0_48px_-12px_rgba(15,23,42,0.22)] sm:my-3 sm:mr-3 sm:max-h-[calc(100%-24px)] sm:rounded-[20px]"
          >
            {/* Header */}
            <div className="flex items-start gap-3 border-b border-[#F3F4F6] px-5 pb-4 pt-5">
              {activeChat ? (
                <button
                  type="button"
                  onClick={() => setActiveId(null)}
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#636E72] hover:bg-[#F8F9FB]"
                  aria-label="Back to chats"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              ) : (
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6B46FE] text-white shadow-sm shadow-[#6B46FE]/25">
                  <MessageCircle className="h-[18px] w-[18px]" strokeWidth={2.25} />
                </span>
              )}

              <div className="min-w-0 flex-1 pt-0.5">
                <h2 className="truncate text-[17px] font-bold leading-tight text-[#111827]">
                  {activeChat ? activeChat.name : 'Messages'}
                </h2>
                <p className="mt-0.5 truncate text-[12px] text-[#9CA3AF]">
                  {activeChat ? 'Chat with this creator' : 'Chat with creators on ShootHub'}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#9CA3AF] transition-colors hover:bg-[#F8F9FB] hover:text-[#111827]"
                aria-label="Close"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>

            {!activeChat ? (
              <>
                {/* Search + filter */}
                <div className="flex items-center gap-2.5 px-5 pb-2 pt-4">
                  <div className="relative min-w-0 flex-1">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search chats..."
                      className="h-11 w-full rounded-xl border-0 bg-[#F3F4F6] pl-10 pr-3 text-sm text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:ring-2 focus:ring-[#6B46FE]/20"
                    />
                  </div>
                  <button
                    type="button"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F3F4F6] text-[#6B7280] transition-colors hover:bg-[#E5E7EB] hover:text-[#111827]"
                    aria-label="Filter chats"
                  >
                    <ListFilter className="h-[18px] w-[18px]" strokeWidth={2.25} />
                  </button>
                </div>

                {/* Chat list */}
                <div className="flex-1 overflow-y-auto px-3 py-2">
                  {filtered.length === 0 ? (
                    <p className="px-3 py-10 text-center text-sm text-[#9CA3AF]">No chats found</p>
                  ) : (
                    filtered.map((chat, index) => {
                      const isActiveRow = index === 0 && !query;
                      return (
                        <button
                          key={chat.id}
                          type="button"
                          onClick={() => {
                            setActiveId(chat.id);
                            setMessages(demoThread);
                          }}
                          className={cn(
                            'flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors',
                            isActiveRow ? 'bg-[#F3EEFF]' : 'hover:bg-[#F8F9FB]',
                          )}
                        >
                          <div
                            className={cn(
                              'flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[13px] font-bold text-white',
                              chat.color,
                            )}
                          >
                            {chat.initials}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="truncate text-[14px] font-bold text-[#111827]">
                                {chat.name}
                              </p>
                              <span className="shrink-0 text-[11px] font-medium text-[#9CA3AF]">
                                {chat.time}
                              </span>
                            </div>
                            <div className="mt-0.5 flex items-center justify-between gap-2">
                              <p className="truncate text-[12px] text-[#6B7280]">{chat.preview}</p>
                              {chat.unread > 0 ? (
                                <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#6B46FE] px-1.5 text-[10px] font-bold text-white">
                                  {chat.unread}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Footer CTA */}
                <div className="border-t border-[#F3F4F6] p-4">
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#F3EEFF] text-sm font-bold text-[#6B46FE] transition-colors hover:bg-[#EDE5FF]"
                  >
                    <MessageCircle className="h-4 w-4" strokeWidth={2.25} />
                    View all messages ›
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto bg-[#F8F9FB] px-4 py-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn('flex', msg.isMe ? 'justify-end' : 'justify-start')}
                    >
                      <div
                        className={cn(
                          'max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm',
                          msg.isMe
                            ? 'rounded-br-md bg-[#6B46FE] text-white'
                            : 'rounded-bl-md bg-white text-[#111827]',
                        )}
                      >
                        <p>{msg.text}</p>
                        <p
                          className={cn(
                            'mt-1 flex items-center justify-end gap-1 text-[10px]',
                            msg.isMe ? 'text-white/70' : 'text-[#A0A4B0]',
                          )}
                        >
                          {msg.time}
                          {msg.isMe ? <CheckCheck className="h-3 w-3" /> : null}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#EEF0F4] bg-white p-3">
                  <div className="flex items-center gap-2">
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') sendMessage();
                      }}
                      placeholder="Type a message..."
                      className="h-11 flex-1 rounded-xl border-0 bg-[#F3F4F6] px-3.5 text-sm outline-none focus:ring-2 focus:ring-[#6B46FE]/20"
                    />
                    <button
                      type="button"
                      onClick={sendMessage}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#6B46FE] text-white shadow-md shadow-[#6B46FE]/30 transition-colors hover:bg-[#5A38E8]"
                      aria-label="Send"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
