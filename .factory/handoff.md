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

The local repair run passed: `npm run lint`; `npm test` (5/5); `npm run build`; `npm run test:site` (9/9, including axe on every public route); and `npm run test:browser` (7/7 packaged-extension claims).

`.factory/claims.json` contains 15 claims. Each is tagged exactly once and is run individually from a fresh clone before final handoff. `dist/site` is the static deployment artifact and `dist/extension/chrome-mv3` is the unpacked extension.

## Deployment and live check

The repair is pushed to `main`; the static work-order deployment serves `dist/site`. After deployment, check a cold browser at `https://low-vision-workspace-profiles.sociobot.in/` (1440×900 and 390×844), then `/demo/`, `/privacy/`, `/terms/`, and a missing path. The live verification result and repair commit are recorded in the final work-order message.

## Known gaps

None. The product has no paid tier or external runtime service.
