'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';
import { useRouter, usePathname } from 'next/navigation';

export interface User {
  empId: string;
  name: string;
  email: string;
  designation: string;
  skill: string;
  portalRole: 'WFM' | 'EMPLOYEE' | string;
  isWfm: boolean;
  permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (empId: string, email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const getPortalForUser = (user: User): string => {
  if (user.isWfm) {
    return '/wfm/dashboard';
  }
  
  switch (user.designation?.toLowerCase()) {
    case 'associate':
      return '/associate/dashboard';
    case 'team leader':
      return '/tl/dashboard';
    case 'associate manager':
      return '/am/dashboard';
    case 'manager':
      return '/manager/dashboard';
    case 'senior manager':
      return '/senior-manager/dashboard';
    default:
      return '/associate/dashboard'; 
  }
};
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const savedUserStr = localStorage.getItem('user');
    
    if (token && savedUserStr) {
      try {
        const parsed = JSON.parse(savedUserStr);
        if (!parsed.portalRole || parsed.email?.endsWith('@acme.wfm')) {
          console.warn('Clearing stale legacy session from localStorage.');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          setUser(null);
          if (pathname !== '/login' && pathname !== '/signup') {
            router.push('/login');
          }
        } else {
          setUser(parsed);
        }
      } catch (e) {
        localStorage.clear();
        setUser(null);
        if (pathname !== '/login' && pathname !== '/signup') {
          router.push('/login');
        }
      }
    } else if (pathname !== '/login' && pathname !== '/signup' && pathname !== '/') {
      // NOTE: Added pathname !== '/' because '/' is handled by app/page.tsx routing logic.
      router.push('/login');
    }
    setLoading(false);
  }, [pathname, router]);

  const processAuthResponse = (data: any): User => {
    // WFM Identification: Senior Manager + Workforce Management skill
    const isWfm = (data.designation === 'Senior Manager' && data.skill === 'Workforce Management') 
                  || data.portalRole === 'WFM'
                  || data.isWfm === true;

    const userData: User = {
      empId: data.empId || data.employeeCode || '',
      name: data.fullName || data.name || '',
      email: data.email || '',
      designation: data.designation || '',
      skill: data.skill || '',
      portalRole: isWfm ? 'WFM' : 'EMPLOYEE',
      isWfm: isWfm,
      permissions: data.permissions || []
    };

    localStorage.setItem('accessToken', data.token || data.accessToken || '');
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const data = response.data?.data || response.data;
      const userData = processAuthResponse(data);

      router.push(getPortalForUser(userData));
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (empId: string, email: string, password: string): Promise<User> => {
    try {
      const response = await api.post('/auth/signup', { empId, email, password });
      const data = response.data?.data || response.data;
      const userData = processAuthResponse(data);

      router.push(getPortalForUser(userData));
      return userData;
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
