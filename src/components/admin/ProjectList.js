'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  DndContext, DragOverlay, KeyboardSensor, PointerSensor, pointerWithin, rectIntersection, useDraggable, useDroppable,
  useSensor, useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, Copy, ExternalLink, GripVertical, Home, Pencil, Plus, Trash2, X } from 'lucide-react';
import { emptyProject, newId } from '@/lib/projectUtils';
import { useAdmin } from './AdminContext';

const isLive = (p) => p.status === 'Published' || p.status === 'Active';
const BOX = 'highlight-box';

/** Drop onto a row to insert at that position; otherwise onto the box to append. */
function collision(args) {
  const hits = pointerWithin(args);
  const rows = hits.filter((h) => String(h.id).startsWith('hl:'));
  if (rows.length) return rows;
  return hits.length ? hits : rectIntersection(args);
}

function Cover({ project }) {
  return project.coverImage /* eslint-disable-next-line @next/next/no-img-element */
    ? <img src={project.coverImage} alt="" />
    : <span>{(project.title || '?').slice(0, 1)}</span>;
}

/* ── a case study in the library: drag it into the highlight box ── */
function LibraryCard({ project, onHome, onToggleHome, onDuplicate, onRemove, disabled }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, isDragging } = useDraggable({ id: `lib:${project.id}`, disabled: onHome });
  return (
    <li ref={setNodeRef} className={`ad-case${isDragging ? ' is-dragging' : ''}`}>
      <Link href={`/admin/projects/${project.id}`} className="ad-case__cover" aria-label={`Edit ${project.title}`}><Cover project={project} /></Link>
      <div className="ad-case__body">
        <div className="ad-row">
          <strong className="ad-case__title">{project.title || 'Untitled'}</strong>
          <small className={`ad-badge ad-badge--${isLive(project) ? 'live' : 'draft'}`}>{project.status}</small>
          {onHome && <small className="ad-badge ad-badge--feat">On home</small>}
        </div>
        <p className="ad-hint">{[project.company, project.category].filter(Boolean).join(' · ') || 'No details yet'}</p>
        <p className="ad-hint">/works/{project.slug} · {(project.contentBlocks || []).length} blocks</p>
        <div className="ad-actions ad-actions--start">
          <Link className="ad-btn" href={`/admin/projects/${project.id}`}><Pencil size={15} /> Edit</Link>
          <button type="button" className={`ad-btn ${onHome ? 'ad-btn--ghost' : ''}`} onClick={onToggleHome}>
            {onHome ? <><X size={15} /> Remove from home</> : <><Home size={15} /> Add to home</>}
          </button>
          <Link className="ad-btn ad-btn--ghost" href={`/works/${project.slug}`} target="_blank"><ExternalLink size={15} /> View</Link>
          <button type="button" className="ad-btn ad-btn--ghost" onClick={onDuplicate} disabled={disabled}><Copy size={15} /> Duplicate</button>
          <button type="button" className="ad-btn ad-btn--danger" onClick={onRemove} disabled={disabled}><Trash2 size={15} /> Delete</button>
        </div>
      </div>
      {!onHome && (
        <button type="button" ref={setActivatorNodeRef} className="ad-icon ad-grip ad-case__grip" {...attributes} {...listeners}
          aria-label={`Drag ${project.title} into the home page highlights`}><GripVertical size={16} /></button>
      )}
    </li>
  );
}

/* ── a row inside the highlight box: drag to change its position ── */
function HighlightRow({ project, index, onRemove }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: `hl:${project.id}` });
  return (
    <li ref={setNodeRef} className={`ad-hl__row${isDragging ? ' is-dragging' : ''}`} style={{ transform: CSS.Translate.toString(transform), transition }}>
      <button type="button" ref={setActivatorNodeRef} className="ad-icon ad-grip" {...attributes} {...listeners}
        aria-label={`Position ${index + 1}: ${project.title}. Drag to change position. With the keyboard press Space, then the arrow keys.`}><GripVertical size={16} /></button>
      <span className="ad-hl__n">{index + 1}</span>
      <span className="ad-hl__thumb"><Cover project={project} /></span>
      <span className="ad-hl__text">
        <strong>{project.title || 'Untitled'}</strong>
        {!isLive(project) && <small>Draft: publish it to show on the home page</small>}
      </span>
      <button type="button" className="ad-icon ad-icon--danger" onClick={onRemove} aria-label={`Remove ${project.title} from the home page`}><X size={15} /></button>
    </li>
  );
}

function HighlightBox({ rows, save, onRemove }) {
  const { setNodeRef, isOver } = useDroppable({ id: BOX });
  return (
    <aside className="ad-hl" aria-label="Home page highlights">
      <div className="ad-hl__head">
        <h2>Home page highlights</h2>
        <span className={`ad-hl__status is-${save.state}`} role="status" aria-live="polite">
          {save.state === 'saving' ? 'Saving…' : save.state === 'saved' ? <><Check size={14} /> Live on home page</> : save.state === 'error' ? save.message : ''}
        </span>
      </div>
      <p className="ad-hint">Drag case studies here. They show on the home page in this order, and every change saves instantly. Drag a row up or down to change its position.</p>

      <div ref={setNodeRef} className={`ad-hl__zone${isOver ? ' is-over' : ''}${rows.length ? '' : ' is-empty'}`}>
        <SortableContext items={rows.map((p) => `hl:${p.id}`)} strategy={verticalListSortingStrategy}>
          <ol className="ad-hl__list">
            {rows.map((p, i) => <HighlightRow key={p.id} project={p} index={i} onRemove={() => onRemove(p.id)} />)}
          </ol>
        </SortableContext>
        {!rows.length && <p className="ad-hl__empty">Drop a case study here.<br />With none, the home page hides its Projects section.</p>}
      </div>

      <Link className="ad-btn ad-btn--ghost" href="/#projects" target="_blank"><ExternalLink size={15} /> View on home page</Link>
    </aside>
  );
}

export default function ProjectList({ items, homeIds = [] }) {
  const router = useRouter();
  const { request, saveHighlights, editingEnabled } = useAdmin();
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [ids, setIds] = useState(homeIds);
  const [save, setSave] = useState({ state: 'idle' });
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const byId = useMemo(() => new Map(items.map((p) => [p.id, p])), [items]);
  const rows = ids.map((id) => byId.get(id)).filter(Boolean);
  const rowIds = rows.map((p) => p.id);

  /** Optimistic: update the box at once, save in the background, roll back if the server refuses. */
  const commit = async (next) => {
    const previous = rowIds;
    setIds(next);
    setSave({ state: 'saving' });
    try {
      await saveHighlights(next);
      setSave({ state: 'saved' });
    } catch (err) {
      setIds(previous);
      setSave({ state: 'error', message: err.message });
    }
  };

  const onDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over) return;
    const a = String(active.id), o = String(over.id);
    if (a.startsWith('lib:')) {
      const id = a.slice(4);
      if (rowIds.includes(id)) return;
      const at = o.startsWith('hl:') ? rowIds.indexOf(o.slice(3)) : rowIds.length;
      commit([...rowIds.slice(0, at), id, ...rowIds.slice(at)]);
    } else if (a.startsWith('hl:') && o.startsWith('hl:') && a !== o) {
      commit(arrayMove(rowIds, rowIds.indexOf(a.slice(3)), rowIds.indexOf(o.slice(3))));
    }
  };

  const toggleHome = (id) => commit(rowIds.includes(id) ? rowIds.filter((x) => x !== id) : [...rowIds, id]);

  const uniqueSlug = (base) => {
    let slug = base || 'project', n = 2;
    while (items.some((p) => p.slug === slug)) slug = `${base}-${n++}`;
    return slug;
  };

  const run = async (action) => {
    setBusy(true); setError('');
    try { await action(); } catch (err) { setError(err.message); }
    setBusy(false);
  };

  const create = () => run(async () => {
    const project = { ...emptyProject(), slug: uniqueSlug('untitled-project') };
    await request('PATCH', { collection: 'caseStudies', item: project });
    router.push(`/admin/projects/${project.id}`);
  });

  const duplicate = (p) => run(async () => {
    const copy = { ...structuredClone(p), id: newId('cs'), title: `${p.title} (Copy)`, slug: uniqueSlug(`${p.slug}-copy`),
      status: 'Draft', createdAt: new Date().toISOString() };
    await request('PATCH', { collection: 'caseStudies', item: copy });
    router.push(`/admin/projects/${copy.id}`);
  });

  const remove = (p) => {
    if (!window.confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    run(async () => {
      await request('DELETE', { collection: 'caseStudies', id: p.id });
      setIds((list) => list.filter((x) => x !== p.id));
      router.refresh();
    });
  };

  const shown = items.filter((p) => !search || `${p.title} ${p.company} ${p.category}`.toLowerCase().includes(search.toLowerCase()));
  const active = activeId ? byId.get(String(activeId).replace(/^(lib|hl):/, '')) : null;

  return (
    <DndContext id="home-highlights" sensors={sensors} collisionDetection={collision} onDragStart={({ active: a }) => setActiveId(a.id)}
      onDragCancel={() => setActiveId(null)} onDragEnd={onDragEnd}>
      <section className="ad-projects" aria-label="Case studies">
        <div className="ad-projects__layout">
          <div className="ad-projects__main">
            <div className="ad-row ad-projects__bar">
              <input className="ad-input" type="search" placeholder="Search case studies" aria-label="Search case studies"
                value={search} onChange={(e) => setSearch(e.target.value)} />
              <button type="button" className="ad-btn" onClick={create} disabled={!editingEnabled || busy}><Plus size={16} /> New case study</button>
            </div>
            {error && <p className="ad-banner ad-banner--error" role="alert">{error}</p>}

            <ul className="ad-cards">
              {shown.map((p) => (
                <LibraryCard key={p.id} project={p} onHome={rowIds.includes(p.id)} onToggleHome={() => toggleHome(p.id)}
                  onDuplicate={() => duplicate(p)} onRemove={() => remove(p)} disabled={!editingEnabled || busy} />
              ))}
            </ul>
            {!shown.length && <p className="ad-hint ad-empty">{items.length ? 'No case studies match your search.' : 'No case studies yet. Create your first one.'}</p>}
          </div>

          <HighlightBox rows={rows} save={save} onRemove={(id) => toggleHome(id)} />
        </div>
      </section>

      <DragOverlay dropAnimation={null}>
        {active && (
          <div className="ad-hl__row ad-hl__overlay">
            <span className="ad-hl__thumb"><Cover project={active} /></span>
            <span className="ad-hl__text"><strong>{active.title || 'Untitled'}</strong></span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
