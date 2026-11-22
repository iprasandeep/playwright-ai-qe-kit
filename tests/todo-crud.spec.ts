import { test, expect } from '../src/fixtures/test-fixtures';

test.describe('Todo CRUD', () => {
  test('adds a single todo', async ({ todoPage, todoAssert }) => {
    await todoPage.addTodo('Buy milk');
    await todoAssert.expectVisibleTodos(['Buy milk']);
    await todoAssert.expectRemainingCount('1 item left');
  });

  test('adds multiple todos', async ({ todoPage, todoAssert }) => {
    await todoPage.addTodos(['Task A', 'Task B', 'Task C']);
    await todoAssert.expectVisibleTodos(['Task A', 'Task B', 'Task C']);
    await todoAssert.expectRemainingCount('3 items left');
  });

  test('completes and uncompletes a todo', async ({ todoPage, todoAssert }) => {
    await todoPage.addTodo('Ship feature');
    await todoPage.completeTodo('Ship feature');
    await todoAssert.expectTodoCompleted('Ship feature');

    await todoPage.uncompleteTodo('Ship feature');
    await todoAssert.expectTodoActive('Ship feature');
  });

  test('edits a todo', async ({ todoPage, todoAssert }) => {
    await todoPage.addTodo('Draft PR');
    await todoPage.editTodo('Draft PR', 'Merge PR');
    await todoAssert.expectVisibleTodos(['Merge PR']);
  });

  test('deletes a todo', async ({ todoPage, todoAssert }) => {
    await todoPage.addTodos(['Keep me', 'Remove me']);
    await todoPage.deleteTodo('Remove me');
    await todoAssert.expectVisibleTodos(['Keep me']);
  });
});
