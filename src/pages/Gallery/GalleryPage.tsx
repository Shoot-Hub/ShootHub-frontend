import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useGallery, isGalleryUnlocked } from './hooks';
import { GalleryLandingPage } from './GalleryLanding';
import { GalleryPasswordPage } from './GalleryPassword';
import { GalleryViewerPage } from './GalleryViewer';

type GalleryStep = 'landing' | 'password' | 'viewer';

const ENTERED_KEY = (slug: string) => `shoothub-gallery-entered-${slug}`;

function hasEnteredGallery(slug: string) {
  try {
    return sessionStorage.getItem(ENTERED_KEY(slug)) === 'true';
  } catch {
    return false;
  }
}

function markGalleryEntered(slug: string) {
  try {
    sessionStorage.setItem(ENTERED_KEY(slug), 'true');
  } catch {
    // Ignore storage failures and continue with in-memory UI state.
  }
}

export function GalleryPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: gallery, isLoading, isError } = useGallery(slug);
  const [step, setStep] = useState<GalleryStep>('landing');

  useEffect(() => {
    if (!gallery || !slug) return;

    if (gallery.access === 'password') {
      setStep(isGalleryUnlocked(slug) ? 'viewer' : 'password');
    } else if (hasEnteredGallery(slug)) {
      setStep('viewer');
    } else {
      setStep('landing');
    }
  }, [gallery, slug]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FB]">
        <Loader2 className="h-8 w-8 animate-spin text-[#6C3BFF]" />
      </div>
    );
  }

  if (isError || !gallery) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F8F9FB] px-4 text-center">
        <h1 className="text-2xl font-bold text-[#111827]">Gallery Not Found</h1>
        <p className="text-[#636E72]">This gallery link may have expired or doesn't exist.</p>
        <button
          type="button"
          onClick={() => navigate('/gallery/demo')}
          className="rounded-2xl bg-[#6C3BFF] px-6 py-3 text-sm font-semibold text-white"
        >
          View Demo Galleries
        </button>
      </div>
    );
  }

  if (step === 'landing') {
    return (
      <GalleryLandingPage
        gallery={gallery}
        onEnter={() => {
          markGalleryEntered(gallery.slug);
          setStep('viewer');
        }}
      />
    );
  }

  if (step === 'password') {
    return (
      <GalleryPasswordPage
        gallery={gallery}
        onUnlock={() => setStep('viewer')}
      />
    );
  }

  return <GalleryViewerPage gallery={gallery} />;
}
