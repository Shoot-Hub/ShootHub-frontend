import { Route } from 'react-router-dom';
import {
  LoginPage,
  SignupPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  VerifyEmailPage,
} from '@/pages/auth';
import { AUTH_ROUTES } from '@/constants/auth';

export const userRoutes = [
  <Route key="login" path={AUTH_ROUTES.LOGIN} element={<LoginPage />} />,
  <Route key="signup" path={AUTH_ROUTES.SIGNUP} element={<SignupPage />} />,
  <Route key="forgot-password" path={AUTH_ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />,
  <Route key="reset-password" path={AUTH_ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />,
  <Route key="verify-email" path={AUTH_ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />,
];