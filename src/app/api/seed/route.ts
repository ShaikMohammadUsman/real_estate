import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/db';

const DEMO_BROKERS = [
    {
        name: 'Rajesh Sharma', email: 'rajesh@demo.com', phone: '+91 98765 43210',
        city: 'Mumbai', state: 'Maharashtra', agency: 'Sharma Properties',
        bio: 'With 15 years of expertise in Mumbai\'s luxury real estate market, I specialize in premium residential and commercial properties across South Mumbai and the Western Suburbs. My deep market knowledge and extensive network ensure my clients get the best deals at the right prices.',
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
        bio: 'I am passionate about helping families find their dream homes in Bangalore\'s fast-growing tech corridors. Specialized in Whitefield, Electronic City, and North Bangalore locations. I bring transparency and integrity to every transaction.',
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
        bio: 'Delhi NCR real estate expert with a focus on premium residential properties in Gurgaon, Noida, and South Delhi. I have closed over 200 deals including both high-end apartments and commercial spaces. Known for my negotiation skills and client-first approach.',
        headline: 'NCR Premium Properties | Investment & Luxury Expert',
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
        bio: 'Your trusted guide to Hyderabad\'s booming real estate market. With strong expertise in Gachibowli, HITEC City, and Jubilee Hills, I help IT professionals and families find the perfect property at competitive prices.',
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
        city: 'Pune', state: 'Maharashtra', agency: 'Mehta & Associates',
        bio: 'Pune\'s commercial and residential property expert. I specialize in helping businesses find the ideal office spaces in commercial hubs and guiding families to secure their dream homes in Pune\'s upcoming neighborhoods at affordable rates.',
        headline: 'Commercial & Residential Expert in Pune Since 2008',
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
        bio: 'Chennai\'s trusted name in real estate with over a decade of experience. I specialize in residential plots and villas in OMR, Anna Nagar, and Adyar. My mission is to simplify your property journey with total transparency.',
        headline: 'Plots & Villas Specialist | OMR & South Chennai Expert',
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
