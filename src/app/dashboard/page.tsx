'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    LayoutDashboard, Settings, MessageSquare, Search,
    Building2, Star, TrendingUp, Users, ArrowRight,
    BadgeCheck, MapPin
} from 'lucide-react';

export default function DashboardPage() {
    const { user, brokerProfile, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) router.push('/auth/login');
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div style={{ paddingTop: 100, textAlign: 'center' }}>
                <div className="skeleton" style={{ width: 200, height: 32, margin: '0 auto 16px', borderRadius: 8 }} />
                <div className="skeleton" style={{ width: 300, height: 20, margin: '0 auto', borderRadius: 8 }} />
            </div>
        );
    }

    const initials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    if (user.role === 'broker') {
        return <BrokerDashboard user={user} brokerProfile={brokerProfile} initials={initials} />;
    }

    return <CustomerDashboard user={user} initials={initials} />;
}

function BrokerDashboard({ user, brokerProfile, initials }: any) {
    const profileComplete = brokerProfile?.profile_complete === 1;

    return (
        <div style={{ paddingTop: 100, paddingBottom: 80 }}>
            <div className="container">
                {/* Header */}
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
                    <div className="avatar-placeholder" style={{ width: 64, height: 64, fontSize: 22 }}>{initials}</div>
                    <div>
                        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Welcome back, {user.name.split(' ')[0]}! 👋</h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: 14 }}>
                            {profileComplete ? 'Your profile is live and visible to buyers' : 'Complete your profile to go live!'}
                        </p>
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
                        {brokerProfile?.id && (
                            <Link href={`/brokers/${brokerProfile.id}`} className="btn btn-ghost btn-sm">
                                <Building2 size={15} /> View Profile
                            </Link>
                        )}
                        <Link href="/dashboard/profile" className="btn btn-primary btn-sm">
                            <Settings size={15} /> Edit Profile
                        </Link>
                    </div>
                </div>

                {/* Profile completion alert */}
                {!profileComplete && (
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0.05) 100%)',
                        border: '1px solid rgba(212,175,55,0.25)',
                        borderRadius: 'var(--radius-lg)', padding: 20,
                        display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap',
                    }}>
                        <span style={{ fontSize: 32 }}>⚠️</span>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--gold)' }}>Complete your profile to appear in search!</h3>
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                                Fill in your bio, location, commission rates, and specializations to go live.
                            </p>
                        </div>
                        <Link href="/dashboard/profile" className="btn btn-primary btn-sm">
                            Complete Profile <ArrowRight size={14} />
                        </Link>
                    </div>
                )}

                {/* Stats grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
                    {[
                        { icon: <Star size={20} color="var(--gold)" />, label: 'Avg Rating', value: brokerProfile?.avg_rating ? `${brokerProfile.avg_rating.toFixed(1)}★` : 'N/A' },
                        { icon: <Users size={20} color="var(--gold)" />, label: 'Total Reviews', value: brokerProfile?.total_reviews || 0 },
                        { icon: <TrendingUp size={20} color="var(--gold)" />, label: 'Total Deals', value: brokerProfile?.total_deals || 0 },
                        { icon: <BadgeCheck size={20} color="var(--success)" />, label: 'Profile Status', value: profileComplete ? 'Live 🟢' : 'Incomplete 🔴' },
                    ].map(stat => (
                        <div key={stat.label} className="card" style={{ padding: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                <div style={{ padding: 10, background: 'rgba(212,175,55,0.1)', borderRadius: 'var(--radius-sm)' }}>{stat.icon}</div>
                            </div>
                            <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Plus Jakarta Sans' }}>{stat.value}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Quick actions */}
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Quick Actions</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                    {[
                        { href: '/dashboard/profile', icon: <Settings size={24} color="var(--gold)" />, title: 'Edit Profile', desc: 'Update bio, commission, specializations', color: 'rgba(212,175,55,0.1)' },
                        { href: '/dashboard/consultations', icon: <MessageSquare size={24} color="var(--accent-light)" />, title: 'Consultations', desc: 'View and manage consultation requests', color: 'rgba(124,92,219,0.1)' },
                        { href: '/brokers', icon: <Search size={24} color="var(--success)" />, title: 'Browse Platform', desc: 'See how your profile compares to others', color: 'rgba(34,197,94,0.1)' },
                    ].map(action => (
                        <Link key={action.href} href={action.href} className="card">
                            <div style={{ padding: 24 }}>
                                <div style={{ width: 48, height: 48, background: action.color, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                                    {action.icon}
                                </div>
                                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{action.title}</h3>
                                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{action.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

function CustomerDashboard({ user, initials }: any) {
    return (
        <div style={{ paddingTop: 100, paddingBottom: 80 }}>
            <div className="container">
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
                    <div className="avatar-placeholder" style={{ width: 64, height: 64, fontSize: 22 }}>{initials}</div>
                    <div>
                        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Welcome, {user.name.split(' ')[0]}! 👋</h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: 14 }}>
                            Find the perfect broker for your next property deal
                        </p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                    {[
                        { href: '/brokers', icon: <Search size={24} color="var(--gold)" />, title: 'Find Brokers', desc: 'Search verified brokers by location, specialization, and commission', color: 'rgba(212,175,55,0.1)' },
                        { href: '/dashboard/consultations', icon: <MessageSquare size={24} color="var(--accent-light)" />, title: 'My Requests', desc: 'Track your consultation requests and their statuses', color: 'rgba(124,92,219,0.1)' },
                    ].map(action => (
                        <Link key={action.href} href={action.href} className="card">
                            <div style={{ padding: 28 }}>
                                <div style={{ width: 52, height: 52, background: action.color, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                                    {action.icon}
                                </div>
                                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{action.title}</h3>
                                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{action.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
