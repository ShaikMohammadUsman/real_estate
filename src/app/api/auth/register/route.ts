import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password, role, phone } = body;

        if (!name || !email || !password || !role) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        if (!['customer', 'broker'].includes(role)) {
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        const db = getDb();
        const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existingUser) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const result = db.prepare(
            'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)'
        ).run(name, email, hashedPassword, role, phone || null);

        const userId = result.lastInsertRowid as number;

        // If broker, create empty broker profile
        if (role === 'broker') {
            db.prepare(
                'INSERT INTO broker_profiles (user_id) VALUES (?)'
            ).run(userId);
        }

        const token = signToken({ userId, email, role, name });

        const response = NextResponse.json({
            message: 'Account created successfully',
            user: { id: userId, name, email, role },
            token
        }, { status: 201 });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60
        });

        return response;
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
