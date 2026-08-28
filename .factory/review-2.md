# Adversarial first-read review 2 — Workspace Profiles

**Review date:** 2026-08-28  
**URL reviewed:** <https://low-vision-workspace-profiles.sociobot.in/>  
**Verdict: FAIL**

The product has a working, isolated sample demo and a distinct visual system. It does not yet meet the first-screen requirement at desktop size, the demo presents inert controls as usable, and several visitor-facing extension claims do not have matching claim entries and observable tests.

## Cold first read

Fresh Chromium contexts were used at 390×844 and 1440×900, with no existing site storage. Console and page-error listeners were clean.

At **390×844**, before scrolling, the page answers all three first-read questions:

- **What it does:** “Save readable settings for each work site.”
- **For whom:** “For people with low vision who need larger text without losing tables and controls.”
- **First action:** “Try it with sample data.”

At **1440×900**, the headline is visible, and only the first line of the audience sentence is at the bottom edge. The no-setup action and its explanation are not visible. The only visible action is the header’s “Download the extension.” A visitor can infer that they should install something, but cannot see the safe first action promised by the page.

## Findings

### F-2-1 — BLOCKING — The desktop first screen hides the required demo action, outcome note, and plain facts

**Location / exact text:** Live `/` at 1440×900 before scroll. The visible hero ends with the partial sentence “For people with low vision who need larger”. The primary “Try it with sample data,” the adjacent “The demo opens an active sample profile.” note, and the three facts are below the fold. The visible header action is “Download the extension.”

**Why this fails:** The required first screen must show the job, audience, primary no-setup action with its result, and three plain facts. This layout makes installation appear to be the first step and hides the try-before-install path on a common desktop viewport. It fails the same cold-read goal that the mobile repair addressed.

**Concrete fix:** Reduce the desktop hero heading size and/or top/bottom hero padding so the complete audience sentence, **Try it with sample data**, its outcome note, and the three facts fit in 900px. Keep the art after that information in visual priority. Add a 1440×900 test asserting all of those elements are in the viewport.

### F-2-2 — BLOCKING — The sample report claims buttons remain usable, but its visible buttons are inert

**Location / exact text:** Live `/demo/` says “Change the controls. The report updates now, while its table and buttons remain usable.” The sample document exposes enabled “Share report” and “More actions” buttons.

**Evidence:** In a fresh live context, clicking **Share report** left the URL, body text, and `#demo-status` unchanged. Code inspection confirms `site/demo/index.html` defines those two buttons and `site/demo.ts` registers no handlers for either. The registered `@claim:reading-controls` test only checks that the first button is enabled; it does not assert an observable action.

**Why this fails:** An enabled button that does nothing is not usable. The demo makes a specific promise about preserving real-page controls while using a fake page that immediately breaks that promise. This weakens the core evidence that enlarged text preserves work controls.

**Concrete fix:** Give both sample buttons a small, reversible observable action (for example, an announced “Sample report shared” status and an actions menu), then change `@claim:reading-controls` to click each relevant control and assert its result after maximum text/spacing settings. If interaction is intentionally out of scope, render them as non-interactive examples and change the sentence to say so; do not call them usable.

### F-2-3 — BLOCKING (reopens F-1-3) — Visitor-facing extension claims remain unlisted or are covered only by a demo-scoped claim

**Location / exact text:** Landing page and README.

The following statements are visitor-facing claims but do not have a matching extension-scoped entry in `.factory/claims.json` with an observable test:

| Location | Exact claim | Gap and concrete fix |
|---|---|---|
| Landing privacy section | “The extension stores profiles and site assignments in Chromium extension storage.” | Add an `extension-storage` claim that loads the packaged extension, saves an assigned profile, and asserts its `chrome.storage.local` record. |
| Landing facts | “No account” | `no-account-demo` proves only the website sample has no login. Add an extension-flow test that creates and assigns a profile without credentials, or qualify the fact as “No account for the sample demo.” |
| Landing facts | “0 analytics scripts” | Add a packaged-extension request/interception test covering popup, background, and content script, or remove the numeric fact. |
| Landing FAQ | “The extension applies reversible reading settings in your browser.” | Add a packaged-extension test that applies a profile, pauses/removes it, and observes the target document return to baseline. |
| Landing FAQ | “It uses site access to apply the profile assigned to the current address.” | Add a packaged-extension assignment test across two fixture hosts/addresses and assert only the assigned host activates. |
| Landing FAQ | “It changes visual presentation and works alongside browser accessibility tools.” | The first clause needs an observable extension test; the compatibility assertion needs a defined, testable compatibility scope or removal. |
| README privacy | “Profiles and site assignments use Chromium extension storage.” | Same missing `extension-storage` claim. |
| README privacy | “The extension includes no analytics or third-party runtime scripts.” | Same missing packaged-extension traffic/static-dependency claim. |
| README demo | “Demo code does not read extension data.” | `demo-isolation` only seeds and inspects website `localStorage`. Add a packaged-extension-plus-demo isolation test or narrow the statement to the tested website storage namespace. |

**Why this fails:** `first-party-only-demo` is expressly a demo claim, while these statements describe the installed extension. `extension-privacy` covers a target page’s remote requests, not its storage location, account requirement, analytics/static dependencies, reversibility, assignment boundary, or compatibility. The earlier claim-registry finding is therefore only partly repaired.

**Concrete fix:** Add the listed registry entries and clean-sandbox behavioral tests, each tagged exactly once, or remove/narrow the statements. The README and landing copy must use the same scope as each registered claim.

### F-2-4 — MINOR — The same feature has two public names

**Location / exact text:** Landing setup step says “focus enlargement”; README says “hold-to-enlarge focus.”

**Why this fails:** A visitor has to decide whether these are separate controls or two names for one keyboard-triggered feature.

**Concrete fix:** Use one term everywhere, for example **hold-to-enlarge focus**, and use it in the landing setup step, README, demo labels, and any extension UI description.

## Copy audit

Counts are whitespace-delimited. The audit includes prose sentences; headings, facts, navigation, and buttons are checked immediately after the tables. No prose sentence exceeds 22 words. No banned marketing adjective or banned plain-words term was found.

### Landing-page sentences

| # | Sentence | Words |
|---|---|---:|
| L1 | For people with low vision who need larger text without losing tables and controls. | 14 |
| L2 | The demo opens an active sample profile. | 7 |
| L3 | The download gives you the Chromium extension ZIP. | 8 |
| L4 | A profile groups the reading settings you want to use together. | 11 |
| L5 | Open a site and choose a name you will recognize. | 10 |
| L6 | Set text size, line spacing, color, cursor ring, and focus enlargement. | 11 |
| L7 | Save the profile for that site. | 6 |
| L8 | Pause it when you need the original view. | 8 |
| L9 | Adjust text and spacing independently while the page structure stays familiar. | 11 |
| L10 | Choose from 100% to 180%. | 5 |
| L11 | Choose from 1.2× to 2×. | 5 |
| L12 | Use the site, warm paper, high contrast, or night colors. | 10 |
| L13 | Alt + Shift + M enlarges keyboard focus. | 8 |
| L14 | The extension stores profiles and site assignments in Chromium extension storage. | 11 |
| L15 | It sends no page text or form values. | 8 |
| L16 | No. | 1 |
| L17 | The extension applies reversible reading settings in your browser. | 9 |
| L18 | It uses site access to apply the profile assigned to the current address. | 13 |
| L19 | Password and common payment fields keep their original styling and are not enlarged. | 13 |
| L20 | No. | 1 |
| L21 | It changes visual presentation and works alongside browser accessibility tools. | 10 |
| L22 | Save a readable profile for each work site. | 8 |
| L23 | Original hero artwork generated with the factory image model. | 9 |

### README sentences

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
| R10 | Demo code does not read extension data. | 7 |
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
| R28 | Atkinson Hyperlegible uses the SIL Open Font License 1.1. | 9 |

### Headings, terms, and actions

- The headline is eight words, job-first, and clear. The other landing headings make sense when read alone.
- Landing actions are result-naming: **Try it with sample data**, **Download the extension**, and **Read the privacy notice**. The demo’s **Share report** and **More actions** are not result-naming in their current inert state; F-2-2 covers them.
- `site` and `profile` are otherwise consistent. F-2-4 records the remaining inconsistent focus-control name.

## Demo and sandbox checks

The one-click route works: clicking the first mobile **Try it with sample data** link opens `/demo/`. The first demo screen shows the persistent banner, `reports.example`, the named **Quarterly reports** profile, **Profile active**, and the initial text-size control. The seed includes a plausible quarterly report with monthly request counts.

In a fresh live context, a non-demo `localStorage` sentinel survived demo entry and **Reset demo**. A modified demo created only `demo:workspace-profiles:reports-example`; reset removed that key. Recorded requests during home-to-demo entry, adjustment, and reset were all same-origin. After an online visit and service-worker control, a live offline reload retained the title, h1, and banner. These checks confirm the demo namespace and offline behavior, but do not repair the inert-control problem in F-2-2.

## Claims test run from a clean clone

A fresh clone of the reviewed `c9f3ace` checkout was created under `/tmp/lvw-review2.uqTXFY` and installed with `npm ci`.

| Registered claim | Result |
|---|---|
| `demo-isolation` | PASS |
| `reading-controls` | PASS |
| `profile-persistence` | PASS |
| `json-export` | PASS |
| `first-party-only-demo` | PASS |
| `no-account-demo` | PASS |
| `free-core` | PASS |
| `offline-demo` | PASS |
| `sensitive-fields` | PASS |
| `extension-privacy` | PASS |

The eight site claims were exercised by their registered `npm run test:claims -- --grep @claim:<id>` commands and again by `npm run test:site` (9/9). The two packaged-extension claims were exercised by their registered `npm run test:browser -- --grep @claim:<id>` commands and again by `npm run test:browser` (2/2). `npm test` passed (5/5) and `npm run build` produced `dist/`. No registered command failed. F-2-3 concerns claims that are absent or scoped too narrowly, rather than a failing listed command.

## Earlier-review and history check

Read `.factory/review-1.md`, `.factory/polish-1.md`, `.factory/verification.md`, `.factory/verification-2.md`, and the preceding handoff.

- F-1-1 is fixed at 390px: the job, audience, named demo action, and download action are visible. F-2-1 records the new desktop first-screen failure.
- F-1-2 is fixed: `/demo/` and `?demo=1` enter an isolated sample with banner, reset, start-for-real, and offline reload. F-2-2 records the separately observed inert sample controls.
- F-1-3 is only partly fixed and is reopened by F-2-3.
- F-1-4 through F-1-7 are fixed: no checkout is present; direct demo/legal routes and a real HTTP 404 work; metadata/header/footer are present.
- F-1-8 through F-1-15 are fixed except the new focus-control wording inconsistency in F-2-4. The mobile action labels remain visible and all audited prose remains within the word limit.
- F-1-16 is fixed for `site` and `profile` terminology.
- The prior sensitive-payment-field release blocker is fixed in code and the packaged-extension `@claim:sensitive-fields` regression passes.

## Structure, routing, and accessibility checks

- Live `/`, `/demo/`, `/privacy/`, and `/terms/` each return 200 with `lang="en"`, one `<main>`, one `<h1>`, a route title, description, canonical, Open Graph image, favicon, and Apple touch icon.
- The route titles follow the required patterns: `Workspace Profiles — save reading settings per site`, `Demo — Workspace Profiles`, `Privacy — Workspace Profiles`, and `Terms — Workspace Profiles`.
- A deliberately missing live route returned HTTP 404 with `404 — Workspace Profiles`, a styled h1, and a return-home action.
- All crawled links from the product routes returned 200, including the extension ZIP and source repository. `?demo=1` redirected to `/demo/`.
- Live navigation to Demo moved focus to the new h1; Back restored focus to the Demo link.
- Axe on all four live routes at 390px in dark/reduced-motion mode reported zero violations and no horizontal overflow.
- The art-deco transit visual identity is distinct and matches `.factory/design.md`; it is not a generic SaaS template.

## Missed leverage

No additional AI feature is expected for this local-first visual-reading extension. It already has the expected JSON export and import in the installed extension, and a remote AI or sync feature would broaden the privacy scope without improving the stated core task.

## What would make this perfect

Make the no-setup demo action, its outcome, and the three facts visible in the 1440×900 first screen. Make every visible sample-document control actually work, and test that it still works at the maximum reading settings. Then align every installed-extension privacy, storage, account, analytics, assignment, and reversibility claim with a dedicated clean-sandbox test or remove it. Finally use one name for the focus feature and rerun this complete review.
