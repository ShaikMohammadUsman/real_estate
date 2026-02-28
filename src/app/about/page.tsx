'use client';
import { Building2, Search, Star, Users, CheckCircle2, ArrowRight, ShieldCheck, Zap, BarChart3, Clock } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div style={{ minHeight: '100vh', paddingTop: 80 }}>
            {/* Hero Section */}
            <section style={{
                padding: '80px 0',
                background: 'radial-gradient(circle at 50% -20%, rgba(212,175,55,0.15) 0%, transparent 50%)',
                textAlign: 'center'
            }}>
                <div className="container">
                    <span className="badge badge-gold" style={{ marginBottom: 16 }}>Transparency First</span>
                    <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900, marginBottom: 20 }}>
                        How <span className="gradient-text">RealtorConnect</span> Works
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 18, maxWidth: 640, margin: '0 auto', lineHeight: 1.6 }}>
                        India&apos;s most transparent platform connecting property seekers with verified real estate brokers.
                        No middleman fees, just direct connections.
                    </p>
                </div>
            </section>

            {/* For Customers */}
            <section className="section">
                <div className="container">
                    <div style={{ display: 'flex', gap: 48, alignItems: 'center', flexWrap: 'wrap-reverse' }}>
                        <div style={{ flex: 1, minWidth: 320 }}>
                            <span className="badge badge-purple" style={{ marginBottom: 16 }}>For Property Seekers</span>
                            <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 24 }}>Find Your Ideal Broker in 3 Steps</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                <StepItem
                                    icon={<Search size={24} color="var(--gold)" />}
                                    title="1. Search & Filter"
                                    desc="Browse brokers by city, specialization (like luxury or villas), or specific developers they deal with."
                                />
                                <StepItem
                                    icon={<Star size={24} color="var(--gold)" />}
                                    title="2. Compare Verified Profiles"
                                    desc="Check their years of experience, past deal history, and genuine reviews from other customers."
                                />
                                <StepItem
                                    icon={<Clock size={24} color="var(--gold)" />}
                                    title="3. Request Consultation"
                                    desc="Send a request directly. No need for endless phone calls. The broker will reach out to you."
                                />
                            </div>
                            <Link href="/brokers" className="btn btn-primary" style={{ marginTop: 32 }}>
                                Start Searching <ArrowRight size={18} />
                            </Link>
                        </div>
                        <div style={{ flex: 1, minWidth: 320 }}>
                            <div style={{
                                background: 'var(--surface-2)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-2xl)',
                                padding: 40,
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, background: 'var(--gold)', opacity: 0.1, borderRadius: '50%' }} />
                                <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Why Search Here?</h3>
                                <ul style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    {[
                                        'Verified credentials & RERA numbers',
                                        'Transparent commission rates',
                                        'Genuine track record of properties sold',
                                        'No Spam — You initiate the contact'
                                    ].map(text => (
                                        <li key={text} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: 'var(--text-secondary)' }}>
                                            <CheckCircle2 size={18} color="var(--success)" /> {text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* For Brokers */}
            <section className="section" style={{ background: 'var(--dark-2)' }}>
                <div className="container">
                    <div style={{ display: 'flex', gap: 48, alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: 320 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <FeatureCard icon={<Zap size={22} />} title="Instant Live" desc="Get your profile live in under 2 minutes." />
                                <FeatureCard icon={<ShieldCheck size={22} />} title="Verified" desc="Build trust with a verified broker badge." />
                                <FeatureCard icon={<BarChart3 size={22} />} title="Analytics" desc="Track your profile views & performance." />
                                <FeatureCard icon={<Users size={22} />} title="Lead Gen" desc="Direct consultation requests from buyers." />
                            </div>
                        </div>
                        <div style={{ flex: 1, minWidth: 320 }}>
                            <span className="badge badge-gold" style={{ marginBottom: 16 }}>For Professionals</span>
                            <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 24 }}>Empowering India&apos;s Top Brokers</h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 28 }}>
                                In an industry that lacks structure, RealtorConnect provides a professional standard.
                                Stop relying only on word-of-mouth. Build a digital legacy backed by your actual performance.
                            </p>
                            <Link href="/auth/register?role=broker" className="btn btn-secondary">
                                Join as a Broker <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ or Value Props */}
            <section className="section">
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 48 }}>The RealtorConnect Promise</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
                        <ValueProp
                            title="Direct Connections"
                            desc="We are not a brokerage. We are a search engine. You connect directly with the broker of your choice."
                        />
                        <ValueProp
                            title="Zero Subscription"
                            desc="Brokers can list for free. We believe in providing the best results to customers, not just the ones who pay most."
                        />
                        <ValueProp
                            title="Verified Reviews"
                            desc="Every review on our platform is tied to an actual transaction request, ensuring authenticity."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ background: 'var(--dark-2)', borderTop: '1px solid var(--border-subtle)', padding: '60px 0 40px' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 32, height: 32, background: 'var(--gradient-gold)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Building2 size={16} color="#0A0A0F" />
                            </div>
                            <span style={{ fontWeight: 700, fontFamily: 'Plus Jakarta Sans' }}>RealtorConnect</span>
                        </div>
                        <div style={{ display: 'flex', gap: 32 }}>
                            <Link href="/brokers" style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Find Brokers</Link>
                            <Link href="/auth/login" style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Sign In</Link>
                            <Link href="/auth/register" style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Join Platform</Link>
                        </div>
                    </div>
                    <div className="divider" />
                    <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
                        © 2024 RealtorConnect. Designed for the future of Indian Real Estate.
                    </p>
                </div>
            </footer>
        </div>
    );
}

function StepItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div style={{ display: 'flex', gap: 16 }}>
            <div style={{
                width: 44, height: 44,
                background: 'rgba(212,175,55,0.1)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
            }}>
                {icon}
            </div>
            <div>
                <h4 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{title}</h4>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</p>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ color: 'var(--gold)', marginBottom: 16, display: 'flex', justifyContent: 'center' }}>{icon}</div>
            <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{title}</h4>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</p>
        </div>
    );
}

function ValueProp({ title, desc }: { title: string, desc: string }) {
    return (
        <div style={{ padding: 20 }}>
            <h3 style={{ fontSize: 19, fontWeight: 800, marginBottom: 12, color: 'var(--gold)' }}>{title}</h3>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{desc}</p>
        </div>
    );
}
