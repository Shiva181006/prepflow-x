import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import {
  DIFFICULTIES,
  STATUSES,
  getDifficultyClass,
  getStatusClass,
} from '../constants/trackers'
import { useSQL } from '../context/SQLContext'

const INITIAL_FORM = {
  title: '',
  topic: '',
  difficulty: 'Medium',
  status: 'Todo',
}

export default function SQLTracker() {
  const { questions, addQuestion, deleteQuestion } = useSQL()
  const [form, setForm] = useState(INITIAL_FORM)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const title = form.title.trim()
    if (!title) return

    addQuestion({
      title,
      topic: form.topic.trim(),
      difficulty: form.difficulty,
      status: form.status,
    })

    setForm(INITIAL_FORM)
  }

  return (
    <div className="page pf-page">
      <header className="page__header">
        <div className="page__toolbar">
          <div>
            <h1 className="page__title">SQL Tracker</h1>
            <p className="page__subtitle">
              Manage SQL questions and practice progress.
            </p>
          </div>
          <div className="dsa-tracker__stats">
            <span className="dsa-tracker__count">
              Total Questions: <strong>{questions.length}</strong>
            </span>
          </div>
        </div>
      </header>

      <section className="page__section" aria-labelledby="sql-add-heading">
        <h2 id="sql-add-heading" className="page__section-title">
          Add Question
        </h2>
        <form className="dsa-form" onSubmit={handleSubmit}>
          <div className="dsa-form__field dsa-form__field--full">
            <label className="dsa-form__label" htmlFor="sql-title">
              Question Name
            </label>
            <input
              id="sql-title"
              className="dsa-form__input"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="dsa-form__field">
            <label className="dsa-form__label" htmlFor="sql-topic">
              Topic
            </label>
            <input
              id="sql-topic"
              className="dsa-form__input"
              type="text"
              name="topic"
              value={form.topic}
              onChange={handleChange}
            />
          </div>

          <div className="dsa-form__field">
            <label className="dsa-form__label" htmlFor="sql-difficulty">
              Difficulty
            </label>
            <select
              id="sql-difficulty"
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
            <label className="dsa-form__label" htmlFor="sql-status">
              Status
            </label>
            <select
              id="sql-status"
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
              Add Question
            </button>
          </div>
        </form>
      </section>

      <section className="page__section" aria-labelledby="sql-list-heading">
        <h2 id="sql-list-heading" className="page__section-title">
          All Questions
        </h2>
        <div className="dsa-table-wrap">
          <table className="dsa-table">
            <thead>
              <tr>
                <th scope="col">Question Name</th>
                <th scope="col">Topic</th>
                <th scope="col">Difficulty</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="dsa-empty">
                    No questions yet. Add your first question above.
                  </td>
                </tr>
              ) : (
                questions.map((question) => (
                  <tr key={question.id}>
                    <td className="dsa-table__title">{question.title}</td>
                    <td>{question.topic || '—'}</td>
                    <td>
                      <span
                        className={getDifficultyClass(question.difficulty)}
                      >
                        {question.difficulty}
                      </span>
                    </td>
                    <td>
                      <span className={getStatusClass(question.status)}>
                        {question.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="dsa-delete-btn"
                        onClick={() => deleteQuestion(question.id)}
                        aria-label={`Delete ${question.title}`}
                      >
                        <Trash2 size={14} aria-hidden="true" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
