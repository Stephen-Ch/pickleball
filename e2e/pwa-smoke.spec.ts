import { test, expect } from '@playwright/test';

test.describe('PWA Smoke Tests', () => {
  test('should load homepage and display app title', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');

    // Verify the page loads successfully
    await expect(page).toHaveTitle(/LearnPickle/);

    // Verify the main app content is visible
    await expect(page.locator('h1')).toContainText('LearnPickle');
    
    // Verify the app shell is present
    await expect(page.locator('app-shell')).toBeVisible();
  });

  test('should display navigation menu', async ({ page }) => {
    await page.goto('/');

    // Verify navigation links are present
    await expect(page.locator('nav a[href="/"]')).toBeVisible();
    await expect(page.locator('nav a[href="/rules"]')).toBeVisible();
    await expect(page.locator('nav a[href="/practice"]')).toBeVisible();
    await expect(page.locator('nav a[href="/quiz"]')).toBeVisible();
    await expect(page.locator('nav a[href="/badges"]')).toBeVisible();
  });

  test('should have PWA manifest', async ({ page }) => {
    await page.goto('/');

    // Check if manifest is linked in the head
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute('href', '/manifest.webmanifest');
  });

  test('should register service worker in production build', async ({ page }) => {
    await page.goto('/');

    // Check if service worker is registered (only in production builds)
    const serviceWorkerRegistered = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });

    expect(serviceWorkerRegistered).toBe(true);
  });
});