import { Injectable, inject, effect } from '@angular/core';
import { SettingsService } from './settings.service';

@Injectable({ providedIn: 'root' })
export class AudioService {
  private audioCtx: AudioContext | null = null;
  private muted = false;
  private destroyEffect: (() => void) | null = null;

  constructor() {
    const settings = inject(SettingsService);
    // Subscribe to mute signal (signal is a function)
    this.muted = settings.mute();
    const ref = effect(() => {
      this.muted = settings.mute();
    });
    this.destroyEffect = () => ref.destroy();
  }

  play(type: 'bounce' | 'click') {
    if (this.muted) return;
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = this.audioCtx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    g.gain.value = 0.08; // quiet
    o.connect(g).connect(ctx.destination);
    if (type === 'click') {
      o.type = 'square';
      o.frequency.value = 220;
      o.start();
      o.stop(ctx.currentTime + 0.04);
    } else if (type === 'bounce') {
      o.type = 'sine';
      o.frequency.setValueAtTime(440, ctx.currentTime);
      o.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.12);
      o.start();
      o.stop(ctx.currentTime + 0.13);
    }
    o.onended = () => {
      o.disconnect();
      g.disconnect();
    };
  }

  ngOnDestroy() {
    if (this.destroyEffect) this.destroyEffect();
    if (this.audioCtx) {
      this.audioCtx.close();
    }
  }
}
