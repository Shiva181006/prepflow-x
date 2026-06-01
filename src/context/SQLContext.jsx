import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { createId, loadFromStorage, saveToStorage } from '../utils/storage'
import { sanitizeQuestions } from '../utils/sanitize'

const STORAGE_KEY = 'sql-questions'

const SQLContext = createContext(null)

export function SQLProvider({ children }) {
  const [questions, setQuestions] = useState(() =>
    sanitizeQuestions(loadFromStorage(STORAGE_KEY)),
  )

  useEffect(() => {
    try {
      saveToStorage(STORAGE_KEY, questions)
    } catch {
      // Quota or serialization errors are logged in saveToStorage
    }
  }, [questions])

  const addQuestion = useCallback((question) => {
    const now = new Date().toISOString()
    const newQuestion = {
      id: createId(),
      title: '',
      difficulty: 'Medium',
      topic: '',
      database: '',
      link: '',
      status: 'Todo',
      notes: '',
      createdAt: now,
      updatedAt: now,
      ...question,
    }
    setQuestions((prev) => [...prev, sanitizeQuestions([newQuestion])[0]])
    return newQuestion
  }, [])

  const editQuestion = useCallback((id, updates) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === id
          ? { ...question, ...updates, updatedAt: new Date().toISOString() }
          : question,
      ),
    )
  }, [])

  const deleteQuestion = useCallback((id) => {
    setQuestions((prev) => prev.filter((question) => question.id !== id))
  }, [])

  const replaceQuestions = useCallback((nextQuestions) => {
    setQuestions(sanitizeQuestions(nextQuestions))
  }, [])

  const clearQuestions = useCallback(() => {
    setQuestions([])
  }, [])

  const value = useMemo(
    () => ({
      questions,
      addQuestion,
      editQuestion,
      deleteQuestion,
      replaceQuestions,
      clearQuestions,
    }),
    [
      questions,
      addQuestion,
      editQuestion,
      deleteQuestion,
      replaceQuestions,
      clearQuestions,
    ],
  )

  return <SQLContext.Provider value={value}>{children}</SQLContext.Provider>
}

export function useSQL() {
  const context = useContext(SQLContext)
  if (!context) {
    throw new Error('useSQL must be used within SQLProvider')
  }
  return context
}
