import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Quiz } from './quiz';
import { QUIZ_QUESTIONS, calculateGrade, getGradeMessage } from './quiz-questions';

describe('Quiz', () => {
  let component: Quiz;
  let fixture: ComponentFixture<Quiz>;
  let debugElement: DebugElement;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Quiz, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Quiz);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Initial State', () => {
    it('should initialize with 5 random questions', () => {
      const quizState = component.getQuizStateForTesting();
      expect(quizState.questions.length).toBe(5);
      expect(quizState.currentQuestionIndex).toBe(0);
      expect(quizState.isCompleted).toBe(false);
      expect(quizState.showResults).toBe(false);
    });

    it('should initialize answers array with null values', () => {
      const quizState = component.getQuizStateForTesting();
      expect(quizState.answers.length).toBe(5);
      expect(quizState.answers.every(answer => answer === null)).toBe(true);
    });

    it('should start with first question', () => {
      expect(component.currentQuestionNumber).toBe(1);
      expect(component.totalQuestions).toBe(5);
    });

    it('should calculate initial progress percentage correctly', () => {
      expect(component.progressPercentage).toBe(20); // 1/5 * 100
    });
  });

  describe('Question Navigation', () => {
    it('should not allow going back from first question', () => {
      expect(component.canGoBack).toBe(false);
    });

    it('should not allow going next without answering', () => {
      expect(component.canGoNext).toBe(false);
    });

    it('should allow going next after answering (except last question)', () => {
      component.selectAnswer(0);
      if (!component.isLastQuestion) {
        expect(component.canGoNext).toBe(true);
      }
    });

    it('should navigate to next question correctly', () => {
      component.selectAnswer(0);
      const initialIndex = component.getQuizStateForTesting().currentQuestionIndex;
      
      component.nextQuestion();
      
      expect(component.getQuizStateForTesting().currentQuestionIndex).toBe(initialIndex + 1);
      expect(component.currentQuestionNumber).toBe(2);
    });

    it('should navigate to previous question correctly', () => {
      // Go to second question first
      component.selectAnswer(0);
      component.nextQuestion();
      
      const currentIndex = component.getQuizStateForTesting().currentQuestionIndex;
      component.previousQuestion();
      
      expect(component.getQuizStateForTesting().currentQuestionIndex).toBe(currentIndex - 1);
    });

    it('should update progress percentage as questions are answered', () => {
      expect(component.progressPercentage).toBe(20);
      
      component.selectAnswer(0);
      component.nextQuestion();
      expect(component.progressPercentage).toBe(40);
      
      component.selectAnswer(1);
      component.nextQuestion();
      expect(component.progressPercentage).toBe(60);
    });
  });

  describe('Answer Selection', () => {
    it('should select answer correctly', () => {
      component.selectAnswer(1);
      
      const quizState = component.getQuizStateForTesting();
      expect(quizState.answers[0]).toBe(1);
      expect(component.hasAnswered).toBe(true);
      expect(component.isAnswerSelected(1)).toBe(true);
      expect(component.isAnswerSelected(0)).toBe(false);
    });

    it('should prevent changing answer after selection', () => {
      component.selectAnswer(1);
      component.selectAnswer(2);
      
      const quizState = component.getQuizStateForTesting();
      expect(quizState.answers[0]).toBe(1); // Should remain the first selection
    });

    it('should check answer correctness properly', () => {
      const currentQuestion = component.currentQuestion;
      const correctIndex = currentQuestion.correctAnswer;
      const incorrectIndex = correctIndex === 0 ? 1 : 0;
      
      expect(component.isAnswerCorrect(0, correctIndex)).toBe(true);
      expect(component.isAnswerCorrect(0, incorrectIndex)).toBe(false);
    });
  });

  describe('Quiz Completion', () => {
    beforeEach(() => {
      // Answer all questions to complete quiz
      for (let i = 0; i < 5; i++) {
        component.setAnswerForTesting(i, 0);
      }
      // Navigate to last question
      const quizState = component.getQuizStateForTesting();
      quizState.currentQuestionIndex = 4;
    });

    it('should finish quiz when last question is answered', () => {
      expect(component.isLastQuestion).toBe(true);
      
      component.finishQuiz();
      
      const quizState = component.getQuizStateForTesting();
      expect(quizState.isCompleted).toBe(true);
      expect(quizState.showResults).toBe(true);
    });

    it('should calculate correct score', () => {
      // Set up specific answers for testing
      const quizState = component.getQuizStateForTesting();
      
      // Answer first 3 questions correctly, last 2 incorrectly
      for (let i = 0; i < 3; i++) {
        const correctAnswer = quizState.questions[i].correctAnswer;
        component.setAnswerForTesting(i, correctAnswer);
      }
      for (let i = 3; i < 5; i++) {
        const correctAnswer = quizState.questions[i].correctAnswer;
        const incorrectAnswer = correctAnswer === 0 ? 1 : 0;
        component.setAnswerForTesting(i, incorrectAnswer);
      }
      
      expect(component.correctAnswers).toBe(3);
      expect(component.scorePercentage).toBe(60);
    });

    it('should calculate grade correctly', () => {
      const quizState = component.getQuizStateForTesting();
      
      // Test A grade (5/5 = 100%)
      for (let i = 0; i < 5; i++) {
        const correctAnswer = quizState.questions[i].correctAnswer;
        component.setAnswerForTesting(i, correctAnswer);
      }
      expect(component.grade).toBe('A');
      
      // Test B grade (4/5 = 80%)
      const correctAnswer = quizState.questions[4].correctAnswer;
      const incorrectAnswer = correctAnswer === 0 ? 1 : 0;
      component.setAnswerForTesting(4, incorrectAnswer);
      expect(component.grade).toBe('B');
    });
  });

  describe('Quiz Restart', () => {
    it('should restart quiz correctly', () => {
      // Complete the quiz first
      component.selectAnswer(0);
      component.nextQuestion();
      component.selectAnswer(1);
      component.finishQuiz();
      
      expect(component.getQuizStateForTesting().isCompleted).toBe(true);
      
      component.restartQuiz();
      
      const quizState = component.getQuizStateForTesting();
      expect(quizState.currentQuestionIndex).toBe(0);
      expect(quizState.isCompleted).toBe(false);
      expect(quizState.showResults).toBe(false);
      expect(quizState.answers.every(answer => answer === null)).toBe(true);
    });
  });

  describe('Navigation Actions', () => {
    it('should navigate to rules page', () => {
      component.goToRules();
      expect(router.navigate).toHaveBeenCalledWith(['/rules']);
    });

    it('should navigate to practice page', () => {
      component.goToPractice();
      expect(router.navigate).toHaveBeenCalledWith(['/practice']);
    });
  });

  describe('Helper Methods', () => {
    it('should generate correct option labels', () => {
      expect(component.getOptionLabel(0)).toBe('A');
      expect(component.getOptionLabel(1)).toBe('B');
      expect(component.getOptionLabel(2)).toBe('C');
      expect(component.getOptionLabel(3)).toBe('D');
    });
  });

  describe('DOM Elements and Accessibility', () => {
    it('should display quiz header correctly', () => {
      const headerElement = debugElement.query(By.css('.quiz-header h1'));
      expect(headerElement).toBeTruthy();
      expect(headerElement.nativeElement.textContent.trim()).toBe('Pickleball Knowledge Quiz');
    });

    it('should display progress bar with correct attributes', () => {
      const progressBar = debugElement.query(By.css('.progress-bar'));
      
      expect(progressBar.nativeElement.getAttribute('role')).toBe('progressbar');
      expect(progressBar.nativeElement.getAttribute('aria-valuenow')).toBe('1');
      expect(progressBar.nativeElement.getAttribute('aria-valuemin')).toBe('1');
      expect(progressBar.nativeElement.getAttribute('aria-valuemax')).toBe('5');
    });

    it('should display current question correctly', () => {
      const questionText = debugElement.query(By.css('.question-text'));
      const currentQuestion = component.currentQuestion;
      
      expect(questionText.nativeElement.textContent.trim()).toBe(currentQuestion.question);
    });

    it('should display answer options correctly', () => {
      const optionElements = debugElement.queryAll(By.css('.option-button'));
      const currentQuestion = component.currentQuestion;
      
      expect(optionElements.length).toBe(currentQuestion.options.length);
      
      optionElements.forEach((option, index) => {
        const optionText = option.query(By.css('.option-text'));
        expect(optionText.nativeElement.textContent.trim()).toBe(currentQuestion.options[index]);
      });
    });

    it('should have proper ARIA attributes on answer options', () => {
      const optionElements = debugElement.queryAll(By.css('.option-button'));
      
      optionElements.forEach((option, index) => {
        expect(option.nativeElement.getAttribute('aria-label')).toContain(`Option ${index + 1}`);
        expect(option.nativeElement.getAttribute('aria-pressed')).toBe('false');
      });
    });

    it('should have aria-live region for question container', () => {
      const questionContainer = debugElement.query(By.css('.question-container'));
      expect(questionContainer.nativeElement.getAttribute('aria-live')).toBe('polite');
    });
  });

  describe('User Interactions', () => {
    it('should respond to answer option clicks', () => {
      const firstOption = debugElement.query(By.css('.option-button'));
      
      firstOption.nativeElement.click();
      fixture.detectChanges();
      
      expect(component.hasAnswered).toBe(true);
      expect(component.isAnswerSelected(0)).toBe(true);
    });

    it('should disable options after selection', () => {
      component.selectAnswer(0);
      fixture.detectChanges();
      
      const optionElements = debugElement.queryAll(By.css('.option-button'));
      optionElements.forEach(option => {
        expect(option.nativeElement.disabled).toBe(true);
      });
    });

    it('should show explanation after answer selection', () => {
      component.selectAnswer(0);
      fixture.detectChanges();
      
      const explanationSection = debugElement.query(By.css('.explanation-section'));
      expect(explanationSection).toBeTruthy();
      
      const explanationText = debugElement.query(By.css('.explanation-text'));
      expect(explanationText.nativeElement.textContent.trim()).toBe(component.currentQuestion.explanation);
    });

    it('should show next button after answering (except last question)', () => {
      component.selectAnswer(0);
      fixture.detectChanges();
      
      if (!component.isLastQuestion) {
        const nextButton = debugElement.query(By.css('.nav-button.primary'));
        expect(nextButton).toBeTruthy();
        expect(nextButton.nativeElement.textContent.trim()).toBe('Next →');
      }
    });

    it('should show finish button on last question', () => {
      // Navigate to last question
      while (!component.isLastQuestion) {
        component.selectAnswer(0);
        component.nextQuestion();
      }
      
      component.selectAnswer(0);
      fixture.detectChanges();
      
      const finishButton = debugElement.query(By.css('.nav-button.finish'));
      expect(finishButton).toBeTruthy();
      expect(finishButton.nativeElement.textContent.trim()).toBe('Finish Quiz');
    });
  });

  describe('Results Display', () => {
    beforeEach(() => {
      // Complete quiz to show results
      for (let i = 0; i < 5; i++) {
        component.setAnswerForTesting(i, 0);
      }
      component.finishQuiz();
      fixture.detectChanges();
    });

    it('should display results when quiz is completed', () => {
      const resultsContainer = debugElement.query(By.css('.results-container'));
      expect(resultsContainer).toBeTruthy();
      
      const resultsTitle = debugElement.query(By.css('.results-title'));
      expect(resultsTitle.nativeElement.textContent.trim()).toBe('Quiz Complete!');
    });

    it('should display score correctly', () => {
      const scoreNumber = debugElement.query(By.css('.score-number'));
      const scoreTotal = debugElement.query(By.css('.score-total'));
      
      expect(scoreNumber.nativeElement.textContent.trim()).toBe(component.correctAnswers.toString());
      expect(scoreTotal.nativeElement.textContent.trim()).toBe(`/ ${component.totalQuestions}`);
    });

    it('should display grade and percentage', () => {
      const gradeLetter = debugElement.query(By.css('.grade-letter'));
      const percentage = debugElement.query(By.css('.percentage'));
      
      expect(gradeLetter.nativeElement.textContent.trim()).toBe(component.grade);
      expect(percentage.nativeElement.textContent.trim()).toBe(`${component.scorePercentage}%`);
    });

    it('should show appropriate action buttons based on score', () => {
      const actionButtons = debugElement.queryAll(By.css('.action-button'));
      expect(actionButtons.length).toBeGreaterThanOrEqual(1);
      
      // Should always have restart button
      const restartButton = actionButtons.find(btn => 
        btn.nativeElement.textContent.trim() === 'Take Quiz Again'
      );
      expect(restartButton).toBeTruthy();
    });
  });

  describe('Visual Feedback States', () => {
    it('should apply correct styling to correct answer', () => {
      const correctIndex = component.currentQuestion.correctAnswer;
      
      component.selectAnswer(correctIndex);
      fixture.detectChanges();
      
      const optionElements = debugElement.queryAll(By.css('.option-button'));
      expect(optionElements[correctIndex].nativeElement.classList.contains('correct')).toBe(true);
    });

    it('should apply incorrect styling to wrong answer', () => {
      const correctIndex = component.currentQuestion.correctAnswer;
      const incorrectIndex = correctIndex === 0 ? 1 : 0;
      
      component.selectAnswer(incorrectIndex);
      fixture.detectChanges();
      
      const optionElements = debugElement.queryAll(By.css('.option-button'));
      expect(optionElements[incorrectIndex].nativeElement.classList.contains('incorrect')).toBe(true);
      expect(optionElements[correctIndex].nativeElement.classList.contains('correct')).toBe(true);
    });

    it('should show correct explanation styling', () => {
      const correctIndex = component.currentQuestion.correctAnswer;
      
      component.selectAnswer(correctIndex);
      fixture.detectChanges();
      
      const explanationCard = debugElement.query(By.css('.explanation-card'));
      expect(explanationCard.nativeElement.classList.contains('correct-explanation')).toBe(true);
    });

    it('should show incorrect explanation styling', () => {
      const correctIndex = component.currentQuestion.correctAnswer;
      const incorrectIndex = correctIndex === 0 ? 1 : 0;
      
      component.selectAnswer(incorrectIndex);
      fixture.detectChanges();
      
      const explanationCard = debugElement.query(By.css('.explanation-card'));
      expect(explanationCard.nativeElement.classList.contains('incorrect-explanation')).toBe(true);
    });
  });
});

describe('Quiz Questions Utility Functions', () => {
  describe('calculateGrade', () => {
    it('should return correct grades', () => {
      expect(calculateGrade(5, 5)).toBe('A'); // 100%
      expect(calculateGrade(4, 5)).toBe('B'); // 80%
      expect(calculateGrade(3, 5)).toBe('D'); // 60%
      expect(calculateGrade(2, 5)).toBe('F'); // 40%
      expect(calculateGrade(1, 5)).toBe('F'); // 20%
    });
  });

  describe('getGradeMessage', () => {
    it('should return appropriate messages for each grade', () => {
      const messageA = getGradeMessage(5, 5);
      const messageB = getGradeMessage(4, 5);
      const messageF = getGradeMessage(1, 5);
      
      expect(messageA).toContain('Excellent');
      expect(messageB).toContain('Great job');
      expect(messageF).toContain('Keep studying');
    });
  });
});
