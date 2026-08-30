import { getPriorityLabel } from '../../utils/constants.js';

const WEIGHTS = {
  urgency: 0.25,
  affectedPopulation: 0.2,
  feasibility: 0.15,
  evidenceQuality: 0.1,
  districtNeed: 0.15,
  aiUrgency: 0.15,
};

const urgencyMap = { low: 25, medium: 50, high: 75, critical: 95 };

const scoreAffectedPopulation = (count) => {
  if (!count || count <= 0) return 30;
  if (count >= 100000) return 100;
  if (count >= 10000) return 85;
  if (count >= 1000) return 70;
  if (count >= 100) return 55;
  return 40;
};

const scoreEvidence = (evidence = []) => {
  if (evidence.length === 0) return 20;
  if (evidence.length >= 5) return 100;
  if (evidence.length >= 3) return 80;
  return 60;
};

const scoreDistrictNeed = (district) => {
  const highNeedDistricts = ['Palamu', 'Latehar', 'Garhwa', 'Simdega', 'Gumla', 'Khunti'];
  return highNeedDistricts.includes(district) ? 85 : 55;
};

export const calculatePriority = (challenge) => {
  const explanation = [];
  const scores = {};

  scores.urgency = urgencyMap[challenge.urgency] || 50;
  explanation.push(`Urgency (${challenge.urgency}): ${scores.urgency}/100`);

  scores.affectedPopulation = scoreAffectedPopulation(challenge.affectedPopulation);
  explanation.push(`Affected population (${challenge.affectedPopulation || 0}): ${scores.affectedPopulation}/100`);

  scores.feasibility = challenge.aiAnalysis?.feasibilityScore ?? 60;
  explanation.push(`Feasibility: ${scores.feasibility}/100`);

  scores.evidenceQuality = scoreEvidence(challenge.evidence);
  explanation.push(`Evidence quality (${challenge.evidence?.length || 0} items): ${scores.evidenceQuality}/100`);

  scores.districtNeed = scoreDistrictNeed(challenge.location?.district);
  explanation.push(`District need (${challenge.location?.district}): ${scores.districtNeed}/100`);

  scores.aiUrgency = challenge.aiAnalysis?.urgencyScore ?? 50;
  explanation.push(`AI urgency assessment: ${scores.aiUrgency}/100`);

  let total = 0;
  for (const [key, weight] of Object.entries(WEIGHTS)) {
    total += (scores[key] || 0) * weight;
  }

  const priorityScore = Math.round(Math.min(100, Math.max(0, total)));
  const priorityLabel = getPriorityLabel(priorityScore);

  return {
    priorityScore,
    priorityLabel,
    explanation,
    breakdown: scores,
    weights: WEIGHTS,
  };
};

export default { calculatePriority };
