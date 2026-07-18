import { ShootHubLoader } from '@/components/ShootHubLoader';

export function AuthLoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F8F9FB]">
      <ShootHubLoader size="xl" label="Loading ShootHub…" />
    </div>
  );
}
