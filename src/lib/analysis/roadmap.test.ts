import type { InsightCluster } from '../../domain/types';
import { generateRoadmapCards } from './roadmap';

const clusters: InsightCluster[] = [
  {
    id: 'bug',
    name: 'Reliability and data-loss issues',
    description: 'Users report crashes and lost work.',
    labels: ['bug', 'retention_risk'],
    reviewCount: 4,
    averageRating: 1.5,
    representativeQuotes: ['Lost work: The draft disappeared.'],
    confidence: 0.9,
    suspectedUserScenario: 'Users finishing client work.'
  },
  {
    id: 'feature_request',
    name: 'Workflow extension requests',
    description: 'Users ask for export and planning features.',
    labels: ['feature_request'],
    reviewCount: 3,
    averageRating: 4,
    representativeQuotes: ['Please add Notion export.'],
    confidence: 0.82,
    suspectedUserScenario: 'Users moving drafts into publishing tools.'
  },
  {
    id: 'onboarding_friction',
    name: 'First-session confusion',
    description: 'Users struggle to choose the right template.',
    labels: ['onboarding_friction'],
    reviewCount: 2,
    averageRating: 3,
    representativeQuotes: ['I did not know which mode to choose.'],
    confidence: 0.72,
    suspectedUserScenario: 'New users trying the first draft.'
  }
];

describe('generateRoadmapCards', () => {
  it('creates fix, improve, and explore cards with evidence', () => {
    const cards = generateRoadmapCards(clusters);

    expect(cards.map((card) => card.type)).toEqual(['fix', 'improve', 'explore']);
    expect(cards[0].title).toBe('Stabilize draft saving and export reliability');
    expect(cards[0].evidenceQuotes).toEqual(['Lost work: The draft disappeared.']);
    expect(cards[0].priorityScore).toBeGreaterThan(cards[2].priorityScore);
  });
});
