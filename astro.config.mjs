import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import fs from "node:fs";

function loadRedirects() {
  try {
    const redirects = JSON.parse(fs.readFileSync("./src/data/redirects.json", "utf8"));
    return Object.fromEntries(
      Object.entries(redirects).map(([from, to]) => [`/entry/${from}`, `/entry/${to}/`]),
    );
  } catch {
    return {};
  }
}

export default defineConfig({
  site: "https://sempiterni.lilpossum.xyz",
  output: "static",
  trailingSlash: "always",
  redirects: loadRedirects(),
  integrations: [sitemap()],
});
