import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  ChevronLeft,
  Check,
  CheckCheck,
  Paperclip,
  Smile,
  ImageIcon,
  Star,
  Trash2,
  Plus,
} from 'lucide-react';

type Message = {
  id: string;
  text: string;
  time: string;
  isMe: boolean;
  read?: boolean;
};

type Conversation = {
  id: string;
  name: string;
  initials: string;
  color: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  starred: boolean;
  messages: Message[];
};

const DEMO_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    initials: 'PS',
    color: 'bg-gradient-to-br from-[#F472B6] to-[#EC4899]',
    lastMessage: 'Can you share the wedding album link?',
    time: '2m ago',
    unread: 3,
    online: true,
    starred: true,
    messages: [
      {
        id: 'm1',
        text: "Hi! I loved the photos from my sister's wedding 😍",
        time: '10:30 AM',
        isMe: false,
      },
      {
        id: 'm2',
        text: "Thank you so much! It was a beautiful day. I'm glad you liked them!",
        time: '10:32 AM',
        isMe: true,
        read: true,
      },
      {
        id: 'm3',
        text: 'Can you share the full wedding album link please?',
        time: '10:35 AM',
        isMe: false,
      },
      {
        id: 'm4',
        text: "Sure! I'll send the Google Drive link shortly. All edited photos are ready.",
        time: '10:36 AM',
        isMe: true,
        read: true,
      },
      {
        id: 'm5',
        text: 'Can you share the wedding album link?',
        time: '10:38 AM',
        isMe: false,
      },
    ],
  },
  {
    id: '2',
    name: 'Rahul Mehta',
    initials: 'RM',
    color: 'bg-gradient-to-br from-[#60A5FA] to-[#3B82F6]',
    lastMessage: 'Looking forward to the pre-wedding shoot!',
    time: '1h ago',
    unread: 1,
    online: true,
    starred: false,
    messages: [
      {
        id: 'm1',
        text: 'Hi, I booked a pre-wedding shoot for next Saturday.',
        time: '9:00 AM',
        isMe: false,
        read: true,
      },
      {
        id: 'm2',
        text: "Perfect! I've received your booking. I'll send the location details soon.",
        time: '9:05 AM',
        isMe: true,
        read: true,
      },
      {
        id: 'm3',
        text: 'Looking forward to the pre-wedding shoot!',
        time: '9:10 AM',
        isMe: false,
      },
    ],
  },
  {
    id: '3',
    name: 'Ananya Gupta',
    initials: 'AG',
    color: 'bg-gradient-to-br from-[#A78BFA] to-[#7C3AED]',
    lastMessage: 'The portraits turned out amazing 🔥',
    time: 'Yesterday',
    unread: 0,
    online: false,
    starred: true,
    messages: [
      {
        id: 'm1',
        text: 'Just saw the portrait session photos!',
        time: 'Yesterday 3:00 PM',
        isMe: false,
        read: true,
      },
      {
        id: 'm2',
        text: 'The portraits turned out amazing 🔥',
        time: 'Yesterday 3:01 PM',
        isMe: false,
        read: true,
      },
      {
        id: 'm3',
        text: 'So happy you love them! You were a natural in front of the camera 😊',
        time: 'Yesterday 3:15 PM',
        isMe: true,
        read: true,
      },
    ],
  },
  {
    id: '4',
    name: 'Vikram Singh',
    initials: 'VS',
    color: 'bg-gradient-to-br from-[#34D399] to-[#10B981]',
    lastMessage: 'Is there a corporate package available?',
    time: '2d ago',
    unread: 0,
    online: false,
    starred: false,
    messages: [
      {
        id: 'm1',
        text: "Hello, I'm looking for corporate event photography.",
        time: '2d ago',
        isMe: false,
        read: true,
      },
      {
        id: 'm2',
        text: 'Is there a corporate package available?',
        time: '2d ago',
        isMe: false,
        read: true,
      },
      {
        id: 'm3',
        text: 'Yes! I have a dedicated corporate package. Let me send you the details.',
        time: '2d ago',
        isMe: true,
        read: true,
      },
    ],
  },
  {
    id: '5',
    name: 'Neha Patel',
    initials: 'NP',
    color: 'bg-gradient-to-br from-[#FBBF24] to-[#F59E0B]',
    lastMessage: 'Thanks for the quick turnaround!',
    time: '3d ago',
    unread: 0,
    online: false,
    starred: false,
    messages: [
      {
        id: 'm1',
        text: 'Thanks for the quick turnaround!',
        time: '3d ago',
        isMe: false,
        read: true,
      },
      {
        id: 'm2',
        text: 'Always happy to help! Looking forward to your next event.',
        time: '3d ago',
        isMe: true,
        read: true,
      },
    ],
  },
];

type FilterTab = 'All' | 'Unread' | 'Starred';

function Avatar({
  conv,
  size = 'md',
}: {
  conv: Conversation;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sz =
    size === 'sm' ? 'h-9 w-9 text-xs' : size === 'lg' ? 'h-11 w-11 text-sm' : 'h-10 w-10 text-sm';
  const dot = size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3';

  return (
    <div className="relative shrink-0">
      <div
        className={`${sz} flex items-center justify-center rounded-full font-bold text-white shadow-sm ${conv.color}`}
      >
        {conv.initials}
      </div>
      {conv.online && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 ${dot} rounded-full border-2 border-white bg-[#28C76F]`}
        />
      )}
    </div>
  );
}

function Bubble({ msg }: { msg: Message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          msg.isMe
            ? 'rounded-br-md bg-gradient-to-br from-[#6B46FE] to-[#8A60FF] text-white shadow-md shadow-[#6B46FE]/20'
            : 'rounded-bl-md border border-[#EEF0F4] bg-white text-[#2D3436] shadow-sm'
        }`}
      >
        <p>{msg.text}</p>
        <div
          className={`mt-1 flex items-center gap-1 ${msg.isMe ? 'justify-end' : 'justify-start'}`}
        >
          <span className={`text-[10px] ${msg.isMe ? 'text-white/70' : 'text-[#A0A4B0]'}`}>
            {msg.time}
          </span>
          {msg.isMe &&
            (msg.read ? (
              <CheckCheck className="h-3.5 w-3.5 text-[#93C5FD]" />
            ) : (
              <Check className="h-3.5 w-3.5 text-white/60" />
            ))}
        </div>
      </div>
    </motion.div>
  );
}

export function MessagesPage() {
  const [conversations, setConversations] = useState(DEMO_CONVERSATIONS);
  const [activeId, setActiveId] = useState<string>('1');
  const [inputText, setInputText] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterTab>('All');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeId) ?? null;

  const filtered = conversations.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'Unread') return c.unread > 0;
    if (filter === 'Starred') return c.starred;
    return true;
  });

  const unreadTotal = conversations.reduce((sum, c) => sum + c.unread, 0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeId, activeConv?.messages.length]);

  const handleSelectConv = (id: string) => {
    setActiveId(id);
    setShowMobileChat(true);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)),
    );
  };

  const handleSend = () => {
    if (!inputText.trim() || !activeId) return;
    const text = inputText.trim();
    setInputText('');
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              lastMessage: text,
              time: 'Just now',
              messages: [
                ...c.messages,
                {
                  id: `m-${Date.now()}`,
                  text,
                  time: new Date().toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  }),
                  isMe: true,
                  read: false,
                },
              ],
            }
          : c,
      ),
    );
  };

  const ListPanel = (
    <div className="flex h-full w-full shrink-0 flex-col border-r border-[#EEF0F4] bg-white lg:w-[320px]">
      <div className="border-b border-[#EEF0F4] px-4 pb-3 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#2D3436]">Messages</h2>
          <div className="flex items-center gap-1">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[#A0A4B0] transition-colors hover:bg-[#F8F9FB] hover:text-[#EA5455]">
              <Trash2 className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6B46FE] text-white shadow-sm shadow-[#6B46FE]/25 transition-colors hover:bg-[#5A3AE8]">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A4B0]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="h-10 w-full rounded-xl border border-[#EEF0F4] bg-[#F8F9FB] py-2 pl-9 pr-3 text-sm text-[#2D3436] outline-none placeholder:text-[#A0A4B0] focus:border-[#6B46FE]/40 focus:bg-white focus:ring-2 focus:ring-[#6B46FE]/15"
          />
        </div>
      </div>

      <div className="flex gap-2 border-b border-[#F5F6F8] px-4 py-2.5">
        {(['All', 'Unread', 'Starred'] as FilterTab[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
              filter === f
                ? 'bg-[#6B46FE] text-white shadow-sm shadow-[#6B46FE]/25'
                : 'bg-[#F5F6F8] text-[#636E72] hover:bg-[#EEF0F4]'
            }`}
          >
            {f}
            {f === 'Unread' && unreadTotal > 0 && (
              <span
                className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold ${
                  filter === f ? 'bg-white/25 text-white' : 'bg-[#EA5455] text-white'
                }`}
              >
                {unreadTotal}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
            <MessageSquare className="mb-3 h-10 w-10 text-[#E0D4FF]" />
            <p className="text-sm text-[#A0A4B0]">No conversations found</p>
          </div>
        ) : (
          filtered.map((conv) => {
            const active = conv.id === activeId;
            return (
              <button
                key={conv.id}
                onClick={() => handleSelectConv(conv.id)}
                className={`flex w-full items-center gap-3 border-l-[3px] px-4 py-3.5 text-left transition-all ${
                  active
                    ? 'border-[#6B46FE] bg-[#F3EEFF]'
                    : 'border-transparent hover:bg-[#F8F9FB]'
                }`}
              >
                <Avatar conv={conv} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`truncate text-sm font-bold ${
                        active ? 'text-[#6B46FE]' : 'text-[#2D3436]'
                      }`}
                    >
                      {conv.name}
                    </span>
                    <div className="flex shrink-0 items-center gap-1">
                      {conv.starred && (
                        <Star className="h-3 w-3 fill-[#FF9F43] text-[#FF9F43]" />
                      )}
                      <span className="text-[11px] text-[#A0A4B0]">{conv.time}</span>
                    </div>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <p className="flex-1 truncate text-xs text-[#636E72]">{conv.lastMessage}</p>
                    {conv.unread > 0 && (
                      <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#6B46FE] px-1 text-[10px] font-bold text-white">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );

  const ChatPanel = (
    <div className="flex min-h-0 flex-1 flex-col bg-[#FAFBFC]">
      {!activeConv ? (
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#F3EEFF]">
            <MessageSquare className="h-10 w-10 text-[#6B46FE]" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-[#2D3436]">Your Messages</h3>
          <p className="max-w-xs text-sm leading-relaxed text-[#A0A4B0]">
            Select a conversation from the left to start chatting with your clients
          </p>
        </div>
      ) : (
        <>
          {/* Chat header */}
          <div className="flex shrink-0 items-center gap-3 border-b border-[#EEF0F4] bg-white px-4 py-3 shadow-sm">
            <button
              onClick={() => setShowMobileChat(false)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-[#636E72] hover:bg-[#F8F9FB] lg:hidden"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <Avatar conv={activeConv} size="md" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#2D3436]">{activeConv.name}</p>
              <p className="text-xs">
                {activeConv.online ? (
                  <span className="font-semibold text-[#28C76F]">● Online</span>
                ) : (
                  <span className="text-[#A0A4B0]">Last seen recently</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-0.5">
              <button className="flex h-9 w-9 items-center justify-center rounded-xl text-[#636E72] transition-colors hover:bg-[#F8F9FB]">
                <Phone className="h-4 w-4" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-xl text-[#636E72] transition-colors hover:bg-[#F8F9FB]">
                <Video className="h-4 w-4" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-xl text-[#636E72] transition-colors hover:bg-[#F8F9FB]">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-[#EEF0F4]" />
              <span className="px-2 text-[11px] font-medium text-[#A0A4B0]">Today</span>
              <div className="h-px flex-1 bg-[#EEF0F4]" />
            </div>

            {activeConv.messages.map((msg) => (
              <Bubble key={msg.id} msg={msg} />
            ))}

            {activeConv.online && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-[#EEF0F4] bg-white px-4 py-3 shadow-sm">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-2 w-2 animate-bounce rounded-full bg-[#6B46FE]"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 border-t border-[#EEF0F4] bg-white px-4 py-3">
            <div className="flex items-center gap-2 rounded-2xl border border-[#EEF0F4] bg-[#F8F9FB] px-3 py-2">
              <button className="shrink-0 text-[#A0A4B0] transition-colors hover:text-[#6B46FE]">
                <Paperclip className="h-5 w-5" />
              </button>
              <button className="shrink-0 text-[#A0A4B0] transition-colors hover:text-[#6B46FE]">
                <ImageIcon className="h-5 w-5" />
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..."
                className="min-w-0 flex-1 bg-transparent text-sm text-[#2D3436] outline-none placeholder:text-[#A0A4B0]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
              />
              <button className="shrink-0 text-[#A0A4B0] transition-colors hover:text-[#6B46FE]">
                <Smile className="h-5 w-5" />
              </button>
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6B46FE] to-[#8A60FF] text-white shadow-md shadow-[#6B46FE]/25 transition-opacity disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="-mx-3 -mt-4 flex h-[calc(100dvh-3.5rem-5.5rem-env(safe-area-inset-bottom))] overflow-hidden sm:-mx-6 sm:-mt-6 sm:h-[calc(100vh-72px-5.5rem)] lg:-mx-8 lg:h-[calc(100vh-72px)] lg:pb-0">
      {/* Desktop */}
      <div className="hidden h-full w-full lg:flex">
        {ListPanel}
        {ChatPanel}
      </div>

      {/* Mobile */}
      <div className="relative flex h-full w-full overflow-hidden lg:hidden">
        <AnimatePresence initial={false}>
          {!showMobileChat ? (
            <motion.div
              key="list"
              initial={{ x: 0 }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="absolute inset-0"
            >
              {ListPanel}
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="absolute inset-0 flex flex-col"
            >
              {ChatPanel}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
