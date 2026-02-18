import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
        return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            const email = session.customer_details?.email || session.metadata?.user_email;
            const plan = session.metadata?.plan;

            if (!email || !plan) {
                return NextResponse.json({ error: 'Invalid session data' }, { status: 400 });
            }

            // Check if key already generated for this session
            const licensesRef = collection(db, "licenses");
            const q = query(licensesRef, where("stripeSessionId", "==", sessionId));
            const existing = await getDocs(q);

            if (!existing.empty) {
                // Key already exists, return it
                return NextResponse.json({ success: true, licenseKey: existing.docs[0].data().key });
            }

            // Generate License Key
            const licenseKey = uuidv4().toUpperCase();

            // Store in Firestore
            await addDoc(collection(db, "licenses"), {
                email,
                plan,
                key: licenseKey,
                stripeSessionId: sessionId,
                createdAt: serverTimestamp(),
                status: 'active',
                redeemed: false
            });

            // In a production app, you would also trigger an email here using Resend, SendGrid, etc.

            return NextResponse.json({ success: true, licenseKey });
        } else {
            return NextResponse.json({ error: 'Payment not successful' }, { status: 400 });
        }
    } catch (err: any) {
        console.error('Error verifying payment:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
