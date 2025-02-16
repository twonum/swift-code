// app/api/workspace/route.js
import { NextResponse } from "next/server";
import { convexServer } from "@/lib/convexServer";
import { api } from "@/convex/_generated/api";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
        console.log("API: Missing workspaceId in query parameters.");
        return NextResponse.json({ error: "Missing workspaceId" }, { status: 400 });
    }

    try {
        // Fetch the workspace record.
        const workspace = await convexServer.query(api.workspace.GetWorkspace, { workspaceId });
        if (!workspace) {
            console.log(`API: Workspace not found for id: ${workspaceId}`);
            return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
        }

        // Fetch the workspace owner's details using GetUserById.
        const owner = await convexServer.query(api.users.GetUserById, { userId: workspace.user });

        // Add the owner's email to the workspace object.
        workspace.ownerEmail = owner?.email || null;

        console.log("API: Retrieved workspace:", workspace);
        return NextResponse.json({ workspace });
    } catch (error) {
        console.error("API: Error retrieving workspace:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
