export function createId() {
  return crypto.randomUUID()
}

export function loadFromStorage(key) {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(key)
    if (!stored) return []

    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    try {
      localStorage.removeItem(key)
    } catch {
      // ignore cleanup failures
    }
    return []
  }
}

export function saveToStorage(key, data) {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    if (error?.name === 'QuotaExceededError') {
      console.error(`localStorage quota exceeded for key: ${key}`)
    }
    throw error
  }
}
