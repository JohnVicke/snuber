const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  overrides: [
    {
      files: ["**/*.{js,jsx,ts,tsx}"],
      settings: {
        react: {
          version: "detect",
        },
        formComponents: ["Form"],
        linkComponents: [
          { name: "Link", linkAttribute: "to" },
          { name: "NavLink", linkAttribute: "to" },
        ],
      },
    },
  ],
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
};
