import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Shield, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import { Logo } from '@/pages/LandingPage/landing/Logo';
import { cn } from '@/lib/utils';
import { verifyGalleryPassword, unlockGallery } from '../hooks';
import type { Gallery } from '../types';

type Props = {
  gallery: Gallery;
  onUnlock: () => void;
};

export function GalleryPasswordPage({ gallery, onUnlock }: Props) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    if (verifyGalleryPassword(gallery, password)) {
      unlockGallery(gallery.slug);
      toast.success('Gallery unlocked!');
      onUnlock();
    } else {
      setError('Incorrect password. Please try again.');
      toast.error('Incorrect password');
    }
    setIsLoading(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8F9FB]">
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236C3BFF' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <header className="relative z-10 flex items-center justify-between px-4 py-5 sm:px-8">
        <Logo />
        <button type="button" className="flex items-center gap-1.5 rounded-full border border-[#EEF0F4] bg-white px-3 py-1.5 text-xs font-medium text-[#636E72]">
          <Globe className="h-3.5 w-3.5" /> EN
        </button>
      </header>

      <main className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md rounded-[24px] border border-[#EEF0F4] bg-white p-8 shadow-[var(--shadow-gallery)] sm:p-10"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#F3EEFF] to-[#E8F4FD]"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#6C3BFF]/30 bg-white">
              <Lock className="h-7 w-7 text-[#6C3BFF]" />
            </div>
          </motion.div>

          <h1 className="mt-6 text-center text-2xl font-bold text-[#111827]">Password Required</h1>
          <p className="mt-2 text-center text-sm text-[#636E72]">
            This gallery is protected. Enter the password shared by your photographer to view{' '}
            <span className="font-medium text-[#111827]">{gallery.name}</span>.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className={cn(
                  'w-full rounded-2xl border bg-[#F8F9FB] px-4 py-3.5 pr-12 text-sm outline-none transition',
                  error ? 'border-red-300 focus:ring-red-100' : 'border-[#EEF0F4] focus:border-[#6C3BFF]/40 focus:ring-2 focus:ring-[#6C3BFF]/10',
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A4B0] hover:text-[#636E72]"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}

            <motion.button
              type="submit"
              disabled={!password || isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full rounded-2xl bg-[#6C3BFF] py-3.5 text-sm font-semibold text-white shadow-[0_4px_16px_-2px_rgba(108,59,255,0.45)] transition hover:bg-[#5A2FE0] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Unlocking...' : 'Unlock Gallery'}
            </motion.button>
          </form>

          <button type="button" className="mt-4 w-full text-center text-xs text-[#A0A4B0] hover:text-[#6C3BFF]">
            Forgot password? Contact your photographer
          </button>

          <div className="mt-8 flex items-center justify-center gap-1.5 text-xs text-[#A0A4B0]">
            <Shield className="h-3.5 w-3.5 text-[#6C3BFF]" />
            Secured by ShootHub
          </div>
        </motion.div>
      </main>
    </div>
  );
}
