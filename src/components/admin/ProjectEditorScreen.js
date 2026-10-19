'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ExternalLink, Save } from 'lucide-react';
import { normalizeProject, safeHttpUrl, slugify } from '@/lib/projectUtils';
import { ProjectCanvas, ProjectHead } from '@/components/works/ProjectCanvas';
import { useAdmin } from './AdminContext';
import AdminBar from './AdminBar';
import BlocksEditor from './BlocksEditor';
import { ImageField, SelectField, TagsField, TextArea, TextField } from './fields';

/** Paste a link: it is cleaned up on blur, and an "Open live site" button appears as soon as it is valid. */
function LiveUrlField({ value, onChange }) {
  const url = safeHttpUrl(value);
  return (
    <div className="ad-field">
      <label className="ad-label" htmlFor="live-url">Live URL</label>
      <div className="ad-row">
        <input id="live-url" className="ad-input" inputMode="url" placeholder="https://example.com" value={value ?? ''}
          onChange={(e) => onChange(e.target.value)} onBlur={() => { if (url && url !== value) onChange(url); }} />
        {url && (
          <a className="ad-btn ad-btn--ghost" href={url} target="_blank" rel="noopener noreferrer" aria-label="Open live site in a new tab">
            <ExternalLink size={16} aria-hidden="true" /> Open
          </a>
        )}
      </div>
      <p className="ad-hint">{!value ? 'Optional. A "Live preview" button appears on the case study page.' : url ? 'Shown on the case study as a "Live preview" button.' : 'Enter a valid link, for example example.com.'}</p>
    </div>
  );
}

export default function ProjectEditorScreen({ initial }) {
  const router = useRouter();
  const { request, editingEnabled } = useAdmin();
  const [project, setProject] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const dirty = useMemo(() => JSON.stringify(project) !== JSON.stringify(saved), [project, saved]);
  const update = (patch) => { setProject((p) => ({ ...p, ...patch })); setMessage(null); };

  const save = async () => {
    if (!dirty || saving || !editingEnabled) return;
    setSaving(true); setMessage(null);
    try {
      await request('PATCH', { collection: 'caseStudies', item: project });
      setSaved(project);
      setMessage({ kind: 'ok', text: 'Saved. The live site now shows these changes.' });
      router.refresh();
    } catch (err) {
      setMessage({ kind: 'error', text: err.message });
    }
    setSaving(false);
  };

  // Cmd/Ctrl+S saves; leaving with unsaved edits asks for confirmation.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') { e.preventDefault(); document.getElementById('save-project')?.click(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const onTitle = (title) => {
    const followSlug = !project.slug || project.slug === slugify(project.title) || project.slug.startsWith('untitled-project');
    update({ title, ...(followSlug ? { slug: slugify(title) } : {}) });
  };

  return (
    <div className="ad">
      <AdminBar title={project.title || 'Untitled project'} backHref="/admin" backLabel="All case studies">
        <Link className="ad-btn ad-btn--ghost" href={`/works/${project.slug}`} target="_blank"><ExternalLink size={16} /> Preview</Link>
        <button id="save-project" type="button" className="ad-btn" onClick={save} disabled={!editingEnabled || saving || !dirty}>
          <Save size={16} /> {saving ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}
        </button>
      </AdminBar>

      {!editingEnabled && <p className="ad-banner ad-banner--error" role="alert">Editing is disabled on this deployment. Set ADMIN_TOKEN to enable it.</p>}
      {message && <p className={`ad-banner ad-banner--${message.kind}`} role={message.kind === 'error' ? 'alert' : 'status'}>{message.text}</p>}

      <div className="ad-screen">
        <main className="ad-screen__main">
          <section className="ad-panel">
            <TextField label="Title" value={project.title} onChange={onTitle} />
            <ImageField label="Cover image" value={project.coverImage} onChange={(v) => update({ coverImage: v })} />
          </section>
          <section className="ad-panel" aria-labelledby="content-h">
            <h2 id="content-h">Case study content</h2>
            <BlocksEditor blocks={project.contentBlocks || []} onChange={(blocks) => update({ contentBlocks: blocks })} />
          </section>
          <section className="ad-panel" aria-labelledby="preview-h">
            <h2 id="preview-h">Live preview</h2>
            <p className="ad-hint">Exactly how the case study page renders your cover and content, including unsaved edits.</p>
            <div className="bh ad-livepreview">
              <ProjectHead project={project} />
              <ProjectCanvas project={normalizeProject(project)} />
            </div>
          </section>
        </main>

        <aside className="ad-screen__side">
          <section className="ad-panel">
            <h2>Publishing</h2>
            <SelectField label="Status" value={project.status} options={['Draft', 'Published']} onChange={(v) => update({ status: v })} />
            <TextField label="Slug (URL)" hint={`/works/${project.slug}`} value={project.slug} onChange={(v) => update({ slug: slugify(v) })} />
          </section>
          <section className="ad-panel">
            <h2>Details</h2>
            <TextField label="Client / company" value={project.company} onChange={(v) => update({ company: v })} />
            <TextField label="Category" value={project.category} onChange={(v) => update({ category: v })} />
            <TextField label="Timeline" value={project.timelines} onChange={(v) => update({ timelines: v })} />
            <LiveUrlField value={project.liveViewUrl} onChange={(v) => update({ liveViewUrl: v })} />
            <TagsField label="Services provided" value={project.serviceProvided} onChange={(v) => update({ serviceProvided: v })} />
            <TextField label="Appreciations" type="number" min={0} value={project.appreciations ?? 0} onChange={(v) => update({ appreciations: Math.max(0, v) })} />
            <TextField label="Views" type="number" min={0} value={project.views ?? 0} onChange={(v) => update({ views: Math.max(0, v) })} />
          </section>
          <section className="ad-panel">
            <h2>SEO</h2>
            <TextField label="SEO title" value={project.seoTitle} onChange={(v) => update({ seoTitle: v })} />
            <TextArea label="SEO description" rows={3} value={project.seoDescription} onChange={(v) => update({ seoDescription: v })} />
          </section>
        </aside>
      </div>
    </div>
  );
}
