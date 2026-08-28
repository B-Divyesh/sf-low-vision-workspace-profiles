# Adversarial first-read review 3 — Workspace Profiles

**Review date:** 2026-08-28  
**URL reviewed:** <https://low-vision-workspace-profiles.sociobot.in/>  
**Verdict: FAIL**

The first-read and demo experience are clear and functional. The review fails because the public copy promises color, cursor-ring, and hold-to-enlarge-focus behavior without matching entries in `.factory/claims.json`. Three smaller standards gaps also remain.

## Cold first read

Fresh Chromium contexts at 390×844 and 1440×900 loaded the live home page with no stored site data and no console or page errors.

Before scrolling, I understood the product as: a browser extension that saves readable text settings for each work site. It is for people with low vision who want larger text without losing tables and controls. I would click **Try it with sample data** first.

The exact copy that answered those questions was:

- `Save readable settings for each work site`
- `For people with low vision who need larger text without losing tables and controls.`
- `Try it with sample data`

At desktop size the audience sentence, both named actions, action note, and all three facts were in the 900px viewport. At phone size the three core answers were visible, but the action note was clipped at the bottom and the facts were below the viewport; see F-3-2.

## Findings

### F-3-1 (reopens F-1-3) — BLOCKING — Public color, cursor, and focus claims have no matching claim entries

**Location / exact copy:** Landing control list: `Use the site, warm paper, high contrast, or night colors.` Landing preview: `Alt + Shift + M enlarges keyboard focus.` README: `A profile controls text size, line spacing, color, the cursor ring, and hold-to-enlarge focus.`

**Evidence:** `.factory/claims.json` has no claim for color selection, cursor ring, or the hold-to-enlarge keyboard command. `reading-controls` is limited to text-size and line-spacing ranges and sample-report buttons. Its test does not exercise the four color values. The packaged-extension tests set `cursorHalo: false` and do not exercise a cursor ring or `Alt` + `Shift` + `M`.

**Why this fails:** These are concrete, user-relevant behavior promises. A visitor deciding whether the extension meets their reading needs cannot rely on unregistered, untested controls. This is a partial recurrence of F-1-3, so it is blocking under the history rule.

**Concrete fix:** Add one claim entry and exactly one clean packaged-extension test for each advertised behavior, or remove/narrow the promises. The color test should apply and verify each documented treatment on a fixture. The cursor test should enable the ring and assert its visible, keyboard-reachable behavior. The focus test should hold `Alt` + `Shift` + `M`, assert the target region enlarges, and assert release restores it. Register each command in `.factory/claims.json` and run it individually from a fresh checkout.

### F-3-2 — MINOR — The 390px first screen omits the required facts and clips the action outcome

**Location / exact copy:** Live `/` at 390×844. `Try it with sample data` occupies y=660–714. The following note, `The demo opens an active sample profile. The download gives you the Chromium extension ZIP.`, begins at y=806 and ends at y=853; the viewport ends at y=844. The facts `No account`, `Settings stored in your browser`, and `Core controls cost nothing` begin below the viewport.

**Why this fails:** The three core cold-read questions are answered, but the required first-screen shape also calls for the result of the primary action and three plain facts. A phone visitor must scroll to see the privacy and price facts.

**Concrete fix:** Reduce phone hero vertical spacing or type size enough to place the full action note and all three fact lines inside 844px after the primary action. Extend the 390px route test to assert `.action-note` and `.plain-facts` are in the viewport.

### F-3-3 — MINOR — Route changes move focus but provide no polite route announcement

**Location / exact code:** `site/route-focus.ts` contains `function focusHeading() { heading?.focus({ preventScroll: true }); }`. In a live Home → Demo → Back check, focus moved to the Demo h1 and then the Demo link, but `document.querySelector('[aria-live]')` returned `null` on both pages.

**Why this fails:** Focus movement is present, but the required screen-reader route announcement is absent. A route change is therefore not explicitly announced to assistive technology beyond the incidental focus change.

**Concrete fix:** Add one visually hidden `aria-live="polite"` route-status region to every route and set it to the destination page title or h1 after navigation. Test the Home → Demo and Back paths for both focus and the announced text.

### F-3-4 — MINOR — The designed 404 has no Open Graph or Twitter metadata

**Location / exact code:** Live missing URLs return the designed `404 — Workspace Profiles` page. Its `site/404.html` head has a title, description, canonical, favicon, and Apple touch icon, but contains no `meta[property="og:title"]`, `meta[property="og:image"]`, or `meta[name="twitter:card"]`.

**Why this fails:** The product's route-metadata standard applies to routes, including the real 404 route. Shared or crawled error URLs have incomplete preview metadata.

**Concrete fix:** Add the same product-owned social-card metadata pattern used by the other routes, with a plain 404 title and description. Add a route metadata assertion for the 404 document.

### F-3-5 — MINOR — One visible demo button does not name its result

**Location / exact copy:** Demo sample toolbar button: `More actions`.

**Why this fails:** It is a generic disclosure label, not a result-naming verb. A visitor must click it to learn which action becomes available.

**Concrete fix:** Rename it to `Show report actions` (or name the actual next result directly). Update the corresponding `@claim:reading-controls` selector/assertion.

### F-3-6 — MINOR — JSON is presented as unexplained visitor-facing jargon

**Location / exact copy:** Landing fact: `1 JSON backup format`. README: `Change or pause the sample profile and export it as JSON.`

**Why this fails:** A non-technical person deciding whether their settings can be backed up need not know a file encoding. The page does not first identify it as a backup file.

**Concrete fix:** Use `1 backup file format` on the landing page and `Export the sample profile as a backup file.` in the README. Keep `JSON` in the downloaded filename, developer documentation, or a parenthetical only after the plain term.

## Copy audit

Word counts are whitespace-delimited. These tables list all landing-page and README sentences, including sentence-like fragments used as copy. No sentence exceeds 22 words. No banned marketing adjective was found. F-3-6 records the remaining plain-language issue.

### Landing page

| # | Sentence | Words |
|---|---|---:|
| L1 | For people with low vision who need larger text without losing tables and controls. | 14 |
| L2 | The demo opens an active sample profile. | 7 |
| L3 | The download gives you the Chromium extension ZIP. | 8 |
| L4 | A profile groups the reading settings you want to use together. | 11 |
| L5 | Open a site and choose a name you will recognize. | 10 |
| L6 | Set text size, line spacing, color, cursor ring, and hold-to-enlarge focus. | 11 |
| L7 | Save the profile for that site. | 6 |
| L8 | Pause it when you need the original view. | 8 |
| L9 | Adjust text and spacing independently while the page structure stays familiar. | 11 |
| L10 | Choose from 100% to 180%. | 5 |
| L11 | Choose from 1.2× to 2×. | 5 |
| L12 | Use the site, warm paper, high contrast, or night colors. | 10 |
| L13 | Alt + Shift + M enlarges keyboard focus. | 8 |
| L14 | The extension stores profiles and site assignments in Chromium extension storage. | 11 |
| L15 | Applying a profile makes no remote request. | 7 |
| L16 | No. | 1 |
| L17 | The extension applies reversible reading settings in your browser. | 9 |
| L18 | It uses site access to apply the profile assigned to the current address. | 13 |
| L19 | Password and common payment fields keep their original styling and are not enlarged. | 13 |
| L20 | No. | 1 |
| L21 | It changes visual presentation. | 4 |
| L22 | Save a readable profile for each work site. | 8 |
| L23 | Original hero artwork generated with the factory image model. | 9 |

### README

| # | Sentence | Words |
|---|---|---:|
| R1 | Workspace Profiles is a Chromium extension for people with low vision. | 11 |
| R2 | It saves a reading profile for each site. | 8 |
| R3 | Text can grow without enlarging every control or table. | 9 |
| R4 | A profile controls text size, line spacing, color, the cursor ring, and hold-to-enlarge focus. | 14 |
| R5 | Password and common payment fields keep their original styling. | 9 |
| R6 | Open the sample-data demo. | 4 |
| R7 | It starts with a Quarterly reports profile assigned to reports.example. | 10 |
| R8 | Change or pause the sample profile and export it as JSON. | 11 |
| R9 | Reset demo removes the demo:workspace-profiles:reports-example key. | 6 |
| R10 | The demo uses this separate browser-storage key. | 7 |
| R11 | Requirements: Node.js 20+ and npm. | 5 |
| R12 | npm run build creates the unpacked extension, extension ZIP, and static site in dist/. | 14 |
| R13 | To test the extension, open chrome://extensions and enable Developer mode. | 10 |
| R14 | Choose Load unpacked and select dist/extension/chrome-mv3. | 6 |
| R15 | Open an HTTP or HTTPS page, select the toolbar icon, and create a profile. | 14 |
| R16 | The claim registry is .factory/claims.json. | 5 |
| R17 | Each entry names its automated test. | 6 |
| R18 | The browser test checks that a 180% profile does not resize password or payment fields. | 15 |
| R19 | Before release, serve dist/site. | 4 |
| R20 | Run the accessibility checks. | 4 |
| R21 | Test keyboard navigation at 200% browser zoom. | 7 |
| R22 | Profiles and site assignments use Chromium extension storage. | 8 |
| R23 | The extension includes no analytics or third-party runtime scripts. | 9 |
| R24 | Read the privacy notice. | 4 |
| R25 | Deploy dist/site as a static site. | 6 |
| R26 | The repository does not manage DNS, billing, or infrastructure. | 9 |
| R27 | MIT. | 1 |
| R28 | Atkinson Hyperlegible uses the SIL Open Font License 1.1; see THIRD_PARTY_NOTICES.md. | 11 |

**Labels, headings, and actions:** The headline is eight words, job-first, and clear. The setup, controls, privacy, and FAQ headings make sense out of context. `site` and `profile` remain consistent public terms. Named actions such as `Try it with sample data`, `Download the extension`, `Share report`, `Copy summary`, and `Export sample profile` describe their results. `More actions` is the exception in F-3-5.

## Demo and sandbox checks

The primary landing action opened `/demo/` in one click. Its first screen already showed `Quarterly reports`, `Profile active`, `reports.example`, the `Quarterly service report`, editable controls, report buttons, and the persistent `Demo — sample data, nothing is saved to your real profiles` banner.

From a fresh live context, I seeded `localStorage["workspace-profiles:real"] = "sentinel"`, changed both sample ranges to their maxima, used **Share report**, **More actions**, and **Copy summary**, then reset. The real sentinel survived throughout. The only sample key created was `demo:workspace-profiles:reports-example`; **Reset demo** removed it. **Start for real** also removed it before returning home. All requests during demo load, adjustment, and reset were same-origin; no console or page errors occurred. The registered offline test passed from the clean clone after service-worker control.

## Claims test run from a clean clone

A fresh clone at `/tmp/lvw-review-3.Qz575Z` was installed with `npm ci`. `npm test`, `npm run build`, `npm run lint`, `npm run typecheck`, and `npm run test:site` passed. `npm run build` produced `dist/`.

Every command named in `.factory/claims.json` was then run separately and passed:

| Claim id | Result |
|---|---|
| demo-isolation | PASS |
| reading-controls | PASS |
| profile-persistence | PASS |
| json-export | PASS |
| first-party-only-demo | PASS |
| no-account-demo | PASS |
| free-core | PASS |
| offline-demo | PASS |
| sensitive-fields | PASS |
| extension-storage | PASS |
| extension-no-account | PASS |
| extension-no-analytics | PASS |
| extension-reversible | PASS |
| extension-assignment | PASS |
| extension-privacy | PASS |

Each registry id occurs exactly once as an `@claim:<id>` tag. F-3-1 concerns the missing entries for separately advertised behaviors, not a failing registered command.

## Earlier findings and history check

I read `review-1.md`, `review-2.md`, `polish-1.md`, `polish-2.md`, both verification records, and the preceding handoff. Live and code checks confirm the following:

| Earlier finding | Review-3 check |
|---|---|
| F-1-1 | Fixed for the three cold-read questions at 390px; F-3-2 records the remaining mandatory facts/outcome layout gap. |
| F-1-2 | Fixed: direct `/demo/` and `?demo=1`, realistic active data, isolated key, banner, reset, and start-for-real cleanup work. |
| F-1-3 | Reopened as F-3-1: the registry still omits advertised color/cursor/focus behavior. |
| F-1-4 | Fixed: no paid offer or checkout link remains; extension ZIP returns 200. |
| F-1-5 | Fixed: demo/legal deep links load and a missing URL returns styled HTTP 404. |
| F-1-6 | Fixed on home, demo, privacy, and terms; F-3-4 records missing social metadata on the 404 route. |
| F-1-7 | Fixed: header navigation and required footer content are consistent on the reviewed public routes. |
| F-1-8, F-1-13 to F-1-16 | Fixed except for the new JSON jargon and generic button findings in F-3-5 and F-3-6. Transit language is decorative, public terms stay `site`/`profile`, headings are clear, and mobile action names remain visible. |
| F-1-9 to F-1-12 | Fixed: README leads with the demo and all audited sentences are within the limit. |
| F-2-1 | Fixed: the desktop first screen contains the required content. |
| F-2-2 | Fixed: Share report, More actions, and Copy summary now have visible, announced outcomes at maximum reading settings. |
| F-2-3 | Reopened only to the narrower unregistered controls in F-3-1; installed-extension storage, account, analytics, reversibility, assignment, and remote-request claims all have passing commands. |
| F-2-4 | Fixed: public prose uses `hold-to-enlarge focus`. |

## Structure, accessibility, and identity checks

- Live `/`, `/demo/`, `/privacy/`, and `/terms/` returned 200 with route-appropriate titles, one h1, one main landmark, descriptions, canonicals, social image metadata, favicon, and Apple touch icon. A missing route returned the designed 404 with status 404.
- `robots.txt` and `sitemap.xml` are present; the sitemap lists all four public routes. All normal crawled links, including the extension ZIP and source repository, returned 200. The 404 page's skip link points to its own `#main` anchor; its underlying intentionally missing URL remains 404.
- Live 390px dark/reduced-motion axe scans on all four public routes reported zero violations and no horizontal overflow. No normal-route console or page errors occurred.
- Home → Demo moved focus to the Demo h1; Back restored focus to the Demo link. F-3-3 records the missing live-region announcement.
- The art-deco transit system, warm-paper/night palette, local Atkinson font, stepped geometry, and original control-room illustration match `.factory/design.md` and are distinct from a generic SaaS template.

## Missed leverage

No additional AI, sync, or remote feature is expected for this privacy-first local extension. It already supports extension import/export; adding remote AI or sync would widen the privacy scope without serving the stated job.

## What would make this perfect

Register and behavior-test every advertised color/cursor/focus control, fit the complete action outcome and facts in the 390px first screen, add a polite route announcement and complete 404 metadata, then replace the remaining generic/technical labels with plain outcomes. Rerun the full clean-clone claim matrix and live route check after those changes.
