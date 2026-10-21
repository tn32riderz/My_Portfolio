import { execFile } from 'child_process';
import { promisify } from 'util';

const run = promisify(execFile);

/** Only content is auto-published: the JSON store and uploaded images. Code is never touched. */
const CONTENT_PATHS = ['src/data/db.json', 'public/uploads'];
const DELAY_MS = 15_000; // wait for a pause in editing so a burst of saves/uploads becomes one commit

const status = { state: 'idle', message: '', at: null }; // idle | pending | pushing | ok | error
let timer = null;
let busy = false;
let again = false;

/** On only for local editing (AUTO_PUSH=true in .env.local). Never on a production server. */
export const autoPushEnabled = () => process.env.AUTO_PUSH === 'true' && process.env.NODE_ENV !== 'production';

export const getPublishStatus = () => ({ enabled: autoPushEnabled(), ...status });

const git = (args, cwd) => run('git', args, { cwd, env: { ...process.env, GIT_TERMINAL_PROMPT: '0' }, maxBuffer: 10 * 1024 * 1024 });
const set = (state, message = '') => { status.state = state; status.message = message; status.at = new Date().toISOString(); };

/**
 * Commits the content paths and pushes the current branch, so a host connected to the repo redeploys.
 * `--` with explicit paths means anything else you have staged or changed is left exactly as it is.
 * A rejected push (the remote has newer commits) is reported, never forced or auto-merged.
 */
export async function publishContent({ cwd = process.cwd(), paths = CONTENT_PATHS } = {}) {
  if (busy) { again = true; return; }
  busy = true;
  set('pushing', 'Publishing…');
  try {
    await git(['add', '-A', '--', ...paths], cwd);
    const { stdout } = await git(['status', '--porcelain', '--', ...paths], cwd);
    if (!stdout.trim()) {
      set('ok', 'Everything is already published.');
    } else {
      await git(['commit', '-m', 'Update content via admin', '--', ...paths], cwd);
      await git(['push', 'origin', 'HEAD'], cwd);
      set('ok', 'Published. Your live site will update shortly.');
    }
  } catch (err) {
    const text = `${err.stderr || ''}${err.message || ''}`;
    set('error', /rejected|non-fast-forward|fetch first/i.test(text)
      ? 'GitHub has newer changes. Run "git pull" in the project, then press Publish now.'
      : /could not read|authentication|permission|denied|403|401/i.test(text)
        ? 'GitHub sign-in is not available to the dev server. Run "git push" once in your terminal to save your credentials.'
        : text.trim().slice(0, 240) || 'Publishing failed.');
  } finally {
    busy = false;
    if (again) { again = false; scheduleAutoPush(); }
  }
}

/** Call after any content change. Debounced; does nothing unless auto-publish is switched on. */
export function scheduleAutoPush(delay = DELAY_MS, options) {
  if (!autoPushEnabled()) return;
  set('pending', 'Changes will be published shortly…');
  clearTimeout(timer);
  timer = setTimeout(() => publishContent(options), delay);
}

/** Publish immediately (the "Publish now" button). */
export function publishNow(options) {
  clearTimeout(timer);
  return publishContent(options);
}
