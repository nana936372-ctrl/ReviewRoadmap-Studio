# Compact Score Detail Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move evaluation-heavy content out of the main dashboard into a dedicated score detail page and expand the decision brief.

**Architecture:** Keep the deterministic evaluation data model from the previous feature. Add app-level selected-card state, pass a score-click callback into roadmap cards, and render a focused detail page when a roadmap score is selected. Main cards show concise summaries; the detail page owns the formula and evaluation dimensions.

**Tech Stack:** Vite, React, TypeScript, Vitest, React Testing Library, plain CSS.

---

## File Structure

- `src/App.tsx`: Hold selected roadmap card state and switch between overview and score detail page.
- `src/components/RoadmapCards.tsx`: Remove inline evaluation panels and call `onScoreSelect(card.id)` when a score is clicked.
- `src/components/ScoreDetailPage.tsx`: New detail page for formula, score dimensions, recommendation, metric, experiment, and risk dimensions.
- `src/components/InsightDashboard.tsx`: Collapse/remove direct review evaluation details from the overview.
- `src/components/DecisionBrief.tsx`: Expand visible and downloaded brief sections.
- `src/i18n/copy.ts`: Add bilingual labels for detail page and expanded brief.
- `src/styles.css`: Simplify overview card styling and add clean detail/brief layouts.
- Tests: Update component and app tests for compact overview, score detail navigation, and richer brief labels.

## Tasks

1. Update tests so overview no longer renders formula/dimension details directly and score clicks navigate to the detail page.
2. Implement `ScoreDetailPage` and wire app state from `RoadmapCards` score buttons.
3. Compact the roadmap and review evidence overview UI.
4. Expand the decision brief content and download markdown.
5. Run `npm test`, `npm run build`, browser-check desktop/mobile Chinese UI, then commit.
