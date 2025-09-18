import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { PRACTICE_SCENARIOS, PracticeScenario } from './practice-scenarios';

@Component({
  standalone: true,
  selector: 'app-practice',
  imports: [NgIf, NgFor],
  template: `
    <section class="practice">
      <h2>Practice Scenarios</h2>
      <div *ngIf="scenario">
        <div class="prompt">
          <strong>Scenario {{idx+1}} of {{scenarios.length}}:</strong>
          <p>{{scenario.prompt}}</p>
        </div>
        <div *ngIf="!answered">
          <button *ngFor="let opt of scenario.options; let i = index"
            type="button"
            (click)="answer(i)"
            [attr.aria-label]="'Answer: ' + opt">
            {{opt}}
          </button>
        </div>
        <div *ngIf="answered">
          <div class="feedback" [class.correct]="isCorrect" [class.incorrect]="!isCorrect" aria-live="polite">
            <p>{{scenario.feedback[selected!]}}</p>
          </div>
          <button type="button" (click)="next()">Next</button>
        </div>
      </div>
      <div *ngIf="idx === scenarios.length && answered">
        <h3>Great job!</h3>
        <p>You’ve completed all practice scenarios.</p>
      </div>
    </section>
  `,
  styles: [`
    .practice { max-width: 28rem; margin: 2rem auto; padding: 1rem; background: #f0f8ff; border-radius: 8px; box-shadow: 0 2px 8px #0001; }
    .prompt { margin-bottom: 1rem; }
    button { margin: 0.5rem 0.5rem 0 0; padding: 0.5rem 1.2rem; border-radius: 4px; border: 2px solid #222; background: #fff; color: #222; cursor: pointer; font-size: 1rem; }
    .feedback { margin: 1rem 0; padding: 0.75rem; border-radius: 4px; }
    .feedback.correct { background: #e6ffe6; border-left: 4px solid #0a0; }
    .feedback.incorrect { background: #fff0f0; border-left: 4px solid #e60012; }
  `]
})
export class PracticeComponent {
  scenarios = PRACTICE_SCENARIOS;
  idx = 0;
  answered = false;
  selected: number|null = null;
  isCorrect = false;

  get scenario(): PracticeScenario|undefined {
    return this.scenarios[this.idx];
  }

  answer(i: number) {
    if (this.answered) return;
    this.selected = i;
    this.answered = true;
    this.isCorrect = (i === this.scenario!.answer);
  }

  next() {
    if (this.idx < this.scenarios.length - 1) {
      this.idx++;
      this.answered = false;
      this.selected = null;
      this.isCorrect = false;
    } else if (this.idx === this.scenarios.length - 1) {
      this.idx++;
    }
  }
}