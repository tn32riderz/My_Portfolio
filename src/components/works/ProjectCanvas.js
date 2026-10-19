'use client';

import Image from 'next/image';
import { imageSettings, safeHttpUrl } from '@/lib/projectUtils';
import Button from '@/components/ui/Button';
import './works.css';

/** Half-typed URLs in the editor must not crash next/image: accept only site paths and http(s) URLs. */
const validSrc = (src) => {
  if (typeof src !== 'string') return false;
  if (/^\/(?!\/)/.test(src)) return true;
  try { return /^https?:$/.test(new URL(src).protocol); } catch { return false; }
};

function Block({ block, title, meta, preloadFirst }) {
  const align = block.settings?.alignment || 'left';
  switch (block.type) {
    case 'Heading':
      return <h2 className="bh-block bh-block--text bh-heading" style={{ textAlign: align }}>{block.content}</h2>;
    case 'Paragraph':
      return <p className="bh-block bh-block--text bh-para" style={{ textAlign: align }}>{block.content}</p>;
    case 'Image': {
      const { layout, columns, gap, radius } = imageSettings(block);
      const pad = gap > 0 || radius > 0 ? Math.max(gap, 16) : 0;
      return (
        <div className={`bh-block bh-imgs bh-imgs--${layout}`}
          style={{ '--gap': `${gap}px`, '--radius': `${radius}px`, '--cols': columns, padding: pad }}>
          {(block.images || []).filter(validSrc).map((src, i) => {
            const m = meta?.[src];
            return (
            <div key={`${src}-${i}`} className="bh-img">
              {/* Natural height, full width of its cell: images are never cropped. */}
              <Image src={src} alt={`${title} — image ${i + 1}`} width={m?.width || 1600} height={m?.height || 1000}
                sizes={layout === 'stack' ? '(max-width:1400px) 100vw, 1400px' : '(max-width:900px) 100vw, 700px'}
                priority={preloadFirst && i === 0}
                placeholder={m?.blur ? 'blur' : 'empty'} blurDataURL={m?.blur}
                style={{ width: '100%', height: 'auto' }} />
            </div>
            );
          })}
        </div>
      );
    }
    case 'Metrics':
      return (
        <dl className="bh-block bh-block--text bh-metrics">
          {(block.metrics || []).filter((m) => m.label || m.value).map((m, i) => (
            <div key={i}><dt>{m.label}</dt><dd>{m.value}</dd></div>
          ))}
        </dl>
      );
    default:
      return null;
  }
}

/** Title, client, tags. Shared by the public project page and the editor's live preview. */
export function ProjectHead({ project }) {
  const liveUrl = safeHttpUrl(project.liveViewUrl);
  return (
    <div className="bh-detail__head">
      <h1>{project.title}</h1>
      <p className="bh-detail__by">
        {project.company && <strong>{project.company}</strong>}
        {project.category && <span>{project.category}</span>}
        {project.timelines && <span>{project.timelines}</span>}
      </p>
      {(project.serviceProvided || []).length > 0 && (
        <ul className="bh-tags">{project.serviceProvided.map((s) => <li key={s}>{s}</li>)}</ul>
      )}
      {liveUrl && (
        <div className="bh-detail__live">
          <Button text="Live preview" href={liveUrl} external />
        </div>
      )}
    </div>
  );
}

/** Cover image first (uncropped, full width), then the content blocks. */
export function ProjectCanvas({ project, priority = false, meta }) {
  const blocks = project.contentBlocks || [];
  // Don't repeat the cover when the first image block already starts with it.
  const firstImageBlock = blocks.find((b) => b.type === 'Image');
  const firstImage = firstImageBlock?.images?.[0];
  const firstImageBlockId = firstImageBlock?.id;
  const showCover = validSrc(project.coverImage) && project.coverImage !== firstImage;
  return (
    <div className="bh-canvas">
      {showCover && (
        <Image src={project.coverImage} alt={`${project.title} cover`}
          width={meta?.[project.coverImage]?.width || 1600} height={meta?.[project.coverImage]?.height || 1000}
          sizes="(max-width:1400px) 100vw, 1400px" priority={priority}
          placeholder={meta?.[project.coverImage]?.blur ? 'blur' : 'empty'} blurDataURL={meta?.[project.coverImage]?.blur}
          style={{ width: '100%', height: 'auto' }} className="bh-block" />
      )}
      {blocks.map((b) => <Block key={b.id} block={b} title={project.title} meta={meta} preloadFirst={priority && !showCover && b.id === firstImageBlockId} />)}
    </div>
  );
}
