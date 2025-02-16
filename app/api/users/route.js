// app/api/users/route.js
import { NextResponse } from "next/server";
import { convexServer } from "@/lib/convexServer";
import { api } from "@/convex/_generated/api";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    try {
        // Fetch the user record by userId.
        const user = await convexServer.query(api.users.GetUserById, { userId });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        // Return the user's email (and any other necessary fields).
        return NextResponse.json({ email: user.email });
    } catch (error) {
        console.error("API: Error retrieving user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
