# Adversarial first-read review 1 — Workspace Profiles

**Review date:** 2026-08-28  
**URL reviewed:** <https://low-vision-workspace-profiles.sociobot.in/>  
**Verdict: FAIL**

The product cannot pass a cold, 30-second first-read review. It has no try-with-sample-data path, no claim registry or claim tests, its mobile first screen is an illustration rather than an explanation, and its paid checkout link is dead. Findings below are ordered by severity.

## Cold first read

Fresh Playwright contexts were used at 390×844 and 1440×900. Console and page-error listeners were clean. Before scrolling on the phone, the visible content was the `WORKSPACE PROFILES` wordmark, an art-deco illustration, `05 CONTROLS PER ROUTE`, and a black square containing only a down-arrow. The heading, explanation, and full download action were below the fold.

What the page eventually appears to do: save per-site browser-extension reading settings such as text size, spacing, contrast, cursor, and focus magnification.

Who it is for: this is not stated on the first screen. From the repository README, it appears to be for knowledge workers with low vision.

What to click first: this is not clear on the phone. The only visible action is a textless down-arrow. After scrolling, the first action is a ZIP download, not a safe way to try the product.

## Findings

### F-1-1 — BLOCKING — The phone first screen does not state the job, audience, or first action

**Location / exact text:** Mobile `/` before any scroll. The visible text is `WORKSPACE PROFILES` and `05 CONTROLS PER ROUTE`. The action’s accessible name is `Download extension`, but mobile CSS makes its visible text transparent and shows only `↓`. The actual headline below the illustration is `YOUR WORK SITES. FINALLY YOUR SIZE.`

**Why this fails:** A first-time visitor cannot tell what the extension changes, who needs it, or what the arrow does in the required first screen. `YOUR WORK SITES. FINALLY YOUR SIZE.` is a slogan, not a plain-language job; it does not name low-vision users, a browser extension, or saved reading settings. The visual order puts a 350px decorative image ahead of the explanation.

**Concrete fix:** Put the copy and an explicitly labelled action before the hero art at 390px. Use a ≤9-word headline such as **`Save readable settings for each work site`**; use a ≤22-word supporting sentence such as **`For people with low vision who need larger text without losing tables and controls.`** Put **`Try it with sample data`** beside **`Download the extension`** and state what each does. Keep the mobile header button’s text visible; do not turn the only visible action into an unexplained arrow.

### F-1-2 — BLOCKING — No one-click, isolated demo exists

**Location / exact text:** Landing page has `Download for Chromium` and no `Try it with sample data`. `https://low-vision-workspace-profiles.sociobot.in/demo` and `/?demo=1` return the normal landing page. There is no `Demo — sample data, nothing is saved` banner, `Reset demo`, or `Start for real` control. The repository has no `.factory/demo.md`.

**Why this fails:** Downloading a browser-extension ZIP is setup, not a one-click trial. There is no realistic sample profile shown as an active product state, no isolated storage namespace, and no reset path. The verifier cannot exercise the core browser-extension job from the documented demo entry point.

**Concrete fix:** Add `/demo` (or `?demo=1`) that immediately shows a real, seeded browser-page sample with an assigned profile visibly changing reading text while controls remain usable. Persist only under a separate `demo:` namespace. Display the required persistent banner and controls, make reset discard that namespace, and document the URL, seed data, reset behaviour, and namespace in `.factory/demo.md`. For this extension, also provide a self-hosted three-to-five-frame walkthrough or an in-page simulation so the first post-click screen demonstrates the job without an install.

### F-1-3 — BLOCKING — Every visitor-facing claim is unlisted and therefore unverified

**Location / exact text:** `.factory/claims.json` is absent; `rg '@claim:'` returns no tagged tests. There is also no `.factory/copy-audit.md`. Examples of unsupported landing claims include:

- `Settings stay on your device`
- `Profiles live in browser storage.`
- `Text grows more than dense UI.`
- `Pause any site in one switch.`
- `The profile comes back on future visits.`
- `100–180%, with gentler scaling for dense interface elements.`
- `Choose 1.2–2× leading without editing the document.`
- `There is no account, analytics SDK, browsing-history server, or advertising identifier.`
- `Profiles and site assignments are stored locally by your browser.`
- `Export is always available.`
- `Every reading control, unlimited profile, site assignment, and backup is included free.`
- `A $14 one-time Supporter Pass funds maintenance and unlocks an optional poster palette pack and supporter route card—never core accessibility.`
- `Refunds are handled there and revoke the license automatically.`
- `Core extension: free forever.`
- `The underlying document and what coworkers see do not change.`
- `It does not read or transmit browsing history, form contents, or page text.`
- `Persistent profile styling and temporary focus magnification skip password fields and common payment inputs.`
- `The extension never reads their values.`

README claims are likewise unlisted, including `Password and payment fields are excluded from both persistent styling and magnification.`, `Profiles, assignments, and backups stay on the device.`, `All core accessibility features are free.`, and `There are no analytics, remote profile services, third-party runtime scripts, or CDN fonts.`

**Complete inventory:** The exact claim-like landing and README copy is quoted in the copy-audit table below. Every claim in rows **L1–L5, L8–L12, L15–L30, L33–L41, L44–L47, and R1–R18** is an unlisted-claim instance of F-1-3 (except purely instructional commands in R9–R12 and R18). The additional compatibility line, `Version 1.0 · Chrome, Edge, Brave and other Chromium browsers · Settings stay on your device`, is also an unlisted version/support/privacy claim. This cross-reference is intentional: it records every exact sentence once with its word count rather than duplicating dozens of quotes.

**Why this fails:** These are concrete privacy, persistence, capability, quantitative, pricing, and security promises. Without an entry per claim and a clean-sandbox observable test, a visitor has no tested basis for relying on them. This review cannot run “every listed claim test” because there are zero listed tests.

**Concrete fix:** Create `.factory/claims.json`. Give each claim above either (a) one `@claim:<id>` test that begins at `/demo` in a fresh context and asserts the actual result, including network interception for privacy claims, or (b) remove/rewrite it so it is not a factual promise. Add claim tests for exact scale and line-spacing bounds, persistence/reversibility/export, sensitive-field exclusions, the free/core boundary, checkout/refund behaviour, and first-party-only demo traffic. Do not claim offline, private, local-only, free-forever, or automatic-refund behaviour until its sandbox test is listed and passes.

### F-1-4 — BLOCKING — The paid call to action is a dead link

**Location / exact text:** `Buy Supporter Pass` points to `https://api.sociobot.in/api/v1/products/low-vision-workspace-profiles/checkout`.

**Evidence:** A live `curl -IL` request on 2026-08-28 returned **HTTP 404** for that URL. The downloadable extension ZIP and source-repository link returned HTTP 200.

**Why this fails:** A visitor selecting the advertised `$14` purchase is sent to a missing resource. This is especially misleading because the surrounding copy promises a specific purchase and merchant flow.

**Concrete fix:** Register/configure the product in the Sociobot billing API and verify the exact checkout URL returns a working purchase flow, or remove the purchase card, price, and CTA until it does. Add a live or sandbox link-health test that follows the checkout action to its expected successful page.

### F-1-5 — BLOCKING — Routing hides missing routes instead of providing a real demo and designed 404

**Location / exact text:** Live `GET /demo` returned HTTP 200 with the home title and home h1. Live `GET /does-not-exist-qa` also returned HTTP 200 with `Workspace Profiles — a readable route through work` and the home h1.

**Why this fails:** `/demo` is not a demo route, and a mistyped or shared bad URL silently shows the product home page rather than a clear, designed 404. A visitor cannot tell that the requested page does not exist.

**Concrete fix:** Exclude actual routes from the fallback or route them explicitly. Ship `/demo` as the isolated demo and a styled 404 with a `404` title, one explanatory h1, and a visible Home action. Return HTTP 404 for unknown paths. Add route tests for direct load, reload, back button, h1 focus, and 404 status/content.

### F-1-6 — BLOCKING — Required route metadata is incomplete

**Location / exact text:** Home source has a description and favicon but no canonical link, Open Graph tags, Twitter card tags, or `apple-touch-icon`. Privacy and Terms have no meta description, canonical link, OG/Twitter tags, or apple-touch icon. The home title is `Workspace Profiles — a readable route through work`.

**Why this fails:** The home title uses the vague metaphor `a readable route through work` rather than a plain description of the job. Legal pages fail the baseline description/canonical/social metadata requirement. There is no product-specific 1200×630 social image.

**Concrete fix:** Use `Workspace Profiles — save reading settings per site` (or equivalent plain wording) on home; retain the route-specific `Privacy — Workspace Profiles` / `Terms — Workspace Profiles` pattern. Add a concise description, canonical URL, OG title/description/image, Twitter card, and 180px Apple touch icon on every route. Generate the required 1200×630 image from the product’s existing art-deco asset, with provenance recorded.

### F-1-7 — MINOR — Header/footer skeleton is inconsistent and omits required factory/version information

**Location / exact text:** Home header has `How it works`, `Privacy`, and `Supporter pass`; the Privacy header has only `Product` and `Terms`; the Terms header has only `Product` and `Privacy`. The footer says `Local-first reading tools for a steadier workday.` and links `Privacy`, `Terms`, and `Source`, but does not say `Built by Param Factory` or include a version/build id. Legal-footers differ again.

**Why this fails:** Navigation changes by route and removes the documented Demo route. The footer does not provide the standard provenance/version handoff for visitors.

**Concrete fix:** Use one shared header with Home, Demo, How it works, Privacy (four or fewer); use one shared footer with the product one-liner, Privacy, Terms, `Built by Param Factory`, and a build/version identifier. Verify visible focus and h1 focus announcement after non-document route changes.

### F-1-8 — MINOR — Landing copy uses unexplained transit metaphors, inconsistent names, and hidden/ambiguous actions

**Location / exact text:** `ROUTE 01`, `CONTROLS PER ROUTE`, `NAME THE ROUTE`, `CURRENT STATION`, `SUPPORTER CARRIAGE`, `INFORMATION DESK`, and `NEXT DEPARTURE`; README instead uses `domain`, `profile`, and `focused-region magnification`.

**Why this fails:** A first-time visitor has to translate `route`, `station`, `carriage`, and `reading layer` into a saved site profile. The product alternates between `work site`, `workspace`, `site`, and `domain` for the same concept. `See the 3-stop setup` does not name its result, and the mobile header hides `Download extension` behind `↓`.

**Concrete fix:** Use **site** consistently for the address a profile applies to, and **profile** consistently for saved settings. Retain the visual transit motif only as decoration. Rewrite actions as `See setup steps`, `Download the extension`, and `Try it with sample data`; do not hide the action name on mobile.

### F-1-9 — MINOR — README does not provide a demo route and includes copy-audit violations

**Location / exact text:** README directs users to build/load an unpacked extension, but does not identify `/demo`, sample data, reset, or a sandbox namespace. It also makes the same unlisted claims noted in F-1-3.

**Why this fails:** A new evaluator cannot try the product without developer setup, and the README repeats privacy/capability assertions without test IDs.

**Concrete fix:** Add a `Try the demo` section before installation steps, linking to `/demo` and describing what it visibly demonstrates, reset, storage isolation, and offline verification. Link every factual promise to its claims ID/test or remove it.

## Copy audit

Word counts use whitespace-delimited words; hyphenated compounds and keyboard shortcuts count as one word. The following enumerates every sentence in landing-page and README prose. Labels, headings, buttons, and link text are audited in the following subsection because many are fragments rather than sentences.

### Landing-page sentences

| # | Exact sentence | Words |
|---|---|---:|
| L1 | Enlarge the words without blowing up the whole interface. | 9 |
| L2 | Save text, spacing, contrast, cursor, and focus settings for every workspace. | 11 |
| L3 | Profiles live in browser storage. | 5 |
| L4 | Text grows more than dense UI. | 6 |
| L5 | Pause any site in one switch. | 6 |
| L6 | Set it once. | 3 |
| L7 | Keep your place. | 3 |
| L8 | Each profile is a small collection of choices, not a single blunt zoom level. | 14 |
| L9 | Open a work site, create a profile, and give it a name you will recognize. | 15 |
| L10 | Adjust text size, line spacing, color treatment, cursor halo, and focus magnification independently. | 13 |
| L11 | The profile comes back on future visits. | 7 |
| L12 | Pause it at any time without deleting it. | 8 |
| L13 | More words. | 2 |
| L14 | Same bearings. | 2 |
| L15 | Workspace Profiles enlarges reading text more strongly than controls and tables, helping preserve the navigation and data density you rely on. | 21 |
| L16 | 100–180%, with gentler scaling for dense interface elements. | 8 |
| L17 | Choose 1.2–2× leading without editing the document. | 7 |
| L18 | Keep site colors, warm paper, high contrast, or night route. | 10 |
| L19 | Alt + Shift + M magnifies keyboard focus. | 8 |
| L20 | Private by construction. | 3 |
| L21 | There is no account, analytics SDK, browsing-history server, or advertising identifier. | 11 |
| L22 | Profiles and site assignments are stored locally by your browser. | 10 |
| L23 | Export is always available. | 4 |
| L24 | The accessibility tools are free. | 5 |
| L25 | Keep them that way. | 4 |
| L26 | Every reading control, unlimited profile, site assignment, and backup is included free. | 12 |
| L27 | A $14 one-time Supporter Pass funds maintenance and unlocks an optional poster palette pack and supporter route card—never core accessibility. | 20 |
| L28 | Sociobot / Dodo is the merchant of record. | 8 |
| L29 | Refunds are handled there and revoke the license automatically. | 9 |
| L30 | Core extension: free forever. | 4 |
| L31 | Straight answers. | 2 |
| L32 | No. | 1 |
| L33 | It applies a reversible reading layer in your browser. | 9 |
| L34 | The underlying document and what coworkers see do not change. | 10 |
| L35 | The extension needs to apply your selected profile when an assigned domain loads. | 13 |
| L36 | It does not read or transmit browsing history, form contents, or page text. | 13 |
| L37 | Persistent profile styling and temporary focus magnification skip password fields and common payment inputs. | 14 |
| L38 | The extension never reads their values. | 6 |
| L39 | No. | 1 |
| L40 | It complements browser and operating-system accessibility tools. | 7 |
| L41 | It does not provide speech, semantic navigation, or remote-desktop magnification. | 10 |
| L42 | Stop rebuilding the view. | 4 |
| L43 | Start where you left off. | 5 |
| L44 | Local-first reading tools for a steadier workday. | 7 |
| L45 | Hero artwork was created with the factory image model and reviewed by the product team. | 15 |
| L46 | The extension download works without JavaScript. | 6 |
| L47 | License restore needs JavaScript enabled. | 5 |

### README sentences

| # | Exact sentence | Words |
|---|---|---:|
| R1 | Workspace Profiles is a local-first Chromium extension for knowledge workers with low vision. | 13 |
| R2 | It saves a named reading profile per domain so text can grow without applying the same zoom to navigation, controls, and dense tables. | 23 |
| R3 | Each profile independently controls text scale, line spacing, contrast treatment, a cursor/focus halo, and temporary focused-region magnification. | 17 |
| R4 | Password and payment fields are excluded from both persistent styling and magnification. | 12 |
| R5 | Profiles, assignments, and backups stay on the device. | 8 |
| R6 | The repository also contains the static product site at low-vision-workspace-profiles.sociobot.in. | 10 |
| R7 | All core accessibility features are free. | 6 |
| R8 | The optional one-time Supporter Pass unlocks cosmetic extras only. | 9 |
| R9 | Requirements: Node.js 20+ and npm. | 5 |
| R10 | npm run build is the reproducible factory build command. | 9 |
| R11 | To test the extension, open chrome://extensions, enable Developer mode, choose Load unpacked, and select dist/extension/chrome-mv3. | 15 |
| R12 | Open a normal http or https page, select the toolbar icon, and create a profile. | 15 |
| R13 | Unit tests validate untrusted import normalization, bounded settings, domain assignments, and defaults. | 12 |
| R14 | The packaged-extension Chromium test validates that a maximum 180% profile never changes the computed font size of password and payment-related fields, including payment, card, cc-*, CVC/CVV, and card autocomplete fields. | 30 |
| R15 | Before release, serve dist/site, run the accessibility smoke tests described in .factory/handoff.md, and test the unpacked extension with keyboard-only navigation at 200% browser zoom. | 24 |
| R16 | There are no analytics, remote profile services, third-party runtime scripts, or CDN fonts. | 13 |
| R17 | The extension requests site access solely to apply assigned profiles. | 10 |
| R18 | See site/privacy/index.html and the public /privacy/ page for details. | 9 |
| R19 | MIT. | 1 |
| R20 | The bundled Atkinson Hyperlegible font is covered by the SIL Open Font License 1.1; see THIRD_PARTY_NOTICES.md. | 16 |

### Copy flags and concrete rewrites

These are additional findings, one per flagged copy item. None uses a sentence over 22 words except the two README items explicitly marked.

- **F-1-10 — MINOR — README R2 is 23 words.** Rewrite: `It saves a profile for each site. Text can grow without enlarging navigation, controls, or dense tables.`
- **F-1-11 — MINOR — README R14 is 28 words and uses test-jargon.** Rewrite: `The browser test checks that a 180% profile does not resize password or payment fields.` Put the exhaustive field list in test documentation.
- **F-1-12 — MINOR — README R15 is 24 words and mixes release steps.** Rewrite: `Before release, serve dist/site. Run the accessibility checks. Test keyboard navigation at 200% browser zoom.`
- **F-1-13 — MINOR — `local-first`, `reading layer`, `contrast treatment`, `cursor halo`, `focused-region magnification`, `leading`, and `merchant of record` are unexplained jargon.** Rewrite respectively as `stored in your browser`, `reading settings`, `color option`, `cursor ring`, `hold-to-enlarge focus`, `line spacing`, and `Sociobot / Dodo handles payment`.
- **F-1-14 — MINOR — `YOUR WORK SITES. FINALLY YOUR SIZE.`, `More words. Same bearings.`, `Private by construction.`, and `Straight answers.` do not make sense as headings without surrounding context.** Rewrite as `Save readable settings for each work site`, `Keep text readable without enlarging every control`, `Your settings stay in your browser`, and `Questions before you install`.
- **F-1-15 — MINOR — `See the 3-stop setup` is not a result-naming action, and mobile hides `Download extension` as `↓`.** Rewrite as `See setup steps` and retain the full `Download the extension` label on every viewport.
- **F-1-16 — MINOR — The product calls the same target a `workspace`, `work site`, `site`, `domain`, `route`, and `station`.** Use `site` in visitor copy; reserve `domain` for precise developer documentation. Example: `Save a profile for each site.`

## Demo, sandbox, and privacy checks

The required demo checks cannot pass because no demo exists (F-1-2). The `/demo` and `?demo=1` probes showed normal home content and no demo controls. The expected `demo:` storage namespace and demo documentation are absent, so it is not possible to verify that demo data never touches real storage or that Reset discards it.

A separate fresh-context normal-home check did register the service worker; after the first load, offline reload preserved the home title and main landmark. First-load requests were only to `https://low-vision-workspace-profiles.sociobot.in`. This is useful evidence, but it does not satisfy the required demo-sandbox proof and cannot validate the unlisted privacy/offline claims.

## Claims test run from a clean clone

A clean clone at commit `d78ef5d7763a29601dab19e4010d252d36d76b03` was installed and checked in `/tmp/lvw-review-1-clean.L8I3Cx`.

| Command | Result |
|---|---|
| `npm ci` | PASS |
| `npm test` | PASS — 5 Vitest tests |
| `npm run test:browser` | PASS — 1 packaged-extension sensitive-field test |
| `npm run build` | PASS — extension, zip, and static site built |
| Every test listed in `.factory/claims.json` | **UNTESTED: file absent** |

The existing browser test is evidence that the earlier sensitive-payment-field defect is repaired; it is not tagged or registered as a visitor-facing claim test.

## Earlier-review/history check

Read all earlier matching artifacts present: `.factory/verification.md`, `.factory/verification-2.md`, and `.factory/handoff.md`. There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files.

The only earlier release-blocking finding was the payment-field styling defect in `verification.md`. It is fixed in code and test: `entrypoints/content.ts` uses one `isSensitive()` policy for persistent marking and focus magnification, `styles/content.css` excludes `[data-workspace-profiles-sensitive]`, and the clean-clone browser regression passed for password, payment, card, cc-*, CVC/CVV, autocomplete, and payment textarea fields at 180%. It is therefore not re-opened.

The earlier verifier’s cache-lifetime observation remains a low deployment follow-up, but it is not a first-read finding. The new findings in this review remain independently blocking.

## Structure and link checks

- `lang`, one h1, `<main>`, favicon, local font, Privacy, Terms, robots.txt, sitemap.xml, visible focus CSS, and reduced-motion CSS are present.
- Home has a description, but the metadata omissions in F-1-6 apply; legal pages have no description.
- Internal home, Privacy, Terms, extension ZIP, and Source links returned 200. `Buy Supporter Pass` returned 404 (F-1-4).
- `/demo` and a deliberately unknown route return the fallback home page with HTTP 200 (F-1-5).
- The art-deco transit visual system is distinct and matches `.factory/design.md`; it is not a generic SaaS template. Its placement ahead of the product explanation on mobile is nevertheless a first-read failure (F-1-1).

## What would make this perfect

Make the job, low-vision audience, and two clearly labelled first actions visible before any mobile scroll. Add an isolated, realistic `/demo` with reset and a visible active profile. Register every factual promise in `.factory/claims.json` with clean-sandbox tests, then remove any promise that cannot be proven. Repair or remove checkout until it works. Finish route/404/metadata/header-footer requirements, then run this entire review again with zero findings.
