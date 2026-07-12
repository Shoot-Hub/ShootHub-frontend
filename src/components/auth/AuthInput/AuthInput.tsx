import { forwardRef } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Input, type InputProps } from '@/components/ui/Input';

export type AuthInputProps = Omit<InputProps, 'leftIcon'> & {
  icon: LucideIcon;
};

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(function AuthInput(
  { icon: Icon, ...props },
  ref,
) {
  return (
    <Input
      ref={ref}
      leftIcon={<Icon className="h-[18px] w-[18px]" strokeWidth={2} />}
      {...props}
    />
  );
});
