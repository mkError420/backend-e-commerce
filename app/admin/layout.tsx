"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "" },
    { name: "Products", href: "/admin/products", icon: "" },
    { name: "Categories", href: "/admin/categories", icon: "📁" },
    { name: "Orders", href: "/admin/orders", icon: "📦" },
    { name: "Users", href: "/admin/users", icon: "" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <div className={`${sidebarOpen ? "block" : "hidden"} md:block md:w-64`}>
        <div className="flex flex-col h-full bg-white shadow-lg">
          <div className="flex items-center justify-center h-16 bg-blue-600">
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between h-16 bg-white shadow-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="px-4 text-gray-500 focus:outline-none md:hidden"
          >
            
          </button>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user.name}</span>
            <button 
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;