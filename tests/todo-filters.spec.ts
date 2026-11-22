import { test } from '../src/fixtures/test-fixtures';

test.describe('Todo filters', () => {
  test.beforeEach(async ({ todoPage }) => {
    await todoPage.addTodos(['Active one', 'Done one']);
    await todoPage.completeTodo('Done one');
  });

  test('Active filter shows only incomplete todos', async ({ todoPage, todoAssert }) => {
    await todoPage.filterActive();
    await todoAssert.expectFilterSelected('Active');
    await todoAssert.expectVisibleTodos(['Active one']);
  });

  test('Completed filter shows only completed todos', async ({ todoPage, todoAssert }) => {
    await todoPage.filterCompleted();
    await todoAssert.expectFilterSelected('Completed');
    await todoAssert.expectVisibleTodos(['Done one']);
  });

  test('All filter shows every todo', async ({ todoPage, todoAssert }) => {
    await todoPage.filterCompleted();
    await todoPage.filterAll();
    await todoAssert.expectFilterSelected('All');
    await todoAssert.expectVisibleTodos(['Active one', 'Done one']);
  });

  test('clear completed removes finished todos', async ({ todoPage, todoAssert }) => {
    await todoPage.clearCompletedTodos();
    await todoAssert.expectVisibleTodos(['Active one']);
  });
});
