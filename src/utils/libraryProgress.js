import {
  DSA_QUESTIONS,
  LIBRARY_COMPANIES,
  LIBRARY_TOPICS,
} from '../data/dsaQuestions'
import { DIFFICULTIES } from '../constants/trackers'

export function normalizeLibraryValue(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
}

export function findMatchingProblem(problems, question) {
  const title = normalizeLibraryValue(question.title)
  const url = normalizeLibraryValue(question.url)

  return problems.find((problem) => {
    if (normalizeLibraryValue(problem.title) === title) return true
    if (url && normalizeLibraryValue(problem.link) === url) return true
    return false
  })
}

export function isLibraryTracked(problems, question) {
  return Boolean(findMatchingProblem(problems, question))
}

export function isLibrarySolved(problems, question) {
  const match = findMatchingProblem(problems, question)
  return match?.status === 'Done'
}

function countSolved(problems, questions) {
  return questions.filter((q) => isLibrarySolved(problems, q)).length
}

export function computeLibraryProgress(problems) {
  const total = DSA_QUESTIONS.length
  const solved = countSolved(problems, DSA_QUESTIONS)
  const tracked = DSA_QUESTIONS.filter((q) =>
    isLibraryTracked(problems, q),
  ).length

  const solvedIds = new Set(
    DSA_QUESTIONS.filter((q) => isLibrarySolved(problems, q)).map((q) => q.id),
  )
  const trackedIds = new Set(
    DSA_QUESTIONS.filter((q) => isLibraryTracked(problems, q)).map((q) => q.id),
  )

  const byCompany = LIBRARY_COMPANIES.map((company) => {
    const questions = DSA_QUESTIONS.filter((q) => q.companies.includes(company))
    const solvedCount = countSolved(problems, questions)
    return {
      label: company,
      total: questions.length,
      solved: solvedCount,
      percent:
        questions.length > 0
          ? Math.round((solvedCount / questions.length) * 100)
          : 0,
    }
  })
    .filter((row) => row.total > 0)
    .sort((a, b) => b.total - a.total)

  const byTopic = LIBRARY_TOPICS.map((topic) => {
    const questions = DSA_QUESTIONS.filter((q) => q.topic === topic)
    const solvedCount = countSolved(problems, questions)
    return {
      label: topic,
      total: questions.length,
      solved: solvedCount,
      percent:
        questions.length > 0
          ? Math.round((solvedCount / questions.length) * 100)
          : 0,
    }
  }).sort((a, b) => b.total - a.total)

  const byDifficulty = DIFFICULTIES.map((difficulty) => {
    const questions = DSA_QUESTIONS.filter((q) => q.difficulty === difficulty)
    const solvedCount = countSolved(problems, questions)
    return {
      label: difficulty,
      total: questions.length,
      solved: solvedCount,
      percent:
        questions.length > 0
          ? Math.round((solvedCount / questions.length) * 100)
          : 0,
    }
  })

  return {
    overall: {
      total,
      solved,
      tracked,
      percent: total > 0 ? Math.round((solved / total) * 100) : 0,
    },
    byCompany,
    byTopic,
    byDifficulty,
    solvedIds,
    trackedIds,
  }
}
