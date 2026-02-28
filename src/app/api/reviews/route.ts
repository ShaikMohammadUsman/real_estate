import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getTokenFromRequest } from '@/lib/auth';

// POST /api/reviews - create a review
export async function POST(request: NextRequest) {
    try {
        const payload = getTokenFromRequest(request);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (payload.role !== 'customer') {
            return NextResponse.json({ error: 'Only customers can leave reviews' }, { status: 403 });
        }

        const body = await request.json();
        const { broker_id, rating, title, comment, transaction_type } = body;

        if (!broker_id || !rating) {
            return NextResponse.json({ error: 'Broker ID and rating are required' }, { status: 400 });
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
        }

        const db = getDb();

        // Check if broker exists
        const broker = db.prepare('SELECT id FROM broker_profiles WHERE id = ?').get(broker_id);
        if (!broker) {
            return NextResponse.json({ error: 'Broker not found' }, { status: 404 });
        }

        // Check if already reviewed
        const existing = db.prepare('SELECT id FROM reviews WHERE broker_id = ? AND reviewer_id = ?').get(broker_id, payload.userId);
        if (existing) {
            return NextResponse.json({ error: 'You have already reviewed this broker' }, { status: 409 });
        }

        db.prepare('INSERT INTO reviews (broker_id, reviewer_id, rating, title, comment, transaction_type) VALUES (?, ?, ?, ?, ?, ?)')
            .run(broker_id, payload.userId, rating, title, comment, transaction_type);

        // Update broker's average rating
        const avgResult = db.prepare('SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE broker_id = ?').get(broker_id) as any;
        db.prepare('UPDATE broker_profiles SET avg_rating = ?, total_reviews = ? WHERE id = ?')
            .run(Math.round(avgResult.avg * 10) / 10, avgResult.count, broker_id);

        return NextResponse.json({ message: 'Review submitted successfully' }, { status: 201 });
    } catch (error) {
        console.error('Create review error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
