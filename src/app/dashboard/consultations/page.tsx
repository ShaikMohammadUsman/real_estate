'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { MessageSquare, Clock, Check, X, Building2, MapPin, User } from 'lucide-react';

export default function ConsultationsPage() {
    const { user, token, loading } = useAuth();
    const router = useRouter();
    const [consultations, setConsultations] = useState<any[]>([]);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (!loading && !user) router.push('/auth/login');
        if (!loading && user) fetchConsultations();
    }, [user, loading]);

    const fetchConsultations = async () => {
        try {
            const res = await fetch('/api/consultations', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setConsultations(data.consultations || []);
            }
        } catch { }
        setFetching(false);
    };

    if (loading || !user) return <div style={{ paddingTop: 100, textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>;

    const isBroker = user.role === 'broker';

    return (
        <div style={{ paddingTop: 100, paddingBottom: 80 }}>
            <div className="container" style={{ maxWidth: 800 }}>
                <div style={{ marginBottom: 32 }}>
                    <h1 style={{ fontSize: 26, fontWeight: 800 }}>
                        {isBroker ? 'Consultation Requests' : 'My Consultation Requests'}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: 6, fontSize: 14 }}>
                        {isBroker
                            ? 'Clients who have reached out to you for property guidance'
                            : 'Track all your consultation requests to brokers'
                        }
                    </p>
                </div>

                {fetching ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-lg)' }} />)}
                    </div>
                ) : consultations.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {consultations.map(c => (
                            <ConsultationCard key={c.id} consultation={c} isBroker={isBroker} />
                        ))}
                    </div>
                ) : (
                    <div style={{
                        textAlign: 'center', padding: '72px 20px',
                        background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--border-subtle)',
                    }}>
                        <MessageSquare size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>
                            No consultations yet
                        </h3>
                        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>
                            {isBroker
                                ? 'Complete your profile to start receiving consultation requests from potential clients'
                                : "Browse brokers and send your first consultation request"
                            }
                        </p>
                        <button
                            onClick={() => router.push(isBroker ? '/dashboard/profile' : '/brokers')}
                            className="btn btn-primary"
                        >
                            {isBroker ? 'Complete Profile' : 'Find a Broker'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function ConsultationCard({ consultation: c, isBroker }: { consultation: any; isBroker: boolean }) {
    const statusConfig: Record<string, { color: string; bg: string; label: string; icon: React.ReactNode }> = {
        pending: { color: 'var(--warning)', bg: 'rgba(245,158,11,0.1)', label: 'Pending', icon: <Clock size={12} /> },
        accepted: { color: 'var(--success)', bg: 'rgba(34,197,94,0.1)', label: 'Accepted', icon: <Check size={12} /> },
        rejected: { color: 'var(--error)', bg: 'rgba(239,68,68,0.1)', label: 'Declined', icon: <X size={12} /> },
        completed: { color: 'var(--accent-light)', bg: 'rgba(124,92,219,0.1)', label: 'Completed', icon: <Check size={12} /> },
    };

    const status = statusConfig[c.status] || statusConfig.pending;

    return (
        <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{
                    width: 44, height: 44,
                    background: 'rgba(212,175,55,0.1)',
                    borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    {isBroker ? <User size={20} color="var(--gold)" /> : <Building2 size={20} color="var(--gold)" />}
                </div>

                <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
                        <span style={{ fontSize: 15, fontWeight: 700 }}>
                            {isBroker ? c.customer_name : c.broker_name}
                        </span>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            padding: '2px 10px',
                            background: status.bg, color: status.color,
                            borderRadius: 100, fontSize: 11, fontWeight: 600,
                        }}>
                            {status.icon} {status.label}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>
                            {new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                    </div>

                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                        {c.property_type && (
                            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                                🏠 {c.property_type}
                            </span>
                        )}
                        {c.budget && (
                            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                                💰 {c.budget}
                            </span>
                        )}
                        {(c.location || c.location_city) && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-secondary)' }}>
                                <MapPin size={11} /> {c.location || c.location_city}
                            </span>
                        )}
                        {isBroker && c.customer_phone && (
                            <span style={{ fontSize: 12, color: 'var(--gold)' }}>📞 {c.customer_phone}</span>
                        )}
                    </div>

                    {c.message && (
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, borderLeft: '2px solid var(--border-subtle)', paddingLeft: 10 }}>
                            &ldquo;{c.message}&rdquo;
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
