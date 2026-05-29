# Evaluation Explainability Design

## Goal

Add a visible evaluation layer so every score, recommendation, validation plan, and AI workflow stage shows the dimensions behind the decision.

## Scope

- Review evidence cards expose how each sample review was interpreted: star rating, signal labels, sentiment, urgency, and product-use impact.
- Roadmap priority scores expose the scoring formula and factor-level rationale.
- Roadmap recommendations, metrics, validation experiments, and risks each show the evaluation dimensions that informed them.
- AI workflow stages include evaluation method and dimensions, not only stage descriptions.
- Decision brief export includes evaluation dimensions for the top recommendation.
- All new labels and explanations support English and Chinese. Source review quotes remain in English.

## Interaction Model

Use click-first disclosure because this must work on mobile and in an interview demo. Desktop users also get short hover hints through `title` attributes on score and explanation controls.

- Roadmap score circle becomes a clickable control.
- Review evidence cards include an evaluation details disclosure.
- AI workflow cards include an evaluation method disclosure.
- Recommendation, metric, experiment, and risk rows include compact evaluation details.

## Data Model

Add a reusable `EvaluationDimension` type with label, value, rationale, optional score, optional weight, and optional evidence. Roadmap cards carry score dimensions plus recommendation/metric/experiment/risk dimensions. Review-level evaluation dimensions can be derived in the dashboard from review and signal data.

## Success Criteria

- A reviewer can answer "why this score?" by clicking the roadmap score.
- A reviewer can answer "why this recommendation?" from the card itself.
- A reviewer can answer "how did the AI evaluate this stage?" from the workflow panel.
- Chinese mode localizes every new explanatory label and rationale.
