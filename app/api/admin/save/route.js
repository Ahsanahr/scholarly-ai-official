import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request) {
    try {
        const body = await request.json();
        const { target, data, authEmail, authPass } = body;

        // Basic hidden admin auth verification
        if (authEmail !== 'trazoexplains' || authPass !== 'Ahsan123$') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Validate target
        const allowedTargets = {
            'universities': 'public/data/universities.json',
            'test-prep': 'public/data/test-prep.json',
            'scholarships': 'public/data/scholarships.json',
            'consultants-comp': 'public/data/consultants-comp.json',
            'consultants-one': 'public/data/consultants-one.json',
            'academies': 'public/data/academies.json',
            'programs': 'public/data/programs.json',
            'users': 'public/data/users-db.json'
        };

        if (!allowedTargets[target]) {
            return NextResponse.json({ error: 'Invalid target' }, { status: 400 });
        }

        const filePath = path.join(process.cwd(), allowedTargets[target]);
        
        try {
            await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
        } catch (err) {
            console.warn('Filesystem is read-only on Vercel, skipping local file write:', err.message);
        }

        return NextResponse.json({ success: true, message: 'Data updated successfully' });
    } catch (error) {
        console.error('Error saving data:', error);
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
