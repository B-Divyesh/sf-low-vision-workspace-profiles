import { describe, expect, it, vi } from 'vitest';
import { assignedProfile, createProfile, normalizeProfile, parseWorkspaceData, siteLabel } from '../shared/profiles';

describe('workspace profile data', () => {
  it('creates useful and bounded defaults', () => {
    vi.stubGlobal('crypto', { randomUUID: () => 'profile-1' });
    expect(createProfile('Reading')).toMatchObject({
      id: 'profile-1', name: 'Reading', textScale: 125, lineSpacing: 1.55,
      contrast: 'site', cursorHalo: true, focusMagnification: 140
    });
    vi.unstubAllGlobals();
  });

  it('normalizes untrusted imported values', () => {
    const profile = normalizeProfile({ id: 'safe', name: '  My route  ', textScale: 999, lineSpacing: 0, contrast: 'unknown', cursorHalo: false, focusMagnification: 1 });
    expect(profile).toMatchObject({ name: 'My route', textScale: 180, lineSpacing: 1.2, contrast: 'site', cursorHalo: false, focusMagnification: 110 });
  });

  it('drops broken profiles and assignments to missing profiles', () => {
    const data = parseWorkspaceData({
      profiles: [{ id: 'good', name: 'Good', textScale: 120 }, { id: 'bad', name: '' }],
      assignments: { 'docs.example': 'good', 'evil host': 'good', 'mail.example': 'missing' }
    });
    expect(data.profiles).toHaveLength(1);
    expect(data.assignments).toEqual({ 'docs.example': 'good' });
    expect(assignedProfile(data, 'DOCS.EXAMPLE')?.name).toBe('Good');
  });

  it('returns independent empty data objects', () => {
    const one = parseWorkspaceData(null);
    one.assignments['example.com'] = 'x';
    expect(parseWorkspaceData(null).assignments).toEqual({});
  });

  it('formats a human site label', () => {
    expect(siteLabel('www.docs.example')).toBe('docs.example');
  });
});
