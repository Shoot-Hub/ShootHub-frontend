export type EventStatus = 'upcoming' | 'live' | 'completed' | 'delayed' | 'cancelled';

export type TeamRole = 'photographer' | 'videographer' | 'drone' | 'assistant' | 'lead';

export type TimelineTeamMember = {
  id: string;
  name: string;
  role: TeamRole;
  roleLabel: string;
  avatar: string;
  phone?: string;
};

export type TimelineSlot = {
  id: string;
  title: string;
  description: string;
  icon: string;
  startTime: string; // ISO
  endTime: string; // ISO
  venue: string;
  status: EventStatus;
  notes?: string;
  photoCount: number;
  videoCount: number;
  teamIds: string[];
  gallerySlug?: string;
  progressPercent?: number;
  thumbnail: string;
};

export type EventTimelineDay = {
  id: string;
  coupleLine: string;
  eventName: string;
  eventDate: string; // display
  eventDateISO: string;
  location: string;
  coverImage: string;
  progressPercent: number;
  totalCoverageLabel: string;
  clientSatisfaction: number;
  hoursCoverage: number;
  slots: TimelineSlot[];
  team: TimelineTeamMember[];
};

export type EventTimelineStats = {
  totalEvents: number;
  completed: number;
  inProgress: number;
  upcoming: number;
  videos: number;
  hoursCoverage: number;
  photosCaptured: number;
  clientSatisfaction: number;
};

export type EventTimelineViewMode = 'timeline' | 'list';

/** Future-ready capability flags (no backend yet) */
export type EventTimelineFutureFlags = {
  liveTeamTracking: boolean;
  gpsLocation: boolean;
  realTimeProgress: boolean;
  clientNotifications: boolean;
  automaticReminders: boolean;
  aiScheduleSuggestions: boolean;
};
