# ReviewRoadmap Studio

ReviewRoadmap Studio is an AI product decision assistant for app teams. It analyzes App Store-style user reviews and turns them into structured insight clusters, evidence-backed roadmap decisions, score explanations, and a downloadable product decision brief.

The current version uses prepared sample data for a fictional AI writing app, so the full workflow can be run locally without external API keys.

## Features

- Analyze review-shaped App Store feedback.
- Normalize reviews and classify product signals.
- Cluster signals into product-readable insight themes.
- Generate Fix, Improve, and Explore roadmap recommendations.
- Explain rating, confidence, sentiment, and priority score calculations.
- Show evidence quotes and evaluation dimensions for each decision.
- Export a one-page product decision brief as Markdown.
- Switch the interface between English and Chinese.

## Product Flow

1. Open the app and review the current top decision.
2. Choose the interface language.
3. Review the sample App Store input settings.
4. Run the review analysis.
5. Inspect insight clusters, sentiment distribution, confidence, and topic ratings.
6. Review roadmap decisions across Fix, Improve, and Explore.
7. Click a priority score to see the scoring formula, factor contributions, and supporting evidence.
8. Open the calculation guide to see how visible scores and percentages are calculated.
9. Download the one-page product decision brief.

## Analysis Pipeline

```text
Raw reviews
  -> Normalize text
  -> Classify product signals
  -> Cluster insights
  -> Score opportunities
  -> Generate roadmap cards
  -> Create product decision brief
```

## Local Development

```powershell
npm install
npm run dev
```

The local dev server is usually available at:

```text
http://127.0.0.1:5173/
```

## Verification

```powershell
npm test -- --run
npm run build
```

## Current Scope

This project is a local product workflow prototype. It currently uses sample review data and deterministic analysis logic. A production version would need live review ingestion, authentication, saved projects, larger-scale clustering evaluation, and operational monitoring.

---

# ReviewRoadmap Studio 中文说明

ReviewRoadmap Studio 是一个面向 App 团队的 AI 产品决策助手。它会分析类似 App Store 的用户评论，并转化为结构化洞察聚类、有证据支撑的路线图决策、评分解释和可下载的一页产品决策 Brief。

当前版本使用一组为虚构 AI 写作应用准备的样本数据，因此不需要外部 API key，也可以在本地完整运行流程。

## 功能

- 分析 App Store 风格的评论反馈。
- 标准化评论文本，并分类产品信号。
- 将信号聚合成产品团队可理解的洞察主题。
- 生成 Fix、Improve、Explore 三类路线图建议。
- 解释评分、置信度、情绪条和优先级分数的计算方式。
- 为每个决策展示证据引用和评估维度。
- 将一页产品决策 Brief 导出为 Markdown。
- 支持英文和中文界面切换。

## 产品使用流程

1. 打开应用，先查看当前首要决策。
2. 选择界面语言。
3. 查看样本 App Store 输入设置。
4. 运行评论分析。
5. 查看洞察聚类、情绪分布、置信度和主题评分。
6. 查看 Fix、Improve、Explore 三类路线图决策。
7. 点击优先级分数，查看评分公式、因素贡献和支持证据。
8. 打开计算说明页，查看页面中分数和百分比的计算方式。
9. 下载一页产品决策 Brief。

## 分析流程

```text
原始评论
  -> 标准化文本
  -> 分类产品信号
  -> 聚类洞察
  -> 评估机会优先级
  -> 生成路线图卡片
  -> 创建产品决策 Brief
```

## 本地开发

```powershell
npm install
npm run dev
```

本地开发服务通常运行在：

```text
http://127.0.0.1:5173/
```

## 验证

```powershell
npm test -- --run
npm run build
```

## 当前范围

这是一个本地产品工作流原型。当前版本使用样本评论数据和确定性的分析逻辑。生产版本还需要补充真实评论接入、身份验证、项目保存、更大规模的聚类质量评估和运行监控。
