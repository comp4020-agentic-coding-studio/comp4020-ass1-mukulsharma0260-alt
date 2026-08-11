import { defineConfig } from "astro/config";
import { mkdirSync, readdirSync, rmSync, symlinkSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// GitHub Pages serves this repo at <org>.github.io/<repo>/, so `base`
// must match the repo name exactly or every asset 404s live while working
// fine in local dev. See CLAUDE.md's "the stack is swappable" section.
//
// linkinator ./dist (CI's "links" check) crawls the build output as if
// dist/ were the site root, but every href here is base-prefixed for the
// real deployed subpath, so it 404s on dist/<base>/... paths that don't
// physically exist. Adding a real dist/<base>/ directory whose children are
// symlinks back to the real top-level entries resolves that crawl without
// changing any URL the deployed site actually serves. Each symlink points at
// a genuine sibling (never at dist/<base>/ itself), so there's no cycle for
// a naive directory walker (stylelint's glob, our own spec walker) to loop
// on forever — a single self-referential symlink caused exactly that.
function linkinatorBaseAlias() {
  let base = "";
  return {
    name: "linkinator-base-alias",
    hooks: {
      "astro:config:setup": ({ config }) => {
        base = config.base ?? "";
      },
      "astro:build:done": ({ dir }) => {
        const name = base.replace(/^\/|\/$/g, "");
        if (!name) return;
        const outDir = fileURLToPath(dir);
        const alias = join(outDir, name);
        rmSync(alias, { recursive: true, force: true });
        mkdirSync(alias);
        for (const entry of readdirSync(outDir)) {
          if (entry === name) continue;
          symlinkSync(join("..", entry), join(alias, entry));
        }
      },
    },
  };
}

export default defineConfig({
  site: "https://comp4020-agentic-coding-studio.github.io",
  base: "/comp4020-ass1-mukulsharma0260-alt",
  integrations: [linkinatorBaseAlias()],
});
