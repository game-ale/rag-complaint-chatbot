'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { API_URL } from './api';

interface User {
    id: number;
    email: string;
    name: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Check local storage for token on mount
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            // Verify token with backend
            fetch(`${API_URL}/api/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`
                }
            })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                throw new Error('Invalid token');
            })
            .then(userData => {
                setUser(userData);
            })
            .catch(() => {
                // Token invalid or expired
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
                if (pathname !== '/login' && pathname !== '/register') {
                    router.push('/login');
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
        } else {
            setIsLoading(false);
            if (pathname !== '/login' && pathname !== '/register') {
                router.push('/login');
            }
        }
    }, [pathname, router]);

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(newUser);
        router.push('/');
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
