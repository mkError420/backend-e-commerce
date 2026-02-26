'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export default function AuthGuard({ 
  children, 
  requireAdmin = false, 
  redirectTo = '/auth' 
}: AuthGuardProps) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push(`${redirectTo}?redirect=${encodeURIComponent(window.location.pathname)}`);
      } else if (requireAdmin && !isAdmin) {
        router.push('/');
      }
    }
  }, [isAuthenticated, isAdmin, loading, router, redirectTo, requireAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (requireAdmin && !isAdmin) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
