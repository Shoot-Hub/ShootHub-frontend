import { motion } from 'framer-motion';
import {
  Globe, Lock, Droplets, Download, Clock, Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GallerySettings } from '../types';

const badges = [
  { key: 'isPublic', label: 'Public', icon: Globe, show: (s: GallerySettings) => s.isPublic },
  { key: 'password', label: 'Password Protected', icon: Lock, show: (s: GallerySettings) => s.isPasswordProtected },
  { key: 'watermark', label: 'Watermark', icon: Droplets, show: (s: GallerySettings) => s.hasWatermark },
  { key: 'download', label: 'Download Enabled', icon: Download, show: (s: GallerySettings) => s.downloadEnabled },
  { key: 'expiry', label: 'Expires', icon: Clock, show: (s: GallerySettings) => Boolean(s.expiryDate) },
] as const;

type Props = { settings: GallerySettings; className?: string };

export function GallerySettingsBadges({ settings, className }: Props) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {badges.filter((b) => b.show(settings)).map(({ key, label, icon: Icon }) => (
        <span
          key={key}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#EEF0F4] bg-white/80 px-3 py-1 text-xs font-medium text-[#636E72] backdrop-blur-sm"
        >
          <Icon className="h-3.5 w-3.5 text-[#6C3BFF]" />
          {key === 'expiry' ? `${label}: ${settings.expiryDate}` : label}
        </span>
      ))}
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3EEFF] px-3 py-1 text-xs font-medium text-[#6C3BFF]">
        <Shield className="h-3.5 w-3.5" />
        Secured by ShootHub
      </span>
    </div>
  );
}

export function GalleryFooter() {
  const items = [
    { title: 'High Quality Download', desc: 'Original resolution preserved' },
    { title: 'Privacy Protected', desc: 'Your photos stay secure' },
    { title: 'Fast CDN', desc: 'Lightning-fast global delivery' },
    { title: 'AI Powered', desc: 'Smart face search & curation' },
  ];

  return (
    <footer className="border-t border-[#EEF0F4] bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4 sm:px-6 lg:px-8">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="text-center sm:text-left"
          >
            <h4 className="text-sm font-semibold text-[#111827]">{item.title}</h4>
            <p className="mt-1 text-xs text-[#636E72]">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </footer>
  );
}
