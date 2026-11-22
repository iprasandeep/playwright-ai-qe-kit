import * as fs from 'fs';
import * as path from 'path';

export type FailureContext = {
  testTitle: string;
  errorMessage: string;
  filePath?: string;
};

/**
 * Rule-based failure summarizer (always available).
 * If OPENAI_API_KEY is set, optionally enrich via OpenAI — skipped when unset so CI stays free.
 */
export async function summarizeFailure(ctx: FailureContext): Promise<string> {
  const heuristic = buildHeuristicSummary(ctx);

  if (!process.env.OPENAI_API_KEY) {
    return heuristic;
  }

  try {
    const enriched = await callOpenAiSummary(ctx, heuristic);
    return enriched || heuristic;
  } catch {
    return heuristic;
  }
}

export function writeFailureNote(outputDir: string, ctx: FailureContext, summary: string): string {
  fs.mkdirSync(outputDir, { recursive: true });
  const safe = ctx.testTitle.replace(/[^\w.-]+/g, '_').slice(0, 80);
  const file = path.join(outputDir, `${safe}-ai-note.md`);
  const body = [
    `# AI failure note`,
    ``,
    `**Test:** ${ctx.testTitle}`,
    ``,
    `## Summary`,
    summary,
    ``,
    `## Raw error`,
    '```',
    ctx.errorMessage,
    '```',
    ``,
  ].join('\n');
  fs.writeFileSync(file, body, 'utf8');
  return file;
}

function buildHeuristicSummary(ctx: FailureContext): string {
  const msg = ctx.errorMessage.toLowerCase();
  const tips: string[] = [];

  if (msg.includes('timeout') || msg.includes('exceeded')) {
    tips.push('Element may not have appeared in time — check locator, visibility, or network.');
  }
  if (msg.includes('strict mode violation')) {
    tips.push('Locator matched multiple elements — narrow with filter(), getByRole name, or test id.');
  }
  if (msg.includes('not visible') || msg.includes('hidden')) {
    tips.push('Target may be covered/hidden — scroll into view or wait for UI state.');
  }
  if (msg.includes('intercepts pointer') || msg.includes('not receiving')) {
    tips.push('Another element is intercepting clicks — close overlays or wait for animation.');
  }
  if (msg.includes('tohavecount') || msg.includes('to have count')) {
    tips.push('List length mismatch — verify add/delete/filter side effects.');
  }
  if (msg.includes('tohavetext') || msg.includes('to have text')) {
    tips.push('Text assertion failed — check trim/whitespace or async content update.');
  }
  if (tips.length === 0) {
    tips.push('Review trace/screenshot; confirm locator strategy and expected app state.');
  }

  tips.push('Open HTML report + trace: npx playwright show-report');
  return tips.map((t, i) => `${i + 1}. ${t}`).join('\n');
}

async function callOpenAiSummary(ctx: FailureContext, heuristic: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content:
            'You are a senior SDET. Summarize a Playwright failure in 3-5 short bullet points: likely cause + next debug step. No fluff.',
        },
        {
          role: 'user',
          content: `Test: ${ctx.testTitle}\nError:\n${ctx.errorMessage}\nHeuristic hints:\n${heuristic}`,
        },
      ],
    }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content?.trim() || null;
}
