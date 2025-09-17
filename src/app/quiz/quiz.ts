import { Component } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Shell } from '../shell/shell';
import { QuizQuestion, getRandomQuestions, calculateGrade, getGradeMessage } from './quiz-questions';
import { ProgressService } from '../services/progress.service';

interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: (number | null)[];
  isCompleted: boolean;
  showResults: boolean;
}

@Component({
  selector: 'app-quiz',
  imports: [Shell, CommonModule, TitleCasePipe],
  templateUrl: './quiz.html',
  styleUrl: './quiz.scss'
})
export class Quiz {
  private readonly QUIZ_SIZE = 5;
  
  quizState!: QuizState;

  constructor(private router: Router, private progressService: ProgressService) {
    this.initializeQuiz();
  }

  get quizProgress() {
    return this.progressService.getQuizProgress();
  }

  get hasTakenQuizBefore(): boolean {
    return this.quizProgress.totalQuizzesTaken > 0;
  }

  get improvementMessage(): string {
    const progress = this.quizProgress;
    if (progress.totalQuizzesTaken <= 1) return '';
    
    const currentPercentage = this.scorePercentage;
    const bestPercentage = progress.bestPercentage;
    
    if (currentPercentage > bestPercentage) {
      return `🎉 New personal best! Previous best: ${bestPercentage}%`;
    } else if (currentPercentage === bestPercentage) {
      return `🔥 Tied your best score of ${bestPercentage}%!`;
    } else {
      return `Your best score is still ${bestPercentage}%. Keep practicing!`;
    }
  }

  private initializeQuiz(): void {
    this.quizState = {
      questions: getRandomQuestions(this.QUIZ_SIZE),
      currentQuestionIndex: 0,
      answers: new Array(this.QUIZ_SIZE).fill(null),
      isCompleted: false,
      showResults: false
    };
  }

  get currentQuestion(): QuizQuestion {
    return this.quizState.questions[this.quizState.currentQuestionIndex];
  }

  get currentQuestionNumber(): number {
    return this.quizState.currentQuestionIndex + 1;
  }

  get totalQuestions(): number {
    return this.quizState.questions.length;
  }

  get progressPercentage(): number {
    return (this.currentQuestionNumber / this.totalQuestions) * 100;
  }

  get hasAnswered(): boolean {
    return this.quizState.answers[this.quizState.currentQuestionIndex] !== null;
  }

  get canGoNext(): boolean {
    return this.hasAnswered && !this.isLastQuestion;
  }

  get canGoBack(): boolean {
    return this.quizState.currentQuestionIndex > 0;
  }

  get isLastQuestion(): boolean {
    return this.quizState.currentQuestionIndex === this.totalQuestions - 1;
  }

  get correctAnswers(): number {
    return this.quizState.answers.reduce((count: number, answer, index) => {
      if (answer !== null && answer === this.quizState.questions[index].correctAnswer) {
        return count + 1;
      }
      return count;
    }, 0);
  }

  get scorePercentage(): number {
    return Math.round((this.correctAnswers / this.totalQuestions) * 100);
  }

  get grade(): string {
    return calculateGrade(this.correctAnswers, this.totalQuestions);
  }

  get gradeMessage(): string {
    return getGradeMessage(this.correctAnswers, this.totalQuestions);
  }

  selectAnswer(optionIndex: number): void {
    if (!this.hasAnswered) {
      this.quizState.answers[this.quizState.currentQuestionIndex] = optionIndex;
    }
  }

  nextQuestion(): void {
    if (this.canGoNext) {
      this.quizState.currentQuestionIndex++;
    } else if (this.isLastQuestion && this.hasAnswered) {
      this.finishQuiz();
    }
  }

  previousQuestion(): void {
    if (this.canGoBack) {
      this.quizState.currentQuestionIndex--;
    }
  }

  finishQuiz(): void {
    this.quizState.isCompleted = true;
    this.quizState.showResults = true;
    
    // Save quiz progress
    this.progressService.updateQuizProgress(
      this.correctAnswers,
      this.totalQuestions,
      this.scorePercentage,
      this.grade
    );
  }

  restartQuiz(): void {
    this.initializeQuiz();
  }

  goToRules(): void {
    this.router.navigate(['/rules']);
  }

  goToPractice(): void {
    this.router.navigate(['/practice']);
  }

  isAnswerCorrect(questionIndex: number, optionIndex: number): boolean {
    return this.quizState.questions[questionIndex].correctAnswer === optionIndex;
  }

  isAnswerSelected(optionIndex: number): boolean {
    return this.quizState.answers[this.quizState.currentQuestionIndex] === optionIndex;
  }

  getOptionLabel(index: number): string {
    return String.fromCharCode(65 + index); // A, B, C, D
  }

  // Testing helper methods
  getQuizStateForTesting(): QuizState {
    return this.quizState;
  }

  setAnswerForTesting(questionIndex: number, answer: number): void {
    this.quizState.answers[questionIndex] = answer;
  }
}
