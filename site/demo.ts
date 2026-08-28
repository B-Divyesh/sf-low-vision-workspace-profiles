import './style.css';
import './route-focus';

type DemoState = { textScale: number; lineHeight: number; color: string; active: boolean };
const key = 'demo:workspace-profiles:reports-example';
const seed: DemoState = { textScale: 140, lineHeight: 1.65, color: 'warm', active: true };
const textScale = document.querySelector<HTMLInputElement>('#text-scale')!;
const lineHeight = document.querySelector<HTMLInputElement>('#line-height')!;
const color = document.querySelector<HTMLSelectElement>('#color-option')!;
const active = document.querySelector<HTMLInputElement>('#profile-active')!;
const sample = document.querySelector<HTMLElement>('#sample-document')!;
const status = document.querySelector<HTMLElement>('#demo-status')!;
const sampleActions = document.querySelector<HTMLElement>('#sample-actions')!;
const moreActions = document.querySelector<HTMLButtonElement>('#more-actions')!;
const sampleActionStatus = document.querySelector<HTMLElement>('#sample-action-status')!;
const copyStatus = document.querySelector<HTMLElement>('#copy-status')!;
const sampleNote = document.querySelector<HTMLInputElement>('#sample-note')!;
function read(): DemoState { try { return { ...seed, ...JSON.parse(localStorage.getItem(key) ?? '{}') } as DemoState; } catch { return { ...seed }; } }
function render(state: DemoState, announce = false, persist = true) {
  textScale.value = String(state.textScale); lineHeight.value = String(state.lineHeight); color.value = state.color; active.checked = state.active;
  document.querySelector('#text-value')!.textContent = `${state.textScale}%`; document.querySelector('#line-value')!.textContent = `${state.lineHeight.toFixed(2)}×`;
  sample.dataset.color = state.active ? state.color : 'site'; sample.style.setProperty('--demo-scale', state.active ? String(state.textScale / 100) : '1'); sample.style.setProperty('--demo-leading', state.active ? String(state.lineHeight) : '1.35'); sample.classList.toggle('profile-paused', !state.active);
  document.querySelector('#active-label')!.textContent = state.active ? 'Profile active' : 'Original view'; if (persist) localStorage.setItem(key, JSON.stringify(state));
  if (announce) status.textContent = state.active ? 'Sample profile updated.' : 'Sample profile paused. The original view is shown.';
}
function current(): DemoState { return { textScale: +textScale.value, lineHeight: +lineHeight.value, color: color.value, active: active.checked }; }
[textScale, lineHeight, color, active].forEach((control) => control.addEventListener('input', () => render(current(), true)));
document.querySelector('#reset-demo')?.addEventListener('click', () => {
  localStorage.removeItem(key);
  render({ ...seed }, false, false);
  sampleActions.hidden = true;
  moreActions.setAttribute('aria-expanded', 'false');
  sampleActionStatus.textContent = '';
  copyStatus.textContent = '';
  sampleNote.value = 'Review June follow-up';
  status.textContent = 'Demo reset to the sample profile.';
});
document.querySelector('#start-real')?.addEventListener('click', () => localStorage.removeItem(key));
document.querySelector('#export-demo')?.addEventListener('click', () => { const blob = new Blob([JSON.stringify({ profile: 'Quarterly reports', site: 'reports.example', ...current() }, null, 2)], { type: 'application/json' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'workspace-profile-demo.json'; link.click(); URL.revokeObjectURL(link.href); status.textContent = 'Sample profile exported as a backup file.'; });
document.querySelector<HTMLButtonElement>('#share-report')?.addEventListener('click', () => {
  sampleActionStatus.textContent = 'Sample report shared with your workspace.';
});
moreActions.addEventListener('click', () => {
  sampleActions.hidden = !sampleActions.hidden;
  moreActions.setAttribute('aria-expanded', String(!sampleActions.hidden));
});
document.querySelector<HTMLButtonElement>('#copy-summary')?.addEventListener('click', () => {
  copyStatus.textContent = 'Sample summary copied.';
});
render(read(), false, localStorage.getItem(key) !== null);
if ('serviceWorker' in navigator && location.protocol === 'https:') window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));
