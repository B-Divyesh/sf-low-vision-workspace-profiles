# Verification 3 — Save readable settings for each work site

- Date: 6 September 2026
- Live URL: <https://low-vision-workspace-profiles.sociobot.in/>
- Implementation reviewed: `af023cc95101708cbf6b272523451c1bc86dd845`
- Documentation baseline: `fa3d7e099beda92ccd60e7d680120bc3db97e74f`
Later checkout commit: `ca79e22e08b238ccbe51aa44f04c1734e6e98c90` changes only `graphify-out/` and does not change the product image.

## Verdict

**FAIL — 1 finding and 4 untested public claims.**

The live product behavior passed the fresh phone, desktop, demo, accessibility, offline, privacy, and installed-extension checks. All 20 declared claim commands also pass. The release still cannot pass the claims contract because four installed-extension actions are absent from, or bypassed by, the declared automated claim coverage.

## Job, audience, and first action

- Job: save readable settings for each work site.
- Audience: people with low vision who need larger text without losing tables and controls.
- First action: **Try it with sample data**.

At scroll position zero, both fresh browsers showed all three items, the action outcome, and the three plain facts. On the 390×844 phone the facts ended at 587 px. On the 1440×900 desktop they ended at 831 px. Screenshots are `/work/.evidence/verification-3/live-home-phone.png` and `live-home-desktop.png`.

## Finding

### V3-1 — Blocking — Four installed-extension actions lack complete declared claim tests

The packaged popup exposes these public outcomes:

1. **Save and apply** creates, stores, assigns, and applies a profile from the empty state.
2. **Export backup** downloads the installed extension's saved profiles.
3. **Import backup** restores profiles and assignments. The section says, “Move profiles to another device.”
4. **Delete profile** says, “You can undo for 10 seconds.”

The registry does not prove these outcomes through the user interface:

- `@claim:extension-storage` calls the test helper `saveAssignedProfile()`. That helper writes `workspaceProfilesData` directly with `chrome.storage.local.set`; it never opens the empty state or activates **Create my first profile** and **Save and apply**.
- `@claim:json-export` clicks **Export sample profile** in the website demo. Its registry `where` and sandbox are demo-only. It never clicks the installed popup's **Export backup**.
- No claim entry or tagged test exercises a successful **Import backup**.
- No claim entry or tagged test exercises deletion, undo, or the stated 10-second limit.

This is a coverage finding, not evidence that the current build is broken. A direct clean-profile check of the live ZIP found that all four behaviors work, including valid and invalid import, immediate undo, and expiry after 10 seconds. That manual result does not satisfy the requirement that public claims run in the declared sandbox on every build.

Required repair: add packaged-extension claim entries and user-path tests for save/apply, extension export, successful import, and 10-second delete undo. The tests must use the popup controls rather than seed their promised outcome through `chrome.storage.local`.

## Fresh checkout and quality gates

A detached clone was checked out at the implementation SHA and installed with the documented Node.js/npm setup.

| Command | Result |
|---|---|
| `npm ci` | PASS — 176 packages; 0 audit vulnerabilities |
| `npm test` | PASS — 5/5 |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS — `dist/` contains the site, unpacked extension, and ZIP |
| `npm run test:site` | PASS — 13/13 |
| `npm run test:browser` | PASS — 11/11 |
| `npm audit --omit=dev` | PASS — 0 vulnerabilities |

Logs are under `/work/.evidence/verification-3/`. The build produced 22.94 KB CSS, at most 3.53 KB JavaScript per route chunk, a 24.90 KB local font, a 31.03 KB phone AVIF, and a 68.14 KB unpacked extension.

## Declared claim commands

Every command in `.factory/claims.json` ran separately from the detached clean checkout. Each declared id occurs in exactly one tagged test. All 20 declared commands passed.

| Claim id | Result | Evidence |
|---|---|---|
| `demo-isolation` | PASS | `claim-demo-isolation.log` |
| `reading-controls` | PASS | `claim-reading-controls.log` |
| `sample-share` | PASS | `claim-sample-share.log` |
| `sample-copy` | PASS | `claim-sample-copy.log` |
| `profile-persistence` | PASS | `claim-profile-persistence.log` |
| `json-export` | PASS for the website demo only | `claim-json-export.log`; V3-1 records the uncovered extension action |
| `first-party-only-demo` | PASS | `claim-first-party-only-demo.log` |
| `no-account-demo` | PASS | `claim-no-account-demo.log` |
| `free-core` | PASS | `claim-free-core.log` |
| `offline-demo` | PASS | `claim-offline-demo.log` |
| `color-options` | PASS | `claim-color-options.log` |
| `cursor-ring` | PASS | `claim-cursor-ring.log` |
| `hold-focus` | PASS | `claim-hold-focus.log` |
| `sensitive-fields` | PASS | `claim-sensitive-fields.log` |
| `extension-storage` | PASS for direct storage/application behavior | `claim-extension-storage.log`; V3-1 records the bypassed popup save path |
| `extension-no-account` | PASS | `claim-extension-no-account.log` |
| `extension-no-analytics` | PASS | `claim-extension-no-analytics.log` |
| `extension-reversible` | PASS | `claim-extension-reversible.log` |
| `extension-assignment` | PASS | `claim-extension-assignment.log` |
| `extension-privacy` | PASS | `claim-extension-privacy.log` |

Declared claim failures: 0. Untested public claims: 4. The registry/tag audit is `/work/.evidence/verification-3/claim-tag-audit.json`.

## Live demo and recovery paths

- The first click opened `/demo/` with the active `Quarterly reports` profile for `reports.example`.
- The persistent label said **Demo — sample data, nothing is saved to your real profiles** and kept **Reset demo** and **Start for real** visible.
- The sample contained a quarterly report, three monthly rows, realistic counts, and the `Review June follow-up` note.
- Phone boundaries measured 17 px at 100% with 1.2× spacing and 30.6 px at 180% with 2× spacing. Controls remained usable.
- The live share observer received the title, summary, and exact production demo URL.
- The clipboard contained the fixed report summary after **Copy summary**.
- Reset restored 140%, 1.65×, warm paper, the original note, closed actions, cleared statuses, and removed the demo key.
- A seeded non-demo sentinel remained unchanged through editing and reset. **Start for real** removed the demo key and preserved the sentinel.
- Malformed demo storage recovered to the seed. Share cancellation and denied clipboard access produced accurate recovery messages and no false success.
- All requests during the demo flow stayed on the product origin.
- After initial installation, `/demo/` reloaded offline with its title, h1, banner, and sample shell.

Machine evidence is in `live-qa.json` and `live-start-real.json` under `/work/.evidence/verification-3/`.

## Installed live extension

The production ZIP SHA-256 is `911c50588e411f3f340f9cadf76fa6e6278e8cc545cbc52d2ca697295d26e363`. It was unpacked into a fresh Chromium profile.

- The 11 packaged-extension tests passed against the unpacked production ZIP.
- From an empty state, the popup rejected a blank name and returned focus to the name field.
- A `Quarterly dashboard` profile saved and applied at 180%, 2×, night color, 180% focused-content size, and enabled cursor ring.
- Reading text changed from 16 px to 28.8 px. An ordinary input grew from 13.3333 px to 21.12 px.
- Password and payment inputs remained 13.3333 px.
- Reloaded extension storage contained the profile and its `127.0.0.1` assignment.
- Export produced a valid one-profile backup. Invalid import showed a recovery message and retained the profile. Valid import restored it.
- Delete, immediate undo, and the 10-second undo expiry worked.
- Pausing restored the page to 16 px and removed the active profile marker.
- The popup had zero axe violations and no console or page errors.

Evidence is in `live-zip-consumer-test.log`, `live-extension-ui.json`, and `live-extension-popup.png` under `/work/.evidence/verification-3/`.

## Accessibility, routes, links, and privacy

- `/`, `/demo/`, `/privacy/`, and `/terms/` returned 200 with distinct titles, `lang="en"`, one h1, one main, header/nav/footer landmarks, a skip link, canonical and social metadata, and complete image alt text.
- The deliberate missing route returned HTTP 404 with the designed `Page not found` page, return link, metadata, and zero axe violations. Its 404 status is expected, not a defect.
- Axe found zero violations on all five documents in both light and dark modes.
- All visible controls measured at least 44×44 CSS px on the 390 px viewport.
- At 200% text size, Home and Demo had no horizontal overflow or lost main content/actions.
- The skip link was first in keyboard order and showed a 4 px designed outline. Forward navigation focused and announced the destination h1; Back restored focus and announced Home.
- Reduced motion reported no animation and a 0.01 ms transition fallback.
- Every internal route, fragment, download, legal link, and the product's source link resolved. The only 404 was the intentional missing-route probe.
- Home, Demo, Privacy, Terms, and 404 produced no unexpected console or page errors.
- The live CSP limits resources to self, blocks framing and objects, and includes `nosniff`, referrer, permissions, and frame headers.
- The extension and demo use local browser storage. There is no backend, tenant store, payment flow, or runtime AI call, so tenant isolation, restart persistence, health, and 429 checks do not apply.

Evidence is in `live-qa.json`, `live-axe-themes.json`, `live-links-resize.json`, `headers-*.txt`, and `verify-url/verify.json`.

## Performance and deployment identity

The successful Lighthouse mobile rerun scored Performance 100, Accessibility 100, Best Practices 100, and SEO 100. FCP was 0.86 s, LCP 1.21 s, TBT 0 ms, and CLS 0.

All 24 deployable files matched the clean implementation build byte for byte. `staticwebapp.config.json` was correctly excluded because it configures deployment rather than being served. Hashed assets return `public, max-age=31536000, immutable`; `sw.js` returns `no-cache` and uses cache `workspace-profiles-v6`.

Evidence is in `lighthouse-summary.json`, `lighthouse-mobile-rerun.json`, `live-artifact-match.json`, and the header captures.

## Earlier finding disposition

All earlier findings were inspected. Their product fixes remain present. V3-1 is a new claims-coverage finding.

| Earlier finding | Current proof |
|---|---|
| Verification payment-field blocker | Live ZIP kept password, card, payment, cc-*, CVC/CVV, autocomplete, and payment textarea styling unchanged at maximum scale. |
| Verification 2 immutable-cache note | Live hashed assets have a one-year immutable header; `sw.js` has `no-cache`. |
| F-1-1 | Phone and desktop show job, audience, first action, outcome, and facts before scrolling. |
| F-1-2 | One click and direct `/demo/` load the isolated populated sample with persistent label, reset, and exit cleanup. |
| F-1-3 | The earlier missing registry was added; all 20 declared commands pass. V3-1 identifies four later/uncovered extension actions. |
| F-1-4 | No paid offer or checkout exists; the free ZIP returns 200. |
| F-1-5 | Deep links load and the missing route is a designed HTTP 404. |
| F-1-6 | Every route, including 404, has its own title, description, canonical, Open Graph, and Twitter metadata. |
| F-1-7 | Header/footer navigation, legal links, Param Factory credit, and version are consistent. |
| F-1-8 | Public labels use literal site/profile/control words; the transit treatment is visual only. |
| F-1-9 | README leads with the demo and documents its seed, reset, namespace, and commands. |
| F-1-10 | The copy audit reports every README sentence at 22 words or fewer. |
| F-1-11 | Sensitive-field wording is plain and packaged behavior passes. |
| F-1-12 | Release checks remain short, separate instructions. |
| F-1-13 | Public control and storage terms are plain and consistent. |
| F-1-14 | Headings name their content; the 404 h1 says `Page not found`. |
| F-1-15 | Phone actions retain their full labels. |
| F-1-16 | `site` and `profile` remain the public vocabulary; no numbered metaphor labels remain. |
| F-2-1 | The complete desktop first screen ends at 831 px in a 900 px viewport. |
| F-2-2 | Live Share and Copy perform their browser API outcomes and report cancellation/failure accurately. |
| F-2-3 | Storage, account, analytics, reversibility, assignment, and request tests pass; V3-1 is limited to popup action coverage. |
| F-2-4 | Site, README, and popup consistently use `hold-to-enlarge focus`. |
| F-3-1 | All four colors, pointer/focus cursor ring movement, and key hold/release enlargement pass against the live ZIP. |
| F-3-2 | Phone outcome and facts end at 587 px in an 844 px viewport. |
| F-3-3 | Route changes and Back update focus and the polite status region. |
| F-3-4 | The live 404 has complete Open Graph and Twitter metadata. |
| F-3-5 | The demo action says `Show report actions`. |
| F-3-6 | Visitor copy says `backup file`; `.json` is limited to a file detail. |
| F-5-1 | Live Share and Copy use the share and clipboard APIs with verified payloads. |
| F-5-2 | Both reading-control lower and upper bounds are measured in declared and live checks. |
| F-5-3 | `Profile 01`–`04`, map language, and the popup metaphor heading are absent. |
| F-5-4 | Home, Demo, Privacy, Terms, 404, and popup targets meet 44×44 px. |

## Final counts

- Findings: **1**
- Untested public claims: **4**
- Verdict: **FAIL**
