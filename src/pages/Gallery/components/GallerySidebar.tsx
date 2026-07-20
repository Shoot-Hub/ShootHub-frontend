import { Calendar, HardDrive, ImageIcon, User, FolderOpen } from 'lucide-react';
import { UploadSelfie } from './UploadSelfie';
import { GallerySettingsBadges } from './GalleryFooter';
import type { Gallery } from '../types';

type Props = {
  gallery: Gallery;
  uploadProps: React.ComponentProps<typeof UploadSelfie>;
};

export function GallerySidebar({ gallery, uploadProps }: Props) {
  const stats = [
    { icon: ImageIcon, label: 'Photos', value: gallery.photoCount.toLocaleString() },
    { icon: FolderOpen, label: 'Albums', value: String(gallery.albumCount) },
    { icon: Calendar, label: 'Created', value: gallery.createdDate },
    { icon: Calendar, label: 'Expires', value: gallery.settings.expiryDate },
    { icon: HardDrive, label: 'Storage', value: gallery.storageUsed },
    { icon: User, label: 'Photographer', value: gallery.photographer.name },
  ];

  return (
    <aside className="space-y-4">
      <UploadSelfie {...uploadProps} />

      <div className="rounded-[24px] border border-[#EEF0F4] bg-white p-5 shadow-[var(--shadow-gallery-soft)]">
        <h3 className="mb-4 text-sm font-semibold text-[#111827]">Gallery Information</h3>
        <dl className="space-y-3">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#F8F9FB]">
                <Icon className="h-4 w-4 text-[#6C3BFF]" />
              </div>
              <div>
                <dt className="text-xs text-[#A0A4B0]">{label}</dt>
                <dd className="text-sm font-medium text-[#111827]">{value}</dd>
              </div>
            </div>
          ))}
        </dl>

        {gallery.albums.length > 0 && (
          <div className="mt-4 border-t border-[#EEF0F4] pt-4">
            <p className="mb-2 text-xs font-medium text-[#A0A4B0]">Albums</p>
            <div className="flex flex-wrap gap-1.5">
              {gallery.albums.map((a) => (
                <span key={a.id} className="rounded-full bg-[#F8F9FB] px-2.5 py-1 text-xs text-[#636E72]">
                  {a.name} ({a.photoCount})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-[24px] border border-[#EEF0F4] bg-white p-4">
        <GallerySettingsBadges settings={gallery.settings} />
      </div>

      <div className="rounded-[24px] bg-gradient-to-br from-[#F3EEFF] to-[#E8F4FD] p-4">
        <p className="text-xs leading-relaxed text-[#636E72]">
          <span className="font-semibold text-[#6C3BFF]">Tip:</span> Upload a clear selfie to instantly find all photos featuring you using AI face search.
        </p>
      </div>
    </aside>
  );
}
