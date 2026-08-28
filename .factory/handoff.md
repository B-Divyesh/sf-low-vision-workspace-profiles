# Workspace Profiles — review-1 handoff

## Status

**FAIL.** This was a read-only adversarial first-read review; no product code was changed. The complete report is in [review-1.md](review-1.md).

## What was checked

- Fresh live-browser checks at 390×844 and desktop before scrolling.
- Live `/demo`, `?demo=1`, unknown-route, metadata, link, service-worker/offline, and request-origin checks.
- Landing and README copy audit, including word counts.
- All earlier verification/handoff artifacts and the previous sensitive-payment-field blocker.
- Fresh-clone quality checks at `d78ef5d7763a29601dab19e4010d252d36d76b03`:

  - `npm ci` — pass
  - `npm test` — pass (5 tests)
  - `npm run test:browser` — pass (1 test)
  - `npm run build` — pass

## Blocking work left

1. Put a clear job/audience/action above the fold on a 390px phone.
2. Build and document an isolated, one-click sample-data demo with reset.
3. Add `.factory/claims.json` and sandboxed `@claim:` tests for every visitor-facing factual claim.
4. Repair or remove the live `Buy Supporter Pass` link, which returned HTTP 404.
5. Ship an actual `/demo`, a designed HTTP-404 route, complete per-route metadata, and the shared header/footer requirements.

The earlier payment-field styling defect is confirmed fixed by the clean-clone browser regression; it is not an outstanding review finding.
