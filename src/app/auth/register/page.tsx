'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Building2, Eye, EyeOff, User, BadgeCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

function RegisterForm() {
    const { register } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const defaultRole = searchParams.get('role') as 'customer' | 'broker' || 'customer';

    const [form, setForm] = useState({
        name: '', email: '', password: '', phone: '',
        role: defaultRole,
    });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await register(form);
        if (result.success) {
            router.push(form.role === 'broker' ? '/dashboard/profile' : '/brokers');
        } else {
            setError(result.error || 'Registration failed');
        }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '100px 24px 48px',
            background: 'radial-gradient(ellipse 60% 50% at 50% -10%, rgba(212,175,55,0.1) 0%, transparent 60%)',
        }}>
            <div style={{ width: '100%', maxWidth: 480 }}>
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
                    <h1 style={{ fontSize: 26, fontWeight: 800, marginTop: 28 }}>Create your account</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: 14 }}>
                        Join thousands of brokers and property seekers
                    </p>
                </div>

                {/* Role toggle */}
                <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28,
                    background: 'var(--dark-3)',
                    borderRadius: 'var(--radius-md)', padding: 6,
                    border: '1px solid var(--border-subtle)',
                }}>
                    {[
                        { value: 'customer', label: 'Property Seeker', icon: <User size={16} />, desc: 'Find brokers' },
                        { value: 'broker', label: 'Broker', icon: <BadgeCheck size={16} />, desc: 'Create profile' },
                    ].map(role => (
                        <button
                            key={role.value}
                            onClick={() => setForm(p => ({ ...p, role: role.value as any }))}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center',
                                padding: '12px 8px',
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
                            <label className="input-label">Full Name</label>
                            <input
                                className="input"
                                type="text"
                                placeholder="John Smith"
                                value={form.name}
                                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Email Address</label>
                            <input
                                className="input"
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Phone (optional)</label>
                            <input
                                className="input"
                                type="tel"
                                placeholder="+91 98765 43210"
                                value={form.phone}
                                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    className="input"
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="Min 6 characters"
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
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)', marginTop: 20 }}>
                    Already have an account?{' '}
                    <Link href="/auth/login" style={{ color: 'var(--gold)', fontWeight: 600 }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div style={{ paddingTop: 100, textAlign: 'center' }}>Loading...</div>}>
            <RegisterForm />
        </Suspense>
    );
}
