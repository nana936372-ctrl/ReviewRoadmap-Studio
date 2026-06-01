import type { Language, RawReview, RoadmapCard, Sentiment, SignalLabel, Urgency } from '../domain/types';
import type { ConfidenceBaseFactors } from '../lib/analysis/scoring';

function englishConfidenceBaseBreakdown(baseFactors: ConfidenceBaseFactors, basePercent: number): string {
  return `${baseFactors.structuredReviewSource}% structured public-review baseline + ${baseFactors.starRating}% star rating + ${baseFactors.quotableText}% quotable text + ${baseFactors.productSignal}% product signal = ${basePercent}%`;
}

function chineseConfidenceBaseBreakdown(baseFactors: ConfidenceBaseFactors, basePercent: number): string {
  return `结构化公开评论基线 ${baseFactors.structuredReviewSource}% + 星级评分 ${baseFactors.starRating}% + 可引用文本 ${baseFactors.quotableText}% + 产品信号匹配 ${baseFactors.productSignal}% = ${basePercent}%`;
}

export const languageOptions: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' }
];

export const appCopy = {
  en: {
    languageLabel: 'Language',
    hero: {
      eyebrow: 'AI product decision assistant',
      body: 'Turn messy App Store reviews into insight clusters, evidence quotes, and roadmap decisions.',
      topDecisionLabel: 'Top decision',
      summaryLabel: 'Demo summary',
      reviewsAnalyzed: (count: number) => `${count} reviews analyzed`,
      insightClusters: (count: number) => `${count} insight clusters`,
      roadmapCards: (count: number) => `${count} roadmap cards`
    },
    reviewsPage: {
      open: 'View all reviews',
      eyebrow: 'Review records',
      title: 'All fetched reviews',
      description:
        'A complete readout of every review record currently loaded from the prepared sample or the public App Store feed.',
      back: 'Back to overview',
      summaryLabel: 'Fetched review summary',
      fetchedCount: (count: number) => `${count} fetched reviews`,
      analyzedCount: (count: number) => `${count} used in analysis`,
      empty: 'No fetched reviews to show yet.',
      rating: (rating: number) => `${rating}/5`,
      version: 'Version',
      source: 'Source',
      untitled: 'Untitled review',
      sourceValues: {
        'app-store-sample': 'app-store-sample',
        'app-store-live': 'app-store-live'
      } satisfies Record<RawReview['source'], string>
    },
    methodology: {
      open: 'Open calculation guide',
      eyebrow: 'Methodology',
      title: 'Calculation guide',
      description:
        'A single reference page for every visible number, percentage, score, and evaluation dimension in the demo.',
      back: 'Back to overview',
      currentSample: 'Current sample',
      principle: 'Principle',
      calculation: 'Calculation',
      dimensions: 'Dimensions',
      modules: {
        dataScope: {
          title: 'Hero and sample scope',
          body: 'The hero numbers come directly from the analyzed sample and generated artifacts.',
          reviews: (count: number) => `${count} normalized review records after cleaning empty input.`,
          clusters: (count: number) => `${count} insight clusters grouped by the primary product signal.`,
          roadmapCards: (count: number) => `${count} roadmap cards generated as Fix, Improve, and Explore decisions.`,
          topDecision: (score: number) => `Top decision displays the first roadmap card and its ${score} priority score.`
        },
        averageRating: {
          title: 'Rating formula',
          body: 'Average rating and theme rating use the same formula; only the review scope changes.',
          formula: ({ ratingTotal, reviewCount, result }: { ratingTotal: string; reviewCount: number; result: string }) =>
            `Unified formula: rating total / review count. Scope: all reviews. Current: ${ratingTotal} / ${reviewCount} = ${result}`,
          dimensions:
            'Global average rating uses all analyzed reviews; theme rating uses only reviews assigned to that theme.'
        },
        confidence: {
          title: 'Confidence',
          body: 'Used by insight clusters and roadmap cards to show how much repeated evidence supports the signal.',
          formula: ({
            baseFactors,
            basePercent,
            capPercent,
            perReviewPercent,
            rawPercent,
            resultPercent,
            reviewCount
          }: {
            baseFactors: ConfidenceBaseFactors;
            basePercent: number;
            capPercent: number;
            perReviewPercent: number;
            rawPercent: number;
            resultPercent: number;
            reviewCount: number;
          }) =>
            `Confidence formula: min(${capPercent}%, initial confidence ${basePercent}% + matching reviews x ${perReviewPercent}%). Initial confidence: ${englishConfidenceBaseBreakdown(
              baseFactors,
              basePercent
            )}. Current: min(${capPercent}%, ${basePercent}% + ${reviewCount} x ${perReviewPercent}%) = ${resultPercent}%. Raw before cap: ${rawPercent}%.`,
          dimensions:
            'Initial confidence comes from review data quality; matching review count adds evidence strength; the cap prevents false certainty.'
        },
        themeRating: {
          title: 'Theme rating scope',
          body: 'This is the same rating formula applied only to reviews inside one insight cluster.',
          formula: ({ ratingTotal, reviewCount, result }: { ratingTotal: string; reviewCount: number; result: string }) =>
            `Unified formula: rating total / review count. Scope: matching theme reviews. Current: ${ratingTotal} / ${reviewCount} = ${result}`,
          dimensions: 'The numerator and denominator both shrink to the current theme, which is why examples differ by card.'
        },
        sentiment: {
          title: 'Sentiment meter',
          body: 'The red, amber, and green bar translates classified review sentiment into a visual share.',
          formula: ({
            mixed,
            negative,
            positive,
            total
          }: {
            mixed: number;
            negative: number;
            positive: number;
            total: number;
          }) =>
            `Segment width = sentiment count / ${total} related sentiment signals. Current sample: negative ${negative}, mixed ${mixed}, positive ${positive}.`,
          dimensions: 'Negative means complaint or risk, mixed means needs validation, positive means confirmed value.'
        },
        priority: {
          title: 'Priority score',
          body: 'Used by roadmap cards to compare which opportunity should receive product attention first.',
          formula: ({
            businessImpact,
            confidence,
            effort,
            frequency,
            rawScore,
            result,
            severity
          }: {
            businessImpact: number;
            confidence: number;
            effort: number;
            frequency: number;
            rawScore: string;
            result: number;
            severity: number;
          }) =>
            `frequency 22% + severity 28% + impact 25% + confidence 15% - effort 10%. Current top card: (${frequency}, ${severity}, ${businessImpact}, ${confidence}, ${effort}) = ${rawScore}, normalized to ${result}.`,
          dimensions:
            'Frequency, severity, business impact, confidence, and effort are scored from 1 to 5; effort is subtracted.'
        },
        decisionDimensions: {
          title: 'Decision dimensions',
          body: 'Recommendation, metric, experiment, and risk blocks are not free text; each one keeps a rationale and evidence link.',
          formula: (count: number) => `${count} evaluation dimensions are attached to the top decision detail view.`,
          dimensions: 'Checks recommendation basis, metric fit, experiment quality, and risk control.'
        },
        workflow: {
          title: 'AI workflow numbers',
          body: 'The workflow stage count describes the explainable analysis chain, not an AI confidence score.',
          formula: (count: number) => `${count} stages: normalize, classify, cluster, score, and generate roadmap cards.`,
          dimensions: 'Each stage exposes the evaluation method used before the next stage consumes its output.'
        },
        brief: {
          title: 'Brief evaluation',
          body: 'The one-page brief is generated from the selected top roadmap decision and its supporting cluster.',
          formula: (count: number) => `${count} brief dimensions are shown: top score factors plus decision, metric, experiment, and risk checks.`,
          dimensions: 'Brief fields reuse the same evidence, scoring dimensions, metric, experiment, and risk rationale.'
        }
      }
    },
    input: {
      eyebrow: 'Data source',
      title: 'Analyze App Store reviews',
      description:
        'Paste a public App Store URL to analyze live Apple review RSS data, or keep the prepared sample for demo mode.',
      appStoreUrl: 'App Store URL',
      settingsLabel: 'Review analysis settings',
      category: 'Category',
      categoryOptions: {
        aiWriting: 'AI writing app',
        productivity: 'Productivity app',
        learning: 'Language learning app',
        knowledge: 'Knowledge management app'
      },
      timeWindow: 'Time window',
      timeWindowOptions: {
        all: 'All fetched reviews',
        'may-2026': 'May 2026',
        'last-30': 'Last 30 days',
        'last-90': 'Last 90 days'
      },
      reviewSample: 'Review sample',
      reviewSampleNote: 'Optional upload control; URL analysis uses Apple’s public customer-review RSS feed.',
      advancedSettings: 'Data controls',
      analyze: 'Analyze Reviews',
      analyzing: 'Analyzing...',
      summary: 'Prepared sample: 18 review-shaped records - AI writing category',
      status: {
        sampleTitle: 'Prepared demo sample',
        loadingTitle: 'Fetching App Store reviews',
        loadingDetail: 'Reading the public Apple customer-review feed...',
        sources: {
          appStorePage: 'App Store page data',
          appleRss: ({
            fetchedPageCount,
            maxPages
          }: {
            fetchedPageCount: number;
            maxPages: number;
          }) => `Apple RSS (${fetchedPageCount}/${maxPages} pages)`
        },
        liveTitle: 'Live App Store reviews',
        liveDetail: ({
          fetchedCount,
          filteredCount,
          sourceName,
          timeWindow
        }: {
          fetchedCount: number;
          filteredCount: number;
          sourceName: string;
          timeWindow: string;
        }) => `${fetchedCount} fetched from ${sourceName}; ${filteredCount} matched ${timeWindow} and are used for analysis.`,
        emptyTitle: 'No reviews in selected window',
        emptyDetail: ({
          fetchedCount,
          sourceName,
          timeWindow
        }: {
          fetchedCount: number;
          sourceName: string;
          timeWindow: string;
        }) => `${fetchedCount} fetched from ${sourceName}, but 0 matched ${timeWindow}. Try All fetched reviews or a wider window.`,
        errorTitle: 'Live review fetch failed',
        unknownError: 'Unknown fetch error.'
      }
    },
    dashboard: {
      eyebrow: 'Evidence synthesis',
      title: 'Review intelligence',
      description:
        'A structured readout of recurring user signals from the reviews currently included in the selected analysis window.',
      noRating: 'No rating yet',
      averageRating: (rating: string) => `${rating} avg rating`,
      noEvidence: 'No review evidence available yet.',
      reviews: (count: number) => `${count} reviews`,
      confidence: (value: number) => `${value}% confidence`,
      rating: (value: string) => `${value} rating`,
      averageRatingCalculation: ({
        ratingTotal,
        reviewCount,
        result
      }: {
        ratingTotal: string;
        reviewCount: number;
        result: string;
      }) => `${ratingTotal} / ${reviewCount} = ${result}`,
      confidenceCalculation: ({
        basePercent,
        capPercent,
        perReviewPercent,
        resultPercent,
        reviewCount
      }: {
        baseFactors: ConfidenceBaseFactors;
        basePercent: number;
        capPercent: number;
        perReviewPercent: number;
        resultPercent: number;
        reviewCount: number;
      }) => {
        return `min(${capPercent}%, ${basePercent}% + ${reviewCount} x ${perReviewPercent}%) = ${resultPercent}%`;
      },
      ratingCalculation: ({
        ratingTotal,
        reviewCount,
        result
      }: {
        ratingTotal: string;
        reviewCount: number;
        result: string;
      }) =>
        `${ratingTotal} / ${reviewCount} = ${result}`,
      signalMapLabel: 'Signal map',
      sentimentBalanceLabel: 'Sentiment balance',
      sentimentLabel: 'Sentiment by theme',
      evidenceLabel: 'Representative review evidence',
      reviewEvaluationTitle: 'Review evaluation dimensions',
      reviewEvaluationHint: 'Why this review is useful evidence',
      table: {
        theme: 'Theme',
        negative: 'Negative',
        mixed: 'Mixed',
        positive: 'Positive'
      },
      stars: (rating: number) => `${rating} stars`,
      reviewDimensionLabels: {
        starRating: 'Star rating',
        productSignals: 'Product signals',
        sentiment: 'Sentiment',
        urgency: 'Urgency',
        evidenceUse: 'Evidence use'
      },
      sentimentValues: {
        negative: 'Negative',
        mixed: 'Mixed',
        positive: 'Positive'
      } satisfies Record<Sentiment, string>,
      sentimentMeanings: {
        negative: 'Red means complaints, bugs, churn risk, or trust-damaging feedback.',
        mixed: 'Amber means mixed intent, unclear sentiment, or feedback that needs validation.',
        positive: 'Green means delight, value confirmation, or evidence worth amplifying.'
      } satisfies Record<Sentiment, string>,
      urgencyValues: {
        low: 'Low',
        medium: 'Medium',
        high: 'High'
      } satisfies Record<Urgency, string>,
      evidenceUseValue: 'Representative quote for clustering and roadmap scoring',
      signalLabels: {
        bug: 'bug',
        feature_request: 'feature_request',
        onboarding_friction: 'onboarding_friction',
        pricing_friction: 'pricing_friction',
        retention_risk: 'retention_risk',
        delight: 'delight'
      } satisfies Record<SignalLabel, string>
    },
    roadmap: {
      eyebrow: 'Decision output',
      title: 'Roadmap decisions',
      description:
        'Each recommendation is generated from the current analysis-window clusters, with evidence, scoring logic, and the next validation step preserved.',
      empty: 'No roadmap decisions yet. Add review evidence to generate recommendations.',
      typeLabels: {
        fix: 'Fix',
        improve: 'Improve',
        explore: 'Explore'
      } satisfies Record<RoadmapCard['type'], string>,
      factorLabels: {
        frequency: 'Frequency',
        severity: 'Severity',
        businessImpact: 'Business impact',
        confidence: 'Confidence',
        effort: 'Effort'
      } satisfies Record<keyof RoadmapCard['scoringFactors'], string>,
      confidence: (value: number) => `${value}% confidence`,
      confidenceCalculation: ({
        basePercent,
        capPercent,
        perReviewPercent,
        resultPercent,
        reviewCount
      }: {
        baseFactors: ConfidenceBaseFactors;
        basePercent: number;
        capPercent: number;
        perReviewPercent: number;
        resultPercent: number;
        reviewCount: number;
      }) => {
        return `min(${capPercent}%, ${basePercent}% + ${reviewCount} x ${perReviewPercent}%) = ${resultPercent}%`;
      },
      scoringFactors: (type: string) => `${type} scoring factors`,
      explainPriorityScore: 'Explain priority score',
      priorityFormula: 'Priority formula',
      evaluationDimensions: 'Evaluation dimensions',
      recommendationDimensions: 'Recommendation dimensions',
      metricDimensions: 'Metric dimensions',
      experimentDimensions: 'Experiment dimensions',
      riskDimensions: 'Risk dimensions',
      dimensionWeight: (value: number) => `Weight ${Math.round(value * 100)}%`,
      decisionNotes: 'Decision notes',
      metric: 'Metric',
      validationExperiment: 'Validation experiment',
      risk: 'Risk',
      evidence: 'Evidence'
    },
    scoreDetail: {
      eyebrow: 'Evaluation detail',
      title: 'Priority score details',
      back: 'Back to overview',
      formula: 'Priority formula',
      factorContribution: 'Factor contribution',
      scoreDimensions: 'Score dimensions',
      recommendationDimensions: 'Recommendation dimensions',
      metricDimensions: 'Metric dimensions',
      experimentDimensions: 'Experiment dimensions',
      riskDimensions: 'Risk dimensions',
      evidence: 'Referenced evidence',
      scoreLabel: (value: number) => `${value} priority score`,
      dimensionWeight: (value: number) => `Weight ${Math.round(value * 100)}%`
    },
    workflow: {
      eyebrow: 'AI workflow',
      title: 'Explainable analysis chain',
      description:
        'The demo separates classification, clustering, scoring, and recommendation so the AI does not feel like a black box.',
      stages: (count: number) => `${count} stages`,
      evaluationMethod: 'Evaluation method',
      dimensions: 'Evaluation dimensions'
    },
    brief: {
      eyebrow: 'Portfolio-ready artifact',
      title: 'One-page product decision brief',
      decisionMemo: 'Decision memo',
      empty: 'No decision brief yet. Add reviews to generate a portfolio-ready recommendation.',
      download: 'Download brief',
      markdownTitle: 'ReviewRoadmap Decision Brief',
      context: 'Context',
      problemSignal: 'Problem signal',
      recommendedDecision: 'Recommended decision',
      userScenario: 'User scenario',
      whyNow: 'Why now',
      successMetric: 'Success metric',
      evidence: 'Evidence',
      nextExperiment: 'Next experiment',
      riskAndTradeoff: 'Risk and tradeoff',
      evaluationDimensions: 'Evaluation dimensions',
      nextSteps: 'Next steps',
      contextBody: ({
        clusterCount,
        decisionTitle,
        reviewCount,
        signalName
      }: {
        clusterCount: number;
        decisionTitle: string;
        reviewCount: number;
        signalName: string;
      }) =>
        `This brief is generated from ${reviewCount} analyzed reviews and ${clusterCount} insight clusters. It focuses on "${decisionTitle}" because the top roadmap opportunity is supported by "${signalName}".`,
      whyNowBody: ({
        businessImpact,
        confidencePercent,
        priorityScore,
        severity,
        signalName,
        supportingReviewCount
      }: {
        businessImpact: number;
        confidencePercent: number;
        priorityScore: number;
        severity: number;
        signalName: string;
        supportingReviewCount: number;
      }) =>
        `"${signalName}" has ${supportingReviewCount} matching reviews, ${confidencePercent}% confidence, severity ${severity}/5, impact ${businessImpact}/5, and a ${priorityScore} priority score.`,
      nextStepItems: ({
        signalName,
        targetMetric,
        validationExperiment
      }: {
        signalName: string;
        targetMetric: string;
        validationExperiment: string;
      }) => [
        `Review the source quotes behind "${signalName}" and confirm the pattern with support or interview notes.`,
        `Create a baseline for this metric: ${targetMetric}`,
        `Run the proposed validation: ${validationExperiment}`
      ],
      noEvidence: 'No direct evidence quote available.'
    }
  },
  zh: {
    languageLabel: '语言',
    hero: {
      eyebrow: 'AI 产品决策助手',
      body: '把杂乱的 App Store 评论转化为洞察聚类、证据引用和路线图决策。',
      topDecisionLabel: '首要决策',
      summaryLabel: '演示摘要',
      reviewsAnalyzed: (count: number) => `已分析 ${count} 条评论`,
      insightClusters: (count: number) => `${count} 个洞察聚类`,
      roadmapCards: (count: number) => `${count} 张路线图卡片`
    },
    reviewsPage: {
      open: '查看全部评论',
      eyebrow: '评论记录',
      title: '全部获取评论',
      description: '展示当前从内置样本或公开 App Store RSS 中获取到的每一条评论记录。',
      back: '返回总览',
      summaryLabel: '获取评论摘要',
      fetchedCount: (count: number) => `已获取 ${count} 条评论`,
      analyzedCount: (count: number) => `用于分析 ${count} 条`,
      empty: '暂无已获取评论。',
      rating: (rating: number) => `${rating}/5`,
      version: '版本',
      source: '来源',
      untitled: '未命名评论',
      sourceValues: {
        'app-store-sample': '内置样本',
        'app-store-live': '真实 App Store'
      } satisfies Record<RawReview['source'], string>
    },
    methodology: {
      open: '打开计算说明',
      eyebrow: '方法说明',
      title: '计算说明',
      description: '集中解释 demo 中所有可见数字、百分比、评分和评估维度的来源。',
      back: '返回总览',
      currentSample: '当前样本',
      principle: '计算原理',
      calculation: '计算方式',
      dimensions: '评估维度',
      modules: {
        dataScope: {
          title: '首页与样本范围',
          body: '首页数字直接来自当前评论样本和生成后的分析产物。',
          reviews: (count: number) => `清洗空输入后保留 ${count} 条标准化评论记录。`,
          clusters: (count: number) => `按主要产品信号聚合出 ${count} 个洞察聚类。`,
          roadmapCards: (count: number) => `生成 ${count} 张路线图卡片，对应修复、优化和探索三类决策。`,
          topDecision: (score: number) => `首要决策展示第一张路线图卡片及其 ${score} 分优先级。`
        },
        averageRating: {
          title: '评分统一公式',
          body: '平均评分和主题评分使用同一个公式，只是评论范围不同。',
          formula: ({ ratingTotal, reviewCount, result }: { ratingTotal: string; reviewCount: number; result: string }) =>
            `统一公式：评分总和 / 评论数。范围：全部评论。当前：${ratingTotal} / ${reviewCount} = ${result}`,
          dimensions: '全局平均评分使用全部已分析评论；主题评分只使用归入该主题的评论。'
        },
        confidence: {
          title: '置信度',
          body: '用于洞察聚类和路线图卡片，表示该信号有多少重复证据支撑。',
          formula: ({
            baseFactors,
            basePercent,
            capPercent,
            perReviewPercent,
            rawPercent,
            resultPercent,
            reviewCount
          }: {
            baseFactors: ConfidenceBaseFactors;
            basePercent: number;
            capPercent: number;
            perReviewPercent: number;
            rawPercent: number;
            resultPercent: number;
            reviewCount: number;
          }) =>
            `置信度公式：min(${capPercent}%, 初始置信度 ${basePercent}% + 相关评论数 x ${perReviewPercent}%)。初始置信度：${chineseConfidenceBaseBreakdown(
              baseFactors,
              basePercent
            )}。当前：min(${capPercent}%, ${basePercent}% + ${reviewCount} x ${perReviewPercent}%) = ${resultPercent}%。封顶前为 ${rawPercent}%。`,
          dimensions: '初始置信度来自评论数据质量；相关评论数增加证据强度；封顶用于避免把样本证据伪装成绝对确定。'
        },
        themeRating: {
          title: '主题评分范围',
          body: '这是同一个评分公式，只应用在一个洞察主题内部的评论上。',
          formula: ({ ratingTotal, reviewCount, result }: { ratingTotal: string; reviewCount: number; result: string }) =>
            `统一公式：评分总和 / 评论数。范围：当前主题相关评论。当前：${ratingTotal} / ${reviewCount} = ${result}`,
          dimensions: '分子和分母都会随当前主题变化，所以不同卡片的代入数字不同，但公式一致。'
        },
        sentiment: {
          title: '情绪条',
          body: '红、黄、绿分段条把分类后的评论情绪转成可视化占比。',
          formula: ({
            mixed,
            negative,
            positive,
            total
          }: {
            mixed: number;
            negative: number;
            positive: number;
            total: number;
          }) => `分段宽度 = 情绪数量 / ${total} 个相关情绪信号。当前样本：负向 ${negative}，混合 ${mixed}，正向 ${positive}。`,
          dimensions: '负向代表投诉或风险，混合代表需要验证，正向代表已被验证的价值。'
        },
        priority: {
          title: '优先级分数',
          body: '用于路线图卡片，帮助比较哪个机会应优先投入产品资源。',
          formula: ({
            businessImpact,
            confidence,
            effort,
            frequency,
            rawScore,
            result,
            severity
          }: {
            businessImpact: number;
            confidence: number;
            effort: number;
            frequency: number;
            rawScore: string;
            result: number;
            severity: number;
          }) =>
            `频次 22% + 严重度 28% + 业务影响 25% + 置信度 15% - 成本 10%。当前首要卡片：(${frequency}, ${severity}, ${businessImpact}, ${confidence}, ${effort}) = ${rawScore}，归一后为 ${result}。`,
          dimensions: '频次、严重度、业务影响、置信度和成本按 1 到 5 分评估；成本会从分数中扣除。'
        },
        decisionDimensions: {
          title: '决策评估维度',
          body: '建议、指标、实验和风险并不是自由文案，每一项都保留判断依据和证据连接。',
          formula: (count: number) => `首要决策详情页绑定 ${count} 个评估维度。`,
          dimensions: '检查建议依据、指标匹配、实验质量和风险控制。'
        },
        workflow: {
          title: 'AI 工作流数字',
          body: '工作流阶段数描述可解释分析链路，不是 AI 置信度。',
          formula: (count: number) => `${count} 个阶段：标准化、分类、聚类、评分、生成路线图卡片。`,
          dimensions: '每个阶段都展示评估方式，并把输出交给下一阶段使用。'
        },
        brief: {
          title: 'Brief 评估',
          body: '一页 Brief 来自首要路线图决策及其支持聚类。',
          formula: (count: number) => `Brief 展示 ${count} 个维度：核心评分因素，加上建议、指标、实验和风险判断。`,
          dimensions: 'Brief 字段复用相同证据、评分维度、指标、实验和风险依据。'
        }
      }
    },
    input: {
      eyebrow: '数据源',
      title: '分析 App Store 评论',
      description: '粘贴公开 App Store 链接即可读取 Apple 评论 RSS；也可以保留内置样本用于演示。',
      appStoreUrl: 'App Store 链接',
      settingsLabel: '评论分析设置',
      category: '品类',
      categoryOptions: {
        aiWriting: 'AI 写作应用',
        productivity: '效率应用',
        learning: '语言学习应用',
        knowledge: '知识管理应用'
      },
      timeWindow: '时间范围',
      timeWindowOptions: {
        all: '全部已获取评论',
        'may-2026': '2026 年 5 月',
        'last-30': '最近 30 天',
        'last-90': '最近 90 天'
      },
      reviewSample: '评论样本',
      reviewSampleNote: '可选上传入口；链接分析会使用 Apple 公开评论 RSS。',
      advancedSettings: '数据控制',
      analyze: '分析评论',
      analyzing: '分析中...',
      summary: '内置样本：18 条评论记录 - AI 写作品类',
      status: {
        sampleTitle: '内置演示样本',
        loadingTitle: '正在获取 App Store 评论',
        loadingDetail: '正在读取 Apple 公开评论 RSS...',
        sources: {
          appStorePage: 'App Store 页面数据',
          appleRss: ({
            fetchedPageCount,
            maxPages
          }: {
            fetchedPageCount: number;
            maxPages: number;
          }) => `Apple RSS（${fetchedPageCount}/${maxPages} 页）`
        },
        liveTitle: '真实 App Store 评论',
        liveDetail: ({
          fetchedCount,
          filteredCount,
          sourceName,
          timeWindow
        }: {
          fetchedCount: number;
          filteredCount: number;
          sourceName: string;
          timeWindow: string;
        }) => `已通过${sourceName}获取 ${fetchedCount} 条；${timeWindow} 匹配 ${filteredCount} 条并用于分析。`,
        emptyTitle: '所选时间范围内暂无评论',
        emptyDetail: ({
          fetchedCount,
          sourceName,
          timeWindow
        }: {
          fetchedCount: number;
          sourceName: string;
          timeWindow: string;
        }) => `已通过${sourceName}获取 ${fetchedCount} 条，但 ${timeWindow} 匹配 0 条。可以切换到“全部已获取评论”或更宽的时间范围。`,
        errorTitle: '真实评论获取失败',
        unknownError: '未知抓取错误。'
      }
    },
    dashboard: {
      eyebrow: '证据综合',
      title: '评论智能分析',
      description: '基于当前时间范围内用于分析的评论，结构化呈现反复出现的用户信号。',
      noRating: '暂无评分',
      averageRating: (rating: string) => `${rating} 平均评分`,
      noEvidence: '暂无可用评论证据。',
      reviews: (count: number) => `${count} 条评论`,
      confidence: (value: number) => `${value}% 置信度`,
      rating: (value: string) => `${value} 评分`,
      averageRatingCalculation: ({
        ratingTotal,
        reviewCount,
        result
      }: {
        ratingTotal: string;
        reviewCount: number;
        result: string;
      }) => `${ratingTotal} / ${reviewCount} = ${result}`,
      confidenceCalculation: ({
        basePercent,
        capPercent,
        perReviewPercent,
        resultPercent,
        reviewCount
      }: {
        baseFactors: ConfidenceBaseFactors;
        basePercent: number;
        capPercent: number;
        perReviewPercent: number;
        resultPercent: number;
        reviewCount: number;
      }) => {
        return `min(${capPercent}%, ${basePercent}% + ${reviewCount} x ${perReviewPercent}%) = ${resultPercent}%`;
      },
      ratingCalculation: ({
        ratingTotal,
        reviewCount,
        result
      }: {
        ratingTotal: string;
        reviewCount: number;
        result: string;
      }) => `${ratingTotal} / ${reviewCount} = ${result}`,
      signalMapLabel: '信号地图',
      sentimentBalanceLabel: '情绪分布',
      sentimentLabel: '按主题查看情绪倾向',
      evidenceLabel: '代表性评论证据',
      reviewEvaluationTitle: '评论评估维度',
      reviewEvaluationHint: '为什么这条评论可作为证据',
      table: {
        theme: '主题',
        negative: '负向',
        mixed: '混合',
        positive: '正向'
      },
      stars: (rating: number) => `${rating} 星`,
      reviewDimensionLabels: {
        starRating: '星级评分',
        productSignals: '产品信号',
        sentiment: '情绪倾向',
        urgency: '紧急度',
        evidenceUse: '证据用途'
      },
      sentimentValues: {
        negative: '负向',
        mixed: '混合',
        positive: '正向'
      } satisfies Record<Sentiment, string>,
      sentimentMeanings: {
        negative: '红色代表投诉、缺陷、流失风险或损害信任的反馈。',
        mixed: '黄色代表意图混合、情绪不明确或需要继续验证的反馈。',
        positive: '绿色代表喜爱点、价值被验证或值得放大的正向证据。'
      } satisfies Record<Sentiment, string>,
      urgencyValues: {
        low: '低',
        medium: '中',
        high: '高'
      } satisfies Record<Urgency, string>,
      evidenceUseValue: '用于聚类和路线图评分的代表性引用',
      signalLabels: {
        bug: '缺陷',
        feature_request: '功能请求',
        onboarding_friction: '新手阻力',
        pricing_friction: '价格阻力',
        retention_risk: '留存风险',
        delight: '喜爱点'
      } satisfies Record<SignalLabel, string>
    },
    roadmap: {
      eyebrow: '决策输出',
      title: '路线图决策',
      description: '每条建议都来自当前时间范围内的聚类结果，并保留证据、评分逻辑和下一步验证动作。',
      empty: '还没有路线图决策。添加评论证据后即可生成建议。',
      typeLabels: {
        fix: '修复',
        improve: '优化',
        explore: '探索'
      } satisfies Record<RoadmapCard['type'], string>,
      factorLabels: {
        frequency: '频次',
        severity: '严重度',
        businessImpact: '业务影响',
        confidence: '置信度',
        effort: '成本'
      } satisfies Record<keyof RoadmapCard['scoringFactors'], string>,
      confidence: (value: number) => `${value}% 置信度`,
      confidenceCalculation: ({
        basePercent,
        capPercent,
        perReviewPercent,
        resultPercent,
        reviewCount
      }: {
        baseFactors: ConfidenceBaseFactors;
        basePercent: number;
        capPercent: number;
        perReviewPercent: number;
        resultPercent: number;
        reviewCount: number;
      }) => {
        return `min(${capPercent}%, ${basePercent}% + ${reviewCount} x ${perReviewPercent}%) = ${resultPercent}%`;
      },
      scoringFactors: (type: string) => `${type}评分因素`,
      explainPriorityScore: '解释优先级分数',
      priorityFormula: '优先级公式',
      evaluationDimensions: '评估维度',
      recommendationDimensions: '建议评估维度',
      metricDimensions: '指标评估维度',
      experimentDimensions: '实验评估维度',
      riskDimensions: '风险评估维度',
      dimensionWeight: (value: number) => `权重 ${Math.round(value * 100)}%`,
      decisionNotes: '决策备注',
      metric: '指标',
      validationExperiment: '验证实验',
      risk: '风险',
      evidence: '证据'
    },
    scoreDetail: {
      eyebrow: '评估详情',
      title: '优先级评分详情',
      back: '返回总览',
      formula: '优先级公式',
      factorContribution: '因素贡献',
      scoreDimensions: '评分维度',
      recommendationDimensions: '建议评估维度',
      metricDimensions: '指标评估维度',
      experimentDimensions: '实验评估维度',
      riskDimensions: '风险评估维度',
      evidence: '引用证据',
      scoreLabel: (value: number) => `${value} 优先级分数`,
      dimensionWeight: (value: number) => `权重 ${Math.round(value * 100)}%`
    },
    workflow: {
      eyebrow: 'AI 工作流',
      title: '可解释分析链路',
      description: 'Demo 将分类、聚类、评分和建议生成拆开呈现，避免让 AI 输出变成黑箱。',
      stages: (count: number) => `${count} 个阶段`,
      evaluationMethod: '评估方式',
      dimensions: '评估维度'
    },
    brief: {
      eyebrow: '作品集产物',
      title: '一页产品决策 Brief',
      decisionMemo: '决策备忘录',
      empty: '还没有决策 brief。添加评论后即可生成适合作品集展示的建议。',
      download: '下载 Brief',
      markdownTitle: 'ReviewRoadmap 产品决策 Brief',
      context: '背景',
      problemSignal: '问题信号',
      recommendedDecision: '推荐决策',
      userScenario: '用户场景',
      whyNow: '为什么现在做',
      successMetric: '成功指标',
      evidence: '证据',
      nextExperiment: '下一步实验',
      riskAndTradeoff: '风险与取舍',
      evaluationDimensions: '评估维度',
      nextSteps: '下一步行动',
      contextBody: ({
        clusterCount,
        decisionTitle,
        reviewCount,
        signalName
      }: {
        clusterCount: number;
        decisionTitle: string;
        reviewCount: number;
        signalName: string;
      }) =>
        `这份 brief 基于当前 ${reviewCount} 条已分析评论和 ${clusterCount} 个洞察聚类生成，聚焦「${decisionTitle}」，因为最高优先级机会来自「${signalName}」。`,
      whyNowBody: ({
        businessImpact,
        confidencePercent,
        priorityScore,
        severity,
        signalName,
        supportingReviewCount
      }: {
        businessImpact: number;
        confidencePercent: number;
        priorityScore: number;
        severity: number;
        signalName: string;
        supportingReviewCount: number;
      }) =>
        `「${signalName}」下有 ${supportingReviewCount} 条相关评论，置信度 ${confidencePercent}%，严重度 ${severity}/5，业务影响 ${businessImpact}/5，优先级分数 ${priorityScore}。`,
      nextStepItems: ({
        signalName,
        targetMetric,
        validationExperiment
      }: {
        signalName: string;
        targetMetric: string;
        validationExperiment: string;
      }) => [
        `复核「${signalName}」背后的原始评论，并用客服记录或访谈确认是否为稳定模式。`,
        `为成功指标建立当前基线：${targetMetric}`,
        `执行验证实验：${validationExperiment}`
      ],
      noEvidence: '暂无直接证据引用。'
    }
  }
} as const;

export type AppCopy = (typeof appCopy)[Language];
