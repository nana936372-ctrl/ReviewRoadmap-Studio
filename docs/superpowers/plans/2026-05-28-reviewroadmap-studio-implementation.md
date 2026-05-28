# ReviewRoadmap Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished Vite React prototype that turns sample iOS App Store-style reviews into insight clusters, evidence-backed roadmap cards, and a one-page decision brief.

**Architecture:** The first version is a client-side web app with local sample data and a deterministic analysis pipeline that mirrors the intended AI workflow. Domain logic lives in pure TypeScript functions with tests; React components consume a typed `AnalysisResult` and focus on presentation.

**Tech Stack:** Vite, React, TypeScript, Tailwind-free CSS, Vitest, React Testing Library, jsdom, lucide-react.

---

## File Structure

- `package.json`: npm scripts and dependencies.
- `index.html`: Vite HTML entry.
- `tsconfig.json`, `tsconfig.node.json`: TypeScript configuration.
- `vite.config.ts`: Vite and Vitest configuration.
- `vitest.setup.ts`: Testing Library setup.
- `.gitignore`: Ignore generated and local files, including `.superpowers/`.
- `src/main.tsx`: React entry point.
- `src/App.tsx`: Main application composition and demo state.
- `src/styles.css`: Full visual system and responsive layout.
- `src/domain/types.ts`: Shared review, cluster, roadmap, and analysis types.
- `src/data/sampleReviews.ts`: Review-shaped sample dataset for a fictional AI writing app.
- `src/lib/analysis/normalize.ts`: Review cleanup and validation.
- `src/lib/analysis/classify.ts`: Signal labels, sentiment, urgency, and quote extraction.
- `src/lib/analysis/cluster.ts`: Insight cluster construction and summary metrics.
- `src/lib/analysis/roadmap.ts`: Roadmap card generation and scoring.
- `src/lib/analysis/pipeline.ts`: End-to-end analysis orchestration.
- `src/lib/analysis/promptSpec.ts`: Human-readable staged AI workflow used by the portfolio page.
- `src/components/InputPanel.tsx`: App Store URL/sample input panel.
- `src/components/InsightDashboard.tsx`: Summary metrics, theme distribution, and evidence table.
- `src/components/RoadmapCards.tsx`: Fix, Improve, Explore roadmap cards.
- `src/components/DecisionBrief.tsx`: One-page PM brief.
- `src/components/AiWorkflow.tsx`: Explains the staged AI workflow.
- `src/test/render.tsx`: Test helper for React components.
- `src/**/*.test.ts`, `src/**/*.test.tsx`: Focused unit and component tests.
- `README.md`: Portfolio-oriented project description and local run instructions.

## Task 1: Scaffold the React App and Test Harness

**Files:**
- Create: `.gitignore`
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `vitest.setup.ts`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`
- Create: `src/test/render.tsx`
- Create: `src/App.test.tsx`

- [ ] **Step 1: Initialize git repository**

Run:

```powershell
git init
```

Expected: command exits with code 0 and creates `.git/`.

- [ ] **Step 2: Create project configuration files**

Add `.gitignore`:

```gitignore
node_modules/
dist/
coverage/
.env
.env.local
.DS_Store
.superpowers/
```

Add `package.json`:

```json
{
  "name": "reviewroadmap-studio",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "test": "vitest run",
    "test:watch": "vitest",
    "preview": "vite preview"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "lucide-react": "^0.511.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "jsdom": "^25.0.1",
    "typescript": "^5.7.2",
    "vite": "^6.0.0",
    "vitest": "^2.1.8"
  }
}
```

Add `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ReviewRoadmap Studio</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Add `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Add `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

Add `vite.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    css: true
  }
});
```

Add `vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 3: Create the minimal app shell**

Add `src/main.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

Add `src/App.tsx`:

```tsx
export default function App() {
  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">AI product decision assistant</p>
        <h1>ReviewRoadmap Studio</h1>
        <p className="hero-copy">
          Turn App Store reviews into evidence-backed roadmap decisions.
        </p>
      </section>
    </main>
  );
}
```

Add `src/styles.css`:

```css
:root {
  color: #16201b;
  background: #f6f4ef;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background:
    linear-gradient(180deg, rgba(246, 244, 239, 0.92), rgba(236, 241, 236, 0.95)),
    #f6f4ef;
}

button,
input,
select {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
  padding: 32px;
}

.hero-panel {
  max-width: 960px;
  margin: 0 auto;
  padding: 48px;
  border: 1px solid #d8ded6;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.78);
}

.eyebrow {
  margin: 0 0 12px;
  color: #4b675b;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: clamp(2.4rem, 7vw, 5.8rem);
  line-height: 0.95;
  letter-spacing: 0;
}

.hero-copy {
  max-width: 680px;
  margin: 20px 0 0;
  color: #4f5d55;
  font-size: 1.15rem;
  line-height: 1.6;
}
```

- [ ] **Step 4: Add a render helper and smoke test**

Add `src/test/render.tsx`:

```tsx
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';

export function renderApp(ui: ReactElement) {
  return render(ui);
}
```

Add `src/App.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import App from './App';
import { renderApp } from './test/render';

describe('App', () => {
  it('renders the product name and value proposition', () => {
    renderApp(<App />);

    expect(screen.getByRole('heading', { name: /ReviewRoadmap Studio/i })).toBeInTheDocument();
    expect(screen.getByText(/evidence-backed roadmap decisions/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 5: Install dependencies**

Run:

```powershell
npm install
```

Expected: command exits with code 0 and creates `package-lock.json`.

- [ ] **Step 6: Run the first test**

Run:

```powershell
npm test
```

Expected: PASS with `src/App.test.tsx`.

- [ ] **Step 7: Commit scaffold**

Run:

```powershell
git add .gitignore package.json package-lock.json index.html tsconfig.json tsconfig.node.json vite.config.ts vitest.setup.ts src
git commit -m "chore: scaffold reviewroadmap app"
```

Expected: commit succeeds.

## Task 2: Add Domain Types and Sample Review Data

**Files:**
- Create: `src/domain/types.ts`
- Create: `src/data/sampleReviews.ts`
- Create: `src/data/sampleReviews.test.ts`

- [ ] **Step 1: Write a failing sample data test**

Add `src/data/sampleReviews.test.ts`:

```ts
import { sampleReviews } from './sampleReviews';

describe('sampleReviews', () => {
  it('contains enough review variety for the portfolio demo', () => {
    expect(sampleReviews).toHaveLength(18);
    expect(new Set(sampleReviews.map((review) => review.rating)).size).toBeGreaterThanOrEqual(4);
    expect(sampleReviews.every((review) => review.body.length > 40)).toBe(true);
  });

  it('keeps stable ids for evidence citations', () => {
    const ids = sampleReviews.map((review) => review.id);
    expect(new Set(ids).size).toBe(sampleReviews.length);
    expect(ids.every((id) => id.startsWith('draftly-'))).toBe(true);
  });
});
```

- [ ] **Step 2: Run the failing sample data test**

Run:

```powershell
npm test -- src/data/sampleReviews.test.ts
```

Expected: FAIL because `src/data/sampleReviews.ts` does not exist.

- [ ] **Step 3: Add shared domain types**

Add `src/domain/types.ts`:

```ts
export type SignalLabel =
  | 'bug'
  | 'feature_request'
  | 'onboarding_friction'
  | 'pricing_friction'
  | 'retention_risk'
  | 'delight';

export type Sentiment = 'negative' | 'mixed' | 'positive';

export type Urgency = 'low' | 'medium' | 'high';

export type RoadmapType = 'fix' | 'improve' | 'explore';

export interface RawReview {
  id: string;
  source: 'app-store-sample';
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  date: string;
  appVersion: string;
}

export interface Review extends RawReview {
  normalizedText: string;
}

export interface ReviewSignal {
  reviewId: string;
  labels: SignalLabel[];
  sentiment: Sentiment;
  urgency: Urgency;
  quote: string;
}

export interface InsightCluster {
  id: string;
  name: string;
  description: string;
  labels: SignalLabel[];
  reviewCount: number;
  averageRating: number;
  representativeQuotes: string[];
  confidence: number;
  suspectedUserScenario: string;
}

export interface RoadmapCard {
  id: string;
  type: RoadmapType;
  title: string;
  recommendation: string;
  priorityScore: number;
  scoringFactors: {
    frequency: number;
    severity: number;
    businessImpact: number;
    confidence: number;
    effort: number;
  };
  evidenceQuotes: string[];
  targetMetric: string;
  validationExperiment: string;
  risks: string;
  confidence: number;
}

export interface AnalysisResult {
  reviews: Review[];
  signals: ReviewSignal[];
  clusters: InsightCluster[];
  roadmapCards: RoadmapCard[];
  generatedAt: string;
}
```

- [ ] **Step 4: Add the sample dataset**

Add `src/data/sampleReviews.ts`:

```ts
import type { RawReview } from '../domain/types';

export const sampleReviews: RawReview[] = [
  {
    id: 'draftly-001',
    source: 'app-store-sample',
    rating: 5,
    title: 'Finally finished my weekly newsletter',
    body: 'The outline suggestions saved me hours. I pasted rough notes and Draftly turned them into a clean newsletter structure without making the tone sound fake.',
    date: '2026-05-03',
    appVersion: '2.4.1'
  },
  {
    id: 'draftly-002',
    source: 'app-store-sample',
    rating: 2,
    title: 'Crashes during long drafts',
    body: 'I like the writing quality, but the app froze twice when my draft got long. I lost the last paragraph both times and now I am nervous using it for client work.',
    date: '2026-05-04',
    appVersion: '2.4.1'
  },
  {
    id: 'draftly-003',
    source: 'app-store-sample',
    rating: 3,
    title: 'Good output, confusing start',
    body: 'The results are useful once I find the right template, but the first screen gives me too many choices. I did not know whether to pick rewrite, brainstorm, or polish.',
    date: '2026-05-05',
    appVersion: '2.4.1'
  },
  {
    id: 'draftly-004',
    source: 'app-store-sample',
    rating: 1,
    title: 'Subscription wall too early',
    body: 'I hit the paywall before I understood what the app could do. The trial felt too short and I could not test exporting before being asked to subscribe.',
    date: '2026-05-06',
    appVersion: '2.4.1'
  },
  {
    id: 'draftly-005',
    source: 'app-store-sample',
    rating: 4,
    title: 'Please add Notion export',
    body: 'This is close to replacing my current workflow. I would use it every day if I could export directly to Notion or at least keep headings and checklists intact.',
    date: '2026-05-07',
    appVersion: '2.4.2'
  },
  {
    id: 'draftly-006',
    source: 'app-store-sample',
    rating: 2,
    title: 'Lost work after login expired',
    body: 'The app asked me to log in again after I had been writing for twenty minutes. When I returned, the draft was gone. Auto-save needs to be much more reliable.',
    date: '2026-05-08',
    appVersion: '2.4.2'
  },
  {
    id: 'draftly-007',
    source: 'app-store-sample',
    rating: 5,
    title: 'Best tone controls I have tried',
    body: 'The tone slider is excellent. I can make a post sound more direct without losing my voice, which is exactly what most AI writing tools get wrong.',
    date: '2026-05-09',
    appVersion: '2.4.2'
  },
  {
    id: 'draftly-008',
    source: 'app-store-sample',
    rating: 3,
    title: 'Needs reusable brand voice',
    body: 'I wish I could save my brand voice once and reuse it across drafts. Right now I keep pasting the same instructions every time I start a new piece.',
    date: '2026-05-10',
    appVersion: '2.4.2'
  },
  {
    id: 'draftly-009',
    source: 'app-store-sample',
    rating: 2,
    title: 'Offline mode would help',
    body: 'I often write on the train. The app becomes useless without a stable connection, even when I only want to edit text that already exists.',
    date: '2026-05-11',
    appVersion: '2.4.2'
  },
  {
    id: 'draftly-010',
    source: 'app-store-sample',
    rating: 1,
    title: 'Cancelled after export failed',
    body: 'Export to PDF failed three times and support did not answer before my renewal. I cancelled because I cannot trust it for paid client deliverables.',
    date: '2026-05-12',
    appVersion: '2.4.3'
  },
  {
    id: 'draftly-011',
    source: 'app-store-sample',
    rating: 4,
    title: 'Great for social posts',
    body: 'The app is very good at turning messy ideas into LinkedIn posts. I would love a calendar view so I can plan a week of drafts in one place.',
    date: '2026-05-13',
    appVersion: '2.4.3'
  },
  {
    id: 'draftly-012',
    source: 'app-store-sample',
    rating: 3,
    title: 'Pricing is hard to compare',
    body: 'The monthly plan seems expensive compared with other AI tools. I might pay if the app explained what usage limits and export options are included.',
    date: '2026-05-14',
    appVersion: '2.4.3'
  },
  {
    id: 'draftly-013',
    source: 'app-store-sample',
    rating: 2,
    title: 'Templates feel buried',
    body: 'There are useful templates, but they are hidden behind categories I do not understand. A guided setup would help me get to the right writing mode faster.',
    date: '2026-05-15',
    appVersion: '2.4.3'
  },
  {
    id: 'draftly-014',
    source: 'app-store-sample',
    rating: 5,
    title: 'Helped me ship more often',
    body: 'I went from posting once a month to twice a week. The rewrite suggestions are practical and the app keeps enough of my original phrasing.',
    date: '2026-05-16',
    appVersion: '2.4.3'
  },
  {
    id: 'draftly-015',
    source: 'app-store-sample',
    rating: 1,
    title: 'Sync bug between iPad and iPhone',
    body: 'Drafts created on my iPad do not always show up on my iPhone. I tried refreshing and logging out, but the sync problem keeps coming back.',
    date: '2026-05-17',
    appVersion: '2.4.4'
  },
  {
    id: 'draftly-016',
    source: 'app-store-sample',
    rating: 4,
    title: 'Need team review comments',
    body: 'For a solo creator this is strong. For my small agency, I need comments or approval notes before sending copy to clients.',
    date: '2026-05-18',
    appVersion: '2.4.4'
  },
  {
    id: 'draftly-017',
    source: 'app-store-sample',
    rating: 2,
    title: 'I stopped using it after week one',
    body: 'The first drafts were impressive, but I did not know what to do next. The app needs better prompts or examples for recurring writing workflows.',
    date: '2026-05-19',
    appVersion: '2.4.4'
  },
  {
    id: 'draftly-018',
    source: 'app-store-sample',
    rating: 5,
    title: 'Cleanest AI writing app UI',
    body: 'The interface is calmer than most AI apps. I can focus on the draft instead of fighting a chat window, and the suggestions are easy to scan.',
    date: '2026-05-20',
    appVersion: '2.4.4'
  }
];
```

- [ ] **Step 5: Run the sample data test**

Run:

```powershell
npm test -- src/data/sampleReviews.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit domain types and sample data**

Run:

```powershell
git add src/domain/types.ts src/data/sampleReviews.ts src/data/sampleReviews.test.ts
git commit -m "feat: add review domain model and sample data"
```

Expected: commit succeeds.

## Task 3: Build Review Normalization and Classification

**Files:**
- Create: `src/lib/analysis/normalize.ts`
- Create: `src/lib/analysis/classify.ts`
- Create: `src/lib/analysis/normalize.test.ts`
- Create: `src/lib/analysis/classify.test.ts`

- [ ] **Step 1: Write failing normalization tests**

Add `src/lib/analysis/normalize.test.ts`:

```ts
import { normalizeReviews, normalizeText } from './normalize';
import type { RawReview } from '../../domain/types';

describe('normalizeText', () => {
  it('trims and collapses whitespace', () => {
    expect(normalizeText('  Lost   work\nagain  ')).toBe('Lost work again');
  });
});

describe('normalizeReviews', () => {
  it('drops empty reviews and keeps citation fields', () => {
    const raw: RawReview[] = [
      {
        id: 'r1',
        source: 'app-store-sample',
        rating: 1,
        title: 'Crash',
        body: '   The app crashed during export.   ',
        date: '2026-05-01',
        appVersion: '1.0.0'
      },
      {
        id: 'r2',
        source: 'app-store-sample',
        rating: 5,
        title: '',
        body: '    ',
        date: '2026-05-02',
        appVersion: '1.0.0'
      }
    ];

    expect(normalizeReviews(raw)).toEqual([
      {
        ...raw[0],
        title: 'Crash',
        body: 'The app crashed during export.',
        normalizedText: 'Crash The app crashed during export.'
      }
    ]);
  });
});
```

- [ ] **Step 2: Run normalization tests and verify failure**

Run:

```powershell
npm test -- src/lib/analysis/normalize.test.ts
```

Expected: FAIL because `normalize.ts` does not exist.

- [ ] **Step 3: Implement normalization**

Add `src/lib/analysis/normalize.ts`:

```ts
import type { RawReview, Review } from '../../domain/types';

export function normalizeText(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

export function normalizeReviews(rawReviews: RawReview[]): Review[] {
  return rawReviews
    .map((review) => {
      const title = normalizeText(review.title);
      const body = normalizeText(review.body);
      const normalizedText = normalizeText(`${title} ${body}`);

      return {
        ...review,
        title,
        body,
        normalizedText
      };
    })
    .filter((review) => review.normalizedText.length > 0);
}
```

- [ ] **Step 4: Run normalization tests and verify pass**

Run:

```powershell
npm test -- src/lib/analysis/normalize.test.ts
```

Expected: PASS.

- [ ] **Step 5: Write failing classification tests**

Add `src/lib/analysis/classify.test.ts`:

```ts
import type { Review } from '../../domain/types';
import { classifyReview, extractQuote } from './classify';

const baseReview: Review = {
  id: 'r1',
  source: 'app-store-sample',
  rating: 2,
  title: 'Lost work',
  body: 'The app froze and I lost a paragraph during export.',
  date: '2026-05-01',
  appVersion: '1.0.0',
  normalizedText: 'Lost work The app froze and I lost a paragraph during export.'
};

describe('extractQuote', () => {
  it('returns a compact quote with the review title', () => {
    expect(extractQuote(baseReview)).toBe('Lost work: The app froze and I lost a paragraph during export.');
  });
});

describe('classifyReview', () => {
  it('labels crash and lost work reviews as urgent bugs', () => {
    expect(classifyReview(baseReview)).toMatchObject({
      reviewId: 'r1',
      labels: ['bug', 'retention_risk'],
      sentiment: 'negative',
      urgency: 'high'
    });
  });

  it('labels paywall complaints as pricing friction', () => {
    const signal = classifyReview({
      ...baseReview,
      id: 'r2',
      rating: 1,
      normalizedText: 'Subscription wall too early The paywall appeared before I could try export.'
    });

    expect(signal.labels).toContain('pricing_friction');
    expect(signal.urgency).toBe('high');
  });

  it('labels praise as delight', () => {
    const signal = classifyReview({
      ...baseReview,
      id: 'r3',
      rating: 5,
      normalizedText: 'Best tone controls I love the clean interface and useful suggestions.'
    });

    expect(signal.labels).toEqual(['delight']);
    expect(signal.sentiment).toBe('positive');
  });
});
```

- [ ] **Step 6: Run classification tests and verify failure**

Run:

```powershell
npm test -- src/lib/analysis/classify.test.ts
```

Expected: FAIL because `classify.ts` does not exist.

- [ ] **Step 7: Implement classification**

Add `src/lib/analysis/classify.ts`:

```ts
import type { Review, ReviewSignal, Sentiment, SignalLabel, Urgency } from '../../domain/types';

const LABEL_RULES: Record<SignalLabel, RegExp[]> = {
  bug: [/crash/i, /froze/i, /frozen/i, /lost/i, /bug/i, /failed/i, /sync/i, /login/i],
  feature_request: [/please add/i, /wish/i, /would love/i, /need/i, /export/i, /calendar/i, /comments/i, /offline/i],
  onboarding_friction: [/confusing/i, /did not know/i, /too many choices/i, /guided/i, /setup/i, /examples/i, /templates feel buried/i],
  pricing_friction: [/paywall/i, /subscription/i, /expensive/i, /trial/i, /pricing/i, /monthly plan/i],
  retention_risk: [/cancelled/i, /stopped using/i, /uninstall/i, /switch/i, /cannot trust/i, /nervous using/i],
  delight: [/love/i, /saved me/i, /excellent/i, /best/i, /great/i, /helped me/i, /cleanest/i, /useful/i]
};

export function extractQuote(review: Review): string {
  const body = review.body.length > 140 ? `${review.body.slice(0, 137)}...` : review.body;
  return `${review.title}: ${body}`;
}

function getSentiment(rating: Review['rating']): Sentiment {
  if (rating <= 2) return 'negative';
  if (rating === 3) return 'mixed';
  return 'positive';
}

function hasMatch(text: string, label: SignalLabel): boolean {
  return LABEL_RULES[label].some((pattern) => pattern.test(text));
}

function getLabels(review: Review): SignalLabel[] {
  const text = review.normalizedText;
  const labels = (Object.keys(LABEL_RULES) as SignalLabel[]).filter((label) => hasMatch(text, label));

  if (labels.length === 0 && review.rating <= 2) return ['retention_risk'];
  if (labels.length === 0 && review.rating >= 4) return ['delight'];
  if (labels.length === 0) return ['feature_request'];

  return labels;
}

function getUrgency(review: Review, labels: SignalLabel[]): Urgency {
  if (review.rating <= 2 && (labels.includes('bug') || labels.includes('retention_risk') || labels.includes('pricing_friction'))) {
    return 'high';
  }

  if (review.rating === 3 || labels.includes('feature_request') || labels.includes('onboarding_friction')) {
    return 'medium';
  }

  return 'low';
}

export function classifyReview(review: Review): ReviewSignal {
  const labels = getLabels(review);

  return {
    reviewId: review.id,
    labels,
    sentiment: getSentiment(review.rating),
    urgency: getUrgency(review, labels),
    quote: extractQuote(review)
  };
}

export function classifyReviews(reviews: Review[]): ReviewSignal[] {
  return reviews.map(classifyReview);
}
```

- [ ] **Step 8: Run all analysis tests**

Run:

```powershell
npm test -- src/lib/analysis
```

Expected: PASS for normalization and classification tests.

- [ ] **Step 9: Commit normalization and classification**

Run:

```powershell
git add src/lib/analysis/normalize.ts src/lib/analysis/classify.ts src/lib/analysis/normalize.test.ts src/lib/analysis/classify.test.ts
git commit -m "feat: classify review signals"
```

Expected: commit succeeds.

## Task 4: Build Insight Clusters and Roadmap Cards

**Files:**
- Create: `src/lib/analysis/cluster.ts`
- Create: `src/lib/analysis/roadmap.ts`
- Create: `src/lib/analysis/cluster.test.ts`
- Create: `src/lib/analysis/roadmap.test.ts`

- [ ] **Step 1: Write failing cluster tests**

Add `src/lib/analysis/cluster.test.ts`:

```ts
import type { Review, ReviewSignal } from '../../domain/types';
import { buildInsightClusters } from './cluster';

const reviews: Review[] = [
  {
    id: 'r1',
    source: 'app-store-sample',
    rating: 1,
    title: 'Crash',
    body: 'The app crashed during export.',
    date: '2026-05-01',
    appVersion: '1.0.0',
    normalizedText: 'Crash The app crashed during export.'
  },
  {
    id: 'r2',
    source: 'app-store-sample',
    rating: 5,
    title: 'Love it',
    body: 'The clean interface helped me write faster.',
    date: '2026-05-02',
    appVersion: '1.0.0',
    normalizedText: 'Love it The clean interface helped me write faster.'
  }
];

const signals: ReviewSignal[] = [
  {
    reviewId: 'r1',
    labels: ['bug', 'retention_risk'],
    sentiment: 'negative',
    urgency: 'high',
    quote: 'Crash: The app crashed during export.'
  },
  {
    reviewId: 'r2',
    labels: ['delight'],
    sentiment: 'positive',
    urgency: 'low',
    quote: 'Love it: The clean interface helped me write faster.'
  }
];

describe('buildInsightClusters', () => {
  it('groups reviews by primary product signal', () => {
    const clusters = buildInsightClusters(reviews, signals);

    expect(clusters.map((cluster) => cluster.id)).toEqual(['bug', 'delight']);
    expect(clusters[0]).toMatchObject({
      name: 'Reliability and data-loss issues',
      reviewCount: 1,
      averageRating: 1,
      confidence: 0.72
    });
    expect(clusters[0].representativeQuotes).toEqual(['Crash: The app crashed during export.']);
  });
});
```

- [ ] **Step 2: Run cluster tests and verify failure**

Run:

```powershell
npm test -- src/lib/analysis/cluster.test.ts
```

Expected: FAIL because `cluster.ts` does not exist.

- [ ] **Step 3: Implement insight clustering**

Add `src/lib/analysis/cluster.ts`:

```ts
import type { InsightCluster, Review, ReviewSignal, SignalLabel } from '../../domain/types';

const CLUSTER_COPY: Record<SignalLabel, { name: string; description: string; scenario: string }> = {
  bug: {
    name: 'Reliability and data-loss issues',
    description: 'Users report crashes, failed exports, sync problems, or lost work that can damage trust.',
    scenario: 'Users trying to finish important writing work under time pressure.'
  },
  feature_request: {
    name: 'Workflow extension requests',
    description: 'Users ask for exports, planning views, reusable settings, or collaboration features.',
    scenario: 'Users who want the app to fit into an existing content workflow.'
  },
  onboarding_friction: {
    name: 'First-session confusion',
    description: 'Users struggle to choose the right mode, template, or next step during early usage.',
    scenario: 'New users evaluating whether the product is worth keeping.'
  },
  pricing_friction: {
    name: 'Pricing and paywall uncertainty',
    description: 'Users hit paid moments before understanding the value, limits, or export capabilities.',
    scenario: 'Trial users deciding whether the app is worth a subscription.'
  },
  retention_risk: {
    name: 'Trust and repeat-usage risk',
    description: 'Users mention cancellation, loss of trust, or failure to build a habit after the first week.',
    scenario: 'Users who were initially interested but did not reach repeat value.'
  },
  delight: {
    name: 'Differentiated writing experience',
    description: 'Users praise tone controls, clean interface, useful suggestions, and saved time.',
    scenario: 'Satisfied users who understand the product value and can reveal what to protect.'
  }
};

function primaryLabel(signal: ReviewSignal): SignalLabel {
  const priority: SignalLabel[] = [
    'bug',
    'retention_risk',
    'pricing_friction',
    'onboarding_friction',
    'feature_request',
    'delight'
  ];

  return priority.find((label) => signal.labels.includes(label)) ?? signal.labels[0];
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

export function buildInsightClusters(reviews: Review[], signals: ReviewSignal[]): InsightCluster[] {
  const reviewsById = new Map(reviews.map((review) => [review.id, review]));
  const grouped = new Map<SignalLabel, ReviewSignal[]>();

  for (const signal of signals) {
    const label = primaryLabel(signal);
    grouped.set(label, [...(grouped.get(label) ?? []), signal]);
  }

  return Array.from(grouped.entries())
    .map(([label, clusterSignals]) => {
      const clusterReviews = clusterSignals
        .map((signal) => reviewsById.get(signal.reviewId))
        .filter((review): review is Review => Boolean(review));
      const ratingTotal = clusterReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = clusterReviews.length > 0 ? round(ratingTotal / clusterReviews.length) : 0;
      const confidence = round(Math.min(0.95, 0.62 + clusterSignals.length * 0.1));
      const copy = CLUSTER_COPY[label];

      return {
        id: label,
        name: copy.name,
        description: copy.description,
        labels: Array.from(new Set(clusterSignals.flatMap((signal) => signal.labels))),
        reviewCount: clusterSignals.length,
        averageRating,
        representativeQuotes: clusterSignals.slice(0, 3).map((signal) => signal.quote),
        confidence,
        suspectedUserScenario: copy.scenario
      };
    })
    .sort((a, b) => b.reviewCount - a.reviewCount || a.averageRating - b.averageRating);
}
```

- [ ] **Step 4: Run cluster tests**

Run:

```powershell
npm test -- src/lib/analysis/cluster.test.ts
```

Expected: PASS.

- [ ] **Step 5: Write failing roadmap tests**

Add `src/lib/analysis/roadmap.test.ts`:

```ts
import type { InsightCluster } from '../../domain/types';
import { generateRoadmapCards } from './roadmap';

const clusters: InsightCluster[] = [
  {
    id: 'bug',
    name: 'Reliability and data-loss issues',
    description: 'Users report crashes and lost work.',
    labels: ['bug', 'retention_risk'],
    reviewCount: 4,
    averageRating: 1.5,
    representativeQuotes: ['Lost work: The draft disappeared.'],
    confidence: 0.9,
    suspectedUserScenario: 'Users finishing client work.'
  },
  {
    id: 'feature_request',
    name: 'Workflow extension requests',
    description: 'Users ask for export and planning features.',
    labels: ['feature_request'],
    reviewCount: 3,
    averageRating: 4,
    representativeQuotes: ['Please add Notion export.'],
    confidence: 0.82,
    suspectedUserScenario: 'Users moving drafts into publishing tools.'
  },
  {
    id: 'onboarding_friction',
    name: 'First-session confusion',
    description: 'Users struggle to choose the right template.',
    labels: ['onboarding_friction'],
    reviewCount: 2,
    averageRating: 3,
    representativeQuotes: ['I did not know which mode to choose.'],
    confidence: 0.72,
    suspectedUserScenario: 'New users trying the first draft.'
  }
];

describe('generateRoadmapCards', () => {
  it('creates fix, improve, and explore cards with evidence', () => {
    const cards = generateRoadmapCards(clusters);

    expect(cards.map((card) => card.type)).toEqual(['fix', 'improve', 'explore']);
    expect(cards[0].title).toBe('Stabilize draft saving and export reliability');
    expect(cards[0].evidenceQuotes).toEqual(['Lost work: The draft disappeared.']);
    expect(cards[0].priorityScore).toBeGreaterThan(cards[2].priorityScore);
  });
});
```

- [ ] **Step 6: Run roadmap tests and verify failure**

Run:

```powershell
npm test -- src/lib/analysis/roadmap.test.ts
```

Expected: FAIL because `roadmap.ts` does not exist.

- [ ] **Step 7: Implement roadmap card generation**

Add `src/lib/analysis/roadmap.ts`:

```ts
import type { InsightCluster, RoadmapCard, RoadmapType } from '../../domain/types';

const TYPE_ORDER: RoadmapType[] = ['fix', 'improve', 'explore'];

function findCluster(clusters: InsightCluster[], ids: string[]): InsightCluster {
  return ids.map((id) => clusters.find((cluster) => cluster.id === id)).find(Boolean) ?? clusters[0];
}

function score(cluster: InsightCluster, severity: number, impact: number, effort: number): RoadmapCard['scoringFactors'] {
  return {
    frequency: Math.min(5, Math.max(1, cluster.reviewCount)),
    severity,
    businessImpact: impact,
    confidence: Math.round(cluster.confidence * 5),
    effort
  };
}

function priorityScore(factors: RoadmapCard['scoringFactors']): number {
  const raw =
    factors.frequency * 0.22 +
    factors.severity * 0.28 +
    factors.businessImpact * 0.25 +
    factors.confidence * 0.15 -
    factors.effort * 0.1;

  return Math.max(1, Math.min(100, Math.round(raw * 20)));
}

function createCard(type: RoadmapType, cluster: InsightCluster): RoadmapCard {
  if (type === 'fix') {
    const factors = score(cluster, 5, 5, 3);

    return {
      id: 'fix-reliability',
      type,
      title: 'Stabilize draft saving and export reliability',
      recommendation: 'Prioritize auto-save, export recovery, and sync-state visibility before expanding new writing modes.',
      priorityScore: priorityScore(factors),
      scoringFactors: factors,
      evidenceQuotes: cluster.representativeQuotes,
      targetMetric: 'Reduce one-star reliability complaints per 100 reviews.',
      validationExperiment: 'Ship auto-save recovery messaging to 25% of users and compare lost-draft support mentions for two weeks.',
      risks: 'This may delay visible feature work, but trust issues can suppress retention and paid conversion.',
      confidence: cluster.confidence
    };
  }

  if (type === 'improve') {
    const factors = score(cluster, 3, 4, 3);

    return {
      id: 'improve-workflow',
      type,
      title: 'Add one high-fit workflow export',
      recommendation: 'Start with Notion-friendly export or preserved formatting because users already describe a clear downstream workflow.',
      priorityScore: priorityScore(factors),
      scoringFactors: factors,
      evidenceQuotes: cluster.representativeQuotes,
      targetMetric: 'Increase completed exports per activated user.',
      validationExperiment: 'Prototype one export path and measure whether users who export return within seven days.',
      risks: 'Export breadth can sprawl, so the first version should support one workflow with strong evidence.',
      confidence: cluster.confidence
    };
  }

  const factors = score(cluster, 3, 3, 2);

  return {
    id: 'explore-onboarding',
    type,
    title: 'Test a guided first-draft setup',
    recommendation: 'Use a short guided setup that recommends one writing mode and one template based on the user goal.',
    priorityScore: priorityScore(factors),
    scoringFactors: factors,
    evidenceQuotes: cluster.representativeQuotes,
    targetMetric: 'Improve first-session draft completion rate.',
    validationExperiment: 'A/B test guided setup against the current template picker for new users.',
    risks: 'Guidance can feel restrictive to advanced users, so provide a skip path and keep the first question lightweight.',
    confidence: cluster.confidence
  };
}

export function generateRoadmapCards(clusters: InsightCluster[]): RoadmapCard[] {
  const selected = {
    fix: findCluster(clusters, ['bug', 'retention_risk', 'pricing_friction']),
    improve: findCluster(clusters, ['feature_request', 'delight']),
    explore: findCluster(clusters, ['onboarding_friction', 'pricing_friction', 'feature_request'])
  };

  return TYPE_ORDER.map((type) => createCard(type, selected[type]));
}
```

- [ ] **Step 8: Run roadmap tests**

Run:

```powershell
npm test -- src/lib/analysis/roadmap.test.ts
```

Expected: PASS.

- [ ] **Step 9: Commit clusters and roadmap cards**

Run:

```powershell
git add src/lib/analysis/cluster.ts src/lib/analysis/roadmap.ts src/lib/analysis/cluster.test.ts src/lib/analysis/roadmap.test.ts
git commit -m "feat: generate insight clusters and roadmap cards"
```

Expected: commit succeeds.

## Task 5: Compose the Analysis Pipeline and AI Workflow Copy

**Files:**
- Create: `src/lib/analysis/pipeline.ts`
- Create: `src/lib/analysis/promptSpec.ts`
- Create: `src/lib/analysis/pipeline.test.ts`

- [ ] **Step 1: Write the failing pipeline test**

Add `src/lib/analysis/pipeline.test.ts`:

```ts
import { sampleReviews } from '../../data/sampleReviews';
import { analyzeReviews } from './pipeline';

describe('analyzeReviews', () => {
  it('returns normalized reviews, signals, clusters, and three roadmap cards', () => {
    const result = analyzeReviews(sampleReviews, '2026-05-28T08:00:00.000Z');

    expect(result.reviews).toHaveLength(18);
    expect(result.signals).toHaveLength(18);
    expect(result.clusters.length).toBeGreaterThanOrEqual(5);
    expect(result.roadmapCards).toHaveLength(3);
    expect(result.generatedAt).toBe('2026-05-28T08:00:00.000Z');
  });
});
```

- [ ] **Step 2: Run the pipeline test and verify failure**

Run:

```powershell
npm test -- src/lib/analysis/pipeline.test.ts
```

Expected: FAIL because `pipeline.ts` does not exist.

- [ ] **Step 3: Implement pipeline orchestration**

Add `src/lib/analysis/pipeline.ts`:

```ts
import type { AnalysisResult, RawReview } from '../../domain/types';
import { buildInsightClusters } from './cluster';
import { classifyReviews } from './classify';
import { normalizeReviews } from './normalize';
import { generateRoadmapCards } from './roadmap';

export function analyzeReviews(rawReviews: RawReview[], generatedAt = new Date().toISOString()): AnalysisResult {
  const reviews = normalizeReviews(rawReviews);
  const signals = classifyReviews(reviews);
  const clusters = buildInsightClusters(reviews, signals);
  const roadmapCards = generateRoadmapCards(clusters);

  return {
    reviews,
    signals,
    clusters,
    roadmapCards,
    generatedAt
  };
}
```

- [ ] **Step 4: Add staged AI workflow copy**

Add `src/lib/analysis/promptSpec.ts`:

```ts
export const aiWorkflowStages = [
  {
    name: 'Normalize reviews',
    description: 'Clean title and body text, remove empty reviews, and preserve source text for citation.'
  },
  {
    name: 'Classify signals',
    description: 'Assign product labels such as bug, feature request, onboarding friction, pricing friction, retention risk, and delight.'
  },
  {
    name: 'Cluster insights',
    description: 'Group semantically related reviews into product-language insight clusters with representative evidence.'
  },
  {
    name: 'Score opportunities',
    description: 'Estimate frequency, severity, business impact, confidence, and effort without pretending the score is perfectly precise.'
  },
  {
    name: 'Generate roadmap cards',
    description: 'Convert top opportunities into Fix, Improve, and Explore recommendations with metrics and validation experiments.'
  }
] as const;
```

- [ ] **Step 5: Run pipeline test**

Run:

```powershell
npm test -- src/lib/analysis/pipeline.test.ts
```

Expected: PASS.

- [ ] **Step 6: Run all tests**

Run:

```powershell
npm test
```

Expected: PASS for all test files.

- [ ] **Step 7: Commit the pipeline**

Run:

```powershell
git add src/lib/analysis/pipeline.ts src/lib/analysis/promptSpec.ts src/lib/analysis/pipeline.test.ts
git commit -m "feat: compose review analysis pipeline"
```

Expected: commit succeeds.

## Task 6: Build the Main Product Layout and Input Panel

**Files:**
- Create: `src/components/InputPanel.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Replace the smoke test with product workflow expectations**

Update `src/App.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import App from './App';
import { renderApp } from './test/render';

describe('App', () => {
  it('renders the input workflow and generated analysis sections', () => {
    renderApp(<App />);

    expect(screen.getByRole('heading', { name: /ReviewRoadmap Studio/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/App Store URL/i)).toHaveValue('https://apps.apple.com/app/draftly-ai-writing/id0000000000');
    expect(screen.getByRole('button', { name: /Analyze Reviews/i })).toBeInTheDocument();
    expect(screen.getByText(/18 reviews analyzed/i)).toBeInTheDocument();
    expect(screen.getByText(/Roadmap decisions/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the app test and verify failure**

Run:

```powershell
npm test -- src/App.test.tsx
```

Expected: FAIL because the new UI is not built.

- [ ] **Step 3: Add the input panel component**

Add `src/components/InputPanel.tsx`:

```tsx
import { Search, Sparkles } from 'lucide-react';

interface InputPanelProps {
  appUrl: string;
  onAppUrlChange: (value: string) => void;
  onAnalyze: () => void;
}

export function InputPanel({ appUrl, onAppUrlChange, onAnalyze }: InputPanelProps) {
  return (
    <section className="input-panel" aria-labelledby="input-title">
      <div>
        <p className="eyebrow">Demo data source</p>
        <h2 id="input-title">Analyze an App Store review sample</h2>
        <p className="section-copy">
          This prototype uses a prepared review sample for a fictional AI writing app, shaped like public App Store feedback.
        </p>
      </div>

      <label className="field-label" htmlFor="app-url">
        App Store URL
      </label>
      <div className="url-row">
        <Search aria-hidden="true" size={18} />
        <input
          id="app-url"
          value={appUrl}
          onChange={(event) => onAppUrlChange(event.target.value)}
        />
      </div>

      <div className="input-actions">
        <button className="primary-button" type="button" onClick={onAnalyze}>
          <Sparkles aria-hidden="true" size={18} />
          Analyze Reviews
        </button>
        <span>18 review-shaped records · AI writing category · May 2026 sample</span>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Compose the main app with analysis state**

Update `src/App.tsx`:

```tsx
import { useMemo, useState } from 'react';
import { sampleReviews } from './data/sampleReviews';
import { analyzeReviews } from './lib/analysis/pipeline';
import { InputPanel } from './components/InputPanel';

const DEMO_APP_URL = 'https://apps.apple.com/app/draftly-ai-writing/id0000000000';

export default function App() {
  const [appUrl, setAppUrl] = useState(DEMO_APP_URL);
  const [analysisRunCount, setAnalysisRunCount] = useState(1);
  const analysis = useMemo(
    () => analyzeReviews(sampleReviews, '2026-05-28T08:00:00.000Z'),
    [analysisRunCount]
  );

  return (
    <main className="app-shell">
      <section className="hero-band">
        <div>
          <p className="eyebrow">AI product decision assistant</p>
          <h1>ReviewRoadmap Studio</h1>
          <p className="hero-copy">
            Turn messy App Store reviews into insight clusters, evidence quotes, and roadmap decisions.
          </p>
        </div>
        <div className="hero-stats" aria-label="Demo summary">
          <span>{analysis.reviews.length} reviews analyzed</span>
          <span>{analysis.clusters.length} insight clusters</span>
          <span>{analysis.roadmapCards.length} roadmap cards</span>
        </div>
      </section>

      <InputPanel
        appUrl={appUrl}
        onAppUrlChange={setAppUrl}
        onAnalyze={() => setAnalysisRunCount((count) => count + 1)}
      />

      <section className="panel">
        <p className="eyebrow">Output preview</p>
        <h2>Roadmap decisions</h2>
        <p className="section-copy">
          The next tasks replace this preview with the dashboard, roadmap cards, and decision brief.
        </p>
      </section>
    </main>
  );
}
```

- [ ] **Step 5: Update foundational layout styles**

Append to `src/styles.css`:

```css
.hero-band,
.input-panel,
.panel {
  max-width: 1180px;
  margin: 0 auto 18px;
  border: 1px solid #d8ded6;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.84);
  box-shadow: 0 18px 60px rgba(38, 52, 43, 0.08);
}

.hero-band {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(260px, 0.6fr);
  gap: 32px;
  align-items: end;
  padding: 44px;
}

.hero-stats {
  display: grid;
  gap: 10px;
}

.hero-stats span {
  display: block;
  padding: 14px 16px;
  border: 1px solid #dce4dc;
  border-radius: 8px;
  color: #2d4338;
  background: #f7faf6;
  font-weight: 700;
}

.input-panel,
.panel {
  padding: 28px;
}

.section-copy {
  max-width: 720px;
  margin: 8px 0 0;
  color: #5b685f;
  line-height: 1.6;
}

.field-label {
  display: block;
  margin: 22px 0 8px;
  color: #2f453a;
  font-size: 0.9rem;
  font-weight: 700;
}

.url-row {
  display: grid;
  grid-template-columns: 20px 1fr;
  gap: 10px;
  align-items: center;
  padding: 12px 14px;
  border: 1px solid #cad8cf;
  border-radius: 8px;
  background: #fbfcfa;
}

.url-row input {
  width: 100%;
  border: 0;
  outline: 0;
  color: #16201b;
  background: transparent;
}

.input-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
  margin-top: 18px;
  color: #69746d;
  font-size: 0.92rem;
}

.primary-button {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 18px;
  border: 0;
  border-radius: 8px;
  color: #fff;
  background: #1f6f5b;
  font-weight: 800;
  cursor: pointer;
}

.primary-button:hover {
  background: #175946;
}

@media (max-width: 760px) {
  .app-shell {
    padding: 16px;
  }

  .hero-band {
    grid-template-columns: 1fr;
    padding: 28px;
  }
}
```

- [ ] **Step 6: Run app test**

Run:

```powershell
npm test -- src/App.test.tsx
```

Expected: PASS.

- [ ] **Step 7: Commit app shell and input flow**

Run:

```powershell
git add src/App.tsx src/App.test.tsx src/components/InputPanel.tsx src/styles.css
git commit -m "feat: build review analysis input flow"
```

Expected: commit succeeds.

## Task 7: Build the Review Intelligence Dashboard

**Files:**
- Create: `src/components/InsightDashboard.tsx`
- Create: `src/components/InsightDashboard.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Write a failing dashboard component test**

Add `src/components/InsightDashboard.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import { sampleReviews } from '../data/sampleReviews';
import { analyzeReviews } from '../lib/analysis/pipeline';
import { renderApp } from '../test/render';
import { InsightDashboard } from './InsightDashboard';

describe('InsightDashboard', () => {
  it('renders theme distribution and evidence quotes', () => {
    const analysis = analyzeReviews(sampleReviews, '2026-05-28T08:00:00.000Z');

    renderApp(<InsightDashboard analysis={analysis} />);

    expect(screen.getByRole('heading', { name: /Review intelligence/i })).toBeInTheDocument();
    expect(screen.getByText(/Reliability and data-loss issues/i)).toBeInTheDocument();
    expect(screen.getByText(/Crashes during long drafts/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run dashboard test and verify failure**

Run:

```powershell
npm test -- src/components/InsightDashboard.test.tsx
```

Expected: FAIL because `InsightDashboard.tsx` does not exist.

- [ ] **Step 3: Implement dashboard component**

Add `src/components/InsightDashboard.tsx`:

```tsx
import { BarChart3, Quote } from 'lucide-react';
import type { AnalysisResult } from '../domain/types';

interface InsightDashboardProps {
  analysis: AnalysisResult;
}

export function InsightDashboard({ analysis }: InsightDashboardProps) {
  const topClusters = analysis.clusters.slice(0, 6);
  const averageRating =
    analysis.reviews.reduce((sum, review) => sum + review.rating, 0) / analysis.reviews.length;

  return (
    <section className="panel" aria-labelledby="intelligence-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Evidence synthesis</p>
          <h2 id="intelligence-title">Review intelligence</h2>
          <p className="section-copy">
            A structured readout of recurring user signals before the product makes roadmap recommendations.
          </p>
        </div>
        <div className="metric-pill">
          <BarChart3 aria-hidden="true" size={18} />
          {averageRating.toFixed(1)} avg rating
        </div>
      </div>

      <div className="cluster-grid">
        {topClusters.map((cluster) => (
          <article className="cluster-card" key={cluster.id}>
            <div className="cluster-card-header">
              <h3>{cluster.name}</h3>
              <span>{cluster.reviewCount} reviews</span>
            </div>
            <p>{cluster.description}</p>
            <div className="cluster-meta">
              <span>{Math.round(cluster.confidence * 100)}% confidence</span>
              <span>{cluster.averageRating.toFixed(1)} rating</span>
            </div>
          </article>
        ))}
      </div>

      <div className="evidence-strip" aria-label="Representative review evidence">
        {analysis.reviews.slice(1, 5).map((review) => (
          <figure key={review.id}>
            <Quote aria-hidden="true" size={16} />
            <blockquote>{review.title}: {review.body}</blockquote>
            <figcaption>{review.rating} stars · v{review.appVersion}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Replace preview panel with dashboard**

Update `src/App.tsx` imports and output:

```tsx
import { useMemo, useState } from 'react';
import { sampleReviews } from './data/sampleReviews';
import { analyzeReviews } from './lib/analysis/pipeline';
import { InputPanel } from './components/InputPanel';
import { InsightDashboard } from './components/InsightDashboard';

const DEMO_APP_URL = 'https://apps.apple.com/app/draftly-ai-writing/id0000000000';

export default function App() {
  const [appUrl, setAppUrl] = useState(DEMO_APP_URL);
  const [analysisRunCount, setAnalysisRunCount] = useState(1);
  const analysis = useMemo(
    () => analyzeReviews(sampleReviews, '2026-05-28T08:00:00.000Z'),
    [analysisRunCount]
  );

  return (
    <main className="app-shell">
      <section className="hero-band">
        <div>
          <p className="eyebrow">AI product decision assistant</p>
          <h1>ReviewRoadmap Studio</h1>
          <p className="hero-copy">
            Turn messy App Store reviews into insight clusters, evidence quotes, and roadmap decisions.
          </p>
        </div>
        <div className="hero-stats" aria-label="Demo summary">
          <span>{analysis.reviews.length} reviews analyzed</span>
          <span>{analysis.clusters.length} insight clusters</span>
          <span>{analysis.roadmapCards.length} roadmap cards</span>
        </div>
      </section>

      <InputPanel
        appUrl={appUrl}
        onAppUrlChange={setAppUrl}
        onAnalyze={() => setAnalysisRunCount((count) => count + 1)}
      />

      <InsightDashboard analysis={analysis} />
    </main>
  );
}
```

- [ ] **Step 5: Add dashboard styles**

Append to `src/styles.css`:

```css
.section-heading {
  display: flex;
  gap: 18px;
  align-items: start;
  justify-content: space-between;
}

.metric-pill {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  min-height: 38px;
  padding: 0 12px;
  border: 1px solid #cddbd1;
  border-radius: 999px;
  color: #265245;
  background: #f3f8f4;
  font-weight: 800;
  white-space: nowrap;
}

.cluster-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 22px;
}

.cluster-card {
  min-height: 190px;
  padding: 18px;
  border: 1px solid #d9e3db;
  border-radius: 8px;
  background: #fbfcfa;
}

.cluster-card-header {
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

.cluster-card h3 {
  margin: 0;
  color: #1c2d25;
  font-size: 1rem;
  line-height: 1.3;
}

.cluster-card-header span,
.cluster-meta span {
  color: #496457;
  font-size: 0.84rem;
  font-weight: 700;
}

.cluster-card p {
  margin: 14px 0;
  color: #5a675f;
  line-height: 1.55;
}

.cluster-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cluster-meta span {
  padding: 6px 8px;
  border-radius: 999px;
  background: #edf4ef;
}

.evidence-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.evidence-strip figure {
  margin: 0;
  padding: 14px;
  border-left: 3px solid #2e7a62;
  border-radius: 8px;
  background: #f4f6f2;
}

.evidence-strip blockquote {
  margin: 8px 0;
  color: #28372f;
  font-size: 0.92rem;
  line-height: 1.5;
}

.evidence-strip figcaption {
  color: #6a756e;
  font-size: 0.82rem;
}

@media (max-width: 960px) {
  .cluster-grid,
  .evidence-strip {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .section-heading {
    display: block;
  }

  .metric-pill {
    margin-top: 14px;
  }

  .cluster-grid,
  .evidence-strip {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 6: Run dashboard and app tests**

Run:

```powershell
npm test -- src/components/InsightDashboard.test.tsx src/App.test.tsx
```

Expected: PASS.

- [ ] **Step 7: Commit dashboard**

Run:

```powershell
git add src/components/InsightDashboard.tsx src/components/InsightDashboard.test.tsx src/App.tsx src/styles.css
git commit -m "feat: show review intelligence dashboard"
```

Expected: commit succeeds.

## Task 8: Build Roadmap Cards, Decision Brief, and AI Workflow Panel

**Files:**
- Create: `src/components/RoadmapCards.tsx`
- Create: `src/components/DecisionBrief.tsx`
- Create: `src/components/AiWorkflow.tsx`
- Create: `src/components/RoadmapCards.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Write a failing roadmap card test**

Add `src/components/RoadmapCards.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import { sampleReviews } from '../data/sampleReviews';
import { analyzeReviews } from '../lib/analysis/pipeline';
import { renderApp } from '../test/render';
import { RoadmapCards } from './RoadmapCards';

describe('RoadmapCards', () => {
  it('renders all roadmap decision types with evidence', () => {
    const analysis = analyzeReviews(sampleReviews, '2026-05-28T08:00:00.000Z');

    renderApp(<RoadmapCards cards={analysis.roadmapCards} />);

    expect(screen.getByText('Fix')).toBeInTheDocument();
    expect(screen.getByText('Improve')).toBeInTheDocument();
    expect(screen.getByText('Explore')).toBeInTheDocument();
    expect(screen.getByText(/Stabilize draft saving/i)).toBeInTheDocument();
    expect(screen.getByText(/Validation experiment/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run roadmap component test and verify failure**

Run:

```powershell
npm test -- src/components/RoadmapCards.test.tsx
```

Expected: FAIL because `RoadmapCards.tsx` does not exist.

- [ ] **Step 3: Implement roadmap card component**

Add `src/components/RoadmapCards.tsx`:

```tsx
import { Activity, FlaskConical, Gauge, ShieldCheck } from 'lucide-react';
import type { RoadmapCard } from '../domain/types';

interface RoadmapCardsProps {
  cards: RoadmapCard[];
}

const TYPE_LABELS: Record<RoadmapCard['type'], string> = {
  fix: 'Fix',
  improve: 'Improve',
  explore: 'Explore'
};

export function RoadmapCards({ cards }: RoadmapCardsProps) {
  return (
    <section className="panel" aria-labelledby="roadmap-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Decision output</p>
          <h2 id="roadmap-title">Roadmap decisions</h2>
          <p className="section-copy">
            Each recommendation preserves evidence, scoring logic, and the next validation step.
          </p>
        </div>
      </div>

      <div className="roadmap-grid">
        {cards.map((card) => (
          <article className={`roadmap-card roadmap-card-${card.type}`} key={card.id}>
            <div className="card-kicker">
              <span>{TYPE_LABELS[card.type]}</span>
              <strong>{card.priorityScore}</strong>
            </div>
            <h3>{card.title}</h3>
            <p>{card.recommendation}</p>

            <dl className="decision-list">
              <div>
                <dt><Gauge aria-hidden="true" size={15} /> Metric</dt>
                <dd>{card.targetMetric}</dd>
              </div>
              <div>
                <dt><FlaskConical aria-hidden="true" size={15} /> Validation experiment</dt>
                <dd>{card.validationExperiment}</dd>
              </div>
              <div>
                <dt><ShieldCheck aria-hidden="true" size={15} /> Risk</dt>
                <dd>{card.risks}</dd>
              </div>
            </dl>

            <div className="evidence-list">
              <div className="evidence-title">
                <Activity aria-hidden="true" size={15} />
                Evidence
              </div>
              {card.evidenceQuotes.slice(0, 2).map((quote) => (
                <blockquote key={quote}>{quote}</blockquote>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Add decision brief component**

Add `src/components/DecisionBrief.tsx`:

```tsx
import { FileText } from 'lucide-react';
import type { AnalysisResult } from '../domain/types';

interface DecisionBriefProps {
  analysis: AnalysisResult;
}

export function DecisionBrief({ analysis }: DecisionBriefProps) {
  const topCard = analysis.roadmapCards[0];
  const topCluster = analysis.clusters[0];

  return (
    <section className="brief-panel" aria-labelledby="brief-title">
      <div className="brief-header">
        <div>
          <p className="eyebrow">Portfolio-ready artifact</p>
          <h2 id="brief-title">One-page product decision brief</h2>
        </div>
        <FileText aria-hidden="true" size={24} />
      </div>

      <div className="brief-grid">
        <article>
          <h3>Problem signal</h3>
          <p>{topCluster.description}</p>
        </article>
        <article>
          <h3>Recommended decision</h3>
          <p>{topCard.recommendation}</p>
        </article>
        <article>
          <h3>Evidence</h3>
          <p>{topCard.evidenceQuotes[0]}</p>
        </article>
        <article>
          <h3>Next experiment</h3>
          <p>{topCard.validationExperiment}</p>
        </article>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Add AI workflow component**

Add `src/components/AiWorkflow.tsx`:

```tsx
import { Boxes } from 'lucide-react';
import { aiWorkflowStages } from '../lib/analysis/promptSpec';

export function AiWorkflow() {
  return (
    <section className="panel" aria-labelledby="workflow-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">AI workflow</p>
          <h2 id="workflow-title">Explainable analysis chain</h2>
          <p className="section-copy">
            The demo separates classification, clustering, scoring, and recommendation so the AI does not feel like a black box.
          </p>
        </div>
        <div className="metric-pill">
          <Boxes aria-hidden="true" size={18} />
          {aiWorkflowStages.length} stages
        </div>
      </div>

      <ol className="workflow-list">
        {aiWorkflowStages.map((stage) => (
          <li key={stage.name}>
            <strong>{stage.name}</strong>
            <span>{stage.description}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

- [ ] **Step 6: Compose all output sections in the app**

Update `src/App.tsx`:

```tsx
import { useMemo, useState } from 'react';
import { sampleReviews } from './data/sampleReviews';
import { analyzeReviews } from './lib/analysis/pipeline';
import { AiWorkflow } from './components/AiWorkflow';
import { DecisionBrief } from './components/DecisionBrief';
import { InputPanel } from './components/InputPanel';
import { InsightDashboard } from './components/InsightDashboard';
import { RoadmapCards } from './components/RoadmapCards';

const DEMO_APP_URL = 'https://apps.apple.com/app/draftly-ai-writing/id0000000000';

export default function App() {
  const [appUrl, setAppUrl] = useState(DEMO_APP_URL);
  const [analysisRunCount, setAnalysisRunCount] = useState(1);
  const analysis = useMemo(
    () => analyzeReviews(sampleReviews, '2026-05-28T08:00:00.000Z'),
    [analysisRunCount]
  );

  return (
    <main className="app-shell">
      <section className="hero-band">
        <div>
          <p className="eyebrow">AI product decision assistant</p>
          <h1>ReviewRoadmap Studio</h1>
          <p className="hero-copy">
            Turn messy App Store reviews into insight clusters, evidence quotes, and roadmap decisions.
          </p>
        </div>
        <div className="hero-stats" aria-label="Demo summary">
          <span>{analysis.reviews.length} reviews analyzed</span>
          <span>{analysis.clusters.length} insight clusters</span>
          <span>{analysis.roadmapCards.length} roadmap cards</span>
        </div>
      </section>

      <InputPanel
        appUrl={appUrl}
        onAppUrlChange={setAppUrl}
        onAnalyze={() => setAnalysisRunCount((count) => count + 1)}
      />

      <InsightDashboard analysis={analysis} />
      <RoadmapCards cards={analysis.roadmapCards} />
      <AiWorkflow />
      <DecisionBrief analysis={analysis} />
    </main>
  );
}
```

- [ ] **Step 7: Add roadmap, workflow, and brief styles**

Append to `src/styles.css`:

```css
.roadmap-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 22px;
}

.roadmap-card {
  min-height: 520px;
  padding: 18px;
  border: 1px solid #d7e0d8;
  border-radius: 8px;
  background: #fbfcfa;
}

.roadmap-card-fix {
  border-top: 4px solid #bd4b3d;
}

.roadmap-card-improve {
  border-top: 4px solid #2e7a62;
}

.roadmap-card-explore {
  border-top: 4px solid #456db0;
}

.card-kicker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #395247;
  font-size: 0.8rem;
  font-weight: 900;
  text-transform: uppercase;
}

.card-kicker strong {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  background: #1f6f5b;
}

.roadmap-card h3 {
  margin: 16px 0 10px;
  color: #17271f;
  font-size: 1.25rem;
  line-height: 1.25;
}

.roadmap-card p,
.decision-list dd {
  color: #58665e;
  line-height: 1.55;
}

.decision-list {
  display: grid;
  gap: 12px;
  margin: 18px 0;
}

.decision-list div {
  padding-top: 12px;
  border-top: 1px solid #e1e7e1;
}

.decision-list dt {
  display: flex;
  gap: 7px;
  align-items: center;
  color: #20362c;
  font-weight: 900;
}

.decision-list dd {
  margin: 6px 0 0;
}

.evidence-list {
  display: grid;
  gap: 8px;
  margin-top: 16px;
}

.evidence-title {
  display: flex;
  gap: 7px;
  align-items: center;
  color: #20362c;
  font-weight: 900;
}

.evidence-list blockquote {
  margin: 0;
  padding: 10px 12px;
  border-radius: 8px;
  color: #34423a;
  background: #edf4ef;
  font-size: 0.9rem;
  line-height: 1.5;
}

.workflow-list {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  margin: 22px 0 0;
  padding: 0;
  list-style: none;
}

.workflow-list li {
  min-height: 168px;
  padding: 16px;
  border: 1px solid #d9e3db;
  border-radius: 8px;
  background: #fbfcfa;
}

.workflow-list strong {
  display: block;
  margin-bottom: 10px;
  color: #183126;
}

.workflow-list span {
  color: #5b685f;
  font-size: 0.92rem;
  line-height: 1.5;
}

.brief-panel {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px;
  border-radius: 8px;
  color: #f6f4ef;
  background: #18241e;
}

.brief-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.brief-panel .eyebrow,
.brief-panel h2 {
  color: #f6f4ef;
}

.brief-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 22px;
}

.brief-grid article {
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
}

.brief-grid h3 {
  margin: 0 0 10px;
  color: #ffffff;
  font-size: 1rem;
}

.brief-grid p {
  margin: 0;
  color: #dce6dd;
  line-height: 1.55;
}

@media (max-width: 1080px) {
  .roadmap-grid,
  .workflow-list,
  .brief-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 680px) {
  .roadmap-grid,
  .workflow-list,
  .brief-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 8: Run roadmap and app tests**

Run:

```powershell
npm test -- src/components/RoadmapCards.test.tsx src/App.test.tsx
```

Expected: PASS.

- [ ] **Step 9: Commit roadmap and brief UI**

Run:

```powershell
git add src/components/RoadmapCards.tsx src/components/DecisionBrief.tsx src/components/AiWorkflow.tsx src/components/RoadmapCards.test.tsx src/App.tsx src/styles.css
git commit -m "feat: present roadmap decisions and brief"
```

Expected: commit succeeds.

## Task 9: Add Portfolio Documentation and Run Full Verification

**Files:**
- Create: `README.md`

- [ ] **Step 1: Add README**

Add `README.md`:

```md
# ReviewRoadmap Studio

ReviewRoadmap Studio is a portfolio-grade AI product decision assistant for indie app builders and early-stage app teams. The demo analyzes iOS App Store-style reviews for a fictional AI writing app and turns them into insight clusters, evidence-backed roadmap cards, and a one-page product decision brief.

## Why This Exists

Small app teams often have user reviews but limited product research capacity. A generic AI summary is not enough; the useful product decision is what to fix, what to improve, what to explore, and what evidence supports that choice.

## Demo Flow

1. Review-shaped App Store sample data is loaded for a fictional AI writing app.
2. Reviews are normalized and classified into product signals.
3. Signals are clustered into PM-readable insight groups.
4. The system generates Fix, Improve, and Explore roadmap cards.
5. Each card includes evidence, a metric, a validation experiment, risks, and confidence.

## Local Development

```powershell
npm install
npm run dev
```

## Verification

```powershell
npm test
npm run build
```

## Portfolio Narrative

This project demonstrates AI PM judgment by showing the full path from messy user evidence to product trade-offs. It is intentionally structured as a decision workbench rather than a chatbot so the AI value is visible through evidence, scoring, recommendations, and experiments.
```

- [ ] **Step 2: Run unit and component tests**

Run:

```powershell
npm test
```

Expected: PASS for all tests.

- [ ] **Step 3: Run production build**

Run:

```powershell
npm run build
```

Expected: PASS and Vite writes `dist/`.

- [ ] **Step 4: Start local dev server**

Run:

```powershell
npm run dev -- --host 127.0.0.1
```

Expected: Vite prints a local URL such as `http://127.0.0.1:5173/`.

- [ ] **Step 5: Browser verification**

Open the local URL and verify:

- The first screen shows the product name, one-line value proposition, and demo stats.
- The input panel shows the App Store URL field and Analyze Reviews button.
- The dashboard shows clusters and evidence quotes.
- The roadmap section shows Fix, Improve, and Explore cards.
- The AI workflow and decision brief sections appear below the roadmap cards.
- On a narrow viewport, cards stack without text overlap.

- [ ] **Step 6: Commit documentation and verified build state**

Run:

```powershell
git add README.md
git commit -m "docs: add portfolio project guide"
```

Expected: commit succeeds.

## Self-Review

Spec coverage:

- Product positioning is covered by Task 6 hero copy and Task 9 README.
- Target user and demo data strategy are covered by Task 2 sample data and Task 6 input copy.
- AI workflow is covered by Tasks 3, 4, 5, and the Task 8 workflow panel.
- Core screens are covered by Tasks 6, 7, and 8.
- Data model is covered by Task 2.
- Portfolio narrative is covered by Task 8 decision brief and Task 9 README.
- Risk mitigation for unreliable live import is covered by local sample data and clear demo copy.

Type consistency:

- Domain fields use camelCase in TypeScript: `appVersion`, `normalizedText`, `priorityScore`, `scoringFactors`, `evidenceQuotes`, `targetMetric`, and `validationExperiment`.
- Roadmap types are `fix`, `improve`, and `explore` across types, generator, and UI.
- Signal labels are stable string unions across classifier, cluster builder, and tests.

Verification commands:

- `npm test`
- `npm run build`
- `npm run dev -- --host 127.0.0.1`
