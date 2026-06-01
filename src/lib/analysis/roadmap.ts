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

interface RoadmapCopy {
  id: string;
  title: string;
  recommendation: string;
  targetMetric: string;
  validationExperiment: string;
  risks: string;
}

interface OpportunityDetail {
  title: string;
  recommendation: string;
  targetMetric: string;
  validationExperiment: string;
  recommendationValue: string;
  metricValue: string;
  experimentValue: string;
  isSpecific: boolean;
}

export interface SemanticRoadmapDecision {
  type: RoadmapType;
  clusterId: string;
  title: string;
  recommendation: string;
  targetMetric: string;
  validationExperiment: string;
  risks: string;
}

type OpportunityThemeCopy = Record<Language, Record<RoadmapType, Omit<OpportunityDetail, 'isSpecific'>>>;

const ROADMAP_COPY: Record<
  Language,
  Record<RoadmapType, RoadmapCopy>
> = {
  en: {
    fix: {
      id: 'fix-reliability',
      title: 'Stabilize the core user journey',
      recommendation: 'Fix the recurring core-task failures visible in reviews before investing in new growth features.',
      targetMetric: 'Reduce one- and two-star core-task complaints per 100 reviews.',
      validationExperiment:
        'Ship a focused fix or recovery message to 25% of affected users and compare related support or review mentions for two weeks.',
      risks: 'This may delay visible feature work, but trust issues can suppress retention and paid conversion.'
    },
    improve: {
      id: 'improve-workflow',
      title: 'Double down on the strongest proven value',
      recommendation:
        'Use the clearest positive evidence and concrete requests to strengthen the use case users already care about.',
      targetMetric: 'Increase repeat use or completed key actions per activated user.',
      validationExperiment: 'Prototype one improvement to the proven use case and measure whether users return within seven days.',
      risks: 'Improvement scope can sprawl, so the first version should support one use case with strong evidence.'
    },
    explore: {
      id: 'explore-onboarding',
      title: 'Test a clearer first-session path',
      recommendation: 'Use a lightweight guided path that helps new users reach the first meaningful outcome faster.',
      targetMetric: 'Improve first-session key-action completion rate.',
      validationExperiment: 'A/B test a guided path against the current entry flow for new users.',
      risks: 'Guidance can feel restrictive to advanced users, so provide a skip path and keep the first question lightweight.'
    }
  },
  zh: {
    fix: {
      id: 'fix-reliability',
      title: '稳定核心使用路径',
      recommendation: '先处理评论中反复出现的核心任务失败点，再投入新的增长功能。',
      targetMetric: '降低每 100 条评论中的一到二星核心任务投诉数。',
      validationExperiment: '向 25% 受影响用户发布聚焦修复或恢复提示，并对比两周内相关支持反馈或评论变化。',
      risks: '这会延后可见的新功能，但信任问题会压低留存和付费转化。'
    },
    improve: {
      id: 'improve-workflow',
      title: '放大最强的已验证价值',
      recommendation: '基于最清晰的正向证据和具体需求，强化用户已经在意的核心场景。',
      targetMetric: '提升激活用户的人均复用或关键动作完成次数。',
      validationExperiment: '围绕已验证场景原型化一个改进，并观察用户 7 天内是否回访。',
      risks: '优化范围容易扩张，因此第一版应只服务证据最强的一个使用场景。'
    },
    explore: {
      id: 'explore-onboarding',
      title: '测试更清晰的首次使用路径',
      recommendation: '用轻量引导帮助新用户更快到达第一个有意义的结果。',
      targetMetric: '提升首次会话关键动作完成率。',
      validationExperiment: '对新用户 A/B 测试引导路径与当前入口流程。',
      risks: '引导可能让高级用户觉得受限，因此需要保留跳过路径，并让第一个问题足够轻。'
    }
  }
};

const OPPORTUNITY_THEMES: Array<{
  patterns: RegExp[];
  copy: OpportunityThemeCopy;
}> = [
  {
    patterns: [/打卡/i, /小队/i, /队长/i, /队员/i, /活跃/i, /踢出/i, /学习任务/i, /check-?in/i, /team activity/i],
    copy: {
      en: {
        fix: {
          title: 'Fix check-in and team activity state mismatches',
          recommendation:
            'Prioritize check-in state, member activity rules, and team feedback accuracy so the engagement loop feels trustworthy.',
          targetMetric: 'Reduce check-in or team-state complaints per 100 reviews.',
          validationExperiment:
            'Add state validation and clearer team activity feedback for a limited cohort, then compare related low-star review mentions over two weeks.',
          recommendationValue: 'Fix check-in and team activity state mismatches',
          metricValue: 'Check-in/team-state complaint rate',
          experimentValue: 'Limited rollout on check-in and team-state feedback'
        },
        improve: {
          title: 'Strengthen the proven learning-engagement loop',
          recommendation:
            'Build on the check-in and team loop only after the visible status and activity rules are reliable.',
          targetMetric: 'Increase completed check-ins or team participation among active users.',
          validationExperiment:
            'Prototype one clearer reward or team-feedback moment and compare repeat participation within seven days.',
          recommendationValue: 'Strengthen the proven learning-engagement loop',
          metricValue: 'Repeat check-in and team participation',
          experimentValue: 'Focused engagement-loop prototype'
        },
        explore: {
          title: 'Test clearer check-in and team-rule onboarding',
          recommendation:
            'Use a lightweight first-run explanation for check-in state, team activity, and rule changes before expanding the system.',
          targetMetric: 'Improve first-session understanding of check-in and team rules.',
          validationExperiment:
            'A/B test a rule explainer against the current flow for new or returning team users.',
          recommendationValue: 'Test clearer check-in and team-rule onboarding',
          metricValue: 'Rule-understanding activation behavior',
          experimentValue: 'Check-in rule explainer A/B test'
        }
      },
      zh: {
        fix: {
          title: '修复打卡状态与小队活跃判定异常',
          recommendation: '优先修复打卡状态、队员活跃判定和小队规则反馈，避免激励机制被用户认为不可信。',
          targetMetric: '降低每 100 条评论中的打卡/小队异常投诉数。',
          validationExperiment:
            '先在打卡与小队页增加状态校验、异常提示和队员活跃规则说明，观察两周内相关差评占比是否下降。',
          recommendationValue: '修复打卡状态与小队活跃判定异常',
          metricValue: '打卡/小队异常投诉率',
          experimentValue: '打卡与小队状态反馈小流量验证'
        },
        improve: {
          title: '强化已验证的学习激励闭环',
          recommendation: '在状态和规则可信后，再放大学习打卡、小队协作和激励反馈的正向价值。',
          targetMetric: '提升活跃用户的连续打卡或小队参与次数。',
          validationExperiment: '围绕一个奖励反馈或小队协作时刻做原型，并观察 7 天内重复参与变化。',
          recommendationValue: '强化已验证的学习激励闭环',
          metricValue: '连续打卡与小队参与行为',
          experimentValue: '学习激励闭环原型验证'
        },
        explore: {
          title: '测试更清晰的打卡/小队规则引导',
          recommendation: '用轻量首屏说明帮助用户理解打卡状态、小队活跃和规则变化，再决定是否扩展系统。',
          targetMetric: '提升首次会话对打卡/小队规则的理解率。',
          validationExperiment: '对新用户或回流用户 A/B 测试规则说明与当前流程。',
          recommendationValue: '测试更清晰的打卡/小队规则引导',
          metricValue: '规则理解激活行为',
          experimentValue: '打卡规则说明 A/B 测试'
        }
      }
    }
  },
  {
    patterns: [
      /paywall/i,
      /subscription/i,
      /pricing/i,
      /trial/i,
      /subscribe/i,
      /price/i,
      /收费/i,
      /付费/i,
      /会员/i,
      /订阅/i,
      /价格/i,
      /试用/i,
      /权益/i,
      /限制/i
    ],
    copy: {
      en: {
        fix: {
          title: 'Clarify value before subscription moments',
          recommendation:
            'Explain included value, limits, and trial expectations before subscription prompts so users are not asked to pay before they understand the product.',
          targetMetric: 'Reduce value, plan, or limit-clarity complaints per 100 reviews.',
          validationExperiment:
            'A/B test a benefit-and-limit explanation before the paywall, then compare paywall exits and pricing-related review mentions.',
          recommendationValue: 'Clarify value before subscription moments',
          metricValue: 'Pricing clarity complaint rate',
          experimentValue: 'Pre-paywall value explanation A/B test'
        },
        improve: {
          title: 'Improve plan comparison for high-intent users',
          recommendation:
            'Help users compare limits, exports, and value moments when they already show intent to keep using the product.',
          targetMetric: 'Increase subscription-start rate among activated users without increasing refund or complaint mentions.',
          validationExperiment:
            'Prototype a clearer plan comparison for activated users and monitor conversion plus pricing complaints.',
          recommendationValue: 'Improve plan comparison for high-intent users',
          metricValue: 'Activated-user plan conversion quality',
          experimentValue: 'Plan comparison prototype'
        },
        explore: {
          title: 'Test a lower-commitment trial path',
          recommendation:
            'Use a limited trial path to learn whether users need more proof of value before committing to a subscription.',
          targetMetric: 'Improve trial-to-activation rate before the first subscription prompt.',
          validationExperiment:
            'A/B test a limited trial path against the current subscription entry for new users.',
          recommendationValue: 'Test a lower-commitment trial path',
          metricValue: 'Trial-to-activation behavior',
          experimentValue: 'Limited trial A/B test'
        }
      },
      zh: {
        fix: {
          title: '降低付费前价值解释不足导致的流失',
          recommendation: '在触发收费/会员节点前补充权益、限制和试用价值说明，减少用户还没理解价值就流失。',
          targetMetric: '降低每 100 条评论中的收费、会员价值或限制不清投诉数。',
          validationExperiment: '在付费入口前 A/B 测试权益与限制说明，并比较付费退出率和收费相关差评变化。',
          recommendationValue: '降低付费前价值解释不足导致的流失',
          metricValue: '付费价值解释投诉率',
          experimentValue: '付费前价值说明 A/B 测试'
        },
        improve: {
          title: '优化高意向用户的套餐比较',
          recommendation: '当用户已经表现出继续使用意图时，帮助他们理解限制、导出能力和套餐差异。',
          targetMetric: '提升已激活用户的订阅开始率，同时不增加退款或收费投诉。',
          validationExperiment: '为已激活用户原型化更清晰的套餐比较，并同时观察转化与收费投诉。',
          recommendationValue: '优化高意向用户的套餐比较',
          metricValue: '已激活用户套餐转化质量',
          experimentValue: '套餐比较原型验证'
        },
        explore: {
          title: '测试低承诺试用路径',
          recommendation: '用有限试用路径验证用户是否需要更多价值证明后才愿意订阅。',
          targetMetric: '提升首次订阅提示前的试用到激活转化率。',
          validationExperiment: '对新用户 A/B 测试有限试用路径与当前订阅入口。',
          recommendationValue: '测试低承诺试用路径',
          metricValue: '试用到激活行为',
          experimentValue: '有限试用 A/B 测试'
        }
      }
    }
  },
  {
    patterns: [
      /draft/i,
      /autosave/i,
      /auto-save/i,
      /lost work/i,
      /export/i,
      /sync/i,
      /草稿/i,
      /自动保存/i,
      /导出/i,
      /同步/i,
      /丢失/i,
      /恢复/i
    ],
    copy: {
      en: {
        fix: {
          title: 'Fix draft recovery and export failure points',
          recommendation:
            'Prioritize autosave, draft recovery, sync, and export failure points so users do not lose work during important tasks.',
          targetMetric: 'Reduce draft-loss, recovery, or export-failure complaints per 100 reviews.',
          validationExperiment:
            'Release autosave recovery and export-error handling to 25% of affected sessions, then compare lost-work mentions over two weeks.',
          recommendationValue: 'Fix draft recovery and export failure points',
          metricValue: 'Draft loss complaint rate',
          experimentValue: 'Autosave/export recovery rollout'
        },
        improve: {
          title: 'Strengthen reliable handoff for existing workflows',
          recommendation:
            'Improve export, sync, and saved-work handoff where users already try to move work into another tool.',
          targetMetric: 'Increase successful draft, sync, or export completions per activated user.',
          validationExperiment:
            'Prototype one high-match export or recovery path and measure completion plus repeat use over seven days.',
          recommendationValue: 'Strengthen reliable handoff for existing workflows',
          metricValue: 'Successful draft handoff behavior',
          experimentValue: 'Workflow handoff prototype'
        },
        explore: {
          title: 'Test clearer recovery guidance for risky sessions',
          recommendation:
            'Use lightweight guidance when a session is long, offline, or export-heavy so users know their work is protected.',
          targetMetric: 'Improve completion rate for long or export-heavy sessions.',
          validationExperiment:
            'A/B test recovery status messaging against the current long-session flow.',
          recommendationValue: 'Test clearer recovery guidance for risky sessions',
          metricValue: 'Long-session completion behavior',
          experimentValue: 'Recovery-status A/B test'
        }
      },
      zh: {
        fix: {
          title: '修复草稿恢复与导出失败点',
          recommendation: '优先修复自动保存、草稿恢复、同步和导出失败点，避免用户在重要任务中失去成果。',
          targetMetric: '降低每 100 条评论中的草稿丢失、恢复失败或导出失败投诉数。',
          validationExperiment: '向 25% 受影响会话发布自动保存恢复和导出错误处理，并对比两周内丢稿相关反馈变化。',
          recommendationValue: '修复草稿恢复与导出失败点',
          metricValue: '草稿丢失投诉率',
          experimentValue: '自动保存/导出恢复小流量验证'
        },
        improve: {
          title: '强化现有工作流的可靠交付',
          recommendation: '优化用户已经在使用的导出、同步和保存交接路径，让成果能稳定进入下游工具。',
          targetMetric: '提升激活用户的人均草稿、同步或导出成功次数。',
          validationExperiment: '原型化一个高匹配导出或恢复路径，并观察 7 天内完成率和复用变化。',
          recommendationValue: '强化现有工作流的可靠交付',
          metricValue: '草稿交付成功行为',
          experimentValue: '工作流交付原型验证'
        },
        explore: {
          title: '测试高风险会话的恢复提示',
          recommendation: '在长会话、离线或高频导出场景中提供轻量提示，让用户知道成果已被保护。',
          targetMetric: '提升长会话或高频导出会话的完成率。',
          validationExperiment: '对恢复状态提示与当前长会话流程进行 A/B 测试。',
          recommendationValue: '测试高风险会话的恢复提示',
          metricValue: '长会话完成行为',
          experimentValue: '恢复状态提示 A/B 测试'
        }
      }
    }
  },
  {
    patterns: [
      /first screen/i,
      /confusing start/i,
      /which mode/i,
      /template/i,
      /guided/i,
      /onboarding/i,
      /first-session/i,
      /首次/i,
      /入口/i,
      /引导/i,
      /不知道/i,
      /找不到/i,
      /选择/i,
      /模板/i,
      /困惑/i
    ],
    copy: {
      en: {
        fix: {
          title: 'Remove first-session decision blockers',
          recommendation:
            'Clarify the first screen, mode choice, and next action so new users are not blocked before reaching value.',
          targetMetric: 'Reduce first-session confusion complaints per 100 reviews.',
          validationExperiment:
            'Ship a clearer entry path to a limited new-user cohort and compare first-action completion plus confusion mentions.',
          recommendationValue: 'Remove first-session decision blockers',
          metricValue: 'First-session confusion complaint rate',
          experimentValue: 'New-user entry path rollout'
        },
        improve: {
          title: 'Guide users to the right first workflow faster',
          recommendation:
            'Use the strongest existing use case to recommend the right mode or template with fewer choices.',
          targetMetric: 'Increase first key-action completion for activated users.',
          validationExperiment:
            'Prototype a guided mode picker and compare completed first workflows within the same session.',
          recommendationValue: 'Guide users to the right first workflow faster',
          metricValue: 'First workflow completion behavior',
          experimentValue: 'Guided mode-picker prototype'
        },
        explore: {
          title: 'Test a clearer first-session path',
          recommendation: 'Use a lightweight guided path that helps new users reach the first meaningful outcome faster.',
          targetMetric: 'Improve first-session key-action completion rate.',
          validationExperiment: 'A/B test a guided path against the current entry flow for new users.',
          recommendationValue: 'Test a clearer first-session path',
          metricValue: 'Activation behavior',
          experimentValue: 'New-user guided-path A/B test'
        }
      },
      zh: {
        fix: {
          title: '消除首次使用中的决策阻断',
          recommendation: '澄清首屏、模式选择和下一步动作，避免新用户在到达价值前就被卡住。',
          targetMetric: '降低每 100 条评论中的首次使用困惑投诉数。',
          validationExperiment: '向小流量新用户发布更清晰的入口路径，并比较首个动作完成率和困惑反馈。',
          recommendationValue: '消除首次使用中的决策阻断',
          metricValue: '首次使用困惑投诉率',
          experimentValue: '新用户入口路径小流量验证'
        },
        improve: {
          title: '让用户更快进入正确的首个工作流',
          recommendation: '基于最强的现有使用场景，用更少选择帮助用户进入合适模式或模板。',
          targetMetric: '提升激活用户的首次关键动作完成率。',
          validationExperiment: '原型化引导式模式选择器，并比较同会话内首个工作流完成情况。',
          recommendationValue: '让用户更快进入正确的首个工作流',
          metricValue: '首个工作流完成行为',
          experimentValue: '引导式模式选择原型验证'
        },
        explore: {
          title: '测试更清晰的首次使用路径',
          recommendation: '用轻量引导帮助新用户更快到达第一个有意义的结果。',
          targetMetric: '提升首次会话关键动作完成率。',
          validationExperiment: '对新用户 A/B 测试引导路径与当前入口流程。',
          recommendationValue: '测试更清晰的首次使用路径',
          metricValue: '激活行为',
          experimentValue: '新用户引导路径 A/B 测试'
        }
      }
    }
  },
  {
    patterns: [
      /content/i,
      /quality/i,
      /suggestion/i,
      /tone/i,
      /voice/i,
      /reading/i,
      /lesson/i,
      /output/i,
      /内容/i,
      /图片/i,
      /绘本/i,
      /阅读/i,
      /词汇/i,
      /听力/i,
      /质量/i,
      /语气/i,
      /建议/i
    ],
    copy: {
      en: {
        fix: {
          title: 'Review repeated content-experience signals',
          recommendation:
            'Only treat repeated content or learning-experience mentions as a fix when the source reviews explicitly describe a problem.',
          targetMetric: 'Track explicit content or learning-experience problem mentions per 100 reviews.',
          validationExperiment:
            'Manually review the cited comments first, then test a focused change only if the evidence contains a clear problem statement.',
          recommendationValue: 'Review repeated content-experience signals',
          metricValue: 'Explicit content-experience issue rate',
          experimentValue: 'Source-comment review before rollout'
        },
        improve: {
          title: 'Double down on proven content value',
          recommendation:
            'Use the strongest praise around content quality, suggestions, or learning progress to deepen the value users already recognize.',
          targetMetric: 'Increase repeat use around the praised content or output moment.',
          validationExperiment:
            'Prototype one improvement to the praised content moment and compare seven-day repeat behavior.',
          recommendationValue: 'Double down on proven content value',
          metricValue: 'Repeat content-value behavior',
          experimentValue: 'Proven-value prototype'
        },
        explore: {
          title: 'Test the next content quality signal',
          recommendation:
            'Run a small experiment around the next most repeated content or output signal before making a broad content investment.',
          targetMetric: 'Improve completion or repeat behavior for the tested content moment.',
          validationExperiment:
            'A/B test one content-quality variation against the current experience for a focused segment.',
          recommendationValue: 'Test the next content quality signal',
          metricValue: 'Focused content experiment behavior',
          experimentValue: 'Content-quality variation A/B test'
        }
      },
      zh: {
        fix: {
          title: '复核被反复提到的学习体验',
          recommendation: '只有当原始评论明确描述问题时，才把学习内容或体验信号转为修复项。',
          targetMetric: '跟踪每 100 条评论中明确提出的学习体验问题数。',
          validationExperiment: '先人工复核被引用评论，只有出现明确问题描述时再做聚焦修复验证。',
          recommendationValue: '复核被反复提到的学习体验',
          metricValue: '明确学习体验问题率',
          experimentValue: '原始评论复核后再小流量验证'
        },
        improve: {
          title: '放大已验证的内容价值',
          recommendation: '基于内容质量、有效建议或学习进步的正向证据，深化用户已经认可的价值。',
          targetMetric: '提升围绕正向内容价值时刻的重复使用。',
          validationExperiment: '围绕被表扬的内容价值时刻原型化一个改进，并比较 7 天复用变化。',
          recommendationValue: '放大已验证的内容价值',
          metricValue: '内容价值复用行为',
          experimentValue: '已验证价值原型验证'
        },
        explore: {
          title: '测试下一个内容质量信号',
          recommendation: '在大规模内容投入前，先围绕下一个高频内容或结果信号做小实验。',
          targetMetric: '提升被测试内容时刻的完成或复用行为。',
          validationExperiment: '针对聚焦人群 A/B 测试一个内容质量变化与当前体验。',
          recommendationValue: '测试下一个内容质量信号',
          metricValue: '聚焦内容实验行为',
          experimentValue: '内容质量变化 A/B 测试'
        }
      }
    }
  }
];

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
        value: 'Core journey before expansion',
        rationale: `The recommendation prioritizes the core journey because users describe blocked or unreliable task completion, including "${quote}".`,
        evidence: [quote]
      }),
      improve: (quote) => ({
        id: 'recommendationBasis',
        label: 'Recommendation basis',
        value: 'Proven value before breadth',
        rationale: `The recommendation focuses on one validated use case because the evidence names a concrete value moment, including "${quote}".`,
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
        value: '先稳核心路径，再扩展能力',
        rationale: `建议优先处理核心路径，因为证据中出现任务受阻或体验不可靠，例如“${quote}”。`,
        evidence: [quote]
      }),
      improve: (quote) => ({
        id: 'recommendationBasis',
        label: '建议依据',
        value: '先放大已验证价值',
        rationale: `建议聚焦一个已验证使用场景，因为证据已经指向具体价值时刻，例如“${quote}”。`,
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

function describeOpportunity(
  type: RoadmapType,
  cluster: InsightCluster,
  language: Language,
  fallback: RoadmapCopy
): OpportunityDetail {
  const evidenceText = [
    cluster.name,
    cluster.description,
    cluster.suspectedUserScenario,
    ...cluster.representativeQuotes
  ].join(' ');
  const matchingTheme = OPPORTUNITY_THEMES.find((theme) =>
    theme.patterns.some((pattern) => pattern.test(evidenceText))
  );

  if (!matchingTheme) {
    return {
      title: fallback.title,
      recommendation: fallback.recommendation,
      targetMetric: fallback.targetMetric,
      validationExperiment: fallback.validationExperiment,
      recommendationValue: fallback.title,
      metricValue: language === 'zh' ? '与推荐对应的核心指标' : 'Recommendation-aligned metric',
      experimentValue: language === 'zh' ? '与推荐对应的验证实验' : 'Recommendation-aligned experiment',
      isSpecific: false
    };
  }

  return {
    ...matchingTheme.copy[language][type],
    isSpecific: true
  };
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

function createDecisionDimensions(
  type: RoadmapType,
  cluster: InsightCluster,
  language: Language,
  opportunity: OpportunityDetail
) {
  const quote = cluster.representativeQuotes[0] ?? (language === 'zh' ? '暂无代表性证据' : 'No representative quote');
  const copy = DECISION_DIMENSION_COPY[language];
  const recommendationDimension = copy.recommendation[type](quote);
  const metricDimension = copy.metric[type](cluster);
  const experimentDimension = copy.experiment[type](cluster);

  if (opportunity.isSpecific) {
    recommendationDimension.value = opportunity.recommendationValue;
    recommendationDimension.rationale =
      language === 'zh'
        ? `依据“${cluster.name}”中的具体证据主题“${opportunity.recommendationValue}”；代表性证据包括“${quote}”。`
        : `Uses the concrete evidence theme "${opportunity.recommendationValue}" from ${cluster.name}; representative evidence includes "${quote}".`;
    metricDimension.value = opportunity.metricValue;
    metricDimension.rationale =
      language === 'zh'
        ? `指标直接追踪“${opportunity.recommendationValue}”是否改善，避免建议只停留在方向判断。`
        : `The metric directly tracks whether "${opportunity.recommendationValue}" improves, so the recommendation has a measurable readout.`;
    experimentDimension.value = opportunity.experimentValue;
    experimentDimension.rationale =
      language === 'zh'
        ? `实验围绕“${opportunity.recommendationValue}”做小范围验证，先看相关证据是否下降或正向行为是否提升。`
        : `The experiment validates "${opportunity.recommendationValue}" in a limited scope before broader roadmap investment.`;
  }

  return {
    recommendationDimensions: [recommendationDimension],
    metricDimensions: [metricDimension],
    experimentDimensions: [experimentDimension],
    riskDimensions: [copy.risk[type](cluster)]
  };
}

function createRiskStatement(
  type: RoadmapType,
  cluster: InsightCluster,
  language: Language,
  opportunity: OpportunityDetail,
  fallback: RoadmapCopy
): string {
  if (!opportunity.isSpecific) {
    return fallback.risks;
  }

  const theme = opportunity.recommendationValue;

  if (language === 'zh') {
    if (type === 'fix') {
      return `如果只修表层提示而不处理「${theme}」，「${cluster.name}」中的信任问题仍会继续；取舍是短期推迟部分新功能，但优先保护留存与付费信任。`;
    }

    if (type === 'improve') {
      return `如果围绕「${theme}」一次扩展太多能力，容易把明确机会做成泛化需求；第一版应只验证最强证据对应的一个场景。`;
    }

    return `如果过早投入完整建设，「${theme}」可能会消耗资源但无法证明用户真实需要；应先用小实验确认行为变化。`;
  }

  if (type === 'fix') {
    return `If "${theme}" is treated as surface messaging only, the trust problem inside ${cluster.name} can continue; the tradeoff is delaying some visible feature work to protect retention and paid trust.`;
  }

  if (type === 'improve') {
    return `If "${theme}" expands into too many capabilities at once, a clear opportunity can become a broad backlog; the first version should validate one evidence-backed scenario.`;
  }

  return `If "${theme}" becomes a full build too early, it may consume roadmap capacity before the user need is proven; validate behavior change with a small experiment first.`;
}

function createCardPayload(
  type: RoadmapType,
  cluster: InsightCluster,
  language: Language,
  factors: RoadmapCard['scoringFactors']
): RoadmapCard {
  const copy = ROADMAP_COPY[language][type];
  const opportunity = describeOpportunity(type, cluster, language, copy);
  const decisionDimensions = createDecisionDimensions(type, cluster, language, opportunity);

  return {
    id: copy.id,
    type,
    title: opportunity.title,
    recommendation: opportunity.recommendation,
    priorityScore: priorityScore(factors),
    scoringFactors: factors,
    scoreFormula: SCORE_FORMULA[language],
    scoreDimensions: createScoreDimensions(cluster, factors, language),
    ...decisionDimensions,
    evidenceQuotes: cluster.representativeQuotes,
    userScenario: cluster.suspectedUserScenario,
    supportingReviewCount: cluster.reviewCount,
    targetMetric: opportunity.targetMetric,
    validationExperiment: opportunity.validationExperiment,
    risks: createRiskStatement(type, cluster, language, opportunity, copy),
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

function semanticDimensionRationale(
  language: Language,
  decision: SemanticRoadmapDecision,
  cluster: InsightCluster,
  quote: string
): string {
  if (language === 'zh') {
    return `LLM 只负责语义归纳：该决策来自「${cluster.name}」及其绑定评论证据，例如“${quote}”；数值和排序由本地公式重新计算。`;
  }

  return `The LLM supplies semantic synthesis only: this decision comes from "${cluster.name}" and its cited review evidence, including "${quote}"; numeric scoring is recalculated locally.`;
}

function semanticMetricRationale(language: Language, decision: SemanticRoadmapDecision, cluster: InsightCluster): string {
  if (language === 'zh') {
    return `该指标由 LLM 根据「${cluster.name}」的语义给出，但后续是否达成需要用真实产品数据或评论占比验证。`;
  }

  return `This metric is proposed from the semantic meaning of "${cluster.name}" and should be validated with product data or review-share changes.`;
}

function semanticExperimentRationale(language: Language, decision: SemanticRoadmapDecision): string {
  if (language === 'zh') {
    return `该实验限定为下一步验证动作，避免把评论语义直接扩展成完整路线图承诺。`;
  }

  return 'This experiment is kept as the next validation action so review semantics do not become an untested roadmap commitment.';
}

function semanticRiskRationale(language: Language, decision: SemanticRoadmapDecision): string {
  if (language === 'zh') {
    return `风险与取舍来自 LLM 对证据边界的总结，必须和引用评论一起阅读。`;
  }

  return 'The risk statement is a semantic summary of evidence boundaries and should be read together with the cited reviews.';
}

export function generateRoadmapCardsFromSemanticDecisions(
  clusters: InsightCluster[],
  decisions: SemanticRoadmapDecision[],
  language: Language = 'en'
): RoadmapCard[] {
  if (clusters.length === 0) return [];

  const fallbackCards = generateRoadmapCards(clusters, language);
  const cardsByType = new Map(fallbackCards.map((card) => [card.type, card]));

  return TYPE_ORDER.map((type) => {
    const fallbackCard = cardsByType.get(type) ?? fallbackCards[0];
    const decision = decisions.find((item) => item.type === type);

    if (!decision) {
      return fallbackCard;
    }

    const cluster = clusters.find((item) => item.id === decision.clusterId) ?? clusters[0];
    const quote = cluster.representativeQuotes[0] ?? (language === 'zh' ? '暂无代表性证据' : 'No representative quote');
    const baseCard = createCard(type, cluster, language);

    return {
      ...baseCard,
      id: `semantic-${type}-${cluster.id}`,
      title: decision.title || baseCard.title,
      recommendation: decision.recommendation || baseCard.recommendation,
      targetMetric: decision.targetMetric || baseCard.targetMetric,
      validationExperiment: decision.validationExperiment || baseCard.validationExperiment,
      risks: decision.risks || baseCard.risks,
      evidenceQuotes: cluster.representativeQuotes,
      supportingReviewCount: cluster.reviewCount,
      userScenario: cluster.suspectedUserScenario,
      confidence: cluster.confidence,
      recommendationDimensions: [
        {
          ...baseCard.recommendationDimensions[0],
          value: decision.title || baseCard.title,
          rationale: semanticDimensionRationale(language, decision, cluster, quote),
          evidence: cluster.representativeQuotes.slice(0, 2)
        }
      ],
      metricDimensions: [
        {
          ...baseCard.metricDimensions[0],
          value: decision.targetMetric || baseCard.targetMetric,
          rationale: semanticMetricRationale(language, decision, cluster)
        }
      ],
      experimentDimensions: [
        {
          ...baseCard.experimentDimensions[0],
          value: decision.validationExperiment || baseCard.validationExperiment,
          rationale: semanticExperimentRationale(language, decision)
        }
      ],
      riskDimensions: [
        {
          ...baseCard.riskDimensions[0],
          value: decision.risks || baseCard.risks,
          rationale: semanticRiskRationale(language, decision)
        }
      ]
    };
  });
}
