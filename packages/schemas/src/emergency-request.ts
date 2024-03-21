import type { z } from "zod";
import { schema } from "@snuber/db";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const EmergencyRequestInsert = createInsertSchema(
  schema.emergencyRequest,
).omit({ id: true, userId: true, status: true, createdAt: true });

export const EmergencyRequest = createSelectSchema(schema.emergencyRequest);

export type EmergencyRequestInsert = z.infer<typeof EmergencyRequestInsert>;
export type EmergencyRequest = z.infer<typeof EmergencyRequest>;
