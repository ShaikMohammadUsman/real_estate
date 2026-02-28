'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Filter, X, SlidersHorizontal, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import BrokerCard from '@/components/BrokerCard';

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Bhopal', 'Patna', 'Nagpur', 'Indore'];
const STATES = ['Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Tamil Nadu', 'Gujarat', 'West Bengal', 'Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh', 'Bihar'];
const SPECIALIZATIONS = ['Residential', 'Commercial', 'Luxury', 'Industrial', 'Agricultural Land', 'Investment', 'Rental Properties', 'New Projects', 'Plots', 'Villas', 'Flats'];
const SORT_OPTIONS = [
    { value: 'featured', label: 'Featured First' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'experience', label: 'Most Experienced' },
    { value: 'deals', label: 'Most Deals Closed' },
    { value: 'commission_low', label: 'Lowest Commission' },
    { value: 'newest', label: 'Newest Profiles' },
];

function BrokersContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [brokers, setBrokers] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filtersOpen, setFiltersOpen] = useState(false);

    const [filters, setFilters] = useState({
        q: searchParams.get('q') || '',
        city: searchParams.get('city') || '',
        state: searchParams.get('state') || '',
        specialization: searchParams.get('specialization') || '',
        minRating: searchParams.get('minRating') || '0',
        maxCommission: searchParams.get('maxCommission') || '10',
        minExperience: searchParams.get('minExperience') || '0',
        transactionType: searchParams.get('transactionType') || '',
        sortBy: searchParams.get('sortBy') || 'featured',
        page: parseInt(searchParams.get('page') || '1'),
    });

    const fetchBrokers = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([k, v]) => {
                if (v && v !== '0' && v !== '10') params.set(k, String(v));
            });
            params.set('page', String(filters.page));
            params.set('limit', '12');

            const res = await fetch(`/api/brokers?${params}`);
            if (res.ok) {
                const data = await res.json();
                setBrokers(data.brokers || []);
                setTotal(data.total || 0);
                setTotalPages(data.totalPages || 0);
            }
        } catch { }
        setLoading(false);
    }, [filters]);

    useEffect(() => {
        fetchBrokers();
    }, [fetchBrokers]);

    const updateFilter = (key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const clearFilters = () => {
        setFilters({
            q: '', city: '', state: '', specialization: '',
            minRating: '0', maxCommission: '10', minExperience: '0',
            transactionType: '', sortBy: 'featured', page: 1,
        });
    };

    const hasActiveFilters = filters.city || filters.state || filters.specialization ||
        filters.minRating !== '0' || filters.maxCommission !== '10' ||
        filters.minExperience !== '0' || filters.transactionType;

    return (
        <div style={{ minHeight: '100vh', paddingTop: 80 }}>
            {/* Page Header */}
            <div style={{ background: 'var(--dark-2)', borderBottom: '1px solid var(--border-subtle)', padding: '24px 0 0' }}>
                <div className="container">
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, paddingBottom: 24 }}>
                        <div>
                            <h1 style={{ fontSize: 28, fontWeight: 800 }}>Find Real Estate Brokers</h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
                                {loading ? 'Searching...' : `${total} broker${total !== 1 ? 's' : ''} found`}
                            </p>
                        </div>

                        {/* Top controls */}
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                            {/* Sort */}
                            <select
                                value={filters.sortBy}
                                onChange={e => updateFilter('sortBy', e.target.value)}
                                className="input"
                                style={{ width: 'auto', fontSize: 13, padding: '8px 36px 8px 12px' }}
                            >
                                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>

                            <button
                                onClick={() => setFiltersOpen(!filtersOpen)}
                                className="btn btn-ghost btn-sm"
                                style={{ gap: 8, position: 'relative' }}
                            >
                                <SlidersHorizontal size={15} />
                                Filters
                                {hasActiveFilters && (
                                    <span style={{
                                        position: 'absolute', top: -4, right: -4,
                                        width: 8, height: 8, background: 'var(--gold)', borderRadius: '50%'
                                    }} />
                                )}
                            </button>

                            {hasActiveFilters && (
                                <button onClick={clearFilters} className="btn btn-ghost btn-sm" style={{ color: 'var(--error)', gap: 6 }}>
                                    <X size={14} /> Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Search bar */}
                    <div style={{ display: 'flex', gap: 12, paddingBottom: 24, flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: 240, position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, flexShrink: 0 }} />
                            <input
                                value={filters.q}
                                onChange={e => updateFilter('q', e.target.value)}
                                placeholder="Search by name, agency, or bio..."
                                className="input"
                                style={{ paddingLeft: 40 }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 200, position: 'relative' }}>
                            <MapPin size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, flexShrink: 0, zIndex: 1 }} />
                            <select
                                value={filters.city}
                                onChange={e => updateFilter('city', e.target.value)}
                                className="input"
                                style={{ paddingLeft: 40, flex: 1 }}
                            >
                                <option value="">All Cities</option>
                                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container" style={{ paddingTop: 24, paddingBottom: 80 }}>
                <div style={{ display: 'flex', gap: 24 }}>
                    {/* Sidebar Filters */}
                    {filtersOpen && (
                        <aside style={{
                            width: 260,
                            flexShrink: 0,
                            background: 'var(--surface)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-lg)',
                            padding: 24,
                            height: 'fit-content',
                            position: 'sticky',
                            top: 100,
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                <h3 style={{ fontSize: 15, fontWeight: 700 }}>Filters</h3>
                                <button onClick={() => setFiltersOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                    <X size={16} />
                                </button>
                            </div>

                            <FilterSection title="State">
                                <select value={filters.state} onChange={e => updateFilter('state', e.target.value)} className="input" style={{ fontSize: 13 }}>
                                    <option value="">All States</option>
                                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </FilterSection>

                            <FilterSection title="Specialization">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {SPECIALIZATIONS.map(s => (
                                        <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)' }}>
                                            <input
                                                type="radio"
                                                name="spec"
                                                value={s}
                                                checked={filters.specialization === s}
                                                onChange={() => updateFilter('specialization', filters.specialization === s ? '' : s)}
                                                style={{ accentColor: 'var(--gold)' }}
                                            />
                                            {s}
                                        </label>
                                    ))}
                                </div>
                            </FilterSection>

                            <FilterSection title="Transaction Type">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {['Buy', 'Sell', 'Rent'].map(t => (
                                        <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)' }}>
                                            <input
                                                type="radio"
                                                name="trans"
                                                value={t}
                                                checked={filters.transactionType === t}
                                                onChange={() => updateFilter('transactionType', filters.transactionType === t ? '' : t)}
                                                style={{ accentColor: 'var(--gold)' }}
                                            />
                                            {t}
                                        </label>
                                    ))}
                                </div>
                            </FilterSection>

                            <FilterSection title={`Min Rating: ${filters.minRating}★`}>
                                <input
                                    type="range" min="0" max="5" step="0.5"
                                    value={filters.minRating}
                                    onChange={e => updateFilter('minRating', e.target.value)}
                                    style={{ width: '100%', accentColor: 'var(--gold)' }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                                    <span>Any</span><span>5★</span>
                                </div>
                            </FilterSection>

                            <FilterSection title={`Max Commission: ${filters.maxCommission}%`}>
                                <input
                                    type="range" min="0" max="10" step="0.5"
                                    value={filters.maxCommission}
                                    onChange={e => updateFilter('maxCommission', e.target.value)}
                                    style={{ width: '100%', accentColor: 'var(--gold)' }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                                    <span>0%</span><span>10%</span>
                                </div>
                            </FilterSection>

                            <FilterSection title={`Min Experience: ${filters.minExperience} yrs`}>
                                <input
                                    type="range" min="0" max="30" step="1"
                                    value={filters.minExperience}
                                    onChange={e => updateFilter('minExperience', e.target.value)}
                                    style={{ width: '100%', accentColor: 'var(--gold)' }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                                    <span>Any</span><span>30+</span>
                                </div>
                            </FilterSection>

                            {hasActiveFilters && (
                                <button onClick={clearFilters} className="btn btn-ghost" style={{ width: '100%', marginTop: 8, fontSize: 13, color: 'var(--error)' }}>
                                    <X size={14} /> Clear All Filters
                                </button>
                            )}
                        </aside>
                    )}

                    {/* Results */}
                    <div style={{ flex: 1 }}>
                        {/* Active filters chips */}
                        {hasActiveFilters && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                                {filters.city && <FilterChip label={`City: ${filters.city}`} onRemove={() => updateFilter('city', '')} />}
                                {filters.state && <FilterChip label={`State: ${filters.state}`} onRemove={() => updateFilter('state', '')} />}
                                {filters.specialization && <FilterChip label={filters.specialization} onRemove={() => updateFilter('specialization', '')} />}
                                {filters.transactionType && <FilterChip label={`For: ${filters.transactionType}`} onRemove={() => updateFilter('transactionType', '')} />}
                                {filters.minRating !== '0' && <FilterChip label={`${filters.minRating}★ min`} onRemove={() => updateFilter('minRating', '0')} />}
                            </div>
                        )}

                        {loading ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
                                {[...Array(9)].map((_, i) => (
                                    <div key={i} className="skeleton" style={{ height: 360, borderRadius: 'var(--radius-lg)' }} />
                                ))}
                            </div>
                        ) : brokers.length > 0 ? (
                            <>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
                                    {brokers.map(broker => (
                                        <BrokerCard key={broker.id} broker={broker} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 48, flexWrap: 'wrap' }}>
                                        <button
                                            onClick={() => updateFilter('page', filters.page - 1)}
                                            disabled={filters.page === 1}
                                            className="btn btn-ghost btn-sm"
                                        >
                                            <ChevronLeft size={16} /> Prev
                                        </button>
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => updateFilter('page', i + 1)}
                                                className="btn"
                                                style={{
                                                    padding: '8px 14px',
                                                    background: filters.page === i + 1 ? 'var(--gradient-gold)' : 'transparent',
                                                    color: filters.page === i + 1 ? '#0A0A0F' : 'var(--text-secondary)',
                                                    border: '1px solid var(--border-subtle)',
                                                    borderRadius: 'var(--radius-sm)',
                                                    minWidth: 40,
                                                    fontSize: 14,
                                                }}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => updateFilter('page', filters.page + 1)}
                                            disabled={filters.page === totalPages}
                                            className="btn btn-ghost btn-sm"
                                        >
                                            Next <ChevronRight size={16} />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
                                <Search size={48} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
                                <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>
                                    No brokers found
                                </h3>
                                <p style={{ fontSize: 14, marginBottom: 24 }}>
                                    Try adjusting your search filters or browse all brokers
                                </p>
                                <button onClick={clearFilters} className="btn btn-primary">Clear Filters</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>{title}</h4>
            {children}
        </div>
    );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', background: 'rgba(212,175,55,0.1)',
            border: '1px solid rgba(212,175,55,0.3)', borderRadius: 100,
            fontSize: 12, color: 'var(--gold)',
        }}>
            {label}
            <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gold)', lineHeight: 1, padding: 0 }}>
                <X size={12} />
            </button>
        </span>
    );
}

export default function BrokersPage() {
    return (
        <Suspense fallback={<div style={{ paddingTop: 120, textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>}>
            <BrokersContent />
        </Suspense>
    );
}
