import { expect, type Page } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';

/**
 * Reusable validators — keep expect() out of thin tests where possible.
 */
export class TodoAssertions {
  constructor(private readonly todos: TodoPage, private readonly page: Page) {}

  async expectItemCount(count: number): Promise<void> {
    await expect(this.todos.todoItems).toHaveCount(count);
  }

  async expectVisibleTodos(texts: string[]): Promise<void> {
    await this.expectItemCount(texts.length);
    for (const text of texts) {
      await expect(this.todos.todoByText(text)).toBeVisible();
    }
  }

  async expectTodoCompleted(text: string): Promise<void> {
    await expect(this.todos.todoByText(text)).toHaveClass(/completed/);
  }

  async expectTodoActive(text: string): Promise<void> {
    await expect(this.todos.todoByText(text)).not.toHaveClass(/completed/);
  }

  async expectRemainingCount(label: string): Promise<void> {
    await expect(this.todos.todoCount).toHaveText(label);
  }

  async expectFilterSelected(name: 'All' | 'Active' | 'Completed'): Promise<void> {
    await expect(this.page.getByRole('link', { name })).toHaveClass(/selected/);
  }
}
