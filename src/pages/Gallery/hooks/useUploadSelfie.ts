import { useCallback, useState } from 'react';

type UploadState = {
  progress: number;
  file: File | null;
  preview: string | null;
  status: 'idle' | 'uploading' | 'complete' | 'error';
};

export function useUploadSelfie() {
  const [state, setState] = useState<UploadState>({
    progress: 0,
    file: null,
    preview: null,
    status: 'idle',
  });

  const upload = useCallback(async (file: File) => {
    const preview = URL.createObjectURL(file);
    setState({ file, preview, progress: 0, status: 'uploading' });

    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 80));
      setState((s) => ({ ...s, progress: i }));
    }

    setState((s) => ({ ...s, status: 'complete', progress: 100 }));
    return preview;
  }, []);

  const reset = useCallback(() => {
    if (state.preview) URL.revokeObjectURL(state.preview);
    setState({ progress: 0, file: null, preview: null, status: 'idle' });
  }, [state.preview]);

  return { ...state, upload, reset };
}
