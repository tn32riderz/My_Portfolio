import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import path from 'path';
import os from 'os';
import sharp from 'sharp';
import { randomBytes } from 'crypto';
import { checkAdmin } from '@/lib/adminAuth';
import { scheduleAutoPush } from '@/lib/autoPush';

const TYPES = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif' };
const MAX_WIDTH = 2560; // wider than any screen layout needs; keeps files light without visible loss
const QUALITY = 88;

/**
 * POST multipart `file` -> { url }. No size limit.
 * Photos/PNGs are converted to WebP (max 2560px wide) so pages load fast; the untouched original is kept
 * next to it as <name>-original.<ext>. GIFs are stored as-is to keep their animation. SVG is rejected on purpose.
 */
export async function POST(request) {
  const denied = await checkAdmin(request);
  if (denied) return denied;

  const file = (await request.formData()).get('file');
  if (!file || typeof file === 'string') return Response.json({ error: 'No file received.' }, { status: 400 });
  const ext = TYPES[file.type];
  if (!ext) return Response.json({ error: 'Use a PNG, JPEG, WebP, GIF or AVIF image.' }, { status: 415 });

  const dir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(dir, { recursive: true });
  const base = `${Date.now()}-${randomBytes(4).toString('hex')}`;

  // Stream to disk first (no size limit, no second in-memory copy), then optimize from the file.
  const original = path.join(ext === 'gif' ? dir : os.tmpdir(), ext === 'gif' ? `${base}.gif` : `${base}-original.${ext}`);
  await pipeline(Readable.fromWeb(file.stream()), createWriteStream(original));
  if (ext === 'gif') { scheduleAutoPush(); return Response.json({ url: `/uploads/${base}.gif` }); }

  try {
    await sharp(original, { limitInputPixels: false })
      .rotate() // honour EXIF orientation before metadata is dropped
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(path.join(dir, `${base}.webp`));
    await fs.copyFile(original, path.join(dir, `${base}-original.${ext}`));
    scheduleAutoPush();
    return Response.json({ url: `/uploads/${base}.webp` });
  } catch {
    return Response.json({ error: 'That file could not be read as an image.' }, { status: 422 });
  } finally {
    await fs.rm(original, { force: true });
  }
}
