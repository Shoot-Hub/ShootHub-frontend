import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Globe, Menu, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Logo } from '../Logo';
import { fadeIn } from '@/lib/motion';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Explore', to: '/' },
  { label: 'Creators', to: '/creators' },
  { label: 'Reels', to: '/reels' },
  { label: 'Categories', to: '/categories', hasDropdown: true },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About', to: '/about' },
] as const;

function NavItem({
  label,
  to,
  hasDropdown,
  onNavigate,
  className,
}: {
  label: string;
  to: string;
  hasDropdown?: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  const isHash = to.includes('#');

  if (isHash) {
    return (
      <a
        href={to}
        className={className}
        onClick={onNavigate}
      >
        {label}
        {hasDropdown && <ChevronDown className="h-4 w-4 text-ink-light" />}
      </a>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(className, isActive && 'text-ink')
      }
      onClick={onNavigate}
    >
      {label}
      {hasDropdown && <ChevronDown className="h-4 w-4 text-ink-light" />}
    </NavLink>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="fixed inset-x-0 top-0 z-50 border-b border-border/40 bg-white/90 backdrop-blur-md"
      >
        <Container size="full" padding="tight" className="xl:px-10 2xl:px-12">
          <nav
            className="relative flex h-24 items-center justify-between"
            aria-label="Main navigation"
          >
            <Link to="/" aria-label="ShootHub home" className="relative z-10 h-24">
              <Logo />
            </Link>

            <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <NavItem
                    label={link.label}
                    to={link.to}
                    hasDropdown={'hasDropdown' in link && link.hasDropdown}
                    className="inline-flex items-center gap-1 text-[15px] font-medium text-ink-muted transition-colors hover:text-ink"
                  />
                </li>
              ))}
            </ul>

            <div className="relative z-10 hidden items-center gap-5 lg:flex">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-[15px] font-medium text-ink-muted transition-colors hover:text-ink"
                aria-label="Change language"
              >
                <Globe className="h-[18px] w-[18px]" strokeWidth={2} />
                EN
              </button>
              <Link
                to="/login"
                className="text-[15px] font-semibold text-ink-muted transition-colors hover:text-ink"
              >
                Log in
              </Link>
              <Link to="/signup">
                <Button size="sm" pill className="shadow-button">
                  Get Started
                </Button>
              </Link>
            </div>

            <button
              type="button"
              className="relative z-10 inline-flex items-center justify-center rounded-lg p-2 text-ink lg:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </nav>

          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border pb-6 lg:hidden"
            >
              <ul className="flex flex-col gap-1 pt-4">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <NavItem
                      label={link.label}
                      to={link.to}
                      hasDropdown={'hasDropdown' in link && link.hasDropdown}
                      onNavigate={() => setMobileOpen(false)}
                      className="flex items-center gap-1 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-gray-50 hover:text-ink"
                    />
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-col gap-3 px-3">
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" fullWidth>
                    Log in
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)}>
                  <Button fullWidth pill>
                    Get Started
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </Container>
      </motion.header>
      {/* Reserves space so page content is not hidden under the fixed header */}
      <div className="h-24" aria-hidden="true" />
    </>
  );
}
