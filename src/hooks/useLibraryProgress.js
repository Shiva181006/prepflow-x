import { useMemo } from 'react'
import { computeLibraryProgress } from '../utils/libraryProgress'

export function useLibraryProgress(problems) {
  return useMemo(() => computeLibraryProgress(problems), [problems])
}
