import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getTokenFromRequest } from '@/lib/auth';

// GET /api/brokers/[id] - get broker profile
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const db = getDb();

        const broker = db.prepare(`
      SELECT bp.*, u.name, u.email, u.avatar, u.phone, u.created_at as user_created_at
      FROM broker_profiles bp
      JOIN users u ON bp.user_id = u.id
      WHERE bp.id = ?
    `).get(id) as any;

        if (!broker) {
            return NextResponse.json({ error: 'Broker not found' }, { status: 404 });
        }

        const reviews = db.prepare(`
      SELECT r.*, u.name as reviewer_name, u.avatar as reviewer_avatar
      FROM reviews r
      JOIN users u ON r.reviewer_id = u.id
      WHERE r.broker_id = ?
      ORDER BY r.created_at DESC
      LIMIT 10
    `).all(id) as any[];

        const processedBroker = {
            ...broker,
            specializations: JSON.parse(broker.specializations || '[]'),
            languages: JSON.parse(broker.languages || '[]'),
            available_for: JSON.parse(broker.available_for || '[]'),
        };

        return NextResponse.json({ broker: processedBroker, reviews });
    } catch (error) {
        console.error('Get broker error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT /api/brokers/[id] - update broker profile
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const payload = getTokenFromRequest(request);

        if (!payload || payload.role !== 'broker') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const db = getDb();
        const brokerProfile = db.prepare('SELECT * FROM broker_profiles WHERE id = ? AND user_id = ?').get(id, payload.userId) as any;

        if (!brokerProfile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        const body = await request.json();
        const {
            bio, license_number, agency, years_experience, specializations,
            languages, location_city, location_state, location_country,
            commission_min, commission_max, commission_type, headline,
            website, linkedin, instagram, cover_image, available_for
        } = body;

        const isComplete = !!(bio && location_city && commission_min !== undefined);

        db.prepare(`
      UPDATE broker_profiles SET
        bio = ?, license_number = ?, agency = ?, years_experience = ?,
        specializations = ?, languages = ?, location_city = ?,
        location_state = ?, location_country = ?, commission_min = ?,
        commission_max = ?, commission_type = ?, headline = ?,
        website = ?, linkedin = ?, instagram = ?, cover_image = ?,
        available_for = ?, profile_complete = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
            bio, license_number, agency, years_experience,
            JSON.stringify(specializations || []),
            JSON.stringify(languages || []),
            location_city, location_state, location_country || 'India',
            commission_min, commission_max, commission_type || 'percentage',
            headline, website, linkedin, instagram, cover_image,
            JSON.stringify(available_for || ['Buy', 'Sell', 'Rent']),
            isComplete ? 1 : 0,
            id
        );

        // Update user info if provided
        if (body.name || body.phone) {
            db.prepare('UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone) WHERE id = ?')
                .run(body.name || null, body.phone || null, payload.userId);
        }

        const updatedBroker = db.prepare(`
      SELECT bp.*, u.name, u.email, u.avatar, u.phone
      FROM broker_profiles bp
      JOIN users u ON bp.user_id = u.id
      WHERE bp.id = ?
    `).get(id) as any;

        return NextResponse.json({
            broker: {
                ...updatedBroker,
                specializations: JSON.parse(updatedBroker.specializations || '[]'),
                languages: JSON.parse(updatedBroker.languages || '[]'),
                available_for: JSON.parse(updatedBroker.available_for || '[]'),
            }
        });
    } catch (error) {
        console.error('Update broker error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
