'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Save, Plus, X, Check } from 'lucide-react';

const SPECIALIZATIONS = ['Residential', 'Commercial', 'Luxury', 'Industrial', 'Agricultural Land', 'Investment', 'Rental Properties', 'New Projects', 'Plots', 'Villas', 'Warehouses'];
const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Marathi', 'Gujarati', 'Bengali', 'Punjabi'];
const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Bhopal', 'Patna', 'Nagpur', 'Indore', 'Thane', 'Noida', 'Gurgaon', 'Kochi', 'Chandigarh'];
const STATES = ['Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Tamil Nadu', 'Gujarat', 'West Bengal', 'Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh', 'Bihar', 'Punjab', 'Kerala', 'Haryana'];

export default function BrokerProfileEdit() {
    const { user, brokerProfile, token, loading, refreshUser } = useAuth();
    const router = useRouter();

    const [form, setForm] = useState({
        name: '',
        phone: '',
        bio: '',
        headline: '',
        agency: '',
        license_number: '',
        years_experience: 0,
        location_city: '',
        location_state: '',
        location_country: 'India',
        commission_min: 1,
        commission_max: 3,
        commission_type: 'percentage',
        specializations: [] as string[],
        languages: [] as string[],
        available_for: ['Buy', 'Sell', 'Rent'],
        website: '',
        linkedin: '',
        instagram: '',
        total_deals: 0,
        properties_sold: 0,
        properties_rented: 0,
    });

    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!loading && !user) router.push('/auth/login');
        if (!loading && user?.role !== 'broker') router.push('/dashboard');
    }, [user, loading, router]);

    useEffect(() => {
        if (user && brokerProfile) {
            setForm(prev => ({
                ...prev,
                name: user.name || '',
                phone: user.phone || '',
                bio: brokerProfile.bio || '',
                headline: brokerProfile.headline || '',
                agency: brokerProfile.agency || '',
                license_number: brokerProfile.license_number || '',
                years_experience: brokerProfile.years_experience || 0,
                location_city: brokerProfile.location_city || '',
                location_state: brokerProfile.location_state || '',
                location_country: brokerProfile.location_country || 'India',
                commission_min: brokerProfile.commission_min || 1,
                commission_max: brokerProfile.commission_max || 3,
                commission_type: brokerProfile.commission_type || 'percentage',
                specializations: brokerProfile.specializations || [],
                languages: brokerProfile.languages || [],
                available_for: brokerProfile.available_for || ['Buy', 'Sell', 'Rent'],
                website: brokerProfile.website || '',
                linkedin: brokerProfile.linkedin || '',
                instagram: brokerProfile.instagram || '',
                total_deals: brokerProfile.total_deals || 0,
                properties_sold: brokerProfile.properties_sold || 0,
                properties_rented: brokerProfile.properties_rented || 0,
            }));
        }
    }, [user, brokerProfile]);

    const toggleItem = (key: 'specializations' | 'languages' | 'available_for', value: string) => {
        setForm(prev => ({
            ...prev,
            [key]: prev[key].includes(value) ? prev[key].filter(i => i !== value) : [...prev[key], value]
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            const res = await fetch(`/api/brokers/${brokerProfile?.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                await refreshUser();
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to save');
            }
        } catch {
            setError('Network error');
        }
        setSaving(false);
    };

    if (loading || !user || !brokerProfile) {
        return <div style={{ paddingTop: 100, textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>;
    }

    return (
        <div style={{ paddingTop: 100, paddingBottom: 80 }}>
            <div className="container" style={{ maxWidth: 860 }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Edit Your Profile</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
                            A complete profile gets 5x more consultation requests
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        {success && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--success)', fontSize: 13, fontWeight: 600 }}>
                                <Check size={16} /> Saved!
                            </span>
                        )}
                        <button onClick={handleSave} disabled={saving} className="btn btn-primary">
                            <Save size={16} /> {saving ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', color: 'var(--error)', fontSize: 13, marginBottom: 16 }}>
                        {error}
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {/* Basic Info */}
                    <Section title="Basic Information" desc="Your name and contact details">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <FormField label="Full Name">
                                <input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your full name" />
                            </FormField>
                            <FormField label="Phone Number">
                                <input className="input" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 98765 43210" />
                            </FormField>
                            <FormField label="Agency / Company Name">
                                <input className="input" value={form.agency} onChange={e => setForm(p => ({ ...p, agency: e.target.value }))} placeholder="ABC Realty" />
                            </FormField>
                            <FormField label="License Number">
                                <input className="input" value={form.license_number} onChange={e => setForm(p => ({ ...p, license_number: e.target.value }))} placeholder="RERA-12345" />
                            </FormField>
                        </div>
                        <FormField label="Profile Headline">
                            <input className="input" value={form.headline} onChange={e => setForm(p => ({ ...p, headline: e.target.value }))} placeholder="e.g., Top Luxury Property Specialist in Mumbai" />
                        </FormField>
                        <FormField label="Bio / About Me">
                            <textarea className="input" value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} placeholder="Tell clients about your expertise, track record, and what makes you the best choice..." rows={5} />
                        </FormField>
                    </Section>

                    {/* Location */}
                    <Section title="Location" desc="Where do you primarily operate?">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                            <FormField label="City">
                                <select className="input" value={form.location_city} onChange={e => setForm(p => ({ ...p, location_city: e.target.value }))}>
                                    <option value="">Select city</option>
                                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </FormField>
                            <FormField label="State">
                                <select className="input" value={form.location_state} onChange={e => setForm(p => ({ ...p, location_state: e.target.value }))}>
                                    <option value="">Select state</option>
                                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </FormField>
                            <FormField label="Years of Experience">
                                <input className="input" type="number" min={0} max={60} value={form.years_experience} onChange={e => setForm(p => ({ ...p, years_experience: parseInt(e.target.value) || 0 }))} />
                            </FormField>
                        </div>
                    </Section>

                    {/* Commission */}
                    <Section title="Commission Rates" desc="Set your commission structure">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                            <FormField label="Commission Type">
                                <select className="input" value={form.commission_type} onChange={e => setForm(p => ({ ...p, commission_type: e.target.value }))}>
                                    <option value="percentage">Percentage of property value</option>
                                    <option value="fixed">Fixed fee</option>
                                </select>
                            </FormField>
                            <FormField label="Minimum Commission (%)">
                                <input className="input" type="number" min={0} max={20} step={0.1} value={form.commission_min} onChange={e => setForm(p => ({ ...p, commission_min: parseFloat(e.target.value) || 0 }))} />
                            </FormField>
                            <FormField label="Maximum Commission (%)">
                                <input className="input" type="number" min={0} max={20} step={0.1} value={form.commission_max} onChange={e => setForm(p => ({ ...p, commission_max: parseFloat(e.target.value) || 0 }))} />
                            </FormField>
                        </div>
                    </Section>

                    {/* Track Record */}
                    <Section title="Track Record" desc="Showcase your achievements">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                            <FormField label="Total Deals Closed">
                                <input className="input" type="number" min={0} value={form.total_deals} onChange={e => setForm(p => ({ ...p, total_deals: parseInt(e.target.value) || 0 }))} />
                            </FormField>
                            <FormField label="Properties Sold">
                                <input className="input" type="number" min={0} value={form.properties_sold} onChange={e => setForm(p => ({ ...p, properties_sold: parseInt(e.target.value) || 0 }))} />
                            </FormField>
                            <FormField label="Properties Rented">
                                <input className="input" type="number" min={0} value={form.properties_rented} onChange={e => setForm(p => ({ ...p, properties_rented: parseInt(e.target.value) || 0 }))} />
                            </FormField>
                        </div>
                    </Section>

                    {/* Specializations */}
                    <Section title="Specializations" desc="What types of properties do you deal in?">
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {SPECIALIZATIONS.map(s => (
                                <button
                                    key={s}
                                    onClick={() => toggleItem('specializations', s)}
                                    className={`tag ${form.specializations.includes(s) ? 'active' : ''}`}
                                >
                                    {form.specializations.includes(s) && <Check size={11} />}
                                    {s}
                                </button>
                            ))}
                        </div>
                    </Section>

                    {/* Transaction Types */}
                    <Section title="Services Offered" desc="What transaction types do you handle?">
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            {['Buy', 'Sell', 'Rent'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => toggleItem('available_for', t)}
                                    className={`tag ${form.available_for.includes(t) ? 'active' : ''}`}
                                    style={{ padding: '8px 20px', fontSize: 14 }}
                                >
                                    {form.available_for.includes(t) && <Check size={13} />}
                                    {t}
                                </button>
                            ))}
                        </div>
                    </Section>

                    {/* Languages */}
                    <Section title="Languages" desc="Which languages do you communicate in?">
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {LANGUAGES.map(l => (
                                <button
                                    key={l}
                                    onClick={() => toggleItem('languages', l)}
                                    className={`tag ${form.languages.includes(l) ? 'active' : ''}`}
                                >
                                    {form.languages.includes(l) && <Check size={11} />}
                                    {l}
                                </button>
                            ))}
                        </div>
                    </Section>

                    {/* Social & Web */}
                    <Section title="Online Presence" desc="Share your social profiles and website">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                            <FormField label="Website URL">
                                <input className="input" value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} placeholder="https://yoursite.com" />
                            </FormField>
                            <FormField label="LinkedIn URL">
                                <input className="input" value={form.linkedin} onChange={e => setForm(p => ({ ...p, linkedin: e.target.value }))} placeholder="https://linkedin.com/in/..." />
                            </FormField>
                            <FormField label="Instagram URL">
                                <input className="input" value={form.instagram} onChange={e => setForm(p => ({ ...p, instagram: e.target.value }))} placeholder="https://instagram.com/..." />
                            </FormField>
                        </div>
                    </Section>

                    {/* Save button */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                        {success && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--success)', fontSize: 14, fontWeight: 600 }}>
                                <Check size={16} /> Profile saved successfully!
                            </span>
                        )}
                        <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-lg">
                            <Save size={18} /> {saving ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
    return (
        <div className="card" style={{ padding: 28 }}>
            <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 17, fontWeight: 700 }}>{title}</h2>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{desc}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
        </div>
    );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="input-group">
            <label className="input-label">{label}</label>
            {children}
        </div>
    );
}
