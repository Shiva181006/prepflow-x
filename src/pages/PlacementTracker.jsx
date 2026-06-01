import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2 } from 'lucide-react'
import { usePlacement } from '../context/PlacementContext'
import EmptyState from '../components/EmptyState'

const INITIAL_FORM = {
  company: '',
  role: '',
  stage: 'Applied',
}

export default function PlacementTracker() {
  const {
    applications,
    stages,
    addApplication,
    deleteApplication,
    updateApplicationStage,
  } = usePlacement()

  const [form, setForm] = useState(INITIAL_FORM)
  const [draggedId, setDraggedId] = useState(null)
  const [dragOverStage, setDragOverStage] = useState(null)

  const applicationsByStage = useMemo(() => {
    return stages.reduce((grouped, stage) => {
      grouped[stage] = applications.filter(
        (application) => application.stage === stage,
      )
      return grouped
    }, {})
  }, [applications, stages])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const company = form.company.trim()
    if (!company) return

    addApplication({
      company,
      role: form.role.trim(),
      stage: form.stage,
    })

    setForm(INITIAL_FORM)
  }

  const handleDragStart = (applicationId) => {
    setDraggedId(applicationId)
  }

  const handleDragEnd = () => {
    setDraggedId(null)
    setDragOverStage(null)
  }

  const handleDrop = (stage) => {
    if (draggedId) {
      updateApplicationStage(draggedId, stage)
    }
    handleDragEnd()
  }

  return (
    <div className="page pf-page">
      <header className="page__header">
        <div className="page__toolbar">
          <div>
            <h1 className="page__title">Placement Tracker</h1>
            <p className="page__subtitle">
              Trello-style pipeline — drag cards between stages.
            </p>
          </div>
          <div className="dsa-tracker__stats">
            <span className="dsa-tracker__count">
              Total: <strong>{applications.length}</strong>
            </span>
          </div>
        </div>
      </header>

      <section
        className="page__section"
        aria-labelledby="placement-add-heading"
      >
        <h2 id="placement-add-heading" className="page__section-title">
          Add Application
        </h2>
        <form className="dsa-form" onSubmit={handleSubmit}>
          <div className="dsa-form__field">
            <label className="dsa-form__label" htmlFor="placement-company">
              Company Name
            </label>
            <input
              id="placement-company"
              className="dsa-form__input"
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              required
            />
          </div>
          <div className="dsa-form__field">
            <label className="dsa-form__label" htmlFor="placement-role">
              Role
            </label>
            <input
              id="placement-role"
              className="dsa-form__input"
              type="text"
              name="role"
              value={form.role}
              onChange={handleChange}
            />
          </div>
          <div className="dsa-form__field">
            <label className="dsa-form__label" htmlFor="placement-stage">
              Stage
            </label>
            <select
              id="placement-stage"
              className="dsa-form__select"
              name="stage"
              value={form.stage}
              onChange={handleChange}
            >
              {stages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>
          <div className="dsa-form__actions">
            <button
              type="submit"
              className="dsa-form__submit"
              disabled={!form.company.trim()}
            >
              <Plus size={16} aria-hidden="true" />
              Add Application
            </button>
          </div>
        </form>
      </section>

      <section
        className="page__section"
        aria-labelledby="placement-pipeline-heading"
      >
        <h2 id="placement-pipeline-heading" className="page__section-title">
          Pipeline
        </h2>

        {applications.length === 0 ? (
          <EmptyState
            title="No applications yet"
            description="Add your first application above to populate the kanban board."
          />
        ) : (
          <div className="placement-kanban">
            {stages.map((stage) => {
              const stageApplications = applicationsByStage[stage] ?? []
              const isDragOver = dragOverStage === stage

              return (
                <div
                  key={stage}
                  className={`placement-column${isDragOver ? ' placement-column--drag-over' : ''}`}
                  onDragOver={(event) => {
                    event.preventDefault()
                    setDragOverStage(stage)
                  }}
                  onDragLeave={() => setDragOverStage(null)}
                  onDrop={(event) => {
                    event.preventDefault()
                    handleDrop(stage)
                  }}
                >
                  <div className="placement-column__header">
                    <h3 className="placement-column__title">{stage}</h3>
                    <span className="placement-column__count">
                      {stageApplications.length}
                    </span>
                  </div>

                  <div className="placement-column__cards">
                    {stageApplications.length === 0 ? (
                      <p className="placement-column__empty">
                        Drop applications here
                      </p>
                    ) : (
                      stageApplications.map((application) => (
                        <motion.article
                          key={application.id}
                          className={`placement-card${draggedId === application.id ? ' placement-card--dragging' : ''}`}
                          draggable
                          onDragStart={() => handleDragStart(application.id)}
                          onDragEnd={handleDragEnd}
                          layout
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        >
                          <h4 className="placement-card__company">
                            {application.company}
                          </h4>
                          <p className="placement-card__role">
                            {application.role || '—'}
                          </p>

                          <label
                            className="dsa-form__label"
                            htmlFor={`stage-${application.id}`}
                          >
                            Stage
                          </label>
                          <select
                            id={`stage-${application.id}`}
                            className="placement-card__stage-select"
                            value={application.stage}
                            onChange={(event) =>
                              updateApplicationStage(
                                application.id,
                                event.target.value,
                              )
                            }
                          >
                            {stages.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>

                          <div className="placement-card__footer">
                            <button
                              type="button"
                              className="dsa-delete-btn"
                              onClick={() => deleteApplication(application.id)}
                              aria-label={`Delete ${application.company}`}
                            >
                              <Trash2 size={14} aria-hidden="true" />
                              Delete
                            </button>
                          </div>
                        </motion.article>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
