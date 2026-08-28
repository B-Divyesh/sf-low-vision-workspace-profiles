# Independent verification 2 — PASS

**Work order:** `low-vision-workspace-profiles-verify-2`  
**Candidate:** `0be3186142079e11d79057c143a88ce1936f8301`  
**Live URL:** <https://low-vision-workspace-profiles.sociobot.in/>  
**Verified:** 2026-08-28

## Verdict

**PASS.** The prior payment-field release blocker is fixed in this candidate and the deployment is an exact match for the built artifacts. The core local-first per-domain profile workflow works through the extension UI, including normal use, boundary settings, invalid input recovery, deletion undo, and sensitive-field safety. No serious or critical accessibility findings, browser console errors, or page errors were observed in the tested paths.

## Clean candidate and quality gates

A fresh detached worktree was created at exactly `0be3186142079e11d79057c143a88ce1936f8301`; pre-existing workspace analysis artifacts were not used.

```text
npm ci                         PASS — 0 audit vulnerabilities reported
npm test                       PASS — 5/5 Vitest tests
npm run lint                   PASS — tsc --noEmit
npm run typecheck              PASS — wxt prepare + tsc --noEmit
npm run test:browser           PASS — packaged MV3 Chromium regression, 1/1
npm run build                  PASS — extension, zip, site, downloadable zip
npm audit --omit=dev           PASS — 0 vulnerabilities
```

Production build output is within the stated static-product budget: initial site JavaScript is 3,116 B, CSS 17,073 B, self-hosted font 24,896 B, and the mobile AVIF hero 31,033 B. The unpacked extension totals 68,095 B; its distributable zip is 48,386 B.

## Independent end-to-end evidence

Using the production-built unpacked MV3 extension in headed Chromium under Xvfb and a representative local work page:

- Exercised the real popup UI from empty state: create a named `Analyst reading` profile, validation of a blank required name (native browser recovery focuses the labeled field), 180% text scale, 2.00x line spacing, high contrast, assignment to the current domain, save, storage persistence, invalid JSON import recovery, confirmed deletion, and Undo restore.
- Confirmed the assigned profile activates the target document and applies its selected contrast treatment. Removing the saved data removes all active profile state.
- At maximum 180% scale, normal reading text and an ordinary input enlarge; password, `name="payment"`, card-related names/auto-complete values, CVC/CVV, and a payment textarea retain their exact pre-profile computed font size. This includes the prior release-blocking `name="payment"` case.
- Cursor halo appeared after pointer movement. Holding `Alt` + `Shift` + `M` magnified a focused reading region; releasing `M` restored it. Sensitive password/payment controls remained excluded.
- Console/page-error listeners recorded no errors in the extension or fixture. The built popup's WCAG 2 A/AA/2.1 AA axe scan reported **0 violations** (therefore 0 serious/critical).

## Live deployment evidence

The live deployment is the candidate build, confirmed with byte comparisons rather than appearance alone:

| Artifact | Result | SHA-256 |
| --- | --- | --- |
| `/` | identical | `60b572c89992f98c22d3d53877bf839c1b3a3df6e93694fb36887de80eb72bba` |
| `/assets/home-CwLB2CgW.js` | identical | `a77958531f7f6cc3617d9efd80e5010e3880d2b8be06b299767e8df54a0a1dd1` |
| `/assets/style-CM7ndDpy.css` | identical | `b9d52ce22ed8c2050eeacd84fbb037c67ada569e36cf9659b8b9fdd34bd61a63` |
| `/assets/workspace-route-hero-768.avif` | identical | `5917459cd640100f981f62940d82c3aa8debe3c29be4313b11ff58fe39617655` |
| `/downloads/workspace-profiles-chrome.zip` | identical | `a6e1e51ff630e4fdf5d1a7b7c6e8e8aa23c37ec3b545c6287e6862346522267d` |
| `/sw.js`, `/privacy/`, `/terms/` | identical | compared byte-for-byte |

- Desktop and 390x844 mobile/dark/reduced-motion Playwright checks had no console or page errors. At 390px, document width was exactly 390px (no horizontal overflow), body text was 17px, and reduced-motion transition duration was `1e-05s`.
- Keyboard-only: the first Tab exposes the designed skip link; Enter navigates to `#main`; the next Tab lands on the first main-content action, bypassing header navigation. Focus outline was visible.
- axe WCAG 2 A/AA/2.1 AA reported **0 violations** on the live home, privacy, and terms pages (including dark/mobile coverage); each has `lang="en"`, a title, one `h1`, and a `main` landmark.
- The normal first-load request set was first-party only. There are no analytics/CDN requests. Source review found the only runtime cross-origin request is the optional license-verification request to the stated Sociobot API; it is not made for the free experience. An intercepted invalid returned-license flow stored and stripped the token, made one verification request, stayed locked, and presented the recovery message.
- Live CSP is enforcing and permits only self resources plus the optional billing API connection. `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, permissions policy, HTTPS, and HSTS are present.
- The service worker controlled the page after reload. An offline reload rendered the cached shell and main landmark. `registration.update()` completed with an active controller and no waiting worker.

## Defects and follow-up

No blocker, high, or medium defects found.

### Low — fingerprinted assets are not given long-lived immutable HTTP caching

Live `/assets/home-CwLB2CgW.js`, `/assets/style-CM7ndDpy.css`, and image assets return `cache-control: public, must-revalidate, max-age=30`. The service worker supplies offline recovery and runtime caching, so this does not block the product or the tested offline reload, but it does not meet the recommended long-lived immutable caching policy for hashed static assets. Configure the static host to send an immutable long TTL for `/assets/*` filenames that contain content hashes, while retaining a short policy for HTML and `sw.js`.

## Reproduce

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run test:browser
npm run build
```

Load `dist/extension/chrome-mv3` as an unpacked Chromium extension, open an ordinary `http` or `https` work page, create and assign a profile through the toolbar popup, and verify its reversible reading controls. The live identity checks above use the files in `dist/site/`.
