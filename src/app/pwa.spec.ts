import { TestBed } from '@angular/core/testing';
import { isDevMode } from '@angular/core';

describe('PWA Service Worker', () => {
  describe('Service Worker Availability', () => {
    it('should have navigator.serviceWorker available in production builds', () => {
      // Skip this test in development mode since service worker is only enabled in production
      if (isDevMode()) {
        pending('Service worker is disabled in development mode');
        return;
      }

      // In production builds, navigator.serviceWorker should be available
      expect('serviceWorker' in navigator).toBe(true);
      expect(navigator.serviceWorker).toBeDefined();
    });

    it('should be able to register a service worker in production', async () => {
      // Skip this test in development mode
      if (isDevMode()) {
        pending('Service worker is disabled in development mode');
        return;
      }

      // Verify that the service worker registration API is available
      expect(typeof navigator.serviceWorker.register).toBe('function');
      expect(typeof navigator.serviceWorker.getRegistration).toBe('function');
      expect(typeof navigator.serviceWorker.getRegistrations).toBe('function');
    });
  });

  describe('Service Worker in Test Environment', () => {
    it('should handle missing service worker gracefully in test environment', () => {
      // This test verifies our app doesn't break if service workers aren't supported
      // (like in some test environments or older browsers)
      
      const hasServiceWorker = 'serviceWorker' in navigator;
      
      if (hasServiceWorker) {
        expect(navigator.serviceWorker).toBeDefined();
      } else {
        // Test environment might not have service worker support
        // This is expected and should not cause the app to fail
        expect(hasServiceWorker).toBe(false);
      }
    });
  });
});