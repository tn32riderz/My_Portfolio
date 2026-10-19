'use client';

import { useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, GripVertical, Plus, Trash2, X } from 'lucide-react';
import {
  DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  SortableContext, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BLOCK_TYPES, IMAGE_LAYOUTS, emptyBlock, imageSettings } from '@/lib/projectUtils';
import { SelectField, TextArea, TextField, UploadButton } from './fields';

function useDragSensors() {
  return useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
}

function AddUrl({ onAdd }) {
  const [url, setUrl] = useState('');
  const add = () => { if (url.trim()) { onAdd(url.trim()); setUrl(''); } };
  return (
    <span className="ad-row">
      <input className="ad-input" placeholder="…or paste image URL" aria-label="Image URL" value={url}
        onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }} />
      <button type="button" className="ad-btn ad-btn--ghost" onClick={add}>Add</button>
    </span>
  );
}

function Slider({ label, value, min, max, onChange, unit = 'px' }) {
  return (
    <label className="ad-field">
      <span className="ad-label">{label}: <strong>{value}{unit}</strong></span>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

function SortableThumb({ id, src, index, total, onMove, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div ref={setNodeRef} className={`ad-images__item${isDragging ? ' is-dragging' : ''}`}
      style={{ transform: CSS.Transform.toString(transform), transition }}>
      <div className="ad-images__drag" {...attributes} {...listeners} aria-label={`Image ${index + 1} of ${total}. Drag to reorder`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" draggable={false} />
      </div>
      <span className="ad-images__tools">
        <button type="button" className="ad-icon" disabled={index === 0} aria-label={`Move image ${index + 1} earlier`} onClick={() => onMove(-1)}><ArrowLeft size={13} /></button>
        <button type="button" className="ad-icon" disabled={index === total - 1} aria-label={`Move image ${index + 1} later`} onClick={() => onMove(1)}><ArrowRight size={13} /></button>
        <button type="button" className="ad-icon ad-icon--danger" aria-label={`Remove image ${index + 1}`} onClick={onRemove}><X size={13} /></button>
      </span>
    </div>
  );
}

function ImageBlockFields({ block, set }) {
  const sensors = useDragSensors();
  const cfg = imageSettings(block);
  const images = block.images || [];
  const setSetting = (patch) => set({ settings: { ...block.settings, ...cfg, ...patch } });
  const move = (i, dir) => {
    const next = [...images];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    set({ images: next });
  };
  const pad = cfg.gap > 0 || cfg.radius > 0 ? Math.max(cfg.gap, 16) : 0;

  return (
    <div className="ad-imgblock">
      <div className="ad-seg" role="group" aria-label="Image layout">
        {IMAGE_LAYOUTS.map((l) => (
          <button key={l.value} type="button" aria-pressed={cfg.layout === l.value}
            className={cfg.layout === l.value ? 'is-active' : ''} onClick={() => setSetting({ layout: l.value })}>{l.label}</button>
        ))}
      </div>
      <div className="ad-grid">
        {cfg.layout === 'grid' && <Slider label="Columns" value={cfg.columns} min={2} max={4} unit="" onChange={(v) => setSetting({ columns: v })} />}
        <Slider label="Gap between images" value={cfg.gap} min={0} max={64} onChange={(v) => setSetting({ gap: v })} />
        <Slider label="Corner radius" value={cfg.radius} min={0} max={48} onChange={(v) => setSetting({ radius: v })} />
      </div>

      <div className="ad-images">
        {/* Positional ids: the same URL may appear twice, and the list is re-rendered after every drop. */}
        <DndContext id={`images-${block.id}`} sensors={sensors} collisionDetection={closestCenter}
          onDragEnd={({ active, over }) => {
            if (!over || active.id === over.id) return;
            const from = Number(String(active.id).slice(4)), to = Number(String(over.id).slice(4));
            set({ images: arrayMove(images, from, to) });
          }}>
          <SortableContext items={images.map((_, i) => `img-${i}`)} strategy={rectSortingStrategy}>
            {images.map((src, i) => (
              <SortableThumb key={i} id={`img-${i}`} src={src} index={i} total={images.length}
                onMove={(d) => move(i, d)} onRemove={() => set({ images: images.filter((_, j) => j !== i) })} />
            ))}
          </SortableContext>
        </DndContext>
        <UploadButton label="Add images" multiple onUploaded={(results) => set({ images: [...images, ...results.map((r) => r.url)] })} />
        <AddUrl onAdd={(url) => set({ images: [...images, url] })} />
      </div>

      {images.length > 0 && (
        <div>
          <p className="ad-label">Live preview</p>
          <div className={`ad-prev ad-prev--${cfg.layout}`}
            style={{ '--gap': `${cfg.gap}px`, '--radius': `${cfg.radius}px`, '--cols': cfg.columns, padding: pad }}>
            {images.map((src, i) => (
              <div key={`${src}-${i}`} className="ad-prev__img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BlockEditor({ block, index, total, onChange, onMove, onRemove }) {
  const set = (patch) => onChange({ ...block, ...patch });
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  return (
    <li ref={setNodeRef} className={`ad-block${isDragging ? ' is-dragging' : ''}`}
      style={{ transform: CSS.Translate.toString(transform), transition }}>
      <div className="ad-block__bar">
        <span className="ad-row">
          <button type="button" ref={setActivatorNodeRef} className="ad-icon ad-grip" {...attributes} {...listeners}
            aria-label={`Drag block ${index + 1} (${block.type}) to reorder. With the keyboard press Space, then the arrow keys.`}>
            <GripVertical size={16} />
          </button>
          <strong>{index + 1}. {block.type}</strong>
        </span>
        <span className="ad-row">
          <button type="button" className="ad-icon" onClick={() => onMove(-1)} disabled={index === 0} aria-label="Move block up"><ArrowUp size={16} /></button>
          <button type="button" className="ad-icon" onClick={() => onMove(1)} disabled={index === total - 1} aria-label="Move block down"><ArrowDown size={16} /></button>
          <button type="button" className="ad-icon ad-icon--danger" onClick={onRemove} aria-label="Delete block"><Trash2 size={16} /></button>
        </span>
      </div>

      {(block.type === 'Heading' || block.type === 'Paragraph') && (
        <>
          {block.type === 'Heading'
            ? <TextField label="Heading" value={block.content} onChange={(v) => set({ content: v })} />
            : <TextArea label="Text" rows={6} value={block.content} onChange={(v) => set({ content: v })} />}
          <SelectField label="Alignment" value={block.settings?.alignment || 'left'}
            options={['left', 'center', 'right']} onChange={(v) => set({ settings: { ...block.settings, alignment: v } })} />
        </>
      )}

      {block.type === 'Image' && <ImageBlockFields block={block} set={set} />}

      {block.type === 'Metrics' && (
        <div className="ad-metrics">
          {(block.metrics || []).map((m, i) => (
            <div key={i} className="ad-row">
              <input className="ad-input" aria-label="Metric label" placeholder="Label" value={m.label}
                onChange={(e) => set({ metrics: block.metrics.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })} />
              <input className="ad-input" aria-label="Metric value" placeholder="Value" value={m.value}
                onChange={(e) => set({ metrics: block.metrics.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)) })} />
              <button type="button" className="ad-icon ad-icon--danger" aria-label="Remove metric"
                onClick={() => set({ metrics: block.metrics.filter((_, j) => j !== i) })}><X size={14} /></button>
            </div>
          ))}
          <button type="button" className="ad-btn ad-btn--ghost" onClick={() => set({ metrics: [...(block.metrics || []), { label: '', value: '' }] })}>
            <Plus size={14} /> Add metric
          </button>
        </div>
      )}
    </li>
  );
}

export default function BlocksEditor({ blocks, onChange }) {
  const sensors = useDragSensors();
  const move = (i, dir) => {
    const next = [...blocks];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    onChange(next);
  };
  return (
    <>
      {blocks.length === 0 && <p className="ad-hint">No content yet. Add a block below.</p>}
      <DndContext id="content-blocks" sensors={sensors} collisionDetection={closestCenter}
        onDragEnd={({ active, over }) => {
          if (!over || active.id === over.id) return;
          onChange(arrayMove(blocks, blocks.findIndex((x) => x.id === active.id), blocks.findIndex((x) => x.id === over.id)));
        }}>
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <ol className="ad-blocks">
            {blocks.map((b, i) => (
              <BlockEditor key={b.id} block={b} index={i} total={blocks.length}
                onChange={(nb) => onChange(blocks.map((x) => (x.id === b.id ? nb : x)))}
                onMove={(d) => move(i, d)} onRemove={() => onChange(blocks.filter((x) => x.id !== b.id))} />
            ))}
          </ol>
        </SortableContext>
      </DndContext>
      <div className="ad-row ad-row--wrap">
        {BLOCK_TYPES.map((t) => (
          <button key={t} type="button" className="ad-btn ad-btn--ghost" onClick={() => onChange([...blocks, emptyBlock(t)])}>
            <Plus size={14} /> {t}
          </button>
        ))}
      </div>
    </>
  );
}
