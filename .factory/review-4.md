# Adversarial first-read review 4 — Workspace Profiles

**Review date:** 2026-08-28  
**URL:** <https://low-vision-workspace-profiles.sociobot.in/>  
**Verdict: PASS**

There are zero blocking or minor findings. This was a full, cold review of the live site plus a disposable clean clone. Pre-existing `graphify-out/` worktree changes were not reviewed or changed.

## Cold first read

Fresh Chromium contexts at 390×844 and 1440×900 had no stored site data and emitted no console or page errors. Before scrolling at both sizes I understood: it saves readable browser settings for each work site; it is for people with low vision who need larger text without losing tables and controls; click **Try it with sample data** first.

The exact copy is `Save readable settings for each work site`, `For people with low vision who need larger text without losing tables and controls.`, and `Try it with sample data`. The first screen also includes the result note, both named actions, and the three facts `No account`, `Settings stored in your browser`, and `Core controls cost nothing`.

## Copy audit

Whitespace-delimited count follows every sentence. No sentence exceeds 22 words. No banned plain-words word appears. There are no jargon, marketing-adjective, terminology, heading, or action-label flags.

### Landing page

| ID | Sentence | Words |
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

`Save readable settings for each work site`, `Set up a profile for one site`, `Keep text readable without enlarging every control`, `Your settings stay in your browser`, and `Questions before you install` stand alone as headings. `Try it with sample data`, `Download the extension`, `Read the privacy notice`, `Export sample profile`, `Share report`, `Show report actions`, and `Copy summary` accurately name an outcome or disclosure. The public vocabulary is consistently **site**, **profile**, **line spacing**, **cursor ring**, **hold-to-enlarge focus**, **color**, and **backup file**.

### README

| ID | Sentence | Words |
|---|---|---:|
| R1 | Workspace Profiles is a Chromium extension for people with low vision. | 11 |
| R2 | It saves a reading profile for each site. | 8 |
| R3 | Text can grow without enlarging every control or table. | 9 |
| R4 | A profile controls text size, line spacing, color, the cursor ring, and hold-to-enlarge focus. | 14 |
| R5 | Password and common payment fields keep their original styling. | 9 |
| R6 | Open the sample-data demo. | 4 |
| R7 | It starts with a Quarterly reports profile assigned to reports.example. | 10 |
| R8 | Change or pause the sample profile. | 6 |
| R9 | Export the sample profile as a backup file. | 8 |
| R10 | Reset demo removes the demo:workspace-profiles:reports-example key. | 6 |
| R11 | The demo uses this separate browser-storage key. | 7 |
| R12 | See .factory/demo.md. | 2 |
| R13 | Requirements: Node.js 20+ and npm. | 5 |
| R14 | npm run build creates the unpacked extension, extension ZIP, and static site in dist/. | 14 |
| R15 | To test the extension, open chrome://extensions and enable Developer mode. | 10 |
| R16 | Choose Load unpacked and select dist/extension/chrome-mv3. | 6 |
| R17 | Open an HTTP or HTTPS page, select the toolbar icon, and create a profile. | 14 |
| R18 | The claim registry is .factory/claims.json. | 5 |
| R19 | Each entry names its automated test. | 6 |
| R20 | Packaged-extension tests cover every reading control and sensitive-field exclusion. | 9 |
| R21 | Before release, serve dist/site. | 4 |
| R22 | Run the accessibility checks. | 4 |
| R23 | Test keyboard navigation at 200% browser zoom. | 7 |
| R24 | Profiles and site assignments use Chromium extension storage. | 8 |
| R25 | The extension includes no analytics or third-party runtime scripts. | 9 |
| R26 | Read the privacy notice. | 4 |
| R27 | These claims are tested as extension-storage and extension-no-analytics in the claim registry. | 12 |
| R28 | Deploy dist/site as a static site. | 6 |
| R29 | The repository does not manage DNS, billing, or infrastructure. | 9 |
| R30 | MIT. | 1 |
| R31 | Atkinson Hyperlegible uses the SIL Open Font License 1.1; see THIRD_PARTY_NOTICES.md. | 11 |

All behavioral and privacy statements cross-check to a relevant registered claim: isolation, controls, persistence, export, same-origin traffic, account, free core, offline, colors, cursor, focus, sensitive fields, storage, analytics, reversibility, site assignment, and extension privacy. The image-provenance sentence is documented in `.factory/design.md`, not a visitor-relied-on product behavior claim.

## Demo and sandbox

The first landing action opened `/demo/` in one click. The initial demo already showed the active `Quarterly reports` profile, `reports.example`, a realistic quarterly service report, visible reading controls, usable report actions, and the persistent banner `Demo — sample data, nothing is saved to your real profiles` with **Reset demo** and **Start for real**.

The live 390px test observed only the product origin during demo load and reset. Reset left no demo key in `localStorage`. The dedicated clean-sandbox isolation test seeds a real-data sentinel, changes and resets the sample, confirms only `demo:workspace-profiles:reports-example` is used, and confirms the sentinel survives. The separate first-party-only and offline tests passed.

## Claims and quality gates

A disposable clean clone at `/tmp/lvw-review4` was installed with `npm ci`. Every exact command in `.factory/claims.json` was run separately and passed:

`demo-isolation`, `reading-controls`, `profile-persistence`, `json-export`, `first-party-only-demo`, `no-account-demo`, `free-core`, `offline-demo`, `color-options`, `cursor-ring`, `hold-focus`, `sensitive-fields`, `extension-storage`, `extension-no-account`, `extension-no-analytics`, `extension-reversible`, `extension-assignment`, and `extension-privacy`.

`npm test` passed (5 tests), `npm run lint` passed, `npm run build` produced `dist/`, and `npm run test:site` passed (9 tests, including metadata, mobile, keyboard, and axe coverage). No claim failed or was left untested.

## Earlier findings and history check

All prior review, polish, and handoff records were read. The following live/code evidence confirms each earlier finding is fixed, not merely marked fixed.

| Finding | Current confirmation |
|---|---|
| F-1-1 | Both cold first screens contain job, audience, action, outcome, and facts. |
| F-1-2 | Direct isolated demo, realistic seed, banner, reset, start-for-real, and offline reload work. |
| F-1-3 | All visitor-relied-on functional/privacy claims have registered observable tests. |
| F-1-4 | No paid CTA remains; extension ZIP resolves. |
| F-1-5 | Public deep links load; missing routes return designed HTTP 404. |
| F-1-6 | Public routes and 404 have required title and social metadata. |
| F-1-7 | Shared header/footer contain correct navigation, credit, and version. |
| F-1-8 | Literal site/profile terminology and named actions are retained. |
| F-1-9 | README leads with documented demo, seed, reset, and namespace. |
| F-1-10 | README prose remains within the 22-word cap. |
| F-1-11 | Packaged sensitive-field regression passes. |
| F-1-12 | Release checks are brief, separate instructions. |
| F-1-13 | Public terminology is plain and consistent. |
| F-1-14 | Heading outline is meaningful and tested. |
| F-1-15 | Mobile actions show full labels. |
| F-1-16 | Transit naming is decorative only. |
| F-2-1 | 1440×900 shows the safe action, outcome, and facts. |
| F-2-2 | Sample buttons have visible announced results at maximum settings. |
| F-2-3 | Packaged extension behavior covers storage, account, analytics, reversibility, assignment, and privacy. |
| F-2-4 | Focus control consistently uses `hold-to-enlarge focus`. |
| F-3-1 | Color, cursor, and hold-focus behavior each have registered tests. |
| F-3-2 | 390×844 includes full outcome and all facts. |
| F-3-3 | Route focus and polite status announcement work forward and back. |
| F-3-4 | 404 has complete OG/Twitter metadata. |
| F-3-5 | `Show report actions` names its disclosure result. |
| F-3-6 | Public backup wording is plain. |

## Structure, routing, and identity

Live `/`, `/demo`, `/privacy`, and `/terms` return 200. `/review4missing` returns the designed HTTP 404 with a Home action. `robots.txt` and `sitemap.xml` are present. Titles follow the required product/route patterns; pages have one h1 and a main landmark, a skip link, favicon, canonical, description, and OG/Twitter metadata. Crawled product, ZIP, and source links resolve. Route tests confirm direct loads, back/focus restoration, polite announcement, and no horizontal mobile overflow.

The warm-paper/night art-deco transit poster, locally hosted Atkinson font, stepped geometry, and product-specific original control-room art match `.factory/design.md`. It is not a generic SaaS template.

## Missed leverage

No AI, sync, or other remote feature is implied by this privacy-first, local browser-extension job. Profile backup is already present. Adding remote processing would broaden the privacy model without improving the stated task.

## What would make this perfect

Nothing is currently required. Preserve the demo isolation, plain vocabulary, and claim-per-behavior discipline for future changes.
