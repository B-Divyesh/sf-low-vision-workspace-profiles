# Independent verification — FAIL

**Work order:** `low-vision-workspace-profiles-verify-1`  
**Candidate:** `5037ac6419fa0471e80c24bba4c7a63e8e9c57f4`  
**Live URL:** https://low-vision-workspace-profiles.sociobot.in/  
**Date:** 2026-08-27

## Verdict

**FAIL.** The core workflow is functional and the live deployment is the exact candidate, but the shipped content CSS changes a representative payment input. This violates the researched brief's explicit constraint to avoid injecting into password/payment fields by default.

## Reproducible blocking defect

### High — payment field is styled by an assigned profile

`styles/content.css` excludes password inputs and several card-specific names, but its generic `input` selector does not exclude a field identified as payment data. The temporary magnifier correctly treats that field as sensitive; the persistent CSS does not.

In a real Chromium profile with the built, unpacked extension, assign a profile at **180% text scale** to a page containing:

```html
<input id="payment" name="payment" value="card data">
```

Expected: its computed font size remains the browser default **13.3333px** (no Workspace Profiles text-scale injection).  
Actual: it becomes **21.12px**, the extension's UI-scale value. Password and `autocomplete="cc-number"` inputs remained at 13.3333px in the same test.

This is not theoretical: `content.ts:isSensitive()` recognizes `payment`, while the CSS protection list omits it. It means a profile can alter a payment input even though the product promises that payment fields are skipped. Do not release until the CSS selector and sensitivity policy use the same comprehensive exclusion boundary, then rerun this test.

## Clean-checkout results

Fresh detached worktree at the candidate (`/tmp/lvw-verify`):

```text
npm ci                         PASS (0 npm audit vulnerabilities)
npm test                       PASS (1 file, 5 tests)
npm run typecheck              PASS
npm run build                  PASS
```

`npm run build` produced the expected artifacts:

- `dist/extension/chrome-mv3/`
- `dist/extension/low-vision-workspace-profiles-1.0.0-chrome.zip` (48,208 B)
- `dist/site/` and `dist/site/downloads/workspace-profiles-chrome.zip`

Initial payload budgets pass: site JS 3,116 B, CSS 17,073 B, self-hosted font 24,896 B, mobile AVIF hero 31,033 B; unpacked extension total 67,615 B.

## End-to-end evidence

- Loaded the built unpacked MV3 extension into headed Chromium under Xvfb, opened its real toolbar popup, created and assigned an `Analyst reading` profile to `example.com`, set 180% text, 2.00× line spacing and high contrast, and confirmed the saved `chrome.storage.local` profile and assignment.
- axe-core WCAG 2 A/AA/2.1 AA found **0 serious/critical (0 total)** violations in that populated extension popup.
- On an independent local fixture with an assigned 180%/2×/night profile: the document marked itself active; reading text was 28.8px and a button 21.12px; cursor halo appeared; holding `Alt`+`Shift`+`M` magnified a focused reading region; releasing removed it; removing the saved assignment deactivated all profile state. Password and conventional `cc-number` fields remained unscaled. The `name="payment"` case above failed.
- Unit coverage exercised bounded values and untrusted-import normalization. Popup save recovery was also exercised from its initial empty state through persistence.
- A live returned-license test with a controlled invalid verification response stored the token locally, removed `?license=qa-token` from the URL, made exactly one verification request, kept the supporter content locked, and displayed the recovery message.

## Live deployment identity and runtime checks

The live deployment matches the candidate exactly, not merely visually:

| Artifact | SHA-256 comparison |
| --- | --- |
| `/` | identical to `dist/site/index.html` |
| `/assets/home-CwLB2CgW.js` | identical |
| `/assets/style-CM7ndDpy.css` | identical |
| `/assets/workspace-route-hero-768.avif` | identical |
| `/sw.js`, `/privacy/`, `/terms/` | identical |
| `/downloads/workspace-profiles-chrome.zip` | identical: `32f0f879b7d6eec067ef54a3a421e75dfc03485539731d0893b2647e17beb68a` |

Desktop and 390×844 mobile Playwright smoke checks found no console or page errors. At 390px dark/reduced-motion, document width was exactly 390px (no horizontal overflow), body text was 17px, and UI transitions reduced to `0.00001s`. Keyboard-only testing showed the skip link receives a designed 4px brass focus outline and Enter moves to `#main`; subsequent Tab reaches the hero download action, bypassing header navigation.

axe-core on live `/`, `/privacy/` and `/terms/` in light/dark coverage found **0 serious/critical and 0 total** violations. Each had a title, `lang="en"`, one main, one h1, and no missing image alt text. The home page's first-load requests were first-party only (document, local font, local JS/CSS and local AVIF); no analytics, third-party scripts, or CDN fonts were observed.

The service worker became the page controller and an offline reload in a fresh profile rendered the cached title, main landmark and module shell successfully. Its `skipWaiting()`/`clients.claim()` path was exercised. Lighthouse mobile (live, cold profile) reported Performance **99**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 1.7s, LCP 1.9s, TBT 50ms, CLS 0.

## Response-policy observations (non-blocking hardening)

- HTTPS, `nosniff`, strict-origin referrer policy, and HSTS are present. Static responses currently use `cache-control: public, must-revalidate, max-age=30`; service-worker runtime caching provides offline reload.
- The live response does **not** send an enforcing `Content-Security-Policy`; Lighthouse reports “No CSP found in enforcement mode.” It also lacks `frame-ancestors`/`X-Frame-Options`, and its HSTS max-age is 10,886,400 seconds despite including `preload` (below the usual preload threshold). These are deployment hardening issues to address, but are not the reason for this FAIL.

## Required next verification

1. Make persistent content styling share the same password/payment exclusion policy as focus magnification, including `name`/`id` values such as `payment`, `card`, `cc-*`, `cvc`, and `cvv`.
2. Add an automated extension regression test that asserts those sensitive fields retain their unmodified computed styles at the maximum profile scale.
3. Rebuild, redeploy, and rerun the clean-checkout and live identity checks above. Add deployment CSP/clickjacking/HSTS hardening in parallel.
