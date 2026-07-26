import type { EventTimelineDay, EventTimelineStats, EventStatus, TimelineSlot } from '../types';
import { formatTimeRange } from './format';

const ICON_COLORS: Record<string, { bg: string; fg: string }> = {
  sparkles: { bg: '#FCE7F3', fg: '#DB2777' },
  camera: { bg: '#E0E7FF', fg: '#4F46E5' },
  sun: { bg: '#FEF3C7', fg: '#D97706' },
  users: { bg: '#DBEAFE', fg: '#2563EB' },
  utensils: { bg: '#D1FAE5', fg: '#059669' },
  hand: { bg: '#FCE7F3', fg: '#BE185D' },
  music: { bg: '#EDE9FE', fg: '#7C3AED' },
  party: { bg: '#CFFAFE', fg: '#0891B2' },
  heart: { bg: '#FEE2E2', fg: '#DC2626' },
  flower: { bg: '#FCE7F3', fg: '#EC4899' },
  circle: { bg: '#E0E7FF', fg: '#6366F1' },
  check: { bg: '#D1FAE5', fg: '#16A34A' },
};

function esc(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function statusBadge(status: EventStatus): string {
  if (status === 'completed') {
    return `<span class="badge badge-done">✓ Completed</span>`;
  }
  if (status === 'live') {
    return `<span class="badge badge-live"><span class="dot"></span> Live</span>`;
  }
  if (status === 'upcoming') {
    return `<span class="badge badge-upcoming">Upcoming</span>`;
  }
  if (status === 'delayed') {
    return `<span class="badge badge-delayed">Delayed</span>`;
  }
  return `<span class="badge badge-cancelled">Cancelled</span>`;
}

function eventIcon(slot: TimelineSlot): string {
  const c = ICON_COLORS[slot.icon] || { bg: '#F3EEFF', fg: '#6B46FE' };
  const letter = slot.title.charAt(0).toUpperCase();
  return `<span class="ev-icon" style="background:${c.bg};color:${c.fg}">${letter}</span>`;
}

function rowHtml(slot: TimelineSlot, index: number): string {
  const note = esc(slot.notes || slot.description || '—');
  const venue = esc(slot.venue);
  const title = esc(slot.title);
  const time = esc(formatTimeRange(slot.startTime, slot.endTime));
  const sub = esc(slot.venue.split('·')[0]?.trim() || '');

  return `
    <tr class="${index % 2 === 0 ? 'row-even' : 'row-odd'}">
      <td class="col-num"><span class="num">${index + 1}</span></td>
      <td class="col-time">${time}</td>
      <td class="col-event">
        <div class="event-cell">
          ${eventIcon(slot)}
          <div>
            <div class="event-title">${title}</div>
            <div class="event-sub">${sub}</div>
          </div>
        </div>
      </td>
      <td class="col-loc"><span class="pin">📍</span> ${venue}</td>
      <td class="col-status">${statusBadge(slot.status)}</td>
      <td class="col-notes">${note}</td>
    </tr>
  `;
}

export function buildTimelinePrintHtml(
  day: EventTimelineDay,
  stats: EventTimelineStats,
): string {
  const lead =
    day.team.find((t) => t.role === 'lead') ||
    day.team.find((t) => t.role === 'photographer') ||
    day.team[0];
  const studio = lead ? `${esc(lead.name)} Photography` : 'ShootHub Photography';
  const cover = day.coverImage;
  const photosLabel = `${(stats.photosCaptured || 1250).toLocaleString()}+`;

  const rows = day.slots.map((s, i) => rowHtml(s, i)).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Event Timeline — ${esc(day.coupleLine)}</title>
<style>
  @page { size: A4; margin: 14mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Plus Jakarta Sans', 'Segoe UI', system-ui, -apple-system, sans-serif;
    color: #1e1b4b;
    background: #fff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page { max-width: 920px; margin: 0 auto; padding: 8px 4px 24px; }
  .topbar { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 18px; }
  .topbar h1 { font-size: 28px; font-weight: 800; color: #2e1065; letter-spacing: -0.02em; }
  .topbar p { margin-top: 4px; font-size: 13px; color: #94a3b8; }
  .actions { display: none; gap: 8px; }
  .hero {
    position: relative;
    overflow: hidden;
    border-radius: 22px;
    border: 1px solid #e9e2ff;
    background: linear-gradient(135deg, #f7f3ff 0%, #eef2ff 55%, #f5f3ff 100%);
    padding: 22px 24px;
    margin-bottom: 18px;
  }
  .hero::before, .hero::after {
    content: '';
    position: absolute;
    width: 120px; height: 120px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%);
    pointer-events: none;
  }
  .hero::before { top: -40px; left: -30px; }
  .hero::after { top: -20px; right: -20px; }
  .hero-inner { position: relative; z-index: 1; display: flex; gap: 20px; align-items: center; justify-content: space-between; flex-wrap: wrap; }
  .profile { display: flex; gap: 14px; align-items: center; min-width: 240px; }
  .avatar {
    width: 64px; height: 64px; border-radius: 50%;
    object-fit: cover; border: 3px solid #fff;
    box-shadow: 0 8px 24px rgba(107,70,254,0.2);
  }
  .names { font-size: 22px; font-weight: 800; color: #6B46FE; }
  .heart { color: #6B46FE; }
  .subtitle { margin-top: 2px; font-size: 13px; color: #64748b; font-weight: 500; }
  .meta { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 10px 14px; font-size: 12px; color: #64748b; }
  .meta span { display: inline-flex; align-items: center; gap: 5px; }
  .overview {
    display: grid; grid-template-columns: repeat(4, minmax(72px, 1fr));
    gap: 10px; background: #fff; border: 1px solid #ebe4ff;
    border-radius: 16px; padding: 12px 14px; min-width: 280px;
    box-shadow: 0 6px 20px rgba(107,70,254,0.06);
  }
  .stat { text-align: center; }
  .stat-icon {
    width: 28px; height: 28px; margin: 0 auto 4px;
    border-radius: 8px; display: flex; align-items: center; justify-content: center;
    font-size: 13px;
  }
  .stat-val { font-size: 16px; font-weight: 800; color: #1e1b4b; }
  .stat-lbl { font-size: 10px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.04em; }
  .ic-p { background: #F3EEFF; }
  .ic-g { background: #D1FAE5; }
  .ic-o { background: #FEF3C7; }
  .ic-b { background: #DBEAFE; }

  table.timeline {
    width: 100%; border-collapse: collapse;
    border-radius: 16px; overflow: hidden;
    border: 1px solid #ede9fe;
    box-shadow: 0 10px 30px rgba(107,70,254,0.08);
  }
  thead th {
    background: #6B46FE; color: #fff;
    font-size: 11px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.06em; text-align: left; padding: 12px 10px;
  }
  tbody td { padding: 11px 10px; font-size: 12px; vertical-align: middle; border-bottom: 1px solid #f1f5f9; }
  .row-even { background: #fff; }
  .row-odd { background: #faf9ff; }
  .num {
    display: inline-flex; width: 24px; height: 24px; align-items: center; justify-content: center;
    border-radius: 50%; background: #6B46FE; color: #fff; font-size: 11px; font-weight: 800;
  }
  .col-time { font-weight: 700; color: #0f172a; white-space: nowrap; }
  .event-cell { display: flex; align-items: center; gap: 10px; }
  .ev-icon {
    width: 30px; height: 30px; border-radius: 50%;
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 800; flex-shrink: 0;
  }
  .event-title { font-weight: 800; color: #0f172a; font-size: 12.5px; }
  .event-sub { font-size: 10.5px; color: #94a3b8; margin-top: 1px; }
  .col-loc { color: #475569; max-width: 160px; }
  .pin { font-size: 10px; opacity: 0.8; }
  .col-notes { color: #64748b; max-width: 180px; }
  .badge {
    display: inline-flex; align-items: center; gap: 5px;
    border-radius: 999px; padding: 4px 10px;
    font-size: 10px; font-weight: 700; white-space: nowrap;
  }
  .badge-done { background: #D1FAE5; color: #059669; }
  .badge-live { background: #DBEAFE; color: #2563EB; }
  .badge-upcoming { background: #FFFBEB; color: #D97706; border: 1px solid #FDE68A; }
  .badge-delayed { background: #FEF3C7; color: #B45309; }
  .badge-cancelled { background: #F1F5F9; color: #64748b; }
  .dot {
    width: 6px; height: 6px; border-radius: 50%; background: #2563EB;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.2);
  }

  .footer {
    margin-top: 22px; display: grid; grid-template-columns: 1.2fr 1fr 1.1fr;
    gap: 16px; align-items: start;
  }
  .thank h3 { font-size: 16px; font-weight: 800; color: #2e1065; }
  .thank p { margin-top: 6px; font-size: 12px; color: #64748b; line-height: 1.5; }
  .assist h4, .note h4 { font-size: 12px; font-weight: 800; color: #2e1065; margin-bottom: 6px; }
  .assist p { font-size: 12px; color: #64748b; margin-top: 4px; }
  .note {
    background: #F3EEFF; border: 1px solid #e9e2ff; border-radius: 14px;
    padding: 12px 14px;
  }
  .note p { font-size: 11.5px; color: #5b21b6; line-height: 1.45; }

  @media print {
    .actions { display: none !important; }
    .page { padding: 0; }
    body { background: #fff; }
  }
  @media screen {
    body { background: #f8fafc; padding: 24px 12px; }
    .page {
      background: #fff; border-radius: 20px; padding: 28px 24px;
      box-shadow: 0 20px 50px rgba(15,23,42,0.08);
    }
    .actions { display: flex; }
    .btn {
      display: inline-flex; align-items: center; gap: 6px;
      border-radius: 10px; padding: 8px 14px; font-size: 12px; font-weight: 700;
      cursor: pointer; border: 1px solid #e2e8f0; background: #fff; color: #334155;
    }
    .btn-primary { background: #6B46FE; border-color: #6B46FE; color: #fff; }
  }
</style>
</head>
<body>
  <div class="page">
    <div class="topbar">
      <div>
        <h1>Event Timeline</h1>
        <p>Your complete wedding day schedule</p>
      </div>
      <div class="actions">
        <button class="btn" onclick="window.print()">⬇ Download PDF</button>
        <button class="btn" onclick="window.print()">🖨 Print</button>
        <button class="btn btn-primary" onclick="navigator.clipboard.writeText(location.href).then(()=>alert('Link copied'))">↗ Share Timeline</button>
      </div>
    </div>

    <section class="hero">
      <div class="hero-inner">
        <div class="profile">
          <img class="avatar" src="${esc(cover)}" alt="${esc(day.coupleLine)}" />
          <div>
            <div class="names">${esc(day.coupleLine)} <span class="heart">💜</span></div>
            <div class="subtitle">${esc(day.eventName)}</div>
            <div class="meta">
              <span>📅 ${esc(day.eventDate)}</span>
              <span>📍 ${esc(day.location)}</span>
              <span>👤 ${studio}</span>
            </div>
          </div>
        </div>
        <div class="overview">
          <div class="stat">
            <div class="stat-icon ic-p">⏱</div>
            <div class="stat-val">${stats.totalEvents}</div>
            <div class="stat-lbl">Events</div>
          </div>
          <div class="stat">
            <div class="stat-icon ic-g">✓</div>
            <div class="stat-val">${stats.completed}</div>
            <div class="stat-lbl">Completed</div>
          </div>
          <div class="stat">
            <div class="stat-icon ic-o">⌛</div>
            <div class="stat-val">${stats.upcoming}</div>
            <div class="stat-lbl">Upcoming</div>
          </div>
          <div class="stat">
            <div class="stat-icon ic-b">📷</div>
            <div class="stat-val">${photosLabel}</div>
            <div class="stat-lbl">Photos</div>
          </div>
        </div>
      </div>
    </section>

    <table class="timeline">
      <thead>
        <tr>
          <th style="width:42px">#</th>
          <th style="width:150px">Time</th>
          <th>Event</th>
          <th style="width:160px">Location</th>
          <th style="width:110px">Status</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <footer class="footer">
      <div class="thank">
        <h3>Thank You!</h3>
        <p>We are honored to capture your beautiful moments. <span class="heart">💜</span></p>
      </div>
      <div class="assist">
        <h4>Need Assistance?</h4>
        <p>📞 +91 98765 43210</p>
        <p>✉️ hello@shoothub.com</p>
      </div>
      <div class="note">
        <h4>📅 Important Note</h4>
        <p>Timeline is subject to changes. We will keep you updated with any modifications.</p>
      </div>
    </footer>
  </div>
</body>
</html>`;
}

export function openTimelinePrintWindow(
  day: EventTimelineDay,
  stats: EventTimelineStats,
  autoPrint = false,
) {
  const html = buildTimelinePrintHtml(day, stats);
  const win = window.open('', '_blank', 'noopener,noreferrer,width=960,height=900');
  if (!win) return false;
  win.document.open();
  win.document.write(html);
  win.document.close();
  if (autoPrint) {
    win.focus();
    // wait for images
    window.setTimeout(() => {
      try {
        win.print();
      } catch {
        // ignore
      }
    }, 450);
  }
  return true;
}
