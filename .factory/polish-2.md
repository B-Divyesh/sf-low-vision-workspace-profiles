# Perfection-loop polish 2

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Retained the job-first mobile first screen, named demo/download actions, outcome note, and facts. | `routes, metadata, mobile first screen, keyboard, and accessibility` at 390×844. |
| F-1-2 | Retained the isolated `/demo/` and `?demo=1` path, persistent banner, reset, start-for-real cleanup, sample report, and `demo:` key. | `@claim:demo-isolation`, `@claim:offline-demo`, `.factory/demo.md`. |
| F-1-3 | Expanded the claim registry from demo-only coverage to installed-extension storage, account, analytics, reversible styling, and address-assignment coverage. | Every command in `.factory/claims.json`; `npm run test:site`; `npm run test:browser`. |
| F-1-4 | Kept the unregistered paid offer and dead checkout removed. | `@claim:free-core`; no `checkout` link in the site. |
| F-1-5 | Kept direct demo/legal routes and designed HTTP 404 behavior. | Route test asserts `/not-a-real-page` is 404. |
| F-1-6 | Kept plain route titles, descriptions, canonical, OG/Twitter metadata, social image, favicon, and touch icon. | Route metadata assertions and axe route scan. |
| F-1-7 | Kept shared header/footer navigation, Param Factory credit, and version. | Route scan in `npm run test:site`. |
| F-1-8 | Kept site/profile terminology and named actions; the transit motif remains decorative only. | `.factory/copy-audit.md`; home route assertions. |
| F-1-9 | Kept the README demo instructions, namespace, build/test/deploy commands, and claim registry link. | `README.md`; `@claim:demo-isolation`. |
| F-1-10 | Kept README sentences under the copy limit. | `.factory/copy-audit.md`. |
| F-1-11 | Kept the sensitive-field explanation plain and linked it to a behavioral browser test. | `@claim:sensitive-fields`. |
| F-1-12 | Kept release verification as short, separate steps. | `README.md`; `npm run lint`, `npm test`, and build evidence. |
| F-1-13 | Kept public terminology plain: browser storage, reading settings, color, cursor ring, line spacing, and hold-to-enlarge focus. | `.factory/copy-audit.md`. |
| F-1-14 | Kept task headings that make sense out of context. | One-h1/heading checks in `npm run test:site`. |
| F-1-15 | Kept visible mobile action names and the one-click demo. | 390×844 viewport assertion. |
| F-1-16 | Kept `site` and `profile` as the public vocabulary. | `.factory/copy-audit.md`. |
| F-2-1 | Reduced desktop hero type and spacing while preserving the art-deco rail identity. At 1440×900 the audience, demo action, outcome note, and facts all fit before the fold. | Desktop viewport assertions in `routes, metadata, mobile first screen, keyboard, and accessibility`. |
| F-2-2 | Made **Share report**, **More actions**, and **Copy summary** produce visible, announced outcomes in the sample report. | `@claim:reading-controls` sets 180%/2×, clicks every control, and asserts each result. |
| F-2-3 | Added six packaged-extension claims: `extension-storage`, `extension-no-account`, `extension-no-analytics`, `extension-reversible`, `extension-assignment`, and narrowed `extension-privacy`. Updated landing, privacy, and README copy to match. | `npm run test:browser` (7/7); each registry command is run from a clean clone before handoff. |
| F-2-4 | Replaced the remaining public “focus enlargement” wording with **hold-to-enlarge focus**. | `.factory/copy-audit.md`; landing copy search. |

No review finding remains open. The deploy evidence and cold live checks are recorded in `.factory/handoff.md` after the work-order deployment.
