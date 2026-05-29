import type { InsightCluster, Language, RoadmapCard, RoadmapType } from '../../domain/types';

const TYPE_ORDER: RoadmapType[] = ['fix', 'improve', 'explore'];

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
    factors.frequency * 0.22 +
    factors.severity * 0.28 +
    factors.businessImpact * 0.25 +
    factors.confidence * 0.15 -
    factors.effort * 0.1;

  return Math.max(1, Math.min(100, Math.round(raw * 20)));
}

function createCard(type: RoadmapType, cluster: InsightCluster, language: Language): RoadmapCard {
  const copy = ROADMAP_COPY[language][type];

  if (type === 'fix') {
    const factors = score(cluster, 5, 5, 3);

    return {
      id: copy.id,
      type,
      title: copy.title,
      recommendation: copy.recommendation,
      priorityScore: priorityScore(factors),
      scoringFactors: factors,
      evidenceQuotes: cluster.representativeQuotes,
      userScenario: cluster.suspectedUserScenario,
      targetMetric: copy.targetMetric,
      validationExperiment: copy.validationExperiment,
      risks: copy.risks,
      confidence: cluster.confidence
    };
  }

  if (type === 'improve') {
    const factors = score(cluster, 3, 4, 3);

    return {
      id: copy.id,
      type,
      title: copy.title,
      recommendation: copy.recommendation,
      priorityScore: priorityScore(factors),
      scoringFactors: factors,
      evidenceQuotes: cluster.representativeQuotes,
      userScenario: cluster.suspectedUserScenario,
      targetMetric: copy.targetMetric,
      validationExperiment: copy.validationExperiment,
      risks: copy.risks,
      confidence: cluster.confidence
    };
  }

  const factors = score(cluster, 3, 3, 2);

  return {
    id: copy.id,
    type,
    title: copy.title,
    recommendation: copy.recommendation,
    priorityScore: priorityScore(factors),
    scoringFactors: factors,
    evidenceQuotes: cluster.representativeQuotes,
    userScenario: cluster.suspectedUserScenario,
    targetMetric: copy.targetMetric,
    validationExperiment: copy.validationExperiment,
    risks: copy.risks,
    confidence: cluster.confidence
  };
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
