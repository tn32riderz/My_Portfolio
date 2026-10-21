import { checkAdmin, isAuthenticated } from '@/lib/adminAuth';
import { autoPushEnabled, getPublishStatus, publishNow } from '@/lib/autoPush';

/** GET -> current auto-publish status (signed-in admin only). */
export async function GET() {
  if (!(await isAuthenticated())) return Response.json({ error: 'Not signed in.' }, { status: 401 });
  return Response.json(getPublishStatus());
}

/** POST -> publish the content changes to GitHub right now. */
export async function POST(request) {
  const denied = await checkAdmin(request);
  if (denied) return denied;
  if (!autoPushEnabled()) return Response.json({ error: 'Auto-publish is off (set AUTO_PUSH=true in .env.local).' }, { status: 400 });
  await publishNow();
  return Response.json(getPublishStatus());
}
