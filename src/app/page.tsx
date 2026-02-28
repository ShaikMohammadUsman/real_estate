'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Star, Shield, TrendingUp, Users, Building2, ArrowRight, Check, ChevronRight } from 'lucide-react';
import BrokerCard from '@/components/BrokerCard';

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'];

const SPECIALIZATIONS = [
  'Residential', 'Commercial', 'Luxury', 'Industrial', 'Land',
  'Investment', 'Rental', 'New Projects'
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [featuredBrokers, setFeaturedBrokers] = useState<any[]>([]);
  const [loadingBrokers, setLoadingBrokers] = useState(true);
  const [stats, setStats] = useState({ brokers: 0, cities: 0, deals: 0 });

  useEffect(() => {
    fetchFeaturedBrokers();
    fetchStats();
  }, []);

  const fetchFeaturedBrokers = async () => {
    try {
      const res = await fetch('/api/brokers?limit=6&sortBy=featured');
      if (res.ok) {
        const data = await res.json();
        setFeaturedBrokers(data.brokers || []);
      }
    } catch { }
    setLoadingBrokers(false);
  };

  const fetchStats = async () => {
    // Simulate platform stats
    setStats({ brokers: 1200, cities: 48, deals: 15000 });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (searchCity) params.set('city', searchCity);
    router.push(`/brokers?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        paddingTop: 72,
      }}>
        {/* Animated background */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(212,175,55,0.12) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 80% 80%, rgba(124,92,219,0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: 80, paddingBottom: 80 }}>
          <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <span className="badge badge-gold">
                <Star size={10} fill="currentColor" />
                India's #1 Broker Discovery Platform
              </span>
            </div>

            {/* Headline */}
            <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 900, marginBottom: 24, lineHeight: 1.1 }}>
              Find the Perfect{' '}
              <span className="gradient-text">Real Estate Broker</span>
              {' '}Near You
            </h1>

            <p style={{ fontSize: 18, color: 'var(--text-secondary)', marginBottom: 48, maxWidth: 560, margin: '0 auto 48px' }}>
              Connect with verified, top-rated brokers across India. Compare commission rates,
              read genuine reviews, and make your property dream a reality.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} style={{
              display: 'flex', gap: 12, flexWrap: 'wrap',
              background: 'rgba(22,22,30,0.9)',
              border: '1px solid rgba(212,175,55,0.2)',
              borderRadius: 'var(--radius-xl)',
              padding: 12,
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 48px rgba(0,0,0,0.4)',
              maxWidth: 700, margin: '0 auto',
            }}>
              <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px' }}>
                <Search size={18} color="var(--text-muted)" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by name, agency, specialization..."
                  style={{
                    background: 'none', border: 'none', outline: 'none',
                    color: 'var(--text-primary)', fontSize: 15, width: '100%',
                    fontFamily: 'Inter',
                  }}
                />
              </div>
              <div style={{ width: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px' }}>
                <MapPin size={18} color="var(--text-muted)" />
                <select
                  value={searchCity}
                  onChange={e => setSearchCity(e.target.value)}
                  style={{
                    background: 'none', border: 'none', outline: 'none',
                    color: searchCity ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontSize: 15, width: '100%', cursor: 'pointer',
                    fontFamily: 'Inter',
                    appearance: 'none',
                  }}
                >
                  <option value="">Any City</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
                <Search size={16} /> Search
              </button>
            </form>

            {/* Quick filters */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 20 }}>
              {SPECIALIZATIONS.slice(0, 6).map(s => (
                <button
                  key={s}
                  onClick={() => router.push(`/brokers?specialization=${s}`)}
                  className="tag"
                  style={{ fontSize: 12 }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Stats bar */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 48, marginTop: 72,
            flexWrap: 'wrap',
          }}>
            {[
              { value: '1,200+', label: 'Verified Brokers', icon: '👔' },
              { value: '48', label: 'Cities Covered', icon: '🏙️' },
              { value: '15K+', label: 'Successful Deals', icon: '🤝' },
              { value: '4.8★', label: 'Average Rating', icon: '⭐' },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Plus Jakarta Sans' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  {stat.icon} {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section" style={{ background: 'var(--dark-2)', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="badge badge-purple" style={{ marginBottom: 16 }}>Simple Process</span>
            <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>
              How <span className="gradient-text">RealtorConnect</span> Works
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 520, margin: '0 auto' }}>
              Find, compare, and connect with your ideal broker in minutes — not days.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {[
              {
                step: '01',
                title: 'Search Brokers',
                desc: 'Filter by city, specialization, experience, and commission rates to find your ideal match.',
                icon: <Search size={28} color="var(--gold)" />,
              },
              {
                step: '02',
                title: 'Compare Profiles',
                desc: 'Read bio, client reviews, past deals, and verified credentials to make an informed choice.',
                icon: <Star size={28} color="var(--gold)" />,
              },
              {
                step: '03',
                title: 'Request Consultation',
                desc: 'Send a consultation request directly. Share your property requirements and budget.',
                icon: <Users size={28} color="var(--gold)" />,
              },
              {
                step: '04',
                title: 'Close the Deal',
                desc: 'Work with your chosen broker and leave a review to help other buyers and sellers.',
                icon: <Building2 size={28} color="var(--gold)" />,
              },
            ].map((step, i) => (
              <div key={i} className="card" style={{ padding: 28 }}>
                <div style={{
                  width: 56, height: 56,
                  background: 'rgba(212,175,55,0.1)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20,
                }}>
                  {step.icon}
                </div>
                <div style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 700, marginBottom: 8, letterSpacing: '0.1em' }}>
                  STEP {step.step}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Brokers */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span className="badge badge-gold" style={{ marginBottom: 12 }}>Top Rated</span>
              <h2 style={{ fontSize: 36, fontWeight: 800 }}>Featured Brokers</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Handpicked, verified brokers with stellar track records</p>
            </div>
            <Link href="/brokers" className="btn btn-secondary" style={{ gap: 8 }}>
              View All Brokers <ArrowRight size={16} />
            </Link>
          </div>

          {loadingBrokers ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 340, borderRadius: 'var(--radius-lg)' }} />
              ))}
            </div>
          ) : featuredBrokers.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
              {featuredBrokers.map(broker => (
                <BrokerCard key={broker.id} broker={broker} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Building2 size={48} color="var(--text-muted)" style={{ marginBottom: 16 }} />
              <h3 style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>No brokers yet</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
                Be the first broker to create a profile on RealtorConnect!
              </p>
              <Link href="/auth/register?role=broker" className="btn btn-primary">
                Register as Broker
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* For Brokers CTA */}
      <section className="section" style={{ background: 'var(--dark-2)' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(124,92,219,0.08) 100%)',
            border: '1px solid rgba(212,175,55,0.15)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'clamp(40px, 6vw, 72px)',
            display: 'flex', gap: 48, alignItems: 'center', flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <span className="badge badge-gold" style={{ marginBottom: 16 }}>For Brokers</span>
              <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>
                Grow Your Real Estate Business
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 28 }}>
                Create a professional profile, showcase your expertise, and connect with motivated
                buyers and sellers across India. Join 1,200+ successful brokers on RealtorConnect.
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
                {[
                  'Free profile creation — no subscription fees',
                  'Get discovered by customers in your city',
                  'Build credibility with verified reviews',
                  'Receive consultation requests directly',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text-secondary)' }}>
                    <div style={{ width: 20, height: 20, background: 'rgba(34,197,94,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Check size={12} color="var(--success)" strokeWidth={2.5} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register?role=broker" className="btn btn-primary btn-lg">
                Create Broker Profile <ArrowRight size={18} />
              </Link>
            </div>
            <div style={{ flex: 1, minWidth: 240, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: '🏆', title: 'Top Exposure', desc: 'Get featured in search results and on the homepage' },
                { icon: '📊', title: 'Profile Analytics', desc: 'Track views, clicks, and consultation requests' },
                { icon: '✅', title: 'Verified Badge', desc: 'Get verified to build instant trust with clients' },
              ].map(item => (
                <div key={item.title} style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: 20,
                  display: 'flex', gap: 14, alignItems: 'flex-start',
                }}>
                  <span style={{ fontSize: 28 }}>{item.icon}</span>
                  <div>
                    <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{item.title}</h4>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, marginBottom: 16 }}>
            Ready to Find Your <span className="gradient-text">Dream Property</span>?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
            Join thousands of happy homebuyers and sellers who found the right broker on RealtorConnect.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/brokers" className="btn btn-primary btn-lg">
              <Search size={18} /> Find a Broker
            </Link>
            <Link href="/auth/register" className="btn btn-secondary btn-lg">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: 'var(--dark-2)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '40px 0',
      }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, background: 'var(--gradient-gold)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={16} color="#0A0A0F" />
              </div>
              <span style={{ fontWeight: 700, fontFamily: 'Plus Jakarta Sans' }}>RealtorConnect</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              © 2024 RealtorConnect. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: 20 }}>
              {['Privacy', 'Terms', 'Contact'].map(l => (
                <a key={l} href="#" style={{ fontSize: 13, color: 'var(--text-muted)' }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
