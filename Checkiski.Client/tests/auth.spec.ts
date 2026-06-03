import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  const testUsername = `testuser_${Date.now()}`;

  test('should allow user to register and login', async ({ page }) => {
    // 1. Register
    await page.goto('/register');
    
    // Check if on register page
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();

    // Fill form
    await page.locator('input[type="text"]').fill(testUsername);
    await page.locator('input[type="email"]').fill(testEmail);
    await page.locator('input[type="password"]').fill(testPassword);
    
    // Submit
    // Route API call to avoid needing actual backend
    await page.route('**/api/player/register', route => {
      if (route.request().method() === 'OPTIONS') {
        route.fulfill({ status: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' } });
        return;
      }
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ message: 'User registered successfully' }),
      });
    });

    await page.getByRole('button', { name: 'Create Account' }).click();

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);

    // 2. Login
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

    await page.locator('input[type="text"]').fill(testUsername);
    await page.locator('input[type="password"]').fill(testPassword);

    await page.route('**/api/player/login', route => {
      if (route.request().method() === 'OPTIONS') {
        route.fulfill({ status: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' } });
        return;
      }
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ token: 'fake-jwt-token', playerId: 'user-123', username: testUsername }),
      });
    });

    await page.route('**/api/users/user-123', route => {
      if (route.request().method() === 'OPTIONS') {
        route.fulfill({ status: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' } });
        return;
      }
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ username: testUsername, elo: 1200 }),
      });
    });

    await page.getByRole('button', { name: 'Sign In' }).click();

    // Should redirect to profile
    await expect(page).toHaveURL(/\/profile\/me/);
    
    // Check if token is in localStorage
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBe('fake-jwt-token');
  });

  test('should show error on invalid login credentials', async ({ page }) => {
    await page.goto('/login');

    await page.locator('input[type="text"]').fill('wrong_user');
    await page.locator('input[type="password"]').fill('WrongPassword!');

    await page.route('**/api/player/login', route => {
      if (route.request().method() === 'OPTIONS') {
        route.fulfill({ status: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' } });
        return;
      }
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ message: 'Invalid credentials' }),
      });
    });

    await page.getByRole('button', { name: 'Sign In' }).click();

    // Expect an error message on the page
    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });
});
