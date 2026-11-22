import { test as base, expect } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';
import { TodoAssertions } from '../assertions/TodoAssertions';
import { summarizeFailure, writeFailureNote } from '../ai/failureSummarizer';

type Fixtures = {
  todoPage: TodoPage;
  todoAssert: TodoAssertions;
};

/**
 * Custom fixtures: inject page objects + write AI failure notes on test failure.
 */
export const test = base.extend<Fixtures>({
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.open();
    await use(todoPage);
  },
  todoAssert: async ({ page, todoPage }, use) => {
    await use(new TodoAssertions(todoPage, page));
  },
});

test.afterEach(async ({}, testInfo) => {
  if (testInfo.status === testInfo.expectedStatus) return;

  const errorMessage =
    testInfo.error?.message ||
    testInfo.errors.map((e) => e.message).filter(Boolean).join('\n') ||
    'Unknown failure';

  const summary = await summarizeFailure({
    testTitle: testInfo.title,
    errorMessage,
    filePath: testInfo.file,
  });

  const notePath = writeFailureNote(
    testInfo.outputDir,
    { testTitle: testInfo.title, errorMessage },
    summary,
  );

  await testInfo.attach('ai-failure-note', {
    path: notePath,
    contentType: 'text/markdown',
  });
});

export { expect };
