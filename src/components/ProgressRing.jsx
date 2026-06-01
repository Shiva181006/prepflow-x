import { useId } from 'react'
import { motion } from 'framer-motion'

export default function ProgressRing({ value, size = 104, stroke = 11, label }) {
  const gradientId = useId()
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(100, Math.max(0, value))
  const offset = circumference - (clamped / 100) * circumference

  return (
    <div className="dash-ring-item" role="img" aria-label={`${label}: ${clamped}%`}>
      <div className="dash-ring-item__svg-wrap">
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--pf-ring-track, var(--pf-border))"
            strokeWidth={stroke}
            opacity={0.45}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference, opacity: 0.5 }}
            animate={{ strokeDashoffset: offset, opacity: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <span className="dash-ring-item__value">{clamped}%</span>
      </div>
      {label && <span className="dash-ring-item__label">{label}</span>}
    </div>
  )
}
