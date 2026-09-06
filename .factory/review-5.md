# Review 5 — Save readable settings for each work site

**Review date:** 6 September 2026  
**Live URL:** <https://low-vision-workspace-profiles.sociobot.in/>  
**Implementation candidate:** `ad1fea7d9845c68403f2547dce09b21c65d68b79`  
**Documentation head reviewed:** `fe980890a743ab9e8b0698682f8a15fcc00ae812`  
**Verdict: FAIL**

There are four findings: two blocking and two minor. Three public claim surfaces remain untested. All declared commands pass, but passing commands do not clear incomplete or unlisted claims.

## First screen before scrolling

Fresh Chromium contexts were opened at 390×844 and 1440×900 with no stored data.

- **Job:** Save readable settings for each work site.
- **Audience:** People with low vision who need larger text without losing tables and controls.
- **First action:** Select **Try it with sample data**.

The phone h1 ended at 240 px, the audience text at 295 px, the demo action at 355 px, the outcome text at 494 px, and all three facts at 587 px. The same content ended at 831 px in the 900 px desktop viewport. Both contexts stayed at scroll position zero and produced no console or page errors.

## Findings

### F-5-1 — BLOCKING — Demo actions report results they do not perform

**Location:** `/demo/`, **Share report** and **Copy summary**.

**Live evidence:** In a fresh context, the review installed a controlled `navigator.share` observer and placed `unchanged-marker` on the clipboard. After both actions were selected, `navigator.share` had zero calls and the clipboard still contained `unchanged-marker`. The page nevertheless announced `Sample report shared with your workspace.` and `Sample summary copied.`

**Claim evidence:** Neither named action has an entry in `.factory/claims.json`. The `reading-controls` test checks only those success strings. It does not check a share call, clipboard write, or other observable named result.

**Why this fails:** A button label and its success message are public functional claims. The demo gives a false confirmation. This reopens F-1-3 and F-2-2.

**Required fix:** Remove these unrelated sample actions, clearly label them as simulated examples, or implement their named sandbox effects. Add a claim entry and a test that checks the effect rather than the message.

### F-5-2 — BLOCKING — The reading-range claim test omits both lower bounds

**Location:** `.factory/claims.json` entry `reading-controls` and `tests/site/claims.spec.ts`.

The registered claim says text size ranges from 100% to 180% and line spacing ranges from 1.2× to 2×. Its test sets only 180% and 2×. It never selects 100% or 1.2× and never checks their computed output. The exact claim command passes even if either advertised minimum stops working.

**Why this fails:** This is an incomplete quantitative claim test. The claims contract requires the stated numbers to be measured in the sandbox. This also reopens the quantitative part of F-1-3.

**Required fix:** Exercise both minimums and both maximums, assert the displayed and computed values at each boundary, and keep the sample controls operable at each end.

### F-5-3 — MINOR — Public copy still uses transit labels and a metaphor heading

**Location:** Home route labels `Profile 01`, `Profile 02`, `Profile 03`, and `Profile 04`; missing-page h1 `This page is not on the map`; missing-page label `No profile for this address`.

These numbered labels are not saved profiles. The missing-page copy asks visitors to translate a map/profile metaphor to “page not found.” This conflicts with `.factory/design.md`, which says the transit idea stays decorative, and with the plain-words contract. It reopens F-1-8, F-1-14, and F-1-16.

**Required fix:** Keep the transit shapes as art. Use literal text such as `Reading controls by site`, `Three setup steps`, and `Page not found`.

### F-5-4 — MINOR — Several phone targets are smaller than 44×44 CSS pixels

**Location and live measurements at 390 px:** header **Demo** link 43×44; footer **Terms** link 40×44; footer wordmark 225×18; inline **Read the privacy notice** link 176×22. Legal contact links have the same 22 px height. The demo checkbox itself is 28×28, but its associated 304×56 label provides a compliant target.

**Why this fails:** The attached accessibility and site-structure contracts require touch targets of at least 44×44 CSS pixels. The smaller links are easy to miss for the stated audience.

**Required fix:** Give navigation, footer, wordmark, and standalone text links a minimum 44 px hit area without reducing the spacing between adjacent targets.

## Demo and data isolation

The first action opened `/demo/` in one click. The initial screen contained the active `Quarterly reports` profile, `reports.example`, a three-row quarterly report, controls, and the note `Review June follow-up`. The banner remained present and said `Demo — sample data, nothing is saved to your real profiles`.

The review seeded `localStorage["workspace-profiles:real"] = "keep-me"`. Changing the sample created only `demo:workspace-profiles:reports-example`. Settings persisted on reload. **Reset demo** restored 140%, 1.65×, warm paper, the sample note, hidden actions, and removed the demo key. **Start for real** also removed the demo key. The real-data sentinel remained unchanged throughout. Every observed request was same-origin.

## Declared claims

A clean clone at `fe980890a743ab9e8b0698682f8a15fcc00ae812` was installed with `npm ci`. Every exact command in `.factory/claims.json` was run separately.

| Command group | Claim ids | Command result | Review result |
| --- | --- | --- | --- |
| Site demo | `demo-isolation`, `reading-controls`, `profile-persistence`, `json-export`, `first-party-only-demo`, `no-account-demo`, `free-core`, `offline-demo` | All 8 commands passed | `reading-controls` is incomplete; see F-5-2 |
| Packaged extension | `color-options`, `cursor-ring`, `hold-focus`, `sensitive-fields`, `extension-storage`, `extension-no-account`, `extension-no-analytics`, `extension-reversible`, `extension-assignment`, `extension-privacy` | All 10 commands passed | No defect in these ten claims |

Each registered id occurs in exactly one tagged test. The untested public claim count is **3**: **Share report**, **Copy summary**, and the untested lower-bound part of `reading-controls`.

## Installed extension checks

The live ZIP SHA-256 is `b36ffb9d78b8f377b47d2a1c0adeb509928c7c07c39a83a01180d814b945caa0`. It exactly matches both clean-build ZIP copies.

The live installed artifact was loaded in a fresh Chromium consumer profile. The review exercised empty state, blank required name recovery, a named profile, 180% text, 2× line spacing, night color, cursor ring, 180% focus enlargement, assignment, save, pause, malformed backup recovery, delete, and undo. Reading text became 28.8 px, a button became 21.12 px, and a password field stayed at 13.3333 px. The profile was stored in extension storage and survived page reload. No account or remote service was needed.

## Accessibility, routes, privacy, offline use, and links

- `verify-url.sh` passed the live home route: HTTP 200, title, `lang="en"`, one h1, one main, image alt text, labelled buttons, and no console errors.
- Playwright axe found zero settled-state violations on Home, Demo, Privacy, Terms, and 404 in light and dark/reduced-motion modes.
- Keyboard checks passed the skip link, visible 4 px focus ring, forward route h1 focus and announcement, and back-button focus restoration and announcement.
- Forced 200% root text produced no horizontal overflow at 390 px; the h1 and primary demo action remained visible.
- Reduced motion lowered UI transitions and animations to `0.00001s`.
- Home, Demo, Privacy, and Terms return 200 with distinct titles, descriptions, canonicals, one h1, and one main. `/review-5-missing` returns the designed page with HTTP 404 and a Home action. The 404 status is expected; F-5-3 concerns its wording, not the status.
- All crawled internal routes, fragments, the ZIP, and the public source link resolved. `robots.txt` and `sitemap.xml` are present.
- The privacy page explains local storage, site access, deletion, demo storage, and contact through the public repository. No cross-origin request occurred in the reviewed free or demo paths.
- The service worker installed, updated, controlled the page, and reloaded the complete demo offline.
- This product has no backend, tenant service, health endpoint, or live request allowance. Tenant isolation, server restart persistence, and 429/Retry-After checks are not applicable.

## Quality and performance

From the clean clone:

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 176 packages, 0 audit vulnerabilities |
| `npm test` | PASS — 5/5 |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS — `dist/` contains site, unpacked extension, and ZIP |
| `npm run test:site` | PASS — 9/9 |
| `npm run test:browser` | PASS — 11/11 |

The initial site payload is 4,870 bytes of JavaScript, 22,807 bytes of CSS, a 24,896-byte local font, and a 31,033-byte mobile AVIF hero. Live mobile Lighthouse 13 reported Performance 100, Accessibility 100, Best Practices 100, and SEO 100; FCP 0.83 s, LCP 1.22 s, TBT 8 ms, and CLS 0. The browser run had no field INP value.

The live site matches every clean-build file checked, including all HTML, hashed assets, images, font, service worker, sitemap, robots file, and ZIP. Fingerprinted assets return `public, max-age=31536000, immutable`; `sw.js` returns `no-cache`. CSP, clickjacking protection, `nosniff`, referrer policy, permissions policy, HTTPS, and HSTS are present.

## Earlier findings and verification notes

| Earlier item | Current evidence and disposition |
| --- | --- |
| F-1-1 | Fixed. Both first screens state the job, audience, action, outcome, and facts before scrolling. |
| F-1-2 | Fixed. Direct one-click demo, sample, banner, reset, start-for-real cleanup, and isolated key work. |
| F-1-3 | Reopened by F-5-1 and F-5-2. The registry exists and all commands run, but public demo results are unlisted and one quantitative test is incomplete. |
| F-1-4 | Fixed. No paid offer or checkout remains; the ZIP returns 200. |
| F-1-5 | Fixed. Public deep links work and unknown routes return the designed HTTP 404. |
| F-1-6 | Fixed. Route metadata and product-owned social art are complete. |
| F-1-7 | Fixed. Shared header/footer include navigation, legal links, factory credit, and version. |
| F-1-8 | Reopened by F-5-3. `Profile 01` to `Profile 04` and the 404 map wording keep the transit metaphor in public text. |
| F-1-9 | Fixed. README leads with the demo, seed, reset, and namespace. |
| F-1-10 | Fixed. Audited README sentences are within 22 words. |
| F-1-11 | Fixed. Sensitive-field testing is described plainly and the packaged regression passes. |
| F-1-12 | Fixed. Release checks are separate short instructions. |
| F-1-13 | Fixed for controls and storage terms. Public control vocabulary is consistent. |
| F-1-14 | Reopened by F-5-3 on the 404 h1. Main product section headings name tasks. |
| F-1-15 | Fixed. Mobile actions show complete labels. |
| F-1-16 | Reopened by F-5-3 because numbered section labels use `Profile` for sections that are not profiles. |
| F-2-1 | Fixed. The desktop first screen includes the safe action, outcome, and facts. |
| F-2-2 | Reopened by F-5-1. Buttons now announce outcomes, but Share and Copy do not perform them. |
| F-2-3 | Fixed for installed-extension storage, account, analytics, reversibility, assignment, and network behavior. |
| F-2-4 | Fixed. Public feature copy consistently says `hold-to-enlarge focus`. |
| F-3-1 | Fixed. Color, cursor ring, and hold-focus each have passing packaged tests. |
| F-3-2 | Fixed. The phone first screen includes the outcome and facts. |
| F-3-3 | Fixed. Forward and back route focus are announced. |
| F-3-4 | Fixed. The 404 has Open Graph and Twitter metadata. |
| F-3-5 | Fixed. `Show report actions` names its disclosure result. |
| F-3-6 | Fixed. Visitor copy says backup file; `.json` appears only as a file detail. |
| Verification payment-field blocker | Fixed. Password, payment, card, cc-*, CVC/CVV, autocomplete, and payment textarea exclusions pass at 180%. |
| Verification 2 immutable-cache note | Fixed. Hashed assets have a one-year immutable header and `sw.js` is not cached by HTTP. |

## Additional feature check

No AI, account sync, or remote processing is an obvious missing step for this local reading-settings job. Profile export and import already address moving settings between devices. No missed-leverage finding is added.

## Result

**FAIL — 4 findings, including 2 blocking findings, and 3 untested public claim surfaces.**
