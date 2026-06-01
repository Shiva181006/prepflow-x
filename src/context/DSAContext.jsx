import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { createId, loadFromStorage, saveToStorage } from '../utils/storage'
import { sanitizeProblems } from '../utils/sanitize'

const STORAGE_KEY = 'dsa-problems'

const DSAContext = createContext(null)

export function DSAProvider({ children }) {
  const [problems, setProblems] = useState(() =>
    sanitizeProblems(loadFromStorage(STORAGE_KEY)),
  )

  useEffect(() => {
    try {
      saveToStorage(STORAGE_KEY, problems)
    } catch {
      // Quota or serialization errors are logged in saveToStorage
    }
  }, [problems])

  const addProblem = useCallback((problem) => {
    const now = new Date().toISOString()
    const newProblem = {
      id: createId(),
      title: '',
      difficulty: 'Medium',
      topic: '',
      platform: '',
      link: '',
      status: 'Todo',
      notes: '',
      createdAt: now,
      updatedAt: now,
      ...problem,
    }
    setProblems((prev) => [...prev, sanitizeProblems([newProblem])[0]])
    return newProblem
  }, [])

  const editProblem = useCallback((id, updates) => {
    setProblems((prev) =>
      prev.map((problem) =>
        problem.id === id
          ? { ...problem, ...updates, updatedAt: new Date().toISOString() }
          : problem,
      ),
    )
  }, [])

  const deleteProblem = useCallback((id) => {
    setProblems((prev) => prev.filter((problem) => problem.id !== id))
  }, [])

  const replaceProblems = useCallback((nextProblems) => {
    setProblems(sanitizeProblems(nextProblems))
  }, [])

  const clearProblems = useCallback(() => {
    setProblems([])
  }, [])

  const value = useMemo(
    () => ({
      problems,
      addProblem,
      editProblem,
      deleteProblem,
      replaceProblems,
      clearProblems,
    }),
    [
      problems,
      addProblem,
      editProblem,
      deleteProblem,
      replaceProblems,
      clearProblems,
    ],
  )

  return <DSAContext.Provider value={value}>{children}</DSAContext.Provider>
}

export function useDSA() {
  const context = useContext(DSAContext)
  if (!context) {
    throw new Error('useDSA must be used within DSAProvider')
  }
  return context
}
