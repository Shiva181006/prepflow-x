import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import PageTransition from '../components/PageTransition'

export default function MainLayout() {
  const location = useLocation()

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-shell__main">
        <TopBar />
        <div className="app-shell__content">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
