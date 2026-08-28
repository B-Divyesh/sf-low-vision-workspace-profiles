# Workspace Profiles — polish 3 handoff

## Delivered

- Closed all 26 findings recorded across `.factory/review-1.md`, `review-2.md`, and `review-3.md`; the per-finding map is in `.factory/polish-3.md`.
- Added packaged-extension claims and behavior tests for all four color treatments, pointer/keyboard cursor-ring movement, and hold/release focus enlargement.
- Fit the complete job, audience, two actions, action outcome, and three facts inside the 390×844 first screen without changing the art-deco transit identity.
- Added polite route announcements, complete 404 social metadata, plain result-naming actions, and backup-file wording.
- Kept the direct `/demo/` and `?demo=1` sample path isolated under `demo:workspace-profiles:reports-example`, with persistent disclosure, reset, start-for-real cleanup, and offline reload.
- Fixed the cold-live dark-mode contrast defect found during the final visual pass; all visible buttons now measure at least 5.98:1. Reset demo now also clears the sample note, action menu, and action statuses.
- Updated `.factory/catalog-description.txt`, `.factory/copy-audit.md`, `.factory/claims.json`, `.factory/design.md`, README, and the extension popup terminology.

## Clean-clone verification

Final code commit: `ad1fea7d9845c68403f2547dce09b21c65d68b79`.

A clean remote checkout at that exact commit was installed in `/tmp/lvw-polish3-final`. Results:

| Check | Result |
|---|---|
| `npm ci` | PASS — 176 packages; 0 audit vulnerabilities |
| `npm test` | PASS — 5/5 unit tests |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS — extension, ZIP, and `dist/site/` produced |
| `npm run test:site` | PASS — 9/9 integration/claim tests |
| `npm run test:browser` | PASS — 11/11 packaged-extension tests |
| `npm audit --omit=dev` | PASS — 0 vulnerabilities |

Every command in `.factory/claims.json` was then run separately in that clean clone. All 18 passed: `demo-isolation`, `reading-controls`, `profile-persistence`, `json-export`, `first-party-only-demo`, `no-account-demo`, `free-core`, `offline-demo`, `color-options`, `cursor-ring`, `hold-focus`, `sensitive-fields`, `extension-storage`, `extension-no-account`, `extension-no-analytics`, `extension-reversible`, `extension-assignment`, and `extension-privacy`. Each id occurs in exactly one `@claim:<id>` test.

Playwright axe reported zero violations on Home, Demo, Privacy, and Terms in light and dark/reduced-motion modes. It also reported zero violations in the packaged extension popup. Console and page-error listeners were empty on normal public routes and the popup.

The production payload remains below budget: initial site JS totals 4.7 KB uncompressed, CSS is 22.8 KB, the font is 24.9 KB, and the mobile AVIF hero is 31.0 KB. The unpacked extension totals 68.1 KB.

## Deployment and cold live evidence

The clean-checkout `dist/site` build was deployed through `/opt/fleet/lib/deploy-static.sh low-vision-workspace-profiles dist/site`. Azure deployment `f749ad8d-8f45-40c4-89bf-cde7b3f1a7a3` succeeded at the default host and the custom production URL:

- <https://delightful-desert-07f963e0f.7.azurestaticapps.net>
- <https://low-vision-workspace-profiles.sociobot.in/>

`verify-url.sh` passed on the production URL: HTTP 200, the exact plain title, `lang="en"`, one h1, one main, no missing image alt, no unlabeled buttons, and no console errors.

A separate cold Chromium pass produced `.factory/evidence/polish-3-live/live-check.json` and confirmed:

- Home, Demo, Privacy, and Terms return 200 with exact route titles, descriptions, canonicals, OG/Twitter data, touch icons, one h1/main, no horizontal overflow at 390px, and zero axe violations.
- At 390×844 the h1 ends at 240px, demo action at 355px, download at 413px, outcome at 494px, and all facts at 587px.
- `/?demo=1` opens `/demo/`; only the `demo:` key is added; a seeded real-data sentinel survives changes and reset; Reset and Start for real both remove the demo key; every demo request is same-origin.
- Reset also restores 140% text, the original sample note, a closed action panel, and empty action statuses.
- Share report, Show report actions, and Copy summary produce visible results at 180% text; the banner stays visible.
- Every visible dark-mode button has measured text contrast of at least 5.98:1.
- Home → Demo focuses and announces the Demo h1. Back restores focus to the Demo link and announces the Home h1.
- `/polish-3-missing` returns HTTP 404 with the designed page, 404 OG/Twitter metadata, and zero axe violations.
- A controlled offline reload retains the Demo title, h1, banner, and sample shell.
- Every link crawled across Home, Demo, Privacy, Terms, and 404 returns 200, including the extension ZIP and source repository.

All served HTML, JS, CSS, images, font, service worker, sitemap, robots file, and extension ZIP match the clean-clone build byte for byte. The downloadable ZIP SHA-256 begins `b36ffb9d78b8f377`.

Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.2 s, TBT 50 ms, CLS 0. Security responses include an enforcing same-origin CSP, clickjacking protection, `nosniff`, strict-origin referrer policy, and a restrictive permissions policy.

Screenshots:

- `.factory/evidence/polish-3-live/home-390.png`
- `.factory/evidence/polish-3-live/home-1440.png`
- `.factory/evidence/polish-3-live/demo-390.png`
- `.factory/evidence/polish-3-live/404-390.png`

## Known gaps

None. The product remains a WXT MV3 browser extension with a static landing/demo site and has no paid tier or external runtime service. Pre-existing `graphify-out/` workspace edits were preserved and were not included in the repair commits.
