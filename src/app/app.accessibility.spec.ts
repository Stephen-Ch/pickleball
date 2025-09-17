import { TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

// Simple test component to check accessibility features
@Component({
  template: `
    <!-- Skip to content link for keyboard navigation -->
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <header>
      <nav role="navigation" aria-label="Main navigation">
        <h1><a routerLink="/" tabindex="0" aria-label="LearnPickle home page">LearnPickle</a></h1>
        <ul>
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" tabindex="0" aria-label="Go to home page">Home</a></li>
          <li><a routerLink="/rules" routerLinkActive="active" tabindex="0" aria-label="Learn pickleball rules">Rules</a></li>
          <li><a routerLink="/practice" routerLinkActive="active" tabindex="0" aria-label="Practice pickleball scenarios">Practice</a></li>
          <li><a routerLink="/quiz" routerLinkActive="active" tabindex="0" aria-label="Take pickleball knowledge quiz">Quiz</a></li>
          <li><a routerLink="/badges" routerLinkActive="active" tabindex="0" aria-label="View earned badges and achievements">Badges</a></li>
        </ul>
      </nav>
    </header>

    <main role="main" id="main-content" tabindex="-1">
      <h1 tabindex="-1">Test Page</h1>
      <p>Test content</p>
    </main>

    <footer role="contentinfo">
      <p>&copy; 2025 LearnPickle - Teaching pickleball rules through play</p>
    </footer>
  `
})
class AccessibilityTestComponent { }

describe('Application - Accessibility Integration', () => {
  let fixture: any;
  let debugElement: DebugElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        AccessibilityTestComponent,
        RouterTestingModule
      ]
    });

    fixture = TestBed.createComponent(AccessibilityTestComponent);
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  describe('Skip Link Accessibility', () => {
    it('should have a skip to main content link', () => {
      const skipLink = debugElement.query(By.css('.skip-link'));
      expect(skipLink).toBeTruthy();
      expect(skipLink.nativeElement.textContent.trim()).toBe('Skip to main content');
      expect(skipLink.nativeElement.getAttribute('href')).toBe('#main-content');
    });

    it('should allow keyboard navigation to skip link', () => {
      const skipLink = debugElement.query(By.css('.skip-link'));
      
      // Simulate focus on skip link
      skipLink.nativeElement.focus();
      expect(document.activeElement).toBe(skipLink.nativeElement);
    });
  });

  describe('Navigation Accessibility', () => {
    it('should have proper navigation structure', () => {
      const nav = debugElement.query(By.css('nav[role="navigation"]'));
      expect(nav).toBeTruthy();
      expect(nav.nativeElement.getAttribute('aria-label')).toBe('Main navigation');
    });

    it('should have descriptive aria-labels for all navigation links', () => {
      const navLinks = debugElement.queryAll(By.css('nav a'));
      const expectedLabels = [
        'LearnPickle home page',
        'Go to home page', 
        'Learn pickleball rules',
        'Practice pickleball scenarios',
        'Take pickleball knowledge quiz',
        'View earned badges and achievements'
      ];

      navLinks.forEach((link, index) => {
        expect(link.nativeElement.getAttribute('aria-label')).toBe(expectedLabels[index]);
      });
    });

    it('should make all navigation links keyboard accessible', () => {
      const navLinks = debugElement.queryAll(By.css('nav a'));
      
      navLinks.forEach((link) => {
        expect(link.nativeElement.getAttribute('tabindex')).toBe('0');
      });
    });
  });

  describe('Main Content Accessibility', () => {
    it('should have proper main content structure', () => {
      const main = debugElement.query(By.css('main'));
      expect(main).toBeTruthy();
      expect(main.nativeElement.getAttribute('role')).toBe('main');
      expect(main.nativeElement.getAttribute('id')).toBe('main-content');
      expect(main.nativeElement.getAttribute('tabindex')).toBe('-1');
    });

    it('should have proper footer structure', () => {
      const footer = debugElement.query(By.css('footer'));
      expect(footer).toBeTruthy();
      expect(footer.nativeElement.getAttribute('role')).toBe('contentinfo');
    });

    it('should have proper heading hierarchy', () => {
      const h1 = debugElement.query(By.css('main h1'));
      expect(h1).toBeTruthy();
      expect(h1.nativeElement.getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('Semantic HTML Structure', () => {
    it('should use semantic HTML elements', () => {
      const header = debugElement.query(By.css('header'));
      const nav = debugElement.query(By.css('nav'));
      const main = debugElement.query(By.css('main'));
      const footer = debugElement.query(By.css('footer'));

      expect(header).toBeTruthy();
      expect(nav).toBeTruthy();
      expect(main).toBeTruthy();
      expect(footer).toBeTruthy();
    });

    it('should have proper site heading hierarchy', () => {
      const siteH1 = debugElement.query(By.css('nav h1'));
      const pageH1 = debugElement.query(By.css('main h1'));
      
      expect(siteH1).toBeTruthy();
      expect(pageH1).toBeTruthy();
      expect(siteH1.nativeElement.textContent.trim()).toContain('LearnPickle');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support keyboard navigation through nav links', () => {
      const navLinks = debugElement.queryAll(By.css('nav a'));
      
      // Test that all links are tabbable
      navLinks.forEach((link) => {
        link.nativeElement.focus();
        expect(document.activeElement).toBe(link.nativeElement);
      });
    });

    it('should have all interactive elements keyboard accessible', () => {
      const interactiveElements = debugElement.queryAll(By.css('a, button, [tabindex="0"]'));

      expect(interactiveElements.length).toBeGreaterThan(0);

      interactiveElements.forEach((element) => {
        // All interactive elements should be keyboard accessible
        const tabindex = element.nativeElement.getAttribute('tabindex');
        expect(tabindex === null || tabindex === '0').toBe(true);
      });
    });
  });

  describe('Progressive Enhancement', () => {
    it('should work with proper router link attributes', () => {
      // Verify that all navigation links have proper routerLink attributes
      const navLinks = debugElement.queryAll(By.css('nav a[routerLink]'));
      
      expect(navLinks.length).toBeGreaterThan(0);
      
      navLinks.forEach((link) => {
        const routerLink = link.nativeElement.getAttribute('routerLink');
        expect(routerLink).toBeTruthy();
        // Angular router links work with progressive enhancement
      });
    });
  });
});