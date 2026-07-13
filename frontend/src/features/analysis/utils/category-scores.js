const CATEGORY_LABELS = {
  contact: 'Contact Information',
  summary: 'Professional Summary',
  skills: 'Skills',
  education: 'Education',
  experience: 'Experience',
  projects: 'Projects',
  certifications: 'Certifications',
  keywords: 'Keywords',
  achievements: 'Achievements',
  formatting: 'Formatting',
}

/**
 * Convert backend atsResults.categoryScores (object) to grid items (array).
 */
export function formatCategoryScores(categoryScores) {
  if (Array.isArray(categoryScores)) {
    return categoryScores
  }

  if (!categoryScores || typeof categoryScores !== 'object') {
    return []
  }

  return Object.entries(categoryScores).map(([key, percent]) => ({
    key,
    title: CATEGORY_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1),
    percent: typeof percent === 'number' ? percent : null,
    insight: null,
  }))
}
