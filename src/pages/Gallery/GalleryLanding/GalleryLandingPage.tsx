import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calendar, MapPin, Camera, Globe, ArrowRight, Shield,
} from 'lucide-react';
import { Logo } from '@/pages/LandingPage/landing/Logo';
import { GallerySettingsBadges, GalleryFooter } from '../components';
import type { Gallery } from '../types';

type Props = {
  gallery: Gallery;
  onEnter: () => void;
};

export function GalleryLandingPage({ gallery, onEnter }: Props) {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0">
        <img src={gallery.coverImage} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="px-4 py-5 sm:px-8">
          <Logo className="brightness-0 invert" />
        </header>

        <main className="flex flex-1 items-center justify-center px-4 pb-16 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-lg rounded-[24px] border border-white/20 bg-white/10 p-8 shadow-[var(--shadow-gallery)] backdrop-blur-2xl sm:p-10"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              <Globe className="h-3.5 w-3.5" />
              Public Gallery
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {gallery.name}
            </h1>

            <div className="mt-4 space-y-2 text-sm text-white/80">
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4 shrink-0" /> {gallery.eventDate}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" /> {gallery.location}
              </p>
              <p className="flex items-center gap-2">
                <Camera className="h-4 w-4 shrink-0" /> {gallery.photographer.name}
                {gallery.photographer.studio && ` · ${gallery.photographer.studio}`}
              </p>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <img
                src={gallery.photographer.avatar}
                alt={gallery.photographer.name}
                className="h-10 w-10 rounded-full ring-2 ring-white/30"
              />
              <div>
                <p className="text-sm font-medium text-white">{gallery.photographer.name}</p>
                <p className="text-xs text-white/60">{gallery.photoCount.toLocaleString()} photos</p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-white/70">{gallery.description}</p>

            <motion.button
              type="button"
              onClick={onEnter}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-[24px] bg-[#6C3BFF] py-4 text-base font-semibold text-white shadow-[0_8px_32px_-4px_rgba(108,59,255,0.6)] transition hover:bg-[#5A2FE0]"
            >
              View Gallery
              <ArrowRight className="h-5 w-5" />
            </motion.button>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-white/50">
              <Shield className="h-3.5 w-3.5" />
              Secured by ShootHub
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export function GalleryLandingShell({ gallery }: { gallery: Gallery }) {
  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <div className="relative h-[50vh] min-h-[360px]">
        <img src={gallery.coverImage} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8F9FB] via-transparent to-black/20" />
        <header className="absolute left-0 right-0 top-0 px-4 py-5 sm:px-8">
          <Link to="/"><Logo /></Link>
        </header>
      </div>

      <div className="relative -mt-24 mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[24px] bg-white p-8 shadow-[var(--shadow-gallery)]"
        >
          <GallerySettingsBadges settings={gallery.settings} className="mb-4" />
          <h1 className="text-3xl font-bold text-[#111827]">{gallery.name}</h1>
          <p className="mt-4 text-[#636E72] leading-relaxed">{gallery.description}</p>
        </motion.div>
      </div>
      <GalleryFooter />
    </div>
  );
}
