import { PASSWORD_RULES } from '@/constants/auth';

export type PasswordStrength = 'weak' | 'medium' | 'strong';

export type PasswordStrengthResult = {
  strength: PasswordStrength;
  score: number;
  label: string;
  color: string;
  width: string;
};

const STRENGTH_CONFIG: Record<PasswordStrength, { label: string; color: string; width: string }> = {
  weak: { label: 'Weak', color: 'bg-red-500', width: 'w-1/3' },
  medium: { label: 'Medium', color: 'bg-amber-500', width: 'w-2/3' },
  strong: { label: 'Strong', color: 'bg-emerald-500', width: 'w-full' },
};

export function getPasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return { strength: 'weak', score: 0, label: '', color: 'bg-border', width: 'w-0' };
  }

  const { patterns } = PASSWORD_RULES;
  let score = 0;

  if (password.length >= PASSWORD_RULES.minLength) score += 1;
  if (patterns.uppercase.test(password)) score += 1;
  if (patterns.lowercase.test(password)) score += 1;
  if (patterns.number.test(password)) score += 1;
  if (patterns.special.test(password)) score += 1;

  const strength: PasswordStrength =
    score <= 2 ? 'weak' : score <= 4 ? 'medium' : 'strong';

  return { strength, score, ...STRENGTH_CONFIG[strength] };
}

export const passwordSchemaMessage =
  'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
