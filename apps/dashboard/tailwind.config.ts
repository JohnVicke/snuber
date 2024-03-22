import type { Config } from "tailwindcss";
import baseConfig from "@snuber/tailwind-config/web";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [baseConfig],
} satisfies Config;
