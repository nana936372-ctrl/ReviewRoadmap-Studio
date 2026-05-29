import type { Language } from '../../domain/types';

const workflowStages = {
  en: [
    {
      name: 'Normalize reviews',
      description: 'Clean title and body text, remove empty reviews, and keep review text available for citation.',
      evaluationMethod:
        'Evaluate whether each sample keeps rating, version, title, body, and original quote context so later claims remain auditable.',
      dimensions: ['Completeness', 'Quote preservation', 'Deduplication']
    },
    {
      name: 'Classify signals',
      description:
        'Assign product labels such as bug, feature request, onboarding friction, pricing friction, retention risk, and delight.',
      evaluationMethod:
        'Compare review language against product signal definitions, then keep sentiment and urgency separate from the label itself.',
      dimensions: ['Signal label fit', 'Sentiment', 'Urgency']
    },
    {
      name: 'Cluster insights',
      description: 'Group related signal labels into product-language insight clusters with representative evidence.',
      evaluationMethod:
        'Group repeated labels only when the reviews share a user scenario, product surface, or consequence that can support a roadmap choice.',
      dimensions: ['Shared user scenario', 'Evidence strength', 'Cluster confidence']
    },
    {
      name: 'Score opportunities',
      description: 'Estimate frequency, severity, business impact, confidence, and effort without pretending the score is perfectly precise.',
      evaluationMethod:
        'Score each opportunity with weighted Frequency, Severity, Business impact, Confidence, and Effort, then expose the formula instead of hiding it.',
      dimensions: ['Frequency', 'Severity', 'Business impact', 'Confidence', 'Effort']
    },
    {
      name: 'Generate roadmap cards',
      description: 'Convert top opportunities into Fix, Improve, and Explore recommendations with metrics and validation experiments.',
      evaluationMethod:
        'Check every recommendation against evidence, metric fit, validation quality, and risk control before presenting it as a roadmap option.',
      dimensions: ['Recommendation basis', 'Metric fit', 'Experiment quality', 'Risk control']
    }
  ],
  zh: [
    {
      name: '标准化评论',
      description: '清理标题和正文，移除空评论，并保留可用于引用的原始评论文本。',
      evaluationMethod: '检查每条样本是否保留评分、版本、标题、正文和原始引用上下文，确保后续判断可追溯。',
      dimensions: ['完整性', '引用保真', '去重']
    },
    {
      name: '分类用户信号',
      description: '将评论标记为缺陷、功能请求、新手阻力、价格阻力、留存风险和喜爱点等产品信号。',
      evaluationMethod: '把评论语言与产品信号定义对齐，同时把情绪倾向和紧急度从标签判断中拆出来。',
      dimensions: ['信号匹配', '情绪倾向', '紧急度']
    },
    {
      name: '聚类产品洞察',
      description: '把相关信号聚合成产品语言下的洞察组，并绑定代表性证据。',
      evaluationMethod: '只有当评论共享用户场景、产品触点或后果时才聚合，避免把表面相似的评论混在一起。',
      dimensions: ['共同场景', '证据强度', '聚类置信度']
    },
    {
      name: '评估机会优先级',
      description: '估算频次、严重度、业务影响、置信度和实现成本，同时避免伪装成过度精确的模型。',
      evaluationMethod: '用频次、严重度、业务影响、置信度和成本加权计算每个机会，并公开公式而不是隐藏评分过程。',
      dimensions: ['频次', '严重度', '业务影响', '置信度', '成本']
    },
    {
      name: '生成路线图卡片',
      description: '把高价值机会转化为 Fix、Improve、Explore 建议，并附上指标和验证实验。',
      evaluationMethod: '每条建议在展示前都要检查证据依据、指标匹配、实验质量和风险控制。',
      dimensions: ['建议依据', '指标匹配', '实验质量', '风险控制']
    }
  ]
} as const;

export const aiWorkflowStages = workflowStages.en;

export function getAiWorkflowStages(language: Language = 'en') {
  return workflowStages[language];
}
