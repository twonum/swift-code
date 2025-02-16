import { NextResponse } from "next/server";

// Run this middleware for all routes starting with /workspace/
export const config = {
    matcher: "/workspace/:path*",
};

export async function middleware(request) {
    const { pathname, searchParams } = request.nextUrl;
    console.log("Middleware: Request URL", request.url);

    // Bypass workspace ownership check if ?new=true is present.
    if (searchParams.get("new") === "true") {
        console.log("Middleware: Bypassing check because new=true is present.");
        return NextResponse.next();
    }

    // Extract the workspaceId from the URL (e.g. /workspace/[id]/...)
    const parts = pathname.split("/");
    const workspaceId = parts[2];
    if (!workspaceId) {
        console.log("Middleware: No workspaceId found in the URL.");
        return NextResponse.next();
    }
    console.log("Middleware: Extracted workspaceId", workspaceId);

    // Retrieve and decode the email from the "auth-token" cookie.
    const authCookie = request.cookies.get("auth-token");
    if (!authCookie) {
        console.log("Middleware: No auth-token cookie found.");
        return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    const cookieEmail = decodeURIComponent(authCookie.value);
    if (!cookieEmail) {
        console.log("Middleware: auth-token cookie is empty.");
        return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    console.log("Middleware: Retrieved user email from cookie", cookieEmail);

    // Build the internal API URL for fetching workspace details.
    const workspaceApiUrl = new URL(`/api/workspace`, request.url);
    workspaceApiUrl.searchParams.set("workspaceId", workspaceId);
    console.log("Middleware: Fetching workspace details from", workspaceApiUrl.toString());

    // Fetch workspace details.
    const workspaceResponse = await fetch(workspaceApiUrl.toString(), {
        headers: { cookie: request.headers.get("cookie") || "" },
    });
    if (!workspaceResponse.ok) {
        console.log("Middleware: Workspace API call failed, status:", workspaceResponse.status);
        return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    const workspaceData = await workspaceResponse.json();
    const workspace = workspaceData.workspace;
    console.log("Middleware: Received workspace data:", workspace);

    // Ensure workspace exists and has a valid owner (user ID).
    const ownerId = workspace?.user;
    if (!ownerId) {
        console.log("Middleware: Workspace does not have a valid owner.");
        return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // Fetch the owner's user record using the user ID.
    const userApiUrl = new URL(`/api/users`, request.url);
    userApiUrl.searchParams.set("userId", ownerId);
    console.log("Middleware: Fetching user details from", userApiUrl.toString());

    const userResponse = await fetch(userApiUrl.toString(), {
        headers: { cookie: request.headers.get("cookie") || "" },
    });
    if (!userResponse.ok) {
        console.log("Middleware: User API call failed, status:", userResponse.status);
        return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    const userData = await userResponse.json();
    const ownerEmail = userData.email;
    console.log("Middleware: Retrieved owner email", ownerEmail);

    // Compare the cookie email with the workspace owner's email.
    if (cookieEmail !== ownerEmail) {
        console.log(
            "Middleware: Ownership verification failed. Cookie email:",
            cookieEmail,
            "Owner email:",
            ownerEmail
        );
        return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    console.log("Middleware: Ownership verified. Proceeding with request.");
    return NextResponse.next();
}
