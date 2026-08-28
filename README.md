# Workspace Profiles

Workspace Profiles is a Chromium extension for people with low vision. It saves a reading profile for each site. Text can grow without enlarging every control or table.

A profile controls text size, line spacing, color, the cursor ring, and hold-to-enlarge focus. Password and common payment fields keep their original styling.

## Try the demo

Open [the sample-data demo](https://low-vision-workspace-profiles.sociobot.in/demo/). It starts with a `Quarterly reports` profile assigned to `reports.example`.

Change or pause the sample profile. Export the sample profile as a backup file. **Reset demo** removes the `demo:workspace-profiles:reports-example` key. The demo uses this separate browser-storage key. See [`.factory/demo.md`](.factory/demo.md).

## Install and run locally

Requirements: Node.js 20+ and npm.

```sh
npm ci
npm run dev
npm run dev:site
npm test
npm run test:claims
npm run test:site
npm run test:browser
npm run typecheck
npm run build
```

`npm run build` creates the unpacked extension, extension ZIP, and static site in `dist/`.

To test the extension, open `chrome://extensions` and enable Developer mode. Choose **Load unpacked** and select `dist/extension/chrome-mv3`. Open an HTTP or HTTPS page, select the toolbar icon, and create a profile.

## Verification

The claim registry is [`.factory/claims.json`](.factory/claims.json). Each entry names its automated test. Packaged-extension tests cover every reading control and sensitive-field exclusion.

Before release, serve `dist/site`. Run the accessibility checks. Test keyboard navigation at 200% browser zoom.

## Privacy

Profiles and site assignments use Chromium extension storage. The extension includes no analytics or third-party runtime scripts. Read the [privacy notice](site/privacy/index.html). These claims are tested as `extension-storage` and `extension-no-analytics` in the claim registry.

## Deployment

Deploy `dist/site` as a static site. The repository does not manage DNS, billing, or infrastructure.

## License

MIT. Atkinson Hyperlegible uses the SIL Open Font License 1.1; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
