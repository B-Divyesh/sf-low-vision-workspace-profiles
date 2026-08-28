export type ContrastMode = 'site' | 'soft' | 'high' | 'night';

export interface WorkspaceProfile {
  id: string;
  name: string;
  textScale: number;
  lineSpacing: number;
  contrast: ContrastMode;
  cursorHalo: boolean;
  focusMagnification: number;
  createdAt: number;
  updatedAt: number;
}

export interface WorkspaceData {
  version: 1;
  profiles: WorkspaceProfile[];
  assignments: Record<string, string>;
}

export const STORAGE_KEY = 'workspaceProfilesData';

export const EMPTY_DATA: WorkspaceData = {
  version: 1,
  profiles: [],
  assignments: {}
};

const contrasts: ContrastMode[] = ['site', 'soft', 'high', 'night'];

export function clamp(value: unknown, min: number, max: number, fallback: number): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.min(max, Math.max(min, numeric)) : fallback;
}

export function createProfile(name = 'My work profile', now = Date.now()): WorkspaceProfile {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `profile-${now}-${Math.random().toString(36).slice(2)}`,
    name,
    textScale: 125,
    lineSpacing: 1.55,
    contrast: 'site',
    cursorHalo: true,
    focusMagnification: 140,
    createdAt: now,
    updatedAt: now
  };
}

export function normalizeProfile(value: unknown, now = Date.now()): WorkspaceProfile | null {
  if (!value || typeof value !== 'object') return null;
  const input = value as Partial<WorkspaceProfile>;
  const name = typeof input.name === 'string' ? input.name.trim().slice(0, 48) : '';
  if (!name) return null;
  const createdAt = clamp(input.createdAt, 0, now, now);
  return {
    id: typeof input.id === 'string' && input.id ? input.id.slice(0, 80) : createProfile(name, now).id,
    name,
    textScale: Math.round(clamp(input.textScale, 100, 180, 125)),
    lineSpacing: Math.round(clamp(input.lineSpacing, 1.2, 2, 1.55) * 20) / 20,
    contrast: contrasts.includes(input.contrast as ContrastMode) ? input.contrast as ContrastMode : 'site',
    cursorHalo: input.cursorHalo !== false,
    focusMagnification: Math.round(clamp(input.focusMagnification, 110, 180, 140)),
    createdAt,
    updatedAt: clamp(input.updatedAt, createdAt, now, now)
  };
}

export function parseWorkspaceData(value: unknown): WorkspaceData {
  if (!value || typeof value !== 'object') return structuredClone(EMPTY_DATA);
  const input = value as Partial<WorkspaceData>;
  const profiles = Array.isArray(input.profiles)
    ? input.profiles.map((item) => normalizeProfile(item)).filter((item): item is WorkspaceProfile => Boolean(item)).slice(0, 100)
    : [];
  const validIds = new Set(profiles.map((profile) => profile.id));
  const assignments: Record<string, string> = {};
  if (input.assignments && typeof input.assignments === 'object') {
    for (const [host, profileId] of Object.entries(input.assignments)) {
      if (/^[a-z0-9.-]+$/i.test(host) && typeof profileId === 'string' && validIds.has(profileId)) {
        assignments[host.toLowerCase()] = profileId;
      }
    }
  }
  return { version: 1, profiles, assignments };
}

export function assignedProfile(data: WorkspaceData, hostname: string): WorkspaceProfile | null {
  const id = data.assignments[hostname.toLowerCase()];
  return data.profiles.find((profile) => profile.id === id) ?? null;
}

export function siteLabel(hostname: string): string {
  return hostname.replace(/^www\./, '') || 'this site';
}
