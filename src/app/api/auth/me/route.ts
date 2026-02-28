import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getTokenFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const payload = getTokenFromRequest(request);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const db = getDb();
        const user = db.prepare('SELECT id, name, email, role, avatar, phone, created_at FROM users WHERE id = ?').get(payload.userId) as any;

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        let brokerProfile = null;
        if (user.role === 'broker') {
            brokerProfile = db.prepare('SELECT * FROM broker_profiles WHERE user_id = ?').get(user.id);
        }

        return NextResponse.json({ user, brokerProfile });
    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const response = NextResponse.json({ message: 'Logged out' });
    response.cookies.delete('token');
    return response;
}
