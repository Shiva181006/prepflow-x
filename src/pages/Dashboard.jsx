import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Code2,
  Database,
  Briefcase,
  CheckCircle2,
  CircleCheck,
  TrendingUp,
  Target,
  BookOpen,
  Sparkles,
} from 'lucide-react'
import { useDSA } from '../context/DSAContext'
import { useSQL } from '../context/SQLContext'
import { usePlacement } from '../context/PlacementContext'
import { useLibraryProgress } from '../hooks/useLibraryProgress'
import ProgressRing from '../components/ProgressRing'
import ProgressBar from '../components/ProgressBar'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function formatActivityDate(isoString) {
  const timestamp = new Date(isoString).getTime()
  if (Number.isNaN(timestamp)) return 'Unknown date'
  return new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getTimestamp(isoString) {
  const timestamp = new Date(isoString).getTime()
  return Number.isNaN(timestamp) ? 0 : timestamp
}

const statMotion = {
  hidden: { opacity: 0, y: 16 },
  show: (index) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.06, duration: 0.35 },
  }),
}

export default function Dashboard() {
  const { problems } = useDSA()
  const { questions } = useSQL()
  const { applications, stages } = usePlacement()
  const library = useLibraryProgress(problems)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(timer)
  }, [])

  const totalDsa = problems.length
  const totalSql = questions.length
  const totalApplications = applications.length
  const completedDsa = problems.filter((p) => p.status === 'Done').length
  const completedSql = questions.filter((q) => q.status === 'Done').length

  const dsaRate = totalDsa > 0 ? Math.round((completedDsa / totalDsa) * 100) : 0
  const sqlRate = totalSql > 0 ? Math.round((completedSql / totalSql) * 100) : 0
  const overallRate =
    totalDsa + totalSql > 0
      ? Math.round(((completedDsa + completedSql) / (totalDsa + totalSql)) * 100)
      : 0

  const applicationsByStage = useMemo(
    () =>
      stages.map((stage) => ({
        stage,
        count: applications.filter((a) => a.stage === stage).length,
      })),
    [applications, stages],
  )

  const recentActivity = useMemo(() => {
    const items = [
      ...problems.map((problem) => ({
        id: `dsa-${problem.id}`,
        type: 'dsa',
        title: problem.title,
        meta: `${problem.difficulty} · ${problem.status}`,
        date: problem.updatedAt,
      })),
      ...questions.map((question) => ({
        id: `sql-${question.id}`,
        type: 'sql',
        title: question.title,
        meta: `${question.difficulty} · ${question.status}`,
        date: question.updatedAt,
      })),
      ...applications.map((application) => ({
        id: `placement-${application.id}`,
        type: 'placement',
        title: application.company,
        meta: `${application.role || 'Role not set'} · ${application.stage}`,
        date: application.updatedAt,
      })),
    ]
    return items
      .sort((a, b) => getTimestamp(b.date) - getTimestamp(a.date))
      .slice(0, 8)
  }, [problems, questions, applications])

  const statCards = useMemo(
    () => [
      {
        label: 'DSA Problems',
        value: totalDsa,
        icon: Code2,
        detail: 'Problems in your tracker',
        tone: 'indigo',
      },
      {
        label: 'SQL Questions',
        value: totalSql,
        icon: Database,
        detail: 'SQL practice items',
        tone: 'violet',
      },
      {
        label: 'Applications',
        value: totalApplications,
        icon: Briefcase,
        detail: 'Active placement pipeline',
        tone: 'sky',
      },
      {
        label: 'DSA Completed',
        value: completedDsa,
        icon: CheckCircle2,
        detail: 'Marked Done in tracker',
        tone: 'emerald',
      },
      {
        label: 'SQL Completed',
        value: completedSql,
        icon: CircleCheck,
        detail: 'Finished SQL items',
        tone: 'amber',
      },
    ],
    [totalDsa, totalSql, totalApplications, completedDsa, completedSql],
  )

  const offers = applications.filter((a) => a.stage === 'Offer').length

  if (loading) {
    return (
      <div className="page pf-page">
        <div className="pf-skeleton" style={{ height: 140, borderRadius: 20 }} />
        <div
          className="dash-stats"
          style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              className="pf-skeleton"
              style={{ height: 100, borderRadius: 16 }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="page pf-page dash-page">
      <motion.section
        className="dash-hero dash-hero--compact"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="dash-hero__content">
          <p className="dash-hero__greeting">{getGreeting()}</p>
          <h1 className="dash-hero__title">Welcome to PrepFlow X</h1>
          <p className="dash-hero__subtitle">
            Track DSA, SQL, and placements in one premium workspace. You have{' '}
            {totalDsa + totalSql + totalApplications} items in your pipeline.
          </p>
        </div>
      </motion.section>

      <section className="dash-section">
        <h2 className="pf-section__title">Overview</h2>
        <div className="dash-overview-grid">
          <div className="dash-stats">
            {statCards.map(({ label, value, icon: Icon, detail, tone }, index) => (
              <motion.article
                key={label}
                className={`dash-stat glass glass--hover dash-stat--${tone}`}
                custom={index}
                variants={statMotion}
                initial="hidden"
                animate="show"
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              >
                <span className="dash-stat__icon" aria-hidden="true">
                  <Icon size={24} strokeWidth={2} />
                </span>
                <div className="dash-stat__body">
                  <p className="dash-stat__label">{label}</p>
                  <p className="dash-stat__value">{value}</p>
                  <p className="dash-stat__detail">{detail}</p>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.article
            className="dash-readiness glass glass--hover"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            whileHover={{ y: -4 }}
          >
            <div className="dash-readiness__glow" aria-hidden="true" />
            <div className="dash-readiness__icon" aria-hidden="true">
              <Sparkles size={22} strokeWidth={2} />
            </div>
            <p className="dash-readiness__eyebrow">Interview Readiness</p>
            <p className="dash-readiness__score">{overallRate}</p>
            <p className="dash-readiness__unit">score</p>
            <p className="dash-readiness__detail">
              Based on DSA &amp; SQL completion ({completedDsa + completedSql} of{' '}
              {totalDsa + totalSql} done)
            </p>
            <div className="dash-readiness__bar" aria-hidden="true">
              <span
                className="dash-readiness__bar-fill"
                style={{ width: `${overallRate}%` }}
              />
            </div>
          </motion.article>
        </div>
      </section>

      <section className="dash-section">
        <h2 className="pf-section__title">Progress</h2>
        <div className="dash-rings dash-rings--polished">
          <ProgressRing value={dsaRate} label="DSA" />
          <ProgressRing value={sqlRate} label="SQL" />
          <ProgressRing value={library.overall.percent} label="Library" />
          <ProgressRing value={overallRate} label="Overall" />
        </div>
      </section>

      <section className="dash-section">
        <h2 className="pf-section__title">Question Library</h2>
        <motion.article
          className="dash-library glass glass--hover"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="dash-library__head">
            <BookOpen size={22} color="var(--pf-accent)" aria-hidden="true" />
            <div>
              <p className="dash-library__label">Curated interview set</p>
              <p className="dash-library__value">
                {library.overall.solved} / {library.overall.total} solved
              </p>
            </div>
            <span className="dash-library__percent">
              {library.overall.percent}%
            </span>
          </div>
          <ProgressBar
            value={library.overall.percent}
            showLabel={false}
            detail={null}
          />
          {library.byCompany.length > 0 && (
            <ul className="dash-library__companies">
              {library.byCompany.slice(0, 5).map((row) => (
                <li key={row.label}>
                  <ProgressBar
                    label={row.label}
                    detail={`${row.solved} solved / ${row.total} questions`}
                    value={row.percent}
                    size="sm"
                  />
                </li>
              ))}
            </ul>
          )}
        </motion.article>
      </section>

      <section className="dash-section">
        <h2 className="pf-section__title">Insights</h2>
        <div className="dash-insights">
          <motion.article
            className="dash-insight glass--hover"
            whileHover={{ y: -2 }}
          >
            <Target size={20} color="var(--pf-accent)" />
            <p className="dash-insight__label">Completion focus</p>
            <p className="dash-insight__value">{overallRate}% overall</p>
            <p className="dash-insight__detail">
              {completedDsa + completedSql} of {totalDsa + totalSql} items done
            </p>
          </motion.article>
          <motion.article
            className="dash-insight glass--hover"
            whileHover={{ y: -2 }}
          >
            <TrendingUp size={20} color="var(--pf-success)" />
            <p className="dash-insight__label">Active pipeline</p>
            <p className="dash-insight__value">{totalApplications} apps</p>
            <p className="dash-insight__detail">{offers} at Offer stage</p>
          </motion.article>
        </div>
      </section>

      <section className="dash-section">
        <h2 className="pf-section__title">Applications by Stage</h2>
        <div className="dash-stages">
          {applicationsByStage.map(({ stage, count }) => (
            <div key={stage} className="dash-stage">
              <span className="dash-stage__name">{stage}</span>
              <span className="dash-stage__count">{count}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="dash-section dash-section--last">
        <h2 className="pf-section__title">Recent Activity</h2>
        <div className="dash-timeline">
          {recentActivity.length === 0 ? (
            <p
              style={{
                padding: 24,
                textAlign: 'center',
                color: 'var(--pf-text-muted)',
              }}
            >
              No activity yet. Start adding problems, questions, or applications.
            </p>
          ) : (
            recentActivity.map((item) => (
              <div key={item.id} className="dash-timeline__item">
                <span
                  className={`dash-timeline__dot dash-timeline__dot--${item.type}`}
                />
                <div className="dash-timeline__body">
                  <p className="dash-timeline__title">{item.title}</p>
                  <p className="dash-timeline__meta">{item.meta}</p>
                </div>
                <time className="dash-timeline__time" dateTime={item.date}>
                  {formatActivityDate(item.date)}
                </time>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
