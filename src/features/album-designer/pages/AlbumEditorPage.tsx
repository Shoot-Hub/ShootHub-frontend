import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LayoutTemplate, X } from 'lucide-react';
import { ShootHubLoader } from '@/components/ShootHubLoader';
import {
  EditorTopBar,
  EditorLeftPanel,
  CanvasToolbar,
  SpreadCanvas,
  PageFilmstrip,
  PagesNavigator,
  ContextualPropertiesBar,
} from '../components/editor';
import { useEditorStore } from '../store';
import { useEditorKeyboard } from '../hooks';

function useAutosaveLabel(updatedAt?: string) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);
  return useMemo(() => {
    if (!updatedAt) return 'just now';
    const mins = Math.max(0, Math.floor((now - new Date(updatedAt).getTime()) / 60_000));
    if (mins < 1) return 'just now';
    if (mins === 1) return '1m ago';
    return `${mins}m ago`;
  }, [updatedAt, now]);
}

export function AlbumEditorPage() {
  const { albumId } = useParams<{ albumId: string }>();
  const navigate = useNavigate();
  const load = useEditorStore((s) => s.load);
  const album = useEditorStore((s) => s.album);
  const setAlbum = useEditorStore((s) => s.setAlbum);
  const save = useEditorStore((s) => s.save);
  const [ready, setReady] = useState(false);
  const [missing, setMissing] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);

  useEditorKeyboard();
  const lastSavedLabel = useAutosaveLabel(album?.updatedAt);

  useEffect(() => {
    if (!albumId) {
      setMissing(true);
      return;
    }
    const ok = load(albumId);
    setMissing(!ok);
    setReady(true);
  }, [albumId, load]);

  // Autosave every 45s while editing
  useEffect(() => {
    if (!album) return;
    const t = setInterval(() => {
      save();
    }, 45_000);
    return () => clearInterval(t);
  }, [album?.id, save]);

  if (!ready) {
    return (
      <div className="flex h-dvh items-center justify-center bg-[#F8F9FB]">
        <ShootHubLoader size="lg" label="Opening album…" />
      </div>
    );
  }

  if (missing || !album) {
    return (
      <div className="flex h-dvh items-center justify-center bg-[#F8F9FB] p-6">
        <div className="max-w-md rounded-2xl border border-[#EEF0F4] bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-bold text-[#2D3436]">Album not found</h2>
          <p className="mt-2 text-sm text-[#A0A4B0]">
            This album may have been deleted or never saved.
          </p>
          <button
            type="button"
            onClick={() => navigate('/creator/album-designer')}
            className="mt-5 rounded-xl bg-[#6B46FE] px-4 py-2.5 text-sm font-semibold text-white"
          >
            Back to Album Designer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-white">
      <EditorTopBar
        lastSavedLabel={lastSavedLabel}
        onRename={() => {
          const name = window.prompt('Album name', album.info.name);
          if (name == null || !name.trim()) return;
          setAlbum({
            ...album,
            info: { ...album.info, name: name.trim() },
            updatedAt: new Date().toISOString(),
          });
          save();
        }}
      />

      <div className="relative flex min-h-0 flex-1">
        <div className="hidden md:flex">
          <EditorLeftPanel />
        </div>

        <div className="relative flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2 border-b border-[#E8EAEF] px-3 py-2 md:hidden">
            <button
              type="button"
              onClick={() => setMobileToolsOpen(true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#E8EAEF] bg-white px-3 text-xs font-semibold text-[#2D3436] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B46FE]/40"
              aria-label="Open design tools"
            >
              <LayoutTemplate className="h-4 w-4 text-[#6B46FE]" />
              Tools
            </button>
          </div>
          <CanvasToolbar />
          <SpreadCanvas />
          <PageFilmstrip />
          <ContextualPropertiesBar />
        </div>

        <PagesNavigator />
      </div>

      {mobileToolsOpen ? (
        <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true" aria-label="Design tools">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close design tools"
            onClick={() => setMobileToolsOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(100%,300px)] flex-col bg-white shadow-xl">
            <div className="flex h-12 items-center justify-between border-b border-[#E8EAEF] px-3">
              <span className="text-sm font-bold text-[#2D3436]">Design tools</span>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setMobileToolsOpen(false)}
                className="rounded-lg p-2 text-[#636E72] hover:bg-[#F8F9FB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B46FE]/40"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <EditorLeftPanel />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
