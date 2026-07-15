import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, HelpCircle, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/pages/LandingPage/landing/Logo';

export function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine initial mode based on current path
  const isRegisterPath = location.pathname === '/register';
  const [isLogin, setIsLogin] = useState(!isRegisterPath);
  
  // Sync state with URL path changes
  useEffect(() => {
    setIsLogin(location.pathname !== '/register');
  }, [location.pathname]);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // General form feedback
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Validation functions
  const validateEmail = (val: string) => {
    if (!val) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (val: string) => {
    if (!val) {
      return 'Password is required';
    }
    if (val.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  const handleToggleMode = () => {
    const nextMode = !isLogin;
    setIsLogin(nextMode);
    setEmailError('');
    setPasswordError('');
    navigate(nextMode ? '/login' : '/register');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    
    if (eErr || pErr) {
      setEmailError(eErr);
      setPasswordError(pErr);
      return;
    }

    setEmailError('');
    setPasswordError('');
    setIsLoading(true);

    // Simulate validation and API request
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to external shoothub-creator page
      window.location.href = 'https://shoothub-creator.vercel.app/';
    }, 1500);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateEmail(forgotEmail);
    if (err) {
      alert(err);
      return;
    }
    setForgotSent(true);
    setTimeout(() => {
      setForgotSent(false);
      setShowForgotModal(false);
      setForgotEmail('');
    }, 3000);
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-indigo-50/40 text-ink antialiased">
      {/* Left side: Beautiful Light-themed Illustration & Information (Desktop only) */}
      <div className="relative hidden w-1/2 flex-col justify-between border-r border-blue-100 bg-gradient-to-b from-blue-50/80 to-white p-12 lg:flex xl:p-16">
        <div>
          <Link to="/" className="inline-block transition-transform hover:scale-[1.02]">
            <Logo />
          </Link>
        </div>

        <div className="my-auto max-w-lg space-y-8 py-10">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/70 px-3 py-1 text-xs font-semibold tracking-wider text-blue-600 uppercase">
              Creator Hub
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-ink md:text-5xl leading-tight">
              Manage your photography business in <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">one place</span>
            </h1>
            <p className="text-[17px] leading-relaxed text-ink-muted">
              Connect with clients, manage bookings, share gorgeous galleries, and grow your photography brand seamlessly.
            </p>
          </div>

          {/* Core features list */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-semibold text-ink">Premium Client Portals</h4>
                <p className="text-sm text-ink-muted">Deliver shoots in stunning, interactive digital galleries.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-semibold text-ink">Smart Invoicing & Contracts</h4>
                <p className="text-sm text-ink-muted">Get paid faster with automated reminders and legal templates.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-semibold text-ink">Seamless Scheduling</h4>
                <p className="text-sm text-ink-muted">Sync your calendar and let clients book sessions in real-time.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Small footer text */}
        <div className="flex items-center justify-between text-xs text-ink-light">
          <p>© {new Date().getFullYear()} ShootHub. All rights reserved.</p>
          <button 
            type="button" 
            onClick={() => setShowHelpModal(true)} 
            className="flex items-center gap-1 font-semibold text-blue-600 transition-colors hover:text-blue-700"
          >
            <HelpCircle className="h-3.5 w-3.5" /> Need help?
          </button>
        </div>
      </div>

      {/* Right side: Auth Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-16 xl:px-24">
        {/* Mobile Header */}
        <div className="mx-auto flex w-full max-w-md items-center justify-between lg:hidden mb-12">
          <Link to="/" className="transition-transform hover:scale-[1.02]">
            <Logo />
          </Link>
          <button 
            type="button" 
            onClick={() => setShowHelpModal(true)}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700"
          >
            <HelpCircle className="h-3.5 w-3.5" /> Need help?
          </button>
        </div>

        <div className="mx-auto w-full max-w-md">
          {/* Card Wrapper */}
          <div className="rounded-3xl border border-blue-50/50 bg-white p-8 shadow-card-lg sm:p-10">
            
            {/* Header info */}
            <div className="mb-8 text-center sm:text-left">
              <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                {isLogin ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="mt-2 text-[15px] text-ink-muted">
                {isLogin ? "New to ShootHub?" : "Already have an account?"}{' '}
                <button
                  type="button"
                  onClick={handleToggleMode}
                  className="font-semibold text-blue-600 transition-all hover:text-blue-700 hover:underline"
                >
                  {isLogin ? 'Sign up for free' : 'Sign in'}
                </button>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Input
                  type="email"
                  label="Email address"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(validateEmail(e.target.value));
                  }}
                  error={emailError}
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-ink">
                    Password
                  </label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={isLogin ? '••••••••' : 'At least 6 characters'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError(validatePassword(e.target.value));
                    }}
                    required
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    className={`flex h-[46px] w-full rounded-xl border ${
                      passwordError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-border focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10'
                    } bg-white pl-4 pr-11 py-2.5 text-[15px] text-ink outline-none transition-all duration-200 placeholder:text-ink-light`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-light hover:text-ink-muted focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" strokeWidth={2} />
                    ) : (
                      <Eye className="h-5 w-5" strokeWidth={2} />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p className="mt-1.5 text-xs font-semibold text-red-500">
                    {passwordError}
                  </p>
                )}
              </div>

              {!isLogin && (
                <div className="flex items-start gap-2.5 py-1">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="mt-1 h-4 w-4 rounded border-border text-blue-600 focus:ring-blue-500/30"
                  />
                  <label htmlFor="terms" className="text-xs leading-normal text-ink-muted">
                    I agree to the{' '}
                    <a href="#terms" className="font-semibold text-blue-600 hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#privacy" className="font-semibold text-blue-600 hover:underline">
                      Privacy Policy
                    </a>.
                  </label>
                </div>
              )}

              {/* Submit CTA */}
              <Button
                type="submit"
                fullWidth
                disabled={isLoading}
                size="lg"
                className="mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold transition-all shadow-md active:scale-[0.99] disabled:opacity-75 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Setting up portal...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    {isLogin ? 'Sign In to Dashboard' : 'Get Started'}
                    <ArrowRight className="h-4.5 w-4.5" />
                  </span>
                )}
              </Button>
            </form>
          </div>

          {/* Help links for mobile */}
          <div className="mt-8 flex justify-center text-center lg:hidden">
            <button 
              type="button" 
              onClick={() => setShowHelpModal(true)} 
              className="flex items-center gap-1 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
            >
              <HelpCircle className="h-4 w-4" /> Need help? Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Modals Container */}
      <AnimatePresence>
        {/* Help Modal */}
        {showHelpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHelpModal(false)}
              className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            />
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-card-lg text-center"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-ink">Need assistance?</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                If you're having trouble logging in or setting up your ShootHub account, our support team is available 24/7.
              </p>
              <div className="mt-5 space-y-2">
                <a
                  href="mailto:support@shoothub.co"
                  className="block w-full rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
                >
                  Email support@shoothub.co
                </a>
                <button
                  type="button"
                  onClick={() => setShowHelpModal(false)}
                  className="block w-full rounded-xl border border-border bg-white py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Forgot Password Modal */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowForgotModal(false);
                setForgotSent(false);
              }}
              className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            />
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-card-lg"
            >
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  {forgotSent ? <CheckCircle className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
                </div>
                <h3 className="text-lg font-bold text-ink">
                  {forgotSent ? 'Check your email' : 'Reset password'}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {forgotSent
                    ? `We sent a link to reset your password to your email. Please check your inbox and spam folders.`
                    : `Enter the email address associated with your account, and we will email you a link to reset your password.`}
                </p>
              </div>

              {!forgotSent ? (
                <form onSubmit={handleForgotSubmit} className="mt-5 space-y-4">
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="w-1/2 rounded-xl border border-border bg-white py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
                    >
                      Send reset link
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(false);
                      setForgotSent(false);
                    }}
                    className="w-full rounded-xl border border-border bg-white py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50"
                  >
                    Back to Sign In
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
