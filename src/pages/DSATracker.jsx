import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Search } from 'lucide-react'
import {
  DIFFICULTIES,
  STATUSES,
  getDifficultyClass,
  getStatusClass,
} from '../constants/trackers'
import { useDSA } from '../context/DSAContext'
import EmptyState from '../components/EmptyState'

const INITIAL_FORM = {
  title: '',
  difficulty: 'Medium',
  topic: '',
  status: 'Todo',
}

const FILTER_ALL = 'All'

export default function DSATracker() {
  const { problems, addProblem, deleteProblem } = useDSA()
  const [form, setForm] = useState(INITIAL_FORM)
  const [search, setSearch] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState(FILTER_ALL)
  const [statusFilter, setStatusFilter] = useState(FILTER_ALL)

  const filteredProblems = useMemo(() => {
    const query = search.trim().toLowerCase()
    return problems.filter((problem) => {
      const matchesSearch =
        !query ||
        problem.title.toLowerCase().includes(query) ||
        problem.topic.toLowerCase().includes(query)
      const matchesDifficulty =
        difficultyFilter === FILTER_ALL ||
        problem.difficulty === difficultyFilter
      const matchesStatus =
        statusFilter === FILTER_ALL || problem.status === statusFilter
      return matchesSearch && matchesDifficulty && matchesStatus
    })
  }, [problems, search, difficultyFilter, statusFilter])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const title = form.title.trim()
    if (!title) return

    addProblem({
      title,
      difficulty: form.difficulty,
      topic: form.topic.trim(),
      status: form.status,
    })

    setForm(INITIAL_FORM)
  }

  return (
    <div className="page pf-page">
      <header className="page__header">
        <div className="page__toolbar">
          <div>
            <h1 className="page__title">DSA Tracker</h1>
            <p className="page__subtitle">
              Track coding problems, difficulty, and progress.
            </p>
          </div>
          <div className="dsa-tracker__stats">
            <span className="dsa-tracker__count">
              Total: <strong>{problems.length}</strong>
              {filteredProblems.length !== problems.length && (
                <> · Showing {filteredProblems.length}</>
              )}
            </span>
          </div>
        </div>
      </header>

      <section className="page__section" aria-labelledby="dsa-add-heading">
        <h2 id="dsa-add-heading" className="page__section-title">
          Add Problem
        </h2>
        <form className="dsa-form" onSubmit={handleSubmit}>
          <div className="dsa-form__field dsa-form__field--full">
            <label className="dsa-form__label" htmlFor="dsa-title">
              Title
            </label>
            <input
              id="dsa-title"
              className="dsa-form__input"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="dsa-form__field">
            <label className="dsa-form__label" htmlFor="dsa-difficulty">
              Difficulty
            </label>
            <select
              id="dsa-difficulty"
              className="dsa-form__select"
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
            >
              {DIFFICULTIES.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
          <div className="dsa-form__field">
            <label className="dsa-form__label" htmlFor="dsa-topic">
              Topic
            </label>
            <input
              id="dsa-topic"
              className="dsa-form__input"
              type="text"
              name="topic"
              value={form.topic}
              onChange={handleChange}
            />
          </div>
          <div className="dsa-form__field">
            <label className="dsa-form__label" htmlFor="dsa-status">
              Status
            </label>
            <select
              id="dsa-status"
              className="dsa-form__select"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="dsa-form__actions">
            <button
              type="submit"
              className="dsa-form__submit"
              disabled={!form.title.trim()}
            >
              <Plus size={16} aria-hidden="true" />
              Add Problem
            </button>
          </div>
        </form>
      </section>

      <section className="page__section" aria-labelledby="dsa-list-heading">
        <h2 id="dsa-list-heading" className="page__section-title">
          All Problems
        </h2>

        <div className="pf-toolbar">
          <label className="pf-search">
            <Search size={16} color="var(--pf-text-muted)" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search by title or topic…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search problems"
            />
          </label>
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
          <div className="pf-chips" role="group" aria-label="Filter by status">
            {[FILTER_ALL, ...STATUSES].map((status) => (
              <button
                key={status}
                type="button"
                className={`pf-chip${statusFilter === status ? ' pf-chip--active' : ''}`}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {problems.length === 0 ? (
          <EmptyState
            title="No problems yet"
            description="Add your first DSA problem using the form above to start tracking."
          />
        ) : filteredProblems.length === 0 ? (
          <EmptyState
            title="No matches"
            description="Try adjusting your search or filter chips."
          />
        ) : (
          <div className="dsa-table-wrap">
            <table className="dsa-table">
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Difficulty</th>
                  <th scope="col">Topic</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProblems.map((problem, index) => (
                  <motion.tr
                    key={problem.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    <td className="dsa-table__title">{problem.title}</td>
                    <td>
                      <span className={getDifficultyClass(problem.difficulty)}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td>{problem.topic || '—'}</td>
                    <td>
                      <span className={getStatusClass(problem.status)}>
                        {problem.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="dsa-delete-btn"
                        onClick={() => deleteProblem(problem.id)}
                        aria-label={`Delete ${problem.title}`}
                      >
                        <Trash2 size={14} aria-hidden="true" />
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
