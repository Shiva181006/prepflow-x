import { motion } from 'framer-motion'

export default function ProgressBar({
  value,
  label,
  detail,
  size = 'md',
  showLabel = true,
}) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className={`pf-progress pf-progress--${size}`}>
      {showLabel && (label || detail) && (
        <div className="pf-progress__header">
          {label && <span className="pf-progress__label">{label}</span>}
          {detail && <span className="pf-progress__detail">{detail}</span>}
        </div>
      )}
      <div
        className="pf-progress__track"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ? `${label}: ${clamped}%` : `${clamped}% complete`}
      >
        <motion.div
          className="pf-progress__fill"
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
