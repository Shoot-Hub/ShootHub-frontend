export interface ChatMessage {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
  read?: boolean;
}

export interface ChatConversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  booking?: {
    title: string;
    date: string;
    time: string;
    venue: string;
    city: string;
    status: 'Confirmed' | 'Upcoming' | 'Completed';
    coverImage: string;
  };
  messages: ChatMessage[];
}

export const conversations: ChatConversation[] = [
  {
    id: 'c1',
    name: 'Harsh Sharma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
    lastMessage: 'Sure, I will share the timeline draft tonight.',
    time: '10:30 AM',
    unread: 2,
    online: true,
    booking: {
      title: 'Riya & Kunal Wedding',
      date: '12 Dec 2026',
      time: '10:30 AM',
      venue: 'Jaipur Palace',
      city: 'Jaipur',
      status: 'Confirmed',
      coverImage:
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=200&h=140&fit=crop',
    },
    messages: [
      {
        id: 'm1',
        sender: 'them',
        text: 'Hi Yuvraj! Looking forward to the wedding shoot.',
        time: '9:42 AM',
      },
      {
        id: 'm2',
        sender: 'me',
        text: 'Hi Harsh! Same here. Can you share the shot list?',
        time: '9:50 AM',
        read: true,
      },
      {
        id: 'm3',
        sender: 'them',
        text: 'Yes — also confirming Jaipur Palace entry by 9 AM.',
        time: '10:05 AM',
      },
      {
        id: 'm4',
        sender: 'me',
        text: 'Perfect. Please keep drone coverage for the baraat.',
        time: '10:18 AM',
        read: true,
      },
      {
        id: 'm5',
        sender: 'them',
        text: 'Sure, I will share the timeline draft tonight.',
        time: '10:30 AM',
      },
    ],
  },
  {
    id: 'c2',
    name: 'Aditi Films',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop',
    lastMessage: 'Engagement gallery is ready for preview.',
    time: 'Yesterday',
    unread: 1,
    online: false,
    booking: {
      title: 'Engagement Ceremony',
      date: '18 Oct 2026',
      time: '6:00 PM',
      venue: 'The Grand Oak',
      city: 'Delhi',
      status: 'Confirmed',
      coverImage:
        'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=200&h=140&fit=crop',
    },
    messages: [
      {
        id: 'm1',
        sender: 'them',
        text: 'Engagement gallery is ready for preview.',
        time: 'Yesterday',
      },
    ],
  },
  {
    id: 'c3',
    name: 'Sneha Patel',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop',
    lastMessage: 'Pre-wedding edits are 80% done.',
    time: 'Mon',
    unread: 0,
    online: true,
    messages: [
      {
        id: 'm1',
        sender: 'them',
        text: 'Pre-wedding edits are 80% done.',
        time: 'Mon',
      },
      {
        id: 'm2',
        sender: 'me',
        text: 'Awesome, thank you!',
        time: 'Mon',
        read: true,
      },
    ],
  },
  {
    id: 'c4',
    name: 'Rahul Mehta',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop',
    lastMessage: 'Can we reschedule the anniversary shoot?',
    time: 'Sun',
    unread: 0,
    online: false,
    messages: [
      {
        id: 'm1',
        sender: 'them',
        text: 'Can we reschedule the anniversary shoot?',
        time: 'Sun',
      },
    ],
  },
  {
    id: 'c5',
    name: 'Priya Kapoor',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop',
    lastMessage: 'Invoice shared for the baby shower.',
    time: 'Fri',
    unread: 0,
    online: false,
    messages: [
      {
        id: 'm1',
        sender: 'them',
        text: 'Invoice shared for the baby shower.',
        time: 'Fri',
      },
    ],
  },
];
