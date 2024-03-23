import type { Config } from "tailwindcss";

import base from "./base";

export default {
  darkMode: "class",
  content: base.content,
  presets: [base],
  theme: {},
} satisfies Config;
