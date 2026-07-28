import { motion } from 'framer-motion';
import { ArrowRight, Clapperboard, Compass, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ExploreHero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[28px] border border-[#E8E4F5] bg-[#0B0B0F] text-white shadow-[0_24px_60px_-20px_rgba(107,70,254,0.45)]"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-45"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&h=900&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B0B0F] via-[#1a1035]/92 to-[#6B46FE]/55" />
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#8A60FF]/30 blur-3xl" />
      <div className="absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-[#6B46FE]/25 blur-3xl" />

      <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-[#C4B5FD]" />
          ShootHub for customers
        </div>

        <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
          Book Your Perfect Photographer
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
          Discover verified photographers, explore portfolios, compare packages and book your next
          shoot.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/user/explore-creators"
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-[#111827] shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#F8F7FF]"
          >
            Find Photographers
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/user/reels"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/15"
          >
            <Clapperboard className="h-4 w-4" />
            Explore Reels
          </Link>
          <Link
            to="/user/categories"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-transparent px-5 py-3 text-sm font-semibold text-white/90 transition-all hover:bg-white/10"
          >
            <Compass className="h-4 w-4" />
            View Categories
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
