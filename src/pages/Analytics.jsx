import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  DIFFICULTIES,
  STATUSES,
  DIFFICULTY_COLORS,
  STATUS_COLORS,
  STAGE_CHART_COLORS,
  buildDistribution,
} from '../constants/trackers'
import { useDSA } from '../context/DSAContext'
import { useSQL } from '../context/SQLContext'
import { usePlacement } from '../context/PlacementContext'
import { useLibraryProgress } from '../hooks/useLibraryProgress'

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null

  const entry = payload[0]

  return (
    <div className="analytics-tooltip">
      <p className="analytics-tooltip__label">{entry.name}</p>
      <p className="analytics-tooltip__value">Count: {entry.value}</p>
    </div>
  )
}

function DistributionChart({ title, data, colors }) {
  const total = data.reduce((sum, entry) => sum + entry.value, 0)
  const hasData = total > 0

  return (
    <motion.article
      className="analytics-chart-card glass--hover"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -2 }}
    >
      <h3 className="analytics-chart-card__title">{title}</h3>
      {hasData ? (
        <div className="analytics-chart-card__chart">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={48}
                paddingAngle={2}
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={colors[entry.name] ?? STAGE_CHART_COLORS[0]}
                  />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="analytics-chart-empty">
          No data available for this chart yet.
        </p>
      )}
    </motion.article>
  )
}

export default function Analytics() {
  const { problems } = useDSA()
  const { questions } = useSQL()
  const { applications, stages } = usePlacement()
  const library = useLibraryProgress(problems)

  const dsaDifficultyData = useMemo(
    () => buildDistribution(problems, 'difficulty', DIFFICULTIES),
    [problems],
  )

  const dsaStatusData = useMemo(
    () => buildDistribution(problems, 'status', STATUSES),
    [problems],
  )

  const sqlStatusData = useMemo(
    () => buildDistribution(questions, 'status', STATUSES),
    [questions],
  )

  const placementStageData = useMemo(
    () => buildDistribution(applications, 'stage', stages),
    [applications, stages],
  )

  const stageColorMap = useMemo(() => {
    return stages.reduce((map, stage, index) => {
      map[stage] = STAGE_CHART_COLORS[index % STAGE_CHART_COLORS.length]
      return map
    }, {})
  }, [stages])

  const totalDsa = problems.length
  const totalSql = questions.length
  const totalApplications = applications.length
  const completedDsa = problems.filter((p) => p.status === 'Done').length
  const completedSql = questions.filter((q) => q.status === 'Done').length
  const offers = applications.filter((a) => a.stage === 'Offer').length

  const dsaCompletionRate =
    totalDsa > 0 ? Math.round((completedDsa / totalDsa) * 100) : 0
  const sqlCompletionRate =
    totalSql > 0 ? Math.round((completedSql / totalSql) * 100) : 0
  const overallCompletionRate =
    totalDsa + totalSql > 0
      ? Math.round(((completedDsa + completedSql) / (totalDsa + totalSql)) * 100)
      : 0

  const progressSummaryData = useMemo(
    () => [
      { name: 'DSA Done', value: completedDsa },
      { name: 'DSA Remaining', value: totalDsa - completedDsa },
      { name: 'SQL Done', value: completedSql },
      { name: 'SQL Remaining', value: totalSql - completedSql },
    ],
    [completedDsa, totalDsa, completedSql, totalSql],
  )

  const progressBarHasData = totalDsa + totalSql > 0

  const libraryTopicChartData = useMemo(
    () =>
      library.byTopic.map((row) => ({
        name: row.label,
        Solved: row.solved,
        Remaining: row.total - row.solved,
      })),
    [library.byTopic],
  )

  const libraryCompanyChartData = useMemo(
    () =>
      library.byCompany.slice(0, 8).map((row) => ({
        name: row.label,
        Solved: row.solved,
        Remaining: row.total - row.solved,
      })),
    [library.byCompany],
  )

  const libraryDifficultyChartData = useMemo(
    () =>
      library.byDifficulty.map((row) => ({
        name: row.label,
        Solved: row.solved,
        Remaining: row.total - row.solved,
      })),
    [library.byDifficulty],
  )

  const libraryHasQuestions = library.overall.total > 0

  return (
    <div className="page pf-page">
      <header className="page__header">
        <h1 className="page__title">Analytics</h1>
        <p className="page__subtitle">
          Visualize your preparation trends and performance.
        </p>
      </header>

      <section className="page__section">
        <h2 className="page__section-title">Overall Progress Summary</h2>
        <div className="analytics-summary">
          <div className="analytics-summary__item">
            <p className="analytics-summary__label">DSA Completion</p>
            <p className="analytics-summary__value">{dsaCompletionRate}%</p>
            <p className="analytics-summary__detail">
              {completedDsa} of {totalDsa} completed
            </p>
          </div>
          <div className="analytics-summary__item">
            <p className="analytics-summary__label">SQL Completion</p>
            <p className="analytics-summary__value">{sqlCompletionRate}%</p>
            <p className="analytics-summary__detail">
              {completedSql} of {totalSql} completed
            </p>
          </div>
          <div className="analytics-summary__item">
            <p className="analytics-summary__label">Overall Completion</p>
            <p className="analytics-summary__value">
              {overallCompletionRate}%
            </p>
            <p className="analytics-summary__detail">
              {completedDsa + completedSql} of {totalDsa + totalSql} items
            </p>
          </div>
          <div className="analytics-summary__item">
            <p className="analytics-summary__label">Active Applications</p>
            <p className="analytics-summary__value">{totalApplications}</p>
            <p className="analytics-summary__detail">
              {offers} at Offer stage
            </p>
          </div>
        </div>
      </section>

      <section className="page__section">
        <h2 className="page__section-title">Question Library Progress</h2>
        <div className="analytics-summary">
          <div className="analytics-summary__item">
            <p className="analytics-summary__label">Library Completion</p>
            <p className="analytics-summary__value">
              {library.overall.percent}%
            </p>
            <p className="analytics-summary__detail">
              {library.overall.solved} of {library.overall.total} solved
            </p>
          </div>
          <div className="analytics-summary__item">
            <p className="analytics-summary__label">In DSA Tracker</p>
            <p className="analytics-summary__value">
              {library.overall.tracked}
            </p>
            <p className="analytics-summary__detail">
              matched from the library catalog
            </p>
          </div>
          <div className="analytics-summary__item">
            <p className="analytics-summary__label">Top Company</p>
            <p className="analytics-summary__value">
              {library.byCompany[0]?.label ?? '—'}
            </p>
            <p className="analytics-summary__detail">
              {library.byCompany[0]
                ? `${library.byCompany[0].solved} / ${library.byCompany[0].total} solved`
                : 'No company data'}
            </p>
          </div>
        </div>

        {libraryHasQuestions && (
          <div className="analytics-charts analytics-charts--library">
            <motion.article
              className="analytics-chart-card analytics-chart-card--wide glass--hover"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="analytics-chart-card__title">
                Library — Topic Progress
              </h3>
              <div className="analytics-chart-card__chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={libraryTopicChartData}
                    margin={{ top: 8, right: 16, left: 0, bottom: 48 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: 'var(--text)', fontSize: 11 }}
                      angle={-35}
                      textAnchor="end"
                      height={60}
                      axisLine={{ stroke: 'var(--border)' }}
                      tickLine={{ stroke: 'var(--border)' }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: 'var(--text)', fontSize: 12 }}
                      axisLine={{ stroke: 'var(--border)' }}
                      tickLine={{ stroke: 'var(--border)' }}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="Solved"
                      stackId="a"
                      fill="var(--pf-success)"
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar
                      dataKey="Remaining"
                      stackId="a"
                      fill="var(--pf-bg-muted)"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.article>

            <motion.article
              className="analytics-chart-card analytics-chart-card--wide glass--hover"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <h3 className="analytics-chart-card__title">
                Library — Company Progress (Top 8)
              </h3>
              <div className="analytics-chart-card__chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={libraryCompanyChartData}
                    margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: 'var(--text)', fontSize: 12 }}
                      axisLine={{ stroke: 'var(--border)' }}
                      tickLine={{ stroke: 'var(--border)' }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: 'var(--text)', fontSize: 12 }}
                      axisLine={{ stroke: 'var(--border)' }}
                      tickLine={{ stroke: 'var(--border)' }}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend />
                    <Bar dataKey="Solved" stackId="b" fill="var(--accent)" />
                    <Bar
                      dataKey="Remaining"
                      stackId="b"
                      fill="var(--pf-bg-muted)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.article>

            <motion.article
              className="analytics-chart-card glass--hover"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="analytics-chart-card__title">
                Library — Difficulty Completion
              </h3>
              <div className="analytics-chart-card__chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={libraryDifficultyChartData}
                    margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: 'var(--text)', fontSize: 12 }}
                      axisLine={{ stroke: 'var(--border)' }}
                      tickLine={{ stroke: 'var(--border)' }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: 'var(--text)', fontSize: 12 }}
                      axisLine={{ stroke: 'var(--border)' }}
                      tickLine={{ stroke: 'var(--border)' }}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend />
                    <Bar dataKey="Solved" stackId="c" fill="var(--pf-success)" />
                    <Bar
                      dataKey="Remaining"
                      stackId="c"
                      fill="var(--pf-bg-muted)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.article>
          </div>
        )}
      </section>

      <section className="page__section">
        <h2 className="page__section-title">Charts</h2>
        <div className="analytics-charts">
          <DistributionChart
            title="DSA Difficulty Distribution"
            data={dsaDifficultyData}
            colors={DIFFICULTY_COLORS}
          />
          <DistributionChart
            title="DSA Status Distribution"
            data={dsaStatusData}
            colors={STATUS_COLORS}
          />
          <DistributionChart
            title="SQL Status Distribution"
            data={sqlStatusData}
            colors={STATUS_COLORS}
          />
          <DistributionChart
            title="Placement Stage Distribution"
            data={placementStageData}
            colors={stageColorMap}
          />

          <motion.article
            className="analytics-chart-card analytics-chart-card--wide glass--hover"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h3 className="analytics-chart-card__title">
              DSA & SQL Progress Breakdown
            </h3>
            {progressBarHasData ? (
              <div className="analytics-chart-card__chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={progressSummaryData}
                    margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: 'var(--text)', fontSize: 12 }}
                      axisLine={{ stroke: 'var(--border)' }}
                      tickLine={{ stroke: 'var(--border)' }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: 'var(--text)', fontSize: 12 }}
                      axisLine={{ stroke: 'var(--border)' }}
                      tickLine={{ stroke: 'var(--border)' }}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar
                      dataKey="value"
                      name="Count"
                      fill="var(--accent)"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="analytics-chart-empty">
                Add DSA problems or SQL questions to see progress breakdown.
              </p>
            )}
          </motion.article>
        </div>
      </section>
    </div>
  )
}
