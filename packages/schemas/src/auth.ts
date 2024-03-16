import { z } from "zod";

export const AuthWithEmailArgs = z.object({
  email: z.string().email(),
});

export type AuthWithEmailArgs = z.infer<typeof AuthWithEmailArgs>;
