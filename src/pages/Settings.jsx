import { useRef, useState } from 'react'
import {
  Moon,
  Sun,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
} from 'lucide-react'
import ConfirmModal from '../components/ConfirmModal'
import { useTheme } from '../context/ThemeContext'
import { useDSA } from '../context/DSAContext'
import { useSQL } from '../context/SQLContext'
import { usePlacement } from '../context/PlacementContext'

const CLEAR_TARGETS = {
  dsa: {
    title: 'Clear DSA Data',
    message:
      'This will permanently delete all DSA problems. This action cannot be undone.',
  },
  sql: {
    title: 'Clear SQL Data',
    message:
      'This will permanently delete all SQL questions. This action cannot be undone.',
  },
  placement: {
    title: 'Clear Placement Data',
    message:
      'This will permanently delete all placement applications. This action cannot be undone.',
  },
}

function isValidBackup(data) {
  return (
    data &&
    typeof data === 'object' &&
    Array.isArray(data.dsa) &&
    Array.isArray(data.sql) &&
    Array.isArray(data.placement)
  )
}

export default function Settings() {
  const { theme, toggleTheme } = useTheme()
  const { problems, replaceProblems, clearProblems } = useDSA()
  const { questions, replaceQuestions, clearQuestions } = useSQL()
  const { applications, replaceApplications, clearApplications } =
    usePlacement()

  const fileInputRef = useRef(null)
  const [clearTarget, setClearTarget] = useState(null)
  const [feedback, setFeedback] = useState(null)

  const showFeedback = (type, text) => {
    setFeedback({ type, text })
    setTimeout(() => setFeedback(null), 4000)
  }

  const handleExport = () => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      dsa: problems,
      sql: questions,
      placement: applications,
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `preptrack-backup-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
    showFeedback('success', 'Data exported successfully.')
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleImportFile = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (loadEvent) => {
      try {
        const data = JSON.parse(loadEvent.target?.result)
        if (!isValidBackup(data)) {
          showFeedback(
            'error',
            'Invalid backup file. Expected dsa, sql, and placement arrays.',
          )
          return
        }

        replaceProblems(data.dsa)
        replaceQuestions(data.sql)
        replaceApplications(data.placement)
        showFeedback('success', 'Data imported successfully.')
      } catch {
        showFeedback('error', 'Failed to read backup file. Check JSON format.')
      }
    }
    reader.onerror = () => {
      showFeedback('error', 'Failed to read the selected file.')
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  const handleConfirmClear = () => {
    const target = clearTarget
    if (target === 'dsa') clearProblems()
    if (target === 'sql') clearQuestions()
    if (target === 'placement') clearApplications()
    setClearTarget(null)
    showFeedback('success', `${CLEAR_TARGETS[target].title} completed.`)
  }

  return (
    <div className="page pf-page">
      <header className="page__header">
        <h1 className="page__title">Settings</h1>
        <p className="page__subtitle">
          Configure app preferences and manage your data.
        </p>
      </header>

      {feedback && (
        <div
          className={`settings-message settings-message--${feedback.type}`}
          role="status"
        >
          {feedback.text}
        </div>
      )}

      <section className="page__section">
        <h2 className="page__section-title">Theme</h2>
        <div className="settings-panel">
          <div className="settings-row">
            <div className="settings-row__info">
              <span className="settings-row__label">Appearance</span>
              <span className="settings-row__desc">
                Current theme:{' '}
                <span className="settings-theme-badge">{theme} mode</span>
              </span>
            </div>
            <button
              type="button"
              className="settings-btn settings-btn--primary"
              onClick={toggleTheme}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              Switch to {theme === 'light' ? 'Dark' : 'Light'}
            </button>
          </div>
        </div>
      </section>

      <section className="page__section">
        <h2 className="page__section-title">Data Management</h2>
        <div className="settings-panel">
          <div className="settings-row">
            <div className="settings-row__info">
              <span className="settings-row__label">Stored Records</span>
              <div className="settings-counts">
                <span>{problems.length} DSA problems</span>
                <span>{questions.length} SQL questions</span>
                <span>{applications.length} applications</span>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-row__info">
              <span className="settings-row__label">Export Data</span>
              <span className="settings-row__desc">
                Download all DSA, SQL, and placement data as JSON.
              </span>
            </div>
            <button
              type="button"
              className="settings-btn settings-btn--primary"
              onClick={handleExport}
            >
              <Download size={16} aria-hidden="true" />
              Export JSON
            </button>
          </div>

          <div className="settings-row">
            <div className="settings-row__info">
              <span className="settings-row__label" id="import-data-label">
                Import Data
              </span>
              <span className="settings-row__desc">
                Upload a backup JSON file to restore application state.
              </span>
            </div>
            <button
              type="button"
              className="settings-btn"
              onClick={handleImportClick}
              aria-labelledby="import-data-label"
            >
              <Upload size={16} aria-hidden="true" />
              Import JSON
            </button>
            <input
              ref={fileInputRef}
              id="import-data-input"
              type="file"
              accept="application/json,.json"
              className="settings-import-input"
              onChange={handleImportFile}
            />
          </div>
        </div>
      </section>

      <section className="page__section">
        <h2 className="page__section-title">Clear Data</h2>
        <div className="settings-panel">
          <div className="settings-row">
            <div className="settings-row__info">
              <span className="settings-row__label">Clear DSA Problems</span>
              <span className="settings-row__desc">
                Remove all {problems.length} DSA problems.
              </span>
            </div>
            <button
              type="button"
              className="settings-btn settings-btn--danger"
              onClick={() => setClearTarget('dsa')}
              disabled={problems.length === 0}
            >
              <Trash2 size={16} aria-hidden="true" />
              Clear DSA
            </button>
          </div>

          <div className="settings-row">
            <div className="settings-row__info">
              <span className="settings-row__label">Clear SQL Questions</span>
              <span className="settings-row__desc">
                Remove all {questions.length} SQL questions.
              </span>
            </div>
            <button
              type="button"
              className="settings-btn settings-btn--danger"
              onClick={() => setClearTarget('sql')}
              disabled={questions.length === 0}
            >
              <Trash2 size={16} aria-hidden="true" />
              Clear SQL
            </button>
          </div>

          <div className="settings-row">
            <div className="settings-row__info">
              <span className="settings-row__label">
                Clear Placement Applications
              </span>
              <span className="settings-row__desc">
                Remove all {applications.length} applications.
              </span>
            </div>
            <button
              type="button"
              className="settings-btn settings-btn--danger"
              onClick={() => setClearTarget('placement')}
              disabled={applications.length === 0}
            >
              <Trash2 size={16} aria-hidden="true" />
              Clear Placement
            </button>
          </div>

          <div className="settings-row">
            <div className="settings-row__info">
              <span className="settings-row__label">
                <AlertTriangle
                  size={14}
                  style={{ verticalAlign: 'middle', marginRight: 6 }}
                  aria-hidden="true"
                />
                Destructive actions require confirmation
              </span>
            </div>
          </div>
        </div>
      </section>

      {clearTarget && (
        <ConfirmModal
          title={CLEAR_TARGETS[clearTarget].title}
          message={CLEAR_TARGETS[clearTarget].message}
          confirmLabel="Confirm Clear"
          onConfirm={handleConfirmClear}
          onCancel={() => setClearTarget(null)}
        />
      )}
    </div>
  )
}
