# Workspace Profiles — visual thesis

## Direction

**Art-deco transit poster for a calmer route through work.** Workspace Profiles uses a familiar transit line as visual structure for saved profiles and assigned sites. The geometry is optimistic and architectural rather than nostalgic decoration. Strong rails, stepped corners, circular station markers, and compact wayfinding labels make the product feel dependable to someone who needs to find controls quickly. Public instructions always use the literal words **profile** and **site**; the transit idea stays decorative.

The extension UI is deliberately quieter than the landing page. It keeps the same wayfinding language but prioritizes large controls and immediate status. Decoration appears only where it explains a route, profile, or focused region.

## Palette

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| Paper / background | `#F4E8CF` | `#101C25` | Warm poster stock / night platform |
| Surface | `#FFF9ED` | `#172A36` | Controls and reading planes |
| Ink / text | `#182A35` | `#FFF5E2` | Primary text |
| Muted ink | `#53636A` | `#B8C5C8` | Secondary text (≥4.5:1) |
| Signal red / accent | `#A83232` | `#F07167` | Active route and primary action |
| Accent contrast | `#FFFFFF` | `#101C25` | Text on signal color |
| Brass | `#A06A19` | `#F1C66B` | Focus rings, station markers |
| Teal | `#176E71` | `#73D0CC` | Success and route alternative |
| Warning | `#8A5100` | `#FFD27D` | Offline / caution |
| Danger | `#A12828` | `#FF8980` | Errors |

Both treatments paint the page explicitly. The dark treatment is a night-route interpretation, selected by system preference on the site and independently selectable in extension profiles as a contrast treatment.

## Typography

- **Display:** `Arial Narrow`, `Aptos Narrow`, `Roboto Condensed`, sans-serif. All-caps is restricted to short wayfinding labels; headings use strong tracking and stepped sizes.
- **Reading/interface:** `Atkinson Hyperlegible`, `Segoe UI`, system-ui, sans-serif. Atkinson Hyperlegible is bundled in the extension and site as a local WOFF2 subset; system fallbacks keep the product functional before font load.
- Type scale: 16, 18, 23, 31, 45, 64px. Body line-height is 1.55, form controls never below 16px, and numbers use tabular figures.

## Spacing and shape

- Base rhythm: 4px; common intervals: 8, 12, 16, 24, 32, 48, 64px.
- Controls are at least 44px tall, with 12px between adjacent targets.
- Corners are stepped/chamfered where supported (`clip-path`) and lightly rounded otherwise. The product avoids generic floating card grids: rails and proximity form groups first.
- Content measure is 68ch. The popup is 380px wide and becomes a full-width document on narrow screens.

## Interaction grammar

- A filled signal-red control means “apply or continue”; outlined brass controls mean “inspect or adjust.”
- A route line ending in a circular marker communicates saved → assigned → active.
- Sliders expose a live numeric value and have paired minus/plus buttons for precise keyboard and motor control.
- Saving produces an immediate status announcement. Removing a site assignment is reversible for ten seconds.
- The temporary focus lens follows keyboard focus or a pointed region while its command is held; password and payment inputs are excluded.

## Motion policy

State changes use 180–240ms opacity and transform transitions with physical origin (panel from trigger, marker along rail). Nothing loops. Under `prefers-reduced-motion: reduce`, transforms and smooth scrolling are removed and state changes are instant; focus and status remain visible through color, text, and outline.

## Original asset plan and provenance

- Hero illustration: a generated, text-free art-deco station control room whose nested windows represent readable workspaces at different text sizes. It communicates preserved context rather than product screenshots.
- Product diagrams and icons: hand-authored CSS/SVG geometric marks (route lines, cursor halo, profile ticket), created for this repository.

### Image prompt sheet

Subject: an empty art-deco transit control room transformed into a calm knowledge-work desk, three nested browser-like windows at different readable scales, concentric focus lamp, route rails connecting workspaces. World/materials: 1930s screenprint poster, warm paper grain, flat ink, brass, enamel, carved geometric architecture. Light/lens: graphic sunrise beam, orthographic three-quarter view, crisp silhouettes, no photographic depth of field. Palette words: warm cream, midnight navy, signal red, oxidized teal, muted brass. Negative list: people, eyes, medical imagery, disability clichés, legible text, letters, numbers, logos, brands, watermarks, gradients, glossy 3D, UI screenshots.

Generated with the factory Azure image model (`factory-image`) on 2026-08-27. Original output is product-specific and may be used under the repository MIT license. Prompt sidecar is stored beside the source asset; the shipped WebP is optimized and disclosed as AI-generated in the site footer.

The 1200×630 social preview in `site/public/assets/social-card.jpg` is a center crop of that original generated hero. The 180×180 touch icon is derived from the repository's original roundel icon. Both derivatives were made on 2026-08-28 and add no third-party material.
