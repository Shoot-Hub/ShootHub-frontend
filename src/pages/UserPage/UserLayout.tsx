import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronsLeft,
  Heart,
  Headphones,
  Image,
  LayoutGrid,
  LogOut,
  Menu,
  MessageSquare,
  MoreVertical,
  Search,
  Settings,
  Sparkles,
  Star,
  UserSearch,
  Wallet,
} from 'lucide-react';
import { useAuth } from '@/store';
import { userService } from '@/services/user';
import shoothubLogo from '@/assets/landing/shoothub-logo-mark.png';
import shoothubLogoIcon from '@/assets/landing/shoothub-logo-icon.png';

type SidebarBadge = number | string;

const sidebarNav: {
  icon: typeof LayoutGrid;
  label: string;
  path: string;
  badge?: SidebarBadge;
}[] = [
  { icon: LayoutGrid, label: 'Dashboard', path: '/user' },
  { icon: UserSearch, label: 'Find Professionals', path: '/user/find-professionals' },
  { icon: CalendarDays, label: 'My Bookings', path: '/user/my-bookings' },
  { icon: MessageSquare, label: 'Messages', path: '/user/messages', badge: 3 },
  { icon: Heart, label: 'Favorites', path: '/user/favorites' },
  { icon: Sparkles, label: 'AI Face Search', path: '/user/ai-face-search' },
  { icon: Star, label: 'Reviews', path: '/user/reviews' },
  { icon: Image, label: 'My Galleries', path: '/user/galleries' },
  { icon: Wallet, label: 'Payments', path: '/user/payments' },
  { icon: Bell, label: 'Notifications', path: '/user/notifications', badge: 6 },
  { icon: Settings, label: 'Settings', path: '/user/settings' },
  { icon: Headphones, label: 'Help & Support', path: '/user/support' },
];

function getPageTitle(pathname: string) {
  if (pathname === '/user') return 'Dashboard';
  const match = sidebarNav.find((item) => item.path !== '/user' && pathname.startsWith(item.path));
  return match?.label ?? 'Dashboard';
}

function getSearchPlaceholder(pathname: string) {
  if (pathname.startsWith('/user/find-professionals')) return 'Search professionals...';
  if (pathname.startsWith('/user/my-bookings')) return 'Search bookings, dates...';
  if (pathname.startsWith('/user/messages')) return 'Search messages, photographers, bookings...';
  if (pathname.startsWith('/user/favorites')) return 'Search favorites...';
  if (pathname.startsWith('/user/ai-face-search')) return 'Search faces, events...';
  if (pathname.startsWith('/user/reviews')) return 'Search reviews...';
  if (pathname.startsWith('/user/notifications')) return 'Search notifications, bookings, messages...';
  if (pathname.startsWith('/user/galleries')) return 'Search galleries, events, photographers...';
  if (pathname.startsWith('/user/payments')) return 'Search payments, invoices, bookings...';
  return 'Search anything...';
}

function ShootHubMark({ collapsed }: { collapsed?: boolean }) {
  if (collapsed) {
    return (
      <Link to="/user" className="flex h-10 w-10 items-center justify-center">
        <img
          src={shoothubLogoIcon}
          alt="ShootHub"
          className="h-9 w-9 object-contain"
        />
      </Link>
    );
  }

  return (
    <Link to="/user" className="flex min-w-0 flex-1 items-center">
      <img
        src={shoothubLogo}
        alt="ShootHub"
        className="h-11 w-auto max-w-[180px] object-contain object-left"
      />
    </Link>
  );
}

export function UserLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
    setUserMenuOpen(false);
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
  const userEmail = user?.email || '';
  const pageTitle = getPageTitle(location.pathname);
  const searchPlaceholder = getSearchPlaceholder(location.pathname);

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <aside
        id="user-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-[268px] flex-col bg-white shadow-[4px_0_24px_-4px_rgba(107,70,254,0.08)] transition-all duration-300 lg:translate-x-0 ${
          sidebarCollapsed ? 'lg:w-[88px]' : 'lg:w-[268px]'
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Brand header */}
        <div
          className={`flex h-[76px] shrink-0 items-center gap-2 border-b border-[#F3F4F8] ${
            sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-4'
          }`}
        >
          <ShootHubMark collapsed={sidebarCollapsed} />
          {!sidebarCollapsed && (
            <button
              type="button"
              aria-label="Collapse sidebar"
              onClick={() => {
                if (window.matchMedia('(min-width: 1024px)').matches) {
                  setSidebarCollapsed(true);
                } else {
                  setSidebarOpen(false);
                }
              }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F3EEFF] text-[#6B46FE] transition-colors hover:bg-[#EBE4FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B46FE]/40"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
          )}
          {sidebarCollapsed && (
            <button
              type="button"
              aria-label="Expand sidebar"
              onClick={() => setSidebarCollapsed(false)}
              className="absolute right-[-14px] top-[22px] hidden h-7 w-7 items-center justify-center rounded-full border border-[#EEF0F4] bg-white text-[#6B46FE] shadow-sm hover:bg-[#F3EEFF] lg:flex"
            >
              <ChevronsLeft className="h-3.5 w-3.5 rotate-180" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav
          className={`flex-1 overflow-y-auto py-3 ${
            sidebarCollapsed ? 'space-y-1 px-2' : 'space-y-0.5 px-3'
          }`}
        >
          {sidebarNav.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                title={sidebarCollapsed ? item.label : undefined}
                className={`group relative flex items-center rounded-xl text-[13.5px] transition-all ${
                  sidebarCollapsed ? 'justify-center px-0 py-2' : 'gap-3 px-3 py-2.5'
                } ${
                  active
                    ? 'bg-[#F3EEFF] font-bold text-[#6B46FE]'
                    : 'font-medium text-[#5B6472] hover:bg-[#F8F9FB] hover:text-[#2D3436]'
                }`}
              >
                {active && !sidebarCollapsed && (
                  <span className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r-full bg-[#6B46FE]" />
                )}
                <span
                  className={`flex shrink-0 items-center justify-center rounded-lg ${
                    sidebarCollapsed ? 'h-9 w-9' : 'h-8 w-8'
                  } ${
                    active
                      ? 'bg-[#6B46FE] text-white shadow-sm shadow-[#6B46FE]/30'
                      : 'text-[#8B93A1] group-hover:text-[#6B46FE]'
                  }`}
                >
                  <item.icon className="h-[17px] w-[17px]" />
                </span>
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge != null ? (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#6B46FE] px-1.5 text-[10px] font-bold text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </>
                )}
                {sidebarCollapsed && item.badge != null ? (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#6B46FE] px-1 text-[9px] font-bold text-white ring-2 ring-white">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* User profile footer */}
        <div className="relative shrink-0 border-t border-[#EEF0F4] p-3">
          <button
            type="button"
            onClick={() => setUserMenuOpen((v) => !v)}
            className={`flex w-full items-center rounded-xl bg-[#FAFBFC] text-left transition-colors hover:bg-[#F5F4FF] ${
              sidebarCollapsed ? 'justify-center p-2' : 'gap-2.5 px-2.5 py-2.5'
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#6B46FE] to-[#8A60FF] text-xs font-bold text-white ring-2 ring-[#EDE9FE]">
              {userAvatar ? (
                <img src={userAvatar} alt="" className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </div>
            {!sidebarCollapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-[#1A1A2E]">{userName}</p>
                  <p className="truncate text-[11px] text-[#8B8FA3]">{userEmail}</p>
                </div>
                <MoreVertical className="h-4 w-4 shrink-0 text-[#8B8FA3]" />
              </>
            )}
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute bottom-[4.5rem] left-3 right-3 z-50 rounded-2xl border border-[#EEF0F4] bg-white py-2 shadow-xl"
                >
                  <Link
                    to="/user/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#636E72] hover:bg-[#F8F9FB]"
                  >
                    <Settings className="h-4 w-4 text-[#6B46FE]" />
                    Settings
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
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

      <div
        className={`min-h-screen transition-[padding-left] duration-300 ${
          sidebarCollapsed ? 'lg:pl-[88px]' : 'lg:pl-[268px]'
        }`}
      >
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-[#EEF0F4] bg-white/95 px-3 backdrop-blur-xl sm:h-[72px] sm:gap-3 sm:px-6">
          <button
            type="button"
            onClick={() => {
              setSidebarCollapsed(false);
              setSidebarOpen(true);
            }}
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
                        <p className="text-xs text-[#A0A4B0]">{userEmail}</p>
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
