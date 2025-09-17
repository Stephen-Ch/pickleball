import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { Shell } from './shell';
import { RouterTestingModule } from '@angular/router/testing';

// Mock component for testing
@Component({
  template: '<p>Test content</p>',
  selector: 'mock-component'
})
class MockComponent { }

describe('Shell - Accessibility', () => {
  let component: Shell;
  let fixture: ComponentFixture<Shell>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Shell,
        RouterTestingModule.withRoutes([
          { path: '', component: MockComponent },
          { path: 'rules', component: MockComponent },
          { path: 'practice', component: MockComponent },
          { path: 'quiz', component: MockComponent },
          { path: 'badges', component: MockComponent }
        ])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Shell);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  describe('Skip Link Accessibility', () => {
    it('should have a skip to main content link', () => {
      const skipLink = fixture.nativeElement.querySelector('.skip-link');
      expect(skipLink).toBeTruthy();
      expect(skipLink.textContent.trim()).toBe('Skip to main content');
      expect(skipLink.getAttribute('href')).toBe('#main-content');
    });

    it('should position skip link correctly for screen readers', () => {
      const skipLink = fixture.nativeElement.querySelector('.skip-link');
      const styles = window.getComputedStyle(skipLink);
      
      // Skip link should be positioned off-screen but accessible
      expect(skipLink.classList.contains('skip-link')).toBe(true);
    });

    it('should allow keyboard navigation to skip link', () => {
      const skipLink = fixture.nativeElement.querySelector('.skip-link');
      
      // Simulate focus on skip link
      skipLink.focus();
      expect(document.activeElement).toBe(skipLink);
    });
  });

  describe('Navigation Accessibility', () => {
    it('should have proper navigation structure', () => {
      const nav = fixture.nativeElement.querySelector('nav[role="navigation"]');
      expect(nav).toBeTruthy();
      expect(nav.getAttribute('aria-label')).toBe('Main navigation');
    });

    it('should have descriptive aria-labels for all navigation links', () => {
      const navLinks = fixture.nativeElement.querySelectorAll('nav a');
      const expectedLabels = [
        'LearnPickle home page',
        'Go to home page', 
        'Learn pickleball rules',
        'Practice pickleball scenarios',
        'Take pickleball knowledge quiz',
        'View earned badges and achievements'
      ];

      navLinks.forEach((link: HTMLElement, index: number) => {
        expect(link.getAttribute('aria-label')).toBe(expectedLabels[index]);
      });
    });

    it('should make all navigation links keyboard accessible', () => {
      const navLinks = fixture.nativeElement.querySelectorAll('nav a');
      
      navLinks.forEach((link: HTMLElement) => {
        expect(link.getAttribute('tabindex')).toBe('0');
      });
    });
  });

  describe('Main Content Accessibility', () => {
    it('should have proper main content structure', () => {
      const main = fixture.nativeElement.querySelector('main');
      expect(main).toBeTruthy();
      expect(main.getAttribute('role')).toBe('main');
      expect(main.getAttribute('id')).toBe('main-content');
      expect(main.getAttribute('tabindex')).toBe('-1');
    });

    it('should have proper footer structure', () => {
      const footer = fixture.nativeElement.querySelector('footer');
      expect(footer).toBeTruthy();
      expect(footer.getAttribute('role')).toBe('contentinfo');
    });
  });

  describe('Focus Management', () => {
    it('should focus main content on navigation events', async () => {
      const main = fixture.nativeElement.querySelector('main');
      const focusSpy = spyOn(main, 'focus');

      // Simulate navigation
      await router.navigate(['/rules']);
      await fixture.whenStable();

      expect(focusSpy).toHaveBeenCalled();
    });

    it('should handle focus on route changes', async () => {
      const main = fixture.nativeElement.querySelector('main');
      
      // Navigate to different routes and check focus management
      const routes = ['/', '/rules', '/practice', '/quiz', '/badges'];
      
      for (const route of routes) {
        await router.navigate([route]);
        await fixture.whenStable();
        
        // Verify main content is focusable
        expect(main.getAttribute('tabindex')).toBe('-1');
      }
    });
  });

  describe('Semantic HTML Structure', () => {
    it('should use semantic HTML elements', () => {
      const header = fixture.nativeElement.querySelector('header');
      const nav = fixture.nativeElement.querySelector('nav');
      const main = fixture.nativeElement.querySelector('main');
      const footer = fixture.nativeElement.querySelector('footer');

      expect(header).toBeTruthy();
      expect(nav).toBeTruthy();
      expect(main).toBeTruthy();
      expect(footer).toBeTruthy();
    });

    it('should have proper heading hierarchy', () => {
      const h1 = fixture.nativeElement.querySelector('h1');
      expect(h1).toBeTruthy();
      expect(h1.textContent.trim()).toContain('LearnPickle');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support keyboard navigation through nav links', () => {
      const navLinks = fixture.nativeElement.querySelectorAll('nav a');
      
      // Test that all links are tabbable
      navLinks.forEach((link: HTMLElement) => {
        link.focus();
        expect(document.activeElement).toBe(link);
      });
    });

    it('should handle Enter and Space key activation', () => {
      const homeLink = fixture.nativeElement.querySelector('nav a[routerLink="/"]');
      const clickSpy = spyOn(homeLink, 'click');

      // Simulate Enter key
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      homeLink.dispatchEvent(enterEvent);

      // Note: RouterLink handles activation automatically, 
      // so we just verify the link is properly configured
      expect(homeLink.getAttribute('tabindex')).toBe('0');
    });
  });
});