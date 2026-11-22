import { escapeHtml } from './utils';

/** Builds a gradient SVG cover as a data URL so mocks work offline. */
export function makeCover(title: string, [from, to]: [string, string]): string {
  const initials = title
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>
<rect width="640" height="360" fill="url(#g)"/>
<circle cx="560" cy="60" r="140" fill="#fff" fill-opacity=".08"/>
<circle cx="80" cy="340" r="110" fill="#fff" fill-opacity=".06"/>
<text x="40" y="300" font-family="Inter,system-ui,sans-serif" font-size="120" font-weight="700" fill="#fff" fill-opacity=".9">${escapeHtml(initials)}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const COVER_PALETTES: [string, string][] = [
  ['#6366f1', '#312e81'],
  ['#14b8a6', '#134e4a'],
  ['#ec4899', '#831843'],
  ['#f97316', '#7c2d12'],
  ['#8b5cf6', '#4c1d95'],
];
