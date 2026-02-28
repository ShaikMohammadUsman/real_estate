import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'realtorconnect_super_secret_key_2024';

export interface JWTPayload {
    userId: number;
    email: string;
    role: 'customer' | 'broker';
    name: string;
}

export function signToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch {
        return null;
    }
}

export function getTokenFromRequest(request: NextRequest): JWTPayload | null {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        return verifyToken(token);
    }

    const cookieToken = request.cookies.get('token')?.value;
    if (cookieToken) {
        return verifyToken(cookieToken);
    }

    return null;
}
