# Workspace Profiles — verification 3 handoff

## Independent verification 3

Verification 3 reviewed implementation `af023cc95101708cbf6b272523451c1bc86dd845` against documentation baseline `fa3d7e099beda92ccd60e7d680120bc3db97e74f`. Later commit `ca79e22e08b238ccbe51aa44f04c1734e6e98c90` changes only Graphify output.

**Verdict: FAIL — 1 finding and 4 untested public claims.** The live behavior, all 20 declared claim commands, 5 unit tests, 13 site tests, 11 packaged-extension tests, clean build, live artifact comparison, accessibility checks, and Lighthouse checks pass. However, the installed popup's save/apply, extension backup export, successful backup import, and quantified 10-second delete undo are not completely covered by declared user-path claim tests. The live ZIP was also checked manually and those four behaviors work; the blocker is repeatable claim coverage.

Full evidence and the required repair are in [`.factory/verification-3.md`](verification-3.md). Raw evidence is under `/work/.evidence/verification-3/`.

## Outcome

Repair 2 resolves all four Review 5 findings and the three untested claim surfaces. The live site and downloadable extension are the exact clean build of implementation commit `af023cc95101708cbf6b272523451c1bc86dd845`.

- Job: save readable settings for each work site.
- Audience: people with low vision who need larger text without losing tables and controls.
- First action: **Try it with sample data**.
- Live URL: <https://low-vision-workspace-profiles.sociobot.in/>
- Deployment: Azure Static Web Apps deployment `0f0d744e-b273-4e49-87fc-3d6640859ca6`.
- Documentation evidence SHA: `2a826fd68df79f8c101163877ef3b3a14fe4edda`. The implementation SHA above remains the deployed product source.

## Changes

- **Share report** now calls the browser share action with the fixed sample title, summary, and demo URL. It appears only when the browser provides that action. Success text is set only after the browser action resolves. Cancellation and failure have accurate messages.
- **Copy summary** now writes the fixed sample summary to the clipboard. It reports success only after the write resolves and gives a recovery step if access fails.
- Added `sample-share` and `sample-copy` claim entries with observable API and clipboard checks. The registry now has 20 claims and every id appears in exactly one tagged test.
- Expanded `reading-controls` to set and measure 100%, 180%, 1.2×, and 2×. It also operates the sample disclosure at both ends.
- Replaced `Profile 01` through `Profile 04`, the map-based 404 heading, and the remaining popup metaphor heading with literal labels.
- Increased phone navigation, footer, wordmark, inline, and legal-link targets to at least 44×44 CSS pixels. Extension sliders, switches, checkbox rows, skip link, and Undo action now use the same minimum.
- Added a measured phone target regression across Home, Demo, Privacy, Terms, and 404, plus a packaged-popup target check.
- Added demo recovery coverage for malformed sample storage. Reset and Start for real both remove the demo key while preserving a seeded real-data sentinel.
- Advanced the service-worker cache name so installed visitors receive the repaired shell.

## Finding disposition

| Finding or earlier group | Current evidence |
|---|---|
| F-5-1 / F-2-2 / F-1-3 — false or unlisted Share and Copy outcomes | `@claim:sample-share` inspects the payload received by `navigator.share`; `@claim:sample-copy` starts with a marker and inspects the resulting clipboard. A separate error-path test verifies cancellation and denied clipboard access never report success. |
| F-5-2 — untested reading lower bounds | `@claim:reading-controls` measures both displayed and computed ratios at 100%/1.2× and 180%/2×. |
| F-5-3 / F-1-8 / F-1-14 / F-1-16 — metaphorical public labels | Home uses Overview, Setup, Controls, and Privacy labels. The 404 says `Page not found`. The popup says `Cursor and focused content`. Source searches find none of the cited public phrases. |
| F-5-4 — phone targets below 44×44 | The route test measures every visible link, button, summary, input, and select at 390 px. Live Home, Demo, Privacy, Terms, and 404 return no undersized targets. |
| F-1-1 / F-2-1 / F-3-2 — first screen | Cold 390×844 and 1440×900 checks show the job, audience, sample action, outcome, and all facts before the fold at scroll position zero. |
| F-1-2 — isolated one-click demo | Direct `/demo/` and `?demo=1` load the active `Quarterly reports` sample. Reset and Start for real remove only `demo:workspace-profiles:reports-example`; the real-data sentinel survives. |
| F-1-4 — dead paid offer | No paid offer or checkout is advertised. The free demo and extension ZIP return 200. No offer was removed or changed in this repair. |
| F-1-5 / F-1-6 / F-1-7 — routes, metadata, skeleton | All public routes have distinct titles, one h1/main, canonical/social metadata, shared navigation/footer, and route announcements. A missing URL returns the designed page with HTTP 404. |
| F-1-9 through F-1-13 and F-2-4 — documentation and vocabulary | README still leads with the sample demo. Public sentences stay within 22 words and use site, profile, line spacing, color, cursor ring, hold-to-enlarge focus, and backup file consistently. |
| F-1-15 — hidden mobile actions | Both sample and download action labels remain visible at 390 px. |
| F-2-3 — extension storage/account/analytics/reversibility/assignment/privacy | All six packaged-extension claim commands pass in a fresh consumer environment. |
| F-3-1 — color, cursor ring, hold-focus | All four colors, pointer and keyboard ring movement, and hold/release focus enlargement pass against the packaged MV3 extension. |
| F-3-3 — route announcement | Home → Demo and Back restore focus and update the polite route-status region. |
| F-3-4 — 404 social metadata | The real 404 retains complete Open Graph and Twitter metadata. |
| F-3-5 / F-3-6 — vague action and backup jargon | `Show report actions` and `backup file` remain the public terms. |
| Verification payment-field blocker | Maximum-scale packaged tests keep password, payment, card, cc-*, CVC/CVV, autocomplete, and payment textarea styles unchanged. |
| Verification 2 immutable-cache note | Live hashed assets return `public, max-age=31536000, immutable`; `sw.js` returns `no-cache`. |

## Clean verification

A fresh remote clone at `af023cc95101708cbf6b272523451c1bc86dd845` was installed with `npm ci`.

| Command | Result |
|---|---|
| `npm ci` | PASS — 176 packages, 0 audit vulnerabilities |
| `npm test` | PASS — 5/5 unit tests |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS — site, unpacked extension, ZIP, and download produced |
| `npm run test:site` | PASS — 13/13 |
| `npm run test:browser` | PASS — 11/11 |
| `npm audit --omit=dev` | PASS — 0 vulnerabilities |

Every exact command in `.factory/claims.json` was then run separately. All 20 passed: `demo-isolation`, `reading-controls`, `sample-share`, `sample-copy`, `profile-persistence`, `json-export`, `first-party-only-demo`, `no-account-demo`, `free-core`, `offline-demo`, `color-options`, `cursor-ring`, `hold-focus`, `sensitive-fields`, `extension-storage`, `extension-no-account`, `extension-no-analytics`, `extension-reversible`, `extension-assignment`, and `extension-privacy`.

The production build uses 22.94 KB CSS, 5.15 KB or less route JavaScript, a 24.90 KB local font, and a 31.03 KB mobile AVIF hero. The unpacked extension is 68.14 KB.

## Cold production verification

- `verify-url.sh` passed with HTTP 200, the exact plain title, `lang="en"`, one h1, one main, complete image alt text, labelled buttons, and no console errors.
- Fresh phone and desktop browsers both identified the job, audience, and **Try it with sample data** action before scrolling. All required first-screen content ended at 587 px on the 844 px phone and 831 px on the 900 px desktop.
- The live demo measured 17 px/1.2× at its lower boundary and 30.6 px/2× at its upper boundary on the phone.
- The live share observer received the fixed title, sample summary, and exact production demo URL. The live clipboard contained the fixed summary after Copy summary.
- Reset restored 140%, 1.65×, warm paper, the original note, closed actions, and empty statuses. Reset and Start for real removed the demo key without changing the real-data sentinel.
- All demo requests stayed on the product origin. An offline reload kept the complete Demo title, h1, banner, and sample shell.
- Playwright axe found zero violations on Home, Demo, Privacy, Terms, and the 404 in dark/reduced-motion phone conditions. No route had horizontal overflow or a target below 44×44.
- All crawled routes, fragments, the extension ZIP, and the public source link resolved. The deliberate missing route returned HTTP 404 and `Page not found`.
- CSP, clickjacking protection, `nosniff`, referrer policy, permissions policy, HTTPS/HSTS, immutable asset caching, and no-cache service-worker delivery are active.
- All 24 deployed files checked match the clean build byte for byte. The live extension ZIP SHA-256 is `911c50588e411f3f340f9cadf76fa6e6278e8cc545cbc52d2ca697295d26e363`.
- The live ZIP was installed in a fresh Chromium profile. A 180%/2× night profile changed reading text from 16 px to 28.8 px and an ordinary input from 13.3333 px to 21.12 px. The password field stayed 13.3333 px. Removing the profile restored the baseline.
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.4 s, TBT 30 ms, CLS 0.

Evidence is under `/work/.evidence/repair-2/`.

## Run it

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:site
npm run test:browser
```

Load `dist/extension/chrome-mv3` as an unpacked Chromium extension, or serve `dist/site` for the product site and sample demo.

## Known gaps

Verification 3 found one blocking claims-coverage gap: four installed-popup actions need declared user-path tests. See `.factory/verification-3.md` for the exact surfaces and evidence. The live behaviors themselves passed direct checks.

This static product has no backend, tenant data, paid offer, or runtime AI dependency. Browser sharing is shown only where the Web Share API exists; Copy summary remains available elsewhere.

Pre-existing uncommitted `graphify-out/` changes were preserved and excluded from repair commits.
