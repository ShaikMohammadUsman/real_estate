'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Building2, Eye, EyeOff, User, BadgeCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

function LoginForm() {
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const defaultRole = searchParams.get('role') as 'customer' | 'broker' || 'customer';

    const [form, setForm] = useState({ email: '', password: '', role: defaultRole });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await login(form.email, form.password, form.role);
        if (result.success) {
            router.push('/dashboard');
        } else {
            setError(result.error || 'Login failed');
        }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '100px 24px 48px',
            background: 'radial-gradient(ellipse 60% 50% at 50% -10%, rgba(212,175,55,0.1) 0%, transparent 60%)',
        }}>
            <div style={{ width: '100%', maxWidth: 420 }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 44, height: 44, background: 'var(--gradient-gold)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Building2 size={22} color="#0A0A0F" />
                        </div>
                        <span style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Plus Jakarta Sans' }}>
                            Realtor<span className="gradient-text">Connect</span>
                        </span>
                    </Link>
                    <h1 style={{ fontSize: 26, fontWeight: 800, marginTop: 28 }}>Welcome back</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: 14 }}>
                        Sign in as a {form.role === 'broker' ? 'Broker' : 'Customer'}
                    </p>
                </div>

                {/* Role toggle */}
                <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20,
                    background: 'var(--dark-3)',
                    borderRadius: 'var(--radius-md)', padding: 6,
                    border: '1px solid var(--border-subtle)',
                }}>
                    {[
                        { value: 'customer', label: 'Customer', icon: <User size={16} /> },
                        { value: 'broker', label: 'Broker', icon: <BadgeCheck size={16} /> },
                    ].map(role => (
                        <button
                            key={role.value}
                            type="button"
                            onClick={() => setForm(p => ({ ...p, role: role.value as any }))}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center',
                                padding: '10px 8px',
                                background: form.role === role.value ? 'var(--gradient-gold)' : 'transparent',
                                color: form.role === role.value ? '#0A0A0F' : 'var(--text-secondary)',
                                border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                                fontWeight: 600, fontSize: 13,
                                transition: 'all 0.2s',
                            }}
                        >
                            {role.icon} {role.label}
                        </button>
                    ))}
                </div>

                {/* Form Card */}
                <div className="card" style={{ padding: 28 }}>
                    {error && (
                        <div style={{
                            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                            borderRadius: 'var(--radius-sm)', padding: '10px 14px',
                            color: 'var(--error)', fontSize: 13, marginBottom: 16,
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div className="input-group">
                            <label className="input-label">Email Address</label>
                            <input
                                className="input"
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                required
                                autoFocus
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    className="input"
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="Your password"
                                    value={form.password}
                                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                    required
                                    style={{ paddingRight: 44 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    style={{
                                        position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                                        background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                                    }}
                                >
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: 8, padding: '14px' }}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)', marginTop: 20 }}>
                    Don't have an account?{' '}
                    <Link href={`/auth/register?role=${form.role}`} style={{ color: 'var(--gold)', fontWeight: 600 }}>Create account</Link>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div style={{ paddingTop: 100, textAlign: 'center' }}>Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
