import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Copy, ExternalLink, Lock, Globe, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';
import { Logo } from '@/pages/LandingPage/landing/Logo';
import { DEMO_GALLERY_LINKS, getGalleryShareUrl } from './data/mockGalleries';
import { GalleryFooter } from './components';

export function GalleryDemoPage() {
  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(getGalleryShareUrl(slug));
    toast.success('Demo link copied!');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <header className="border-b border-[#EEF0F4] bg-white px-4 py-5 sm:px-8">
        <Link to="/"><Logo /></Link>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#F3EEFF] px-3 py-1 text-xs font-semibold text-[#6C3BFF]">
            <QrCode className="h-3.5 w-3.5" />
            Demo Gallery Links
          </div>
          <h1 className="text-3xl font-bold text-[#111827] sm:text-4xl">
            Client Gallery Experience
          </h1>
          <p className="mt-3 max-w-2xl text-[#636E72]">
            Explore the full ShootHub client gallery flow — public landing, password protection,
            AI face search, photo selection, and premium downloads.
          </p>
        </motion.div>

        <div className="mt-10 space-y-4">
          {DEMO_GALLERY_LINKS.map((demo, i) => (
            <motion.div
              key={demo.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-[24px] border border-[#EEF0F4] bg-white p-6 shadow-[var(--shadow-gallery-soft)]"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {demo.type.includes('Password') ? (
                      <Lock className="h-4 w-4 text-[#6C3BFF]" />
                    ) : (
                      <Globe className="h-4 w-4 text-[#6C3BFF]" />
                    )}
                    <span className="text-xs font-medium text-[#6C3BFF]">{demo.type}</span>
                  </div>
                  <h2 className="mt-1 text-lg font-bold text-[#111827]">{demo.label}</h2>
                  <p className="mt-1 text-sm text-[#636E72]">{demo.description}</p>
                  {'password' in demo && demo.password && (
                    <p className="mt-2 text-xs font-medium text-[#636E72]">
                      Password: <code className="rounded bg-[#F3EEFF] px-2 py-0.5 text-[#6C3BFF]">{demo.password}</code>
                    </p>
                  )}
                  <p className="mt-2 break-all font-mono text-xs text-[#A0A4B0]">
                    {getGalleryShareUrl(demo.slug)}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => copyLink(demo.slug)}
                    className="inline-flex items-center gap-1.5 rounded-2xl border border-[#EEF0F4] px-4 py-2.5 text-sm font-medium text-[#636E72] transition hover:bg-[#F8F9FB]"
                  >
                    <Copy className="h-4 w-4" /> Copy
                  </button>
                  <Link
                    to={demo.href}
                    className="inline-flex items-center gap-1.5 rounded-2xl bg-[#6C3BFF] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_-2px_rgba(108,59,255,0.45)] transition hover:bg-[#5A2FE0]"
                  >
                    <ExternalLink className="h-4 w-4" /> Open
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 rounded-[24px] bg-gradient-to-br from-[#F3EEFF] to-[#E8F4FD] p-6">
          <h3 className="font-semibold text-[#111827]">Share with clients</h3>
          <p className="mt-2 text-sm text-[#636E72]">
            Photographers can generate unique gallery links and QR codes from the creator dashboard
            at <Link to="/creator/uploads" className="font-medium text-[#6C3BFF] hover:underline">/creator/uploads</Link>.
          </p>
        </div>
      </main>

      <GalleryFooter />
    </div>
  );
}
