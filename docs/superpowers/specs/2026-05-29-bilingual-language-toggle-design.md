# Bilingual Language Toggle Design

## Goal

Add an in-product language choice so ReviewRoadmap Studio can be reviewed in either English or Chinese without changing the underlying demo data.

## Scope

- Add a two-option language control: English and Chinese.
- Localize the main product UI: hero, input workflow, dashboard labels, roadmap cards, AI workflow, decision brief, empty states, metrics, and download button.
- Localize generated insight cluster copy and roadmap recommendation copy through the deterministic analysis pipeline.
- Keep original review evidence quotes in English to preserve source authenticity.
- Generate the downloaded decision brief in the currently selected language.

## Design

The app keeps language state at the top level and passes localized copy to presentation components. Static UI copy lives in a small dictionary. Analysis functions accept an optional language argument and choose localized cluster and roadmap text while preserving review IDs, labels, scores, and evidence quotes.

## Testing

- App test verifies the language control and Chinese-mode screen copy.
- Analysis tests verify Chinese cluster and roadmap text.
- Existing English tests continue to protect the default experience.
