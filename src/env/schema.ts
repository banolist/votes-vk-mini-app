import { z } from "zod";

export const clientScheme = z.object({
  MODE: z.enum(["development", "production", "test"]).default("development"),
  VITE_SERVER_GQL: z.string().url(),
  VITE_DEBUG_VK_QUERY: z.string().optional(),
});
