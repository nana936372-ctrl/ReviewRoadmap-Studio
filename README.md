# ReviewRoadmap Studio

ReviewRoadmap Studio is a portfolio-grade AI product decision assistant for indie app builders and early-stage app teams. The demo analyzes iOS App Store-style reviews for a fictional AI writing app and turns them into insight clusters, evidence-backed roadmap cards, and a downloadable one-page product decision brief.

The interface can be switched between English and Chinese. Original review quotes remain in English so the source evidence stays intact, while the product interpretation, roadmap cards, and decision brief are localized.

## Why This Exists

Small app teams often have user reviews but limited product research capacity. A generic AI summary is not enough; the useful product decision is what to fix, what to improve, what to explore, and what evidence supports that choice.

## Demo Flow

1. Review-shaped App Store sample data is loaded for a fictional AI writing app.
2. Reviews are normalized and classified into product signals.
3. Signals are clustered into PM-readable insight groups.
4. The system generates Fix, Improve, and Explore roadmap cards.
5. Each card includes evidence, scoring factors, a user scenario, a metric, a validation experiment, risks, and confidence.

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

## 中文作品集说明

投递或面试时可以使用 [ReviewRoadmap Studio 作品集说明](docs/portfolio-demo-guide.zh.md)。其中包含：

- 1 分钟中文讲解脚本。
- 真实业务价值说明。
- Demo 展示顺序。
- AIPM 能力映射。
- 数据可扩展性与当前限制。
