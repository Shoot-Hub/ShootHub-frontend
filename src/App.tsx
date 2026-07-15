import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LandingPage } from '@/pages/LandingPage';
import { CategoriesPage } from '@/pages/Categories';
import { PricingPage } from '@/pages/Pricing';
import { AboutPage } from '@/pages/About';
import { CreatorsPage } from '@/pages/Creators';
import { ReelsPage } from '@/pages/ReelsPage';
import {
  LoginPage,
  SignupPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  VerifyEmailPage,
} from '@/pages/auth';
import { AUTH_ROUTES } from '@/constants/auth';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/creators" element={<CreatorsPage />} />
        <Route path="/reels" element={<ReelsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path={AUTH_ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={AUTH_ROUTES.SIGNUP} element={<SignupPage />} />
        <Route path={AUTH_ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={AUTH_ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
        <Route path={AUTH_ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />
      </Routes>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 500,
          },
        }}
      />
    </BrowserRouter>
  );
}


export default App;
