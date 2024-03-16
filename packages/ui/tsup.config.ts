import { readFile, writeFile } from "fs/promises";
import type { Options } from "tsup";
import { defineConfig } from "tsup";

const exported = [
  "./src/typography.tsx",
  "./src/accordion.tsx",
  "./src/alert-dialog.tsx",
  "./src/data-table.tsx",
  "./src/alert.tsx",
  "./src/aspect-ratio.tsx",
  "./src/avatar.tsx",
  "./src/badge.tsx",
  "./src/button.tsx",
  "./src/calendar.tsx",
  "./src/card.tsx",
  "./src/carousel.tsx",
  "./src/checkbox.tsx",
  "./src/collapsible.tsx",
  "./src/command.tsx",
  "./src/context-menu.tsx",
  "./src/dialog.tsx",
  "./src/drawer.tsx",
  "./src/dropdown-menu.tsx",
  "./src/hover-card.tsx",
  "./src/icons.tsx",
  "./src/form.tsx",
  "./src/input.tsx",
  "./src/label.tsx",
  "./src/menubar.tsx",
  "./src/navigation-menu.tsx",
  "./src/pagination.tsx",
  "./src/popover.tsx",
  "./src/progress.tsx",
  "./src/radio-group.tsx",
  "./src/scroll-area.tsx",
  "./src/select.tsx",
  "./src/separator.tsx",
  "./src/sheet.tsx",
  "./src/skeleton.tsx",
  "./src/slider.tsx",
  "./src/sonner.tsx",
  "./src/switch.tsx",
  "./src/table.tsx",
  "./src/tabs.tsx",
  "./src/textarea.tsx",
  "./src/toast.tsx",
  "./src/toggle-group.tsx",
  "./src/toggle.tsx",
  "./src/tooltip.tsx",
  "./src/utils.ts",
];

export default defineConfig((opts) => {
  const common = {
    clean: !opts.watch,
    dts: true,
    format: ["esm"],
    minify: true,
    outDir: "dist",
  } satisfies Options;

  return [
    {
      ...common,
      entry: exported,
      async onSuccess() {
        const pkgJson = JSON.parse(
          await readFile("./package.json", { encoding: "utf-8" }),
        ) as PackageJson;

        pkgJson.exports = {
          "./package.json": "./package.json",
          ...exported.reduce(
            (acc, path) => {
              const file = path
                .replace(/^\.\/src\//, "")
                .replace(/\.tsx?$/, "");
              acc[`./${file}`] = {
                types: path,
                import: `./dist/${file}.mjs`,
                default: `./dist/${file}.mjs`,
              };
              return acc;
            },
            {} as PackageJson["exports"],
          ),
        };

        await writeFile("./package.json", JSON.stringify(pkgJson, null, 2));
      },
    },
  ];
});

interface PackageJson {
  name: string;
  exports: Record<
    string,
    { import: string; types: string; default?: string } | string
  >;
  typesVersions: Record<"*", Record<string, string[]>>;
  files: string[];
  dependencies: Record<string, string>;
}
