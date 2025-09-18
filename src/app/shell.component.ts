
import { Component, inject, effect } from '@angular/core';
import { AudioService } from './audio.service';
import { RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { SettingsService, Difficulty } from './settings.service';

@Component({
  standalone: true,
  selector: 'app-shell',
  imports: [RouterModule, NgIf],
  template: `
    <header id="app-header" tabindex="-1">
      <nav>
        <a routerLink="/" aria-label="Home">Home</a>
        <a routerLink="/rules" aria-label="Rules">Rules</a>
        <a routerLink="/practice" aria-label="Practice">Practice</a>
        <a routerLink="/quiz" aria-label="Quiz">Quiz</a>
      </nav>
      <div class="header-controls">
        <button type="button"
          [attr.aria-pressed]="settings.hc()"
          aria-label="Toggle High Contrast"
          (click)="toggleHC()">
          HC: <span *ngIf="settings.hc(); else hcOff">On</span><ng-template #hcOff>Off</ng-template>
        </button>
        <button type="button"
          [attr.aria-pressed]="settings.mute()"
          aria-label="Toggle Mute"
          (click)="toggleMute()">
          Mute: <span *ngIf="settings.mute(); else muteOff">On</span><ng-template #muteOff>Off</ng-template>
        </button>
        <label>
          <span class="sr-only">Difficulty</span>
          <select [value]="settings.difficulty()" (change)="setDifficulty(($any($event.target).value))" aria-label="Difficulty">
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
          </select>
        </label>
      </div>
    </header>
    <main><router-outlet></router-outlet></main>
    <footer><small>&copy; LearnPickle</small></footer>
  `,
  styles: [`
    .header-controls {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      margin-top: 0.5rem;
      flex-wrap: wrap;
    }
    .header-controls button, .header-controls select {
      font-size: 1rem;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      border: 2px solid #222;
      background: #fff;
      color: #222;
      cursor: pointer;
    }
    .header-controls button[aria-pressed="true"] {
      background: #e60012;
      color: #fff;
      border-color: #e60012;
    }
    .header-controls select {
      min-width: 8rem;
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  `]
})
export class ShellComponent {
  settings = inject(SettingsService);
  audio = inject(AudioService);
  constructor() {
    // Effect for HC mode body class
    effect(() => {
      if (this.settings.hc()) {
        document.body.classList.add('hc');
      } else {
        document.body.classList.remove('hc');
      }
    });
  }
  toggleHC() {
    this.audio.play('click');
    this.settings.setHC(!this.settings.hc());
  }
  toggleMute() {
    const wasMuted = this.settings.mute();
    this.settings.setMute(!wasMuted);
    // Only play click if unmuting (mute is now false)
    if (wasMuted) {
      setTimeout(() => this.audio.play('click'), 0);
    }
  }
  setDifficulty(val: string) {
    this.audio.play('click');
    this.settings.setDifficulty(val as Difficulty);
  }
}