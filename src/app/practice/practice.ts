import { Component, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { Shell } from '../shell/shell';
import { PracticeScenario, PRACTICE_SCENARIOS, getNextScenario, getCurrentScenarioNumber, getTotalScenarios } from './practice-scenarios';

export interface FeedbackState {
  isAnswered: boolean;
  selectedAnswer: number | null;
  isCorrect: boolean;
  showExplanation: boolean;
}

@Component({
  selector: 'app-practice',
  imports: [Shell, TitleCasePipe],
  templateUrl: './practice.html',
  styleUrl: './practice.scss'
})
export class Practice implements OnInit {
  currentScenario: PracticeScenario = PRACTICE_SCENARIOS[0];
  currentScenarioNumber: number = 1;
  totalScenarios: number = getTotalScenarios();
  
  feedback: FeedbackState = {
    isAnswered: false,
    selectedAnswer: null,
    isCorrect: false,
    showExplanation: false
  };
  
  // Statistics
  correctAnswers: number = 0;
  totalAttempts: number = 0;
  
  get accuracyPercentage(): number {
    return this.totalAttempts > 0 ? Math.round((this.correctAnswers / this.totalAttempts) * 100) : 0;
  }
  
  get hasNextScenario(): boolean {
    return getNextScenario(this.currentScenario.id) !== null;
  }
  
  get isLastScenario(): boolean {
    return this.currentScenarioNumber === this.totalScenarios;
  }

  ngOnInit(): void {
    this.loadScenario(PRACTICE_SCENARIOS[0]);
  }

  selectAnswer(answerIndex: number): void {
    if (this.feedback.isAnswered) return;
    
    this.feedback.selectedAnswer = answerIndex;
    this.feedback.isAnswered = true;
    this.feedback.isCorrect = answerIndex === this.currentScenario.correctAnswer;
    this.feedback.showExplanation = true;
    
    this.totalAttempts++;
    if (this.feedback.isCorrect) {
      this.correctAnswers++;
    }
  }

  nextScenario(): void {
    const next = getNextScenario(this.currentScenario.id);
    if (next) {
      this.loadScenario(next);
    }
  }

  restartPractice(): void {
    this.loadScenario(PRACTICE_SCENARIOS[0]);
    this.correctAnswers = 0;
    this.totalAttempts = 0;
  }

  getOptionLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }

  private loadScenario(scenario: PracticeScenario): void {
    this.currentScenario = scenario;
    this.currentScenarioNumber = getCurrentScenarioNumber(scenario.id);
    this.resetFeedback();
  }

  private resetFeedback(): void {
    this.feedback = {
      isAnswered: false,
      selectedAnswer: null,
      isCorrect: false,
      showExplanation: false
    };
  }

  // For testing purposes
  getCurrentScenarioForTesting(): PracticeScenario {
    return this.currentScenario;
  }

  getFeedbackForTesting(): FeedbackState {
    return this.feedback;
  }
}
