'use client';

import { useEffect, useMemo, useState } from 'react';
import { Save } from 'lucide-react';
import { useAdmin } from './AdminContext';
import AdminBar from './AdminBar';
import ProjectList from './ProjectList';
import ListEditor from './ListEditor';
import ExperienceEditor from './ExperienceEditor';

const STATUS = (options) => ({ key: 'status', label: 'Status', type: 'select', options });

const TABS = [
  { id: 'caseStudies', label: 'Case studies' },
  {
    id: 'services', label: 'Services', noun: 'service', titleKey: 'title', defaults: { status: 'Draft', points: [], icon: 'Globe' },
    fields: [
      { key: 'title', label: 'Title', type: 'text' }, { key: 'highlightText', label: 'Tagline', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' }, { key: 'category', label: 'Category', type: 'text' },
      { key: 'points', label: 'Bullet points', type: 'lines' },
      { key: 'image', label: 'Card image', type: 'image', hint: 'Leave empty to use the default image for the chosen icon.' },
      { key: 'icon', label: 'Icon', type: 'select', options: ['Globe', 'Figma', 'PenTool', 'Share2'] },
      { key: 'displayOrder', label: 'Display order', type: 'number' }, STATUS(['Draft', 'Published']),
    ],
  },
  { id: 'experiences', label: 'Experience', collection: 'experiences', type: 'companies' },
  {
    id: 'degrees', label: 'Education', collection: 'education', kind: 'Education', noun: 'degree', titleKey: 'role',
    defaults: { status: 'Draft', kind: 'Education' },
    fields: [
      { key: 'role', label: 'Degree / course', type: 'text' }, { key: 'company', label: 'Institution', type: 'text' },
      { key: 'period', label: 'Period', type: 'text', hint: 'For example 2019 — 2023' }, { key: 'location', label: 'Location', type: 'text' },
      { key: 'description', label: 'Details', type: 'textarea', hint: 'For example CGPA or major' },
      { key: 'displayOrder', label: 'Display order', type: 'number' }, STATUS(['Draft', 'Published']),
    ],
  },
  {
    id: 'certifications', label: 'Certifications', collection: 'education', kind: 'Certification', noun: 'certificate', titleKey: 'role',
    defaults: { status: 'Draft', kind: 'Certification' },
    fields: [
      { key: 'role', label: 'Certificate', type: 'text' }, { key: 'company', label: 'Issued by', type: 'text' },
      { key: 'period', label: 'Date', type: 'text', hint: 'For example 2022 or Jun — Dec 2022' }, { key: 'location', label: 'Location', type: 'text' },
      { key: 'description', label: 'Details', type: 'textarea' },
      { key: 'displayOrder', label: 'Display order', type: 'number' }, STATUS(['Draft', 'Published']),
    ],
  },
  {
    id: 'testimonials', label: 'Testimonials', noun: 'testimonial', titleKey: 'userName', defaults: { status: 'Draft', rating: 5 },
    fields: [
      { key: 'userName', label: 'Name', type: 'text' }, { key: 'companyName', label: 'Company', type: 'text' },
      { key: 'highlightText', label: 'Headline', type: 'text' }, { key: 'content', label: 'Quote', type: 'textarea' },
      { key: 'rating', label: 'Rating (1–5)', type: 'number' },
      { key: 'displayOrder', label: 'Display order', type: 'number' }, STATUS(['Draft', 'Active']),
    ],
  },
];

/** Case studies are edited on their own screen (/admin/projects/[id]); the other collections are edited inline here. */
export default function AdminApp({ initial, homeIds }) {
  const { request, editingEnabled } = useAdmin();
  const { caseStudies, ...inlineInitial } = initial;
  const [data, setData] = useState(inlineInitial);
  const [saved, setSaved] = useState(inlineInitial);
  const [tabId, setTab] = useState('caseStudies');
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  const dirty = useMemo(
    () => Object.fromEntries(Object.keys(data).map((k) => [k, JSON.stringify(data[k]) !== JSON.stringify(saved[k])])),
    [data, saved]
  );
  const anyDirty = Object.values(dirty).some(Boolean);

  useEffect(() => {
    if (!anyDirty) return;
    const warn = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [anyDirty]);

  const save = async (collection) => {
    setSaving(true); setMessage(null);
    try {
      await request('PUT', { collection, items: data[collection] });
      setSaved((s) => ({ ...s, [collection]: data[collection] }));
      setMessage({ kind: 'ok', text: 'Saved. The live site now shows these changes.' });
    } catch (err) {
      setMessage({ kind: 'error', text: err.message });
    }
    setSaving(false);
  };

  // an unknown tab id (e.g. a stale one after a hot reload) falls back to the first tab
  const current = TABS.find((t) => t.id === tabId) ?? TABS[0];
  const tab = current.id;
  const collectionOf = (t) => t.collection || t.id;
  const collection = collectionOf(current);
  const inline = tab !== 'caseStudies';
  // Education and Certifications are two views of one collection, split by `kind`.
  const matches = (i) => (current.kind === 'Certification' ? i.kind === 'Certification' : i.kind !== 'Certification');
  const items = current.kind ? data[collection].filter(matches) : data[collection];
  const setItems = (next) => setData((d) => ({ ...d, [collection]: current.kind ? [...d[collection].filter((i) => !matches(i)), ...next] : next }));

  return (
    <div className="ad">
      <AdminBar title="Portfolio editor" backHref="/" backLabel="Site">
        {inline && (
          <button type="button" className="ad-btn" onClick={() => save(collection)} disabled={!editingEnabled || saving || !dirty[collection]}>
            <Save size={16} /> {saving ? 'Saving…' : dirty[collection] ? 'Save changes' : 'Saved'}
          </button>
        )}
      </AdminBar>

      {!editingEnabled && (
        <p className="ad-banner ad-banner--error" role="alert">Editing is disabled on this deployment. Set the ADMIN_TOKEN environment variable to enable it.</p>
      )}
      {message && <p className={`ad-banner ad-banner--${message.kind}`} role={message.kind === 'error' ? 'alert' : 'status'}>{message.text}</p>}

      <div className="ad-tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'is-active' : ''}
            onClick={() => { setTab(t.id); setMessage(null); }}>
            {t.label}{dirty[collectionOf(t)] && <span className="ad-dot" title="Unsaved changes" />}
          </button>
        ))}
      </div>

      <div role="tabpanel">
        {tab === 'caseStudies'
          ? <ProjectList items={caseStudies} homeIds={homeIds} />
          : current.type === 'companies'
            ? <ExperienceEditor key={tab} items={items} onChange={setItems} />
            : <ListEditor key={tab} items={items} onChange={setItems} fields={current.fields}
                titleKey={current.titleKey} noun={current.noun} defaults={current.defaults} />}
      </div>
    </div>
  );
}
