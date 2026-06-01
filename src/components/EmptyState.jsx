import { Inbox } from 'lucide-react'

export default function EmptyState({ title, description }) {
  return (
    <div className="pf-empty">
      <Inbox className="pf-empty__icon" size={64} strokeWidth={1.25} />
      <p className="pf-empty__title">{title}</p>
      {description && <p className="pf-empty__desc">{description}</p>}
    </div>
  )
}
