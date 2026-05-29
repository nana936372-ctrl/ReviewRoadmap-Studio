import type { Language } from '../../domain/types';

const workflowStages = {
  en: [
    {
      name: 'Normalize reviews',
      description: 'Clean title and body text, remove empty reviews, and keep review text available for citation.'
    },
    {
      name: 'Classify signals',
      description:
        'Assign product labels such as bug, feature request, onboarding friction, pricing friction, retention risk, and delight.'
    },
    {
      name: 'Cluster insights',
      description: 'Group related signal labels into product-language insight clusters with representative evidence.'
    },
    {
      name: 'Score opportunities',
      description: 'Estimate frequency, severity, business impact, confidence, and effort without pretending the score is perfectly precise.'
    },
    {
      name: 'Generate roadmap cards',
      description: 'Convert top opportunities into Fix, Improve, and Explore recommendations with metrics and validation experiments.'
    }
  ],
  zh: [
    {
      name: '标准化评论',
      description: '清理标题和正文，移除空评论，并保留可用于引用的原始评论文本。'
    },
    {
      name: '分类用户信号',
      description: '将评论标记为缺陷、功能请求、新手阻力、价格阻力、留存风险和喜爱点等产品信号。'
    },
    {
      name: '聚类产品洞察',
      description: '把相关信号聚合成产品语言下的洞察组，并绑定代表性证据。'
    },
    {
      name: '评估机会优先级',
      description: '估算频次、严重度、业务影响、置信度和实现成本，同时避免伪装成过度精确的模型。'
    },
    {
      name: '生成路线图卡片',
      description: '把高价值机会转化为 Fix、Improve、Explore 建议，并附上指标和验证实验。'
    }
  ]
} as const;

export const aiWorkflowStages = workflowStages.en;

export function getAiWorkflowStages(language: Language = 'en') {
  return workflowStages[language];
}
