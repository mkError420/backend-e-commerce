'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings, Home } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  description?: string;
}

export default function AdminHeader({ title, description }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const goToHome = () => {
    router.push('/');
  };

  const handleSettings = () => {
    router.push('/admin/settings');
  };


  return (
    <div className="relative bg-white/90 backdrop-blur-lg border-b border-gray-200/50 shadow-sm z-50">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5"></div>
      <div className="relative max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="space-y-1">
              <div className="space-y-1">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {title}
                </h1>
              </div>
              {description && (
                <p className="text-sm text-gray-600 ml-11">{description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/60 rounded-lg border border-gray-200/50">
              <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full">
                <User className="h-3 w-3 text-white" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-gray-800">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleSettings}
              className="flex items-center gap-2 bg-white/60 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 border-gray-200/50 rounded-lg transition-all duration-300"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Settings</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/60 hover:bg-red-50 hover:border-red-200 hover:text-red-600 border-gray-200/50 rounded-lg transition-all duration-300"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
