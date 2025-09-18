import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { RULES_CARDS, RuleCard } from './rules-data';

@Component({
  standalone: true,
  selector: 'app-rules',
  imports: [NgIf],
  template: `
    <section class="rules-explorer">
      <h2>Rules Explorer</h2>
      <div class="card" *ngIf="card">
        <h3>{{card.title}}</h3>
        <p>{{card.shortText}}</p>
        <button type="button"
          aria-expanded="{{showMore}}"
          (click)="toggleMore()">
          {{ showMore ? 'Hide' : 'More info' }}
        </button>
        <div *ngIf="showMore" class="more-info" role="region" aria-live="polite">
          <p>{{card.moreInfo}}</p>
        </div>
        <div class="nav">
          <button type="button" (click)="prev()" [disabled]="idx === 0">Back</button>
          <span>Card {{idx+1}} of {{cards.length}}</span>
          <button type="button" (click)="next()" [disabled]="idx === cards.length-1">Next</button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .rules-explorer { max-width: 28rem; margin: 2rem auto; padding: 1rem; background: #fffbe8; border-radius: 8px; box-shadow: 0 2px 8px #0001; }
    .card { padding: 1rem; border: 1px solid #e60012; border-radius: 6px; background: #fff; }
    .card h3 { margin-top: 0; }
    .nav { display: flex; align-items: center; gap: 1rem; margin-top: 1rem; }
    .more-info { margin: 1rem 0 0 0; padding: 0.75rem; background: #f0f8ff; border-left: 4px solid #e60012; border-radius: 4px; }
    button[aria-expanded] { margin-top: 0.5rem; }
  `]
})
export class RulesComponent {
  cards = RULES_CARDS;
  idx = 0;
  showMore = false;

  get card(): RuleCard { return this.cards[this.idx]; }

  next() {
    if (this.idx < this.cards.length - 1) {
      this.idx++;
      this.showMore = false;
    }
  }
  prev() {
    if (this.idx > 0) {
      this.idx--;
      this.showMore = false;
    }
  }
  toggleMore() {
    this.showMore = !this.showMore;
  }
}