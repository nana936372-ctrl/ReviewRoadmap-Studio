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
      name: 'LLM semantic signal reading',
      description:
        'Use the LLM to interpret each review in its app context, then assign evidence-bound labels such as bug, request, friction, risk, or delight.',
      evaluationMethod:
        'Require every label to be supported by the review text and keep sentiment and urgency separate from the semantic label itself.',
      dimensions: ['Semantic fit', 'Evidence boundary', 'Sentiment', 'Urgency']
    },
    {
      name: 'LLM insight clustering',
      description: 'Group reviews by shared user meaning, product surface, and consequence instead of reusing a fixed keyword template.',
      evaluationMethod:
        'Accept a cluster only when it cites concrete review IDs and the cited reviews share a scenario or consequence that can support a roadmap choice.',
      dimensions: ['Shared user scenario', 'Cited review IDs', 'Evidence strength', 'Cluster confidence']
    },
    {
      name: 'Score opportunities',
      description: 'Estimate frequency, severity, business impact, confidence, and effort without pretending the score is perfectly precise.',
      evaluationMethod:
        'Score each opportunity with weighted Frequency, Severity, Business impact, Confidence, and Effort, then expose the formula instead of hiding it.',
      dimensions: ['Frequency', 'Severity', 'Business impact', 'Confidence', 'Effort']
    },
    {
      name: 'LLM roadmap synthesis',
      description:
        'Convert semantic clusters into Fix, Improve, and Explore recommendations with metrics and validation experiments, while keeping numbers deterministic.',
      evaluationMethod:
        'Check every recommendation against cited evidence, metric fit, validation quality, and risk control before presenting it as a roadmap option.',
      dimensions: ['Cited evidence', 'Recommendation basis', 'Metric fit', 'Experiment quality', 'Risk control']
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
      name: 'LLM 语义读取用户信号',
      description: '让 LLM 结合具体 App 语境理解每条评论，再标记缺陷、需求、阻力、风险或喜爱点。',
      evaluationMethod: '每个标签都必须被评论原文支持，同时把情绪倾向和紧急度从语义标签中拆出来。',
      dimensions: ['语义匹配', '证据边界', '情绪倾向', '紧急度']
    },
    {
      name: 'LLM 聚类产品洞察',
      description: '按共同用户含义、产品触点和后果聚类，而不是复用固定关键词模板。',
      evaluationMethod: '只有当聚类绑定具体评论 ID，且这些评论共享场景或后果时，才把它作为路线图证据。',
      dimensions: ['共同场景', '引用评论 ID', '证据强度', '聚类置信度']
    },
    {
      name: '评估机会优先级',
      description: '估算频次、严重度、业务影响、置信度和实现成本，同时避免伪装成过度精确的模型。',
      evaluationMethod: '用频次、严重度、业务影响、置信度和成本加权计算每个机会，并公开公式而不是隐藏评分过程。',
      dimensions: ['频次', '严重度', '业务影响', '置信度', '成本']
    },
    {
      name: 'LLM 生成路线图卡片',
      description: '把语义聚类转化为 Fix、Improve、Explore 建议，并附上指标和验证实验；数值仍由公式计算。',
      evaluationMethod: '每条建议在展示前都要检查引用证据、建议依据、指标匹配、实验质量和风险控制。',
      dimensions: ['引用证据', '建议依据', '指标匹配', '实验质量', '风险控制']
    }
  ]
} as const;

export const aiWorkflowStages = workflowStages.en;

export function getAiWorkflowStages(language: Language = 'en') {
  return workflowStages[language];
}
