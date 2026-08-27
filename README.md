# Workspace Profiles

Workspace Profiles is a local-first Chromium extension for knowledge workers with low vision. It saves a named reading profile per domain so text can grow without applying the same zoom to navigation, controls, and dense tables.

Each profile independently controls text scale, line spacing, contrast treatment, a cursor/focus halo, and temporary focused-region magnification (`Alt` + `Shift` + `M`). Password and common payment fields are excluded from magnification. Profiles, assignments, and backups stay on the device.

The repository also contains the static product site at [low-vision-workspace-profiles.sociobot.in](https://low-vision-workspace-profiles.sociobot.in). All core accessibility features are free. The optional one-time Supporter Pass unlocks cosmetic extras only.

## Run locally

Requirements: Node.js 20+ and npm.

```sh
npm install
npm run dev          # WXT extension development
npm run dev:site     # landing site at localhost:5173
npm test
npm run typecheck
npm run build
```

`npm run build` is the reproducible factory build command. It creates:

- `dist/extension/chrome-mv3/` — unpacked MV3 extension
- `dist/site/index.html` — static deployment root
- `dist/site/downloads/workspace-profiles-chrome.zip` — installable package linked from the site

To test the extension, open `chrome://extensions`, enable Developer mode, choose **Load unpacked**, and select `dist/extension/chrome-mv3`. Open a normal `http` or `https` page, select the toolbar icon, and create a profile.

## Test and release checks

Unit tests validate untrusted import normalization, bounded settings, domain assignments, and defaults. Before release, serve `dist/site`, run the accessibility smoke tests described in `.factory/handoff.md`, and test the unpacked extension with keyboard-only navigation at 200% browser zoom.

## Privacy and security

There are no analytics, remote profile services, third-party runtime scripts, or CDN fonts. The extension requests site access solely to apply assigned profiles. See [`site/privacy/index.html`](site/privacy/index.html) and the public `/privacy/` page for details.

## License

MIT. The bundled Atkinson Hyperlegible font is covered by the SIL Open Font License 1.1; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
