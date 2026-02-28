"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext<any>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          await fetchUser();
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const fetchUser = async () => {
    try {
      if (typeof window === "undefined") return;
      
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:5001/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Only remove token on authentication errors (401)
        if (response.status === 401) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("token");
          }
          setUser(null);
        }
        // For other errors, keep the user logged in
      }
    } catch (error: any) {
      console.error("Error fetching user:", error);
      // Don't automatically logout on network errors
      // Only logout if it's an authentication error
      if (error.message && error.message.includes("401")) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (typeof window !== "undefined") {
          localStorage.setItem("token", data.token);
        }
        setUser(data);
        return { success: true, user: data };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      return { success: false, error: "Login failed" };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (typeof window !== "undefined") {
          localStorage.setItem("token", data.token);
        }
        setUser(data);
        return { success: true, user: data };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      return { success: false, error: "Registration failed" };
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};