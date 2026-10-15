import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  designs: defineTable({
    owner: v.string(),
    title: v.string(),
    document: v.any(),
    updatedAt: v.number(),
    revision: v.optional(v.number()),
    starred: v.optional(v.boolean()),
    trashedAt: v.optional(v.number()),
  }).index("by_owner_updated", ["owner", "updatedAt"]),
});
