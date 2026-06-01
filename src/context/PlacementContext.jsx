import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { PLACEMENT_STAGES } from '../constants/trackers'
import { createId, loadFromStorage, saveToStorage } from '../utils/storage'
import { sanitizeApplications } from '../utils/sanitize'

const STORAGE_KEY = 'placement-applications'

const PlacementContext = createContext(null)

export function PlacementProvider({ children }) {
  const [applications, setApplications] = useState(() =>
    sanitizeApplications(loadFromStorage(STORAGE_KEY)),
  )

  useEffect(() => {
    try {
      saveToStorage(STORAGE_KEY, applications)
    } catch {
      // Quota or serialization errors are logged in saveToStorage
    }
  }, [applications])

  const addApplication = useCallback((application) => {
    const now = new Date().toISOString()
    const newApplication = {
      id: createId(),
      company: '',
      role: '',
      location: '',
      link: '',
      stage: 'Applied',
      appliedDate: now.split('T')[0],
      notes: '',
      createdAt: now,
      updatedAt: now,
      ...application,
    }
    setApplications((prev) => [
      ...prev,
      sanitizeApplications([newApplication])[0],
    ])
    return newApplication
  }, [])

  const editApplication = useCallback((id, updates) => {
    setApplications((prev) =>
      prev.map((application) =>
        application.id === id
          ? {
              ...application,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : application,
      ),
    )
  }, [])

  const deleteApplication = useCallback((id) => {
    setApplications((prev) =>
      prev.filter((application) => application.id !== id),
    )
  }, [])

  const updateApplicationStage = useCallback((id, stage) => {
    const normalizedStage = PLACEMENT_STAGES.includes(stage) ? stage : 'Applied'
    setApplications((prev) =>
      prev.map((application) =>
        application.id === id
          ? {
              ...application,
              stage: normalizedStage,
              updatedAt: new Date().toISOString(),
            }
          : application,
      ),
    )
  }, [])

  const replaceApplications = useCallback((nextApplications) => {
    setApplications(sanitizeApplications(nextApplications))
  }, [])

  const clearApplications = useCallback(() => {
    setApplications([])
  }, [])

  const value = useMemo(
    () => ({
      applications,
      stages: PLACEMENT_STAGES,
      addApplication,
      editApplication,
      deleteApplication,
      updateApplicationStage,
      replaceApplications,
      clearApplications,
    }),
    [
      applications,
      addApplication,
      editApplication,
      deleteApplication,
      updateApplicationStage,
      replaceApplications,
      clearApplications,
    ],
  )

  return (
    <PlacementContext.Provider value={value}>
      {children}
    </PlacementContext.Provider>
  )
}

export function usePlacement() {
  const context = useContext(PlacementContext)
  if (!context) {
    throw new Error('usePlacement must be used within PlacementProvider')
  }
  return context
}
