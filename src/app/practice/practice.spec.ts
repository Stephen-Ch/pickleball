import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { Practice, FeedbackState } from './practice';
import { PRACTICE_SCENARIOS } from './practice-scenarios';

describe('Practice', () => {
  let component: Practice;
  let fixture: ComponentFixture<Practice>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Practice, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Practice);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Initial State', () => {
    it('should load the first scenario on initialization', () => {
      expect(component.getCurrentScenarioForTesting()).toEqual(PRACTICE_SCENARIOS[0]);
      expect(component.currentScenarioNumber).toBe(1);
    });

    it('should initialize with no feedback', () => {
      const feedback = component.getFeedbackForTesting();
      expect(feedback.isAnswered).toBe(false);
      expect(feedback.selectedAnswer).toBe(null);
      expect(feedback.isCorrect).toBe(false);
      expect(feedback.showExplanation).toBe(false);
    });

    it('should initialize statistics correctly', () => {
      expect(component.correctAnswers).toBe(0);
      expect(component.totalAttempts).toBe(0);
      expect(component.accuracyPercentage).toBe(0);
    });

    it('should set total scenarios correctly', () => {
      expect(component.totalScenarios).toBe(PRACTICE_SCENARIOS.length);
    });
  });

  describe('Answer Selection', () => {
    it('should handle correct answer selection', () => {
      const correctAnswerIndex = PRACTICE_SCENARIOS[0].correctAnswer;
      
      component.selectAnswer(correctAnswerIndex);
      
      const feedback = component.getFeedbackForTesting();
      expect(feedback.isAnswered).toBe(true);
      expect(feedback.selectedAnswer).toBe(correctAnswerIndex);
      expect(feedback.isCorrect).toBe(true);
      expect(feedback.showExplanation).toBe(true);
    });

    it('should handle incorrect answer selection', () => {
      const correctAnswerIndex = PRACTICE_SCENARIOS[0].correctAnswer;
      const incorrectAnswerIndex = correctAnswerIndex === 0 ? 1 : 0;
      
      component.selectAnswer(incorrectAnswerIndex);
      
      const feedback = component.getFeedbackForTesting();
      expect(feedback.isAnswered).toBe(true);
      expect(feedback.selectedAnswer).toBe(incorrectAnswerIndex);
      expect(feedback.isCorrect).toBe(false);
      expect(feedback.showExplanation).toBe(true);
    });

    it('should prevent multiple answer selections', () => {
      const correctAnswerIndex = PRACTICE_SCENARIOS[0].correctAnswer;
      const incorrectAnswerIndex = correctAnswerIndex === 0 ? 1 : 0;
      
      component.selectAnswer(correctAnswerIndex);
      component.selectAnswer(incorrectAnswerIndex);
      
      const feedback = component.getFeedbackForTesting();
      expect(feedback.selectedAnswer).toBe(correctAnswerIndex);
      expect(feedback.isCorrect).toBe(true);
    });

    it('should update statistics correctly for correct answer', () => {
      const correctAnswerIndex = PRACTICE_SCENARIOS[0].correctAnswer;
      
      component.selectAnswer(correctAnswerIndex);
      
      expect(component.correctAnswers).toBe(1);
      expect(component.totalAttempts).toBe(1);
      expect(component.accuracyPercentage).toBe(100);
    });

    it('should update statistics correctly for incorrect answer', () => {
      const correctAnswerIndex = PRACTICE_SCENARIOS[0].correctAnswer;
      const incorrectAnswerIndex = correctAnswerIndex === 0 ? 1 : 0;
      
      component.selectAnswer(incorrectAnswerIndex);
      
      expect(component.correctAnswers).toBe(0);
      expect(component.totalAttempts).toBe(1);
      expect(component.accuracyPercentage).toBe(0);
    });
  });

  describe('Navigation', () => {
    it('should navigate to next scenario correctly', () => {
      const initialScenario = component.getCurrentScenarioForTesting();
      
      component.selectAnswer(0); // Answer current scenario
      component.nextScenario();
      
      const newScenario = component.getCurrentScenarioForTesting();
      expect(newScenario).not.toEqual(initialScenario);
      expect(component.currentScenarioNumber).toBe(2);
    });

    it('should reset feedback when loading new scenario', () => {
      component.selectAnswer(0); // Answer current scenario
      component.nextScenario();
      
      const feedback = component.getFeedbackForTesting();
      expect(feedback.isAnswered).toBe(false);
      expect(feedback.selectedAnswer).toBe(null);
      expect(feedback.isCorrect).toBe(false);
      expect(feedback.showExplanation).toBe(false);
    });

    it('should maintain statistics across scenarios', () => {
      const correctAnswerIndex = PRACTICE_SCENARIOS[0].correctAnswer;
      
      component.selectAnswer(correctAnswerIndex);
      component.nextScenario();
      
      expect(component.correctAnswers).toBe(1);
      expect(component.totalAttempts).toBe(1);
    });

    it('should handle navigation boundaries correctly', () => {
      expect(component.hasNextScenario).toBe(true);
      expect(component.isLastScenario).toBe(false);
      
      // Navigate to last scenario
      while (component.hasNextScenario) {
        component.selectAnswer(0);
        component.nextScenario();
      }
      
      expect(component.hasNextScenario).toBe(false);
      expect(component.isLastScenario).toBe(true);
    });
  });

  describe('Practice Restart', () => {
    it('should restart practice correctly', () => {
      // Progress through some scenarios
      component.selectAnswer(0);
      component.nextScenario();
      component.selectAnswer(1);
      
      component.restartPractice();
      
      expect(component.getCurrentScenarioForTesting()).toEqual(PRACTICE_SCENARIOS[0]);
      expect(component.currentScenarioNumber).toBe(1);
      expect(component.correctAnswers).toBe(0);
      expect(component.totalAttempts).toBe(0);
      
      const feedback = component.getFeedbackForTesting();
      expect(feedback.isAnswered).toBe(false);
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
    it('should display scenario title correctly', () => {
      const titleElement = debugElement.query(By.css('.scenario-title'));
      
      expect(titleElement).toBeTruthy();
      expect(titleElement.nativeElement.textContent.trim()).toBe(PRACTICE_SCENARIOS[0].title);
    });

    it('should display scenario content correctly', () => {
      const descriptionElement = debugElement.query(By.css('.scenario-description'));
      const situationElement = debugElement.query(By.css('.situation-text'));
      const questionElement = debugElement.query(By.css('.question-text'));
      
      expect(descriptionElement.nativeElement.textContent.trim()).toBe(PRACTICE_SCENARIOS[0].description);
      expect(situationElement.nativeElement.textContent.trim()).toBe(PRACTICE_SCENARIOS[0].situation);
      expect(questionElement.nativeElement.textContent.trim()).toBe(PRACTICE_SCENARIOS[0].question);
    });

    it('should display answer options correctly', () => {
      const optionElements = debugElement.queryAll(By.css('.answer-option'));
      
      expect(optionElements.length).toBe(PRACTICE_SCENARIOS[0].options.length);
      
      optionElements.forEach((option, index) => {
        const optionText = option.query(By.css('.option-text'));
        expect(optionText.nativeElement.textContent.trim()).toBe(PRACTICE_SCENARIOS[0].options[index]);
      });
    });

    it('should have proper ARIA attributes on answer options', () => {
      const optionElements = debugElement.queryAll(By.css('.answer-option'));
      
      optionElements.forEach((option, index) => {
        expect(option.nativeElement.getAttribute('aria-label')).toContain(`Option ${index + 1}`);
        expect(option.nativeElement.getAttribute('aria-pressed')).toBe('false');
      });
    });

    it('should have progress bar with proper ARIA attributes', () => {
      const progressBar = debugElement.query(By.css('.progress-bar'));
      
      expect(progressBar.nativeElement.getAttribute('role')).toBe('progressbar');
      expect(progressBar.nativeElement.getAttribute('aria-valuenow')).toBe('1');
      expect(progressBar.nativeElement.getAttribute('aria-valuemin')).toBe('1');
      expect(progressBar.nativeElement.getAttribute('aria-valuemax')).toBe(PRACTICE_SCENARIOS.length.toString());
    });

    it('should have proper aria-live regions', () => {
      const scenarioContainer = debugElement.query(By.css('.scenario-container'));
      
      expect(scenarioContainer.nativeElement.getAttribute('aria-live')).toBe('polite');
    });
  });

  describe('User Interactions', () => {
    it('should respond to answer option clicks', () => {
      const firstOption = debugElement.query(By.css('.answer-option'));
      
      firstOption.nativeElement.click();
      fixture.detectChanges();
      
      const feedback = component.getFeedbackForTesting();
      expect(feedback.isAnswered).toBe(true);
      expect(feedback.selectedAnswer).toBe(0);
    });

    it('should show feedback after answer selection', () => {
      component.selectAnswer(0);
      fixture.detectChanges();
      
      const feedbackSection = debugElement.query(By.css('.feedback-section'));
      expect(feedbackSection).toBeTruthy();
    });

    it('should show next button after answering', () => {
      component.selectAnswer(0);
      fixture.detectChanges();
      
      const nextButton = debugElement.query(By.css('.next-scenario'));
      expect(nextButton).toBeTruthy();
    });

    it('should disable answer options after selection', () => {
      component.selectAnswer(0);
      fixture.detectChanges();
      
      const optionElements = debugElement.queryAll(By.css('.answer-option'));
      optionElements.forEach(option => {
        expect(option.nativeElement.disabled).toBe(true);
      });
    });
  });

  describe('Visual Feedback States', () => {
    it('should apply correct styling to correct answer', () => {
      const correctIndex = PRACTICE_SCENARIOS[0].correctAnswer;
      
      component.selectAnswer(correctIndex);
      fixture.detectChanges();
      
      const optionElements = debugElement.queryAll(By.css('.answer-option'));
      expect(optionElements[correctIndex].nativeElement.classList.contains('correct')).toBe(true);
    });

    it('should apply incorrect styling to wrong answer', () => {
      const correctIndex = PRACTICE_SCENARIOS[0].correctAnswer;
      const incorrectIndex = correctIndex === 0 ? 1 : 0;
      
      component.selectAnswer(incorrectIndex);
      fixture.detectChanges();
      
      const optionElements = debugElement.queryAll(By.css('.answer-option'));
      expect(optionElements[incorrectIndex].nativeElement.classList.contains('incorrect')).toBe(true);
      expect(optionElements[correctIndex].nativeElement.classList.contains('correct')).toBe(true);
    });

    it('should show correct feedback styling', () => {
      const correctIndex = PRACTICE_SCENARIOS[0].correctAnswer;
      
      component.selectAnswer(correctIndex);
      fixture.detectChanges();
      
      const feedbackCard = debugElement.query(By.css('.feedback-card'));
      expect(feedbackCard.nativeElement.classList.contains('correct-feedback')).toBe(true);
    });

    it('should show incorrect feedback styling', () => {
      const correctIndex = PRACTICE_SCENARIOS[0].correctAnswer;
      const incorrectIndex = correctIndex === 0 ? 1 : 0;
      
      component.selectAnswer(incorrectIndex);
      fixture.detectChanges();
      
      const feedbackCard = debugElement.query(By.css('.feedback-card'));
      expect(feedbackCard.nativeElement.classList.contains('incorrect-feedback')).toBe(true);
    });
  });
});
