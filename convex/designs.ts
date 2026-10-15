import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { normalizeDocument } from "../lib/design/document";

function validateDocument(value: unknown) {
  const doc = normalizeDocument(value);
  if (new TextEncoder().encode(JSON.stringify(doc)).length > 900_000) {
    throw new Error(
      "This design exceeds the database file size limit. Reduce embedded images before saving.",
    );
  }
  return doc;
}
export const list = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return ctx.db
      .query("designs")
      .withIndex("by_owner_updated", (q) => q.eq("owner", identity.subject))
      .order("desc")
      .collect();
  },
});
export const get = query({
  args: { id: v.id("designs") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const file = await ctx.db.get(id);
    return file?.owner === identity.subject && !file.trashedAt ? file : null;
  },
});
export const create = mutation({
  args: { document: v.any() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Sign in to save to your account.");
    const document = validateDocument(args.document);
    return ctx.db.insert("designs", {
      owner: identity.subject,
      title: document.title,
      document,
      updatedAt: Date.now(),
      revision: 0,
    });
  },
});
export const save = mutation({
  args: {
    id: v.id("designs"),
    document: v.any(),
    expectedRevision: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Sign in to save this file.");
    const file = await ctx.db.get(args.id);
    if (file?.owner !== identity.subject || file.trashedAt)
      throw new Error("File not found.");
    if ((file.revision ?? 0) !== args.expectedRevision)
      throw new Error(
        "This file changed in another tab. Your edits are backed up in this browser. Download a copy or reload before continuing.",
      );
    const document = validateDocument(args.document);
    const revision = (file.revision ?? 0) + 1;
    await ctx.db.patch(args.id, {
      title: document.title,
      document,
      updatedAt: Date.now(),
      revision,
    });
    return revision;
  },
});
export const updateMetadata = mutation({
  args: {
    id: v.id("designs"),
    starred: v.optional(v.boolean()),
    trash: v.optional(v.boolean()),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const file = await ctx.db.get(args.id);
    if (!identity || file?.owner !== identity.subject)
      throw new Error("File not found.");
    const title = args.title?.trim().slice(0, 200);
    await ctx.db.patch(args.id, {
      ...(args.starred !== undefined ? { starred: args.starred } : {}),
      ...(args.trash !== undefined
        ? { trashedAt: args.trash ? Date.now() : undefined }
        : {}),
      ...(title
        ? {
            title,
            document: { ...file.document, title },
            revision: (file.revision ?? 0) + 1,
            updatedAt: Date.now(),
          }
        : {}),
    });
  },
});
export const remove = mutation({
  args: { id: v.id("designs") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    const file = await ctx.db.get(id);
    if (!identity || file?.owner !== identity.subject)
      throw new Error("File not found.");
    if (!file.trashedAt) throw new Error("Move this file to trash first.");
    await ctx.db.delete(id);
  },
});
