import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { WizardStepper } from '../components/shared';
import {
  StepAlbumInfo,
  StepSelectPhotos,
  StepChooseTemplate,
} from '../components/wizard';
import { useWizardStore } from '../store';
import { albumStorageService } from '../services';
import { useAlbumStore } from '../store';

export function AlbumWizardPage() {
  const navigate = useNavigate();
  const step = useWizardStore((s) => s.step);
  const next = useWizardStore((s) => s.next);
  const back = useWizardStore((s) => s.back);
  const reset = useWizardStore((s) => s.reset);
  const canProceed = useWizardStore((s) => s.canProceed);
  const info = useWizardStore((s) => s.info);
  const templateId = useWizardStore((s) => s.templateId);
  const selectedPhotoIds = useWizardStore((s) => s.selectedPhotoIds);
  const refresh = useAlbumStore((s) => s.refresh);

  useEffect(() => {
    reset();
  }, [reset]);

  const handleContinue = () => {
    if (!canProceed()) {
      if (step === 1) toast.error('Please add album name and client');
      else if (step === 2) toast.error('Select at least one photo');
      else toast.error('Choose a template');
      return;
    }

    if (step < 3) {
      next();
      return;
    }

    // Step 3 → create album & open editor
    const album = albumStorageService.createFromWizard({
      info,
      templateId,
      selectedPhotoIds,
    });
    refresh();
    reset();
    toast.success('Album created — opening editor');
    navigate(`/creator/album-designer/${album.id}/edit`);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/creator/album-designer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#636E72] hover:text-[#6B46FE]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to albums
        </Link>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3EEFF] px-3 py-1 text-xs font-bold text-[#6B46FE]">
          <Sparkles className="h-3.5 w-3.5" />
          New Album Wizard
        </span>
      </div>

      <div className="rounded-2xl border border-[#EEF0F4] bg-white p-4 shadow-sm sm:p-6">
        <WizardStepper step={step} />
      </div>

      <div className="rounded-2xl border border-[#EEF0F4] bg-white p-4 shadow-sm sm:p-8">
        {step === 1 && <StepAlbumInfo />}
        {step === 2 && <StepSelectPhotos />}
        {step === 3 && <StepChooseTemplate />}
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            if (step === 1) navigate('/creator/album-designer');
            else back();
          }}
          className="rounded-xl border border-[#EEF0F4] bg-white px-5 py-2.5 text-sm font-semibold text-[#636E72] hover:bg-[#F8F9FB]"
        >
          {step === 1 ? 'Cancel' : 'Back'}
        </button>
        <button
          type="button"
          onClick={handleContinue}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6B46FE] to-[#8A60FF] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#6B46FE]/25"
        >
          {step === 3 ? 'Open Album Editor' : 'Continue'}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
