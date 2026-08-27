import './style.css';
import { createProfile, parseWorkspaceData, siteLabel, STORAGE_KEY, type WorkspaceData, type WorkspaceProfile } from '../../shared/profiles';

const $ = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector)!;
const loading = $('#loading-state');
const unsupported = $('#unsupported-state');
const empty = $('#empty-state');
const editor = $('#editor');
const form = $<HTMLFormElement>('#profile-form');
const profileSelect = $<HTMLSelectElement>('#profile-select');
const nameInput = $<HTMLInputElement>('#profile-name');
const siteEnabled = $<HTMLInputElement>('#site-enabled');
const status = $('#status');
const error = $('#form-error');
const undoButton = $<HTMLButtonElement>('#undo-delete');
let data: WorkspaceData = parseWorkspaceData(null);
let hostname = '';
let currentId = '';
let draft: WorkspaceProfile | null = null;
let deletedSnapshot: WorkspaceData | null = null;
let undoTimer = 0;

void initialize();

async function initialize() {
  try {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    const url = tab?.url ? new URL(tab.url) : null;
    if (!url || !/^https?:$/.test(url.protocol)) {
      showOnly(unsupported);
      $('#site-state').setAttribute('aria-label', 'Profiles unavailable on this page');
      return;
    }
    hostname = url.hostname.toLowerCase();
    document.querySelectorAll<HTMLElement>('[data-site-label]').forEach((node) => { node.textContent = siteLabel(hostname); });
    const result = await browser.storage.local.get(STORAGE_KEY);
    data = parseWorkspaceData(result[STORAGE_KEY]);
    if (!data.profiles.length) showOnly(empty);
    else {
      const assigned = data.assignments[hostname];
      openEditor(assigned && data.profiles.some((profile) => profile.id === assigned) ? assigned : data.profiles[0]!.id);
    }
    updateSiteState();
  } catch (cause) {
    showOnly(unsupported);
    unsupported.querySelector('h2')!.textContent = 'Profiles could not be opened';
    unsupported.querySelector('p')!.textContent = 'Reload this extension and try again. Your saved profiles are still on this device.';
    announce(cause instanceof Error ? cause.message : 'Storage is unavailable.', true);
  }
}

function showOnly(target: HTMLElement) {
  [loading, unsupported, empty, editor].forEach((section) => { section.hidden = section !== target; });
}

function openEditor(id: string, freshDraft?: WorkspaceProfile) {
  draft = freshDraft ?? null;
  currentId = id;
  renderPicker();
  const profile = draft ?? data.profiles.find((item) => item.id === id);
  if (!profile) return;
  fillForm(profile);
  siteEnabled.checked = data.assignments[hostname] === profile.id;
  $('#delete-profile').toggleAttribute('hidden', Boolean(draft));
  showOnly(editor);
  updateSiteState();
}

function renderPicker() {
  profileSelect.replaceChildren(...data.profiles.map((profile) => new Option(profile.name, profile.id)));
  if (draft) profileSelect.append(new Option('New unsaved profile', draft.id));
  profileSelect.value = currentId;
}

function fillForm(profile: WorkspaceProfile) {
  nameInput.value = profile.name;
  setValue('text-scale', profile.textScale);
  setValue('line-spacing', profile.lineSpacing);
  $<HTMLSelectElement>('#contrast').value = profile.contrast;
  $<HTMLInputElement>('#cursor-halo').checked = profile.cursorHalo;
  setValue('focus-scale', profile.focusMagnification);
  updateOutputs();
}

function setValue(id: string, value: number) { $<HTMLInputElement>(`#${id}`).value = String(value); }

function readForm(existing?: WorkspaceProfile): WorkspaceProfile {
  const now = Date.now();
  const base = existing ?? draft ?? createProfile(nameInput.value, now);
  return {
    ...base,
    name: nameInput.value.trim(),
    textScale: Number($<HTMLInputElement>('#text-scale').value),
    lineSpacing: Number($<HTMLInputElement>('#line-spacing').value),
    contrast: $<HTMLSelectElement>('#contrast').value as WorkspaceProfile['contrast'],
    cursorHalo: $<HTMLInputElement>('#cursor-halo').checked,
    focusMagnification: Number($<HTMLInputElement>('#focus-scale').value),
    updatedAt: now
  };
}

async function saveData(message: string) {
  await browser.storage.local.set({ [STORAGE_KEY]: data });
  announce(message);
  updateSiteState();
}

function announce(message: string, isError = false) {
  status.textContent = message;
  status.classList.toggle('error-text', isError);
}

function updateOutputs() {
  $('#text-scale-value').textContent = `${$<HTMLInputElement>('#text-scale').value}%`;
  $('#line-spacing-value').textContent = `${Number($<HTMLInputElement>('#line-spacing').value).toFixed(2)}×`;
  $('#focus-scale-value').textContent = `${$<HTMLInputElement>('#focus-scale').value}%`;
}

function updateSiteState() {
  const dot = $('#site-state');
  const enabled = Boolean(hostname && data.assignments[hostname]);
  dot.dataset.active = String(enabled);
  dot.setAttribute('aria-label', enabled ? `A profile is active on ${siteLabel(hostname)}` : `No profile is active on ${siteLabel(hostname)}`);
}

$('#create-first').addEventListener('click', () => {
  const profile = createProfile(`${siteLabel(hostname)} route`);
  openEditor(profile.id, profile);
  nameInput.focus();
});

$('#new-profile').addEventListener('click', () => {
  const profile = createProfile('New work route');
  openEditor(profile.id, profile);
  nameInput.select();
});

profileSelect.addEventListener('change', () => openEditor(profileSelect.value));
for (const id of ['text-scale', 'line-spacing', 'focus-scale']) $<HTMLInputElement>(`#${id}`).addEventListener('input', updateOutputs);

siteEnabled.addEventListener('change', async () => {
  if (siteEnabled.checked) data.assignments[hostname] = currentId;
  else delete data.assignments[hostname];
  await saveData(siteEnabled.checked ? `Profile active on ${siteLabel(hostname)}.` : `Profile paused on ${siteLabel(hostname)}.`);
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  error.hidden = true;
  if (!nameInput.value.trim()) {
    error.textContent = 'Give this profile a name, then save again.';
    error.hidden = false;
    nameInput.focus();
    return;
  }
  try {
    const index = data.profiles.findIndex((profile) => profile.id === currentId);
    const profile = readForm(index >= 0 ? data.profiles[index] : undefined);
    if (index >= 0) data.profiles[index] = profile;
    else data.profiles.push(profile);
    draft = null;
    currentId = profile.id;
    if (siteEnabled.checked) data.assignments[hostname] = profile.id;
    await saveData(`Saved “${profile.name}”${siteEnabled.checked ? ' and applied it here' : ''}.`);
    openEditor(profile.id);
  } catch {
    error.textContent = 'The profile could not be saved. Check browser storage and try again.';
    error.hidden = false;
  }
});

$('#delete-profile').addEventListener('click', async () => {
  const profile = data.profiles.find((item) => item.id === currentId);
  if (!profile || !confirm(`Delete “${profile.name}”? You can undo for 10 seconds.`)) return;
  deletedSnapshot = structuredClone(data);
  data.profiles = data.profiles.filter((item) => item.id !== currentId);
  for (const [site, id] of Object.entries(data.assignments)) if (id === currentId) delete data.assignments[site];
  await saveData(`Deleted “${profile.name}”.`);
  undoButton.hidden = false;
  window.clearTimeout(undoTimer);
  undoTimer = window.setTimeout(() => { deletedSnapshot = null; undoButton.hidden = true; }, 10000);
  if (data.profiles.length) openEditor(data.profiles[0]!.id);
  else showOnly(empty);
});

undoButton.addEventListener('click', async () => {
  if (!deletedSnapshot) return;
  data = deletedSnapshot;
  deletedSnapshot = null;
  undoButton.hidden = true;
  window.clearTimeout(undoTimer);
  await saveData('Profile restored.');
  const assigned = data.assignments[hostname];
  openEditor(assigned ?? data.profiles[0]!.id);
});

$('#export-profiles').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `workspace-profiles-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  announce('Backup exported.');
});

$<HTMLInputElement>('#import-profiles').addEventListener('change', async (event) => {
  const input = event.currentTarget as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  try {
    const imported = parseWorkspaceData(JSON.parse(await file.text()));
    if (!imported.profiles.length) throw new Error('No valid profiles');
    data = imported;
    await saveData(`Imported ${data.profiles.length} profile${data.profiles.length === 1 ? '' : 's'}.`);
    openEditor(data.assignments[hostname] ?? data.profiles[0]!.id);
  } catch {
    announce('That file did not contain a valid Workspace Profiles backup.', true);
  } finally {
    input.value = '';
  }
});
