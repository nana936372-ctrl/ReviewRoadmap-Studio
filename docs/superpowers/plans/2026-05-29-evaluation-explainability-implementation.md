# Evaluation Explainability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add clickable evaluation dimensions for review samples, roadmap scores, roadmap recommendations, AI workflow stages, and decision brief export.

**Architecture:** Extend the deterministic analysis model with reusable evaluation dimensions for roadmap decisions, derive review-level dimensions in the dashboard, and render explanations through native disclosure controls. Keep bilingual strings in existing copy/workflow/roadmap localization patterns.

**Tech Stack:** Vite, React, TypeScript, Vitest, React Testing Library, plain CSS.

---

## File Structure

- `src/domain/types.ts`: Add reusable evaluation dimension types and roadmap evaluation fields.
- `src/lib/analysis/roadmap.ts`: Generate score, recommendation, metric, experiment, and risk dimensions in English and Chinese.
- `src/lib/analysis/promptSpec.ts`: Add workflow evaluation methods and dimensions.
- `src/i18n/copy.ts`: Add labels for review evidence dimensions, disclosure controls, and brief export.
- `src/components/InsightDashboard.tsx`: Render review evidence evaluation details.
- `src/components/RoadmapCards.tsx`: Make score clickable and show dimensions for scores and decisions.
- `src/components/AiWorkflow.tsx`: Show workflow evaluation methods and dimensions.
- `src/components/DecisionBrief.tsx`: Include top-card evaluation dimensions in the downloaded brief.
- Tests: Extend existing tests for dashboard, roadmap, app, pipeline, and prompt spec behavior.

## Tasks

1. Write failing tests for review evidence dimensions, roadmap score explanations, workflow evaluation methods, and Chinese-mode labels.
2. Add `EvaluationDimension` fields to domain types and generate roadmap evaluation dimensions in `roadmap.ts`.
3. Add bilingual review/workflow/roadmap explanation copy.
4. Render clickable disclosure controls and score details in React components.
5. Run `npm test`, `npm run build`, browser-check English and Chinese interactions, and commit.
