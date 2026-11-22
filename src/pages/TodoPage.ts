import { type Locator, type Page } from '@playwright/test';

/**
 * Page Object for TodoMVC — locators + user actions only.
 */
export class TodoPage {
  readonly page: Page;
  readonly newTodo: Locator;
  readonly todoItems: Locator;
  readonly todoCount: Locator;
  readonly clearCompleted: Locator;
  readonly toggleAll: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newTodo = page.getByPlaceholder('What needs to be done?');
    this.todoItems = page.getByTestId('todo-item');
    this.todoCount = page.getByTestId('todo-count');
    this.clearCompleted = page.getByRole('button', { name: 'Clear completed' });
    this.toggleAll = page.getByLabel('Mark all as complete');
  }

  async open(): Promise<void> {
    // Relative to baseURL path (/todomvc) — '/' would jump to site root and 404.
    await this.page.goto('./');
  }

  async addTodo(text: string): Promise<void> {
    await this.newTodo.fill(text);
    await this.newTodo.press('Enter');
  }

  async addTodos(texts: string[]): Promise<void> {
    for (const text of texts) {
      await this.addTodo(text);
    }
  }

  todoByText(text: string): Locator {
    return this.todoItems.filter({ hasText: text });
  }

  async completeTodo(text: string): Promise<void> {
    await this.todoByText(text).getByRole('checkbox').check();
  }

  async uncompleteTodo(text: string): Promise<void> {
    await this.todoByText(text).getByRole('checkbox').uncheck();
  }

  async editTodo(oldText: string, newText: string): Promise<void> {
    const item = this.todoByText(oldText);
    await item.dblclick();
    const edit = item.getByRole('textbox');
    await edit.fill(newText);
    await edit.press('Enter');
  }

  async deleteTodo(text: string): Promise<void> {
    const item = this.todoByText(text);
    await item.hover();
    await item.getByRole('button', { name: 'Delete' }).click();
  }

  async filterAll(): Promise<void> {
    await this.page.getByRole('link', { name: 'All' }).click();
  }

  async filterActive(): Promise<void> {
    await this.page.getByRole('link', { name: 'Active' }).click();
  }

  async filterCompleted(): Promise<void> {
    await this.page.getByRole('link', { name: 'Completed' }).click();
  }

  async clearCompletedTodos(): Promise<void> {
    await this.clearCompleted.click();
  }
}
