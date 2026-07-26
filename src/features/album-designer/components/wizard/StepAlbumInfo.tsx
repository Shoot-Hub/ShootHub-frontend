import {
  ALBUM_TYPES,
  ALBUM_SIZES,
  ORIENTATIONS,
  COVER_TYPES,
  MOCK_CLIENTS,
  MOCK_BOOKINGS,
  MOCK_EVENTS,
  MIN_PAGE_COUNT,
  MAX_PAGE_COUNT,
} from '../../constants';
import { useWizardStore } from '../../store';

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold text-[#636E72]">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  'h-11 w-full rounded-xl border border-[#EEF0F4] bg-[#F8F9FB] px-3.5 text-sm text-[#2D3436] outline-none transition-all focus:border-[#6B46FE]/40 focus:bg-white focus:ring-2 focus:ring-[#6B46FE]/15';

export function StepAlbumInfo() {
  const { info, patchInfo } = useWizardStore();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-[#2D3436]">Album Information</h2>
        <p className="text-sm text-[#A0A4B0]">
          Set the basics — client, event, size, and cover finish.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Album Name *">
          <input
            className={inputClass}
            value={info.name}
            onChange={(e) => patchInfo({ name: e.target.value })}
            placeholder="e.g. Rohit & Priya Wedding Album"
          />
        </Field>
        <Field label="Client *">
          <select
            className={inputClass}
            value={info.client}
            onChange={(e) => patchInfo({ client: e.target.value })}
          >
            <option value="">Select client</option>
            {MOCK_CLIENTS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Booking">
          <select
            className={inputClass}
            value={info.booking}
            onChange={(e) => patchInfo({ booking: e.target.value })}
          >
            <option value="">Select booking</option>
            {MOCK_BOOKINGS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Event">
          <select
            className={inputClass}
            value={info.event}
            onChange={(e) => patchInfo({ event: e.target.value })}
          >
            <option value="">Select event</option>
            {MOCK_EVENTS.map((ev) => (
              <option key={ev} value={ev}>
                {ev}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Album Type">
          <select
            className={inputClass}
            value={info.albumType}
            onChange={(e) =>
              patchInfo({ albumType: e.target.value as typeof info.albumType })
            }
          >
            {ALBUM_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Album Size">
          <select
            className={inputClass}
            value={info.albumSize}
            onChange={(e) =>
              patchInfo({ albumSize: e.target.value as typeof info.albumSize })
            }
          >
            {ALBUM_SIZES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
        {info.albumSize === 'custom' && (
          <Field label="Custom Size">
            <input
              className={inputClass}
              value={info.customSize ?? ''}
              onChange={(e) => patchInfo({ customSize: e.target.value })}
              placeholder="e.g. 11x14"
            />
          </Field>
        )}
        <Field label="Orientation">
          <div className="flex gap-2">
            {ORIENTATIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => patchInfo({ orientation: o.value })}
                className={`h-11 flex-1 rounded-xl border text-sm font-semibold transition-all ${
                  info.orientation === o.value
                    ? 'border-[#6B46FE] bg-[#F3EEFF] text-[#6B46FE]'
                    : 'border-[#EEF0F4] bg-white text-[#636E72] hover:bg-[#F8F9FB]'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </Field>
        <Field label={`Number of Pages (${info.pageCount})`}>
          <input
            type="range"
            min={MIN_PAGE_COUNT}
            max={MAX_PAGE_COUNT}
            value={info.pageCount}
            onChange={(e) => patchInfo({ pageCount: Number(e.target.value) })}
            className="w-full accent-[#6B46FE]"
          />
        </Field>
        <Field label="Cover Type">
          <div className="flex gap-2">
            {COVER_TYPES.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => patchInfo({ coverType: c.value })}
                className={`h-11 flex-1 rounded-xl border text-sm font-semibold transition-all ${
                  info.coverType === c.value
                    ? 'border-[#6B46FE] bg-[#F3EEFF] text-[#6B46FE]'
                    : 'border-[#EEF0F4] bg-white text-[#636E72] hover:bg-[#F8F9FB]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </Field>
      </div>
    </div>
  );
}
