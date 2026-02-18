import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { rateLimit } from '@/lib/rate-limit';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICES = {
    Standard: 1500, // $15.00
    Premium: 2000,  // $20.00
    Prime: 3000,    // $30.00
};

export async function POST(req: Request) {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!rateLimit(ip, 3, 60000)) { // 3 checkouts per minute per IP
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    try {
        const { plan, email } = await req.json();

        if (!plan || !email) {
            return NextResponse.json({ error: 'Missing plan or email' }, { status: 400 });
        }

        const amount = PRICES[plan as keyof typeof PRICES];

        if (!amount) {
            return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
        }

        // Determine the base URL for success/cancel redirects
        const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Prime ${plan} Plan`,
                            description: `Lifetime access to Prime ${plan} features`,
                        },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/?canceled=true`,
            customer_email: email, // Pre-fill customer email
            metadata: {
                plan,
                user_email: email, // Store in metadata for webhook processing later
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error('Error creating checkout session:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
