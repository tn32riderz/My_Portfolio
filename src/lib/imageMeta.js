import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const cache = new Map(); // `${src}:${mtimeMs}` -> meta | null

/**
 * Intrinsic size + tiny blur placeholder for a local image (anything under /public).
 * Giving next/image the real dimensions reserves the exact space (no layout jump) and the
 * blur shows instantly while the sharp version loads. Remote URLs return null.
 */
export async function getImageMeta(src) {
  if (typeof src !== 'string' || !/^\/(?!\/)/.test(src)) return null;
  const file = path.join(PUBLIC_DIR, decodeURIComponent(src.split('?')[0]));
  if (!file.startsWith(PUBLIC_DIR + path.sep)) return null; // no path traversal

  try {
    const { mtimeMs } = await fs.stat(file);
    const key = `${src}:${mtimeMs}`;
    if (cache.has(key)) return cache.get(key);

    const image = sharp(file, { limitInputPixels: false });
    const { width, height, orientation } = await image.metadata();
    const swap = orientation && orientation >= 5; // rotated 90° by EXIF
    const meta = { width: swap ? height : width, height: swap ? width : height };
    if (!/\.svg$/i.test(file)) {
      const tiny = await image.rotate().resize({ width: 16 }).blur(1).jpeg({ quality: 40 }).toBuffer();
      meta.blur = `data:image/jpeg;base64,${tiny.toString('base64')}`;
    }
    cache.set(key, meta);
    return meta;
  } catch {
    return null;
  }
}

/** { [src]: meta } for every distinct local image in the list. */
export async function getImageMetaMap(sources) {
  const unique = [...new Set(sources.filter(Boolean))];
  const entries = await Promise.all(unique.map(async (src) => [src, await getImageMeta(src)]));
  return Object.fromEntries(entries.filter(([, meta]) => meta));
}

/** Every image used by a project: cover + all image-block images. */
export const projectImageSources = (project) => [
  project.coverImage,
  ...(project.contentBlocks || []).flatMap((b) => (b.type === 'Image' ? b.images || [] : [])),
];
