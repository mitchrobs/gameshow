/**
 * Local-timezone "today" as ISO YYYY-MM-DD.
 *
 * NOT `new Date().toISOString().slice(0, 10)` — that returns UTC, which
 * disagrees with `date.today()` in Python (local time) at the boundary
 * between local and UTC days. The studio drives scripts/generate_moji.py
 * which writes into `tmp/moji-mash/<local-date>/`; if the studio computes
 * a different date the contact-sheet parser reads the wrong directory and
 * fails with "no variants parsed".
 */
export function todayLocalISO(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
