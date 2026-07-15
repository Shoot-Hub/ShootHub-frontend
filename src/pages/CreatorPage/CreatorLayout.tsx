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
} from 'lucide-react';
import { useAuth, setAuth } from '@/store';
import { userService } from '@/services/user';
import { creatorService } from '@/services/creator';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/creator' },
  { icon: User, label: 'Profile', path: '/creator/profile' },
  { icon: Images, label: 'Portfolio', path: '/creator/portfolio' },
  { icon: Package, label: 'Packages', path: '/creator/packages' },
  { icon: CalendarCheck, label: 'Bookings', path: '/creator/bookings' },
  { icon: Star, label: 'Reviews', path: '/creator/reviews' },
  { icon: MessageSquare, label: 'Messages', path: '/creator/messages' },
  { icon: Settings, label: 'Settings', path: '/creator/settings' },
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

  // Fetch full profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.role !== 'photographer') return;
      setLoadingProfile(true);
      try {
        const res = await creatorService.getMyProfile();
        if (res.data) {
          // Update user with full profile data
          setAuth(res.data as typeof user);
        }
      } catch {
        // Silent fail - keep existing user data
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

  const userName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Creator';
  const userAvatar = user?.avatar?.url || null;
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Desktop Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-xl border-r border-slate-100 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100">
          <Link to="/creator" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ShootHub
              </span>
              <p className="text-[10px] font-medium text-slate-400 -mt-0.5">Creator Studio</p>
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
        <div className="px-4 py-4 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white text-sm font-bold shadow-sm">
              {userAvatar ? (
                <img src={userAvatar} alt="" className="h-full w-full rounded-xl object-cover" />
              ) : (
                userInitial
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{userName}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email || ''}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? 'text-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50/50'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/40'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-gradient-to-b from-blue-600 to-indigo-600"
                  />
                )}
                <item.icon className={`h-5 w-5 ${active ? 'text-blue-600' : ''}`} />
                <span>{item.label}</span>
                {active && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Upgrade Banner */}
        <div className="px-3 py-3">
          <div className="rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-4 text-white">
            <Sparkles className="h-5 w-5 mb-1.5" />
            <p className="text-sm font-semibold">Go Pro</p>
            <p className="text-[11px] text-blue-100 mt-0.5">Unlock premium features</p>
            <button className="mt-2 rounded-lg bg-white/20 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold hover:bg-white/30 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-100 p-3">
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
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Navbar */}
        <header
          className={`sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/80 backdrop-blur-xl transition-all ${
            scrolled ? 'border-slate-100 shadow-sm' : 'border-transparent'
          }`}
        >
          <div className="flex items-center gap-3 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-slate-800">
                {navItems.find((item) => isActive(item.path))?.label || 'Dashboard'}
              </h1>
              <p className="text-xs text-slate-400">Welcome back, {userName.split(' ')[0]}!</p>
            </div>
          </div>

          <div className="flex items-center gap-1 px-4">
            {/* Quick Actions */}
            <div className="hidden sm:flex items-center gap-1 mr-2">
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {user?.isOnline ? 'Online' : 'Offline'}
              </div>
            </div>

            {/* Notifications */}
            <button className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-50 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 rounded-xl p-1.5 pr-3 hover:bg-slate-50 transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white text-sm font-bold shadow-sm">
                  {userAvatar ? (
                    <img src={userAvatar} alt="" className="h-full w-full rounded-xl object-cover" />
                  ) : (
                    userInitial
                  )}
                </div>
                <span className="hidden text-sm font-medium text-slate-700 sm:block">{userName.split(' ')[0]}</span>
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
                      className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-slate-100 bg-white py-2 shadow-xl"
                    >
                      <div className="border-b border-slate-50 px-4 py-3">
                        <p className="text-sm font-semibold text-slate-800">{userName}</p>
                        <p className="text-xs text-slate-400">{user?.email}</p>
                      </div>
                      <Link
                        to="/creator/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                      >
                        <User className="h-4 w-4 text-blue-600" />
                        My Profile
                      </Link>
                      <Link
                        to="/creator/settings"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
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
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
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

        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          {loadingProfile ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                <p className="text-sm text-slate-400">Loading your studio...</p>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-100 bg-white/95 backdrop-blur-xl lg:hidden safe-area-bottom shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around px-2 py-1">
          {navItems.slice(0, 5).map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-2 py-2 text-[10px] font-medium transition-colors ${
                  active ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <div className={`p-1 rounded-lg ${active ? 'bg-blue-50' : ''}`}>
                  <item.icon className={`h-5 w-5 ${active ? 'text-blue-600' : ''}`} />
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}