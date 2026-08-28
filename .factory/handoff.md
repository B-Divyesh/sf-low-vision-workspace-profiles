# Workspace Profiles — polish 2 handoff

## Delivered

- Repaired the desktop first screen so the audience, demo action, outcome note, and three facts fit at 1440×900.
- Made every visible sample-report button work with an announced, observable result at the maximum reading settings.
- Added installed-extension claim coverage for Chromium storage, no account, no third-party runtime/analytics traffic, reversible visual settings, and site-address assignment.
- Aligned landing, privacy, README, and focus-control terminology with those tests. The demo remains a separate `demo:` browser-storage sandbox.
- Preserved the art-deco transit visual system, real routes, 404, metadata, legal links, offline demo, and accessible keyboard/mobile behavior.

## Verification

Run from a clean checkout:

```sh
npm ci
npm run lint
npm test
npm run build
npm run test:site
npm run test:browser
```

The local repair run passed: `npm run lint`; `npm test` (5/5); `npm run build`; `npm run test:site` (9/9, including axe on every public route); and `npm run test:browser` (7/7 packaged-extension claims). A clean clone at `/tmp/lvw-polish2.Ithx1q` repeated the complete suite and all 15 registry commands individually.

`.factory/claims.json` contains 15 claims. Each is tagged exactly once and is run individually from a fresh clone before final handoff. `dist/site` is the static deployment artifact and `dist/extension/chrome-mv3` is the unpacked extension.

## Deployment and live check

Repair commit `3145691717630e6aa9d59ffc9206d4de57b42a73` is pushed to `main`; production was uploaded with the static work-order configuration from `dist/site` to `https://delightful-desert-07f963e0f.7.azurestaticapps.net`, served at `https://low-vision-workspace-profiles.sociobot.in/`.

A cold live Chromium pass confirmed the complete 1440×900 hero information, working demo buttons, one h1 on Privacy and Terms, and HTTP 404 for `/polish-2-missing`. A separate 390×844 live axe run found 0 violations on `/`, `/demo/`, `/privacy/`, and `/terms/`, with no normal-route console/page errors. Screenshots: `.factory/evidence/polish-2-live-home-1440.png`, `.factory/evidence/polish-2-live-home-390.png`, and `.factory/evidence/polish-2-live-demo-1440.png`.

## Known gaps

None. The product has no paid tier or external runtime service.
