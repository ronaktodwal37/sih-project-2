/**
 * Abstract AI provider with Gemini support and rule-based fallback.
 */
export class AIProvider {
  constructor() {
    this.name = 'base';
    this.isAvailable = false;
  }

  async analyze(_text) {
    throw new Error('analyze() must be implemented by subclass');
  }
}

export class GeminiProvider extends AIProvider {
  constructor() {
    super();
    this.name = 'gemini';
    this.apiKey = process.env.GEMINI_API_KEY;
    this.model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    this.isAvailable = Boolean(this.apiKey);
  }

  async analyze(prompt) {
    if (!this.isAvailable) {
      throw new Error('Gemini API key not configured');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('Empty response from Gemini');
    }

    return JSON.parse(text);
  }
}

export class RuleBasedProvider extends AIProvider {
  constructor() {
    super();
    this.name = 'rule-based';
    this.isAvailable = true;
  }

  async analyze(text) {
    const lower = text.toLowerCase();
    const categoryKeywords = {
      Education: ['school', 'education', 'student', 'teacher', 'learning'],
      Healthcare: ['health', 'hospital', 'medical', 'doctor', 'clinic'],
      Agriculture: ['farm', 'crop', 'agriculture', 'irrigation', 'soil'],
      Water: ['water', 'drinking', 'well', 'borewell', 'pipeline'],
      Environment: ['pollution', 'forest', 'environment', 'waste', 'plastic'],
      Energy: ['solar', 'electricity', 'power', 'energy', 'grid'],
      Sanitation: ['toilet', 'sanitation', 'sewage', 'hygiene'],
      Accessibility: ['disability', 'accessibility', 'ramp', 'inclusive'],
      'Urban Development': ['road', 'traffic', 'urban', 'city', 'infrastructure'],
      'Rural Livelihood': ['livelihood', 'employment', 'income', 'rural', 'tribal'],
      'Public Administration': ['government', 'administration', 'corruption', 'service delivery'],
    };

    let bestCategory = 'Other';
    let bestScore = 0;
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      const score = keywords.filter((kw) => lower.includes(kw)).length;
      if (score > bestScore) {
        bestScore = score;
        bestCategory = category;
      }
    }

    const urgencyKeywords = ['urgent', 'critical', 'emergency', 'immediate', 'severe'];
    const urgencyScore = urgencyKeywords.some((kw) => lower.includes(kw)) ? 85 : 50;

    return {
      summary: text.slice(0, 200),
      category: bestCategory,
      suggestedTags: this.extractTags(lower),
      rootCauses: this.inferRootCauses(lower),
      stakeholders: ['citizens', 'local government', 'community leaders'],
      impactAreas: [bestCategory],
      feasibilityScore: 60,
      urgencyScore,
      confidence: 0.5,
    };
  }

  extractTags(text) {
    const tags = [];
    const keywords = ['water', 'health', 'education', 'agriculture', 'energy', 'sanitation', 'tribal', 'rural'];
    keywords.forEach((kw) => {
      if (text.includes(kw)) tags.push(kw);
    });
    return tags.slice(0, 5);
  }

  inferRootCauses(text) {
    const causes = [];
    if (text.includes('lack') || text.includes('shortage')) causes.push('Resource shortage');
    if (text.includes('no ') || text.includes('without')) causes.push('Infrastructure gap');
    if (text.includes('awareness') || text.includes('knowledge')) causes.push('Awareness deficit');
    if (causes.length === 0) causes.push('Systemic service delivery gap');
    return causes;
  }
}

let cachedProvider = null;

export const getAIProvider = (preferGemini = true) => {
  const gemini = new GeminiProvider();
  if (preferGemini && gemini.isAvailable) {
    return gemini;
  }
  return new RuleBasedProvider();
};

export const analyzeWithFallback = async (prompt, preferGemini = true) => {
  const gemini = new GeminiProvider();
  const ruleBased = new RuleBasedProvider();

  if (preferGemini && gemini.isAvailable) {
    try {
      const result = await gemini.analyze(prompt);
      return { ...result, provider: 'gemini' };
    } catch (error) {
      console.warn('Gemini analysis failed, falling back to rule-based:', error.message);
    }
  }

  const result = await ruleBased.analyze(prompt);
  return { ...result, provider: 'fallback' };
};

export default { AIProvider, GeminiProvider, RuleBasedProvider, getAIProvider, analyzeWithFallback };
