import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { loadFromStorage, saveToStorage } from '../utils/storage'

const STORAGE_KEY = 'prepflow-library-bookmarks'

function loadBookmarks() {
  const data = loadFromStorage(STORAGE_KEY)
  if (!Array.isArray(data)) return []
  return data.filter((id) => typeof id === 'string')
}

const LibraryContext = createContext(null)

export function LibraryProvider({ children }) {
  const [bookmarks, setBookmarks] = useState(loadBookmarks)

  useEffect(() => {
    try {
      saveToStorage(STORAGE_KEY, bookmarks)
    } catch {
      // ignore persistence errors
    }
  }, [bookmarks])

  const isBookmarked = useCallback(
    (questionId) => bookmarks.includes(questionId),
    [bookmarks],
  )

  const toggleBookmark = useCallback((questionId) => {
    setBookmarks((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId],
    )
  }, [])

  const value = useMemo(
    () => ({
      bookmarks,
      isBookmarked,
      toggleBookmark,
    }),
    [bookmarks, isBookmarked, toggleBookmark],
  )

  return (
    <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
  )
}

export function useLibrary() {
  const context = useContext(LibraryContext)
  if (!context) {
    throw new Error('useLibrary must be used within LibraryProvider')
  }
  return context
}
