import { test } from '../src/fixtures/test-fixtures';

/**
 * Fast smoke path for CI — create → complete → filter → clear.
 */
test.describe('Sanity suite', () => {
  test('happy path: add, complete, filter, clear', async ({ todoPage, todoAssert }) => {
    await todoPage.addTodos(['Sanity A', 'Sanity B']);
    await todoAssert.expectRemainingCount('2 items left');

    await todoPage.completeTodo('Sanity A');
    await todoAssert.expectTodoCompleted('Sanity A');
    await todoAssert.expectRemainingCount('1 item left');

    await todoPage.filterActive();
    await todoAssert.expectVisibleTodos(['Sanity B']);

    await todoPage.filterCompleted();
    await todoAssert.expectVisibleTodos(['Sanity A']);

    await todoPage.filterAll();
    await todoPage.clearCompletedTodos();
    await todoAssert.expectVisibleTodos(['Sanity B']);
  });
});
