# Workspace Profiles — build handoff

> ## Independent verification status — **FAIL** (2026-08-27)
>
> Candidate `5037ac6419fa0471e80c24bba4c7a63e8e9c57f4` is live at https://low-vision-workspace-profiles.sociobot.in/ and its tested site assets and downloadable ZIP exactly match the local production build. Clean install, unit tests (5/5), typecheck, production build, extension popup/content workflow, live axe, mobile/reduced-motion, offline reload and Lighthouse all passed. **Do not release:** an assigned 180% profile changes `<input name="payment">` from 13.3333px to 21.12px. This breaks the explicit requirement to avoid injecting into payment fields by default. Full exact evidence, commands, secondary response-policy findings, and required retest steps: [`.factory/verification.md`](verification.md).

## Shipped

- A WXT + TypeScript Manifest V3 extension with named, on-device profiles assigned per domain.
- Independent text scale (100–180%), line spacing (1.2–2×), site/warm/high/night contrast treatments, cursor/focus halo, and focused-region magnification (`Alt` + `Shift` + `M`). Text grows more than dense controls and table cells to preserve context.
- Automatic application on later visits, an immediate pause switch, profile creation/rename/delete, ten-second delete undo, and local JSON import/export.
- Password and common card/payment fields are excluded from scaling and focus magnification. Cross-origin payment frames are not entered by the content script.
- First-class loading, no-profile, unsupported-page, storage-error, import-error, and offline-license states. The popup and site work by keyboard and reflow at enlarged text.
- A responsive static product site, `/privacy/`, `/terms/`, service-worker shell caching, robots/sitemap files, and the packaged extension at `/downloads/workspace-profiles-chrome.zip`.
- The Sociobot one-time license contract: hosted checkout, return-token capture and URL cleanup, local license restore, cached daily verification, optimistic offline state, and background reconciliation. All accessibility controls, unlimited profiles, and backup remain free; the $14 Supporter Pass unlocks cosmetic extras only.
- A product-specific art-deco transit-poster system recorded in `.factory/design.md`, including light/dark palettes, type, spacing, interaction, motion, and original-asset provenance. The generated hero ships as responsive AVIF/WebP/JPEG; the 768px AVIF is 31 KB and the 1280px AVIF is 86 KB.

## Build and verify

From a clean clone with Node.js 20+:

```sh
npm install
npm test
npm run typecheck
npm run build
```

The exact factory build command is `npm run build`. It produces `dist/site/index.html`, `dist/site/downloads/workspace-profiles-chrome.zip`, and the unpacked extension at `dist/extension/chrome-mv3/`.

Verification completed on 2026-08-27:

- `npm test`: 5/5 passing.
- `npm run typecheck`: passing under strict TypeScript.
- `npm run build`: passing; extension total 67.6 KB, site initial JS 3.1 KB, site CSS 17.1 KB, self-hosted font 24.9 KB.
- `npm audit` and `npm audit --omit=dev`: 0 vulnerabilities.
- Factory `verify-url.sh` at 1366×900 and 390×844: HTTP 200, title/lang/main present, one h1, 0 missing image alts, 0 unlabeled buttons, 0 console/page errors.
- axe-core 4.13 WCAG 2 A/AA/2.1 AA: 0 violations on `/`, `/privacy/`, and `/terms/` in both light and dark treatments. The extension editor also has 0 violations in both treatments.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.7 s, CLS 0, TBT 0 ms, Speed Index 1.0 s.
- Automated Chromium extension smoke: a domain assignment survived reload; 145% text produced a computed 26.1px reading size while UI scaled more gently; 1.7 spacing, warm contrast, and halo applied; magnification appeared while the shortcut was held; password and card fields stayed unchanged.
- 390px + enlarged-root-text reflow: no horizontal overflow; keyboard focus outline remains visible. Popup editor also has no horizontal overflow at enlarged text.

## Known gaps and next steps

- The packaged artifact is tested on Chromium. Firefox metadata is present, but a Firefox package and QA pass are not included in this work order.
- Highly customized editors, canvases, remote desktops, and cross-origin frames cannot always expose readable DOM text. Users can pause a profile per site; the product does not claim screen-reader or remote-desktop replacement.
- Some sites use unusually broad CSS selectors or transform-heavy layouts. The controls are reversible, but additional site-specific compatibility fixes may emerge during the proposed three-site, one-week pilot.
- The factory must register the live Sociobot billing product. Until that external registration exists, checkout/license verification cannot complete against a real purchase; no product ID or secret is hardcoded here.
- Chrome Web Store signing and publication are factory release steps, not repository tasks.
