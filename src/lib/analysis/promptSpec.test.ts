import { getAiWorkflowStages } from './promptSpec';

describe('getAiWorkflowStages', () => {
  it('describes evaluation methods and dimensions for every stage', () => {
    const stages = getAiWorkflowStages('en');

    expect(stages.every((stage) => stage.evaluationMethod.length > 20)).toBe(true);
    expect(stages.every((stage) => stage.dimensions.length >= 3)).toBe(true);
    expect(stages[3].dimensions).toContain('Frequency');
  });

  it('localizes workflow evaluation methods for Chinese', () => {
    const stages = getAiWorkflowStages('zh');

    expect(stages[3].evaluationMethod).toContain('频次');
    expect(stages[3].dimensions).toContain('频次');
  });
});
