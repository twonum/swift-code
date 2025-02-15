// /api/retrieve-checkout-session.js
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
});

export async function POST(req) {
    try {
        const { sessionId } = await req.json();
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        return NextResponse.json({ metadata: session.metadata });
    } catch (error) {
        console.error("Error retrieving checkout session:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
