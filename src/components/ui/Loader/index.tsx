import { ShootHubLoader } from '@/components/ShootHubLoader';
import { cn } from '@/lib/utils';
import type { LoaderProps } from './Loader.types';

type Props = LoaderProps & {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  label?: string;
  fullScreen?: boolean;
};

export function Loader({ className, size = 'md', label, fullScreen, ...rest }: Props) {
  return (
    <div className={cn('flex items-center justify-center', className)} {...rest}>
      <ShootHubLoader size={size} label={label} fullScreen={fullScreen} />
    </div>
  );
}
