import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateUser = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        picture: v.string(),
        uid: v.string(),
    },
    handler: async (ctx, args) => {
        // Check if user already exists
        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), args.email))
            .collect();
        console.log(user);
        if (user?.length == 0) {
            const result = await ctx.db.insert("users", {
                name: args.name,
                email: args.email,
                picture: args.picture,
                uid: args.uid,
                token: 50000,
            });
            console.log(result);
        }
    },
});
export const GetUser = query({
    args: {
        // Email is optional.
        email: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Instead of throwing an error, return null if no email is provided.
        if (!args.email) {
            return null;
        }
        // Fetch the user by email
        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), args.email))
            .collect();
        return user[0];
    },
});


export const UpdateToken = mutation({
    args: {
        token: v.number(),
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        // Update the token for the user
        const result = await ctx.db.patch(args.userId, {
            token: args.token,
        });
        return result;
    },
});

export const IncrementTokens = mutation({
    args: {
        userId: v.id("users"),
        additionalTokens: v.number(),
    },
    handler: async (ctx, args) => {
        // Fetch the current user
        const user = await ctx.db.get(args.userId);
        if (!user) {
            throw new Error("User not found");
        }
        // Calculate the new tokens balance
        const currentTokens = user.token || 0;
        const newTokens = currentTokens + args.additionalTokens;
        // Update the user's token balance
        return await ctx.db.patch(args.userId, { token: newTokens });
    },
});

export const GetUserById = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.userId);
    },
});
