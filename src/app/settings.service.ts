import { Injectable, signal } from '@angular/core';

export type Difficulty = 'Beginner' | 'Intermediate';

const HC_KEY = 'lp/hc';
const MUTE_KEY = 'lp/mute';
const DIFFICULTY_KEY = 'lp/difficulty';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  readonly hc = signal(this.getBool(HC_KEY, false));
  readonly mute = signal(this.getBool(MUTE_KEY, false));
  readonly difficulty = signal(this.getDifficulty());

  setHC(val: boolean) {
    this.hc.set(val);
    localStorage.setItem(HC_KEY, JSON.stringify(val));
  }
  setMute(val: boolean) {
    this.mute.set(val);
    localStorage.setItem(MUTE_KEY, JSON.stringify(val));
  }
  setDifficulty(val: Difficulty) {
    this.difficulty.set(val);
    localStorage.setItem(DIFFICULTY_KEY, val);
  }

  private getBool(key: string, fallback: boolean): boolean {
    const v = localStorage.getItem(key);
    return v === null ? fallback : JSON.parse(v);
  }
  private getDifficulty(): Difficulty {
    const v = localStorage.getItem(DIFFICULTY_KEY);
    return v === 'Intermediate' ? 'Intermediate' : 'Beginner';
  }
}
