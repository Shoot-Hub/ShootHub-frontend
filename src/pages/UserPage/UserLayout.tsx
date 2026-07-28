import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  BookImage,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  CreditCard,
  Glasses,
  Grid2x2,
  Heart,
  Home,
  Images,
  LogOut,
  MapPin,
  Menu,
  Search,
  Settings,
  UserRound,
  Users,
  Video,
  X,
} from 'lucide-react';
import { useAuth } from '@/store';
import { userService } from '@/services/user';
import shoothubLogo from '@/assets/landing/shoothub-logo-mark.png';

type SidebarBadge = number | string;

const sidebarNav: {
  icon: typeof Home;
  label: string;
  path: string;
  badge?: SidebarBadge;
}[] = [
  { icon: Home, label: 'Dashboard', path: '/user' },
  { icon: CalendarDays, label: 'My Events', path: '/user/my-events', badge: 2 },
  { icon: Images, label: 'All Galleries', path: '/user/galleries' },
  { icon: BookImage, label: 'All Albums', path: '/user/albums' },
  { icon: Video, label: 'All Reels', path: '/user/reels' },
  { icon: Glasses, label: 'AI Face Search', path: '/user/ai-face-search', badge: 'New' },
  { icon: Bell, label: 'Notifications', path: '/user/notifications', badge: 6 },
  { icon: CreditCard, label: 'Payments', path: '/user/payments' },
  { icon: UserRound, label: 'My Photographer', path: '/user/my-photographer' },
  { icon: Heart, label: 'Favorites', path: '/user/favorites' },
  { icon: Users, label: 'Explore Creators', path: '/user/explore-creators' },
  { icon: MapPin, label: 'Top Locations', path: '/user/top-locations' },
  { icon: Grid2x2, label: 'Categories', path: '/user/categories' },
  { icon: CircleHelp, label: 'Support', path: '/user/support' },
  { icon: Settings, label: 'Settings', path: '/user/settings' },
];

function getPageTitle(pathname: string) {
  if (pathname === '/user') return 'Dashboard';
  const match = sidebarNav.find((item) => item.path !== '/user' && pathname.startsWith(item.path));
  return match?.label ?? 'Dashboard';
}

function getSearchPlaceholder(pathname: string) {
  if (pathname.startsWith('/user/my-events')) return 'Search events, dates, creators...';
  if (pathname.startsWith('/user/galleries')) return 'Search galleries...';
  if (pathname.startsWith('/user/albums')) return 'Search albums...';
  if (pathname.startsWith('/user/reels')) return 'Search reels...';
  if (pathname.startsWith('/user/ai-face-search')) return 'Search faces, events...';
  if (pathname.startsWith('/user/explore-creators')) return 'Search creators...';
  return 'Search anything...';
}

export function UserLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [sidebarOpen]);

  const handleLogout = async () => {
    await userService.logout();
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/user') return location.pathname === '/user';
    return location.pathname.startsWith(path);
  };

  const userName =
    user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User';
  const firstName = user?.firstName || userName.split(' ')[0] || 'User';
  const initials = userName
    .split(' ')
    .map((name) => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const userAvatar = user?.avatar?.url || null;
  const pageTitle = getPageTitle(location.pathname);
  const searchPlaceholder = getSearchPlaceholder(location.pathname);

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <aside
        id="user-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col bg-white shadow-[4px_0_24px_-4px_rgba(107,70,254,0.08)] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[84px] shrink-0 items-center justify-between gap-2 px-4 pt-1">
          <Link to="/user" className="flex min-w-0 flex-1 flex-col items-start justify-center gap-0.5">
            <img
              src={shoothubLogo}
              alt="ShootHub"
              className="h-11 w-auto max-w-[210px] object-contain object-left"
            />
            <span className="pl-0.5 text-[10px] font-medium tracking-wide text-[#A0A4B0]">
              Capture. Connect. Cherish.
            </span>
          </Link>
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-[#636E72] hover:bg-[#F8F9FB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B46FE]/40 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-3 pt-1">
          {sidebarNav.map((item) => {
            const active = isActive(item.path);
            const isTextBadge = typeof item.badge === 'string';
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] transition-all ${
                  active
                    ? 'bg-[#6B46FE] font-semibold text-white shadow-sm shadow-[#6B46FE]/25'
                    : 'font-medium text-[#2D3436] hover:bg-[#F8F9FB]'
                }`}
              >
                <item.icon
                  className={`h-[18px] w-[18px] shrink-0 ${active ? 'text-white' : 'text-[#636E72]'}`}
                />
                <span className="flex-1">{item.label}</span>
                {item.badge != null ? (
                  <span
                    className={`flex items-center justify-center font-bold ${
                      isTextBadge
                        ? `rounded-full px-2 py-0.5 text-[10px] ${
                            active ? 'bg-white/20 text-white' : 'bg-[#6B46FE] text-white'
                          }`
                        : `h-5 min-w-5 rounded-full px-1.5 text-[10px] ${
                            active ? 'bg-white text-[#6B46FE]' : 'bg-[#6B46FE] text-white'
                          }`
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-[#EEF0F4] p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-semibold text-[#EA5455] transition-colors hover:bg-red-50"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FCE8E8]">
              <LogOut className="h-4 w-4" />
            </span>
            Logout
          </button>
        </div>
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="lg:pl-[272px]">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-[#EEF0F4] bg-white/95 px-3 backdrop-blur-xl sm:h-[72px] sm:gap-3 sm:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#636E72] hover:bg-[#F8F9FB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B46FE]/40 lg:hidden"
            aria-label="Open menu"
            aria-expanded={sidebarOpen}
            aria-controls="user-sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden min-w-[140px] shrink-0 lg:block">
            <h1 className="text-base font-bold text-[#2D3436]">{pageTitle}</h1>
            <p className="text-xs text-[#A0A4B0]">{`Welcome back, ${firstName}! 👋`}</p>
          </div>

          <div className="min-w-0 flex-1 lg:hidden">
            <h1 className="truncate text-sm font-bold text-[#2D3436]">{pageTitle}</h1>
            <p className="truncate text-[11px] text-[#A0A4B0]">{`Hi, ${firstName} 👋`}</p>
          </div>

          <div className="mx-auto hidden max-w-lg flex-1 md:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A4B0]" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="h-11 w-full rounded-full border border-[#EEF0F4] bg-[#F8F9FB] py-2.5 pl-11 pr-4 text-sm text-[#2D3436] outline-none transition-all placeholder:text-[#A0A4B0] focus:border-[#6B46FE]/40 focus:bg-white focus:ring-2 focus:ring-[#6B46FE]/15"
              />
            </div>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            <Link
              to="/user/notifications"
              className="relative flex h-11 w-11 items-center justify-center rounded-xl text-[#636E72] transition-colors hover:bg-[#F8F9FB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B46FE]/40"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#EA5455] px-1 text-[9px] font-bold text-white ring-2 ring-white">
                6
              </span>
            </Link>

            <div className="relative">
              <button
                type="button"
                onClick={() => setHeaderMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl p-0.5 transition-colors hover:bg-[#F8F9FB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B46FE]/40 sm:pr-2"
                aria-label="Account menu"
              >
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#6B46FE] to-[#8A60FF] text-xs font-bold text-white">
                  {userAvatar ? (
                    <img src={userAvatar} alt="" className="h-full w-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <span className="hidden text-sm font-semibold text-[#2D3436] sm:block">{firstName}</span>
                <ChevronDown className="hidden h-4 w-4 text-[#A0A4B0] sm:block" />
              </button>

              <AnimatePresence>
                {headerMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setHeaderMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-[#EEF0F4] bg-white py-2 shadow-xl"
                    >
                      <div className="border-b border-[#F5F6F8] px-4 py-3">
                        <p className="text-sm font-bold text-[#2D3436]">{userName}</p>
                        <p className="text-xs text-[#A0A4B0]">{user?.email}</p>
                      </div>
                      <Link
                        to="/user/settings"
                        onClick={() => setHeaderMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#636E72] hover:bg-[#F8F9FB]"
                      >
                        <Settings className="h-4 w-4 text-[#6B46FE]" />
                        Settings
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setHeaderMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[#EA5455] hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100dvh-3.5rem)] px-3 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-4 sm:min-h-[calc(100vh-72px)] sm:px-6 sm:pt-6 lg:px-8 lg:pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
