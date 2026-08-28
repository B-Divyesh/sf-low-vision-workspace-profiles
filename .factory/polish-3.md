# Perfection-loop polish 3

Repair target: candidate `38830205f323fedbc6b3b4f0db60aebb45d1e6de`, cumulative reviews 1–3.

Production was checked cold at <https://low-vision-workspace-profiles.sociobot.in/> after deployment. The shared live evidence bundle is `.factory/evidence/polish-3-live/live-check.json`, with `home-390.png`, `home-1440.png`, `demo-390.png`, and `404-390.png` in the same directory. Source-only documentation findings use `.factory/copy-audit.md` as their non-visual evidence.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Kept the verb-first job headline, low-vision audience, named demo and download actions, outcome note, and three facts before the mobile artwork. | `routes, metadata, mobile first screen, keyboard, and accessibility`; `.factory/evidence/polish-3-local-home-390.png`; cold `/` check at 390×844. |
| F-1-2 | Kept `/demo/` and `?demo=1` as one-click entries to the active `Quarterly reports` sample. The persistent banner, reset, start-for-real cleanup, and isolated `demo:` key remain enforced. | `@claim:demo-isolation`; `@claim:offline-demo`; `.factory/evidence/polish-3-local-demo-390.png`; cold `/?demo=1` check. |
| F-1-3 | Expanded the claim registry to 18 entries and kept exactly one behavioral tag per id. Added packaged-extension proof for every remaining advertised control. | All 18 commands in `.factory/claims.json`; registry/tag-count audit; `npm run test:site`; `npm run test:browser`. |
| F-1-4 | Kept the unavailable paid offer and dead checkout removed. | `@claim:free-core`; live `/` has no checkout link and the extension ZIP returns 200. |
| F-1-5 | Kept direct demo/legal documents and the designed Static Web Apps 404 with a real 404 status. | Route test for `/not-a-real-page` and `/404.html`; `.factory/evidence/polish-3-local-404-390.png`; live missing-route check. |
| F-1-6 | Kept plain route titles, descriptions, canonicals, OG/Twitter cards, favicon, and touch icon; completed those fields on the 404 document. | Route metadata test on all public documents and 404; live head checks. |
| F-1-7 | Kept a consistent Home, Demo, How it works, Privacy header and a footer with Privacy, Terms, Param Factory, and version. | Public-route skeleton assertions in `npm run test:site`; live link crawl. |
| F-1-8 | Kept `site` and `profile` as public terms and retained transit geometry only as visual identity. | `.factory/copy-audit.md`; `.factory/design.md`; cold `/` review. |
| F-1-9 | Kept the demo before installation in README, including the seed, reset behavior, namespace, and test commands. | `README.md`; `.factory/demo.md`; `@claim:demo-isolation`. |
| F-1-10 | Kept every README sentence within 22 words. | `.factory/copy-audit.md`; longest audited README sentence is 14 words. |
| F-1-11 | Kept sensitive-field verification in plain words and backed it with a real packaged-extension regression. | `@claim:sensitive-fields`; `npm run test:browser`. |
| F-1-12 | Kept release checks as short, separate instructions. | README verification section; `.factory/copy-audit.md`. |
| F-1-13 | Replaced remaining popup route/station, halo, magnification, contrast-treatment, and JSON labels with profile/site, cursor ring, hold-to-enlarge focus, color, and backup file. | Popup axe/keyboard test; terminology audit in `.factory/copy-audit.md`. |
| F-1-14 | Kept task headings that make sense without surrounding context. | Heading outline assertions; cold home and 404 screenshots. |
| F-1-15 | Kept full action labels at 390px and a result-naming demo action. | Mobile viewport assertions; `.factory/evidence/polish-3-local-home-390.png`. |
| F-1-16 | Removed remaining visitor-facing route/station naming from the extension popup and default profile names. | `entrypoints/popup/index.html`; `entrypoints/popup/main.ts`; `shared/profiles.ts`; terminology audit. |
| F-2-1 | Kept the complete audience, primary action, outcome, and three facts inside both 1440×900 and 390×844 first screens. | Desktop and mobile viewport assertions; `.factory/evidence/polish-3-local-home-1440.png`; `.factory/evidence/polish-3-local-home-390.png`. |
| F-2-2 | Kept all sample-report actions operable and announced at maximum text size and spacing. | `@claim:reading-controls` clicks Share report, Show report actions, and Copy summary and asserts each result. |
| F-2-3 | Kept extension-scoped storage, account, analytics, reversibility, assignment, privacy, and sensitive-field claims tied to packaged behavior tests. | Ten extension claim commands in `npm run test:browser`; clean-clone claim matrix. |
| F-2-4 | Kept `hold-to-enlarge focus` as the single public name in the site, README, and popup. | Copy/terminology audit; `@claim:hold-focus`. |
| F-3-1 | Added `color-options`, `cursor-ring`, and `hold-focus` registry entries. Their packaged-extension tests verify all four colors, pointer and keyboard ring movement, and key-down enlargement with key-up restoration. | `@claim:color-options`; `@claim:cursor-ring`; `@claim:hold-focus`; `npm run test:browser` (11/11). |
| F-3-2 | Compressed only the phone header and hero spacing/type while preserving the art-deco rail system. The outcome note and all facts now fit at 390×844. | Mobile viewport assertions for `.action-note` and `.plain-facts`; `.factory/evidence/polish-3-local-home-390.png`; cold live 390×844 check. |
| F-3-3 | Added one polite, atomic route-status region to every document. Route code announces the destination h1 after forward and back navigation while retaining focus restoration. | Home → Demo → Back focus and live-region assertions in `npm run test:site`; live keyboard check. |
| F-3-4 | Added product-owned Open Graph and Twitter metadata to the designed 404 page. | 404 metadata assertions; `.factory/evidence/polish-3-local-404-390.png`; live `/polish-3-missing` check. |
| F-3-5 | Renamed `More actions` to `Show report actions`. | `@claim:reading-controls`; `.factory/evidence/polish-3-local-demo-390.png`; live demo action check. |
| F-3-6 | Replaced visitor-facing JSON wording with `backup file`; kept `.json` only as a file detail in the privacy notice and filename. | Landing/README copy audit; `@claim:json-export`; cold live copy check. |

## Verification summary

- Clean checkout at `ad1fea7d9845c68403f2547dce09b21c65d68b79`: `npm ci`, `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:site`, and `npm run test:browser` pass.
- Claims: every one of the 18 commands in `.factory/claims.json` passes individually from that clean clone.
- Accessibility: Playwright axe reports zero violations on all public routes in light and dark/reduced-motion modes and on the packaged popup.
- Performance: live mobile Lighthouse reports 100 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO; LCP 1.2 s, TBT 50 ms, CLS 0.
- Payload: initial site JS 4.7 KB total, CSS 22.8 KB, font 24.9 KB, and mobile AVIF hero 31.0 KB.
- Deployment: Azure deployment `f749ad8d-8f45-40c4-89bf-cde7b3f1a7a3`; the public site and downloadable extension match the clean-checkout build byte for byte.

The final cold visual pass also found and closed two defects beyond the written findings: dark-mode secondary-button labels now meet at least 5.98:1 contrast, and Reset demo clears all transient sample state. Both are covered by `routes, metadata, mobile first screen, keyboard, and accessibility` and `@claim:demo-isolation`.
