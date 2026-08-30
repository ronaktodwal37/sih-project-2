import { z } from 'zod';
import { CHALLENGE_CATEGORIES } from '../../utils/constants.js';
import { analyzeWithFallback } from './aiProvider.js';

const analysisSchema = z.object({
  summary: z.string().min(10),
  category: z.enum(CHALLENGE_CATEGORIES),
  suggestedTags: z.array(z.string()).min(1).max(10),
  rootCauses: z.array(z.string()).min(1).max(8),
  stakeholders: z.array(z.string()).min(1).max(10),
  impactAreas: z.array(z.string()).min(1).max(8),
  feasibilityScore: z.number().min(0).max(100),
  urgencyScore: z.number().min(0).max(100),
  confidence: z.number().min(0).max(1),
});

const buildPrompt = (challenge) => `
Analyze this societal challenge from Jharkhand, India and return JSON only:
{
  "summary": "brief summary",
  "category": "one of: ${CHALLENGE_CATEGORIES.join(', ')}",
  "suggestedTags": ["tag1"],
  "rootCauses": ["cause1"],
  "stakeholders": ["stakeholder1"],
  "impactAreas": ["area1"],
  "feasibilityScore": 0-100,
  "urgencyScore": 0-100,
  "confidence": 0-1
}

Title: ${challenge.title}
Category: ${challenge.category}
District: ${challenge.location?.district || 'Unknown'}
Description: ${challenge.description}
Urgency: ${challenge.urgency || 'medium'}
Affected Population: ${challenge.affectedPopulation || 'unknown'}
`;

export const analyzeChallenge = async (challenge, options = {}) => {
  const { preferGemini = true } = options;
  const prompt = buildPrompt(challenge);
  const raw = await analyzeWithFallback(prompt, preferGemini);

  try {
    const validated = analysisSchema.parse(raw);
    return {
      ...validated,
      provider: raw.provider || 'rule-based',
      analyzedAt: new Date(),
    };
  } catch (error) {
    const fallback = await analyzeWithFallback(challenge.description, false);
    const validated = analysisSchema.parse(fallback);
    return {
      ...validated,
      provider: 'fallback',
      analyzedAt: new Date(),
    };
  }
};

export default { analyzeChallenge };
