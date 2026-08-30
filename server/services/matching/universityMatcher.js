import University from '../../models/University.js';

const WEIGHTS = {
  expertise: 0.3,
  department: 0.15,
  district: 0.15,
  capacity: 0.15,
  pastProjects: 0.1,
  studentSkills: 0.1,
  verified: 0.05,
};

const overlapScore = (listA = [], listB = []) => {
  if (!listA.length || !listB.length) return 0;
  const setB = new Set(listB.map((s) => s.toLowerCase()));
  const matches = listA.filter((a) => setB.has(a.toLowerCase()));
  return Math.min(1, matches.length / Math.max(listA.length, 1));
};

const capacityScore = (university) => {
  const cap = university.availableCapacity || {};
  const projects = cap.projects ?? 0;
  if (projects <= 0) return 0;
  if (projects >= 10) return 100;
  return projects * 10;
};

export const matchUniversities = async (challenge, options = {}) => {
  const { limit = 10, minScore = 20 } = options;

  const universities = await University.find({ verified: true }).lean();
  const challengeTags = [
    challenge.category,
    ...(challenge.tags || []),
    ...(challenge.aiAnalysis?.suggestedTags || []),
    ...(challenge.aiAnalysis?.impactAreas || []),
  ].filter(Boolean);

  const results = universities
    .map((university) => {
      const breakdown = {};
      const explanation = [];

      breakdown.expertise = Math.round(overlapScore(challengeTags, university.expertise) * 100);
      explanation.push(`Expertise match: ${breakdown.expertise}%`);

      breakdown.department = Math.round(overlapScore(challengeTags, university.departments) * 100);
      explanation.push(`Department alignment: ${breakdown.department}%`);

      breakdown.district =
        university.district === challenge.location?.district ? 100 : 30;
      explanation.push(
        breakdown.district === 100
          ? 'Same district — strong local presence'
          : 'Different district — remote collaboration possible'
      );

      breakdown.capacity = Math.round(capacityScore(university));
      explanation.push(`Available project capacity: ${breakdown.capacity}%`);

      const pastCategories = (university.pastProjects || []).map((p) => p.category);
      breakdown.pastProjects = Math.round(overlapScore(challengeTags, pastCategories) * 100);
      explanation.push(`Past project relevance: ${breakdown.pastProjects}%`);

      breakdown.studentSkills = Math.round(overlapScore(challengeTags, university.studentSkills) * 100);
      explanation.push(`Student skills match: ${breakdown.studentSkills}%`);

      breakdown.verified = university.verified ? 100 : 0;
      if (university.verified) explanation.push('Verified institution');

      let total = 0;
      for (const [key, weight] of Object.entries(WEIGHTS)) {
        total += (breakdown[key] || 0) * weight;
      }

      const matchScore = Math.round(total);

      return {
        university,
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

export default { matchUniversities };
