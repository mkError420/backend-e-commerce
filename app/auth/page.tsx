'use client';

import { useState, useEffect } from 'react';
import LoginForm from '@/components/Auth/LoginForm';
import RegisterForm from '@/components/Auth/RegisterForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isAuthenticated) {
      const redirect = searchParams.get('redirect');
      if (redirect === 'admin' || isAdmin) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
  }, [isAuthenticated, isAdmin, router, searchParams]);

  const handleAuthSuccess = () => {
    const redirect = searchParams.get('redirect');
    if (redirect === 'admin' || isAdmin) {
      router.push('/admin');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isLogin ? (
          <LoginForm
            onSuccess={handleAuthSuccess}
            onRegisterClick={() => setIsLogin(false)}
          />
        ) : (
          <RegisterForm
            onSuccess={handleAuthSuccess}
            onLoginClick={() => setIsLogin(true)}
          />
        )}
      </div>
    </div>
  );
}
