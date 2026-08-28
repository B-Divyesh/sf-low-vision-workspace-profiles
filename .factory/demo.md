# Demo sandbox

- URL: `https://low-vision-workspace-profiles.sociobot.in/demo/` or `/?demo=1`
- Sample: the `Quarterly reports` profile on `reports.example`, plus a realistic report, controls, table, and note field.
- Storage: only `localStorage["demo:workspace-profiles:reports-example"]`. The demo never reads or writes extension storage or non-demo site keys.
- Reset: **Reset demo** removes the demo key, restores the seeded controls and note, closes sample actions, and clears their statuses. The next change creates a fresh demo key.
- Leave: **Start for real** removes the demo key before opening the product page.
- Offline: the service worker precaches `/demo/`; the sample contains no remote dependencies.
