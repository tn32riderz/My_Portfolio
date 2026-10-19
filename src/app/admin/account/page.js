import { getQuestion, isAuthenticated } from '@/lib/adminAuth';
import AccountScreen from '@/components/admin/AccountScreen';

export const metadata = { title: 'Admin account', robots: { index: false, follow: false } };

export default async function AccountPage() {
  if (!(await isAuthenticated())) return null;
  return <AccountScreen question={await getQuestion()} />;
}
