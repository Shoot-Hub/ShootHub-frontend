import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  Camera,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Link2,
  MapPin,
  MessageCircle,
  MessageSquare,
  ShieldCheck,
  Star,
  UserRound,
} from 'lucide-react';
import { Navbar } from '@/pages/LandingPage/landing/Navbar';
import { Footer } from '@/pages/LandingPage/landing/Footer';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Image } from '@/components/ui/Image';
import { useAuth } from '@/features/auth';
import { cn } from '@/lib/utils';
import { creatorsData } from './creators/data';

import heroWedding from '@/assets/landing/hero-wedding.png';
import heroPhoto from '@/assets/landing/hero-photographer.png';
import featured1 from '@/assets/landing/featured-creator-1.jpg';
import featured2 from '@/assets/landing/featured-creator-2.jpg';
import featured3 from '@/assets/landing/featured-creator-3.jpg';
import featured4 from '@/assets/landing/featured-creator-4.jpg';

const portfolioTabs = [
  'All',
  'Weddings',
  'Pre Wedding',
  'Portraits',
  'Editorial',
  'Destination',
  'Candid',
] as const;

const portfolioImages = [
  featured1,
  heroWedding,
  featured2,
  heroPhoto,
  featured3,
  featured4,
  heroWedding,
  featured1,
];

export function CreatorProfilePage() {
  const { creatorId } = useParams<{ creatorId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [aboutOpen, setAboutOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<(typeof portfolioTabs)[number]>('All');
  const [copied, setCopied] = useState(false);

  const creator = creatorsData.find((c) => c.id === creatorId);

  const aboutText = useMemo(() => {
    if (!creator) return '';
    return `${creator.name} is a passionate ${creator.title.toLowerCase()} based in ${creator.city}, India. With ${creator.experience.replace(' exp', '')} of experience capturing life's most precious moments, they specialize in ${creator.category.toLowerCase()} photography that tells authentic stories. Their work blends candid emotion with cinematic composition — so every frame feels timeless. Clients trust them for destination shoots, editorial campaigns, and intimate celebrations alike.`;
  }, [creator]);

  const handleBook = () => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: { from: `/creators/${creatorId}`, intent: 'book' },
      });
      return;
    }
    navigate('/creators');
  };

  const handleMessage = () => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: { from: `/creators/${creatorId}`, intent: 'message' },
      });
      return;
    }
    navigate('/creators');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  if (!creator) {
    return (
      <div className="min-h-screen bg-white pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
        <Navbar />
        <Container className="py-20 text-center">
          <h1 className="text-2xl font-bold text-[#2D3436]">Creator not found</h1>
          <p className="mt-2 text-sm text-[#636E72]">
            This profile may have been removed or the link is incorrect.
          </p>
          <Link to="/creators" className="mt-6 inline-block">
            <Button pill>Browse Creators</Button>
          </Link>
        </Container>
        <Footer />
      </div>
    );
  }

  const experienceLabel = creator.experience.replace(' exp', '').includes('+')
    ? creator.experience.replace(' exp', '')
    : creator.experience.replace(' yrs exp', '+ Years').replace(' yr exp', '+ Year');
  const expDisplay = experienceLabel.includes('Year')
    ? experienceLabel
    : `${creator.experience.replace(' exp', '').replace('yrs', 'Years').replace('yr', 'Year')}`;

  return (
    <div className="min-h-screen bg-[#FAFBFC] pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
      <Navbar />

      <main className="mx-auto w-full max-w-[1280px] px-4 pb-10 pt-4 sm:px-6 sm:pt-6 lg:px-8">        <Link
          to="/creators"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#636E72] transition-colors hover:text-[#6B46FE]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to creators
        </Link>

        {/* Hero card */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-2xl border border-[#EEF0F4] bg-white shadow-[0_4px_24px_-8px_rgba(15,23,42,0.08)]"
        >
          {/* Cover banner */}
          <div className="relative h-[160px] overflow-hidden sm:h-[200px] lg:h-[220px]">
            <Image
              src={creator.image}
              alt=""
              className="h-full w-full scale-105 object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a0b3a]/85 via-[#3b1d7a]/70 to-[#6B46FE]/55" />
            <div className="absolute inset-y-0 right-0 flex max-w-[55%] items-center justify-end px-5 sm:px-10">
              <p className="text-right text-lg font-bold leading-tight text-white sm:text-2xl lg:text-[28px]">
                We don&apos;t just click,
                <br />
                <span className="text-[#C4B5FD]">WE CAPTURE</span>{' '}
                <span className="text-[#A78BFA]">EMOTIONS</span>
              </p>
            </div>
          </div>

          {/* Profile row */}
          <div className="relative px-4 pb-5 pt-0 sm:px-6 sm:pb-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-5">
                <div className="-mt-12 h-[96px] w-[96px] shrink-0 overflow-hidden rounded-2xl border-[4px] border-white bg-white shadow-lg sm:-mt-14 sm:h-[112px] sm:w-[112px]">
                  <Image
                    src={creator.image}
                    alt={creator.alt}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0 pb-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-extrabold tracking-tight text-[#111827] sm:text-[28px]">
                      {creator.name}
                    </h1>
                    {creator.verified ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#F3EEFF] px-2.5 py-1 text-[11px] font-bold text-[#6B46FE]">
                        <BadgeCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
                        Verified
                      </span>
                    ) : null}
                    {creator.topRated ? (
                      <span className="rounded-full bg-[#FFF4E5] px-2.5 py-1 text-[11px] font-bold text-[#E67E22]">
                        Top Rated
                      </span>
                    ) : (
                      <span className="rounded-full bg-[#FFF4E5] px-2.5 py-1 text-[11px] font-bold text-[#E67E22]">
                        Top Rated
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-[#636E72] sm:text-[15px]">{creator.title}</p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-[#636E72]">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-[#111827]">
                      <Star className="h-4 w-4 fill-[#F5A623] text-[#F5A623]" strokeWidth={0} />
                      {creator.rating.toFixed(1)}
                      <span className="font-medium text-[#A0A4B0]">(128 reviews)</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#A0A4B0]" />
                      {creator.city}, India
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Camera className="h-3.5 w-3.5 text-[#A0A4B0]" />
                      {expDisplay.includes('Year') ? expDisplay : `${expDisplay} Experience`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5 lg:pb-1">
                <button
                  type="button"
                  onClick={handleMessage}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-5 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB]"
                >
                  <MessageSquare className="h-4 w-4" />
                  Message
                </button>
                <a
                  href={`https://wa.me/919876543210?text=${encodeURIComponent(
                    `Hi ${creator.name}! I found you on ShootHub and would like to discuss a booking for ${creator.category}.`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#25D366] px-5 text-sm font-bold text-white shadow-[0_4px_14px_-2px_rgba(37,211,102,0.35)] transition-colors hover:bg-[#1EBE57]"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
                <button
                  type="button"
                  onClick={handleBook}
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#6B46FE] px-5 text-sm font-bold text-white shadow-[0_4px_14px_-2px_rgba(107,70,254,0.4)] transition-colors hover:bg-[#5A38E8]"
                >
                  <Calendar className="h-4 w-4" />
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Content + sidebar */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* Left */}
          <div className="min-w-0 space-y-6">
            <section className="rounded-2xl border border-[#EEF0F4] bg-white p-5 sm:p-6">
              <h2 className="text-lg font-bold text-[#111827]">About</h2>
              <p
                className={cn(
                  'mt-3 text-[14px] leading-relaxed text-[#636E72]',
                  !aboutOpen && 'line-clamp-3',
                )}
              >
                {aboutText}
              </p>
              <button
                type="button"
                onClick={() => setAboutOpen((v) => !v)}
                className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#6B46FE] hover:underline"
              >
                {aboutOpen ? 'Show less' : 'Read more'}
                {aboutOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </section>

            <section className="rounded-2xl border border-[#EEF0F4] bg-white p-5 sm:p-6">
              <h2 className="text-lg font-bold text-[#111827]">Portfolio</h2>
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {portfolioTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors',
                      activeTab === tab
                        ? 'bg-[#6B46FE] text-white shadow-sm shadow-[#6B46FE]/25'
                        : 'border border-[#E5E7EB] bg-white text-[#636E72] hover:border-[#6B46FE]/30 hover:text-[#6B46FE]',
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 md:gap-3">
                {portfolioImages.map((src, i) => (
                  <div
                    key={`${activeTab}-${i}`}
                    className="aspect-[4/3] overflow-hidden rounded-xl bg-[#F3F4F6]"
                  >
                    <Image
                      src={src}
                      alt={`${creator.name} portfolio ${i + 1}`}
                      className={cn(
                        'h-full w-full object-cover transition-transform duration-500 hover:scale-105',
                        i % 3 === 1 && 'object-[40%_30%]',
                        i % 3 === 2 && 'object-[60%_40%]',
                      )}
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-[88px] lg:self-start">
            <div className="rounded-2xl border border-[#EEF0F4] bg-white p-5 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#A0A4B0]">
                Starting at
              </p>
              <p className="mt-1.5 text-[28px] font-extrabold tracking-tight text-[#111827]">
                {creator.price}
                <span className="ml-1 text-sm font-medium text-[#636E72]">/event</span>
              </p>
              <Button
                fullWidth
                className="mt-4 h-12 rounded-xl bg-[#6B46FE] text-sm font-bold hover:bg-[#5A38E8]"
                leftIcon={<Calendar className="h-4 w-4" />}
                onClick={handleBook}
              >
                Request Booking
              </Button>
            </div>

            <div className="rounded-2xl border border-[#EEF0F4] bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-[#111827]">Quick Facts</h3>
              <ul className="mt-3 space-y-3 text-sm">
                {[
                  ['Category', creator.category],
                  ['Location', creator.city],
                  ['Experience', expDisplay.includes('Year') ? expDisplay : creator.experience],
                  ['Rating', `${creator.rating.toFixed(1)} ★`],
                ].map(([label, value]) => (
                  <li key={label} className="flex items-center justify-between gap-3">
                    <span className="text-[#A0A4B0]">{label}</span>
                    <span className="font-semibold text-[#111827]">{value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-[#EEF0F4] bg-white p-5 shadow-sm">
              <ul className="space-y-3.5 text-sm text-[#374151]">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F3EEFF] text-[#6B46FE]">
                    <Clock className="h-4 w-4" />
                  </span>
                  <span>Usually responds within 1 hour</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E4F8ED] text-[#28C76F]">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <span>100% Response Rate</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8F4FD] text-[#3498DB]">
                    <Calendar className="h-4 w-4" />
                  </span>
                  <span>Booked 120+ times</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF4E5] text-[#FF9F43]">
                    <UserRound className="h-4 w-4" />
                  </span>
                  <span>Member since 2021</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[#EEF0F4] bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-[#111827]">Share Profile</h3>
              <div className="mt-3 flex items-center gap-2.5">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white"
                  aria-label="Share on WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white"
                  aria-label="Share on Instagram"
                >
                  <Camera className="h-4 w-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] text-white"
                  aria-label="Share on Facebook"
                >
                  <span className="text-sm font-bold">f</span>
                </a>
                <button
                  type="button"
                  onClick={copyLink}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F4F6] text-[#636E72] hover:bg-[#E5E7EB]"
                  aria-label="Copy link"
                  title={copied ? 'Copied!' : 'Copy link'}
                >
                  {copied ? <Copy className="h-4 w-4 text-[#28C76F]" /> : <Link2 className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
