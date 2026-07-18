import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  Shield,
  Mail,
  MessageSquare,
  Pencil,
  MoreHorizontal,
  Camera,
  Scissors,
  UserPlus,
  Eye,
  ArrowUpRight,
} from 'lucide-react';

type MemberStatus = 'active' | 'pending';
type MemberRole = 'Photographer' | 'Editor' | 'Assistant' | 'Admin';

type TeamMember = {
  id: string;
  name: string;
  title: string;
  email: string;
  role: MemberRole;
  joined: string;
  status: MemberStatus;
  initials: string;
  avatarColor: string;
};

const MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Aarav Sharma',
    title: 'Lead Photographer',
    email: 'aarav@shoothub.in',
    role: 'Photographer',
    joined: '12 May 2024',
    status: 'active',
    initials: 'AS',
    avatarColor: 'from-[#6B46FE] to-[#8A60FF]',
  },
  {
    id: '2',
    name: 'Isha Verma',
    title: 'Senior Editor',
    email: 'isha@shoothub.in',
    role: 'Editor',
    joined: '3 Jun 2024',
    status: 'active',
    initials: 'IV',
    avatarColor: 'from-[#3498DB] to-[#5DADE2]',
  },
  {
    id: '3',
    name: 'Rohan Patel',
    title: 'Second Shooter',
    email: 'rohan@shoothub.in',
    role: 'Photographer',
    joined: '18 Jul 2024',
    status: 'active',
    initials: 'RP',
    avatarColor: 'from-[#28C76F] to-[#48D68A]',
  },
  {
    id: '4',
    name: 'Meera Kapoor',
    title: 'Studio Assistant',
    email: 'meera@shoothub.in',
    role: 'Assistant',
    joined: '2 Aug 2024',
    status: 'active',
    initials: 'MK',
    avatarColor: 'from-[#FF9F43] to-[#FFB976]',
  },
  {
    id: '5',
    name: 'Kabir Khan',
    title: 'Photo Editor',
    email: 'kabir@shoothub.in',
    role: 'Editor',
    joined: '15 Sep 2024',
    status: 'active',
    initials: 'KK',
    avatarColor: 'from-[#EA5455] to-[#F08182]',
  },
  {
    id: '6',
    name: 'Sneha Reddy',
    title: 'Event Photographer',
    email: 'sneha@shoothub.in',
    role: 'Photographer',
    joined: '10 Oct 2024',
    status: 'active',
    initials: 'SR',
    avatarColor: 'from-[#A78BFA] to-[#7C3AED]',
  },
  {
    id: '7',
    name: 'Dev Malhotra',
    title: 'Assistant Editor',
    email: 'dev@shoothub.in',
    role: 'Assistant',
    joined: '22 Nov 2024',
    status: 'pending',
    initials: 'DM',
    avatarColor: 'from-[#FBBF24] to-[#F59E0B]',
  },
  {
    id: '8',
    name: 'Ananya Joshi',
    title: 'Guest Photographer',
    email: 'ananya@shoothub.in',
    role: 'Photographer',
    joined: '5 Jan 2025',
    status: 'pending',
    initials: 'AJ',
    avatarColor: 'from-[#EC4899] to-[#F472B6]',
  },
];

const roleBadge: Record<MemberRole, string> = {
  Photographer: 'bg-[#F3EEFF] text-[#6B46FE]',
  Editor: 'bg-[#E8F4FD] text-[#3498DB]',
  Assistant: 'bg-[#FFF4E5] text-[#FF9F43]',
  Admin: 'bg-[#E4F8ED] text-[#28C76F]',
};

const roleMeta = [
  {
    name: 'Photographer',
    count: 5,
    desc: 'Can shoot, upload & manage portfolio',
    icon: Camera,
    color: 'bg-[#F3EEFF] text-[#6B46FE]',
  },
  {
    name: 'Editor',
    count: 2,
    desc: 'Can edit photos & manage deliverables',
    icon: Scissors,
    color: 'bg-[#E8F4FD] text-[#3498DB]',
  },
  {
    name: 'Assistant',
    count: 2,
    desc: 'Can help with bookings & logistics',
    icon: UserPlus,
    color: 'bg-[#FFF4E5] text-[#FF9F43]',
  },
  {
    name: 'Viewer',
    count: 0,
    desc: 'Read-only access to shared content',
    icon: Eye,
    color: 'bg-[#F5F6F8] text-[#636E72]',
  },
];

const chartSegments = [
  { label: 'Photographer', count: 5, color: '#6B46FE' },
  { label: 'Editor', count: 2, color: '#3498DB' },
  { label: 'Assistant', count: 2, color: '#FF9F43' },
  { label: 'Other', count: 1, color: '#A0A4B0' },
];

type Tab = 'All Members' | 'Roles & Permissions' | 'Pending Invites';

function DonutChart({ total }: { total: number }) {
  const radius = 54;
  const stroke = 14;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const totalCount = chartSegments.reduce((s, x) => s + x.count, 0);

  return (
    <div className="relative h-[140px] w-[140px] shrink-0">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 140 140">
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#F0F1F5"
          strokeWidth={stroke}
        />
        {chartSegments.map((seg) => {
          const len = (seg.count / totalCount) * circumference;
          const dashOffset = -offset;
          offset += len;
          return (
            <circle
              key={seg.label}
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={stroke}
              strokeDasharray={`${len} ${circumference - len}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="butt"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-[#2D3436]">{total}</span>
        <span className="text-[10px] font-medium text-[#A0A4B0]">Total Members</span>
      </div>
    </div>
  );
}

export function TeamsPage() {
  const [tab, setTab] = useState<Tab>('All Members');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');

  const filtered = useMemo(() => {
    return MEMBERS.filter((m) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q);
      const matchesRole = roleFilter === 'All Roles' || m.role === roleFilter;
      const matchesTab =
        tab === 'Pending Invites' ? m.status === 'pending' : tab === 'All Members' ? true : true;
      return matchesSearch && matchesRole && (tab === 'Roles & Permissions' || matchesTab);
    });
  }, [search, roleFilter, tab]);

  const activeCount = MEMBERS.filter((m) => m.status === 'active').length;
  const pendingCount = MEMBERS.filter((m) => m.status === 'pending').length;

  const stats = [
    {
      label: 'Total Members',
      value: String(MEMBERS.length),
      meta: '+ 2 this month',
      icon: Users,
      iconBg: 'bg-[#F3EEFF]',
      iconColor: 'text-[#6B46FE]',
      metaColor: 'text-[#28C76F]',
    },
    {
      label: 'Active Members',
      value: String(activeCount),
      meta: '+ 1 this month',
      icon: UserCheck,
      iconBg: 'bg-[#E4F8ED]',
      iconColor: 'text-[#28C76F]',
      metaColor: 'text-[#28C76F]',
    },
    {
      label: 'Roles',
      value: '4',
      meta: 'Admin, Photographer, Editor, Assistant',
      icon: Shield,
      iconBg: 'bg-[#E8F4FD]',
      iconColor: 'text-[#3498DB]',
      metaColor: 'text-[#A0A4B0]',
    },
    {
      label: 'Pending Invites',
      value: String(pendingCount),
      meta: 'View invitations →',
      icon: Mail,
      iconBg: 'bg-[#FFF4E5]',
      iconColor: 'text-[#FF9F43]',
      metaColor: 'text-[#6B46FE]',
      clickable: true,
    },
  ];

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_300px]">
      {/* Main */}
      <div className="min-w-0 space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#2D3436]">Teams</h2>
            <p className="mt-0.5 text-sm text-[#636E72]">
              Manage your team members and collaborate efficiently.
            </p>
          </div>
          <button className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#6B46FE] to-[#8A60FF] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-[#6B46FE]/25 transition-all hover:shadow-lg">
            <Plus className="h-4 w-4" />
            Add Team Member
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-[#EEF0F4] bg-white p-4 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]"
            >
              <div
                className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}
              >
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <p className="text-xs font-medium text-[#636E72]">{stat.label}</p>
              <p className="mt-0.5 text-2xl font-bold text-[#2D3436]">{stat.value}</p>
              <button
                onClick={() => {
                  if (stat.clickable) setTab('Pending Invites');
                }}
                className={`mt-1 flex items-center gap-0.5 text-[11px] font-medium ${stat.metaColor} ${
                  stat.clickable ? 'hover:underline' : ''
                }`}
              >
                {!stat.clickable && <ArrowUpRight className="h-3 w-3" />}
                {stat.meta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="-mx-1 overflow-x-auto px-1">
          <div className="flex min-w-max gap-1 border-b border-[#EEF0F4]">
            {(['All Members', 'Roles & Permissions', 'Pending Invites'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative shrink-0 px-3 py-2.5 text-sm font-semibold transition-colors sm:px-4 ${
                  tab === t ? 'text-[#6B46FE]' : 'text-[#636E72] hover:text-[#2D3436]'
                }`}
              >
                {t}
                {t === 'Pending Invites' && (
                  <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FFF4E5] px-1.5 text-[10px] font-bold text-[#FF9F43]">
                    {pendingCount}
                  </span>
                )}
                {tab === t && (
                  <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[#6B46FE]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {tab === 'Roles & Permissions' ? (
          <div className="rounded-2xl border border-[#EEF0F4] bg-white p-5 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]">
            <div className="space-y-3">
              {roleMeta.map((role) => (
                <div
                  key={role.name}
                  className="flex items-start gap-3 rounded-xl border border-[#F5F6F8] bg-[#FAFBFC] p-4"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${role.color}`}
                  >
                    <role.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-[#2D3436]">{role.name}</p>
                      <span className="rounded-full bg-[#F3EEFF] px-2 py-0.5 text-[10px] font-bold text-[#6B46FE]">
                        {role.count}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-[#636E72]">{role.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-sm font-semibold text-[#6B46FE] hover:underline">
              Manage Roles & Permissions →
            </button>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A4B0]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search team members..."
                  className="h-10 w-full rounded-xl border border-[#EEF0F4] bg-white py-2 pl-10 pr-3 text-sm outline-none placeholder:text-[#A0A4B0] focus:border-[#6B46FE]/40 focus:ring-2 focus:ring-[#6B46FE]/15"
                />
              </div>
              <button className="flex h-10 items-center gap-2 rounded-xl border border-[#EEF0F4] bg-white px-3 text-xs font-semibold text-[#636E72] hover:bg-[#F8F9FB]">
                <Filter className="h-3.5 w-3.5" />
                Filter
              </button>
              <div className="relative">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="h-10 appearance-none rounded-xl border border-[#EEF0F4] bg-white py-2 pl-3 pr-8 text-xs font-semibold text-[#636E72] outline-none hover:bg-[#F8F9FB]"
                >
                  <option>All Roles</option>
                  <option>Photographer</option>
                  <option>Editor</option>
                  <option>Assistant</option>
                  <option>Admin</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A0A4B0]" />
              </div>
            </div>

            {/* Mobile member cards */}
            <div className="space-y-3 md:hidden">
              {filtered.map((m) => (
                <div
                  key={m.id}
                  className="rounded-2xl border border-[#EEF0F4] bg-white p-4 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white ${m.avatarColor}`}
                    >
                      {m.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-[#2D3436]">{m.name}</p>
                          <p className="truncate text-[11px] text-[#A0A4B0]">{m.title}</p>
                        </div>
                        <span
                          className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            m.status === 'active'
                              ? 'bg-[#E4F8ED] text-[#28C76F]'
                              : 'bg-[#FFF4E5] text-[#FF9F43]'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              m.status === 'active' ? 'bg-[#28C76F]' : 'bg-[#FF9F43]'
                            }`}
                          />
                          {m.status === 'active' ? 'Active' : 'Pending'}
                        </span>
                      </div>
                      <span
                        className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold ${roleBadge[m.role]}`}
                      >
                        {m.role}
                      </span>
                      <p className="mt-2 truncate text-xs text-[#636E72]">{m.email}</p>
                      <p className="mt-0.5 text-[11px] text-[#A0A4B0]">Joined {m.joined}</p>
                      <div className="mt-3 flex gap-1">
                        <button className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#F8F9FB] text-xs font-semibold text-[#636E72]">
                          <MessageSquare className="h-4 w-4" /> Chat
                        </button>
                        <button className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#F3EEFF] text-xs font-semibold text-[#6B46FE]">
                          <Pencil className="h-4 w-4" /> Edit
                        </button>
                        <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8F9FB] text-[#A0A4B0]">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="py-10 text-center text-sm text-[#A0A4B0]">No team members found.</p>
              )}
              {filtered.length > 0 && (
                <p className="pt-1 text-center text-xs text-[#A0A4B0]">
                  Showing {filtered.length} of {filtered.length} members
                </p>
              )}
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-2xl border border-[#EEF0F4] bg-white shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] md:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px]">
                  <thead>
                    <tr className="border-b border-[#F5F6F8] bg-[#FAFBFC]">
                      {['Member', 'Role', 'Email', 'Joined', 'Status', 'Actions'].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#A0A4B0]"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((m) => (
                      <tr
                        key={m.id}
                        className="border-b border-[#F5F6F8] last:border-0 hover:bg-[#FAFBFC]"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white ${m.avatarColor}`}
                            >
                              {m.initials}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-[#2D3436]">
                                {m.name}
                              </p>
                              <p className="truncate text-[11px] text-[#A0A4B0]">{m.title}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold ${roleBadge[m.role]}`}
                          >
                            {m.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#636E72]">{m.email}</td>
                        <td className="px-4 py-3 text-sm text-[#636E72]">{m.joined}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                              m.status === 'active'
                                ? 'bg-[#E4F8ED] text-[#28C76F]'
                                : 'bg-[#FFF4E5] text-[#FF9F43]'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                m.status === 'active' ? 'bg-[#28C76F]' : 'bg-[#FF9F43]'
                              }`}
                            />
                            {m.status === 'active' ? 'Active' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-0.5">
                            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[#A0A4B0] hover:bg-[#F3EEFF] hover:text-[#6B46FE]">
                              <MessageSquare className="h-4 w-4" />
                            </button>
                            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[#A0A4B0] hover:bg-[#F3EEFF] hover:text-[#6B46FE]">
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[#A0A4B0] hover:bg-[#F8F9FB] hover:text-[#636E72]">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center text-sm text-[#A0A4B0]">
                          No team members found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col items-center justify-between gap-3 border-t border-[#F5F6F8] px-4 py-3 sm:flex-row">
                <p className="text-xs text-[#A0A4B0]">
                  Showing 1 to {filtered.length} of {filtered.length} members
                </p>
                <div className="flex items-center gap-1.5">
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#EEF0F4] text-[#A0A4B0] hover:bg-[#F8F9FB]">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6B46FE] text-xs font-bold text-white shadow-sm shadow-[#6B46FE]/25">
                    1
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#EEF0F4] text-[#A0A4B0] hover:bg-[#F8F9FB]">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Right panel */}
      <aside className="space-y-4">
        <div className="rounded-2xl border border-[#EEF0F4] bg-white p-5 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]">
          <h3 className="mb-4 text-sm font-bold text-[#2D3436]">Team Overview</h3>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
            <DonutChart total={MEMBERS.length} />
            <div className="w-full space-y-2.5">
              {chartSegments.map((seg) => (
                <div key={seg.label} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: seg.color }}
                    />
                    <span className="text-xs font-medium text-[#636E72]">{seg.label}</span>
                  </div>
                  <span className="text-xs font-bold text-[#2D3436]">{seg.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#EEF0F4] bg-white p-5 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]">
          <h3 className="mb-4 text-sm font-bold text-[#2D3436]">Roles & Permissions</h3>
          <div className="space-y-3">
            {roleMeta.map((role) => (
              <div key={role.name} className="flex items-start gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${role.color}`}
                >
                  <role.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[#2D3436]">{role.name}</p>
                    <span className="rounded-full bg-[#F3EEFF] px-1.5 py-0.5 text-[10px] font-bold text-[#6B46FE]">
                      {role.count}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] leading-snug text-[#A0A4B0]">{role.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-xs font-semibold text-[#6B46FE] hover:underline">
            Manage Roles & Permissions →
          </button>
        </div>
      </aside>
    </div>
  );
}
