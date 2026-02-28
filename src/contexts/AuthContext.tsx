'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'customer' | 'broker';
    avatar?: string;
    phone?: string;
}

interface BrokerProfile {
    id: number;
    user_id: number;
    bio?: string;
    location_city?: string;
    location_state?: string;
    commission_min?: number;
    commission_max?: number;
    profile_complete: number;
    avg_rating?: number;
    total_reviews?: number;
    [key: string]: any;
}

interface AuthContextType {
    user: User | null;
    brokerProfile: BrokerProfile | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string, role?: 'customer' | 'broker') => Promise<{ success: boolean; error?: string }>;
    register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    role: 'customer' | 'broker';
    phone?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [brokerProfile, setBrokerProfile] = useState<BrokerProfile | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        try {
            const storedToken = localStorage.getItem('token');
            if (!storedToken) {
                setLoading(false);
                return;
            }

            const res = await fetch('/api/auth/me', {
                headers: { Authorization: `Bearer ${storedToken}` }
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
                setBrokerProfile(data.brokerProfile);
                setToken(storedToken);
            } else {
                localStorage.removeItem('token');
            }
        } catch {
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const login = async (email: string, password: string, role?: 'customer' | 'broker') => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role })
            });

            const data = await res.json();

            if (res.ok) {
                setUser(data.user);
                setToken(data.token);
                localStorage.setItem('token', data.token);
                if (data.user.role === 'broker') await refreshUser();
                return { success: true };
            }

            return { success: false, error: data.error };
        } catch {
            return { success: false, error: 'Network error. Please try again.' };
        }
    };

    const register = async (registerData: RegisterData) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerData)
            });

            const data = await res.json();

            if (res.ok) {
                setUser(data.user);
                setToken(data.token);
                localStorage.setItem('token', data.token);
                if (data.user.role === 'broker') await refreshUser();
                return { success: true };
            }

            return { success: false, error: data.error };
        } catch {
            return { success: false, error: 'Network error. Please try again.' };
        }
    };

    const logout = () => {
        setUser(null);
        setBrokerProfile(null);
        setToken(null);
        localStorage.removeItem('token');
        fetch('/api/auth/me', { method: 'POST' });
    };

    return (
        <AuthContext.Provider value={{ user, brokerProfile, token, loading, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
