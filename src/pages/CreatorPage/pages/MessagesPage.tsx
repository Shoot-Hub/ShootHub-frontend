import { useState } from 'react';
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
  Circle,
  Paperclip,
  Smile,
  ImageIcon,
  Star,
  Archive,
} from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────
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
  avatar?: string;
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
    color: 'from-pink-500 to-rose-500',
    lastMessage: 'Can you share the wedding album link?',
    time: '2m ago',
    unread: 3,
    online: true,
    starred: true,
    messages: [
      { id: 'm1', text: 'Hi! I loved the photos from my sister\'s wedding 😍', time: '10:30 AM', isMe: false, read: true },
      { id: 'm2', text: 'Thank you so much! It was a beautiful day. I\'m glad you liked them!', time: '10:32 AM', isMe: true, read: true },
      { id: 'm3', text: 'Can you share the full wedding album link please?', time: '10:35 AM', isMe: false },
      { id: 'm4', text: 'Can you share the wedding album link?', time: '10:36 AM', isMe: false },
    ],
  },
  {
    id: '2',
    name: 'Rahul Mehta',
    initials: 'RM',
    color: 'from-blue-500 to-indigo-500',
    lastMessage: 'Looking forward to the pre-wedding shoot!',
    time: '1h ago',
    unread: 1,
    online: true,
    starred: false,
    messages: [
      { id: 'm1', text: 'Hi, I booked a pre-wedding shoot for next Saturday.', time: '9:00 AM', isMe: false, read: true },
      { id: 'm2', text: 'Perfect! I\'ve received your booking. I\'ll send the location details soon.', time: '9:05 AM', isMe: true, read: true },
      { id: 'm3', text: 'Looking forward to the pre-wedding shoot!', time: '9:10 AM', isMe: false },
    ],
  },
  {
    id: '3',
    name: 'Ananya Gupta',
    initials: 'AG',
    color: 'from-violet-500 to-purple-500',
    lastMessage: 'The portraits turned out amazing 🔥',
    time: 'Yesterday',
    unread: 0,
    online: false,
    starred: true,
    messages: [
      { id: 'm1', text: 'Just saw the portrait session photos!', time: 'Yesterday 3:00 PM', isMe: false, read: true },
      { id: 'm2', text: 'The portraits turned out amazing 🔥', time: 'Yesterday 3:01 PM', isMe: false, read: true },
      { id: 'm3', text: 'So happy you love them! You were a natural in front of the camera 😊', time: 'Yesterday 3:15 PM', isMe: true, read: true },
    ],
  },
  {
    id: '4',
    name: 'Vikram Singh',
    initials: 'VS',
    color: 'from-emerald-500 to-teal-500',
    lastMessage: 'Is there a corporate package available?',
    time: '2d ago',
    unread: 0,
    online: false,
    starred: false,
    messages: [
      { id: 'm1', text: 'Hello, I\'m looking for corporate event photography.', time: '2d ago', isMe: false, read: true },
      { id: 'm2', text: 'Is there a corporate package available?', time: '2d ago', isMe: false, read: true },
      { id: 'm3', text: 'Yes! I have a dedicated corporate package. Let me send you the details.', time: '2d ago', isMe: true, read: true },
    ],
  },
];

// ─── Avatar ───────────────────────────────────────────────────
function Avatar({ conv, size = 'md' }: { conv: Conversation; size?: 'sm' | 'md' | 'lg' }) {
  const sz = size === 'sm' ? 'h-9 w-9 text-xs' : size === 'lg' ? 'h-12 w-12 text-sm' : 'h-10 w-10 text-sm';
  const dot = size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3';
  return (
    <div className="relative flex-shrink-0">
      <div className={`${sz} rounded-2xl bg-gradient-to-br ${conv.color} text-white font-bold flex items-center justify-center shadow-sm`}>
        {conv.initials}
      </div>
      {conv.online && (
        <span className={`absolute -bottom-0.5 -right-0.5 ${dot} rounded-full bg-emerald-500 border-2 border-white`} />
      )}
    </div>
  );
}

// ─── Conversation List Item ───────────────────────────────────
function ConvItem({
  conv,
  active,
  onClick,
}: {
  conv: Conversation;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 transition-all text-left ${
        active
          ? 'bg-blue-50 border-r-2 border-blue-600'
          : 'hover:bg-slate-50 border-r-2 border-transparent'
      }`}
    >
      <Avatar conv={conv} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-sm font-bold truncate ${active ? 'text-blue-700' : 'text-slate-800'}`}>
            {conv.name}
          </span>
          <div className="flex items-center gap-1 flex-shrink-0">
            {conv.starred && <Star className="h-3 w-3 text-amber-400 fill-amber-400" />}
            <span className="text-[11px] text-slate-400">{conv.time}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-xs text-slate-500 truncate flex-1">{conv.lastMessage}</p>
          {conv.unread > 0 && (
            <span className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
              {conv.unread}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

// ─── Chat Bubble ─────────────────────────────────────────────
function Bubble({ msg }: { msg: Message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          msg.isMe
            ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-sm shadow-md shadow-blue-500/20'
            : 'bg-white text-slate-700 rounded-bl-sm border border-slate-100 shadow-sm'
        }`}
      >
        <p>{msg.text}</p>
        <div className={`flex items-center gap-1 mt-1 ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
          <span className={`text-[10px] ${msg.isMe ? 'text-blue-200' : 'text-slate-400'}`}>
            {msg.time}
          </span>
          {msg.isMe && (
            msg.read
              ? <CheckCheck className="h-3 w-3 text-blue-200" />
              : <Check className="h-3 w-3 text-blue-200" />
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main MessagesPage ────────────────────────────────────────
export function MessagesPage() {
  const [conversations] = useState(DEMO_CONVERSATIONS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [search, setSearch] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);

  const activeConv = conversations.find((c) => c.id === activeId) ?? null;
  const filtered = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelectConv = (id: string) => {
    setActiveId(id);
    setShowMobileChat(true);
  };

  const handleBack = () => {
    setShowMobileChat(false);
  };

  // ── Chat Panel ──
  const ChatPanel = () => {
    if (!activeConv) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#F8FAFF] p-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 mb-5">
            <MessageSquare className="h-10 w-10 text-blue-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-2">Your Messages</h3>
          <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
            Select a conversation from the left to start chatting with your clients
          </p>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col bg-[#F8FAFF] min-h-0">
        {/* Chat Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-100 shadow-sm flex-shrink-0">
          <button onClick={handleBack} className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <Avatar conv={activeConv} size="md" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800">{activeConv.name}</p>
            <p className="text-xs text-slate-400">
              {activeConv.online ? (
                <span className="text-emerald-500 font-semibold">● Online</span>
              ) : (
                'Last seen recently'
              )}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">
              <Phone className="h-4 w-4" />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">
              <Video className="h-4 w-4" />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {/* Date divider */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[11px] text-slate-400 font-medium px-2">Today</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {activeConv.messages.map((msg) => (
            <Bubble key={msg.id} msg={msg} />
          ))}

          {/* Typing indicator (cosmetic) */}
          {activeConv.online && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl rounded-bl-sm bg-white border border-slate-100 shadow-sm">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-2 w-2 rounded-full bg-slate-300 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="flex-shrink-0 border-t border-slate-100 bg-white px-4 py-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2">
            <button className="text-slate-400 hover:text-blue-500 transition-colors flex-shrink-0">
              <Paperclip className="h-5 w-5" />
            </button>
            <button className="text-slate-400 hover:text-blue-500 transition-colors flex-shrink-0">
              <ImageIcon className="h-5 w-5" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none min-w-0"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && inputText.trim()) setInputText('');
              }}
            />
            <button className="text-slate-400 hover:text-blue-500 transition-colors flex-shrink-0">
              <Smile className="h-5 w-5" />
            </button>
            <button
              onClick={() => setInputText('')}
              disabled={!inputText.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm disabled:opacity-40 transition-opacity flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ── Conversation List Panel ──
  const ListPanel = () => (
    <div className="flex flex-col bg-white border-r border-slate-100 w-full lg:w-80 flex-shrink-0">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-slate-800">Messages</h2>
          <div className="flex items-center gap-1">
            <button className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 hover:text-blue-600 transition-colors">
              <Archive className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-colors">
              <MessageSquare className="h-4 w-4" />
            </button>
          </div>
        </div>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-all"
          />
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 px-4 py-2.5 border-b border-slate-50">
        {['All', 'Unread', 'Starred'].map((f) => (
          <button
            key={f}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
              f === 'All'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <Circle className="h-10 w-10 text-slate-200 mb-3" />
            <p className="text-sm text-slate-400">No conversations found</p>
          </div>
        ) : (
          filtered.map((conv) => (
            <ConvItem
              key={conv.id}
              conv={conv}
              active={conv.id === activeId}
              onClick={() => handleSelectConv(conv.id)}
            />
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-3.5rem)] flex overflow-hidden -m-4 sm:-m-6 lg:-m-8">
      {/* Desktop: side-by-side */}
      <div className="hidden lg:flex w-full">
        <ListPanel />
        <ChatPanel />
      </div>

      {/* Mobile: stack with slide animation */}
      <div className="flex lg:hidden w-full relative overflow-hidden">
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
              <ListPanel />
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
              <ChatPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}