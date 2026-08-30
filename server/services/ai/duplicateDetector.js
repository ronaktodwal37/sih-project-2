import Challenge from '../../models/Challenge.js';

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does',
  'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can',
  'this', 'that', 'these', 'those', 'it', 'its', 'they', 'them', 'their', 'we', 'our',
  'you', 'your', 'he', 'she', 'his', 'her', 'not', 'no', 'from', 'by', 'as', 'about',
]);

const tokenize = (text) =>
  (text || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

const termFrequency = (tokens) => {
  const tf = {};
  tokens.forEach((t) => {
    tf[t] = (tf[t] || 0) + 1;
  });
  return tf;
};

const cosineSimilarity = (tfA, tfB) => {
  const allTerms = new Set([...Object.keys(tfA), ...Object.keys(tfB)]);
  let dot = 0;
  let magA = 0;
  let magB = 0;

  allTerms.forEach((term) => {
    const a = tfA[term] || 0;
    const b = tfB[term] || 0;
    dot += a * b;
    magA += a * a;
    magB += b * b;
  });

  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
};

const keywordOverlap = (tokensA, tokensB) => {
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  const intersection = [...setA].filter((t) => setB.has(t));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 0 : intersection.length / union.size;
};

const computeSimilarity = (textA, textB) => {
  const tokensA = tokenize(textA);
  const tokensB = tokenize(textB);
  const tfA = termFrequency(tokensA);
  const tfB = termFrequency(tokensB);
  const cosine = cosineSimilarity(tfA, tfB);
  const jaccard = keywordOverlap(tokensA, tokensB);
  return cosine * 0.6 + jaccard * 0.4;
};

const buildMatchReason = (score, sameCategory, sameDistrict) => {
  const reasons = [];
  if (score >= 0.7) reasons.push('High textual similarity');
  else if (score >= 0.4) reasons.push('Moderate textual similarity');
  else reasons.push('Some keyword overlap');
  if (sameCategory) reasons.push('Same category');
  if (sameDistrict) reasons.push('Same district');
  return reasons.join('; ');
};

export const findDuplicates = async (challenge, options = {}) => {
  const { threshold = 0.35, limit = 10, excludeId } = options;

  const query = {
    status: { $nin: ['rejected', 'merged'] },
  };
  if (excludeId || challenge._id) {
    query._id = { $ne: excludeId || challenge._id };
  }

  const candidates = await Challenge.find(query)
    .select('title description category location tags status')
    .limit(200)
    .lean();

  const sourceText = `${challenge.title} ${challenge.description} ${(challenge.tags || []).join(' ')}`;

  const results = candidates
    .map((candidate) => {
      const candidateText = `${candidate.title} ${candidate.description} ${(candidate.tags || []).join(' ')}`;
      let score = computeSimilarity(sourceText, candidateText);

      if (candidate.category === challenge.category) score += 0.1;
      if (candidate.location?.district === challenge.location?.district) score += 0.05;

      score = Math.min(score, 1);

      return {
        challengeId: candidate._id,
        similarityScore: Math.round(score * 100) / 100,
        matchReason: buildMatchReason(
          score,
          candidate.category === challenge.category,
          candidate.location?.district === challenge.location?.district
        ),
        title: candidate.title,
        status: candidate.status,
      };
    })
    .filter((r) => r.similarityScore >= threshold)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);

  return results;
};

export default { findDuplicates };
