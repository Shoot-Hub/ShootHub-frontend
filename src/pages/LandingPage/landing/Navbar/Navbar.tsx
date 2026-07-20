import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ChevronDown,
  Clapperboard,
  Globe,
  Home,
  Info,
  LayoutGrid,
  Menu,
  MessageCircle,
  MessageSquareHeart,
  Sun,
  Tag,
  Users,
  X,
} from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { fadeIn } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { Logo } from '../Logo';
import { PublicMobileBottomNav } from '@/components/PublicMobileBottomNav';
import { ChatDrawer } from '@/components/ChatDrawer';

const navLinks = [
  { label: 'Creators', to: '/creators', icon: Users, hasDropdown: false },
  { label: 'Reels', to: '/reels', icon: Clapperboard, hasDropdown: false },
  { label: 'Categories', to: '/categories', icon: LayoutGrid, hasDropdown: true },
  { label: 'Pricing', to: '/pricing', icon: Tag, hasDropdown: false },
  { label: 'Feedback & Reviews', to: '/feedback', icon: MessageSquareHeart, hasDropdown: false },
  { label: 'About', to: '/about', icon: Info, hasDropdown: false },
] as const;

function NavItem({
  label,
  to,
  icon,
  hasDropdown,
  onNavigate,
  className,
}: {
  label: string;
  to: string;
  icon: ReactNode;
  hasDropdown?: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(className, isActive && 'bg-white/80 font-semibold text-[#111827] shadow-sm')
      }
      onClick={onNavigate}
    >
      {icon}
      <span>{label}</span>
      {hasDropdown ? <ChevronDown className="h-3.5 w-3.5 opacity-55" strokeWidth={2.25} /> : null}
    </NavLink>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <>
      <ChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} />

      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="fixed inset-x-0 top-0 z-50 border-b border-[#EEF0F4]/80 bg-white/95 backdrop-blur-xl"
      >
        <nav
          aria-label="Main navigation"
          className="flex w-full items-center gap-3 px-4 py-2.5 sm:gap-4 sm:px-6 sm:py-3 lg:px-8 xl:px-10"
        >
          <Link
            to="/"
            aria-label="ShootHub home"
            className="flex shrink-0 items-center"
            onClick={() => setMobileOpen(false)}
          >
            <Logo className="h-9 w-auto sm:h-10 md:h-11" />
          </Link>

          {/* Center pill nav */}
          <div className="mx-auto hidden min-w-0 flex-1 items-center justify-center lg:flex">
            <div className="inline-flex max-w-full items-center gap-0.5 rounded-full bg-[#F3EEFF] p-1.5 shadow-[0_2px_12px_-4px_rgba(107,70,254,0.18)] xl:gap-1 xl:p-2">
              <Link
                to="/"
                aria-label="Home"
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors xl:h-11 xl:w-11',
                  isHome
                    ? 'bg-white text-[#6B46FE] shadow-sm'
                    : 'text-[#6B46FE]/80 hover:bg-white/70',
                )}
              >
                <Home className="h-[18px] w-[18px] xl:h-5 xl:w-5" strokeWidth={2.25} />
              </Link>

              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavItem
                    key={link.label}
                    label={link.label}
                    to={link.to}
                    hasDropdown={link.hasDropdown}
                    icon={<Icon className="h-4 w-4 shrink-0 opacity-70" strokeWidth={2} />}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-medium text-[#4B5563] transition-colors hover:bg-white/70 hover:text-[#111827] xl:gap-2 xl:px-4 xl:py-2.5 xl:text-[14px]"
                  />
                );
              })}
            </div>
          </div>

          {/* Right utilities */}
          <div className="ml-auto hidden items-center gap-1.5 lg:flex xl:gap-2">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#6B7280] transition-colors hover:bg-[#F3F4F6] hover:text-[#111827]"
              aria-label="Toggle theme"
            >
              <Sun className="h-[18px] w-[18px]" strokeWidth={2} />
            </button>

            <button
              type="button"
              onClick={() => setChatOpen(true)}
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#6B7280] transition-colors hover:bg-[#F3F4F6] hover:text-[#111827]"
              aria-label="Open chat"
            >
              <MessageCircle className="h-[18px] w-[18px]" strokeWidth={2} />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#6B46FE] px-1 text-[9px] font-bold leading-none text-white">
                3
              </span>
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full px-2 py-1.5 text-[13px] font-medium text-[#4B5563] transition-colors hover:bg-[#F3F4F6] hover:text-[#111827]"
              aria-label="Change language"
            >
              <Globe className="h-4 w-4" strokeWidth={2} />
              EN
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </button>

            <span className="mx-0.5 h-5 w-px bg-[#E5E7EB]" aria-hidden />

            <Link
              to="/login"
              className="px-2 text-[13px] font-semibold text-[#4B5563] transition-colors hover:text-[#111827]"
            >
              Log in
            </Link>

            <Link
              to="/signup"
              className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#6B46FE] px-5 text-[13px] font-bold text-white shadow-[0_4px_14px_-2px_rgba(107,70,254,0.45)] transition-colors hover:bg-[#5A38E8]"
            >
              Get Started
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-1 lg:hidden">
            <button
              type="button"
              onClick={() => setChatOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-[#111827] transition-colors hover:bg-[#F3F4F6]"
              aria-label="Open chat"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#6B46FE] px-1 text-[9px] font-bold text-white">
                3
              </span>
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-[#111827] transition-colors hover:bg-[#F3F4F6]"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {mobileOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="border-t border-[#EEF0F4] bg-white px-4 py-3 sm:px-6 lg:hidden"
            >
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'mb-1 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium',
                  isHome ? 'bg-[#F3EEFF] text-[#6B46FE]' : 'text-[#4B5563] hover:bg-[#F8F9FB]',
                )}
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <ul className="flex flex-col gap-0.5">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.label}>
                      <NavItem
                        label={link.label}
                        to={link.to}
                        hasDropdown={link.hasDropdown}
                        onNavigate={() => setMobileOpen(false)}
                        icon={<Icon className="h-4 w-4 shrink-0 opacity-70" strokeWidth={2} />}
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-[#4B5563] hover:bg-[#F8F9FB] hover:text-[#111827]"
                      />
                    </li>
                  );
                })}
              </ul>
              <div className="mt-3 flex flex-col gap-2 border-t border-[#EEF0F4] pt-3">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-center text-sm font-semibold text-[#4B5563] hover:bg-[#F8F9FB]"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-[#6B46FE] text-sm font-bold text-white"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.header>

      <div className="h-[64px] sm:h-[72px]" aria-hidden="true" />

      <PublicMobileBottomNav />
    </>
  );
}
