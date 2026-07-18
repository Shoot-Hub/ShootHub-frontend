import type { ReactNode } from 'react';
import { Navbar } from '@/pages/LandingPage/landing/Navbar';
import { Footer } from '@/pages/LandingPage/landing/Footer';

type PageShellProps = {
  children: ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
