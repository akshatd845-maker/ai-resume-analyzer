export function getMatchTone(matchPercentage) {
  const s = matchPercentage ?? 0
  if (s >= 80) return 'success'
  if (s >= 60) return 'warning'
  return 'danger'
}

export function formatMatchPercent(matchPercentage) {
  const s = matchPercentage ?? 0
  return `${s}%`
}

