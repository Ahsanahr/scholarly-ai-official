import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const USERS_FILE_PATH = path.join(process.cwd(), 'public', 'data', 'users-db.json');

async function getUsersData() {
    try {
        const fileContent = await fs.readFile(USERS_FILE_PATH, 'utf8');
        return JSON.parse(fileContent);
    } catch (e) {
        return [];
    }
}

async function saveUsersData(users) {
    try {
        await fs.writeFile(USERS_FILE_PATH, JSON.stringify(users, null, 2), 'utf8');
    } catch (err) {
        // Vercel serverless functions have a read-only filesystem in production
        console.warn('Filesystem is read-only on Vercel, skipping local file write:', err.message);
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const users = await getUsersData();
    return NextResponse.json({ success: true, users });
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { action, userId, newPlan, newCredits, user, authEmail, authPass } = body;

        let users = await getUsersData();

        // Register / Sync Real User
        if (action === 'register' && user && user.email) {
            const existingIndex = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
            if (existingIndex !== -1) {
                users[existingIndex].name = user.name || users[existingIndex].name;
                users[existingIndex].lastSeen = new Date().toISOString().split('T')[0];
            } else {
                users.push({
                    id: user.id || 'usr_' + Date.now(),
                    name: user.name || user.email.split('@')[0],
                    email: user.email,
                    plan: user.plan || 'free',
                    credits: user.credits !== undefined ? user.credits : 15,
                    joinedDate: user.joinedDate || new Date().toISOString().split('T')[0],
                    status: 'Active'
                });
            }
            await saveUsersData(users);
            return NextResponse.json({ success: true, users });
        }

        // Admin Auth Check for modifications
        if (authEmail !== 'trazoexplains' || authPass !== 'Ahsan123$') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (action === 'updatePlan') {
            const userIndex = users.findIndex(u => u.id === userId || u.email === userId);
            if (userIndex !== -1) {
                users[userIndex].plan = newPlan;
                if (newCredits !== undefined) {
                    users[userIndex].credits = newCredits;
                }
                await saveUsersData(users);
                return NextResponse.json({ success: true, user: users[userIndex] });
            }
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, users });
    } catch (error) {
        console.error('Admin Users API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
