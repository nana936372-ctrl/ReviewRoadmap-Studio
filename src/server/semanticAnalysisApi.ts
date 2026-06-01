import type { Language, RawReview } from '../domain/types';
import { SEMANTIC_ANALYSIS_SCHEMA } from '../lib/analysis/semantic';

const DEFAULT_OPENAI_MODEL = 'gpt-4.1-mini';
const DEFAULT_DEEPSEEK_MODEL = 'deepseek-chat';

interface LlmConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  provider: 'openai-responses' | 'chat-completions';
}

export class SemanticAnalysisApiError extends Error {
  constructor(
    message: string,
    readonly statusCode = 502
  ) {
    super(message);
    this.name = 'SemanticAnalysisApiError';
  }
}

function isRawReview(value: unknown): value is RawReview {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const review = value as RawReview;
  return (
    typeof review.id === 'string' &&
    (review.source === 'app-store-live' || review.source === 'app-store-sample') &&
    [1, 2, 3, 4, 5].includes(review.rating) &&
    typeof review.title === 'string' &&
    typeof review.body === 'string' &&
    typeof review.date === 'string' &&
    typeof review.appVersion === 'string'
  );
}

function isLanguage(value: unknown): value is Language {
  return value === 'en' || value === 'zh';
}

function buildSemanticPrompt(reviews: RawReview[], language: Language): string {
  const outputLanguage = language === 'zh' ? 'Chinese' : 'English';
  const compactReviews = reviews.map((review) => ({
    id: review.id,
    rating: review.rating,
    title: review.title,
    body: review.body,
    date: review.date,
    appVersion: review.appVersion
  }));

  return [
    `Analyze these App Store reviews for ReviewRoadmap Studio. Write all user-facing text in ${outputLanguage}.`,
    'Use semantic understanding, not keyword matching.',
    'Use only the provided review text and review IDs. Do not invent product facts, metrics, dates, user segments, or evidence.',
    'Every cluster must cite the reviewIds that directly support it.',
    'Only label a review as bug when it explicitly describes malfunction, failure, data loss, blocked usage, incorrect state, crash, or severe reliability issue.',
    'Positive learning-method phrases, conceptual negation, and neutral words such as "card" must not become bug evidence unless the review explicitly says the product failed.',
    'If the evidence is mostly positive, roadmap decisions should preserve or amplify verified value instead of manufacturing trust or quality problems.',
    'Do not output numeric scores, percentages, confidence values, or priority scores. The application recalculates all numbers with deterministic formulas.',
    'Return exactly three roadmapCards with types fix, improve, and explore. The fix card may be a review/guardrail decision when there is no explicit defect evidence.',
    JSON.stringify({ reviews: compactReviews }, null, 2)
  ].join('\n\n');
}

function extractResponseText(payload: any): string {
  if (typeof payload?.output_text === 'string') {
    return payload.output_text;
  }

  const output = Array.isArray(payload?.output) ? payload.output : [];

  for (const item of output) {
    const content = Array.isArray(item?.content) ? item.content : [];

    for (const part of content) {
      if (typeof part?.text === 'string') {
        return part.text;
      }
    }
  }

  return '';
}

function extractChatText(payload: any): string {
  return typeof payload?.choices?.[0]?.message?.content === 'string' ? payload.choices[0].message.content : '';
}

function parseJsonText(text: string): unknown {
  const trimmed = text.trim();

  if (trimmed.startsWith('{')) {
    return JSON.parse(trimmed);
  }

  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');

  if (start >= 0 && end > start) {
    return JSON.parse(trimmed.slice(start, end + 1));
  }

  throw new Error('LLM response did not contain JSON.');
}

function resolveLlmConfig(env: Record<string, string | undefined>): LlmConfig | null {
  if (env.OPENAI_API_KEY) {
    return {
      apiKey: env.OPENAI_API_KEY,
      baseUrl: (env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, ''),
      model: env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL,
      provider: 'openai-responses'
    };
  }

  if (env.DEEPSEEK_API_KEY) {
    return {
      apiKey: env.DEEPSEEK_API_KEY,
      baseUrl: (env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com').replace(/\/$/, ''),
      model: env.DEEPSEEK_MODEL || DEFAULT_DEEPSEEK_MODEL,
      provider: 'chat-completions'
    };
  }

  return null;
}

export async function createSemanticAnalysisPayload(
  payload: { reviews?: unknown; language?: unknown },
  env: Record<string, string | undefined>
) {
  const llmConfig = resolveLlmConfig(env);

  if (!llmConfig) {
    throw new SemanticAnalysisApiError(
      'Missing LLM API key. Add OPENAI_API_KEY or DEEPSEEK_API_KEY to .env.local.',
      503
    );
  }

  const reviews = Array.isArray(payload.reviews) ? payload.reviews.filter(isRawReview) : [];
  const language = isLanguage(payload.language) ? payload.language : 'en';

  if (reviews.length === 0) {
    throw new SemanticAnalysisApiError('No review records supplied for semantic analysis.', 400);
  }

  const systemText =
    'You are a careful product analyst. Produce evidence-bound semantic analysis for App Store reviews. Never over-infer beyond cited review text.';
  const userText = buildSemanticPrompt(reviews, language);
  const llmResponse =
    llmConfig.provider === 'openai-responses'
      ? await fetch(`${llmConfig.baseUrl}/responses`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${llmConfig.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: llmConfig.model,
            input: [
              {
                role: 'system',
                content: [{ type: 'input_text', text: systemText }]
              },
              {
                role: 'user',
                content: [{ type: 'input_text', text: userText }]
              }
            ],
            text: {
              format: {
                type: 'json_schema',
                name: 'reviewroadmap_semantic_analysis',
                strict: true,
                schema: SEMANTIC_ANALYSIS_SCHEMA
              }
            }
          })
        })
      : await fetch(`${llmConfig.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${llmConfig.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: llmConfig.model,
            messages: [
              { role: 'system', content: systemText },
              {
                role: 'user',
                content: `${userText}\n\nReturn a JSON object that matches this JSON Schema exactly:\n${JSON.stringify(
                  SEMANTIC_ANALYSIS_SCHEMA
                )}`
              }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.2
          })
        });

  const llmPayload = await llmResponse.json();

  if (!llmResponse.ok) {
    throw new SemanticAnalysisApiError(
      typeof llmPayload?.error?.message === 'string'
        ? llmPayload.error.message
        : `LLM provider returned ${llmResponse.status}.`
    );
  }

  const text =
    llmConfig.provider === 'openai-responses' ? extractResponseText(llmPayload) : extractChatText(llmPayload);

  if (!text) {
    throw new SemanticAnalysisApiError('LLM response did not include JSON text.');
  }

  return { semanticAnalysis: parseJsonText(text) };
}
