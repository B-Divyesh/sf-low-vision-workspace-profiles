import { defineConfig } from 'wxt';

export default defineConfig({
  outDir: 'dist/extension',
  manifest: {
    name: 'Workspace Profiles',
    description: 'Readable text, spacing, contrast, and focus tools saved for each work site.',
    permissions: ['storage', 'tabs'],
    host_permissions: ['<all_urls>'],
    commands: {
      'magnify-focus': {
        suggested_key: { default: 'Alt+Shift+M', mac: 'Alt+Shift+M' },
        description: 'Temporarily magnify the focused region'
      }
    },
    action: { default_title: 'Open Workspace Profiles' },
    browser_specific_settings: {
      gecko: { id: 'workspace-profiles@sociobot.in', strict_min_version: '109.0' }
    }
  }
});
