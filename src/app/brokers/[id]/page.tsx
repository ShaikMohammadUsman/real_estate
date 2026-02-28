'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Star, MapPin, Briefcase, Phone, Mail, Globe, Linkedin, Instagram,
    BadgeCheck, ArrowLeft, Send, Building2, TrendingUp, Users,
    DollarSign, Home, MessageSquare, Share2, Heart
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function BrokerProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const { user, token } = useAuth();

    const [broker, setBroker] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [consultModal, setConsultModal] = useState(false);
    const [reviewModal, setReviewModal] = useState(false);
    const [saved, setSaved] = useState(false);

    const [consultForm, setConsultForm] = useState({
        message: '', property_type: '', budget: '', location: ''
    });
    const [reviewForm, setReviewForm] = useState({
        rating: 5, title: '', comment: '', transaction_type: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        fetchBroker();
    }, [id]);

    const fetchBroker = async () => {
        try {
            const res = await fetch(`/api/brokers/${id}`);
            if (res.ok) {
                const data = await res.json();
                setBroker(data.broker);
                setReviews(data.reviews || []);
            }
        } catch { }
        setLoading(false);
    };

    const submitConsultation = async () => {
        if (!user) { router.push('/auth/login'); return; }
        setSubmitting(true);
        try {
            const res = await fetch('/api/consultations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ broker_id: broker.id, ...consultForm })
            });
            if (res.ok) {
                setConsultModal(false);
                setSuccessMsg('Consultation request sent! The broker will contact you shortly.');
                setConsultForm({ message: '', property_type: '', budget: '', location: '' });
                setTimeout(() => setSuccessMsg(''), 5000);
            }
        } catch { }
        setSubmitting(false);
    };

    const submitReview = async () => {
        if (!user) { router.push('/auth/login'); return; }
        setSubmitting(true);
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ broker_id: broker.id, ...reviewForm })
            });
            if (res.ok) {
                setReviewModal(false);
                setSuccessMsg('Review submitted! Thank you for your feedback.');
                fetchBroker();
                setTimeout(() => setSuccessMsg(''), 4000);
            }
        } catch { }
        setSubmitting(false);
    };

    if (loading) {
        return (
            <div style={{ paddingTop: 100 }}>
                <div className="container">
                    <div className="skeleton" style={{ height: 280, borderRadius: 'var(--radius-xl)', marginBottom: 24 }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {[200, 160, 280].map(h => <div key={h} className="skeleton" style={{ height: h, borderRadius: 'var(--radius-lg)' }} />)}
                        </div>
                        <div className="skeleton" style={{ height: 400, borderRadius: 'var(--radius-lg)' }} />
                    </div>
                </div>
            </div>
        );
    }

    if (!broker) {
        return (
            <div style={{ paddingTop: 120, textAlign: 'center' }}>
                <h2 style={{ color: 'var(--text-secondary)' }}>Broker not found</h2>
                <button onClick={() => router.push('/brokers')} className="btn btn-primary" style={{ marginTop: 16 }}>
                    Browse Brokers
                </button>
            </div>
        );
    }

    const initials = broker.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    const stars = Math.round(broker.avg_rating || 0);

    return (
        <div style={{ paddingTop: 80, paddingBottom: 80 }}>
            {/* Success toast */}
            {successMsg && (
                <div style={{
                    position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
                    background: 'var(--success)', color: 'white', padding: '14px 20px',
                    borderRadius: 'var(--radius-md)', fontSize: 14, fontWeight: 500,
                    boxShadow: 'var(--shadow-lg)', maxWidth: 360,
                    animation: 'fadeIn 0.3s ease',
                }}>
                    ✅ {successMsg}
                </div>
            )}

            {/* Cover / Hero */}
            <div style={{
                height: 220,
                background: broker.cover_image
                    ? `url(${broker.cover_image}) center/cover`
                    : 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(124,92,219,0.15) 100%)',
                position: 'relative',
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, transparent 40%, rgba(10,10,15,0.9) 100%)',
                }} />
            </div>

            <div className="container">
                {/* Back button */}
                <button
                    onClick={() => router.back()}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        background: 'none', border: 'none', color: 'var(--text-secondary)',
                        cursor: 'pointer', fontSize: 13, fontWeight: 500,
                        marginBottom: 16, marginTop: -16,
                    }}
                >
                    <ArrowLeft size={16} /> Back to search
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28, alignItems: 'start' }}>
                    {/* Main content */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {/* Profile header card */}
                        <div className="card" style={{ padding: 28 }}>
                            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                {broker.avatar ? (
                                    <img src={broker.avatar} alt={broker.name} className="avatar" style={{ width: 88, height: 88, border: '3px solid rgba(212,175,55,0.3)' }} />
                                ) : (
                                    <div className="avatar-placeholder" style={{ width: 88, height: 88, fontSize: 28, border: '3px solid rgba(212,175,55,0.3)' }}>
                                        {initials}
                                    </div>
                                )}

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                                        <h1 style={{ fontSize: 26, fontWeight: 800 }}>{broker.name}</h1>
                                        {broker.is_verified ? (
                                            <span className="badge badge-success" style={{ gap: 4 }}>
                                                <BadgeCheck size={12} /> Verified
                                            </span>
                                        ) : null}
                                        {broker.is_featured ? (
                                            <span className="badge badge-gold">⭐ Featured</span>
                                        ) : null}
                                    </div>

                                    {broker.headline && (
                                        <p style={{ fontSize: 15, color: 'var(--gold)', fontWeight: 500, marginTop: 4 }}>{broker.headline}</p>
                                    )}
                                    {broker.agency && (
                                        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{broker.agency}</p>
                                    )}

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
                                        {/* Rating */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <div className="stars">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <Star key={i} size={14} fill={i <= stars ? 'currentColor' : 'none'} strokeWidth={i <= stars ? 0 : 1.5} />
                                                ))}
                                            </div>
                                            <span style={{ fontSize: 14, fontWeight: 700 }}>{broker.avg_rating?.toFixed(1) || 'New'}</span>
                                            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>({broker.total_reviews || 0} reviews)</span>
                                        </div>

                                        {/* Location */}
                                        {broker.location_city && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-secondary)' }}>
                                                <MapPin size={13} color="var(--gold)" />
                                                {[broker.location_city, broker.location_state].filter(Boolean).join(', ')}
                                            </div>
                                        )}

                                        {/* Experience */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-secondary)' }}>
                                            <Briefcase size={13} color="var(--gold)" />
                                            {broker.years_experience || 0} years exp.
                                        </div>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button
                                        onClick={() => setSaved(!saved)}
                                        className="btn btn-ghost btn-sm"
                                        style={{ padding: '8px 10px', color: saved ? '#ef4444' : 'var(--text-secondary)' }}
                                    >
                                        <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
                                    </button>
                                    <button className="btn btn-ghost btn-sm" style={{ padding: '8px 10px' }}>
                                        <Share2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Stats row */}
                            <div style={{
                                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: 16, marginTop: 24,
                                padding: '20px',
                                background: 'rgba(255,255,255,0.02)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-subtle)',
                            }}>
                                {[
                                    { label: 'Total Deals', value: broker.total_deals || 0, icon: <TrendingUp size={18} color="var(--gold)" /> },
                                    { label: 'Properties Sold', value: broker.properties_sold || 0, icon: <Building2 size={18} color="var(--gold)" /> },
                                    { label: 'Properties Rented', value: broker.properties_rented || 0, icon: <Home size={18} color="var(--gold)" /> },
                                    { label: 'Reviews', value: broker.total_reviews || 0, icon: <Star size={18} color="var(--gold)" /> },
                                ].map(stat => (
                                    <div key={stat.label} style={{ textAlign: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>{stat.icon}</div>
                                        <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Plus Jakarta Sans' }}>{stat.value}</div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bio */}
                        {broker.bio && (
                            <div className="card" style={{ padding: 28 }}>
                                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>About</h2>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 15 }}>{broker.bio}</p>
                            </div>
                        )}

                        {/* Specializations & Details */}
                        <div className="card" style={{ padding: 28 }}>
                            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Specializations & Details</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                                <div>
                                    <h3 style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Property Types</h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                        {(broker.specializations || []).map((s: string) => (
                                            <span key={s} className="badge badge-purple">{s}</span>
                                        ))}
                                        {!(broker.specializations?.length) && <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Not specified</span>}
                                    </div>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Transaction Types</h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                        {(broker.available_for || []).map((t: string) => (
                                            <span key={t} className="badge badge-gold">{t}</span>
                                        ))}
                                    </div>
                                </div>
                                {broker.languages?.length > 0 && (
                                    <div>
                                        <h3 style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Languages</h3>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                            {broker.languages.map((l: string) => (
                                                <span key={l} className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>{l}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {broker.license_number && (
                                    <div>
                                        <h3 style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>License</h3>
                                        <p style={{ fontSize: 14, color: 'var(--text-primary)', fontFamily: 'monospace' }}>{broker.license_number}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="card" style={{ padding: 28 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                                <h2 style={{ fontSize: 18, fontWeight: 700 }}>
                                    Client Reviews ({broker.total_reviews || 0})
                                </h2>
                                {user && user.role === 'customer' && (
                                    <button onClick={() => setReviewModal(true)} className="btn btn-secondary btn-sm">
                                        <Star size={14} /> Write Review
                                    </button>
                                )}
                            </div>

                            {reviews.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    {reviews.map(review => (
                                        <ReviewCard key={review.id} review={review} />
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                                    <Star size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                                    <p style={{ fontSize: 14 }}>No reviews yet. Be the first to review!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 100 }}>
                        {/* Commission Card */}
                        <div className="card" style={{ padding: 24, border: '1px solid rgba(212,175,55,0.2)', background: 'linear-gradient(135deg, rgba(212,175,55,0.05) 0%, rgba(22,22,30,1) 60%)' }}>
                            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Commission Rate</h3>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                                <span style={{ fontSize: 36, fontWeight: 900, color: 'var(--gold)', fontFamily: 'Plus Jakarta Sans' }}>
                                    {broker.commission_min || 1}%
                                </span>
                                {broker.commission_max && broker.commission_max !== broker.commission_min && (
                                    <span style={{ fontSize: 20, color: 'var(--text-muted)' }}>
                                        – {broker.commission_max}%
                                    </span>
                                )}
                            </div>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                                {broker.commission_type === 'fixed' ? 'Fixed fee' : 'of property value'}
                            </p>
                            <div className="divider" style={{ margin: '16px 0' }} />
                            <button
                                onClick={() => {
                                    if (!user) router.push('/auth/login');
                                    else setConsultModal(true);
                                }}
                                className="btn btn-primary"
                                style={{ width: '100%', fontSize: 14 }}
                            >
                                <MessageSquare size={16} />
                                Request Consultation
                            </button>
                            {!user && (
                                <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
                                    Sign in to send a consultation request
                                </p>
                            )}
                        </div>

                        {/* Contact Info */}
                        {(broker.phone || broker.email || broker.website || broker.linkedin || broker.instagram) && (
                            <div className="card" style={{ padding: 24 }}>
                                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Contact</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {broker.phone && (
                                        <a href={`tel:${broker.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
                                            <Phone size={14} color="var(--gold)" /> {broker.phone}
                                        </a>
                                    )}
                                    {broker.email && (
                                        <a href={`mailto:${broker.email}`} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
                                            <Mail size={14} color="var(--gold)" /> {broker.email}
                                        </a>
                                    )}
                                    {broker.website && (
                                        <a href={broker.website} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
                                            <Globe size={14} color="var(--gold)" /> Website
                                        </a>
                                    )}
                                    {broker.linkedin && (
                                        <a href={broker.linkedin} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
                                            <Linkedin size={14} color="var(--gold)" /> LinkedIn
                                        </a>
                                    )}
                                    {broker.instagram && (
                                        <a href={broker.instagram} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
                                            <Instagram size={14} color="var(--gold)" /> Instagram
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>

            {/* Consultation Modal */}
            {consultModal && (
                <Modal title="Request Consultation" onClose={() => setConsultModal(false)}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                            Send a consultation request to <strong>{broker.name}</strong>. They will reach out to you soon.
                        </p>
                        <div className="input-group">
                            <label className="input-label">Property Type</label>
                            <select className="input" value={consultForm.property_type} onChange={e => setConsultForm(p => ({ ...p, property_type: e.target.value }))}>
                                <option value="">Select type</option>
                                {['Apartment', 'Villa', 'Plot', 'Commercial', 'Office', 'Warehouse'].map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Budget Range</label>
                            <select className="input" value={consultForm.budget} onChange={e => setConsultForm(p => ({ ...p, budget: e.target.value }))}>
                                <option value="">Select budget</option>
                                {['Under ₹30L', '₹30L-₹60L', '₹60L-₹1Cr', '₹1Cr-₹2Cr', '₹2Cr-₹5Cr', 'Above ₹5Cr'].map(b => <option key={b}>{b}</option>)}
                            </select>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Preferred Location</label>
                            <input className="input" placeholder="e.g., Bandra West, Mumbai" value={consultForm.location} onChange={e => setConsultForm(p => ({ ...p, location: e.target.value }))} />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Message</label>
                            <textarea className="input" placeholder="Tell the broker about your requirements..." value={consultForm.message} onChange={e => setConsultForm(p => ({ ...p, message: e.target.value }))} rows={4} />
                        </div>
                        <button onClick={submitConsultation} disabled={submitting} className="btn btn-primary" style={{ marginTop: 4 }}>
                            {submitting ? 'Sending...' : <><Send size={16} /> Send Request</>}
                        </button>
                    </div>
                </Modal>
            )}

            {/* Review Modal */}
            {reviewModal && (
                <Modal title="Write a Review" onClose={() => setReviewModal(false)}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div className="input-group">
                            <label className="input-label">Your Rating</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                                {[1, 2, 3, 4, 5].map(i => (
                                    <button
                                        key={i}
                                        onClick={() => setReviewForm(p => ({ ...p, rating: i }))}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: i <= reviewForm.rating ? 'var(--gold)' : 'var(--text-muted)' }}
                                    >
                                        <Star size={28} fill={i <= reviewForm.rating ? 'currentColor' : 'none'} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Transaction Type</label>
                            <select className="input" value={reviewForm.transaction_type} onChange={e => setReviewForm(p => ({ ...p, transaction_type: e.target.value }))}>
                                <option value="">Select</option>
                                {['Bought', 'Sold', 'Rented', 'Listed'].map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Review Title</label>
                            <input className="input" placeholder="Sum up your experience" value={reviewForm.title} onChange={e => setReviewForm(p => ({ ...p, title: e.target.value }))} />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Your Review</label>
                            <textarea className="input" placeholder="Share your experience with this broker..." value={reviewForm.comment} onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))} rows={4} />
                        </div>
                        <button onClick={submitReview} disabled={submitting} className="btn btn-primary">
                            {submitting ? 'Submitting...' : <><Star size={15} /> Submit Review</>}
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

function ReviewCard({ review }: { review: any }) {
    const initials = review.reviewer_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    return (
        <div style={{ padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div className="avatar-placeholder" style={{ width: 36, height: 36, fontSize: 13 }}>{initials}</div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{review.reviewer_name}</span>
                        <div className="stars" style={{ fontSize: 12 }}>
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={11} fill={i <= review.rating ? 'currentColor' : 'none'} strokeWidth={i <= review.rating ? 0 : 1.5} />)}
                        </div>
                        {review.transaction_type && <span className="badge" style={{ fontSize: 9, background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>{review.transaction_type}</span>}
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>
                            {new Date(review.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                        </span>
                    </div>
                    {review.title && <p style={{ fontWeight: 600, fontSize: 14, marginTop: 6 }}>{review.title}</p>}
                    {review.comment && <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.7 }}>{review.comment}</p>}
                </div>
            </div>
        </div>
    );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 9000,
                background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 24,
            }}
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                padding: 28, width: '100%', maxWidth: 520,
                maxHeight: '90vh', overflowY: 'auto',
                boxShadow: 'var(--shadow-lg)',
                animation: 'fadeIn 0.2s ease',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700 }}>{title}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
                </div>
                {children}
            </div>
        </div>
    );
}
