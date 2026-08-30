import { analyzeWithFallback } from './aiProvider.js';

const buildRootCausePrompt = (challenge) => `
Identify root causes for this societal challenge in Jharkhand, India.
Return JSON: { "rootCauses": ["cause1", "cause2"], "contributingFactors": ["factor1"], "recommendedActions": ["action1"], "confidence": 0-1 }

Title: ${challenge.title}
Category: ${challenge.category}
District: ${challenge.location?.district}
Description: ${challenge.description}
`;

const ruleBasedRootCause = (challenge) => {
  const text = `${challenge.title} ${challenge.description}`.toLowerCase();
  const rootCauses = [];
  const contributingFactors = [];
  const recommendedActions = [];

  if (text.includes('water') || text.includes('drinking')) {
    rootCauses.push('Inadequate water infrastructure');
    contributingFactors.push('Seasonal drought and aging pipelines');
    recommendedActions.push('Deploy community water purification systems');
  }
  if (text.includes('health') || text.includes('hospital')) {
    rootCauses.push('Limited healthcare access in rural areas');
    contributingFactors.push('Shortage of medical staff and equipment');
    recommendedActions.push('Establish mobile health clinics');
  }
  if (text.includes('education') || text.includes('school')) {
    rootCauses.push('Educational resource gaps');
    contributingFactors.push('Teacher shortage and infrastructure deficits');
    recommendedActions.push('Digital learning interventions');
  }
  if (rootCauses.length === 0) {
    rootCauses.push('Systemic service delivery gap');
    contributingFactors.push('Limited coordination between stakeholders');
    recommendedActions.push('Conduct participatory needs assessment');
  }

  return {
    rootCauses,
    contributingFactors,
    recommendedActions,
    confidence: 0.5,
    provider: 'rule-based',
  };
};

export const analyzeRootCauses = async (challenge, options = {}) => {
  const { preferGemini = true } = options;

  if (preferGemini && process.env.GEMINI_API_KEY) {
    try {
      const prompt = buildRootCausePrompt(challenge);
      const result = await analyzeWithFallback(prompt, true);
      if (result.rootCauses) {
        return {
          rootCauses: result.rootCauses,
          contributingFactors: result.contributingFactors || [],
          recommendedActions: result.recommendedActions || [],
          confidence: result.confidence || 0.7,
          provider: result.provider || 'gemini',
        };
      }
    } catch (error) {
      console.warn('Root cause AI analysis failed:', error.message);
    }
  }

  if (challenge.aiAnalysis?.rootCauses?.length) {
    return {
      rootCauses: challenge.aiAnalysis.rootCauses,
      contributingFactors: challenge.aiAnalysis.impactAreas || [],
      recommendedActions: ['Engage university research teams', 'Seek industry CSR partnership'],
      confidence: challenge.aiAnalysis.confidence || 0.6,
      provider: challenge.aiAnalysis.provider || 'cached',
    };
  }

  return ruleBasedRootCause(challenge);
};

export default { analyzeRootCauses };
