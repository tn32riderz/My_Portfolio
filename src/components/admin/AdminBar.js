'use client';

import Link from 'next/link';
import { LogOut, UserCog } from 'lucide-react';
import { useAdmin } from './AdminContext';

/** Sticky top bar shared by all admin screens; `children` are the screen's action buttons. */
export default function AdminBar({ title, backHref, backLabel, children }) {
  const { logout } = useAdmin();
  return (
    <header className="ad-top">
      <div>
        <Link href={backHref}>← {backLabel}</Link>
        <h1>{title}</h1>
      </div>
      <div className="ad-row ad-row--wrap">
        {children}
        <Link className="ad-btn ad-btn--ghost" href="/admin/account"><UserCog size={16} /> Account</Link>
        <button type="button" className="ad-btn ad-btn--ghost" onClick={logout}><LogOut size={16} /> Log out</button>
      </div>
    </header>
  );
}
