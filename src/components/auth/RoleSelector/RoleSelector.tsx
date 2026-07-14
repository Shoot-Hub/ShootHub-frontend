import { Camera, User } from 'lucide-react';
import { RoleCard } from '@/components/auth/RoleCard';
import { USER_ROLES, type UserRole } from '@/constants/auth';

type RoleSelectorProps = {
  value?: UserRole;
  onChange: (role: UserRole) => void;
  error?: string;
};

const roleIcons = {
  client: User,
  creator: Camera,
} as const;

export function RoleSelector({ value, onChange, error }: RoleSelectorProps) {
  return (
    <fieldset className="flex w-full min-w-0 flex-col gap-3">
      <legend className="mb-1 text-sm font-medium text-ink">Choose how you&apos;ll use ShootHub</legend>
      <div className="grid grid-cols-2 gap-2.5">
        {USER_ROLES.map((role) => (
          <RoleCard
            key={role.value}
            value={role.value}
            label={role.label}
            description={role.description}
            icon={roleIcons[role.value]}
            selected={value === role.value}
            onSelect={() => onChange(role.value)}
          />
        ))}
      </div>
      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
