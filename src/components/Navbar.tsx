'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    Building2, Search, User, LogOut, Menu, X, ChevronDown,
    LayoutDashboard, Settings, Star, MessageSquare, Home
} from 'lucide-react';

export default function Navbar() {
    const { user, logout, loading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
        setDropdownOpen(false);
    }, [pathname]);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const navLinks = [
        { href: '/brokers', label: 'Find Brokers', icon: <Search size={16} /> },
        { href: '/about', label: 'How It Works', icon: <Home size={16} /> },
    ];

    const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

    return (
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            transition: 'all 0.3s ease',
            background: scrolled
                ? 'rgba(10, 10, 15, 0.95)'
                : 'transparent',
            backdropFilter: scrolled ? 'blur(20px)' : 'none',
            borderBottom: scrolled ? '1px solid rgba(212, 175, 55, 0.1)' : '1px solid transparent',
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', height: 72, justifyContent: 'space-between' }}>
                {/* Logo */}
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 38, height: 38,
                        background: 'var(--gradient-gold)',
                        borderRadius: 10,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Building2 size={20} color="#0A0A0F" strokeWidth={2.5} />
                    </div>
                    <span style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Plus Jakarta Sans' }}>
                        Realtor<span className="gradient-text">Connect</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                padding: '8px 16px',
                                borderRadius: 'var(--radius-md)',
                                fontSize: 14, fontWeight: 500,
                                color: pathname === link.href ? 'var(--gold)' : 'var(--text-secondary)',
                                background: pathname === link.href ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                                transition: 'all 0.2s',
                            }}
                        >
                            {link.icon}
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right side */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {loading ? (
                        <div className="skeleton" style={{ width: 100, height: 36 }} />
                    ) : user ? (
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    padding: '8px 12px',
                                    background: 'var(--surface)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    color: 'var(--text-primary)',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <div className="avatar-placeholder" style={{ width: 28, height: 28, fontSize: 11 }}>
                                    {initials}
                                </div>
                                <span style={{ fontSize: 14, fontWeight: 500, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {user.name}
                                </span>
                                <ChevronDown size={14} color="var(--text-muted)" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                            </button>

                            {dropdownOpen && (
                                <div style={{
                                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                                    width: 220,
                                    background: 'var(--surface-2)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: 'var(--radius-md)',
                                    padding: 8,
                                    boxShadow: 'var(--shadow-lg)',
                                    zIndex: 100,
                                }}>
                                    <div style={{ padding: '8px 12px 12px', marginBottom: 4 }}>
                                        <p style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</p>
                                        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{user.email}</p>
                                        <span className="badge badge-gold" style={{ marginTop: 6 }}>
                                            {user.role === 'broker' ? '🏠 Broker' : '👤 Customer'}
                                        </span>
                                    </div>
                                    <div className="divider" style={{ margin: '4px 0' }} />
                                    {user.role === 'broker' ? (
                                        <>
                                            <DropdownItem href="/dashboard" icon={<LayoutDashboard size={15} />} label="Dashboard" />
                                            <DropdownItem href="/dashboard/profile" icon={<Settings size={15} />} label="Edit Profile" />
                                            <DropdownItem href="/dashboard/consultations" icon={<MessageSquare size={15} />} label="Consultations" />
                                        </>
                                    ) : (
                                        <>
                                            <DropdownItem href="/dashboard" icon={<LayoutDashboard size={15} />} label="My Dashboard" />
                                            <DropdownItem href="/dashboard/consultations" icon={<MessageSquare size={15} />} label="My Requests" />
                                        </>
                                    )}
                                    <div className="divider" style={{ margin: '4px 0' }} />
                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 10,
                                            width: '100%', padding: '9px 12px',
                                            background: 'transparent', border: 'none',
                                            borderRadius: 'var(--radius-sm)',
                                            color: 'var(--error)', fontSize: 13, fontWeight: 500,
                                            cursor: 'pointer', transition: 'background 0.2s',
                                            textAlign: 'left',
                                        }}
                                    >
                                        <LogOut size={15} /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link href="/auth/login" className="btn btn-ghost btn-sm">Sign In</Link>
                            <Link href="/auth/register" className="btn btn-primary btn-sm">Get Started</Link>
                        </>
                    )}

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        style={{
                            display: 'none',
                            background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-sm)', padding: 8, cursor: 'pointer',
                            color: 'var(--text-primary)',
                        }}
                        className="mobile-menu-btn"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile nav */}
            {mobileOpen && (
                <div style={{
                    background: 'var(--dark-2)',
                    borderTop: '1px solid var(--border-subtle)',
                    padding: '16px 24px 24px',
                }}>
                    {navLinks.map(link => (
                        <Link key={link.href} href={link.href} style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '12px 0', borderBottom: '1px solid var(--border-subtle)',
                            fontSize: 15, color: pathname === link.href ? 'var(--gold)' : 'var(--text-primary)',
                        }}>
                            {link.icon} {link.label}
                        </Link>
                    ))}
                    {!user && (
                        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                            <Link href="/auth/login" className="btn btn-ghost" style={{ flex: 1 }}>Sign In</Link>
                            <Link href="/auth/register" className="btn btn-primary" style={{ flex: 1 }}>Get Started</Link>
                        </div>
                    )}
                </div>
            )}

            <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
        </header>
    );
}

function DropdownItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link href={href} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)',
            transition: 'all 0.2s',
        }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
            }}>
            {icon} {label}
        </Link>
    );
}
