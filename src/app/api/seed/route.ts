import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/db';

const DEMO_BROKERS = [
    {
        name: 'Aparna Constructions', email: 'aparna@demo.com', phone: '+91 40 2335 2708',
        city: 'Hyderabad', state: 'Telangana', agency: 'Aparna Constructions \u0026 Estates',
        bio: 'Leading real estate developer in Hyderabad and Bangalore, specializing in luxury gated communities, villas, and high-end apartments. With over 25 years of excellence, we have delivered 40+ world-class projects.',
        headline: 'Leading Luxury Gated Communities \u0026 Villa Developer',
        license: 'TSRERA-REG-100293',
        years: 25, deals: 500, sold: 15000, rented: 0,
        commission_min: 0, commission_max: 0,
        specializations: ['Luxury', 'Villas', 'Flats', 'New Projects', 'Residential'],
        languages: ['English', 'Telugu', 'Hindi'],
        available_for: ['Buy'],
        is_featured: 1, is_verified: 1,
        avg_rating: 4.8, total_reviews: 1250,
        linkedin: 'https://linkedin.com',
    },
    {
        name: 'My Home Group', email: 'myhome@demo.com', phone: '+91 40 2335 0000',
        city: 'Hyderabad', state: 'Telangana', agency: 'My Home Constructions',
        bio: 'Iconic developer known for mega-townships and premium residential spaces in Hyderabad. Committed to quality and timely delivery for over 3 decades.',
        headline: 'Pioneers of Integrated Townships \u0026 Premium Living',
        license: 'TSRERA-REG-100124',
        years: 30, deals: 450, sold: 12000, rented: 0,
        commission_min: 0, commission_max: 0,
        specializations: ['Luxury', 'Flats', 'Residential', 'New Projects'],
        languages: ['English', 'Telugu', 'Hindi'],
        available_for: ['Buy'],
        is_featured: 1, is_verified: 1,
        avg_rating: 4.7, total_reviews: 980,
    },
    {
        name: 'SMR Holdings', email: 'smr@demo.com', phone: '+91 91000 85555',
        city: 'Hyderabad', state: 'Telangana', agency: 'SMR Holdings',
        bio: 'Award-winning developer specializing in luxury high-rise apartments and premium gated communities across Hyderabad and Bangalore.',
        headline: 'Luxury High-Rise Specialists | Hyderabad \u0026 Bangalore',
        license: 'TSRERA-REG-100456',
        years: 20, deals: 240, sold: 8000, rented: 0,
        commission_min: 0, commission_max: 0,
        specializations: ['Luxury', 'Flats', 'Residential', 'Villas'],
        languages: ['English', 'Telugu', 'Hindi'],
        available_for: ['Buy'],
        is_featured: 0, is_verified: 1,
        avg_rating: 4.6, total_reviews: 420,
    },
    {
        name: 'Sumadhura Group', email: 'sumadhura@demo.com', phone: '+91 80 4242 4242',
        city: 'Bangalore', state: 'Karnataka', agency: 'Sumadhura Infracon',
        bio: 'One of South India\'s leading builders, delivering exceptional luxury homes and villas in Bangalore and Hyderabad with a focus on innovation and quality.',
        headline: 'Innovation-led Luxury Homes | Bangalore \u0026 Hyderabad',
        license: 'KARRERA-REG-100789',
        years: 18, deals: 180, sold: 6000, rented: 0,
        commission_min: 0, commission_max: 0,
        specializations: ['Luxury', 'Flats', 'Villas', 'Residential', 'New Projects'],
        languages: ['English', 'Kannada', 'Telugu', 'Hindi'],
        available_for: ['Buy'],
        is_featured: 1, is_verified: 1,
        avg_rating: 4.7, total_reviews: 510,
    },
    {
        name: 'Rajesh Sharma', email: 'rajesh@demo.com', phone: '+91 98765 43210',
        city: 'Mumbai', state: 'Maharashtra', agency: 'Sharma Properties',
        bio: 'With 15 years of expertise in Mumbai\'s luxury real estate market, I specialize in premium residential and commercial properties across South Mumbai and the Western Suburbs.',
        headline: 'Luxury Property Specialist | 15 Years in Mumbai Real Estate',
        license: 'MAHARERA-P51900033842',
        years: 15, deals: 287, sold: 198, rented: 89,
        commission_min: 1.5, commission_max: 2.5,
        specializations: ['Luxury', 'Residential', 'Commercial'],
        languages: ['English', 'Hindi', 'Marathi'],
        available_for: ['Buy', 'Sell'],
        is_featured: 1, is_verified: 1,
        avg_rating: 4.9, total_reviews: 47,
        linkedin: 'https://linkedin.com', instagram: 'https://instagram.com',
    },
    {
        name: 'Priya Menon', email: 'priya@demo.com', phone: '+91 87654 32109',
        city: 'Bangalore', state: 'Karnataka', agency: 'Menon Realty Group',
        bio: 'I am passionate about helping families find their dream homes in Bangalore\'s fast-growing tech corridors.',
        headline: 'Tech Corridor Expert | Helping Techies Find Dream Homes',
        license: 'KARRERA-PRM-REG-2087',
        years: 9, deals: 156, sold: 120, rented: 36,
        commission_min: 1, commission_max: 2,
        specializations: ['Residential', 'New Projects', 'Plots'],
        languages: ['English', 'Kannada', 'Tamil', 'Malayalam'],
        available_for: ['Buy', 'Sell', 'Rent'],
        is_featured: 1, is_verified: 1,
        avg_rating: 4.7, total_reviews: 31,
        linkedin: 'https://linkedin.com',
    },
    {
        name: 'Vikram Nair', email: 'vikram@demo.com', phone: '+91 76543 21098',
        city: 'Delhi', state: 'Delhi', agency: 'Capital Estates',
        bio: 'Delhi NCR real estate expert with a focus on premium residential properties in Gurgaon, Noida, and South Delhi.',
        headline: 'NCR Premium Properties | Investment \u0026 Luxury Expert',
        license: 'DRERA-2024-BRK-1089',
        years: 12, deals: 203, sold: 160, rented: 43,
        commission_min: 2, commission_max: 3.5,
        specializations: ['Luxury', 'Investment', 'Commercial'],
        languages: ['English', 'Hindi', 'Punjabi'],
        available_for: ['Buy', 'Sell'],
        is_featured: 1, is_verified: 1,
        avg_rating: 4.6, total_reviews: 28,
    },
    {
        name: 'Ananya Krishnan', email: 'ananya@demo.com', phone: '+91 65432 10987',
        city: 'Hyderabad', state: 'Telangana', agency: 'Hyderabad Homes',
        bio: 'Your trusted guide to Hyderabad\'s booming real estate market. With strong expertise in Gachibowli, HITEC City, and Jubilee Hills.',
        headline: 'HITEC City Specialist | Connecting Tech Professionals to Homes',
        license: 'TSRERA-P02400002018',
        years: 7, deals: 134, sold: 98, rented: 36,
        commission_min: 1, commission_max: 1.75,
        specializations: ['Residential', 'Rental Properties', 'New Projects'],
        languages: ['English', 'Telugu', 'Hindi'],
        available_for: ['Buy', 'Sell', 'Rent'],
        is_featured: 0, is_verified: 1,
        avg_rating: 4.8, total_reviews: 22,
    },
    {
        name: 'Sanjay Mehta', email: 'sanjay@demo.com', phone: '+91 54321 09876',
        city: 'Pune', state: 'Maharashtra', agency: 'Mehta \u0026 Associates',
        bio: 'Pune\'s commercial and residential property expert. Specialized in helping businesses find ideal office spaces and families find dream homes.',
        headline: 'Commercial \u0026 Residential Expert in Pune Since 2008',
        license: 'MAHARERA-P52100021786',
        years: 16, deals: 312, sold: 214, rented: 98,
        commission_min: 1.5, commission_max: 2.5,
        specializations: ['Commercial', 'Residential', 'Warehouses'],
        languages: ['English', 'Hindi', 'Marathi', 'Gujarati'],
        available_for: ['Buy', 'Sell', 'Rent'],
        is_featured: 0, is_verified: 1,
        avg_rating: 4.5, total_reviews: 38,
    },
    {
        name: 'Kavitha Reddy', email: 'kavitha@demo.com', phone: '+91 43210 98765',
        city: 'Chennai', state: 'Tamil Nadu', agency: 'Reddy Realtors',
        bio: 'Chennai\'s trusted name in real estate with over a decade of experience. specialized in residential plots and villas in OMR, Anna Nagar, and Adyar.',
        headline: 'Plots \u0026 Villas Specialist | OMR \u0026 South Chennai Expert',
        license: 'TNRERA-Agent-2019-00234',
        years: 11, deals: 178, sold: 145, rented: 33,
        commission_min: 1, commission_max: 2,
        specializations: ['Plots', 'Villas', 'Residential'],
        languages: ['English', 'Tamil'],
        available_for: ['Buy', 'Sell'],
        is_featured: 0, is_verified: 0,
        avg_rating: 4.4, total_reviews: 19,
    },
];

export async function POST(request: NextRequest) {
    // For production, check for a secret key to prevent unauthorized seeding
    if (process.env.NODE_ENV === 'production') {
        const authHeader = request.headers.get('x-seed-secret');
        if (authHeader !== 'seed-me-now') {
            return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
        }
    }

    try {
        const db = getDb();
        const password = await bcrypt.hash('demo123456', 12);

        let created = 0;
        let skipped = 0;

        for (const broker of DEMO_BROKERS) {
            // Check if already exists
            const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(broker.email);
            if (existing) { skipped++; continue; }

            // Create user
            const userResult = db.prepare(
                'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)'
            ).run(broker.name, broker.email, password, 'broker', broker.phone);

            const userId = userResult.lastInsertRowid as number;

            // Create broker profile
            const profileResult = db.prepare(`
        INSERT INTO broker_profiles (
          user_id, bio, headline, agency, license_number, years_experience,
          location_city, location_state, commission_min, commission_max, commission_type,
          specializations, languages, available_for,
          total_deals, properties_sold, properties_rented,
          avg_rating, total_reviews, is_verified, is_featured, profile_complete
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
                userId, broker.bio, broker.headline, broker.agency, broker.license, broker.years,
                broker.city, broker.state, broker.commission_min, broker.commission_max, 'percentage',
                JSON.stringify(broker.specializations),
                JSON.stringify(broker.languages),
                JSON.stringify(broker.available_for),
                broker.deals, broker.sold, broker.rented,
                broker.avg_rating, broker.total_reviews,
                broker.is_verified, broker.is_featured, 1
            );

            created++;
        }

        return NextResponse.json({
            message: `Seeded ${created} brokers (${skipped} already existed)`,
            total: DEMO_BROKERS.length,
            created,
            skipped,
        });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
