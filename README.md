# Sempiterni Codex

Reader-facing interactive dictionary for the **Sempiterni** book series — factions, systems, characters, cosmology, and glossary terms.

Live at [sempiterni.lilpossum.xyz](https://sempiterni.lilpossum.xyz).

## Features

- Searchable codex with tag filters
- Relation markers between linked entries
- Sci-fi HUD-inspired reading interface
- Markdown source in `lore/`

## Development

```bash
npm install
npm run dev
```

The index rebuilds automatically before `dev` and `build`.

## Content

- `lore/World & Lore/` — systems, factions, history, locations, cosmology
- `lore/Characters/` — protagonists and antagonists
- `lore/glossary.md` — split into individual term entries at build time

Private author material should not be added to `lore/`.

## Deployment

GitHub Actions deploys to GitHub Pages. Set Pages source to **GitHub Actions** and point DNS:

- `sempiterni.lilpossum.xyz` → CNAME to `leapcoded.github.io`
