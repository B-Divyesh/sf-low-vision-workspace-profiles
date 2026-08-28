# Workspace Profiles — repair handoff

## Release status

**PASS — repaired and deployed on 2026-08-28.** Repair commit: `a95caed` (`fix: protect all sensitive fields from profile styling`), pushed to `origin/main`. Static deployment `43641392-eb51-47bc-9d62-827b8895d1c6` is live at https://low-vision-workspace-profiles.sociobot.in/.

## What changed

- Fixed the verifier's release blocker. Content styling now excludes fields from persistent scaling using the **same** `isSensitive()` policy already used by focus magnification. The content script marks matching password/payment controls before activating a profile and keeps the marker current for inserted or renamed fields.
- The policy covers password controls and `autocomplete`, `name`, or `id` values containing `cc-`, `card`, `payment`, `cvc`, or `cvv`; both `input` and `textarea` styling honor that marker.
- Added a pinned Playwright 1.58.2 packaged-MV3 test. At a saved 180% profile it proves that an ordinary input grows while password, `payment`, `card`, `cc-*`, CVC/CVV, card-autocomplete, and payment-textarea controls retain their exact baseline computed font sizes.
- Added a Vitest include boundary so the browser test is run only by `npm run test:browser`, plus a `lint` script and README release instructions.
- Added the deployed Static Web Apps response policy: enforcing CSP, `frame-ancestors 'none'`, `X-Frame-Options: DENY`, permissions policy, `nosniff`, and strict-origin referrer policy. The product's license verification origin is explicitly allowed by CSP.
- Updated product copy to accurately state that persistent styling as well as magnification skips password/payment fields.

## Exact verification evidence

Clean checkout verification from the repaired tree:

```sh
npm ci                         # 176 packages; 0 audit vulnerabilities
npm test                       # 5/5 passing
npm run typecheck              # passing
npm run lint                   # passing
npm run test:browser           # 1/1 passing, built MV3 Chromium regression
npm run build                  # passing
npm audit --omit=dev           # 0 vulnerabilities
```

`npm run build` produced `dist/extension/chrome-mv3/`, `dist/extension/low-vision-workspace-profiles-1.0.0-chrome.zip` (48.39 KB), `dist/site/`, and `dist/site/downloads/workspace-profiles-chrome.zip`. The unpacked extension is 68.09 KB; initial site JS is 3.12 KB, CSS is 17.07 KB, and the self-hosted font is 24.90 KB.

The automated MV3 regression starts Chromium with the built unpacked extension and a local fixture. It writes an assigned maximum profile to `chrome.storage.local`, reloads the fixture, confirms `data-wp-active`, compares every sensitive field's computed size to its pre-profile baseline, and confirms that the ordinary input did scale.

Local and live browser checks used Playwright desktop and 390×844 mobile viewports, light/dark modes, keyboard-only skip navigation, reduced motion, console/page-error listeners, and request-origin capture. Results: no errors; skip link receives focus and Enter navigates to `#main`; mobile document width was exactly 390px; body text was 17px live; reduced-motion transition duration was `1e-05s`; normal first-load requests were first-party only.

Live `axe-core` WCAG 2 A/AA/2.1 AA results were **0 violations** on `/` in light and dark mobile coverage, and **0 violations** on `/privacy/` and `/terms/`. The factory `verify-url.sh` check also passed: HTTP 200, title, `lang=en`, one h1, main landmark, no missing image alts/unlabelled buttons, and no console errors.

The live service worker registered and controlled the page; after `context.setOffline(true)`, a reload still rendered the expected title and main landmark. Calling `registration.update()` completed without losing the controller.

Live response headers include the shipped CSP, permissions policy, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and HTTPS/HSTS. Live SHA-256 identity checks exactly matched the local build:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `60b572c89992f98c22d3d53877bf839c1b3a3df6e93694fb36887de80eb72bba` |
| `assets/home-CwLB2CgW.js` | `a77958531f7f6cc3617d9efd80e5010e3880d2b8be06b299767e8df54a0a1dd1` |
| `assets/style-CM7ndDpy.css` | `b9d52ce22ed8c2050eeacd84fbb037c67ada569e36cf9659b8b9fdd34bd61a63` |
| `downloads/workspace-profiles-chrome.zip` | `a6e1e51ff630e4fdf5d1a7b7c6e8e8aa23c37ec3b545c6287e6862346522267d` |

Live Lighthouse mobile: Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP **1.0 s**, LCP **1.6 s**, TBT **10 ms**, CLS **0**.

## Known gaps / next steps

- Chromium is the packaged and automated target. Firefox metadata remains present but Firefox packaging and QA are outside this work order.
- Highly customized editors, canvases, remote desktops, and cross-origin frames cannot always expose readable DOM text. The per-site pause remains the safe recovery path.
- Azure currently emits HSTS `max-age=10886400` while advertising `preload`; the usual preload threshold is higher. This is a hosting policy setting, not adjustable in this static artifact; the factory should raise it if preload-list eligibility is required.
- Chrome Web Store signing/publication and production Sociobot product registration remain factory release operations.
