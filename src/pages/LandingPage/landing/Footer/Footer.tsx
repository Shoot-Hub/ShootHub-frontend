import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { Logo } from '../Logo';

const footerLinks = {
  Product: [
    { label: 'Explore', to: '/' },
    { label: 'Creators', to: '/creators' },
    { label: 'Reels', to: '/reels' },
    { label: 'Categories', to: '/categories' },
    { label: 'Pricing', to: '/pricing' },
  ],
  Company: [
    { label: 'About', to: '/about' },
    { label: 'Careers', to: '/about' },
    { label: 'Blog', to: '/about' },
    { label: 'Press', to: '/about' },
  ],
  Support: [
    { label: 'Help Center', to: '/about' },
    { label: 'Contact', to: '/about' },
    { label: 'Privacy', to: '/about' },
    { label: 'Terms', to: '/about' },
  ],
} as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-white py-12 md:py-16">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              India&apos;s most trusted platform for booking photographers, videographers, and
              creative professionals.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-bold text-ink">{title}</h3>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-ink-muted">
            &copy; {new Date().getFullYear()} ShootHub. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/about" className="text-sm text-ink-muted hover:text-ink">
              Privacy Policy
            </Link>
            <Link to="/about" className="text-sm text-ink-muted hover:text-ink">
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
