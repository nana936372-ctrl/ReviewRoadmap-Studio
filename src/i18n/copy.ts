import type { Language, RoadmapCard, Sentiment, SignalLabel, Urgency } from '../domain/types';

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
      summaryLabel: 'Demo summary',
      reviewsAnalyzed: (count: number) => `${count} reviews analyzed`,
      insightClusters: (count: number) => `${count} insight clusters`,
      roadmapCards: (count: number) => `${count} roadmap cards`
    },
    input: {
      eyebrow: 'Demo data source',
      title: 'Analyze an App Store review sample',
      description:
        'This prototype uses a prepared review sample for a fictional AI writing app, shaped like public App Store feedback.',
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
        may2026: 'May 2026 sample',
        last30: 'Last 30 days',
        last90: 'Last 90 days'
      },
      reviewSample: 'Review sample',
      reviewSampleNote: 'Optional upload control; this demo uses prepared sample data.',
      analyze: 'Analyze Reviews',
      summary: '18 review-shaped records - AI writing category - May 2026 sample'
    },
    dashboard: {
      eyebrow: 'Evidence synthesis',
      title: 'Review intelligence',
      description: 'A structured readout of recurring user signals before the product makes roadmap recommendations.',
      noRating: 'No rating yet',
      averageRating: (rating: string) => `${rating} avg rating`,
      noEvidence: 'No review evidence available yet.',
      reviews: (count: number) => `${count} reviews`,
      confidence: (value: number) => `${value}% confidence`,
      rating: (value: string) => `${value} rating`,
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
      description: 'Each recommendation preserves evidence, scoring logic, and the next validation step.',
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
      scoringFactors: (type: string) => `${type} scoring factors`,
      explainPriorityScore: 'Explain priority score',
      priorityFormula: 'Priority formula',
      evaluationDimensions: 'Evaluation dimensions',
      recommendationDimensions: 'Recommendation dimensions',
      metricDimensions: 'Metric dimensions',
      experimentDimensions: 'Experiment dimensions',
      riskDimensions: 'Risk dimensions',
      dimensionWeight: (value: number) => `Weight ${Math.round(value * 100)}%`,
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
      contextBody:
        'This brief turns review-shaped public feedback into a product decision for a fictional AI writing app.',
      whyNowBody:
        'The top opportunity combines repeated evidence, high severity, and a direct trust or retention consequence.',
      nextStepItems: [
        'Confirm the top evidence theme with support or interview notes.',
        'Ship the smallest validated intervention for the selected segment.',
        'Review the success metric after the experiment window closes.'
      ],
      noEvidence: 'No direct evidence quote available.'
    }
  },
  zh: {
    languageLabel: '语言',
    hero: {
      eyebrow: 'AI 产品决策助手',
      body: '把杂乱的 App Store 评论转化为洞察聚类、证据引用和路线图决策。',
      summaryLabel: '演示摘要',
      reviewsAnalyzed: (count: number) => `已分析 ${count} 条评论`,
      insightClusters: (count: number) => `${count} 个洞察聚类`,
      roadmapCards: (count: number) => `${count} 张路线图卡片`
    },
    input: {
      eyebrow: '演示数据源',
      title: '分析 App Store 评论样本',
      description: '这个原型使用一组为虚构 AI 写作应用准备的评论样本，结构接近公开 App Store 反馈。',
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
        may2026: '2026 年 5 月样本',
        last30: '最近 30 天',
        last90: '最近 90 天'
      },
      reviewSample: '评论样本',
      reviewSampleNote: '可选上传入口；当前 demo 使用准备好的样例数据。',
      analyze: '分析评论',
      summary: '18 条评论样本 - AI 写作品类 - 2026 年 5 月样本'
    },
    dashboard: {
      eyebrow: '证据综合',
      title: '评论智能分析',
      description: '在生成路线图建议前，先结构化呈现反复出现的用户信号。',
      noRating: '暂无评分',
      averageRating: (rating: string) => `${rating} 平均评分`,
      noEvidence: '暂无可用评论证据。',
      reviews: (count: number) => `${count} 条评论`,
      confidence: (value: number) => `${value}% 置信度`,
      rating: (value: string) => `${value} 评分`,
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
      description: '每条建议都保留证据、评分逻辑和下一步验证动作。',
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
      scoringFactors: (type: string) => `${type}评分因素`,
      explainPriorityScore: '解释优先级分数',
      priorityFormula: '优先级公式',
      evaluationDimensions: '评估维度',
      recommendationDimensions: '建议评估维度',
      metricDimensions: '指标评估维度',
      experimentDimensions: '实验评估维度',
      riskDimensions: '风险评估维度',
      dimensionWeight: (value: number) => `权重 ${Math.round(value * 100)}%`,
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
      contextBody: '这份 brief 将接近公开 App Store 反馈的评论样本转化为一个 AI 写作应用的产品决策。',
      whyNowBody: '首要机会同时具备重复证据、高严重度，以及对信任或留存的直接影响。',
      nextStepItems: [
        '用客服记录或用户访谈确认最高优先级证据主题。',
        '面向选定用户场景发布最小可验证干预。',
        '在实验窗口结束后复盘成功指标。'
      ],
      noEvidence: '暂无直接证据引用。'
    }
  }
} as const;

export type AppCopy = (typeof appCopy)[Language];
