import { assignedProfile, parseWorkspaceData, STORAGE_KEY, type WorkspaceProfile } from '../shared/profiles';
import '../styles/content.css';

const root = document.documentElement;
let activeProfile: WorkspaceProfile | null = null;
let halo: HTMLDivElement | null = null;
let magnified: HTMLElement | null = null;
let magnifyTimer = 0;
let previousStyle: Record<string, string> | null = null;
const sensitiveFieldSelector = 'input, textarea, [contenteditable="true"]';
const sensitiveFieldMarker = 'data-workspace-profiles-sensitive';

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'manifest',
  async main() {
    observeSensitiveFields();
    markSensitiveFields();
    await refreshProfile();
    browser.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes[STORAGE_KEY]) void refreshProfile();
    });
    browser.runtime.onMessage.addListener((message) => {
      if (message?.type === 'WP_MAGNIFY_FOCUS') magnifyFocused(Number(message.duration) || 12000);
    });
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('keyup', onKeyUp, true);
    document.addEventListener('pointermove', moveHalo, { passive: true });
    document.addEventListener('focusin', moveHaloToFocus, true);
  }
});

async function refreshProfile() {
  const result = await browser.storage.local.get(STORAGE_KEY);
  const data = parseWorkspaceData(result[STORAGE_KEY]);
  activeProfile = assignedProfile(data, location.hostname);
  applyProfile(activeProfile);
}

function applyProfile(profile: WorkspaceProfile | null) {
  if (!profile) {
    root.removeAttribute('data-wp-active');
    root.removeAttribute('data-wp-contrast');
    root.style.removeProperty('--wp-text-scale');
    root.style.removeProperty('--wp-ui-scale');
    root.style.removeProperty('--wp-line-height');
    removeHalo();
    deactivateMagnifier();
    return;
  }
  root.dataset.wpActive = 'true';
  root.dataset.wpContrast = profile.contrast;
  root.style.setProperty('--wp-text-scale', `${profile.textScale}%`);
  root.style.setProperty('--wp-ui-scale', `${Math.round(100 + (profile.textScale - 100) / 2.5)}%`);
  root.style.setProperty('--wp-line-height', String(profile.lineSpacing));
  profile.cursorHalo ? ensureHalo() : removeHalo();
}

function ensureHalo() {
  if (halo) return;
  halo = document.createElement('div');
  halo.id = 'workspace-profiles-cursor-halo';
  halo.setAttribute('aria-hidden', 'true');
  document.documentElement.append(halo);
}

function removeHalo() {
  halo?.remove();
  halo = null;
}

function moveHalo(event: PointerEvent) {
  if (!halo) return;
  halo.style.setProperty('--wp-halo-x', `${event.clientX}px`);
  halo.style.setProperty('--wp-halo-y', `${event.clientY}px`);
  halo.dataset.visible = 'true';
}

function moveHaloToFocus(event: FocusEvent) {
  if (!halo || !(event.target instanceof HTMLElement)) return;
  const rect = event.target.getBoundingClientRect();
  halo.style.setProperty('--wp-halo-x', `${rect.left + Math.min(rect.width / 2, 24)}px`);
  halo.style.setProperty('--wp-halo-y', `${rect.top + rect.height / 2}px`);
  halo.dataset.visible = 'true';
}

function onKeyDown(event: KeyboardEvent) {
  if (!activeProfile || !event.altKey || !event.shiftKey || event.code !== 'KeyM' || event.repeat) return;
  event.preventDefault();
  magnifyFocused(0);
}

function onKeyUp(event: KeyboardEvent) {
  if (event.code === 'KeyM') deactivateMagnifier();
}

function sensitiveFieldFor(element: HTMLElement): HTMLElement | null {
  return element.closest<HTMLElement>(sensitiveFieldSelector);
}

function isSensitive(element: HTMLElement): boolean {
  const field = sensitiveFieldFor(element);
  if (!field) return false;
  const autocomplete = field.getAttribute('autocomplete')?.toLowerCase() ?? '';
  return field.matches('input[type="password"]') || /cc-|card|payment|cvc|cvv/.test(`${autocomplete} ${field.id} ${field.getAttribute('name') ?? ''}`.toLowerCase());
}

/**
 * The stylesheet cannot run our field policy itself. Marking fields lets its
 * selector share this exact policy with the temporary magnifier instead of
 * maintaining a second, inevitably incomplete, list of payment names.
 */
function markSensitiveField(field: HTMLElement) {
  field.toggleAttribute(sensitiveFieldMarker, isSensitive(field));
}

function markSensitiveFields(scope: ParentNode = document) {
  scope.querySelectorAll<HTMLElement>(sensitiveFieldSelector).forEach(markSensitiveField);
}

function observeSensitiveFields() {
  const observer = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === 'attributes' && record.target instanceof HTMLElement) {
        markSensitiveField(record.target);
      }
      if (record.type === 'childList') {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches(sensitiveFieldSelector)) markSensitiveField(node);
          markSensitiveFields(node);
        });
      }
    }
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['autocomplete', 'contenteditable', 'id', 'name', 'type']
  });
}

function findRegion(): HTMLElement | null {
  const focused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  if (!focused || focused === document.body || focused === root || isSensitive(focused)) return null;
  const region = focused.closest<HTMLElement>('p, li, td, th, article, section, [role="region"], [role="dialog"]') ?? focused;
  const rect = region.getBoundingClientRect();
  return rect.width > innerWidth * 0.9 || rect.height > innerHeight * 0.75 ? focused : region;
}

function magnifyFocused(duration: number) {
  if (!activeProfile) return;
  const region = findRegion();
  if (!region) return;
  deactivateMagnifier();
  magnified = region;
  previousStyle = {
    transform: region.style.getPropertyValue('transform'),
    transformOrigin: region.style.getPropertyValue('transform-origin'),
    position: region.style.getPropertyValue('position'),
    zIndex: region.style.getPropertyValue('z-index'),
    isolation: region.style.getPropertyValue('isolation')
  };
  const rect = region.getBoundingClientRect();
  const x = rect.left + rect.width / 2 < innerWidth / 2 ? 'left center' : 'right center';
  region.classList.add('workspace-profiles-magnified');
  region.style.setProperty('--wp-focus-scale', String(activeProfile.focusMagnification / 100));
  region.style.setProperty('transform-origin', x, 'important');
  region.style.setProperty('position', getComputedStyle(region).position === 'static' ? 'relative' : getComputedStyle(region).position, 'important');
  region.style.setProperty('z-index', '2147483646', 'important');
  region.style.setProperty('isolation', 'isolate', 'important');
  if (duration > 0) magnifyTimer = window.setTimeout(deactivateMagnifier, duration);
}

function deactivateMagnifier() {
  if (magnifyTimer) window.clearTimeout(magnifyTimer);
  magnifyTimer = 0;
  if (magnified && previousStyle) {
    magnified.classList.remove('workspace-profiles-magnified');
    magnified.style.removeProperty('--wp-focus-scale');
    for (const [property, value] of Object.entries(previousStyle)) {
      const cssName = property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
      value ? magnified.style.setProperty(cssName, value) : magnified.style.removeProperty(cssName);
    }
  }
  magnified = null;
  previousStyle = null;
}
