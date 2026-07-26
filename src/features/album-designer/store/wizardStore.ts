import { create } from 'zustand';
import type { AlbumInfo, TemplateId } from '../types';
import { DEFAULT_PAGE_COUNT } from '../constants';

export type WizardStep = 1 | 2 | 3 | 4;

const defaultInfo = (): AlbumInfo => ({
  name: '',
  client: '',
  booking: '',
  event: '',
  albumType: 'wedding',
  albumSize: '10x10',
  orientation: 'landscape',
  pageCount: DEFAULT_PAGE_COUNT,
  coverType: 'premium',
});

type WizardStore = {
  step: WizardStep;
  info: AlbumInfo;
  selectedPhotoIds: string[];
  templateId: TemplateId;
  setStep: (step: WizardStep) => void;
  next: () => void;
  back: () => void;
  patchInfo: (partial: Partial<AlbumInfo>) => void;
  togglePhoto: (id: string) => void;
  setPhotos: (ids: string[]) => void;
  setTemplate: (id: TemplateId) => void;
  reset: () => void;
  canProceed: () => boolean;
};

export const useWizardStore = create<WizardStore>((set, get) => ({
  step: 1,
  info: defaultInfo(),
  selectedPhotoIds: [],
  templateId: 'modern',

  setStep: (step) => set({ step }),
  next: () => set((s) => ({ step: Math.min(4, s.step + 1) as WizardStep })),
  back: () => set((s) => ({ step: Math.max(1, s.step - 1) as WizardStep })),

  patchInfo: (partial) => set((s) => ({ info: { ...s.info, ...partial } })),

  togglePhoto: (id) =>
    set((s) => ({
      selectedPhotoIds: s.selectedPhotoIds.includes(id)
        ? s.selectedPhotoIds.filter((x) => x !== id)
        : [...s.selectedPhotoIds, id],
    })),

  setPhotos: (ids) => set({ selectedPhotoIds: ids }),
  setTemplate: (templateId) => set({ templateId }),

  reset: () =>
    set({
      step: 1,
      info: defaultInfo(),
      selectedPhotoIds: [],
      templateId: 'modern',
    }),

  canProceed: () => {
    const { step, info, selectedPhotoIds, templateId } = get();
    if (step === 1) return Boolean(info.name.trim() && info.client.trim());
    if (step === 2) return selectedPhotoIds.length > 0;
    if (step === 3) return Boolean(templateId);
    return true;
  },
}));
