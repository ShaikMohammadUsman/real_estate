'use client';
import Link from 'next/link';
import { Star, MapPin, Briefcase, BadgeCheck, TrendingUp } from 'lucide-react';

interface Broker {
    id: number;
    name: string;
    avatar?: string;
    headline?: string;
    bio?: string;
    agency?: string;
    location_city?: string;
    location_state?: string;
    years_experience?: number;
    specializations?: string[];
    commission_min?: number;
    commission_max?: number;
    avg_rating?: number;
    total_reviews?: number;
    total_deals?: number;
    is_verified?: number;
    is_featured?: number;
    available_for?: string[];
}

interface BrokerCardProps {
    broker: Broker;
}

export default function BrokerCard({ broker }: BrokerCardProps) {
    const initials = broker.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'B';
    const stars = Math.round(broker.avg_rating || 0);
    const specs = broker.specializations?.slice(0, 2) || [];

    return (
        <Link href={`/brokers/${broker.id}`}>
            <div className="card" style={{ cursor: 'pointer', position: 'relative', height: '100%' }}>
                {/* Featured ribbon */}
                {broker.is_featured ? (
                    <div style={{
                        position: 'absolute', top: 0, right: 0,
                        background: 'var(--gradient-gold)',
                        color: '#0A0A0F',
                        fontSize: 10, fontWeight: 700,
                        padding: '4px 12px',
                        borderRadius: '0 var(--radius-lg) 0 var(--radius-md)',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                    }}>
                        ⭐ Featured
                    </div>
                ) : null}

                <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                        {broker.avatar ? (
                            <img src={broker.avatar} alt={broker.name} className="avatar" style={{ width: 60, height: 60 }} />
                        ) : (
                            <div className="avatar-placeholder" style={{ width: 60, height: 60, fontSize: 20 }}>
                                {initials}
                            </div>
                        )}

                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                                    {broker.name}
                                </h3>
                                {broker.is_verified ? (
                                    <BadgeCheck size={16} color="var(--success)" />
                                ) : null}
                            </div>
                            {broker.headline && (
                                <p style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 500, marginTop: 2 }}>
                                    {broker.headline}
                                </p>
                            )}
                            {broker.agency && (
                                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{broker.agency}</p>
                            )}
                        </div>
                    </div>

                    {/* Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="stars">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} size={13} fill={i <= stars ? 'currentColor' : 'none'} strokeWidth={i <= stars ? 0 : 1.5} />
                            ))}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                            {broker.avg_rating ? broker.avg_rating.toFixed(1) : 'New'}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            ({broker.total_reviews || 0} reviews)
                        </span>
                    </div>

                    {/* Location & Experience */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                            <MapPin size={13} color="var(--gold)" />
                            {[broker.location_city, broker.location_state].filter(Boolean).join(', ') || 'Location not set'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                            <Briefcase size={13} color="var(--gold)" />
                            {broker.years_experience || 0} years experience
                        </div>
                    </div>

                    {/* Specializations */}
                    {specs.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {specs.map((s: string) => (
                                <span key={s} className="badge badge-purple" style={{ fontSize: 10 }}>{s}</span>
                            ))}
                            {(broker.specializations?.length || 0) > 2 && (
                                <span className="badge" style={{ fontSize: 10, background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>
                                    +{(broker.specializations?.length || 0) - 2} more
                                </span>
                            )}
                        </div>
                    )}

                    {/* Stats row */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                        gap: 8, marginTop: 'auto',
                    }}>
                        <StatMini label="Deals" value={broker.total_deals || 0} />
                        <StatMini label="Commission" value={`${broker.commission_min || 0}%`} subtitle="from" />
                        <StatMini label="Reviews" value={broker.total_reviews || 0} />
                    </div>

                    {/* CTA */}
                    <div
                        className="btn btn-primary"
                        style={{ marginTop: 4, borderRadius: 'var(--radius-sm)', fontSize: 13 }}
                    >
                        View Profile →
                    </div>
                </div>
            </div>
        </Link>
    );
}

function StatMini({ label, value, subtitle }: { label: string; value: string | number; subtitle?: string }) {
    return (
        <div style={{
            textAlign: 'center',
            padding: '8px 4px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
        }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gold)' }}>{value}</div>
            {subtitle && <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{subtitle}</div>}
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
        </div>
    );
}
