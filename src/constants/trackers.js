export const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

export const STATUSES = ['Todo', 'In Progress', 'Done']

export const PLACEMENT_STAGES = [
  'Applied',
  'Online Assessment',
  'Interview',
  'Offer',
  'Rejected',
]

export const DIFFICULTY_COLORS = {
  Easy: '#16a34a',
  Medium: '#ca8a04',
  Hard: '#dc2626',
}

export const STATUS_COLORS = {
  Todo: '#6b7280',
  'In Progress': '#2563eb',
  Done: '#16a34a',
}

export const STAGE_CHART_COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#3b82f6',
  '#22c55e',
  '#ef4444',
]

export function getDifficultyClass(difficulty) {
  const key = DIFFICULTIES.includes(difficulty)
    ? difficulty.toLowerCase()
    : 'medium'
  return `dsa-badge dsa-badge--${key}`
}

export function getStatusClass(status) {
  if (status === 'In Progress') return 'dsa-badge dsa-badge--progress'
  if (status === 'Done') return 'dsa-badge dsa-badge--done'
  return 'dsa-badge dsa-badge--todo'
}

export function buildDistribution(items, field, categories) {
  return categories.map((name) => ({
    name,
    value: items.filter((item) => item[field] === name).length,
  }))
}
