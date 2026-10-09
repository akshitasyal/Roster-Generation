'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    // Role-based routing
    if (user.isWfm) {
      router.replace('/wfm/dashboard');
    } else {
      switch (user.designation?.toLowerCase()) {
        case 'associate':
          router.replace('/associate/dashboard');
          break;
        case 'team leader':
          router.replace('/tl/dashboard');
          break;
        case 'associate manager':
          router.replace('/am/dashboard');
          break;
        case 'manager':
          router.replace('/manager/dashboard');
          break;
        case 'senior manager':
          router.replace('/senior-manager/dashboard');
          break;
        default:
          // Fallback if no matching role. Since user is authenticated, we route them somewhere safely
          // but we do NOT assume they are an Associate automatically. If there is no specific dashboard,
          // they shouldn't just be dumped into Associate. We can put them in a generic page or unauthorized.
          // For now, if they somehow get here, we can route to login or a default error page.
          // Given the requirements, we must NOT assume associate. 
          router.replace('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-wfm-dark flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-slate-400 text-sm">Authenticating...</span>
      </div>
    </div>
  );
}
