import { z } from 'zod';
import { PASSWORD_RULES } from '@/constants/auth';
import { passwordSchemaMessage } from '@/lib/password';

const passwordField = z
  .string()
  .min(1, 'Password is required')
  .min(PASSWORD_RULES.minLength, passwordSchemaMessage)
  .regex(PASSWORD_RULES.patterns.uppercase, passwordSchemaMessage)
  .regex(PASSWORD_RULES.patterns.lowercase, passwordSchemaMessage)
  .regex(PASSWORD_RULES.patterns.number, passwordSchemaMessage)
  .regex(PASSWORD_RULES.patterns.special, passwordSchemaMessage);

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(1, 'Full name is required')
      .min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    countryCode: z.string().min(1, 'Country code is required'),
    mobile: z
      .string()
      .min(1, 'Mobile number is required')
      .regex(/^\d{6,15}$/, 'Enter a valid mobile number'),
    password: passwordField,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    role: z.enum(['user', 'photographer'], { message: 'Please select a role' }),
    acceptTerms: z.boolean().refine((value) => value === true, {
      message: 'You must accept the terms and privacy policy',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
});

export const resetPasswordSchema = z
  .object({
    password: passwordField,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
