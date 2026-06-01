import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Dashboard from '../pages/Dashboard'
import DSATracker from '../pages/DSATracker'
import SQLTracker from '../pages/SQLTracker'
import PlacementTracker from '../pages/PlacementTracker'
import Analytics from '../pages/Analytics'
import Settings from '../pages/Settings'
import QuestionLibrary from '../pages/QuestionLibrary'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="question-library" element={<QuestionLibrary />} />
          <Route path="dsa" element={<DSATracker />} />
          <Route path="sql" element={<SQLTracker />} />
          <Route path="placement" element={<PlacementTracker />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
