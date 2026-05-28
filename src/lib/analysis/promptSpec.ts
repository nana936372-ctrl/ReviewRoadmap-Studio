export const aiWorkflowStages = [
  {
    name: 'Normalize reviews',
    description: 'Clean title and body text, remove empty reviews, and keep review text available for citation.'
  },
  {
    name: 'Classify signals',
    description: 'Assign product labels such as bug, feature request, onboarding friction, pricing friction, retention risk, and delight.'
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
] as const;
