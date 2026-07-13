const { importantKeywords } = require('./atsWeights');

/**
 * Extract words from text for matching
 */
const extractWords = (text) => {
  if (!text) return [];
  return text.toLowerCase().match(/\b[a-z]+\b/g) || [];
};

/**
 * Match keywords in text — supports both single-word and multi-word phrases
 */
const matchKeywords = (text, customKeywords = null) => {
  const keywordsToMatch = customKeywords || importantKeywords;
  const textLower = (text || '').toLowerCase();
  const wordSet = new Set(extractWords(text));

  const matched = [];
  const missing = [];

  for (const keyword of keywordsToMatch) {
    const keywordLower = keyword.toLowerCase();
    // Multi-word phrases: use substring search on the full text
    // Single words: use the word set for O(1) lookup
    const found = keywordLower.includes(' ')
      ? textLower.includes(keywordLower)
      : wordSet.has(keywordLower);

    if (found) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  }

  return {
    matched,
    missing,
    totalFound: matched.length,
  };
};

/**
 * Count specific patterns in text
 */
const countPatterns = (text, patterns) => {
  const results = {};

  for (const { name, pattern } of patterns) {
    const matches = text.match(new RegExp(pattern, 'gi'));
    results[name] = matches ? matches.length : 0;
  }

  return results;
};

/**
 * Check if text contains action verbs
 */
const findActionVerbs = (text) => {
  const actionVerbs = [
    'developed', 'implemented', 'designed', 'created', 'managed', 'led', 'optimized',
    'analyzed', 'improved', 'built', 'delivered', 'reduced', 'increased', 'achieved',
    'coordinated', 'facilitated', 'negotiated', 'executed', 'launched', 'streamlined',
    'transformed', 'accelerated', 'leveraged', 'mentored', 'collaborated', 'spearheaded',
  ];

  const words = extractWords(text);
  const found = actionVerbs.filter(verb => words.includes(verb));

  return found;
};

/**
 * Check for quantifiable achievements (numbers in text)
 */
const findQuantifiableAchievements = (text) => {
  // Look for patterns like: "increased by 20%", "reduced by 50", "managed team of 5"
  const achievementPatterns = [
    /increased\s+by\s+(\d+%)?/gi,
    /decreased\s+by\s+(\d+%)?/gi,
    /improved\s+by\s+(\d+%)?/gi,
    /reduced\s+by\s+(\d+%)?/gi,
    /saved\s+(\d+%)?/gi,
    /managed\s+(a\s+)?team\s+of\s+(\d+)/gi,
    /(\d+)\s+years?\s+of\s+experience/gi,
    /(\d+)\s+years?\s+experience/gi,
  ];

  const achievements = [];

  for (const pattern of achievementPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      achievements.push(...matches);
    }
  }

  return achievements;
};

module.exports = {
  matchKeywords,
  extractWords,
  countPatterns,
  findActionVerbs,
  findQuantifiableAchievements,
};