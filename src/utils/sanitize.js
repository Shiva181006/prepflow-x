import { createId } from './storage'
import {
  DIFFICULTIES,
  STATUSES,
  PLACEMENT_STAGES,
} from '../constants/trackers'

function normalizeDifficulty(value) {
  return DIFFICULTIES.includes(value) ? value : 'Medium'
}

function normalizeStatus(value) {
  return STATUSES.includes(value) ? value : 'Todo'
}

function normalizeStage(value) {
  return PLACEMENT_STAGES.includes(value) ? value : 'Applied'
}

export function sanitizeProblems(items) {
  if (!Array.isArray(items)) return []

  const now = new Date().toISOString()

  return items
    .filter((item) => item && typeof item === 'object')
    .map((item) => ({
      id: typeof item.id === 'string' ? item.id : createId(),
      title: String(item.title ?? ''),
      difficulty: normalizeDifficulty(item.difficulty),
      topic: String(item.topic ?? ''),
      platform: String(item.platform ?? ''),
      link: String(item.link ?? ''),
      status: normalizeStatus(item.status),
      notes: String(item.notes ?? ''),
      createdAt: item.createdAt || now,
      updatedAt: item.updatedAt || now,
    }))
}

export function sanitizeQuestions(items) {
  if (!Array.isArray(items)) return []

  const now = new Date().toISOString()

  return items
    .filter((item) => item && typeof item === 'object')
    .map((item) => ({
      id: typeof item.id === 'string' ? item.id : createId(),
      title: String(item.title ?? ''),
      difficulty: normalizeDifficulty(item.difficulty),
      topic: String(item.topic ?? ''),
      database: String(item.database ?? ''),
      link: String(item.link ?? ''),
      status: normalizeStatus(item.status),
      notes: String(item.notes ?? ''),
      createdAt: item.createdAt || now,
      updatedAt: item.updatedAt || now,
    }))
}

export function sanitizeApplications(items) {
  if (!Array.isArray(items)) return []

  const now = new Date().toISOString()

  return items
    .filter((item) => item && typeof item === 'object')
    .map((item) => ({
      id: typeof item.id === 'string' ? item.id : createId(),
      company: String(item.company ?? ''),
      role: String(item.role ?? ''),
      location: String(item.location ?? ''),
      link: String(item.link ?? ''),
      stage: normalizeStage(item.stage),
      appliedDate: String(item.appliedDate ?? now.split('T')[0]),
      notes: String(item.notes ?? ''),
      createdAt: item.createdAt || now,
      updatedAt: item.updatedAt || now,
    }))
}
