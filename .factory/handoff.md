# Workspace Profiles — polish round 1 handoff

## Status

PASS. Every finding in `review-1.md` is resolved. The extension remains MV3/WXT and the site remains a static Vite deployment.

Live: <https://low-vision-workspace-profiles.sociobot.in/>

Demo: <https://low-vision-workspace-profiles.sociobot.in/demo/>
Final product commit tested and deployed: `e33f4ce` plus the final documentation commit.

## Delivered

- Rewrote and reordered the phone first screen around the low-vision job, audience, sample action, and download action.
- Added a working sample report and profile at `/demo/`; `/?demo=1` redirects there.
- Isolated demo state under `demo:workspace-profiles:reports-example`, with reset, start-for-real cleanup, pause, reload persistence, controls, and JSON export.
- Added ten registered claims and one uniquely tagged browser test for each claim.
- Removed the unavailable Supporter Pass, checkout link, price, license code, and payment terms.
- Added direct static routes, a branded HTTP 404, route-specific titles and metadata, a 1200×630 social image, an Apple icon, consistent navigation/footer, route focus, back-button focus restoration, and legal links.
- Added dark/reduced-motion accessibility coverage and fixed the dark demo contrast found during the first cold live audit.
- Added immutable one-year caching for `/assets/*`; HTML and `sw.js` remain revalidatable.
- Updated README, demo documentation, copy audit, catalog description, and design provenance.

## Verification evidence

Fresh clone `/tmp/lvw-polish-clean.TEKW3L` at `a38d47e`:

- `npm ci` — pass, 0 vulnerabilities.
- Every command in `.factory/claims.json` run separately — 10/10 pass.
- `npm test` — 5/5 pass.
- `npm run lint` — pass.
- `npm run typecheck` — pass.
- `npm run test:site` — 9/9 pass; includes light and dark axe checks, keyboard, mobile, routing, privacy, and offline.
- `npm run test:browser` — 2/2 pass against the packaged MV3 extension.
- `npm run build` — pass; extension ZIP and `dist/site` produced.
- `npm audit --omit=dev` — 0 vulnerabilities.

Final working-tree rerun after focus and contrast hardening:

- `npm run test:site` — 9/9 pass.
- `npm run test:browser` — 2/2 pass.
- `npm run build` — pass.
- Initial JS: 3.36 KB uncompressed across three chunks; CSS: 21.87 KB; font: 24.90 KB; mobile hero AVIF: 31.03 KB.

Live cold verification after deployment:

- `/`, `/demo/`, `/privacy/`, `/terms/`: HTTP 200, correct titles, one h1/main, zero console or page errors, zero axe violations in 390×844 dark/reduced-motion mode, and zero horizontal overflow.
- `/?demo=1` reached `/demo/`; reset removed the demo key while preserving a non-demo sentinel.
- Route navigation focused the new h1; Back restored focus to the Demo link.
- `/missing-final`: HTTP 404 with title `404 — Workspace Profiles` and its designed not-found h1.
- Offline `/demo/` reload retained the title, h1, controls, and seeded sample.
- Every visible link returned HTTP 200, including the downloadable ZIP and source repository.
- Hashed `/assets/*` response: `cache-control: public, max-age=31536000, immutable`.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.2 s, TBT 20 ms, CLS 0.

Screenshots and machine-readable reports are under `.factory/evidence/` (intentionally gitignored): `local/home-mobile.png`, `local/demo-desktop.png`, `local/not-found.png`, `live-home/screenshot-mobile.png`, `live-demo/screenshot-desktop.png`, `live-final.json`, and `lighthouse-final.json`.

## Run

```sh
npm ci
npm test
npm run test:claims
npm run test:site
npm run test:browser
npm run lint
npm run typecheck
npm run build
```

## Known gaps

None found in the reviewed scope.
