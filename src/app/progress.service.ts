import { Injectable, signal } from '@angular/core';

const RULES_VIEWED_KEY = 'lp/rulesViewedCount';
const PRACTICE_DONE_KEY = 'lp/practiceCompleted';
const QUIZ_BEST_KEY = 'lp/quizBestScore';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  readonly rulesViewedCount = signal(this.getNum(RULES_VIEWED_KEY, 0));
  readonly practiceCompleted = signal(this.getBool(PRACTICE_DONE_KEY, false));
  readonly quizBestScore = signal(this.getNum(QUIZ_BEST_KEY, 0));

  setRulesViewedCount(val: number) {
    this.rulesViewedCount.set(val);
    localStorage.setItem(RULES_VIEWED_KEY, String(val));
  }
  setPracticeCompleted(val: boolean) {
    this.practiceCompleted.set(val);
    localStorage.setItem(PRACTICE_DONE_KEY, JSON.stringify(val));
  }
  setQuizBestScore(val: number) {
    this.quizBestScore.set(val);
    localStorage.setItem(QUIZ_BEST_KEY, String(val));
  }

  private getNum(key: string, fallback: number): number {
    const v = localStorage.getItem(key);
    return v === null ? fallback : Number(v);
  }
  private getBool(key: string, fallback: boolean): boolean {
    const v = localStorage.getItem(key);
    return v === null ? fallback : JSON.parse(v);
  }
}
