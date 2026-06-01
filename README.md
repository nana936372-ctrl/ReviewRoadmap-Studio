# ReviewRoadmap Studio

ReviewRoadmap Studio is an AI product decision assistant for app teams. It analyzes App Store-style user reviews and turns them into structured insight clusters, evidence-backed roadmap decisions, score explanations, and a downloadable product decision brief.

The current version includes prepared sample data and can also fetch recent public App Store reviews through Apple's customer-review RSS feed. No external API key is required.

## Features

- Analyze prepared samples or live public App Store review links.
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
3. Keep the prepared sample URL or paste a public App Store URL.
4. Choose a time window and run the review analysis.
5. Inspect insight clusters, sentiment distribution, confidence, and topic ratings.
6. Review roadmap decisions across Fix, Improve, and Explore.
7. Click a priority score to see the scoring formula, factor contributions, and supporting evidence.
8. Open the calculation guide to see how visible scores and percentages are calculated.
9. Download the one-page product decision brief.

## Analysis Pipeline

```text
Sample or live App Store reviews
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

This project is a local product workflow prototype. It uses deterministic analysis logic with either prepared sample data or public App Store RSS review data. A production version would still need authentication, saved projects, stronger large-scale clustering evaluation, rate-limit handling, and operational monitoring.

---

# ReviewRoadmap Studio 中文说明

ReviewRoadmap Studio 是一个面向 App 团队的 AI 产品决策助手。它会分析类似 App Store 的用户评论，并转化为结构化洞察聚类、有证据支撑的路线图决策、评分解释和可下载的一页产品决策 Brief。

当前版本包含一组内置样本，也可以通过 Apple 公开 customer-review RSS 读取近期 App Store 评论，不需要外部 API key。

## 功能

- 分析内置样本或真实公开 App Store 评论链接。
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
3. 保留内置样本链接，或粘贴公开 App Store 链接。
4. 选择时间范围并运行评论分析。
5. 查看洞察聚类、情绪分布、置信度和主题评分。
6. 查看 Fix、Improve、Explore 三类路线图决策。
7. 点击优先级分数，查看评分公式、因素贡献和支持证据。
8. 打开计算说明页，查看页面中分数和百分比的计算方式。
9. 下载一页产品决策 Brief。

## 分析流程

```text
样本或真实 App Store 评论
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

这是一个本地产品工作流原型。当前版本使用确定性的分析逻辑，数据来源可以是内置样本，也可以是 Apple 公开 RSS 评论数据。生产版本仍需要补充身份验证、项目保存、更强的大规模聚类质量评估、限流处理和运行监控。
