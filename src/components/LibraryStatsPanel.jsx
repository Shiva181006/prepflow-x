import ProgressBar from './ProgressBar'

export default function LibraryStatsPanel({
  title,
  rows,
  formatDetail = (row) => `${row.solved} solved / ${row.total} questions`,
}) {
  if (!rows?.length) return null

  return (
    <section className="ql-stats-panel glass">
      {title && <h3 className="ql-stats-panel__title">{title}</h3>}
      <ul className="ql-stats-list">
        {rows.map((row) => (
          <li key={row.label} className="ql-stats-list__item">
            <ProgressBar
              label={row.label}
              detail={formatDetail(row)}
              value={row.percent}
              size="sm"
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
