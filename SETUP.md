# Deploying as `leapcoded/sempiterni`

This branch contains the complete Sempiterni codex site as a standalone repository. It is published on `cursor/sempiterni-codex-99ea` in `leapcoded/valentines-archive` until the dedicated repo exists.

## 1. Create the GitHub repository

On GitHub, create a new public repository:

- **Owner:** `leapcoded`
- **Name:** `sempiterni`
- **Do not** initialize with README, `.gitignore`, or license

## 2. Push this branch to the new repo

```bash
git clone --branch cursor/sempiterni-codex-99ea https://github.com/leapcoded/valentines-archive.git sempiterni
cd sempiterni
git remote set-url origin https://github.com/leapcoded/sempiterni.git
git checkout -B master
git push -u origin master
```

## 3. Enable GitHub Pages

In `leapcoded/sempiterni` → **Settings → Pages**:

- **Build and deployment → Source:** GitHub Actions

The workflow in `.github/workflows/deploy-pages.yml` deploys on push to `master`.

## 4. DNS (Cloudflare)

Add a CNAME record:

| Type  | Name        | Target                 |
|-------|-------------|------------------------|
| CNAME | sempiterni  | leapcoded.github.io    |

Use proxied (orange cloud) if that matches your other lilpossum subdomains.

## 5. Verify

After DNS propagates, the codex should be live at:

**https://sempiterni.lilpossum.xyz**
