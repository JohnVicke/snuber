import { schema } from "@snuber/db";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const EmergencyRequestInsert = createInsertSchema(
  schema.emergencyRequest,
  {
    status: z.enum(["pending", "accepted", "cancelled", "completed"]),
  },
).omit({ id: true, userId: true });

export const EmergencyRequest = createSelectSchema(schema.emergencyRequest);

export type EmergencyRequestInsert = z.infer<typeof EmergencyRequestInsert>;
export type EmergencyRequest = z.infer<typeof EmergencyRequest>;
