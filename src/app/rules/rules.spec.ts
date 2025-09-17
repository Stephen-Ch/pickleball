import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { Rules } from './rules';
import { PICKLEBALL_RULES } from './rules-data';

describe('Rules', () => {
  let component: Rules;
  let fixture: ComponentFixture<Rules>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rules, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Rules);
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
    it('should load the first card on initialization', () => {
      expect(component.currentRule).toEqual(PICKLEBALL_RULES[0]);
      expect(component.currentRuleNumber).toBe(1);
    });

    it('should set correct total rules count', () => {
      expect(component.totalRules).toBe(PICKLEBALL_RULES.length);
    });

    it('should be on first rule initially', () => {
      expect(component.isFirstRule).toBe(true);
      expect(component.isLastRule).toBe(false);
    });

    it('should disable previous button on first rule', () => {
      expect(component.canGoPrevious).toBe(false);
    });

    it('should enable next button on first rule', () => {
      expect(component.canGoNext).toBe(true);
    });
  });

  describe('Navigation', () => {
    it('should navigate to next rule correctly', () => {
      const initialRule = component.currentRule;
      
      component.nextRule();
      
      expect(component.currentRule).toEqual(PICKLEBALL_RULES[1]);
      expect(component.currentRuleNumber).toBe(2);
      expect(component.currentRule).not.toEqual(initialRule);
    });

    it('should navigate to previous rule correctly', () => {
      // Move to second rule first
      component.nextRule();
      const secondRule = component.currentRule;
      
      component.previousRule();
      
      expect(component.currentRule).toEqual(PICKLEBALL_RULES[0]);
      expect(component.currentRuleNumber).toBe(1);
      expect(component.currentRule).not.toEqual(secondRule);
    });

    it('should not go beyond first rule when going previous', () => {
      const firstRule = component.currentRule;
      
      component.previousRule();
      
      expect(component.currentRule).toEqual(firstRule);
      expect(component.currentRuleNumber).toBe(1);
    });

    it('should not go beyond last rule when going next', () => {
      // Navigate to last rule
      while (component.canGoNext) {
        component.nextRule();
      }
      const lastRule = component.currentRule;
      
      component.nextRule();
      
      expect(component.currentRule).toEqual(lastRule);
      expect(component.currentRuleNumber).toBe(PICKLEBALL_RULES.length);
    });

    it('should go to specific rule correctly', () => {
      const targetRule = PICKLEBALL_RULES[2];
      
      component.goToRule(targetRule);
      
      expect(component.currentRule).toEqual(targetRule);
      expect(component.currentRuleNumber).toBe(3);
    });
  });

  describe('Boundary Conditions', () => {
    it('should handle first rule boundaries correctly', () => {
      expect(component.isFirstRule).toBe(true);
      expect(component.canGoPrevious).toBe(false);
      expect(component.canGoNext).toBe(true);
    });

    it('should handle last rule boundaries correctly', () => {
      // Navigate to last rule
      while (component.canGoNext) {
        component.nextRule();
      }
      
      expect(component.isLastRule).toBe(true);
      expect(component.canGoNext).toBe(false);
      expect(component.canGoPrevious).toBe(true);
    });

    it('should handle middle rule boundaries correctly', () => {
      // Navigate to middle rule
      component.goToRule(PICKLEBALL_RULES[Math.floor(PICKLEBALL_RULES.length / 2)]);
      
      expect(component.isFirstRule).toBe(false);
      expect(component.isLastRule).toBe(false);
      expect(component.canGoNext).toBe(true);
      expect(component.canGoPrevious).toBe(true);
    });
  });

  describe('DOM Elements and Accessibility', () => {
    it('should display current rule title with proper heading', () => {
      const titleElement = debugElement.query(By.css('.card-title'));
      
      expect(titleElement).toBeTruthy();
      expect(titleElement.nativeElement.textContent.trim()).toBe(PICKLEBALL_RULES[0].title);
      expect(titleElement.nativeElement.tagName).toBe('H2');
    });

    it('should display current rule content', () => {
      const textElement = debugElement.query(By.css('.card-text'));
      
      expect(textElement).toBeTruthy();
      expect(textElement.nativeElement.textContent.trim()).toBe(PICKLEBALL_RULES[0].shortText);
    });

    it('should have proper aria-labels on navigation buttons', () => {
      const prevButton = debugElement.query(By.css('.nav-previous'));
      const nextButton = debugElement.query(By.css('.nav-next'));
      
      expect(prevButton.nativeElement.getAttribute('aria-label')).toContain('No previous rule available');
      expect(nextButton.nativeElement.getAttribute('aria-label')).toContain('Go to next rule');
    });

    it('should have proper headings hierarchy', () => {
      const rulesHeading = debugElement.query(By.css('.rules-explorer h1'));
      const cardHeading = debugElement.query(By.css('.card-title'));
      
      expect(rulesHeading).toBeTruthy();
      expect(cardHeading).toBeTruthy();
      expect(rulesHeading.nativeElement.textContent).toContain('Pickleball Rules Explorer');
    });

    it('should have progress indicator with proper ARIA attributes', () => {
      const progressBar = debugElement.query(By.css('.progress-bar'));
      
      expect(progressBar.nativeElement.getAttribute('role')).toBe('progressbar');
      expect(progressBar.nativeElement.getAttribute('aria-valuenow')).toBe('1');
      expect(progressBar.nativeElement.getAttribute('aria-valuemin')).toBe('1');
      expect(progressBar.nativeElement.getAttribute('aria-valuemax')).toBe(PICKLEBALL_RULES.length.toString());
    });

    it('should have card indicators with proper ARIA attributes', () => {
      const indicators = debugElement.queryAll(By.css('.card-indicator'));
      
      expect(indicators.length).toBe(PICKLEBALL_RULES.length);
      
      indicators.forEach((indicator, index) => {
        expect(indicator.nativeElement.getAttribute('role')).toBe('tab');
        expect(indicator.nativeElement.getAttribute('aria-label')).toContain(`Go to rule ${index + 1}`);
      });
    });

    it('should have proper aria-live region for dynamic content', () => {
      const cardContainer = debugElement.query(By.css('.card-container'));
      
      expect(cardContainer.nativeElement.getAttribute('aria-live')).toBe('polite');
    });

    it('should update progress bar width correctly', () => {
      const progressFill = debugElement.query(By.css('.progress-fill'));
      const expectedWidth = (1 / PICKLEBALL_RULES.length) * 100;
      
      // Parse the width value to handle floating point precision
      const actualWidth = parseFloat(progressFill.nativeElement.style.width);
      expect(actualWidth).toBeCloseTo(expectedWidth, 1);
    });
  });

  describe('Button States', () => {
    it('should disable previous button on first rule', () => {
      const prevButton = debugElement.query(By.css('.nav-previous'));
      
      expect(prevButton.nativeElement.disabled).toBe(true);
    });

    it('should enable both buttons on middle rules', () => {
      component.nextRule();
      fixture.detectChanges();
      
      const prevButton = debugElement.query(By.css('.nav-previous'));
      const nextButton = debugElement.query(By.css('.nav-next'));
      
      expect(prevButton.nativeElement.disabled).toBe(false);
      expect(nextButton.nativeElement.disabled).toBe(false);
    });

    it('should mark active indicator correctly', () => {
      const indicators = debugElement.queryAll(By.css('.card-indicator'));
      
      expect(indicators[0].nativeElement.classList.contains('active')).toBe(true);
      expect(indicators[0].nativeElement.getAttribute('aria-selected')).toBe('true');
    });
  });

  describe('User Interactions', () => {
    it('should respond to next button click', () => {
      const nextButton = debugElement.query(By.css('.nav-next'));
      
      nextButton.nativeElement.click();
      fixture.detectChanges();
      
      expect(component.currentRuleNumber).toBe(2);
    });

    it('should respond to indicator click', () => {
      const indicators = debugElement.queryAll(By.css('.card-indicator'));
      
      indicators[2].nativeElement.click();
      fixture.detectChanges();
      
      expect(component.currentRuleNumber).toBe(3);
      expect(component.currentRule).toEqual(PICKLEBALL_RULES[2]);
    });
  });
});
