import { useMemo, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  ExternalLink,
  Plus,
  Check,
  Star,
  CheckCircle2,
} from 'lucide-react'
import {
  DSA_QUESTIONS,
  LIBRARY_TOPICS,
  LIBRARY_COMPANIES,
} from '../data/dsaQuestions'
import { DIFFICULTIES, getDifficultyClass } from '../constants/trackers'
import { useDSA } from '../context/DSAContext'
import { useLibrary } from '../context/LibraryContext'
import { useLibraryProgress } from '../hooks/useLibraryProgress'
import {
  isLibraryTracked,
  isLibrarySolved,
} from '../utils/libraryProgress'
import EmptyState from '../components/EmptyState'
import ProgressBar from '../components/ProgressBar'
import LibraryStatsPanel from '../components/LibraryStatsPanel'
import './QuestionLibrary.css'

const FILTER_ALL = 'All'

export default function QuestionLibrary() {
  const { problems, addProblem } = useDSA()
  const { isBookmarked, toggleBookmark } = useLibrary()
  const progress = useLibraryProgress(problems)

  const [search, setSearch] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState(FILTER_ALL)
  const [topicFilter, setTopicFilter] = useState(FILTER_ALL)
  const [companyFilter, setCompanyFilter] = useState(FILTER_ALL)
  const [bookmarksOnly, setBookmarksOnly] = useState(false)
  const [toast, setToast] = useState(null)

  const filteredQuestions = useMemo(() => {
    const query = String(search ?? '')
      .trim()
      .toLowerCase()
    return DSA_QUESTIONS.filter((question) => {
      const matchesSearch =
        !query || question.title.toLowerCase().includes(query)
      const matchesDifficulty =
        difficultyFilter === FILTER_ALL ||
        question.difficulty === difficultyFilter
      const matchesTopic =
        topicFilter === FILTER_ALL || question.topic === topicFilter
      const matchesCompany =
        companyFilter === FILTER_ALL ||
        question.companies.includes(companyFilter)
      const matchesBookmark =
        !bookmarksOnly || isBookmarked(question.id)
      return (
        matchesSearch &&
        matchesDifficulty &&
        matchesTopic &&
        matchesCompany &&
        matchesBookmark
      )
    })
  }, [
    search,
    difficultyFilter,
    topicFilter,
    companyFilter,
    bookmarksOnly,
    isBookmarked,
  ])

  const showToast = useCallback((type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3200)
  }, [])

  const handleAddToTracker = (question) => {
    if (isLibraryTracked(problems, question)) {
      showToast('info', `"${question.title}" is already in your tracker.`)
      return
    }

    addProblem({
      title: question.title,
      difficulty: question.difficulty,
      topic: question.topic,
      link: question.url,
      platform: 'LeetCode',
      status: 'Todo',
    })

    showToast('success', `"${question.title}" added to DSA Tracker.`)
  }

  const { overall, byCompany, byTopic, byDifficulty } = progress

  return (
    <div className="page pf-page ql-page">
      <header className="page__header">
        <h1 className="page__title">Question Library</h1>
        <p className="page__subtitle">
          Browse 50 popular interview questions. Mark progress in the DSA Tracker
          (status Done) to count as solved.
        </p>
        <div className="ql-header__meta">
          <span className="ql-meta-pill">{overall.total} questions</span>
          <span className="ql-meta-pill ql-meta-pill--success">
            {overall.solved} solved
          </span>
          <span className="ql-meta-pill">{overall.tracked} in tracker</span>
          <span className="ql-meta-pill">
            Showing {filteredQuestions.length}
          </span>
        </div>
      </header>

      <section className="ql-overall glass" aria-label="Library progress">
        <div className="ql-overall__head">
          <h2 className="ql-overall__title">Overall progress</h2>
          <span className="ql-overall__percent">{overall.percent}%</span>
        </div>
        <ProgressBar
          value={overall.percent}
          label={null}
          detail={`${overall.solved} solved / ${overall.total} questions`}
          showLabel={false}
        />
      </section>

      <div className="ql-stats-grid">
        <LibraryStatsPanel
          title="By company"
          rows={byCompany}
        />
        <LibraryStatsPanel
          title="By topic"
          rows={byTopic}
        />
        <LibraryStatsPanel
          title="By difficulty"
          rows={byDifficulty}
        />
      </div>

      <section className="ql-filters" aria-label="Library filters">
        <label className="pf-search">
          <Search size={16} color="var(--pf-text-muted)" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search by title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search questions by title"
          />
        </label>

        <div className="ql-filters__row">
          <button
            type="button"
            className={`pf-chip ql-favorites-chip${bookmarksOnly ? ' pf-chip--active' : ''}`}
            onClick={() => setBookmarksOnly((v) => !v)}
            aria-pressed={bookmarksOnly}
          >
            <Star
              size={14}
              fill={bookmarksOnly ? 'currentColor' : 'none'}
              aria-hidden="true"
            />
            Bookmarks only
          </button>
        </div>

        <div className="ql-filters__row">
          <span className="ql-filters__label">Difficulty</span>
          <div className="pf-chips" role="group" aria-label="Filter by difficulty">
            {[FILTER_ALL, ...DIFFICULTIES].map((level) => (
              <button
                key={level}
                type="button"
                className={`pf-chip${difficultyFilter === level ? ' pf-chip--active' : ''}`}
                onClick={() => setDifficultyFilter(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="ql-filters__row">
          <span className="ql-filters__label">Topic</span>
          <div className="pf-chips" role="group" aria-label="Filter by topic">
            {[FILTER_ALL, ...LIBRARY_TOPICS].map((topic) => (
              <button
                key={topic}
                type="button"
                className={`pf-chip${topicFilter === topic ? ' pf-chip--active' : ''}`}
                onClick={() => setTopicFilter(topic)}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        <div className="ql-filters__row">
          <span className="ql-filters__label">Company</span>
          <div className="pf-chips" role="group" aria-label="Filter by company">
            {[FILTER_ALL, ...LIBRARY_COMPANIES].map((company) => (
              <button
                key={company}
                type="button"
                className={`pf-chip${companyFilter === company ? ' pf-chip--active' : ''}`}
                onClick={() => setCompanyFilter(company)}
              >
                {company}
              </button>
            ))}
          </div>
        </div>
      </section>

      {filteredQuestions.length === 0 ? (
        <EmptyState
          title="No questions match"
          description="Try changing your search or filter selections."
        />
      ) : (
        <div className="ql-grid">
          {filteredQuestions.map((question, index) => {
            const tracked = isLibraryTracked(problems, question)
            const solved = isLibrarySolved(problems, question)
            const bookmarked = isBookmarked(question.id)

            return (
              <motion.article
                key={question.id}
                className={`ql-card${tracked ? ' ql-card--tracked' : ''}${solved ? ' ql-card--solved' : ''}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.02, 0.4) }}
              >
                <div className="ql-card__head">
                  <div className="ql-card__title-row">
                    <button
                      type="button"
                      className={`ql-bookmark${bookmarked ? ' ql-bookmark--active' : ''}`}
                      onClick={() => toggleBookmark(question.id)}
                      aria-label={
                        bookmarked
                          ? `Remove ${question.title} from bookmarks`
                          : `Bookmark ${question.title}`
                      }
                      aria-pressed={bookmarked}
                    >
                      <Star
                        size={18}
                        fill={bookmarked ? 'currentColor' : 'none'}
                        aria-hidden="true"
                      />
                    </button>
                    <div>
                      <h2 className="ql-card__title">{question.title}</h2>
                      <p className="ql-card__topic">{question.topic}</p>
                    </div>
                  </div>
                  <div className="ql-card__badges">
                    {solved && (
                      <span className="ql-solved-badge" title="Marked Done in DSA Tracker">
                        <CheckCircle2 size={14} aria-hidden="true" />
                        Solved
                      </span>
                    )}
                    <span className={getDifficultyClass(question.difficulty)}>
                      {question.difficulty}
                    </span>
                  </div>
                </div>

                <div className="ql-card__companies">
                  {question.companies.map((company) => (
                    <span key={company} className="ql-company-tag">
                      {company}
                    </span>
                  ))}
                </div>

                <div className="ql-card__actions">
                  <a
                    href={question.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ql-link"
                  >
                    <ExternalLink size={14} aria-hidden="true" />
                    LeetCode
                  </a>
                  <button
                    type="button"
                    className="ql-add-btn"
                    disabled={tracked}
                    onClick={() => handleAddToTracker(question)}
                  >
                    {tracked ? (
                      <>
                        <Check size={14} aria-hidden="true" />
                        In Tracker
                      </>
                    ) : (
                      <>
                        <Plus size={14} aria-hidden="true" />
                        Add To Tracker
                      </>
                    )}
                  </button>
                </div>
              </motion.article>
            )
          })}
        </div>
      )}

      {toast && (
        <div
          className={`ql-toast ql-toast--${toast.type}`}
          role="status"
          aria-live="polite"
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}
