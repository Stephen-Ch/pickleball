import { SettingsService, Difficulty } from './settings.service';

describe('SettingsService', () => {
  let service: SettingsService;
  let store: Record<string, string | null>;

  beforeEach(() => {
    store = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string) => store[key] ?? null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => { store[key] = value; });
    service = new SettingsService();
  });

  it('should default HC and Mute to false', () => {
    expect(service.hc()).toBe(false);
    expect(service.mute()).toBe(false);
  });

  it('should default difficulty to Beginner', () => {
    expect(service.difficulty()).toBe('Beginner');
  });

  it('should persist and rehydrate HC toggle', () => {
    service.setHC(true);
    expect(store['lp/hc']).toBe('true');
    // simulate reload
    store['lp/hc'] = 'true';
    const s2 = new SettingsService();
    expect(s2.hc()).toBe(true);
  });

  it('should persist and rehydrate Mute toggle', () => {
    service.setMute(true);
    expect(store['lp/mute']).toBe('true');
    store['lp/mute'] = 'true';
    const s2 = new SettingsService();
    expect(s2.mute()).toBe(true);
  });

  it('should persist and rehydrate Difficulty', () => {
    service.setDifficulty('Intermediate');
    expect(store['lp/difficulty']).toBe('Intermediate');
    store['lp/difficulty'] = 'Intermediate';
    const s2 = new SettingsService();
    expect(s2.difficulty()).toBe('Intermediate');
  });
});
