import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth, getPortalForUser } from '@/context/AuthContext';

export function useRoleGuard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading || !user) return;

    const isWfm = user.isWfm || user.portalRole === 'WFM';
    const isWfmPath = pathname.startsWith('/wfm');

    if (isWfmPath && !isWfm) {
      console.warn(`Access denied. Non-WFM user ${user.empId} attempted to access WFM portal (${pathname}).`);
      router.replace(getPortalForUser(user));
      return;
    }

    if (!isWfmPath && isWfm && (pathname === '/' || pathname === '/login')) {
      router.replace(getPortalForUser(user));
      return;
    }
  }, [user, loading, pathname, router]);
}
