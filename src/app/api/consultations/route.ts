import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getTokenFromRequest } from '@/lib/auth';

// POST /api/consultations - request a consultation
export async function POST(request: NextRequest) {
    try {
        const payload = getTokenFromRequest(request);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { broker_id, message, property_type, budget, location } = body;

        if (!broker_id) {
            return NextResponse.json({ error: 'Broker ID is required' }, { status: 400 });
        }

        const db = getDb();
        const broker = db.prepare('SELECT id FROM broker_profiles WHERE id = ?').get(broker_id);
        if (!broker) {
            return NextResponse.json({ error: 'Broker not found' }, { status: 404 });
        }

        db.prepare(`
      INSERT INTO consultations (broker_id, customer_id, message, property_type, budget, location)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(broker_id, payload.userId, message, property_type, budget, location);

        return NextResponse.json({ message: 'Consultation request sent successfully' }, { status: 201 });
    } catch (error) {
        console.error('Create consultation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// GET /api/consultations - get consultations for current user
export async function GET(request: NextRequest) {
    try {
        const payload = getTokenFromRequest(request);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const db = getDb();
        let consultations;

        if (payload.role === 'broker') {
            const brokerProfile = db.prepare('SELECT id FROM broker_profiles WHERE user_id = ?').get(payload.userId) as any;
            if (!brokerProfile) {
                return NextResponse.json({ consultations: [] });
            }
            consultations = db.prepare(`
        SELECT c.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone
        FROM consultations c
        JOIN users u ON c.customer_id = u.id
        WHERE c.broker_id = ?
        ORDER BY c.created_at DESC
      `).all(brokerProfile.id);
        } else {
            consultations = db.prepare(`
        SELECT c.*, u.name as broker_name, bp.location_city, bp.agency
        FROM consultations c
        JOIN broker_profiles bp ON c.broker_id = bp.id
        JOIN users u ON bp.user_id = u.id
        WHERE c.customer_id = ?
        ORDER BY c.created_at DESC
      `).all(payload.userId);
        }

        return NextResponse.json({ consultations });
    } catch (error) {
        console.error('Get consultations error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
