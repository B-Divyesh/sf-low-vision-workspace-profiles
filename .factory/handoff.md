# Workspace Profiles — adversarial review 2 handoff

## Status

**FAIL.** This reviewer changed no product code. The complete report is in [`.factory/review-2.md`](review-2.md).

## Review work completed

- Reviewed the live product cold in fresh Chromium contexts at 390×844 and 1440×900.
- Verified the live demo namespace, reset behavior, same-origin traffic, and offline reload.
- Read the design, demo, claim registry, README, all earlier review/polish/verification records, and relevant implementation/tests.
- Ran the registered claims from a fresh clone: 8 site claims and 2 packaged-extension claims passed.
- Ran `npm test` (5/5), `npm run test:site` (9/9), `npm run test:browser` (2/2), and `npm run build` successfully in that clone.
- Verified live metadata, routes, 404, link crawl, back/focus behavior, 390px dark/reduced-motion axe scan, and absence of console/page errors.

## Findings left

1. **F-2-1, blocking:** at 1440×900 the hero hides the demo action, its result, and the three facts below the fold.
2. **F-2-2, blocking:** visible sample-report buttons are enabled but do nothing, despite the demo promise that buttons remain usable.
3. **F-2-3, blocking:** several installed-extension privacy/storage/account/analytics/assignment claims remain unlisted or have only demo-scoped coverage; this reopens F-1-3.
4. **F-2-4, minor:** public copy uses both “focus enlargement” and “hold-to-enlarge focus” for one feature.

## Reproduce

```sh
npm ci
npm test
npm run test:claims
npm run test:site
npm run test:browser
npm run build
```

For the live checks, open <https://low-vision-workspace-profiles.sociobot.in/> at 390×844 and 1440×900, then enter the demo via **Try it with sample data**. In the sample report, click **Share report**: it currently has no observable result.

## Next steps

Implement the concrete fixes in `review-2.md`, add the required claim coverage, then run a new full cold review rather than a diff-only check.
