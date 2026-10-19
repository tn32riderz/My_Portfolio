// Pure helpers (safe for client and server) for the project/case-study model.

export const BLOCK_TYPES = ['Heading', 'Paragraph', 'Image', 'Metrics'];

export const slugify = (text) =>
  String(text || '').toLowerCase().trim().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export const newId = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e5)}`;

export function emptyBlock(type) {
  const base = { id: newId('blk'), type, content: '', settings: { alignment: 'left' } };
  if (type === 'Image') return { ...base, settings: { layout: 'stack', columns: 2, gap: 16, radius: 12 }, images: [] };
  if (type === 'Metrics') return { ...base, metrics: [{ label: '', value: '' }] };
  return base;
}

export function emptyProject() {
  return {
    id: newId('cs'), title: 'Untitled project', slug: '', company: '', category: '', timelines: '',
    liveViewUrl: '', serviceProvided: [], coverImage: '', status: 'Draft', appreciations: 0, views: 0,
    seoTitle: '', seoDescription: '', createdAt: new Date().toISOString(), contentBlocks: [],
  };
}

/** Accepts db case studies and the legacy demo shape (images[] + overview) and returns one render model. */
export function normalizeProject(p) {
  const blocks = Array.isArray(p.contentBlocks) && p.contentBlocks.length
    ? p.contentBlocks
    : [
        ...(p.overview ? [{ id: 'o', type: 'Paragraph', content: p.overview, settings: {} }] : []),
        ...(p.images?.length ? [{ id: 'i', type: 'Image', images: p.images, settings: {} }] : []),
      ];
  return {
    ...p,
    serviceProvided: p.serviceProvided || [],
    appreciations: Number(p.appreciations) || 0,
    views: Number(p.views) || 0,
    contentBlocks: blocks,
  };
}

/** Normalizes a pasted link to an http(s) URL ("example.com" -> "https://example.com"); null if unusable. */
export function safeHttpUrl(input) {
  const raw = String(input ?? '').trim();
  if (!raw) return null;
  try {
    const url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`);
    return /^https?:$/.test(url.protocol) && url.hostname.includes('.') ? url.href : null;
  } catch { return null; }
}

export const formatCount = (n) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n));

export const IMAGE_LAYOUTS = [
  { value: 'stack', label: 'One by one' },
  { value: 'grid', label: 'Grid' },
  { value: 'bento', label: 'Bento' },
];

const clamp = (n, min, max, fallback) => (Number.isFinite(Number(n)) ? Math.min(max, Math.max(min, Number(n))) : fallback);

/** Image block layout settings with defaults. Legacy blocks (no layout) stay flush, one by one. */
export function imageSettings(block) {
  const s = block.settings || {};
  return {
    layout: IMAGE_LAYOUTS.some((l) => l.value === s.layout) ? s.layout : 'stack',
    columns: clamp(s.columns, 2, 4, 2),
    gap: clamp(s.gap, 0, 64, 0),
    radius: clamp(s.radius, 0, 48, 0),
  };
}
