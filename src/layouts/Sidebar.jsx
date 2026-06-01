import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Code2,
  Database,
  Briefcase,
  BarChart3,
  Settings,
  BookOpen,
  PanelLeftClose,
  PanelLeft,
  Flame,
  TrendingUp,
} from 'lucide-react'
import { useDSA } from '../context/DSAContext'
import { useSQL } from '../context/SQLContext'
import { useLibraryProgress } from '../hooks/useLibraryProgress'

const STORAGE_KEY = 'prepflow-sidebar-collapsed'

function getStudyStreak(items) {
  const daySet = new Set()
  for (const item of items) {
    if (!item?.updatedAt) continue
    const t = new Date(item.updatedAt)
    if (Number.isNaN(t.getTime())) continue
    daySet.add(t.toISOString().slice(0, 10))
  }
  if (daySet.size === 0) return 0

  let streak = 0
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)

  for (;;) {
    const key = cursor.toISOString().slice(0, 10)
    if (daySet.has(key)) {
      streak += 1
      cursor.setDate(cursor.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/question-library', label: 'Question Library', icon: BookOpen },
  { to: '/dsa', label: 'DSA Tracker', icon: Code2 },
  { to: '/sql', label: 'SQL Tracker', icon: Database },
  { to: '/placement', label: 'Placement', icon: Briefcase },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const { problems } = useDSA()
  const { questions } = useSQL()
  const library = useLibraryProgress(problems)

  const totalDsa = problems.length
  const totalSql = questions.length
  const completedDsa = problems.filter((p) => p.status === 'Done').length
  const completedSql = questions.filter((q) => q.status === 'Done').length
  const overallRate =
    totalDsa + totalSql > 0
      ? Math.round(((completedDsa + completedSql) / (totalDsa + totalSql)) * 100)
      : 0

  const streak = getStudyStreak([...problems, ...questions])

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(STORAGE_KEY) === 'true'
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(collapsed))
    } catch {
      // ignore
    }
  }, [collapsed])

  return (
    <aside
      className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`}
      aria-label="Application sidebar"
    >
      <div className="sidebar__brand">
        <div className="sidebar__logo" aria-hidden="true">
          PX
        </div>
        <div className="sidebar__brand-text">
          <span className="sidebar__brand-title">PrepFlow X</span>
          <span className="sidebar__brand-tagline">Placement prep</span>
        </div>
        <button
          type="button"
          className="sidebar__collapse-btn"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      <div className="sidebar__widgets">
        <div
          className="sidebar__widget sidebar__widget--streak"
          title={`${streak} day study streak`}
        >
          <div className="sidebar__widget-head">
            <span className="sidebar__widget-icon" aria-hidden="true">
              <Flame size={16} />
            </span>
            <div className="sidebar__widget-body">
              <p className="sidebar__widget-label">Study streak</p>
              <p className="sidebar__widget-value">
                {streak}
                <span className="sidebar__widget-unit">
                  {streak === 1 ? 'day' : 'days'}
                </span>
              </p>
              <p className="sidebar__widget-hint">
                {streak > 0
                  ? 'Keep the momentum going'
                  : 'Log activity to start a streak'}
              </p>
            </div>
          </div>
        </div>

        <div
          className="sidebar__widget sidebar__widget--progress"
          title={`${overallRate}% prep progress`}
        >
          <div className="sidebar__widget-head">
            <span className="sidebar__widget-icon" aria-hidden="true">
              <TrendingUp size={16} />
            </span>
            <div className="sidebar__widget-body">
              <p className="sidebar__widget-label">Prep progress</p>
              <p className="sidebar__widget-value">{overallRate}%</p>
              <p className="sidebar__widget-hint">
                Library {library.overall.percent}% · DSA &amp; SQL done
              </p>
              <div className="sidebar__widget-bar" aria-hidden="true">
                <span
                  className="sidebar__widget-bar-fill"
                  style={{ width: `${overallRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Main navigation">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
            }
          >
            <motion.span
              className="sidebar__link-icon"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={18} strokeWidth={2} />
            </motion.span>
            <span className="sidebar__link-label">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
