import Industry from '../../models/Industry.js';

const WEIGHTS = {
  expertise: 0.25,
  csrDomains: 0.2,
  technologyAreas: 0.15,
  district: 0.15,
  fundingCapacity: 0.1,
  mentorship: 0.1,
  pilotSupport: 0.05,
};

const overlapScore = (listA = [], listB = []) => {
  if (!listA.length || !listB.length) return 0;
  const setB = new Set(listB.map((s) => s.toLowerCase()));
  const matches = listA.filter((a) => setB.has(a.toLowerCase()));
  return Math.min(1, matches.length / Math.max(listA.length, 1));
};

const fundingScore = (industry) => {
  const max = industry.fundingCapacity?.max ?? 0;
  if (max >= 5000000) return 100;
  if (max >= 1000000) return 80;
  if (max >= 500000) return 60;
  if (max >= 100000) return 40;
  return 20;
};

export const matchIndustries = async (challenge, options = {}) => {
  const { limit = 10, minScore = 20 } = options;

  const industries = await Industry.find({ verified: true }).lean();
  const challengeTags = [
    challenge.category,
    ...(challenge.tags || []),
    ...(challenge.aiAnalysis?.suggestedTags || []),
    ...(challenge.aiAnalysis?.impactAreas || []),
  ].filter(Boolean);

  const results = industries
    .map((industry) => {
      const breakdown = {};
      const explanation = [];

      breakdown.expertise = Math.round(overlapScore(challengeTags, industry.expertise) * 100);
      explanation.push(`Expertise match: ${breakdown.expertise}%`);

      breakdown.csrDomains = Math.round(overlapScore(challengeTags, industry.csrDomains) * 100);
      explanation.push(`CSR domain alignment: ${breakdown.csrDomains}%`);

      breakdown.technologyAreas = Math.round(
        overlapScore(challengeTags, industry.technologyAreas) * 100
      );
      explanation.push(`Technology area match: ${breakdown.technologyAreas}%`);

      const challengeDistrict = challenge.location?.district;
      breakdown.district =
        industry.districts?.includes(challengeDistrict) ? 100 : 40;
      explanation.push(
        breakdown.district === 100
          ? 'Operates in challenge district'
          : 'No direct district presence'
      );

      breakdown.fundingCapacity = fundingScore(industry);
      explanation.push(`Funding capacity score: ${breakdown.fundingCapacity}%`);

      breakdown.mentorship = industry.mentorship?.available ? 100 : 20;
      explanation.push(
        industry.mentorship?.available ? 'Mentorship available' : 'Limited mentorship'
      );

      breakdown.pilotSupport = industry.pilotSupport?.available ? 100 : 20;
      explanation.push(
        industry.pilotSupport?.available ? 'Pilot support available' : 'No pilot support'
      );

      let total = 0;
      for (const [key, weight] of Object.entries(WEIGHTS)) {
        total += (breakdown[key] || 0) * weight;
      }

      const matchScore = Math.round(total);

      return {
        industry,
        matchScore,
        breakdown,
        explanation,
      };
    })
    .filter((r) => r.matchScore >= minScore)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);

  return results;
};

export default { matchIndustries };
