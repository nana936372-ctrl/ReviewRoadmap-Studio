import { createSemanticAnalysisPayload, SemanticAnalysisApiError } from '../src/server/semanticAnalysisApi.js';
import { sendJson } from '../src/server/http.js';

declare const process: { env: Record<string, string | undefined> };

function parseRequestBody(request: any): { reviews?: unknown; language?: unknown } {
  if (!request.body) {
    return {};
  }

  if (typeof request.body === 'string') {
    return JSON.parse(request.body);
  }

  if (typeof request.body === 'object') {
    return request.body;
  }

  return {};
}

export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    sendJson(response, 405, { error: 'Use POST for semantic analysis.' });
    return;
  }

  try {
    sendJson(response, 200, await createSemanticAnalysisPayload(parseRequestBody(request), process.env));
  } catch (error) {
    sendJson(response, error instanceof SemanticAnalysisApiError ? error.statusCode : 502, {
      error: error instanceof Error ? error.message : 'Semantic analysis failed.'
    });
  }
}
