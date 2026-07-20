import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  ImageIcon,
  HardDrive,
  Link2,
  QrCode,
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Copy,
  ExternalLink,
  Download,
  Printer,
  Archive,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import weddingImg from '@/assets/landing/categories/wedding.jpg';
import birthdayImg from '@/assets/landing/categories/birthday.jpg';
import portraitImg from '@/assets/landing/categories/portrait.jpg';
import corporateImg from '@/assets/landing/categories/corporate.jpg';
import babyShootImg from '@/assets/landing/categories/baby-shoot.jpg';
import { CreateUploadForm } from '../components/uploads';

type GalleryStatus = 'active' | 'expired' | 'archived';

type Gallery = {
  id: string;
  name: string;
  eventType: string;
  location: string;
  date: string;
  photoCount: number;
  status: GalleryStatus;
  shareLink: string;
  clientName: string;
  createdOn: string;
  expiresOn: string;
  storageUsed: string;
  thumbnail: string;
};

const MOCK_GALLERIES: Gallery[] = [
  {
    id: '1',
    name: 'Rohit & Priya Wedding',
    eventType: 'Wedding',
    location: 'Udaipur, Rajasthan',
    date: 'May 20, 2024 • 2:30 PM',
    photoCount: 1245,
    status: 'active',
    shareLink: '/gallery/rohit-priya-wedding',
    clientName: 'Rohit Sharma',
    createdOn: 'May 20, 2024 • 2:30 PM',
    expiresOn: 'Jun 20, 2024 • 2:30 PM',
    storageUsed: '12.5 GB',
    thumbnail: weddingImg,
  },
  {
    id: '2',
    name: 'Aarav 1st Birthday',
    eventType: 'Birthday',
    location: 'Mumbai, Maharashtra',
    date: 'Apr 12, 2024 • 11:00 AM',
    photoCount: 486,
    status: 'active',
    shareLink: '/gallery/aarav-birthday',
    clientName: 'Priya Sharma',
    createdOn: 'Apr 12, 2024 • 11:00 AM',
    expiresOn: 'May 12, 2024 • 11:00 AM',
    storageUsed: '5.2 GB',
    thumbnail: birthdayImg,
  },
  {
    id: '3',
    name: 'Mehta Family Portraits',
    eventType: 'Portrait',
    location: 'Mumbai',
    date: 'Mar 8, 2024 • 4:00 PM',
    photoCount: 128,
    status: 'expired',
    shareLink: '/gallery/mehta-portraits',
    clientName: 'Rahul Mehta',
    createdOn: 'Mar 8, 2024 • 4:00 PM',
    expiresOn: 'Apr 8, 2024 • 4:00 PM',
    storageUsed: '1.8 GB',
    thumbnail: portraitImg,
  },
  {
    id: '4',
    name: 'Corporate Headshots - TechCorp',
    eventType: 'Corporate',
    location: 'Bangalore',
    date: 'Feb 15, 2024 • 9:00 AM',
    photoCount: 64,
    status: 'active',
    shareLink: '/gallery/techcorp-headshots',
    clientName: 'TechCorp HR',
    createdOn: 'Feb 15, 2024 • 9:00 AM',
    expiresOn: 'Mar 15, 2024 • 9:00 AM',
    storageUsed: '890 MB',
    thumbnail: corporateImg,
  },
  {
    id: '5',
    name: 'Sneha Baby Shower',
    eventType: 'Event',
    location: 'Delhi',
    date: 'Jan 22, 2024 • 1:00 PM',
    photoCount: 312,
    status: 'archived',
    shareLink: '/gallery/sneha-babyshower',
    clientName: 'Sneha Kapoor',
    createdOn: 'Jan 22, 2024 • 1:00 PM',
    expiresOn: 'Feb 22, 2024 • 1:00 PM',
    storageUsed: '3.1 GB',
    thumbnail: babyShootImg,
  },
];

const tabs = ['All Uploads', 'Active', 'Expired', 'Archived'] as const;

const stats = [
  {
    label: 'Total Uploads',
    value: '128',
    sub: 'All time',
    icon: Upload,
    iconBg: 'bg-[#F3EEFF]',
    iconColor: 'text-[#6B46FE]',
  },
  {
    label: 'Photos Uploaded',
    value: '24,560',
    sub: 'Across all galleries',
    icon: ImageIcon,
    iconBg: 'bg-[#E8F4FD]',
    iconColor: 'text-[#3498DB]',
  },
  {
    label: 'Storage Used',
    value: '235 GB',
    sub: 'of 500 GB used',
    icon: HardDrive,
    iconBg: 'bg-[#E4F8ED]',
    iconColor: 'text-[#28C76F]',
  },
  {
    label: 'Links Created',
    value: '96',
    sub: 'Share links generated',
    icon: Link2,
    iconBg: 'bg-[#FFF4E5]',
    iconColor: 'text-[#FF9F43]',
  },
  {
    label: 'QR Codes',
    value: '96',
    sub: 'QR codes generated',
    icon: QrCode,
    iconBg: 'bg-[#FFE8F0]',
    iconColor: 'text-[#E84393]',
  },
];

function QrCodePreview({ value, size = 168 }: { value: string; size?: number }) {
  const modules = 21;
  const cells = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = (Math.imul(31, hash) + value.charCodeAt(i)) | 0;
    }
    return Array.from({ length: modules * modules }, (_, i) => {
      const seed = (Math.imul(hash, i + 7) ^ (i * 13)) | 0;
      if (
        i < modules ||
        i >= modules * (modules - 1) ||
        i % modules === 0 ||
        i % modules === modules - 1
      ) {
        return i % 3 !== 1;
      }
      return Math.abs(seed) % 2 === 0;
    });
  }, [value]);

  const cellSize = size / modules;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" />
      {cells.map((filled, i) => {
        if (!filled) return null;
        const row = Math.floor(i / modules);
        const col = i % modules;
        return (
          <rect
            key={i}
            x={col * cellSize}
            y={row * cellSize}
            width={cellSize}
            height={cellSize}
            fill="#1A1A2E"
          />
        );
      })}
    </svg>
  );
}

function getFullGalleryLink(shareLink: string) {
  if (shareLink.startsWith('http://') || shareLink.startsWith('https://')) {
    return shareLink;
  }

  if (shareLink.startsWith('/')) {
    return typeof window !== 'undefined'
      ? `${window.location.origin}${shareLink}`
      : `https://shoothub.com${shareLink}`;
  }

  return `https://${shareLink}`;
}

function StatusBadge({ status }: { status: GalleryStatus }) {
  const styles = {
    active: 'bg-[#E4F8ED] text-[#28C76F]',
    expired: 'bg-[#F0F1F3] text-[#A0A4B0]',
    archived: 'bg-[#FFF4E5] text-[#FF9F43]',
  };
  const labels = { active: 'Active', expired: 'Expired', archived: 'Archived' };

  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-bold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function GalleryDetailPanel({
  gallery,
  onClose,
}: {
  gallery: Gallery;
  onClose: () => void;
}) {
  const [drawerTab, setDrawerTab] = useState<'overview' | 'photos' | 'settings'>('overview');
  const fullLink = getFullGalleryLink(gallery.shareLink);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullLink);
      toast.success('Link copied to clipboard');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const drawerTabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'photos' as const, label: `Photos (${gallery.photoCount.toLocaleString()})` },
    { id: 'settings' as const, label: 'Settings' },
  ];

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex max-h-[calc(100vh-280px)] flex-col overflow-hidden rounded-2xl border border-[#EEF0F4] bg-white shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] xl:sticky xl:top-[88px]"
    >
      <div className="border-b border-[#F5F6F8] px-4 pb-0 pt-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex min-w-0 gap-3">
            <img
              src={gallery.thumbnail}
              alt=""
              className="h-12 w-12 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-[#2D3436]">{gallery.name}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <StatusBadge status={gallery.status} />
                <span className="text-[11px] text-[#A0A4B0]">{gallery.createdOn.split(' • ')[0]}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-[#A0A4B0] hover:bg-[#F8F9FB] hover:text-[#636E72]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-4 border-b border-[#F5F6F8]">
          {drawerTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDrawerTab(tab.id)}
              className={`relative pb-2.5 text-xs font-semibold transition-colors ${
                drawerTab === tab.id ? 'text-[#6B46FE]' : 'text-[#A0A4B0] hover:text-[#636E72]'
              }`}
            >
              {tab.label}
              {drawerTab === tab.id && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#6B46FE]" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {drawerTab === 'overview' && (
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-xs font-bold text-[#2D3436]">Share Link</p>
              <div className="flex items-center gap-1 rounded-xl border border-[#EEF0F4] bg-[#FAFBFC] px-3 py-2">
                <span className="min-w-0 flex-1 truncate text-xs text-[#636E72]">
                  {gallery.shareLink}
                </span>
                <button
                  onClick={handleCopy}
                  className="shrink-0 rounded-md p-1.5 text-[#A0A4B0] hover:bg-white hover:text-[#6B46FE]"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
              <a
                href={fullLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6B46FE] py-2.5 text-sm font-bold text-white transition-all hover:bg-[#5A38E0]"
              >
                <ExternalLink className="h-4 w-4" />
                Open Link
              </a>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold text-[#2D3436]">QR Code</p>
              <div className="flex flex-col items-center rounded-xl border border-[#EEF0F4] bg-[#FAFBFC] px-4 py-5">
                <div className="overflow-hidden rounded-lg border border-[#E8EAED] bg-white p-2">
                  <QrCodePreview value={fullLink} />
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
                  <button className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#636E72] hover:text-[#6B46FE]">
                    <Download className="h-3.5 w-3.5" />
                    Download PNG
                  </button>
                  <button className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#636E72] hover:text-[#6B46FE]">
                    <Download className="h-3.5 w-3.5" />
                    Download SVG
                  </button>
                  <button className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#636E72] hover:text-[#6B46FE]">
                    <Printer className="h-3.5 w-3.5" />
                    Print QR Code
                  </button>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold text-[#2D3436]">Info</p>
              <dl className="divide-y divide-[#F5F6F8] rounded-xl border border-[#EEF0F4] bg-[#FAFBFC]">
                {[
                  ['Event Type', gallery.eventType],
                  ['Client Name', gallery.clientName],
                  ['Location', gallery.location],
                  ['Created On', gallery.createdOn],
                  ['Expires On', gallery.expiresOn],
                  ['Total Photos', gallery.photoCount.toLocaleString()],
                  ['Storage Used', gallery.storageUsed],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-4 px-3 py-2.5">
                    <dt className="text-xs text-[#A0A4B0]">{label}</dt>
                    <dd className="text-right text-xs font-semibold text-[#2D3436]">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}

        {drawerTab === 'photos' && (
          <div className="flex flex-col items-center py-10 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3EEFF]">
              <ImageIcon className="h-6 w-6 text-[#6B46FE]" />
            </div>
            <p className="text-sm font-semibold text-[#2D3436]">
              {gallery.photoCount.toLocaleString()} photos
            </p>
            <p className="mt-1 text-xs text-[#A0A4B0]">Photo grid coming soon</p>
          </div>
        )}

        {drawerTab === 'settings' && (
          <div className="flex flex-col items-center py-10 text-center">
            <p className="text-sm font-semibold text-[#2D3436]">Gallery Settings</p>
            <p className="mt-1 text-xs text-[#A0A4B0]">Expiry, privacy & download options</p>
          </div>
        )}
      </div>

      <div className="border-t border-[#F5F6F8] p-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#EA5455] py-2.5 text-sm font-bold text-[#EA5455] transition-all hover:bg-[#FFF5F5]">
          <Archive className="h-4 w-4" />
          Archive Gallery
        </button>
      </div>
    </motion.aside>
  );
}

export function UploadsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isCreateMode = searchParams.get('create') === '1';

  const openCreateForm = () => setSearchParams({ create: '1' });
  const closeCreateForm = () => setSearchParams({});

  if (isCreateMode) {
    return <CreateUploadForm onBack={closeCreateForm} onComplete={closeCreateForm} />;
  }

  return <UploadsListView onNewUpload={openCreateForm} />;
}

function UploadsListView({ onNewUpload }: { onNewUpload: () => void }) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('All Uploads');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('Newest First');
  const [selectedId, setSelectedId] = useState<string>('1');
  const [page, setPage] = useState(1);

  const filteredGalleries = useMemo(() => {
    let list = MOCK_GALLERIES;

    if (activeTab === 'Active') list = list.filter((g) => g.status === 'active');
    else if (activeTab === 'Expired') list = list.filter((g) => g.status === 'expired');
    else if (activeTab === 'Archived') list = list.filter((g) => g.status === 'archived');

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.eventType.toLowerCase().includes(q) ||
          g.location.toLowerCase().includes(q),
      );
    }

    if (sortBy === 'Oldest First') return [...list].reverse();
    if (sortBy === 'Name A–Z') return [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'Most Photos') return [...list].sort((a, b) => b.photoCount - a.photoCount);
    return list;
  }, [activeTab, search, sortBy]);

  const selectedGallery =
    filteredGalleries.find((g) => g.id === selectedId) ?? filteredGalleries[0] ?? null;

  const totalUploads = 128;
  const pageSize = 5;
  const totalPages = Math.ceil(totalUploads / pageSize);

  return (
    <div className="space-y-5">
      {/* Mobile-only New Upload */}
      <div className="flex justify-end sm:hidden">
        <button
          onClick={onNewUpload}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#6B46FE] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-[#6B46FE]/25"
        >
          <Upload className="h-4 w-4" />
          New Upload
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="rounded-2xl border border-[#EEF0F4] bg-white p-4 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]"
          >
            <div
              className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${stat.iconBg}`}
            >
              <stat.icon className={`h-[18px] w-[18px] ${stat.iconColor}`} />
            </div>
            <p className="text-xs font-medium text-[#636E72]">{stat.label}</p>
            <p className="mt-0.5 text-xl font-bold text-[#2D3436]">{stat.value}</p>
            <p className="mt-0.5 text-[11px] text-[#A0A4B0]">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Table + drawer */}
      <div className={`grid items-start gap-5 ${selectedGallery ? 'xl:grid-cols-[1fr_360px]' : ''}`}>
        <div className="min-w-0 space-y-0 overflow-hidden rounded-2xl border border-[#EEF0F4] bg-white shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]">
          {/* Tabs + controls row */}
          <div className="flex flex-col gap-3 border-b border-[#F5F6F8] px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-5 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative shrink-0 pb-1 text-sm font-semibold transition-colors ${
                    activeTab === tab
                      ? 'text-[#6B46FE]'
                      : 'text-[#636E72] hover:text-[#2D3436]'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute inset-x-0 -bottom-[13px] h-0.5 rounded-full bg-[#6B46FE]" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative sm:w-48">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A0A4B0]" />
                <input
                  type="text"
                  placeholder="Search uploads..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 w-full rounded-lg border border-[#EEF0F4] bg-[#FAFBFC] pl-9 pr-3 text-xs text-[#2D3436] placeholder:text-[#A0A4B0] outline-none focus:border-[#6B46FE]/40 focus:bg-white"
                />
              </div>
              <button className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#EEF0F4] bg-white px-3 text-xs font-semibold text-[#636E72] hover:bg-[#F8F9FB]">
                <Filter className="h-3.5 w-3.5" />
                Filter
              </button>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-9 appearance-none rounded-lg border border-[#EEF0F4] bg-white pl-3 pr-8 text-xs font-semibold text-[#636E72] outline-none hover:bg-[#F8F9FB]"
                >
                  <option>Newest First</option>
                  <option>Oldest First</option>
                  <option>Most Photos</option>
                  <option>Name A–Z</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A0A4B0]" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-[#F5F6F8]">
                  {['GALLERY', 'DATE', 'PHOTOS', 'STATUS', 'SHARE', ''].map((h, idx) => (
                    <th
                      key={h || `col-${idx}`}
                      className={`px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#A0A4B0] ${idx === 5 ? 'w-10' : ''}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredGalleries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-14 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3EEFF]">
                          <Upload className="h-6 w-6 text-[#6B46FE]" />
                        </div>
                        <p className="text-sm font-medium text-[#636E72]">No uploads found.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredGalleries.map((gallery) => (
                    <tr
                      key={gallery.id}
                      onClick={() => setSelectedId(gallery.id)}
                      className={`cursor-pointer border-b border-[#F5F6F8] transition-colors last:border-0 ${
                        selectedId === gallery.id
                          ? 'bg-[#F8F5FF]'
                          : 'hover:bg-[#FAFBFC]'
                      }`}
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={gallery.thumbnail}
                            alt=""
                            className="h-10 w-10 shrink-0 rounded-lg object-cover"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#2D3436]">
                              {gallery.name}
                            </p>
                            <p className="truncate text-[11px] text-[#A0A4B0]">
                              {gallery.eventType} · {gallery.location}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-xs text-[#636E72]">
                        {gallery.date}
                      </td>
                      <td className="px-4 py-3.5 text-xs font-semibold text-[#2D3436]">
                        {gallery.photoCount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={gallery.status} />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              void navigator.clipboard.writeText(getFullGalleryLink(gallery.shareLink));
                              toast.success('Link copied');
                            }}
                            className="rounded-md p-1.5 text-[#A0A4B0] hover:bg-[#F3EEFF] hover:text-[#6B46FE]"
                          >
                            <Link2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedId(gallery.id);
                            }}
                            className="rounded-md p-1.5 text-[#A0A4B0] hover:bg-[#F3EEFF] hover:text-[#6B46FE]"
                          >
                            <QrCode className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="rounded-md p-1.5 text-[#A0A4B0] hover:bg-[#F8F9FB] hover:text-[#636E72]"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-[#F5F6F8] px-4 py-3 sm:flex-row">
            <p className="text-xs text-[#A0A4B0]">
              Showing 1 to {Math.min(pageSize, filteredGalleries.length)} of {totalUploads} uploads
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#EEF0F4] text-[#636E72] hover:bg-[#F8F9FB] disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-semibold transition-all ${
                    page === p
                      ? 'bg-[#6B46FE] text-white'
                      : 'border border-[#EEF0F4] text-[#636E72] hover:bg-[#F8F9FB]'
                  }`}
                >
                  {p}
                </button>
              ))}
              <span className="px-1 text-xs text-[#A0A4B0]">…</span>
              <button
                onClick={() => setPage(totalPages)}
                className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-semibold transition-all ${
                  page === totalPages
                    ? 'bg-[#6B46FE] text-white'
                    : 'border border-[#EEF0F4] text-[#636E72] hover:bg-[#F8F9FB]'
                }`}
              >
                {totalPages}
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#EEF0F4] text-[#636E72] hover:bg-[#F8F9FB] disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {selectedGallery && (
            <GalleryDetailPanel
              key={selectedGallery.id}
              gallery={selectedGallery}
              onClose={() => setSelectedId('')}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
