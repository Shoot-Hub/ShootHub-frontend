import { Container } from '@/components/ui/Container';
import { Logo } from '../Logo';

const footerLinks = {
  Product: ['Explore', 'Creators', 'Categories', 'Pricing'],
  Company: ['About', 'Careers', 'Blog', 'Press'],
  Support: ['Help Center', 'Contact', 'Privacy', 'Terms'],
} as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-white py-12 md:py-16">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              India&apos;s most trusted platform for booking photographers, videographers, and creative professionals.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-bold text-ink">{title}</h3>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      {link}
                    </a>
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
            <a href="#privacy" className="text-sm text-ink-muted hover:text-ink">
              Privacy Policy
            </a>
            <a href="#terms" className="text-sm text-ink-muted hover:text-ink">
              Terms of Service
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
