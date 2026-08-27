const longDate = new Intl.DateTimeFormat('es-PR', { dateStyle: 'long', timeZone: 'America/Puerto_Rico' });
const fullDate = new Intl.DateTimeFormat('es-PR', { dateStyle: 'full', timeZone: 'America/Puerto_Rico' });
const time = new Intl.DateTimeFormat('es-PR', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Puerto_Rico' });

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : longDate.format(d);
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : time.format(d);
}

export function formatToday(now: Date = new Date()): string {
  const s = fullDate.format(now);
  return s.charAt(0).toUpperCase() + s.slice(1);
}
