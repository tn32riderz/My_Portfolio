import { adminDisabled, getQuestion, isAuthenticated, isConfigured, setupKeyRequired } from '@/lib/adminAuth';
import AdminProvider from '@/components/admin/AdminProvider';
import AuthScreen from '@/components/admin/AuthScreen';
import '@/components/admin/admin.css';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }) {
  const configured = await isConfigured();
  if (!configured || !(await isAuthenticated())) {
    return (
      <AuthScreen mode={configured ? 'login' : 'setup'} question={await getQuestion()}
        disabled={await adminDisabled()} needsSetupKey={setupKeyRequired()} />
    );
  }
  return <AdminProvider>{children}</AdminProvider>;
}
