// lib/convexServer.js
import { ConvexHttpClient } from "convex/browser";

// Use the correct environment variable for the Convex URL
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL environment variable is not set");
}

export const convexServer = new ConvexHttpClient(convexUrl);