import { Component, inject } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { QUIZ_QUESTIONS, QuizQuestion } from './quiz-questions';
import { ProgressService } from './progress.service';

@Component({
  standalone: true,
  selector: 'app-quiz',
  imports: [NgIf, NgFor],
  template: `
    <section class="quiz">
      <h2>Quiz</h2>
      <div *ngIf="!completed && question">
        <div class="prompt">
          <strong>Question {{idx+1}} of {{questions.length}}:</strong>
          <p>{{question.question}}</p>
        </div>
        <div *ngIf="!answered">
          <button *ngFor="let opt of question.options; let i = index"
            type="button"
            (click)="answer(i)"
            [attr.aria-label]="'Answer: ' + opt">
            {{opt}}
          </button>
        </div>
        <div *ngIf="answered">
          <div class="feedback" [class.correct]="isCorrect" [class.incorrect]="!isCorrect" aria-live="polite">
            <p>{{isCorrect ? 'Correct!' : 'Not quite.'}}</p>
          </div>
          <button type="button" (click)="next()">Next</button>
        </div>
      </div>
      <div *ngIf="completed">
        <h3>Quiz Complete!</h3>
        <p>Your score: {{score}} / {{questions.length}}</p>
        <p *ngIf="score === questions.length">Perfect! You really know your stuff!</p>
        <p *ngIf="score < questions.length && score >= passThreshold">Great job! A little more practice and you'll be a pro.</p>
        <p *ngIf="score < passThreshold">Keep practicing and you'll master the rules in no time!</p>
      </div>
    </section>
  `,
  styles: [`
    .quiz { max-width: 28rem; margin: 2rem auto; padding: 1rem; background: #fffbe8; border-radius: 8px; box-shadow: 0 2px 8px #0001; }
    .prompt { margin-bottom: 1rem; }
    button { margin: 0.5rem 0.5rem 0 0; padding: 0.5rem 1.2rem; border-radius: 4px; border: 2px solid #222; background: #fff; color: #222; cursor: pointer; font-size: 1rem; }
    .feedback { margin: 1rem 0; padding: 0.75rem; border-radius: 4px; }
    .feedback.correct { background: #e6ffe6; border-left: 4px solid #0a0; }
    .feedback.incorrect { background: #fff0f0; border-left: 4px solid #e60012; }
  `]
})
export class QuizComponent {
  questions = QUIZ_QUESTIONS;
  idx = 0;
  score = 0;
  answered = false;
  isCorrect = false;
  completed = false;
  progress = inject(ProgressService);

  get question(): QuizQuestion|undefined {
    return this.questions[this.idx];
  }

  get passThreshold() {
    return Math.ceil(this.questions.length * 0.7);
  }

  answer(i: number) {
    if (this.answered || this.completed) return;
    this.isCorrect = (i === this.question!.answer);
    if (this.isCorrect) this.score++;
    this.answered = true;
  }

  next() {
    if (this.idx < this.questions.length - 1) {
      this.idx++;
      this.answered = false;
      this.isCorrect = false;
    } else {
      this.completed = true;
      // Update best score in ProgressService if this score is higher
      if (this.score > this.progress.quizBestScore()) {
        this.progress.setQuizBestScore(this.score);
      }
    }
  }
}