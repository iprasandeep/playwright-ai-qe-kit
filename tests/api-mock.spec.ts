import { test, expect } from '../src/fixtures/test-fixtures';

/**
 * Demonstrates page.route API stubbing — useful when UI depends on backend JSON.
 * TodoMVC is localStorage-based, so we stub a fake /api/todos and seed the UI from it.
 */
test.describe('API mock (page.route)', () => {
  test('stubs /api/todos and seeds UI from mocked response', {
    tag: '@smoke',
  }, async ({ page, todoPage, todoAssert }) => {
    const mockedTodos = [
      { id: 1, title: 'From mock API', completed: false },
      { id: 2, title: 'Also mocked', completed: true },
    ];

    let apiHits = 0;
    await page.route('**/api/todos', async (route) => {
      apiHits += 1;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockedTodos),
      });
    });

    // Fixture already opened TodoMVC; route is registered before this fetch.
    const payload = await page.evaluate(async () => {
      const res = await fetch('/api/todos');
      if (!res.ok) throw new Error(`API status ${res.status}`);
      return res.json() as Promise<Array<{ title: string; completed: boolean }>>;
    });

    expect(apiHits).toBe(1);
    expect(payload).toEqual(mockedTodos);

    await todoPage.addTodos(payload.map((item) => item.title));
    await todoPage.completeTodo('Also mocked');

    await todoAssert.expectVisibleTodos(['From mock API', 'Also mocked']);
    await todoAssert.expectTodoCompleted('Also mocked');
    await todoAssert.expectTodoActive('From mock API');
  });
});
