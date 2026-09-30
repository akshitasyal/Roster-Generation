import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function useRoleGuard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading || !user) return;

    const role = user.role;

    // Define route prefixes and the roles allowed to access them
    const roleRoutes: Record<string, string[]> = {
      '/wfm': ['WFM'],
      '/senior-manager': ['SENIOR_MANAGER', 'WFM'], // Sometimes WFM might have access, but strictly let's keep it isolated
      '/manager': ['MANAGER', 'WFM'],
      '/am': ['AM', 'WFM'],
      '/tl': ['TL', 'AM', 'MANAGER', 'WFM'],
      '/associate': ['ASSOCIATE', 'TL', 'AM', 'MANAGER', 'SENIOR_MANAGER', 'WFM']
    };

    // Find the current base path segment (e.g. '/wfm', '/tl')
    const basePath = '/' + pathname.split('/')[1];

    if (roleRoutes[basePath]) {
      const allowedRoles = roleRoutes[basePath];
      
      if (!allowedRoles.includes(role)) {
        console.warn(`Access denied. Role ${role} cannot access ${pathname}`);
        // Redirect to their default dashboard
        switch (role) {
          case 'WFM': router.replace('/wfm/dashboard'); break;
          case 'SENIOR_MANAGER': router.replace('/senior-manager/dashboard'); break;
          case 'MANAGER': router.replace('/manager/dashboard'); break;
          case 'AM': router.replace('/am/dashboard'); break;
          case 'TL': router.replace('/tl/dashboard'); break;
          default: router.replace('/associate/dashboard'); break;
        }
      }
    }
  }, [user, loading, pathname, router]);
}
