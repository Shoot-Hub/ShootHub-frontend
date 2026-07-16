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
  ChevronDown,
  Package,
  Star,
  MessageSquare,
  Sparkles,
  Video,
  Home,
} from 'lucide-react';
import { useAuth, setAuth } from '@/store';
import { userService } from '@/services/user';
import { creatorService } from '@/services/creator';

// ── Sidebar nav (full list for desktop) ─────────────────────
const sidebarNav = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/creator' },
  { icon: User, label: 'Profile', path: '/creator/profile' },
  { icon: Images, label: 'Portfolio', path: '/creator/portfolio' },
  { icon: Video, label: 'Reels', path: '/creator/reels' },
  { icon: Package, label: 'Packages', path: '/creator/packages' },
  { icon: CalendarCheck, label: 'Bookings', path: '/creator/bookings' },
  { icon: Star, label: 'Reviews', path: '/creator/reviews' },
  { icon: MessageSquare, label: 'Messages', path: '/creator/messages' },
  { icon: Settings, label: 'Settings', path: '/creator/settings' },
];

// ── Mobile bottom nav (5 items) ────────────────────────────
// Home | Reels | [Upload FAB] | Bookings | Profile
const mobileNav = [
  { icon: Home, label: 'Home', path: '/creator' },
  { icon: Video, label: 'Reels', path: '/creator/reels' },
  // center = camera FAB (rendered separately)
  { icon: CalendarCheck, label: 'Bookings', path: '/creator/bookings' },
  { icon: User, label: 'Profile', path: '/creator/profile' },
];

export function CreatorLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  }, []);

  const handleLogout = async () => {
    await userService.logout();
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/creator') return location.pathname === '/creator';
    return location.pathname.startsWith(path);
  };

  const userName =
    user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Creator';
  const userAvatar = user?.avatar?.url || null;
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      {/* ════════════════════════════════════════════════════
          DESKTOP SIDEBAR
      ════════════════════════════════════════════════════ */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-white shadow-xl border-r border-slate-100 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100 flex-shrink-0">
          <Link to="/creator" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                ShootHub
              </span>
              <p className="text-[10px] font-semibold text-slate-400 -mt-0.5 tracking-wider uppercase">
                Creator Studio
              </p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Mini Profile */}
        <div className="px-4 py-4 border-b border-slate-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-sm font-bold shadow-sm overflow-hidden">
                {userAvatar ? (
                  <img src={userAvatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  userInitial
                )}
              </div>
              {user?.isOnline && (
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{userName}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email || ''}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {sidebarNav.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? 'text-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50/60'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/40'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-gradient-to-b from-blue-600 to-indigo-600"
                  />
                )}
                <item.icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-blue-600' : ''}`} />
                <span>{item.label}</span>
                {active && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />}
              </Link>
            );
          })}
        </nav>

        {/* Go Pro Banner */}
        <div className="px-3 py-3 flex-shrink-0">
          <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-4 text-white shadow-lg shadow-blue-600/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-blue-200" />
              <p className="text-sm font-bold">Go Pro</p>
            </div>
            <p className="text-[11px] text-blue-200 mb-3 leading-relaxed">
              Unlock advanced analytics, priority listings & more
            </p>
            <button className="w-full rounded-xl bg-white text-blue-700 px-3 py-1.5 text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm">
              Upgrade Now →
            </button>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-100 p-3 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile sidebar backdrop */}
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

      {/* ════════════════════════════════════════════════════
          MAIN CONTENT AREA
      ════════════════════════════════════════════════════ */}
      <div className="lg:pl-64">
        {/* ── Top Header ─────────────────────────────────── */}
        <header
          className={`sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-white/90 backdrop-blur-xl transition-all ${
            scrolled ? 'border-slate-200 shadow-sm shadow-slate-100' : 'border-transparent'
          }`}
        >
          <div className="flex items-center gap-3 px-4">
            {/* Hamburger — desktop-only (mobile uses bottom nav) */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-50 hidden lg:flex"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Mobile logo */}
            <Link to="/creator" className="flex items-center gap-2 lg:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-sm">
                <Camera className="h-4 w-4" />
              </div>
              <span className="text-base font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ShootHub
              </span>
            </Link>

            {/* Desktop page title */}
            <div className="hidden lg:block">
              <h1 className="text-base font-bold text-slate-800">
                {sidebarNav.find((item) => isActive(item.path))?.label || 'Dashboard'}
              </h1>
              <p className="text-xs text-slate-400">Welcome back, {userName.split(' ')[0]}!</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-4">
            {/* Online badge */}
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 mr-1">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-600">
                {user?.isOnline ? 'Online' : 'Away'}
              </span>
            </div>

            {/* Messages icon — visible on mobile top bar */}
            <Link
              to="/creator/messages"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-50 transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </Link>

            {/* Notifications */}
            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 rounded-xl p-1.5 pr-2.5 hover:bg-slate-50 transition-colors"
              >
                <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-sm font-bold shadow-sm overflow-hidden">
                  {userAvatar ? (
                    <img src={userAvatar} alt="" className="h-full w-full object-cover" />
                  ) : (
                    userInitial
                  )}
                </div>
                <span className="hidden text-sm font-semibold text-slate-700 sm:block">
                  {userName.split(' ')[0]}
                </span>
                <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
              </button>

              <AnimatePresence>
                {profileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-slate-100 bg-white py-2 shadow-xl"
                    >
                      <div className="border-b border-slate-50 px-4 py-3">
                        <p className="text-sm font-bold text-slate-800">{userName}</p>
                        <p className="text-xs text-slate-400">{user?.email}</p>
                      </div>
                      <Link
                        to="/creator/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <User className="h-4 w-4 text-blue-600" />
                        My Profile
                      </Link>
                      <Link
                        to="/creator/settings"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <Settings className="h-4 w-4 text-blue-600" />
                        Settings
                      </Link>
                      <div className="border-t border-slate-50 mt-1 pt-1">
                        <button
                          onClick={() => {
                            setProfileMenuOpen(false);
                            handleLogout();
                          }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
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

        {/* ── Page Content ───────────────────────────────── */}
        <main className="min-h-[calc(100vh-3.5rem)] pb-24 lg:pb-8">
          {loadingProfile ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full border-[3px] border-blue-100 border-t-blue-600 animate-spin" />
                  <div className="absolute inset-1.5 rounded-full border-2 border-indigo-100 border-b-indigo-500 animate-spin [animation-direction:reverse] [animation-duration:0.8s]" />
                </div>
                <p className="text-sm font-medium text-slate-400">Loading your studio...</p>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>

      {/* ════════════════════════════════════════════════════
          MOBILE BOTTOM NAV — 5 SLOTS
          [Home] [Reels] [📷 Camera FAB] [Bookings] [Profile]
      ════════════════════════════════════════════════════ */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
        <div className="bg-white/95 backdrop-blur-2xl border-t border-slate-200/80 shadow-[0_-8px_30px_-4px_rgba(37,99,235,0.08)]">
          <div className="flex items-end justify-around px-1 pt-2 pb-safe pb-2">
            {/* LEFT: Home & Reels */}
            {mobileNav.slice(0, 2).map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex flex-col items-center gap-1 flex-1 py-1 relative"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-200 ${
                      active
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-105'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`text-[10px] font-semibold tracking-wide transition-colors ${
                      active ? 'text-blue-600' : 'text-slate-400'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}

            {/* CENTER: Camera FAB */}
            <div className="flex flex-col items-center flex-1 -mt-5">
              <Link to="/creator/reels/upload">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/40 border-4 border-white"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 opacity-30 blur-md scale-110" />
                  <Camera className="relative h-7 w-7" />
                </motion.div>
              </Link>
              <span className="text-[10px] font-semibold text-blue-600 mt-1 tracking-wide">
                Upload
              </span>
            </div>

            {/* RIGHT: Bookings & Profile */}
            {mobileNav.slice(2).map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex flex-col items-center gap-1 flex-1 py-1"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-200 ${
                      active
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-105'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`text-[10px] font-semibold tracking-wide transition-colors ${
                      active ? 'text-blue-600' : 'text-slate-400'
                    }`}
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