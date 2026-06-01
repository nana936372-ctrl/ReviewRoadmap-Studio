import type { EvaluationDimension, InsightCluster, Language, RoadmapCard, RoadmapType } from '../../domain/types';
import { PRIORITY_SCORE_WEIGHTS } from './scoring';

const TYPE_ORDER: RoadmapType[] = ['fix', 'improve', 'explore'];
const SCORE_WEIGHTS = PRIORITY_SCORE_WEIGHTS;

const SCORE_ORDER: Array<keyof RoadmapCard['scoringFactors']> = [
  'frequency',
  'severity',
  'businessImpact',
  'confidence',
  'effort'
];

const ROADMAP_COPY: Record<
  Language,
  Record<
    RoadmapType,
    {
      id: string;
      title: string;
      recommendation: string;
      targetMetric: string;
      validationExperiment: string;
      risks: string;
    }
  >
> = {
  en: {
    fix: {
      id: 'fix-reliability',
      title: 'Stabilize draft saving and export reliability',
      recommendation: 'Prioritize auto-save, export recovery, and sync-state visibility before expanding new writing modes.',
      targetMetric: 'Reduce one-star reliability complaints per 100 reviews.',
      validationExperiment:
        'Ship auto-save recovery messaging to 25% of users and compare lost-draft support mentions for two weeks.',
      risks: 'This may delay visible feature work, but trust issues can suppress retention and paid conversion.'
    },
    improve: {
      id: 'improve-workflow',
      title: 'Add one high-fit workflow export',
      recommendation:
        'Start with Notion-friendly export or preserved formatting because users already describe a clear downstream workflow.',
      targetMetric: 'Increase completed exports per activated user.',
      validationExperiment: 'Prototype one export path and measure whether users who export return within seven days.',
      risks: 'Export breadth can sprawl, so the first version should support one workflow with strong evidence.'
    },
    explore: {
      id: 'explore-onboarding',
      title: 'Test a guided first-draft setup',
      recommendation: 'Use a short guided setup that recommends one writing mode and one template based on the user goal.',
      targetMetric: 'Improve first-session draft completion rate.',
      validationExperiment: 'A/B test guided setup against the current template picker for new users.',
      risks: 'Guidance can feel restrictive to advanced users, so provide a skip path and keep the first question lightweight.'
    }
  },
  zh: {
    fix: {
      id: 'fix-reliability',
      title: '稳定草稿保存与导出可靠性',
      recommendation: '先修复自动保存、导出恢复和同步状态提示，再扩展新的写作模式。',
      targetMetric: '降低每 100 条评论中的一星可靠性投诉数。',
      validationExperiment: '向 25% 用户发布自动保存恢复提示，并对比两周内丢稿相关支持反馈的变化。',
      risks: '这会延后可见的新功能，但信任问题会压低留存和付费转化。'
    },
    improve: {
      id: 'improve-workflow',
      title: '增加一个高匹配度的工作流导出',
      recommendation: '优先做 Notion 友好导出或格式保留，因为用户已经明确描述了下游工作流。',
      targetMetric: '提升激活用户的人均完成导出次数。',
      validationExperiment: '原型验证一个导出路径，并观察完成导出的用户 7 天内是否回访。',
      risks: '导出能力容易失控扩张，因此第一版应只服务证据最强的一个工作流。'
    },
    explore: {
      id: 'explore-onboarding',
      title: '测试引导式首篇草稿设置',
      recommendation: '用一个轻量引导，根据用户目标推荐一个写作模式和一个模板。',
      targetMetric: '提升首次会话的草稿完成率。',
      validationExperiment: '对新用户 A/B 测试引导式设置与当前模板选择器。',
      risks: '引导可能让高级用户觉得受限，因此需要保留跳过路径，并让第一个问题足够轻。'
    }
  }
};

const SCORE_FORMULA: Record<Language, string> = {
  en: 'frequency 22% + severity 28% + impact 25% + confidence 15% - effort 10%. Each factor is scored from 1 to 5, then normalized to 100.',
  zh: '频次 22% + 严重度 28% + 业务影响 25% + 置信度 15% - 成本 10%。每个因子按 1 到 5 分计算，并归一到 100。'
};

const SCORE_DIMENSION_COPY: Record<
  Language,
  Record<
    keyof RoadmapCard['scoringFactors'],
    {
      label: string;
      value: (factor: number, cluster: InsightCluster) => string;
      rationale: (factor: number, cluster: InsightCluster) => string;
    }
  >
> = {
  en: {
    frequency: {
      label: 'Frequency',
      value: (_factor, cluster) => `${cluster.reviewCount} matching reviews`,
      rationale: (_factor, cluster) =>
        `Uses the number of reviews in the supporting cluster; ${cluster.reviewCount} matching reviews makes the signal easier to trust.`
    },
    severity: {
      label: 'Severity',
      value: (factor) => `${factor}/5`,
      rationale: (factor) => `Rates how strongly the issue blocks task completion or trust; this opportunity is set to ${factor}/5.`
    },
    businessImpact: {
      label: 'Impact',
      value: (factor) => `${factor}/5`,
      rationale: (factor) =>
        `Estimates likely effect on retention, activation, or paid conversion; this opportunity is set to ${factor}/5.`
    },
    confidence: {
      label: 'Confidence',
      value: (_factor, cluster) => `${Math.round(cluster.confidence * 100)}% cluster confidence`,
      rationale: (_factor, cluster) =>
        `Uses cluster confidence from repeated language patterns and evidence quality, currently ${Math.round(
          cluster.confidence * 100
        )}%.`
    },
    effort: {
      label: 'Effort',
      value: (factor) => `${factor}/5`,
      rationale: (factor) => `Subtracts delivery complexity from the score; estimated effort is ${factor}/5.`
    }
  },
  zh: {
    frequency: {
      label: '频次',
      value: (_factor, cluster) => `${cluster.reviewCount} 条相关评论`,
      rationale: (_factor, cluster) => `依据支持该聚类的评论数量；${cluster.reviewCount} 条相关评论说明该信号不是孤例。`
    },
    severity: {
      label: '严重度',
      value: (factor) => `${factor}/5`,
      rationale: (factor) => `评估问题对任务完成或信任的阻断程度；该机会为 ${factor}/5。`
    },
    businessImpact: {
      label: '业务影响',
      value: (factor) => `${factor}/5`,
      rationale: (factor) => `估计对留存、激活或付费转化的影响；该机会为 ${factor}/5。`
    },
    confidence: {
      label: '置信度',
      value: (_factor, cluster) => `${Math.round(cluster.confidence * 100)}% 聚类置信度`,
      rationale: (_factor, cluster) => `来自重复语言模式和证据质量，当前为 ${Math.round(cluster.confidence * 100)}%。`
    },
    effort: {
      label: '成本',
      value: (factor) => `${factor}/5`,
      rationale: (factor) => `从优先级中扣除交付复杂度；预估成本为 ${factor}/5。`
    }
  }
};

const DECISION_DIMENSION_COPY: Record<
  Language,
  {
    recommendation: Record<RoadmapType, (quote: string) => EvaluationDimension>;
    metric: Record<RoadmapType, (cluster: InsightCluster) => EvaluationDimension>;
    experiment: Record<RoadmapType, (cluster: InsightCluster) => EvaluationDimension>;
    risk: Record<RoadmapType, (cluster: InsightCluster) => EvaluationDimension>;
  }
> = {
  en: {
    recommendation: {
      fix: (quote) => ({
        id: 'recommendationBasis',
        label: 'Recommendation basis',
        value: 'Reliability before expansion',
        rationale: `The recommendation prioritizes stability because users describe lost work or blocked export flows, including "${quote}".`,
        evidence: [quote]
      }),
      improve: (quote) => ({
        id: 'recommendationBasis',
        label: 'Recommendation basis',
        value: 'Workflow fit before breadth',
        rationale: `The recommendation focuses on one export workflow because the evidence names a concrete downstream tool or publishing job, including "${quote}".`,
        evidence: [quote]
      }),
      explore: (quote) => ({
        id: 'recommendationBasis',
        label: 'Recommendation basis',
        value: 'Learning value before commitment',
        rationale: `The recommendation stays experimental because the evidence shows confusion or latent intent rather than a fully proven feature pull, including "${quote}".`,
        evidence: [quote]
      })
    },
    metric: {
      fix: (cluster) => ({
        id: 'metricFit',
        label: 'Metric fit',
        value: 'Complaint rate',
        rationale: `The metric tracks the same reliability theme as ${cluster.name}, so a real fix should reduce the complaint rate.`
      }),
      improve: (cluster) => ({
        id: 'metricFit',
        label: 'Metric fit',
        value: 'Completed workflow behavior',
        rationale: `The metric follows whether users complete the downstream workflow described by ${cluster.name}.`
      }),
      explore: (cluster) => ({
        id: 'metricFit',
        label: 'Metric fit',
        value: 'Activation behavior',
        rationale: `The metric checks whether first-session behavior improves for the ${cluster.name} opportunity.`
      })
    },
    experiment: {
      fix: (cluster) => ({
        id: 'experimentQuality',
        label: 'Experiment quality',
        value: 'Limited rollout with support-signal readout',
        rationale: `A partial rollout can test whether the intervention changes the user evidence behind ${cluster.name} without risking all users.`
      }),
      improve: (cluster) => ({
        id: 'experimentQuality',
        label: 'Experiment quality',
        value: 'Prototype one path',
        rationale: `A narrow prototype validates whether the ${cluster.name} demand creates repeat behavior before expanding scope.`
      }),
      explore: (cluster) => ({
        id: 'experimentQuality',
        label: 'Experiment quality',
        value: 'A/B test for new users',
        rationale: `An onboarding A/B test isolates the first-session effect behind ${cluster.name}.`
      })
    },
    risk: {
      fix: (cluster) => ({
        id: 'riskControl',
        label: 'Risk control',
        value: 'Protect trust and roadmap focus',
        rationale: `The risk statement balances delivery delay against the trust risk visible in ${cluster.name}.`
      }),
      improve: (cluster) => ({
        id: 'riskControl',
        label: 'Risk control',
        value: 'Control scope',
        rationale: `The risk statement keeps ${cluster.name} from becoming a broad integration backlog before evidence proves depth.`
      }),
      explore: (cluster) => ({
        id: 'riskControl',
        label: 'Risk control',
        value: 'Avoid over-guidance',
        rationale: `The risk statement protects advanced users while testing the ${cluster.name} opportunity.`
      })
    }
  },
  zh: {
    recommendation: {
      fix: (quote) => ({
        id: 'recommendationBasis',
        label: '建议依据',
        value: '先稳可靠性，再扩展能力',
        rationale: `建议优先处理稳定性，因为证据中出现丢稿或导出受阻，例如“${quote}”。`,
        evidence: [quote]
      }),
      improve: (quote) => ({
        id: 'recommendationBasis',
        label: '建议依据',
        value: '先验证单一工作流匹配度',
        rationale: `建议聚焦一个导出工作流，因为证据已经指向具体下游工具或发布任务，例如“${quote}”。`,
        evidence: [quote]
      }),
      explore: (quote) => ({
        id: 'recommendationBasis',
        label: '建议依据',
        value: '先验证学习价值，再投入建设',
        rationale: `建议保持实验性质，因为证据更多体现困惑或潜在意图，而不是完全确定的功能需求，例如“${quote}”。`,
        evidence: [quote]
      })
    },
    metric: {
      fix: (cluster) => ({
        id: 'metricFit',
        label: '指标匹配',
        value: '投诉率',
        rationale: `指标追踪与“${cluster.name}”相同的可靠性主题，真正有效的修复应降低相关投诉。`
      }),
      improve: (cluster) => ({
        id: 'metricFit',
        label: '指标匹配',
        value: '完成工作流行为',
        rationale: `指标观察用户是否完成“${cluster.name}”所指向的下游工作流。`
      }),
      explore: (cluster) => ({
        id: 'metricFit',
        label: '指标匹配',
        value: '激活行为',
        rationale: `指标验证“${cluster.name}”机会是否改善首次会话表现。`
      })
    },
    experiment: {
      fix: (cluster) => ({
        id: 'experimentQuality',
        label: '实验质量',
        value: '小流量发布并观察支持信号',
        rationale: `小流量发布可以验证干预是否改变“${cluster.name}”背后的用户证据，同时控制影响面。`
      }),
      improve: (cluster) => ({
        id: 'experimentQuality',
        label: '实验质量',
        value: '先原型验证一个路径',
        rationale: `窄范围原型可以在扩张范围前验证“${cluster.name}”是否带来重复行为。`
      }),
      explore: (cluster) => ({
        id: 'experimentQuality',
        label: '实验质量',
        value: '新用户 A/B 测试',
        rationale: `新手引导 A/B 测试可以隔离“${cluster.name}”背后的首次会话影响。`
      })
    },
    risk: {
      fix: (cluster) => ({
        id: 'riskControl',
        label: '风险控制',
        value: '保护信任与路线图聚焦',
        rationale: `风险判断平衡交付延期与“${cluster.name}”中可见的信任风险。`
      }),
      improve: (cluster) => ({
        id: 'riskControl',
        label: '风险控制',
        value: '控制范围',
        rationale: `风险判断避免“${cluster.name}”在证据不足时扩张成宽泛集成清单。`
      }),
      explore: (cluster) => ({
        id: 'riskControl',
        label: '风险控制',
        value: '避免过度引导',
        rationale: `风险判断在测试“${cluster.name}”机会的同时，保护高级用户的自主性。`
      })
    }
  }
};

function findCluster(clusters: InsightCluster[], ids: string[]): InsightCluster {
  return ids.map((id) => clusters.find((cluster) => cluster.id === id)).find(Boolean) ?? clusters[0];
}

function score(cluster: InsightCluster, severity: number, impact: number, effort: number): RoadmapCard['scoringFactors'] {
  return {
    frequency: Math.min(5, Math.max(1, cluster.reviewCount)),
    severity,
    businessImpact: impact,
    confidence: Math.round(cluster.confidence * 5),
    effort
  };
}

function priorityScore(factors: RoadmapCard['scoringFactors']): number {
  const raw =
    factors.frequency * SCORE_WEIGHTS.frequency +
    factors.severity * SCORE_WEIGHTS.severity +
    factors.businessImpact * SCORE_WEIGHTS.businessImpact +
    factors.confidence * SCORE_WEIGHTS.confidence +
    factors.effort * SCORE_WEIGHTS.effort;

  return Math.max(1, Math.min(100, Math.round(raw * 20)));
}

function createScoreDimensions(
  cluster: InsightCluster,
  factors: RoadmapCard['scoringFactors'],
  language: Language
): EvaluationDimension[] {
  return SCORE_ORDER.map((id) => {
    const copy = SCORE_DIMENSION_COPY[language][id];
    const factor = factors[id];

    return {
      id,
      label: copy.label,
      value: copy.value(factor, cluster),
      score: factor,
      weight: SCORE_WEIGHTS[id],
      rationale: copy.rationale(factor, cluster),
      evidence: cluster.representativeQuotes.slice(0, 2)
    };
  });
}

function createDecisionDimensions(type: RoadmapType, cluster: InsightCluster, language: Language) {
  const quote = cluster.representativeQuotes[0] ?? (language === 'zh' ? '暂无代表性证据' : 'No representative quote');
  const copy = DECISION_DIMENSION_COPY[language];

  return {
    recommendationDimensions: [copy.recommendation[type](quote)],
    metricDimensions: [copy.metric[type](cluster)],
    experimentDimensions: [copy.experiment[type](cluster)],
    riskDimensions: [copy.risk[type](cluster)]
  };
}

function createCardPayload(
  type: RoadmapType,
  cluster: InsightCluster,
  language: Language,
  factors: RoadmapCard['scoringFactors']
): RoadmapCard {
  const copy = ROADMAP_COPY[language][type];
  const decisionDimensions = createDecisionDimensions(type, cluster, language);

  return {
    id: copy.id,
    type,
    title: copy.title,
    recommendation: copy.recommendation,
    priorityScore: priorityScore(factors),
    scoringFactors: factors,
    scoreFormula: SCORE_FORMULA[language],
    scoreDimensions: createScoreDimensions(cluster, factors, language),
    ...decisionDimensions,
    evidenceQuotes: cluster.representativeQuotes,
    userScenario: cluster.suspectedUserScenario,
    supportingReviewCount: cluster.reviewCount,
    targetMetric: copy.targetMetric,
    validationExperiment: copy.validationExperiment,
    risks: copy.risks,
    confidence: cluster.confidence
  };
}

function createCard(type: RoadmapType, cluster: InsightCluster, language: Language): RoadmapCard {

  if (type === 'fix') {
    const factors = score(cluster, 5, 5, 3);
    return createCardPayload(type, cluster, language, factors);
  }

  if (type === 'improve') {
    const factors = score(cluster, 3, 4, 3);
    return createCardPayload(type, cluster, language, factors);
  }

  const factors = score(cluster, 3, 3, 2);
  return createCardPayload(type, cluster, language, factors);
}

export function generateRoadmapCards(clusters: InsightCluster[], language: Language = 'en'): RoadmapCard[] {
  if (clusters.length === 0) return [];

  const selected = {
    fix: findCluster(clusters, ['bug', 'retention_risk', 'pricing_friction']),
    improve: findCluster(clusters, ['feature_request', 'delight']),
    explore: findCluster(clusters, ['onboarding_friction', 'pricing_friction', 'feature_request'])
  };

  return TYPE_ORDER.map((type) => createCard(type, selected[type], language));
}
