import { test, expect } from '@playwright/test';
import { suggestLocators } from '../src/ai/locatorHints';
import { summarizeFailure } from '../src/ai/failureSummarizer';

test.describe('AI helper (offline)', () => {
  test('suggests role-based locators for a button goal', () => {
    const hints = suggestLocators('click submit button');
    expect(hints.some((h) => h.includes("getByRole('button'"))).toBeTruthy();
    expect(hints.some((h) => h.toLowerCase().includes('xpath'))).toBeTruthy();
  });

  test('summarizes a timeout failure without API key', async () => {
    const summary = await summarizeFailure({
      testTitle: 'adds a todo',
      errorMessage: 'Timeout 5000ms exceeded waiting for locator',
    });
    expect(summary.toLowerCase()).toContain('locator');
  });
});
