import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Plus,
  X,
  Trash2,
  Save,
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Clock,
  Users,
  Image,
  BookOpen,
  Pencil,
  ArrowRight,
  ArrowDownRight,
  FileText,
  CalendarCheck,
  DollarSign,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth, setAuth } from '@/store';
import { creatorService } from '@/services/creator';

type PackageForm = {
  name: string;
  description: string;
  price: number;
  currency: string;
  durationHours: number;
  deliverables: string;
};

type DisplayPackage = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  durationHours: number;
  photographers: number;
  photos: string;
  album: string;
  status: 'active' | 'inactive';
  badge?: 'Popular' | 'Best Seller' | 'Budget';
  image: string;
  isApi?: boolean;
};

const DEMO_PACKAGES: DisplayPackage[] = [
  {
    id: 'demo-1',
    name: 'Wedding Photography',
    description: 'Complete wedding day coverage with cinematic storytelling and premium album.',
    price: 49999,
    currency: '₹',
    durationHours: 8,
    photographers: 2,
    photos: '500+ Edited Photos',
    album: 'Photo Album',
    status: 'active',
    badge: 'Popular',
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=360&fit=crop',
  },
  {
    id: 'demo-2',
    name: 'Portrait Session',
    description: 'Professional portrait shoot for individuals, couples, or families.',
    price: 8999,
    currency: '₹',
    durationHours: 2,
    photographers: 1,
    photos: '50+ Edited Photos',
    album: 'Digital Gallery',
    status: 'active',
    badge: 'Best Seller',
    image:
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=360&fit=crop',
  },
  {
    id: 'demo-3',
    name: 'Event Coverage',
    description: 'Corporate events, birthdays, and celebrations captured professionally.',
    price: 24999,
    currency: '₹',
    durationHours: 6,
    photographers: 2,
    photos: '300+ Edited Photos',
    album: 'Online Gallery',
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=360&fit=crop',
  },
  {
    id: 'demo-4',
    name: 'Product Photography',
    description: 'Clean product shots for e-commerce, catalogs, and brand campaigns.',
    price: 14999,
    currency: '₹',
    durationHours: 4,
    photographers: 1,
    photos: '40+ Edited Photos',
    album: 'Raw + Edited',
    status: 'inactive',
    badge: 'Budget',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=360&fit=crop',
  },
];

const sparkPaths = {
  purple: 'M0,18 C8,22 14,10 22,14 C30,18 38,6 46,10 C52,12 56,4 60,6',
  green: 'M0,22 C10,18 16,20 24,10 C32,4 40,14 48,8 C54,4 57,10 60,6',
  orange: 'M0,16 C8,20 14,8 24,12 C32,16 40,6 48,10 C54,12 57,6 60,8',
  blue: 'M0,20 C10,16 18,22 26,12 C34,4 42,14 50,8 C55,4 58,8 60,4',
};

function Sparkline({ color, path }: { color: string; path: string }) {
  return (
    <svg viewBox="0 0 60 28" className="mt-2 h-7 w-full" preserveAspectRatio="none">
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d={`${path} L60,28 L0,28 Z`} fill={color} fillOpacity="0.1" stroke="none" />
    </svg>
  );
}

function formatPrice(currency: string, price: number) {
  const symbol = currency === 'INR' || currency === '₹' ? '₹' : currency === 'USD' ? '$' : currency;
  return `${symbol}${price.toLocaleString('en-IN')}`;
}

const badgeStyles = {
  Popular: 'bg-[#E4F8ED] text-[#28C76F]',
  'Best Seller': 'bg-[#E8F4FD] text-[#3498DB]',
  Budget: 'bg-[#FFF4E5] text-[#FF9F43]',
};

export function PackagesPage() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [form, setForm] = useState<PackageForm>({
    name: '',
    description: '',
    price: 0,
    currency: 'INR',
    durationHours: 1,
    deliverables: '',
  });

  const apiPackages: DisplayPackage[] = useMemo(() => {
    const list = user?.packages ?? [];
    return list.map((pkg, i) => {
      const deliverables = Array.isArray(pkg.deliverables)
        ? (pkg.deliverables as string[])
        : [];
      return {
        id: String(pkg._id || pkg.id || `api-${i}`),
        name: String(pkg.name || `Package ${i + 1}`),
        description: String(pkg.description || 'Custom photography package.'),
        price: Number(pkg.price || 0),
        currency: String(pkg.currency || 'INR'),
        durationHours: Number(pkg.durationHours || 1),
        photographers: 1,
        photos: deliverables[0] || 'Edited Photos',
        album: deliverables[1] || 'Digital Delivery',
        status: 'active' as const,
        image:
          DEMO_PACKAGES[i % DEMO_PACKAGES.length]?.image ||
          DEMO_PACKAGES[0].image,
        isApi: true,
      };
    });
  }, [user?.packages]);

  const packages = apiPackages.length > 0 ? apiPackages : DEMO_PACKAGES;

  const filtered = packages.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()),
  );

  const stats = [
    {
      label: 'Total Packages',
      value: String(packages.length),
      change: '— 12% from last month',
      icon: Package,
      iconBg: 'bg-[#F3EEFF]',
      iconColor: 'text-[#6B46FE]',
      sparkColor: '#6B46FE',
      sparkPath: sparkPaths.purple,
    },
    {
      label: 'Active Packages',
      value: String(packages.filter((p) => p.status === 'active').length),
      change: '— 12% from last month',
      icon: FileText,
      iconBg: 'bg-[#E4F8ED]',
      iconColor: 'text-[#28C76F]',
      sparkColor: '#28C76F',
      sparkPath: sparkPaths.green,
    },
    {
      label: 'Total Bookings',
      value: String(user?.rating?.totalBookings ?? 18),
      change: '— 8% from last month',
      icon: CalendarCheck,
      iconBg: 'bg-[#FFF4E5]',
      iconColor: 'text-[#FF9F43]',
      sparkColor: '#FF9F43',
      sparkPath: sparkPaths.orange,
    },
    {
      label: 'Total Revenue',
      value: '₹2,45,000',
      change: '— 15% from last month',
      icon: DollarSign,
      iconBg: 'bg-[#E8F4FD]',
      iconColor: 'text-[#3498DB]',
      sparkColor: '#3498DB',
      sparkPath: sparkPaths.blue,
    },
  ];

  const refreshProfile = async () => {
    const res = await creatorService.getMyProfile();
    if (res.data) setAuth(res.data as typeof user);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.description || form.price <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSaving(true);
    try {
      await creatorService.addPackage({
        name: form.name,
        description: form.description,
        price: form.price,
        currency: form.currency,
        durationHours: form.durationHours,
        deliverables: form.deliverables
          .split(',')
          .map((d) => d.trim())
          .filter(Boolean),
      });
      toast.success('Package created successfully!');
      setShowForm(false);
      setForm({
        name: '',
        description: '',
        price: 0,
        currency: 'INR',
        durationHours: 1,
        deliverables: '',
      });
      await refreshProfile();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to create package');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (pkg: DisplayPackage) => {
    if (!pkg.isApi) {
      toast.error('Demo package — create your own to manage it');
      setMenuOpenId(null);
      return;
    }
    try {
      await creatorService.deletePackage(pkg.id);
      toast.success('Package deleted');
      setMenuOpenId(null);
      await refreshProfile();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete package');
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#2D3436]">Packages</h2>
          <p className="mt-0.5 text-sm text-[#636E72]">
            Create and manage your photography packages.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#6B46FE] to-[#8A60FF] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-[#6B46FE]/25 transition-all hover:shadow-lg"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Cancel' : 'Add Package'}
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
            <p className="mt-1 flex items-center gap-0.5 text-[11px] text-[#A0A4B0]">
              <ArrowDownRight className="h-3 w-3 text-[#EA5455]" />
              {stat.change}
            </p>
            <Sparkline color={stat.sparkColor} path={stat.sparkPath} />
          </motion.div>
        ))}
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl border border-[#EDE5FF] bg-gradient-to-r from-[#F8F5FF] to-[#F3EEFF] p-5 sm:p-6"
          >
            <h3 className="mb-4 font-bold text-[#2D3436]">New Package</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-[#2D3436]">
                  Package Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Gold Wedding Package"
                  className="w-full rounded-xl border border-[#EEF0F4] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6B46FE]/40 focus:ring-2 focus:ring-[#6B46FE]/15"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-[#2D3436]">
                  Description *
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Describe what's included..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-[#EEF0F4] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6B46FE]/40 focus:ring-2 focus:ring-[#6B46FE]/15"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#2D3436]">Price *</label>
                <div className="flex gap-2">
                  <select
                    value={form.currency}
                    onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value }))}
                    className="rounded-xl border border-[#EEF0F4] bg-white px-3 py-2.5 text-sm outline-none"
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                  </select>
                  <input
                    type="number"
                    value={form.price || ''}
                    onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
                    placeholder="15000"
                    className="flex-1 rounded-xl border border-[#EEF0F4] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6B46FE]/40 focus:ring-2 focus:ring-[#6B46FE]/15"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#2D3436]">
                  Duration (hours)
                </label>
                <input
                  type="number"
                  value={form.durationHours}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, durationHours: Number(e.target.value) }))
                  }
                  className="w-full rounded-xl border border-[#EEF0F4] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6B46FE]/40 focus:ring-2 focus:ring-[#6B46FE]/15"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-[#2D3436]">
                  Deliverables (comma separated)
                </label>
                <input
                  type="text"
                  value={form.deliverables}
                  onChange={(e) => setForm((p) => ({ ...p, deliverables: e.target.value }))}
                  placeholder="Digital Album, Raw Photos, Highlight Video"
                  className="w-full rounded-xl border border-[#EEF0F4] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6B46FE]/40 focus:ring-2 focus:ring-[#6B46FE]/15"
                />
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6B46FE] to-[#8A60FF] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#6B46FE]/25 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Creating...' : 'Create Package'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex flex-col gap-2 rounded-2xl border border-[#EEF0F4] bg-white p-3 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
        <div className="relative w-full flex-1 sm:min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A4B0]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search packages..."
            className="h-11 w-full rounded-xl border border-[#EEF0F4] bg-[#F8F9FB] py-2 pl-10 pr-3 text-sm outline-none placeholder:text-[#A0A4B0] focus:border-[#6B46FE]/40 focus:bg-white focus:ring-2 focus:ring-[#6B46FE]/15"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <button className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-[#EEF0F4] bg-white px-3 text-xs font-semibold text-[#636E72] hover:bg-[#F8F9FB]">
            <span className="truncate">All Categories</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0" />
          </button>
          <button className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-[#EEF0F4] bg-white px-3 text-xs font-semibold text-[#636E72] hover:bg-[#F8F9FB]">
            <span className="truncate">Popular</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0" />
          </button>
          <button className="col-span-2 flex h-11 items-center justify-center gap-2 rounded-xl border border-[#EEF0F4] bg-white px-3 text-xs font-semibold text-[#636E72] hover:bg-[#F8F9FB] sm:col-span-1">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </button>
        </div>
      </div>

      {/* Package cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {filtered.map((pkg, i) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group flex flex-col overflow-hidden rounded-2xl border border-[#EEF0F4] bg-white shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-md"
          >
            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden bg-[#F0F1F5]">
              <img
                src={pkg.image}
                alt={pkg.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span
                className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  pkg.status === 'active'
                    ? 'bg-[#E4F8ED] text-[#28C76F]'
                    : 'bg-[#FFF4E5] text-[#FF9F43]'
                }`}
              >
                {pkg.status === 'active' ? 'Active' : 'Inactive'}
              </span>
              <div className="absolute right-2 top-2">
                <button
                  onClick={() => setMenuOpenId(menuOpenId === pkg.id ? null : pkg.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-[#636E72] shadow-sm backdrop-blur-sm hover:bg-white"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                {menuOpenId === pkg.id && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setMenuOpenId(null)} />
                    <div className="absolute right-0 z-40 mt-1 w-36 overflow-hidden rounded-xl border border-[#EEF0F4] bg-white py-1 shadow-xl">
                      <button
                        onClick={() => {
                          setShowForm(true);
                          setMenuOpenId(null);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-[#636E72] hover:bg-[#F8F9FB]"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(pkg)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-[#EA5455] hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col p-4">
              <h3 className="text-base font-bold text-[#2D3436]">{pkg.name}</h3>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#636E72]">
                {pkg.description}
              </p>

              <div className="mt-3 space-y-2 rounded-xl bg-[#F8F9FB] p-3">
                <div className="flex items-center gap-2 text-xs text-[#636E72]">
                  <Clock className="h-3.5 w-3.5 text-[#6B46FE]" />
                  {pkg.durationHours} Hours Coverage
                </div>
                <div className="flex items-center gap-2 text-xs text-[#636E72]">
                  <Users className="h-3.5 w-3.5 text-[#6B46FE]" />
                  {pkg.photographers} Photographer{pkg.photographers > 1 ? 's' : ''}
                </div>
                <div className="flex items-center gap-2 text-xs text-[#636E72]">
                  <Image className="h-3.5 w-3.5 text-[#6B46FE]" />
                  {pkg.photos}
                </div>
                <div className="flex items-center gap-2 text-xs text-[#636E72]">
                  <BookOpen className="h-3.5 w-3.5 text-[#6B46FE]" />
                  {pkg.album}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                <p className="text-lg font-bold text-[#2D3436]">
                  {formatPrice(pkg.currency, pkg.price)}
                </p>
                {pkg.badge && (
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${badgeStyles[pkg.badge]}`}
                  >
                    {pkg.badge}
                  </span>
                )}
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setShowForm(true)}
                  className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-[#EEF0F4] py-2 text-xs font-bold text-[#636E72] transition-colors hover:bg-[#F8F9FB]"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button className="flex flex-[1.4] items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-[#6B46FE] to-[#8A60FF] py-2 text-xs font-bold text-white shadow-sm shadow-[#6B46FE]/20">
                  View Details
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#E0D4FF] bg-white py-16 text-center">
          <Package className="mx-auto h-10 w-10 text-[#C4B5FD]" />
          <p className="mt-3 text-sm font-semibold text-[#636E72]">No packages match your search</p>
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-xs text-[#A0A4B0]">
          Showing 1 to {filtered.length} of {filtered.length} packages
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
  );
}
