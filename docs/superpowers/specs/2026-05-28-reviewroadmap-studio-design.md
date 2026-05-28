# ReviewRoadmap Studio Design

## Summary

ReviewRoadmap Studio is an AI product decision assistant for indie app builders and early-stage teams. The first demo analyzes public iOS App Store reviews and turns scattered user comments into evidence-backed roadmap decisions.

The portfolio goal is to show AI product management judgment: user understanding, structured product thinking, technical fluency, and polished information design.

## Target User

Primary user: an indie developer or small app team with a live app and limited product research capacity.

Core situation:

- They receive App Store reviews but do not have time to read and synthesize them.
- They cannot easily tell which complaints are bugs, feature requests, onboarding problems, pricing friction, or retention risks.
- They need a lightweight way to decide what to fix, improve, or explore next.

Secondary user for the portfolio story: an AIPM interviewer evaluating whether the creator can turn ambiguous user signals into product decisions.

## Product Positioning

ReviewRoadmap Studio is not a generic review summarizer. It is a decision tool that converts user evidence into product priorities.

One-line pitch:

> Turn App Store reviews into an evidence-backed roadmap in minutes.

The product should feel like a focused PM workbench rather than a chatbot. The AI is visible through structured outputs, citations, priority reasoning, and experiment suggestions.

## MVP Scope

The MVP supports one complete demo flow:

1. User enters an App Store app URL or uploads a review sample.
2. The system normalizes reviews into a clean review table.
3. AI classifies review content into themes:
   - Bug reports
   - Feature requests
   - Onboarding friction
   - Pricing or paywall friction
   - Retention risk
   - Delight moments
4. AI clusters related reviews into insight groups.
5. The system generates three roadmap cards:
   - Fix: urgent reliability or usability issue
   - Improve: high-confidence experience upgrade
   - Explore: promising but less certain opportunity
6. Each roadmap card includes:
   - Recommendation
   - Priority score
   - Evidence quotes
   - User segment or scenario
   - Product metric to watch
   - Suggested validation experiment
   - Risks or counter-signals
7. The user can export a one-page product decision brief.

Out of scope for the MVP:

- Account system
- Team collaboration
- Full historical review sync
- Automated competitor monitoring
- Native integrations with App Store Connect, Google Play, Chrome Web Store, G2, or Zendesk
- Full PRD generation

## Demo Data Strategy

Use iOS App Store review data for the first demo because it is public-facing, easy to understand, and simpler to clean than Chrome Web Store or B2B SaaS reviews.

The demo can start with a prepared sample dataset to keep the product reliable during interviews. The product UI may still present the input as an App Store URL, then show imported sample reviews for the selected app category.

Recommended demo categories:

- AI writing app
- Habit or productivity app
- Language learning app
- Note-taking or knowledge management app

The best first choice is an AI writing or productivity app because it aligns with the broader "individual AI product builder" story.

## Core Screens

### 1. Input Screen

Purpose: make the workflow feel concrete and low effort.

Main elements:

- App Store URL input
- Optional review sample upload
- Category selector
- Time window selector
- "Analyze Reviews" primary action

Success criteria:

- The user understands what data goes in.
- The screen feels like a product tool, not a prompt box.

### 2. Review Intelligence Dashboard

Purpose: show the AI's synthesis before asking the user to trust roadmap output.

Main elements:

- Review volume and rating summary
- Theme distribution
- Sentiment by theme
- Evidence table with source quotes
- Cluster map for recurring problems and requests

Success criteria:

- The user can see where the conclusions came from.
- The interface balances polish with dense PM information.

### 3. Roadmap Cards

Purpose: turn analysis into product decisions.

Main elements:

- Three cards: Fix, Improve, Explore
- Priority score with contributing factors
- Evidence quotes
- Metric hypothesis
- Suggested experiment
- "Why not now" or risk note

Success criteria:

- The output is more decision-like than summary-like.
- Each recommendation is traceable to user evidence.

### 4. Decision Brief Export

Purpose: provide a portfolio-ready final artifact.

Main elements:

- Problem summary
- Top user evidence
- Recommended roadmap
- Experiment plan
- Open questions

Success criteria:

- The export looks like something a PM would send to a founder or team.
- It visually demonstrates taste and structured thinking.

## AI Workflow

The AI workflow should be staged so the output is explainable:

1. Normalize reviews:
   - Extract rating, title, body, date, version if available.
   - Remove duplicate or empty reviews.
   - Keep original review text for citations.
2. Classify signals:
   - Assign one or more labels to each review.
   - Detect sentiment and urgency.
   - Identify possible user intent or usage scenario.
3. Cluster insights:
   - Group semantically similar reviews.
   - Name each cluster in product language.
   - Attach representative evidence.
4. Score opportunities:
   - Estimate frequency, severity, business impact, confidence, and effort.
   - Keep the scoring transparent, not mathematically overclaimed.
5. Generate roadmap cards:
   - Convert top opportunities into action-oriented product recommendations.
   - Include metrics and validation experiments.
6. Generate brief:
   - Summarize the reasoning in a polished one-page narrative.

The product should avoid pretending the AI knows more than the data supports. When confidence is low, it should say so and recommend further validation.

## Data Model

Review:

- id
- source
- rating
- title
- body
- date
- app_version
- normalized_text
- labels
- sentiment
- urgency
- cluster_id

InsightCluster:

- id
- name
- description
- labels
- review_count
- average_rating
- representative_quotes
- confidence
- suspected_user_scenario

RoadmapCard:

- id
- type: fix, improve, or explore
- title
- recommendation
- priority_score
- scoring_factors
- evidence_quotes
- target_metric
- validation_experiment
- risks
- confidence

## Visual Direction

The interface should feel like a sharp, modern PM decision workspace:

- Dense but calm layout
- High information clarity
- Strong typography hierarchy
- Minimal decorative elements
- Data cards, evidence quotes, and decision cards as the main visual identity
- Restrained palette with meaningful accent colors for signal categories

The strongest aesthetic moment should be the transition from messy review evidence to clean roadmap cards.

## Portfolio Narrative

Use this story in the AIPM portfolio:

1. Problem: small app teams collect user feedback but struggle to turn it into product decisions.
2. Insight: AI should not only summarize feedback; it should preserve evidence and help PMs make trade-offs.
3. Product: ReviewRoadmap Studio converts App Store reviews into insight clusters and roadmap cards.
4. AI design: the workflow separates classification, clustering, scoring, recommendation, and citation.
5. PM judgment: the product emphasizes what to do, what not to do, which metric to watch, and what experiment to run.
6. Result: a demo that shows product taste, user empathy, technical structure, and decision quality.

## Success Criteria

The portfolio product succeeds if an interviewer can understand within three minutes:

- Who the product serves
- Why the problem is real
- How AI adds value beyond summarization
- How the system supports product decisions
- Why the creator has both product taste and technical fluency

The demo should produce at least one compelling roadmap recommendation whose evidence can be traced back to source reviews.

## Risks and Mitigations

Risk: the product looks like a generic ChatGPT wrapper.

Mitigation: use structured dashboards, citations, scoring factors, and roadmap cards instead of an open-ended chat interface.

Risk: review scraping or live import is unreliable.

Mitigation: use a prepared sample dataset for the demo and frame live import as a later integration.

Risk: AI recommendations feel overconfident.

Mitigation: include confidence levels, counter-signals, and validation experiments.

Risk: the scope becomes too broad.

Mitigation: keep the MVP focused on iOS App Store reviews and one output: evidence-backed roadmap cards.

## Implementation Notes

Build the first version as a polished web app prototype with local sample data. The app should prioritize end-to-end demo quality over backend completeness.

Suggested stack:

- Frontend: Next.js or Vite React
- Styling: Tailwind CSS or the repo's existing design system
- AI layer: staged prompts or structured outputs
- Data: static JSON sample reviews for the first demo

The implementation should make it easy to later replace sample data with a real importer.
