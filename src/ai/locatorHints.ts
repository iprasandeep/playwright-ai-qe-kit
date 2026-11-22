/**
 * Lightweight "AI-assisted QE" helper — no API key required.
 * Given a goal description, suggests Playwright locator strategies.
 * Useful in interviews to show how you'd guide junior automation / codegen review.
 */
export function suggestLocators(goal: string): string[] {
  const g = goal.toLowerCase();
  const hints: string[] = [];

  if (g.includes('button') || g.includes('click') || g.includes('submit')) {
    hints.push(`page.getByRole('button', { name: '…' })`);
  }
  if (g.includes('link') || g.includes('navigate') || g.includes('filter')) {
    hints.push(`page.getByRole('link', { name: '…' })`);
  }
  if (g.includes('input') || g.includes('type') || g.includes('fill') || g.includes('textbox')) {
    hints.push(`page.getByRole('textbox', { name: '…' })`);
    hints.push(`page.getByPlaceholder('…')`);
    hints.push(`page.getByLabel('…')`);
  }
  if (g.includes('checkbox') || g.includes('complete') || g.includes('toggle')) {
    hints.push(`page.getByRole('checkbox', { name: '…' })`);
  }
  if (g.includes('testid') || g.includes('data-testid') || g.includes('stable')) {
    hints.push(`page.getByTestId('…')`);
  }

  hints.push('Prefer role/label/testid over CSS/XPath');
  hints.push('Avoid brittle nth-child and absolute XPath');

  return [...new Set(hints)];
}
