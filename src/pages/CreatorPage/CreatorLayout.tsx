import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  User,
  Images,
  CalendarCheck,
  Settings,
  LogOut,
  Menu,
  X,
  Camera,
  Bell,
  Package,
  Star,
  MessageSquare,
  Video,
  Home,
  Plus,
  Search,
  ChevronDown,
  BarChart3,
  Calendar,
  Users,
  Crown,
  ArrowRight,
  CreditCard,
  Upload,
  CirclePlay,
  PanelRight,
} from 'lucide-react';
import { useAuth, setAuth } from '@/store';
import { userService } from '@/services/user';
import { creatorService } from '@/services/creator';
import shoothubLogo from '@/assets/landing/shoothub-logo-mark.png';
import { ShootHubLoader } from '@/components/ShootHubLoader';

const sidebarNav = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/creator' },
  { icon: CalendarCheck, label: 'Bookings', path: '/creator/bookings' },
  { icon: Images, label: 'Portfolio', path: '/creator/portfolio' },
  { icon: Video, label: 'Reels', path: '/creator/reels' },
  { icon: Upload, label: 'Uploads', path: '/creator/uploads' },
  { icon: Package, label: 'Packages', path: '/creator/packages' },
  { icon: CreditCard, label: 'Subscriptions', path: '/creator/subscriptions' },
  { icon: Star, label: 'Reviews', path: '/creator/reviews' },
  { icon: MessageSquare, label: 'Messages', path: '/creator/messages', badge: 3 },
  { icon: Calendar, label: 'Calendar', path: '/creator/calendar' },
  { icon: BarChart3, label: 'Analytics', path: '/creator/analytics' },
  { icon: Users, label: 'Teams', path: '/creator/teams' },
  { icon: Settings, label: 'Settings', path: '/creator/settings' },
];

const mobileNav = [
  { icon: Home, label: 'Home', path: '/creator' },
  { icon: Video, label: 'Reels', path: '/creator/reels' },
  { icon: CalendarCheck, label: 'Bookings', path: '/creator/bookings' },
  { icon: User, label: 'Profile', path: '/creator/profile' },
];

function getPageTitle(pathname: string, isCreateUpload: boolean) {
  if (isCreateUpload) return 'Create New Upload';
  if (pathname === '/creator') return 'Dashboard';
  const match = sidebarNav.find(
    (item) => item.path !== '/creator' && pathname.startsWith(item.path),
  );
  return match?.label || 'Dashboard';
}

function getPageSubtitle(pathname: string, isCreateUpload: boolean) {
  if (isCreateUpload) return 'Upload photos, add details and share with your client';
  if (pathname.startsWith('/creator/uploads')) {
    return 'Create galleries, upload photos and share with your clients.';
  }
  return null;
}

function getSearchPlaceholder(pathname: string) {
  if (pathname.startsWith('/creator/bookings')) return 'Search bookings, clients, events...';
  if (pathname.startsWith('/creator/calendar')) return 'Search events, shoots...';
  if (pathname.startsWith('/creator/analytics')) return 'Search metrics, reports...';
  if (pathname.startsWith('/creator/packages')) return 'Search packages...';
  if (pathname.startsWith('/creator/subscriptions')) return 'Search plans, invoices...';
  if (pathname.startsWith('/creator/teams')) return 'Search team members...';
  if (pathname.startsWith('/creator/reviews')) return 'Search reviews...';
  if (pathname.startsWith('/creator/portfolio')) return 'Search portfolio...';
  if (pathname.startsWith('/creator/uploads')) return 'Search uploads, galleries...';
  if (pathname.startsWith('/creator/profile')) return 'Search anything...';
  return 'Search anything...';
}

export function CreatorLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [sidebarUserOpen, setSidebarUserOpen] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.role !== 'photographer') return;
      setLoadingProfile(true);
      try {
        const res = await creatorService.getMyProfile();
        if (res.data) setAuth(res.data as typeof user);
      } catch {
        // silent
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [user?.role]);

  const handleLogout = async () => {
    await userService.logout();
    logout();
    navigate('/login');
  };

  const isActive = (path: string, _label?: string) => {
    if (path === '/creator') return location.pathname === '/creator';
    return location.pathname.startsWith(path);
  };

  const userName =
    user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Creator';
  const firstName = user?.firstName || userName.split(' ')[0];
  const userAvatar = user?.avatar?.url || null;
  const initials = userName
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const isUploadsPage = location.pathname.startsWith('/creator/uploads');
  const isCreateUpload =
    isUploadsPage && new URLSearchParams(location.search).get('create') === '1';
  const pageTitle = getPageTitle(location.pathname, isCreateUpload);
  const pageSubtitle = getPageSubtitle(location.pathname, isCreateUpload);
  const searchPlaceholder = getSearchPlaceholder(location.pathname);

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col bg-white shadow-[4px_0_24px_-4px_rgba(107,70,254,0.08)] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo — cropped ShootHub wordmark */}
        <div className="flex h-[84px] shrink-0 items-center justify-between gap-2 px-4 pt-1">
          <Link to="/creator" className="flex min-w-0 flex-1 flex-col items-start justify-center gap-0.5">
            <img
              src={shoothubLogo}
              alt="ShootHub"
              className="h-11 w-auto max-w-[210px] object-contain object-left"
            />
            <span className="pl-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A0A4B0]">
              Creator Studio
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-[#636E72] hover:bg-[#F8F9FB] lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-2 pt-1">
          {sidebarNav.map((item) => {
            const active = isActive(item.path, item.label);
            return (
              <Link
                key={`${item.label}-${item.path}`}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] transition-all ${
                  active
                    ? 'bg-[#F3EEFF] font-bold text-[#6B46FE]'
                    : 'font-medium text-[#5B6472] hover:bg-[#F8F9FB] hover:text-[#2D3436]'
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r-full bg-[#6B46FE]" />
                )}
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    active ? 'bg-[#6B46FE] text-white shadow-sm shadow-[#6B46FE]/30' : 'text-[#8B93A1]'
                  }`}
                >
                  <item.icon className="h-[17px] w-[17px]" />
                </span>
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#6B46FE] px-1.5 text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Upgrade to Pro */}
        <div className="shrink-0 px-3 pb-2">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#6B46FE] via-[#7B5CFF] to-[#4F46E5] p-3 text-white shadow-md shadow-[#6B46FE]/20">
            <div className="absolute -right-2 top-1 text-white/10">
              <Crown className="h-10 w-10 rotate-12" />
            </div>
            <div className="relative">
              <div className="mb-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-white/40">
                <Crown className="h-3 w-3" />
              </div>
              <p className="text-xs font-bold leading-tight">Upgrade to Pro</p>
              <p className="mt-0.5 text-[10px] leading-snug text-white/75">
                Unlock advanced analytics, priority listings & more.
              </p>
              <button className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-bold text-[#6B46FE] transition-colors hover:bg-white/95">
                Upgrade Now
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* User card + Logout */}
        <div className="relative shrink-0 space-y-2 border-t border-[#EEF0F4] p-3">
          <button
            onClick={() => setSidebarUserOpen((v) => !v)}
            className="flex w-full items-center gap-3 rounded-xl border border-[#EEF0F4] bg-[#FAFBFC] px-2.5 py-2.5 text-left transition-colors hover:bg-[#F5F6FA]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#6B46FE] to-[#8A60FF] text-xs font-bold text-white">
              {userAvatar ? (
                <img src={userAvatar} alt="" className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[#2D3436]">{userName}</p>
              <p className="truncate text-xs text-[#A0A4B0]">Photographer</p>
            </div>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-[#A0A4B0] transition-transform ${
                sidebarUserOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {sidebarUserOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setSidebarUserOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute bottom-[7.5rem] left-3 right-3 z-50 rounded-2xl border border-[#EEF0F4] bg-white py-2 shadow-xl"
                >
                  <Link
                    to="/creator/profile"
                    onClick={() => setSidebarUserOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#636E72] hover:bg-[#F8F9FB]"
                  >
                    <User className="h-4 w-4 text-[#6B46FE]" />
                    My Profile
                  </Link>
                  <Link
                    to="/creator/settings"
                    onClick={() => setSidebarUserOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#636E72] hover:bg-[#F8F9FB]"
                  >
                    <Settings className="h-4 w-4 text-[#6B46FE]" />
                    Settings
                  </Link>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <button
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

      {/* Main */}
      <div className="lg:pl-[272px]">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-[#EEF0F4] bg-white/95 px-3 backdrop-blur-xl sm:h-[72px] sm:gap-3 sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#636E72] hover:bg-[#F8F9FB] lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden min-w-[140px] shrink-0 lg:block">
            <h1 className="text-base font-bold text-[#2D3436]">{pageTitle}</h1>
            <p className="text-xs text-[#A0A4B0]">
              {pageSubtitle ?? `Welcome back, ${firstName}! 👋`}
            </p>
          </div>

          {/* Mobile: page title instead of huge logo */}
          <div className="min-w-0 flex-1 lg:hidden">
            <h1 className="truncate text-sm font-bold text-[#2D3436]">{pageTitle}</h1>
            <p className="truncate text-[11px] text-[#A0A4B0]">
              {pageSubtitle ?? `Hi, ${firstName} 👋`}
            </p>
          </div>

          <div className={`mx-auto hidden max-w-lg flex-1 md:block ${isCreateUpload ? 'lg:hidden' : ''}`}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A4B0]" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="h-11 w-full rounded-full border border-[#EEF0F4] bg-[#F8F9FB] py-2.5 pl-11 pr-14 text-sm text-[#2D3436] outline-none transition-all placeholder:text-[#A0A4B0] focus:border-[#6B46FE]/40 focus:bg-white focus:ring-2 focus:ring-[#6B46FE]/15"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-[#E8EAED] bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[#A0A4B0]">
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            {isUploadsPage ? (
              <>
                <button className="hidden items-center gap-1.5 rounded-xl border border-[#EEF0F4] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#636E72] shadow-sm transition-all hover:bg-[#F8F9FB] sm:flex">
                  <CirclePlay className="h-4 w-4 text-[#6B46FE]" />
                  How it works
                </button>
                {isCreateUpload ? (
                  <Link
                    to="/creator/uploads"
                    className="hidden items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#6B46FE] to-[#8A60FF] px-3.5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#6B46FE]/25 transition-all hover:shadow-lg sm:flex"
                  >
                    Back to Uploads
                  </Link>
                ) : (
                  <Link
                    to="/creator/uploads?create=1"
                    className="hidden items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#6B46FE] to-[#8A60FF] px-3.5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#6B46FE]/25 transition-all hover:shadow-lg sm:flex"
                  >
                    <Plus className="h-4 w-4" />
                    New Upload
                  </Link>
                )}
              </>
            ) : (
              <button className="hidden items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#6B46FE] to-[#8A60FF] px-3.5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#6B46FE]/25 transition-all hover:shadow-lg sm:flex">
                <Plus className="h-4 w-4" />
                {location.pathname.startsWith('/creator/teams') ? 'Invite Member' : 'Create New'}
              </button>
            )}

            <button
              className="relative flex h-11 w-11 items-center justify-center rounded-xl text-[#636E72] transition-colors hover:bg-[#F8F9FB]"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#EA5455] px-1 text-[9px] font-bold text-white ring-2 ring-white">
                {isUploadsPage ? 3 : 5}
              </span>
            </button>

            {isUploadsPage ? (
              <button
                className="relative hidden h-11 w-11 items-center justify-center rounded-xl text-[#636E72] transition-colors hover:bg-[#F8F9FB] sm:flex"
                aria-label="Toggle panel"
              >
                <PanelRight className="h-5 w-5" />
              </button>
            ) : (
              <Link
                to="/creator/messages"
                className="relative flex h-11 w-11 items-center justify-center rounded-xl text-[#636E72] transition-colors hover:bg-[#F8F9FB]"
                aria-label="Messages"
              >
                <MessageSquare className="h-5 w-5" />
              </Link>
            )}

            <div className="relative">
              <button
                onClick={() => setHeaderMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl p-0.5 transition-colors hover:bg-[#F8F9FB] sm:pr-2"
                aria-label="Account menu"
              >
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#6B46FE] to-[#8A60FF] text-xs font-bold text-white">
                  {userAvatar ? (
                    <img src={userAvatar} alt="" className="h-full w-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <span className="hidden text-sm font-semibold text-[#2D3436] sm:block">
                  {isUploadsPage ? userName : firstName}
                </span>
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
                        to="/creator/profile"
                        onClick={() => setHeaderMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#636E72] hover:bg-[#F8F9FB]"
                      >
                        <User className="h-4 w-4 text-[#6B46FE]" />
                        My Profile
                      </Link>
                      <Link
                        to="/creator/settings"
                        onClick={() => setHeaderMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#636E72] hover:bg-[#F8F9FB]"
                      >
                        <Settings className="h-4 w-4 text-[#6B46FE]" />
                        Settings
                      </Link>
                      <div className="mt-1 border-t border-[#F5F6F8] pt-1">
                        <button
                          onClick={() => {
                            setHeaderMenuOpen(false);
                            handleLogout();
                          }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[#EA5455] hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100dvh-3.5rem)] px-3 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-4 sm:min-h-[calc(100vh-72px)] sm:px-6 sm:pt-6 lg:px-8 lg:pb-8">
          {loadingProfile ? (
            <div className="flex h-64 items-center justify-center">
              <ShootHubLoader size="lg" label="Loading your studio…" />
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 pb-[env(safe-area-inset-bottom)] lg:hidden">
        <div className="border-t border-[#EEF0F4] bg-white/95 shadow-[0_-8px_30px_-4px_rgba(107,70,254,0.08)] backdrop-blur-2xl">
          <div className="flex items-end justify-around px-1 pb-1.5 pt-1.5">
            {mobileNav.slice(0, 2).map((item) => {
              const active = isActive(item.path, item.label);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 py-1"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-all ${
                      active
                        ? 'bg-[#6B46FE] text-white shadow-md shadow-[#6B46FE]/30'
                        : 'text-[#A0A4B0]'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`text-[10px] font-semibold ${active ? 'text-[#6B46FE]' : 'text-[#A0A4B0]'}`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}

            <div className="-mt-4 flex min-h-[52px] flex-1 flex-col items-center justify-center">
              <Link to="/creator/reels/upload" aria-label="Upload">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  className="relative flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-[#6B46FE] to-[#8A60FF] text-white shadow-xl shadow-[#6B46FE]/40"
                >
                  <Camera className="h-6 w-6" />
                </motion.div>
              </Link>
              <span className="mt-0.5 text-[10px] font-semibold text-[#6B46FE]">Upload</span>
            </div>

            {mobileNav.slice(2).map((item) => {
              const active = isActive(item.path, item.label);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 py-1"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-all ${
                      active
                        ? 'bg-[#6B46FE] text-white shadow-md shadow-[#6B46FE]/30'
                        : 'text-[#A0A4B0]'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`text-[10px] font-semibold ${active ? 'text-[#6B46FE]' : 'text-[#A0A4B0]'}`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
