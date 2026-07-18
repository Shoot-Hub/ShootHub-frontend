import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, setAuth } from '@/store';
import {
  Mail,
  Phone,
  Camera,
  Save,
  Edit3,
  X,
  Loader2,
  Sparkles,
  Tag,
  BookOpen,
  Languages,
  Shield,
  BadgeCheck,
  Clock,
  Package,
  ChevronRight,
  Crown,
  Globe,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { creatorService } from '@/services/creator';

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-3.2-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9C2.4 3.9 4 2.4 7.1 2.3 8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.2 0-3.5 0-4.8.1-2.2.1-3.3 1.2-3.4 3.4-.1 1.2-.1 1.6-.1 4.8s0 3.5.1 4.8c.1 2.2 1.2 3.3 3.4 3.4 1.2.1 1.6.1 4.8.1s3.5 0 4.8-.1c2.2-.1 3.3-1.2 3.4-3.4.1-1.2.1-1.6.1-4.8s0-3.5-.1-4.8c-.1-2.2-1.2-3.3-3.4-3.4-1.3-.1-1.6-.1-4.8-.1zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8zm0 8.1a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zm6.3-8.4a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0z" />
    </svg>
  );
}

function IconFacebook({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z" />
    </svg>
  );
}

function IconYoutube({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.8 15.5v-7l6.3 3.5-6.3 3.5z" />
    </svg>
  );
}

function IconLinkedin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M6.3 9H3.2v12h3.1V9zM4.7 3.3a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6zM20.8 9c-1.7 0-2.8.9-3.3 1.7h-.1V9h-3.1c0 1.4 0 12 0 12h3.1v-6.7c0-.4 0-.7.1-1 .3-.7.9-1.4 2-1.4 1.4 0 2 1.1 2 2.7V21h3.1v-7.2C24.7 10.5 22.9 9 20.8 9z" />
    </svg>
  );
}

function IconBehance({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M8.2 10.4c.9-.4 1.4-1 1.4-2 0-2-1.6-2.9-4-2.9H1v11h4.8c2.6 0 4.4-1.3 4.4-3.5 0-1.5-.8-2.5-2-2.6zM4.2 7.2h1.5c1 0 1.6.4 1.6 1.2s-.6 1.2-1.6 1.2H4.2V7.2zm1.8 7.7H4.2v-2.8h1.8c1.2 0 1.9.5 1.9 1.4s-.7 1.4-1.9 1.4zM15.7 7.8h4.5V6.5h-4.5v1.3zm5.7 3.3c-.5-2.4-2.4-3.7-5.1-3.7-3.2 0-5.4 2.2-5.4 5.4s2.2 5.4 5.5 5.4c2.7 0 4.6-1.3 5.2-3.6h-2.6c-.3.9-1.2 1.4-2.5 1.4-1.7 0-2.8-1.1-2.9-2.8h8c0-.2.1-.7.1-1 .1-.4 0-.7-.3-1.1zm-7.9.4c.3-1.5 1.3-2.4 2.8-2.4 1.5 0 2.4.9 2.6 2.4h-5.4z" />
    </svg>
  );
}

const SPECIALIZATION_OPTIONS = [
  'wedding',
  'pre_wedding',
  'portrait',
  'maternity',
  'newborn',
  'baby',
  'birthday',
  'corporate',
  'product',
  'fashion',
  'food',
  'real_estate',
  'wildlife',
  'nature',
  'travel',
  'sports',
  'event',
  'boudoir',
  'fine_art',
  'aerial_drone',
  'videography',
  'cinematography',
  'other',
];

function formatLabel(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function TagChip({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-[#F3EEFF] px-3 py-1.5 text-xs font-semibold text-[#6B46FE]">
      {formatLabel(label)}
    </span>
  );
}

function CardShell({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[#EEF0F4] bg-white p-5 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

function EditBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#6B46FE] transition-colors hover:bg-[#F3EEFF]"
    >
      <Edit3 className="h-3.5 w-3.5" />
      Edit
    </button>
  );
}

export function ProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    displayName: '',
    about: '',
    experienceYears: 0,
    specializations: '',
    skills: '',
    editingStyles: '',
    isNegotiable: false,
    willingToTravel: false,
    travelRadiusKm: 0,
    travelChargePerKm: 0,
  });

  useEffect(() => {
    if (user) {
      setForm({
        displayName: user.displayName || '',
        about: user.about || '',
        experienceYears: user.experienceYears || 0,
        specializations: (user.specializations || []).join(', '),
        skills: (user.skills || []).join(', '),
        editingStyles: (user.editingStyles || []).join(', '),
        isNegotiable: user.isNegotiable || false,
        willingToTravel: user.willingToTravel || false,
        travelRadiusKm: user.travelRadiusKm || 0,
        travelChargePerKm: user.travelChargePerKm || 0,
      });
    }
  }, [user]);

  const displayName =
    user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Creator';
  const initials = displayName
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const userAvatar = user?.avatar?.url;
  const userCover = user?.coverPhoto?.url;
  const plan = user?.currentSubscription?.plan || 'Free';
  const planActive = (user?.currentSubscription?.status || 'active') === 'active';
  const maxImages = user?.currentSubscription?.features?.maxPortfolioImages ?? 10;

  const socialPlatforms = [
    {
      key: 'instagram',
      label: 'Instagram',
      icon: IconInstagram,
      value: user?.socialLinks?.instagram,
      color: 'text-[#E1306C]',
      bg: 'bg-[#FCE8F0]',
    },
    {
      key: 'behance',
      label: 'Behance',
      icon: IconBehance,
      value: user?.socialLinks?.behance,
      color: 'text-[#1769FF]',
      bg: 'bg-[#E8F0FF]',
    },
    {
      key: 'facebook',
      label: 'Facebook',
      icon: IconFacebook,
      value: user?.socialLinks?.facebook,
      color: 'text-[#1877F2]',
      bg: 'bg-[#E8F1FD]',
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      icon: IconLinkedin,
      value: user?.socialLinks?.linkedin,
      color: 'text-[#0A66C2]',
      bg: 'bg-[#E7F0F8]',
    },
    {
      key: 'youtube',
      label: 'YouTube',
      icon: IconYoutube,
      value: user?.socialLinks?.youtube,
      color: 'text-[#FF0000]',
      bg: 'bg-[#FFE8E8]',
    },
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      await creatorService.updateInfo({
        displayName: form.displayName || undefined,
        about: form.about || undefined,
        experienceYears: form.experienceYears,
        specializations: form.specializations
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        skills: form.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        editingStyles: form.editingStyles
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        isNegotiable: form.isNegotiable,
        willingToTravel: form.willingToTravel,
        travelRadiusKm: form.travelRadiusKm,
        travelChargePerKm: form.travelChargePerKm,
      });
      toast.success('Profile updated successfully!');
      setEditing(false);
      const res = await creatorService.getMyProfile();
      if (res.data) setAuth(res.data as typeof user);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      await creatorService.updateAvatar(file);
      toast.success('Profile photo updated!');
      const res = await creatorService.getMyProfile();
      if (res.data) setAuth(res.data as typeof user);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update avatar');
    } finally {
      setUploadingAvatar(false);
      e.target.value = '';
    }
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      await creatorService.updateCover(file, form.displayName || undefined);
      toast.success('Cover photo updated!');
      const res = await creatorService.getMyProfile();
      if (res.data) setAuth(res.data as typeof user);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update cover');
    } finally {
      setUploadingCover(false);
      e.target.value = '';
    }
  };

  const defaultAbout =
    "Passionate photographer capturing life's most precious moments. Specializing in weddings, portraits, and events with a cinematic storytelling approach.";

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      {/* Profile banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-[#EEF0F4] bg-white shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]"
      >
        <div className="relative h-44 overflow-hidden sm:h-52">
          {userCover ? (
            <img src={userCover} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#8A60FF_0%,_#4C1D95_45%,_#1E0A3C_100%)]">
              <div className="absolute -right-10 top-0 h-64 w-64 rounded-full bg-[#6B46FE]/30 blur-3xl" />
              <div className="absolute bottom-0 left-1/3 h-40 w-80 rounded-full bg-[#A78BFA]/20 blur-2xl" />
              <svg
                className="absolute inset-0 h-full w-full opacity-40"
                viewBox="0 0 800 200"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,120 C150,40 300,180 450,80 C600,0 700,140 800,60 L800,200 L0,200 Z"
                  fill="url(#coverGrad)"
                />
                <defs>
                  <linearGradient id="coverGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#6B46FE" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          )}

          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverChange}
          />

          <button
            onClick={() => setEditing(true)}
            className="absolute left-3 top-3 flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/15 px-2.5 py-2 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-white/25 sm:left-4 sm:top-4 sm:gap-2 sm:px-3.5 sm:text-sm"
          >
            <Edit3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline sm:inline">Edit Profile</span>
            <span className="sm:hidden">Edit</span>
          </button>

          <button
            onClick={() => coverInputRef.current?.click()}
            disabled={uploadingCover}
            className="absolute right-3 top-3 flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/15 px-2.5 py-2 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-white/25 disabled:opacity-70 sm:right-4 sm:top-4 sm:gap-2 sm:px-3.5 sm:text-sm"
          >
            {uploadingCover ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />
            ) : (
              <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            )}
            <span className="hidden sm:inline">
              {uploadingCover ? 'Uploading...' : 'Change Cover'}
            </span>
            <span className="sm:hidden">{uploadingCover ? '...' : 'Cover'}</span>
          </button>
        </div>

        <div className="relative px-5 pb-6 sm:px-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-5">
            <div className="relative -mt-14 shrink-0 sm:-mt-16">
              <div className="flex h-[104px] w-[104px] items-center justify-center overflow-hidden rounded-full border-[4px] border-white bg-gradient-to-br from-[#6B46FE] to-[#8A60FF] text-3xl font-bold text-white shadow-lg sm:h-28 sm:w-28 sm:text-4xl">
                {userAvatar ? (
                  <img src={userAvatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <button
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#6B46FE] text-white shadow-md transition-all hover:bg-[#5A3AE8] disabled:opacity-70"
              >
                {uploadingAvatar ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Camera className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            <div className="min-w-0 flex-1 pb-1 pt-1 sm:pt-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold text-[#2D3436] sm:text-[26px]">{displayName}</h2>
                {(user?.isVerified || user?.isKycVerified || user?.isEmailVerified) && (
                  <BadgeCheck className="h-5 w-5 fill-[#3498DB] text-white" />
                )}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-[#636E72]">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-[#A0A4B0]" />
                  {user?.email || '—'}
                </span>
                {user?.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-[#A0A4B0]" />
                    {user.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit panel */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl border border-[#EDE5FF] bg-gradient-to-r from-[#F8F5FF] to-[#F3EEFF] p-5 sm:p-6"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6B46FE] text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#2D3436]">Edit Profile</h3>
                  <p className="text-xs text-[#636E72]">Update your professional information</p>
                </div>
              </div>
              <button
                onClick={() => setEditing(false)}
                className="rounded-xl p-2 text-[#636E72] hover:bg-white/60"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#2D3436]">
                  Display Name
                </label>
                <input
                  type="text"
                  value={form.displayName}
                  onChange={(e) => setForm((p) => ({ ...p, displayName: e.target.value }))}
                  placeholder="e.g. Epic Clicks"
                  className="w-full rounded-xl border border-[#EEF0F4] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6B46FE]/40 focus:ring-2 focus:ring-[#6B46FE]/15"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#2D3436]">
                  Experience (years)
                </label>
                <input
                  type="number"
                  value={form.experienceYears}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, experienceYears: Number(e.target.value) }))
                  }
                  className="w-full rounded-xl border border-[#EEF0F4] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6B46FE]/40 focus:ring-2 focus:ring-[#6B46FE]/15"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-[#2D3436]">About</label>
                <textarea
                  value={form.about}
                  onChange={(e) => setForm((p) => ({ ...p, about: e.target.value }))}
                  rows={3}
                  placeholder="Tell clients about your photography style..."
                  className="w-full resize-none rounded-xl border border-[#EEF0F4] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6B46FE]/40 focus:ring-2 focus:ring-[#6B46FE]/15"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-[#2D3436]">
                  Specializations
                </label>
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {SPECIALIZATION_OPTIONS.map((spec) => {
                    const selected = form.specializations
                      .split(',')
                      .map((s) => s.trim().toLowerCase())
                      .includes(spec);
                    return (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => {
                          const current = form.specializations
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean);
                          const idx = current.findIndex((s) => s.toLowerCase() === spec);
                          if (idx >= 0) current.splice(idx, 1);
                          else current.push(spec);
                          setForm((p) => ({ ...p, specializations: current.join(', ') }));
                        }}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                          selected
                            ? 'border-[#6B46FE] bg-[#6B46FE] text-white shadow-sm'
                            : 'border-[#EEF0F4] bg-white text-[#636E72] hover:border-[#6B46FE]/40 hover:text-[#6B46FE]'
                        }`}
                      >
                        {formatLabel(spec)}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#2D3436]">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={form.skills}
                  onChange={(e) => setForm((p) => ({ ...p, skills: e.target.value }))}
                  placeholder="Photoshop, Lightroom, candid"
                  className="w-full rounded-xl border border-[#EEF0F4] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6B46FE]/40 focus:ring-2 focus:ring-[#6B46FE]/15"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#2D3436]">
                  Editing Styles (comma separated)
                </label>
                <input
                  type="text"
                  value={form.editingStyles}
                  onChange={(e) => setForm((p) => ({ ...p, editingStyles: e.target.value }))}
                  placeholder="Natural, Cinematic, Vintage"
                  className="w-full rounded-xl border border-[#EEF0F4] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6B46FE]/40 focus:ring-2 focus:ring-[#6B46FE]/15"
                />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6B46FE] to-[#8A60FF] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#6B46FE]/25 transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="rounded-xl border border-[#EEF0F4] bg-white px-6 py-2.5 text-sm font-semibold text-[#636E72] hover:bg-[#F8F9FB]"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Two-column content */}
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        {/* Left column */}
        <div className="space-y-5">
          {/* About */}
          <CardShell>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F3EEFF]">
                  <BookOpen className="h-4 w-4 text-[#6B46FE]" />
                </div>
                <h3 className="text-base font-bold text-[#2D3436]">About</h3>
              </div>
              <EditBtn onClick={() => setEditing(true)} />
            </div>
            <p className="text-sm leading-relaxed text-[#636E72]">
              {user?.about || defaultAbout}
            </p>
          </CardShell>

          {/* Specializations & Skills */}
          <CardShell>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F3EEFF]">
                  <Tag className="h-4 w-4 text-[#6B46FE]" />
                </div>
                <h3 className="text-base font-bold text-[#2D3436]">Specializations & Skills</h3>
              </div>
              <EditBtn onClick={() => setEditing(true)} />
            </div>

            <div className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#A0A4B0]">
                  Specializations
                </p>
                <div className="flex flex-wrap gap-2">
                  {(user?.specializations?.length ?? 0) > 0 ? (
                    user?.specializations?.map((spec) => <TagChip key={spec} label={spec} />)
                  ) : (
                    <>
                      {['Wedding', 'Portrait', 'Event', 'Fashion', 'Product'].map((t) => (
                        <TagChip key={t} label={t} />
                      ))}
                    </>
                  )}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#A0A4B0]">
                  Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {(user?.skills?.length ?? 0) > 0 ? (
                    user?.skills?.map((skill) => <TagChip key={skill} label={skill} />)
                  ) : (
                    <>
                      {['Photoshop', 'Lightroom', 'Premiere Pro', 'After Effects'].map((t) => (
                        <TagChip key={t} label={t} />
                      ))}
                    </>
                  )}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#A0A4B0]">
                  Editing Styles
                </p>
                <div className="flex flex-wrap gap-2">
                  {(user?.editingStyles?.length ?? 0) > 0 ? (
                    user?.editingStyles?.map((style) => <TagChip key={style} label={style} />)
                  ) : (
                    <>
                      {['Natural', 'Cinematic', 'Vintage', 'High Contrast'].map((t) => (
                        <TagChip key={t} label={t} />
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardShell>

          {/* Packages + Availability */}
          <div className="grid gap-5 sm:grid-cols-2">
            <CardShell className="flex flex-col">
              <div className="mb-4 flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F3EEFF]">
                  <Package className="h-4 w-4 text-[#6B46FE]" />
                </div>
                <h3 className="text-base font-bold text-[#2D3436]">My Packages</h3>
              </div>

              {(user?.packages?.length ?? 0) > 0 ? (
                <div className="space-y-2">
                  {user?.packages?.slice(0, 2).map((pkg, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-[#F0F1F5] bg-[#FAFBFC] p-3"
                    >
                      <p className="text-sm font-semibold text-[#2D3436]">
                        {String(pkg.name || `Package ${i + 1}`)}
                      </p>
                      <p className="text-xs font-bold text-[#6B46FE]">
                        {String(pkg.currency || '₹')} {String(pkg.price || 0)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mb-4 flex-1 text-sm text-[#A0A4B0]">No packages yet.</p>
              )}

              <Link
                to="/creator/packages"
                className="mt-auto inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#6B46FE] to-[#8A60FF] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-[#6B46FE]/20 transition-all hover:shadow-lg"
              >
                Create Package
              </Link>
            </CardShell>

            <CardShell className="flex flex-col">
              <div className="mb-4 flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F3EEFF]">
                  <Clock className="h-4 w-4 text-[#6B46FE]" />
                </div>
                <h3 className="text-base font-bold text-[#2D3436]">Weekly Availability</h3>
              </div>

              {(user?.availability?.length ?? 0) > 0 ? (
                <div className="mb-4 grid grid-cols-2 gap-1.5">
                  {user?.availability?.slice(0, 4).map((slot, i) => (
                    <div
                      key={i}
                      className={`rounded-lg p-2 text-center text-[10px] ${
                        slot.isAvailable
                          ? 'bg-[#E4F8ED] text-[#28C76F]'
                          : 'bg-[#F5F6F8] text-[#A0A4B0]'
                      }`}
                    >
                      <p className="font-bold capitalize">{slot.day.slice(0, 3)}</p>
                      <p>{slot.isAvailable ? `${slot.startTime}–${slot.endTime}` : 'Off'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mb-4 flex-1 text-sm text-[#A0A4B0]">No availability set.</p>
              )}

              <Link
                to="/creator/settings"
                className="mt-auto inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#6B46FE] to-[#8A60FF] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-[#6B46FE]/20 transition-all hover:shadow-lg"
              >
                Set Your Hours
              </Link>
            </CardShell>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Verification */}
          <CardShell>
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F3EEFF]">
                <Shield className="h-4 w-4 text-[#6B46FE]" />
              </div>
              <h3 className="text-base font-bold text-[#2D3436]">Verification</h3>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Email', done: user?.isEmailVerified ?? true },
                { label: 'Phone', done: user?.isPhoneVerified ?? true },
                { label: 'KYC', done: user?.isKycVerified ?? false },
              ].map((item) => (
                <button
                  key={item.label}
                  className="flex w-full items-center justify-between rounded-xl bg-[#FAFBFC] px-3.5 py-3 transition-colors hover:bg-[#F5F6FA]"
                >
                  <span className="text-sm font-medium text-[#2D3436]">{item.label}</span>
                  <span className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold ${item.done ? 'text-[#28C76F]' : 'text-[#FF9F43]'}`}
                    >
                      {item.done ? '✓ Verified' : 'Pending'}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-[#A0A4B0]" />
                  </span>
                </button>
              ))}
            </div>
          </CardShell>

          {/* Languages */}
          <CardShell>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F3EEFF]">
                  <Languages className="h-4 w-4 text-[#6B46FE]" />
                </div>
                <h3 className="text-base font-bold text-[#2D3436]">Languages</h3>
              </div>
              <EditBtn onClick={() => setEditing(true)} />
            </div>
            <p className="text-sm font-medium text-[#636E72]">
              {(user?.languages?.length ?? 0) > 0
                ? user?.languages?.join(', ')
                : 'English, Hindi'}
            </p>
          </CardShell>

          {/* Social Links */}
          <CardShell>
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F3EEFF]">
                <Globe className="h-4 w-4 text-[#6B46FE]" />
              </div>
              <h3 className="text-base font-bold text-[#2D3436]">Social Links</h3>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {socialPlatforms.map((platform) => (
                <button
                  key={platform.key}
                  className="flex items-center gap-2.5 rounded-xl border border-[#F0F1F5] bg-[#FAFBFC] px-3 py-2.5 text-left transition-colors hover:bg-[#F5F6FA]"
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${platform.bg}`}
                  >
                    <platform.icon className={`h-4 w-4 ${platform.color}`} />
                  </div>
                  <span className="min-w-0 flex-1 truncate text-xs font-semibold text-[#636E72]">
                    {platform.value || `Add ${platform.label}`}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#A0A4B0]" />
                </button>
              ))}
            </div>
          </CardShell>

          {/* Subscription */}
          <CardShell>
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF4E5]">
                <Crown className="h-4 w-4 text-[#FF9F43]" />
              </div>
              <h3 className="text-base font-bold text-[#2D3436]">Subscription</h3>
            </div>
            <div className="mb-1 flex items-center justify-between">
              <p className="text-base font-bold capitalize text-[#2D3436]">{plan} Plan</p>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                  planActive
                    ? 'bg-[#E4F8ED] text-[#28C76F]'
                    : 'bg-[#FFF4E5] text-[#FF9F43]'
                }`}
              >
                {planActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="mb-4 text-xs text-[#A0A4B0]">Up to {maxImages} portfolio images</p>
            <button className="w-full rounded-xl border-2 border-[#6B46FE] px-4 py-2.5 text-sm font-bold text-[#6B46FE] transition-all hover:bg-[#F3EEFF]">
              Upgrade Plan
            </button>
          </CardShell>
        </div>
      </div>
    </div>
  );
}
