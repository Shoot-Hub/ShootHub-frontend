import { useDropzone } from 'react-dropzone';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePhotoEditorStore } from '../store';
import { createId } from '../utils';
import { ThumbSizeBox } from './ui';

type Props = {
  size: number;
};

export function AddPhotosDropzone({ size }: Props) {
  const addPhotos = usePhotoEditorStore((s) => s.addPhotos);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    multiple: true,
    onDrop: (files) => {
      if (!files.length) return;
      const items = files.map((file) => {
        const url = URL.createObjectURL(file);
        return {
          id: createId('photo'),
          name: file.name,
          src: url,
          thumb: url,
          width: 4000,
          height: 2667,
        };
      });
      addPhotos(items);
      toast.success(`Added ${files.length} photo${files.length === 1 ? '' : 's'}`);
    },
  });

  return (
    <ThumbSizeBox size={size}>
      <button
        type="button"
        {...getRootProps({
          className: `flex h-full w-full flex-col items-center justify-center gap-1 rounded-[12px] border-2 border-dashed transition-colors ${
            isDragActive
              ? 'border-[var(--pe-primary)] bg-[var(--pe-primary-soft)] text-[var(--pe-primary)]'
              : 'border-[var(--pe-border-strong)] bg-[var(--pe-elevated)] text-[var(--pe-ink-muted)] hover:border-[var(--pe-primary)]/50 hover:text-[var(--pe-primary)]'
          }`,
        })}
      >
        <input {...getInputProps()} />
        <Plus className="h-4 w-4" />
        <span className="text-[9px] font-bold">Add</span>
      </button>
    </ThumbSizeBox>
  );
}
