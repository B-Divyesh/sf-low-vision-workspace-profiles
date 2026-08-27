import './style.css';

const slug = 'low-vision-workspace-profiles';
const licenseKey = `sb_license:${slug}`;
const verdictKey = `sb_license_verdict:${slug}`;
const verifyUrl = `https://api.sociobot.in/api/v1/products/${slug}/verify`;
const status = document.querySelector<HTMLElement>('#license-status');
const extra = document.querySelector<HTMLElement>('#supporter-extra');
const restoreButton = document.querySelector<HTMLButtonElement>('#restore-button');
const form = document.querySelector<HTMLFormElement>('#license-form');
const tokenInput = document.querySelector<HTMLInputElement>('#license-token');

interface Verdict { valid: boolean; reason: string; checkedAt: number }

function setUnlocked(unlocked: boolean, message: string) {
  if (extra) extra.hidden = !unlocked;
  if (status) status.textContent = message;
  document.documentElement.dataset.supporter = String(unlocked);
}

function cachedVerdict(): Verdict | null {
  try { return JSON.parse(localStorage.getItem(verdictKey) ?? 'null') as Verdict | null; }
  catch { return null; }
}

async function verify(token: string, force = false) {
  const cached = cachedVerdict();
  const fresh = cached && Date.now() - cached.checkedAt < 86_400_000;
  if (!force && fresh) {
    setUnlocked(cached.valid, cached.valid ? 'Supporter Pass active on this browser.' : 'License no longer active. You can restore another token.');
    return;
  }
  if (!navigator.onLine) {
    setUnlocked(Boolean(cached?.valid), cached?.valid ? 'Supporter Pass active. Verification will refresh when online.' : 'Offline. Connect to verify this license.');
    return;
  }
  if (status) status.textContent = 'Checking your license…';
  try {
    const response = await fetch(`${verifyUrl}?license=${encodeURIComponent(token)}`, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Verification unavailable');
    const result = await response.json() as { valid?: boolean; reason?: string };
    const verdict = { valid: result.valid === true, reason: result.reason ?? 'invalid', checkedAt: Date.now() };
    localStorage.setItem(verdictKey, JSON.stringify(verdict));
    setUnlocked(verdict.valid, verdict.valid ? 'Supporter Pass verified. Thank you for keeping the route open.' : 'License no longer active. Check the token or buy a new pass.');
  } catch {
    setUnlocked(Boolean(cached?.valid), cached?.valid ? 'Supporter Pass active. Verification will retry later.' : 'Could not verify right now. Check your connection and try again.');
  }
}

const params = new URLSearchParams(location.search);
const returnedLicense = params.get('license');
if (returnedLicense) {
  localStorage.setItem(licenseKey, returnedLicense);
  params.delete('license');
  const query = params.toString();
  history.replaceState({}, '', `${location.pathname}${query ? `?${query}` : ''}${location.hash}`);
  void verify(returnedLicense, true);
} else {
  const stored = localStorage.getItem(licenseKey);
  const cached = cachedVerdict();
  if (stored && cached?.valid) setUnlocked(true, 'Supporter Pass active on this browser.');
  if (stored) void verify(stored);
}

restoreButton?.addEventListener('click', () => {
  if (!form) return;
  form.hidden = !form.hidden;
  restoreButton.setAttribute('aria-expanded', String(!form.hidden));
  if (!form.hidden) tokenInput?.focus();
});

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const token = tokenInput?.value.trim();
  if (!token) return;
  localStorage.setItem(licenseKey, token);
  void verify(token, true);
});

window.addEventListener('online', () => {
  const token = localStorage.getItem(licenseKey);
  if (token) void verify(token);
});

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));
}
