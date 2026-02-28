import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// GET /api/brokers - search and list brokers
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q') || '';
        const city = searchParams.get('city') || '';
        const state = searchParams.get('state') || '';
        const specialization = searchParams.get('specialization') || '';
        const minRating = parseFloat(searchParams.get('minRating') || '0');
        const maxCommission = parseFloat(searchParams.get('maxCommission') || '100');
        const minExperience = parseInt(searchParams.get('minExperience') || '0');
        const transactionType = searchParams.get('transactionType') || '';
        const sortBy = searchParams.get('sortBy') || 'featured';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const offset = (page - 1) * limit;

        const db = getDb();

        let whereConditions = ['bp.profile_complete = 1'];
        const params: (string | number)[] = [];

        if (query) {
            whereConditions.push('(u.name LIKE ? OR bp.bio LIKE ? OR bp.agency LIKE ? OR bp.headline LIKE ?)');
            params.push(`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`);
        }

        if (city) {
            whereConditions.push('bp.location_city LIKE ?');
            params.push(`%${city}%`);
        }

        if (state) {
            whereConditions.push('bp.location_state LIKE ?');
            params.push(`%${state}%`);
        }

        if (specialization) {
            whereConditions.push('bp.specializations LIKE ?');
            params.push(`%${specialization}%`);
        }

        if (minRating > 0) {
            whereConditions.push('bp.avg_rating >= ?');
            params.push(minRating);
        }

        if (maxCommission < 100) {
            whereConditions.push('bp.commission_min <= ?');
            params.push(maxCommission);
        }

        if (minExperience > 0) {
            whereConditions.push('bp.years_experience >= ?');
            params.push(minExperience);
        }

        if (transactionType) {
            whereConditions.push('bp.available_for LIKE ?');
            params.push(`%${transactionType}%`);
        }

        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

        let orderClause = 'ORDER BY bp.is_featured DESC, bp.avg_rating DESC';
        if (sortBy === 'rating') orderClause = 'ORDER BY bp.avg_rating DESC';
        else if (sortBy === 'experience') orderClause = 'ORDER BY bp.years_experience DESC';
        else if (sortBy === 'deals') orderClause = 'ORDER BY bp.total_deals DESC';
        else if (sortBy === 'commission_low') orderClause = 'ORDER BY bp.commission_min ASC';
        else if (sortBy === 'newest') orderClause = 'ORDER BY bp.created_at DESC';

        const countSql = `
      SELECT COUNT(*) as total FROM broker_profiles bp
      JOIN users u ON bp.user_id = u.id
      ${whereClause}
    `;

        const sql = `
      SELECT 
        bp.*,
        u.name,
        u.email,
        u.avatar,
        u.phone
      FROM broker_profiles bp
      JOIN users u ON bp.user_id = u.id
      ${whereClause}
      ${orderClause}
      LIMIT ? OFFSET ?
    `;

        const totalResult = db.prepare(countSql).get(...params) as any;
        const brokers = db.prepare(sql).all(...params, limit, offset) as any[];

        const processedBrokers = brokers.map(broker => ({
            ...broker,
            specializations: JSON.parse(broker.specializations || '[]'),
            languages: JSON.parse(broker.languages || '[]'),
            available_for: JSON.parse(broker.available_for || '[]'),
        }));

        return NextResponse.json({
            brokers: processedBrokers,
            total: totalResult?.total || 0,
            page,
            limit,
            totalPages: Math.ceil((totalResult?.total || 0) / limit)
        });
    } catch (error) {
        console.error('Get brokers error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
