import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Globe,
  Lock,
  User,
  Copy,
  Lightbulb,
  ArrowRight,
  Upload,
  Shield,
  Zap,
  Heart,
  ImagePlus,
  Check,
  ChevronDown,
  Plus,
  Eye,
  EyeOff,
  Mail,
} from 'lucide-react';
import toast from 'react-hot-toast';
import weddingImg from '@/assets/landing/categories/wedding.jpg';

type Step = 1 | 2 | 3 | 4;
type Visibility = 'public' | 'password' | 'private';

export type UploadFormData = {
  galleryName: string;
  eventType: string;
  clientName: string;
  eventDate: string;
  location: string;
  description: string;
  selectedClient: string;
  visibility: Visibility;
  galleryPassword: string;
  confirmPassword: string;
  invitedEmails: string;
};

const STEPS = [
  { num: 1, label: 'Upload Details' },
  { num: 2, label: 'Upload Photos' },
  { num: 3, label: 'Settings' },
  { num: 4, label: 'Review & Share' },
] as const;

const EVENT_TYPES = ['Wedding', 'Birthday', 'Portrait', 'Corporate', 'Pre-Wedding', 'Event'];

const MOCK_CLIENTS = [
  'Rohit Sharma & Priya Sharma',
  'Ananya Gupta',
  'Rahul Mehta',
  'Sneha Kapoor',
];

const inputCls =
  'w-full rounded-xl border border-[#EEF0F4] bg-white px-3.5 py-2.5 text-sm text-[#2D3436] outline-none transition-all placeholder:text-[#A0A4B0] focus:border-[#6B46FE]/50 focus:ring-2 focus:ring-[#6B46FE]/10';

const labelCls = 'mb-1.5 block text-xs font-semibold text-[#2D3436]';

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function QrCodePreview({ value, size = 120 }: { value: string; size?: number }) {
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

function Stepper({ step }: { step: Step }) {
  return (
    <div className="flex items-center justify-center gap-0 overflow-x-auto pb-1">
      {STEPS.map((s, i) => {
        const done = step > s.num;
        const active = step === s.num;
        return (
          <div key={s.num} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5 px-2 sm:px-4">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  active
                    ? 'bg-[#6B46FE] text-white shadow-md shadow-[#6B46FE]/30'
                    : done
                      ? 'bg-[#E4F8ED] text-[#28C76F]'
                      : 'bg-[#F0F1F3] text-[#A0A4B0]'
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : s.num}
              </div>
              <span
                className={`whitespace-nowrap text-[11px] font-semibold ${
                  active ? 'text-[#6B46FE]' : done ? 'text-[#28C76F]' : 'text-[#A0A4B0]'
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mb-5 h-0.5 w-8 sm:w-16 ${step > s.num ? 'bg-[#28C76F]' : 'bg-[#EEF0F4]'}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function PreviewPanel({ data, photoCount }: { data: UploadFormData; photoCount: number }) {
  const [shareTab, setShareTab] = useState<'link' | 'qr'>('link');
  const slug = slugify(data.galleryName || 'gallery');
  const shareLink = `shoothub.com/gallery/${slug}`;
  const fullLink = `https://${shareLink}`;
  const accessLabel =
    data.visibility === 'public'
      ? 'Public'
      : data.visibility === 'password'
        ? 'Password Protected'
        : 'Private';

  const formattedDate = data.eventDate
    ? new Date(data.eventDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';

  const expiresDate = data.eventDate
    ? new Date(new Date(data.eventDate).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(
        'en-US',
        { month: 'short', day: 'numeric', year: 'numeric' },
      )
    : '—';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullLink);
      toast.success('Link copied');
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <aside className="space-y-4 xl:sticky xl:top-[88px]">
      <div className="overflow-hidden rounded-2xl border border-[#EEF0F4] bg-white shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]">
        <p className="border-b border-[#F5F6F8] px-4 py-3 text-xs font-bold text-[#2D3436]">
          Upload Preview
        </p>
        <div className="relative m-3 overflow-hidden rounded-xl">
          <img src={weddingImg} alt="" className="h-36 w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
            <p className="text-sm font-bold">{data.galleryName || 'Gallery Name'}</p>
            <p className="mt-0.5 text-[11px] text-white/80">
              {formattedDate !== '—' ? formattedDate : 'Event Date'}
              {data.location ? ` · ${data.location}` : ''}
            </p>
            {data.eventType && (
              <span className="mt-1.5 inline-block rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm">
                {data.eventType}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#EEF0F4] bg-white shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]">
        <p className="border-b border-[#F5F6F8] px-4 py-3 text-xs font-bold text-[#2D3436]">
          Share Preview
        </p>
        <div className="p-4">
          <div className="mb-3 flex gap-4 border-b border-[#F5F6F8]">
            {(['link', 'qr'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setShareTab(tab)}
                className={`relative pb-2 text-xs font-semibold ${
                  shareTab === tab ? 'text-[#6B46FE]' : 'text-[#A0A4B0] hover:text-[#636E72]'
                }`}
              >
                {tab === 'link' ? 'Share Link' : 'QR Code'}
                {shareTab === tab && (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#6B46FE]" />
                )}
              </button>
            ))}
          </div>

          {shareTab === 'link' ? (
            <div className="flex items-center gap-1 rounded-xl border border-[#EEF0F4] bg-[#FAFBFC] px-3 py-2">
              <span className="min-w-0 flex-1 truncate text-xs text-[#636E72]">{shareLink}</span>
              <button
                onClick={handleCopy}
                className="shrink-0 rounded-md p-1 text-[#A0A4B0] hover:text-[#6B46FE]"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center rounded-xl border border-[#EEF0F4] bg-[#FAFBFC] p-4">
              <div className="rounded-lg border border-[#E8EAED] bg-white p-2">
                <QrCodePreview value={fullLink} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-[#EEF0F4] bg-white shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]">
        <p className="border-b border-[#F5F6F8] px-4 py-3 text-xs font-bold text-[#2D3436]">
          Gallery Info
        </p>
        <dl className="divide-y divide-[#F5F6F8] px-4">
          {[
            ['Photos', photoCount > 0 ? String(photoCount) : '0 (To be uploaded)'],
            ['Access', accessLabel],
            ['Created On', formattedDate],
            ['Expires On', expiresDate],
            ['Storage Used', photoCount > 0 ? `${(photoCount * 0.01).toFixed(1)} MB` : '0 B'],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-2.5">
              <dt className="text-xs text-[#A0A4B0]">{label}</dt>
              <dd className="text-xs font-semibold text-[#2D3436]">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex gap-2.5 rounded-xl border border-[#E8DEFF] bg-[#F8F5FF] p-3">
        <Lightbulb className="h-4 w-4 shrink-0 text-[#6B46FE]" />
        <p className="text-[11px] leading-relaxed text-[#636E72]">
          You can change settings and access anytime from gallery settings.
        </p>
      </div>
    </aside>
  );
}

const footerFeatures = [
  { icon: Upload, label: 'Easy Upload', sub: 'Upload multiple photos at once' },
  { icon: Shield, label: 'Secure Storage', sub: 'Your photos are safe with us' },
  { icon: Zap, label: 'Instant Sharing', sub: 'Get link or QR code immediately' },
  { icon: Heart, label: 'Client Friendly', sub: 'Beautiful galleries for your clients' },
];

type Props = {
  onBack: () => void;
  onComplete?: () => void;
};

export function CreateUploadForm({ onBack, onComplete }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [photoCount, setPhotoCount] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState<UploadFormData>({
    galleryName: 'Rohit & Priya Wedding',
    eventType: 'Wedding',
    clientName: 'Rohit Sharma & Priya Sharma',
    eventDate: '2024-05-20',
    location: 'Udaipur, Rajasthan',
    description: 'Beautiful wedding ceremony and reception.',
    selectedClient: '',
    visibility: 'public',
    galleryPassword: '',
    confirmPassword: '',
    invitedEmails: '',
  });

  const update = (patch: Partial<UploadFormData>) => setForm((f) => ({ ...f, ...patch }));

  const handleVisibilityChange = (visibility: Visibility) => {
    const patch: Partial<UploadFormData> = { visibility };
    if (visibility !== 'password') {
      patch.galleryPassword = '';
      patch.confirmPassword = '';
    }
    if (visibility !== 'private') {
      patch.invitedEmails = '';
    }
    update(patch);
  };

  const visibilityOptions = [
    {
      id: 'public' as const,
      icon: Globe,
      label: 'Public',
      desc: 'Anyone with the link can view.',
    },
    {
      id: 'password' as const,
      icon: Lock,
      label: 'Password Protected',
      desc: 'Only people with password.',
    },
    {
      id: 'private' as const,
      icon: User,
      label: 'Private',
      desc: 'Only invited people.',
    },
  ];

  const handleNext = () => {
    if (step === 1) {
      if (!form.galleryName.trim() || !form.clientName.trim() || !form.eventDate) {
        toast.error('Please fill in all required fields');
        return;
      }
      if (form.visibility === 'password') {
        if (!form.galleryPassword.trim()) {
          toast.error('Please set a gallery password');
          return;
        }
        if (form.galleryPassword.length < 6) {
          toast.error('Password must be at least 6 characters');
          return;
        }
        if (form.galleryPassword !== form.confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }
      }
      if (form.visibility === 'private' && !form.invitedEmails.trim()) {
        toast.error('Please add at least one invite email');
        return;
      }
    }

    if (step < 4) setStep((s) => (s + 1) as Step);
    else {
      toast.success('Gallery created successfully!');
      onComplete?.();
      onBack();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => (s - 1) as Step);
    else onBack();
  };

  return (
    <div className="space-y-5">
      {/* Stepper */}
      <div className="rounded-2xl border border-[#EEF0F4] bg-white px-4 py-5 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]">
        <Stepper step={step} />
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[1fr_300px]">
        {/* Form area */}
        <div className="rounded-2xl border border-[#EEF0F4] bg-white shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]">
          <div className="border-b border-[#F5F6F8] px-5 py-4">
            <h3 className="text-base font-bold text-[#2D3436]">
              {STEPS[step - 1].label}
            </h3>
          </div>

          <div className="p-5">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>
                      Gallery / Event Name <span className="text-[#EA5455]">*</span>
                    </label>
                    <input
                      className={inputCls}
                      value={form.galleryName}
                      onChange={(e) => update({ galleryName: e.target.value })}
                      placeholder="e.g. Rohit & Priya Wedding"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>
                      Event Type <span className="text-[#EA5455]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        className={`${inputCls} appearance-none pr-9`}
                        value={form.eventType}
                        onChange={(e) => update({ eventType: e.target.value })}
                      >
                        {EVENT_TYPES.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A4B0]" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>
                      Client Name <span className="text-[#EA5455]">*</span>
                    </label>
                    <input
                      className={inputCls}
                      value={form.clientName}
                      onChange={(e) => update({ clientName: e.target.value })}
                      placeholder="Client full name"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>
                      Event Date <span className="text-[#EA5455]">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A4B0]" />
                      <input
                        type="date"
                        className={`${inputCls} pl-10`}
                        value={form.eventDate}
                        onChange={(e) => update({ eventDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A4B0]" />
                    <input
                      className={`${inputCls} pl-10`}
                      value={form.location}
                      onChange={(e) => update({ location: e.target.value })}
                      placeholder="City, State"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>
                    Description <span className="font-normal text-[#A0A4B0]">(Optional)</span>
                  </label>
                  <textarea
                    className={`${inputCls} min-h-[80px] resize-none`}
                    value={form.description}
                    onChange={(e) => update({ description: e.target.value })}
                    placeholder="Add a short description..."
                  />
                </div>

                <div>
                  <label className={labelCls}>
                    Select Client <span className="font-normal text-[#A0A4B0]">(Optional)</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <select
                        className={`${inputCls} appearance-none pr-9`}
                        value={form.selectedClient}
                        onChange={(e) => update({ selectedClient: e.target.value })}
                      >
                        <option value="">Search or select client...</option>
                        {MOCK_CLIENTS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A4B0]" />
                    </div>
                    <button className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[#EEF0F4] bg-white px-3 py-2.5 text-xs font-semibold text-[#636E72] hover:bg-[#F8F9FB]">
                      <Plus className="h-3.5 w-3.5" />
                      Add New Client
                    </button>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Visibility & Access</label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {visibilityOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleVisibilityChange(opt.id)}
                        className={`rounded-xl border-2 p-4 text-left transition-all ${
                          form.visibility === opt.id
                            ? 'border-[#6B46FE] bg-[#F8F5FF]'
                            : 'border-[#EEF0F4] bg-white hover:border-[#D4C4FF]'
                        }`}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                              form.visibility === opt.id
                                ? 'bg-[#6B46FE] text-white'
                                : 'bg-[#F0F1F3] text-[#636E72]'
                            }`}
                          >
                            <opt.icon className="h-4 w-4" />
                          </div>
                          <div
                            className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                              form.visibility === opt.id
                                ? 'border-[#6B46FE] bg-[#6B46FE]'
                                : 'border-[#D0D3D9]'
                            }`}
                          >
                            {form.visibility === opt.id && (
                              <div className="h-1.5 w-1.5 rounded-full bg-white" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm font-bold text-[#2D3436]">{opt.label}</p>
                        <p className="mt-0.5 text-[11px] text-[#A0A4B0]">{opt.desc}</p>
                      </button>
                    ))}
                  </div>

                  <AnimatePresence>
                    {form.visibility === 'password' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 overflow-hidden rounded-xl border border-[#E8DEFF] bg-[#F8F5FF] p-4"
                      >
                        <div className="mb-3 flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6B46FE] text-white">
                            <Lock className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#2D3436]">Gallery Password</p>
                            <p className="text-[11px] text-[#A0A4B0]">
                              Clients will need this password to view the gallery
                            </p>
                          </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className={labelCls}>
                              Password <span className="text-[#EA5455]">*</span>
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A4B0]" />
                              <input
                                type={showPassword ? 'text' : 'password'}
                                className={`${inputCls} bg-white pl-10 pr-10`}
                                value={form.galleryPassword}
                                onChange={(e) => update({ galleryPassword: e.target.value })}
                                placeholder="Enter gallery password"
                                autoComplete="new-password"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A4B0] hover:text-[#636E72]"
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className={labelCls}>
                              Confirm Password <span className="text-[#EA5455]">*</span>
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A4B0]" />
                              <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                className={`${inputCls} bg-white pl-10 pr-10`}
                                value={form.confirmPassword}
                                onChange={(e) => update({ confirmPassword: e.target.value })}
                                placeholder="Re-enter password"
                                autoComplete="new-password"
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A4B0] hover:text-[#636E72]"
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 text-[11px] text-[#A0A4B0]">
                          Minimum 6 characters. Share this password with your client separately.
                        </p>
                      </motion.div>
                    )}

                    {form.visibility === 'private' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 overflow-hidden rounded-xl border border-[#EEF0F4] bg-[#FAFBFC] p-4"
                      >
                        <label className={labelCls}>
                          Invite People <span className="text-[#EA5455]">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-[#A0A4B0]" />
                          <textarea
                            className={`${inputCls} min-h-[72px] resize-none bg-white pl-10`}
                            value={form.invitedEmails}
                            onChange={(e) => update({ invitedEmails: e.target.value })}
                            placeholder="Enter email addresses separated by commas"
                          />
                        </div>
                        <p className="mt-1.5 text-[11px] text-[#A0A4B0]">
                          Only these people will be able to access the gallery.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D4C4FF] bg-[#F8F5FF] px-6 py-16 text-center"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    setPhotoCount((c) => c + e.dataTransfer.files.length);
                  }}
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3EEFF]">
                    <ImagePlus className="h-7 w-7 text-[#6B46FE]" />
                  </div>
                  <p className="text-sm font-bold text-[#2D3436]">Drag & drop photos here</p>
                  <p className="mt-1 text-xs text-[#A0A4B0]">or click to browse from your device</p>
                  <label className="mt-4 cursor-pointer rounded-xl bg-[#6B46FE] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#5A38E0]">
                    Browse Files
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setPhotoCount((c) => c + (e.target.files?.length ?? 0))}
                    />
                  </label>
                  {photoCount > 0 && (
                    <p className="mt-3 text-xs font-semibold text-[#28C76F]">
                      {photoCount} photo{photoCount !== 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>
                <p className="text-xs text-[#A0A4B0]">
                  Supported formats: JPG, PNG, HEIC. Max 50 MB per file.
                </p>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className={labelCls}>Gallery Expiry</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A4B0]" />
                    <input
                      type="date"
                      className={`${inputCls} pl-10`}
                      defaultValue="2024-06-20"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-[#A0A4B0]">
                    Gallery will expire after this date
                  </p>
                </div>
                <div>
                  <label className={labelCls}>Download Settings</label>
                  <div className="space-y-2">
                    {['Allow clients to download photos', 'Allow full gallery download', 'Watermark previews'].map(
                      (opt, i) => (
                        <label
                          key={opt}
                          className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#EEF0F4] px-4 py-3 hover:bg-[#FAFBFC]"
                        >
                          <input
                            type="checkbox"
                            defaultChecked={i === 0}
                            className="h-4 w-4 rounded accent-[#6B46FE]"
                          />
                          <span className="text-sm text-[#2D3436]">{opt}</span>
                        </label>
                      ),
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="rounded-xl border border-[#EEF0F4] bg-[#FAFBFC] p-4">
                  <h4 className="mb-3 text-sm font-bold text-[#2D3436]">Review Summary</h4>
                  <dl className="space-y-2">
                    {[
                      ['Gallery', form.galleryName],
                      ['Event Type', form.eventType],
                      ['Client', form.clientName],
                      ['Location', form.location],
                      ['Photos', photoCount > 0 ? `${photoCount} photos` : 'None yet'],
                      [
                        'Access',
                        form.visibility === 'public'
                          ? 'Public'
                          : form.visibility === 'password'
                            ? 'Password Protected'
                            : 'Private',
                      ],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4">
                        <dt className="text-xs text-[#A0A4B0]">{k}</dt>
                        <dd className="text-right text-xs font-semibold text-[#2D3436]">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-[#E4F8ED] bg-[#F0FFF4] p-3">
                  <Check className="h-4 w-4 text-[#28C76F]" />
                  <p className="text-xs text-[#636E72]">
                    Your gallery link and QR code will be ready after creation.
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Form actions */}
          <div className="flex items-center justify-between border-t border-[#F5F6F8] px-5 py-4">
            <button
              onClick={handleBack}
              className="rounded-xl border border-[#EEF0F4] bg-white px-5 py-2.5 text-sm font-semibold text-[#636E72] hover:bg-[#F8F9FB]"
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </button>
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-xl bg-[#6B46FE] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#6B46FE]/25 hover:bg-[#5A38E0]"
            >
              {step === 4 ? (
                'Create Gallery'
              ) : step === 1 ? (
                <>
                  Next: Upload Photos
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : step === 2 ? (
                <>
                  Next: Settings
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  Next: Review & Share
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>

        <PreviewPanel data={form} photoCount={photoCount} />
      </div>

      {/* Footer features */}
      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-[#EEF0F4] bg-white p-4 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] lg:grid-cols-4">
        {footerFeatures.map((f) => (
          <div key={f.label} className="flex items-start gap-3 px-2 py-1">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F3EEFF]">
              <f.icon className="h-4 w-4 text-[#6B46FE]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#2D3436]">{f.label}</p>
              <p className="text-[11px] text-[#A0A4B0]">{f.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
