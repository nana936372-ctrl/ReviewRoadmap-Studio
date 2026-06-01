import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import { defineConfig, type Plugin } from 'vitest/config';
import { fetchAppStorePageReviewPayload, AppStorePageApiError } from './src/server/appStoreReviewsApi';
import { sendJson } from './src/server/http';
import { createSemanticAnalysisPayload, SemanticAnalysisApiError } from './src/server/semanticAnalysisApi';

function readJsonBody(request: any): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];

    request.on('data', (chunk: string | Uint8Array) => {
      chunks.push(typeof chunk === 'string' ? new TextEncoder().encode(chunk) : chunk);
    });
    request.on('end', () => {
      try {
        const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
        const body = new Uint8Array(totalLength);
        let offset = 0;

        for (const chunk of chunks) {
          body.set(chunk, offset);
          offset += chunk.length;
        }

        const text = new TextDecoder().decode(body);
        resolve(text ? JSON.parse(text) : {});
      } catch (error) {
        reject(error);
      }
    });
    request.on('error', reject);
  });
}

function appStoreReviewsApiPlugin(): Plugin {
  return {
    name: 'app-store-reviews-api',
    configureServer(server: any) {
      server.middlewares.use(async (request, response, next) => {
        const requestUrl = new URL(request.url ?? '/', 'http://localhost');

        if (requestUrl.pathname !== '/api/app-store-reviews') {
          next();
          return;
        }

        const appUrl = requestUrl.searchParams.get('appUrl');

        if (!appUrl) {
          response.statusCode = 400;
          response.setHeader('Content-Type', 'application/json');
          response.end(JSON.stringify({ error: 'Missing appUrl query parameter.' }));
          return;
        }

        try {
          sendJson(response, 200, await fetchAppStorePageReviewPayload(appUrl));
        } catch (error) {
          sendJson(response, error instanceof AppStorePageApiError ? error.statusCode : 502, {
            error: error instanceof Error ? error.message : 'Failed to read App Store page.'
          });
        }
      });
    }
  };
}

function semanticAnalysisApiPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'semantic-analysis-api',
    configureServer(server: any) {
      server.middlewares.use(async (request, response, next) => {
        const requestUrl = new URL(request.url ?? '/', 'http://localhost');

        if (requestUrl.pathname !== '/api/semantic-analysis') {
          next();
          return;
        }

        if (request.method !== 'POST') {
          sendJson(response, 405, { error: 'Use POST for semantic analysis.' });
          return;
        }

        try {
          const payload = (await readJsonBody(request)) as { reviews?: unknown; language?: unknown };
          sendJson(response, 200, await createSemanticAnalysisPayload(payload, env));
        } catch (error) {
          sendJson(response, error instanceof SemanticAnalysisApiError ? error.statusCode : 502, {
            error: error instanceof Error ? error.message : 'Semantic analysis failed.'
          });
        }
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react(), appStoreReviewsApiPlugin(), semanticAnalysisApiPlugin(env)] as unknown as Plugin[],
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './vitest.setup.ts',
      css: true
    }
  };
});
