import { Component, computed, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { ProgressService } from './progress.service';

@Component({
  standalone: true,
  selector: 'app-badges',
  imports: [NgIf],
  template: `
    <section class="badges">
      <h3>Badges</h3>
      <div class="badge-row">
        <span class="badge" [class.earned]="rulesEarned()">📖 Rules Explorer</span>
        <span class="badge" [class.earned]="practiceEarned()">🏓 Practice Complete</span>
        <span class="badge" [class.earned]="quizEarned()">🎯 Quiz Master</span>
      </div>
      <div *ngIf="!allEarned()" class="nudge">You're almost there! Complete all to earn every badge.</div>
    </section>
  `,
  styles: [`
    .badges { margin: 2rem 0; text-align: center; }
    .badge-row { display: flex; justify-content: center; gap: 1.5rem; margin: 1rem 0; }
    .badge { font-size: 1.5rem; padding: 0.5rem 1rem; border-radius: 1.5rem; background: #eee; color: #888; border: 2px solid #ccc; transition: all 0.2s; }
    .badge.earned { background: #ffe066; color: #222; border-color: #e6b800; font-weight: bold; box-shadow: 0 2px 8px #0002; }
    .nudge { margin-top: 1rem; color: #e60012; font-weight: 500; }
  `]
})
export class BadgesComponent {
  progress = inject(ProgressService);
  rulesEarned = computed(() => this.progress.rulesViewedCount() >= 7);
  practiceEarned = computed(() => this.progress.practiceCompleted());
  quizEarned = computed(() => this.progress.quizBestScore() >= 6);
  allEarned = computed(() => this.rulesEarned() && this.practiceEarned() && this.quizEarned());
}
