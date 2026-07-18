import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Users, Search, Film, Grid3x3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const sideNav = [
  { icon: Home, label: 'Home', path: '/', end: true },
  { icon: Users, label: 'Creators', path: '/creators' },
] as const;

const rightNav = [
  { icon: Film, label: 'Reels', path: '/reels' },
  { icon: Grid3x3, label: 'Categories', path: '/categories' },
] as const;

function isActive(pathname: string, path: string, end?: boolean) {
  if (end || path === '/') return pathname === '/';
  return pathname.startsWith(path);
}

function NavItem({
  path,
  label,
  icon: Icon,
  active,
}: {
  path: string;
  label: string;
  icon: typeof Home;
  active: boolean;
}) {
  return (
    <Link
      to={path}
      className="flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 py-1"
    >
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-2xl transition-all',
          active
            ? 'bg-[#6B46FE] text-white shadow-md shadow-[#6B46FE]/30'
            : 'text-[#A0A4B0]',
        )}
      >
        <Icon className="h-5 w-5" strokeWidth={2.25} />
      </div>
      <span
        className={cn(
          'text-[10px] font-semibold',
          active ? 'text-[#6B46FE]' : 'text-[#A0A4B0]',
        )}
      >
        {label}
      </span>
    </Link>
  );
}

/** Mobile bottom nav for public/landing pages — mirrors Creator Studio pattern. */
export function PublicMobileBottomNav() {
  const { pathname } = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Mobile navigation"
    >
      <div className="border-t border-[#EEF0F4] bg-white/95 shadow-[0_-8px_30px_-4px_rgba(107,70,254,0.08)] backdrop-blur-2xl">
        <div className="flex items-end justify-around px-1 pb-1.5 pt-1.5">
          {sideNav.map((item) => (
            <NavItem
              key={item.path}
              path={item.path}
              label={item.label}
              icon={item.icon}
              active={isActive(pathname, item.path, 'end' in item && item.end)}
            />
          ))}

          <div className="-mt-4 flex min-h-[52px] flex-1 flex-col items-center justify-center">
            <Link to="/creators" aria-label="Find creators">
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                className="relative flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-[#6B46FE] to-[#8A60FF] text-white shadow-xl shadow-[#6B46FE]/40"
              >
                <Search className="h-6 w-6" strokeWidth={2.5} />
              </motion.div>
            </Link>
            <span className="mt-0.5 text-[10px] font-semibold text-[#6B46FE]">Find</span>
          </div>

          {rightNav.map((item) => (
            <NavItem
              key={item.path}
              path={item.path}
              label={item.label}
              icon={item.icon}
              active={isActive(pathname, item.path)}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
