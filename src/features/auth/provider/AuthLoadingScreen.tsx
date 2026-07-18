/**
 * Full-screen loader shown while auth session is being restored.
 */
import { ShootHubLoader } from '@/components/ShootHubLoader';

export function AuthLoadingScreen() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#F8F9FB]"
      role="status"
      aria-live="polite"
      aria-label="Loading authentication"
    >
      <ShootHubLoader size="xl" label="Restoring your session…" />
    </div>
  );
}
