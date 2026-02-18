import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!rateLimit(ip, 5, 60000)) { // 5 requests per minute
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    try {
        const { key, email } = await req.json();

        if (!key && !email) {
            return NextResponse.json({ error: 'License key or email is required' }, { status: 400 });
        }

        const licensesRef = collection(db, "licenses");
        let q;

        if (key) {
            q = query(licensesRef, where("key", "==", key));
        } else {
            q = query(licensesRef, where("email", "==", email));
        }

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return NextResponse.json({ error: 'License not found' }, { status: 404 });
        }

        // If searching by email, return the first found key (or list all if needed)
        // For now, let's just return the first valid key found
        const docData = querySnapshot.docs[0].data();

        // You might want to check status here too
        if (docData.status !== 'active') {
            return NextResponse.json({ error: 'License is not active' }, { status: 403 });
        }

        return NextResponse.json({ success: true, key: docData.key });

    } catch (err: any) {
        console.error('Error verifying license:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
