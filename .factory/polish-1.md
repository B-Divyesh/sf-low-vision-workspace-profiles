# Perfection-loop polish 1

Live verification target: <https://low-vision-workspace-profiles.sociobot.in/>. Local visual evidence is in `.factory/evidence/local/`; cold live output is in `.factory/evidence/live-final.json`.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Put the eight-word job headline, low-vision audience, named demo action, named download action, outcome note, and three facts before the art on phones. Kept button text visible. | `routes, metadata, mobile first screen, keyboard, and accessibility`; `local/home-mobile.png`; live bounding boxes: h1 bottom 537 px and demo action bottom 714 px in an 844 px viewport. |
| F-1-2 | Added an immediately active sample at `/demo/` and `?demo=1`, using only `demo:workspace-profiles:reports-example`; added persistent banner, reset, start-for-real cleanup, pause, realistic report, controls, and export. | `@claim:demo-isolation`; `@claim:no-account-demo`; `local/demo-desktop.png`; live `/demo/` and `/?demo=1`. |
| F-1-3 | Added `.factory/claims.json` with ten claims and exactly one tagged behavioral test per claim. Removed unsupported billing/refund promises and narrowed copy to tested behavior. | Every registry command passed separately in `/tmp/lvw-polish-clean.TEKW3L`; full `npm run test:claims` and `npm run test:browser` pass. |
| F-1-4 | Removed the unregistered Supporter Pass, `$14` copy, restore UI, license code, checkout link, and payment terms. | `@claim:free-core`; live link crawl has no checkout URL and all remaining links return 200. |
| F-1-5 | Added `/demo/`; removed the SPA fallback; added `404.html` with Azure `responseOverrides` preserving status 404. | Route test; live `/missing-final` returned 404 with `404 — Workspace Profiles`; `local/not-found.png`. |
| F-1-6 | Added plain route titles, descriptions, canonicals, OG/Twitter metadata, 1200×630 social art, favicon, and 180×180 touch icon. | Route metadata test; live route scan; `site/public/assets/social-card.jpg`. |
| F-1-7 | Standardized Home, Demo, How it works, Privacy navigation and the footer’s one-liner, legal links, Param Factory credit, and version. | Route test and live link crawl on all four routes. |
| F-1-8 | Standardized visitor terminology on `site` and `profile`; transit language remains visual decoration only; rewrote action labels. | `.factory/copy-audit.md`; live home text; `local/home-mobile.png`. |
| F-1-9 | Added the demo before installation in README, including sample, reset, namespace, and verification commands. | `README.md`; `.factory/demo.md`; `@claim:demo-isolation`. |
| F-1-10 | Split the old 23-word README sentence into short sentences. | `.factory/copy-audit.md`; longest README sentence is 15 words. |
| F-1-11 | Replaced the 30-word test description with a 15-word plain description. | `.factory/copy-audit.md`; README Verification section. |
| F-1-12 | Split the release-check sentence into three direct steps. | `.factory/copy-audit.md`; README Verification section. |
| F-1-13 | Replaced public jargon with browser storage, reading settings, color, cursor ring, focus enlargement, and line spacing. | Banned/jargon search in `.factory/copy-audit.md`; live copy review. |
| F-1-14 | Replaced slogan headings with task headings that make sense out of context. | Heading outline in route test; live `/` h1 and h2 review. |
| F-1-15 | Replaced the ambiguous setup action and retained full download labels at 390 px. | Mobile viewport assertions; `local/home-mobile.png`. |
| F-1-16 | Uses `site` for the destination and `profile` for the saved settings throughout visitor copy. | Terminology table in `.factory/copy-audit.md`; repository copy search. |
| Earlier sensitive-field blocker | Kept the shared sensitive-field policy and tagged the packaged regression as a claim test. | `@claim:sensitive-fields` passes for password, payment, card, cc-*, CVC/CVV, autocomplete, and textarea fields at 180%. |
| Earlier immutable-cache observation | Added a one-year immutable response rule for `/assets/*` and `no-cache` for `sw.js`. | Live CSS response header shows `public, max-age=31536000, immutable`. |
| Cold-live dark contrast check | Changed the dark demo banner foreground and fixed the warm sample eyebrow color. Added dark/reduced-motion axe coverage. | Final live axe: 0 violations on `/`, `/demo/`, `/privacy/`, `/terms/`; Lighthouse accessibility 100. |

No review finding remains open.
