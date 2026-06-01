import { useEffect, useRef } from 'react'

export default function ConfirmModal({
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
}) {
  const cancelRef = useRef(null)

  useEffect(() => {
    cancelRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCancel()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  return (
    <div
      className="settings-modal-overlay"
      role="presentation"
      onClick={onCancel}
    >
      <div
        className="settings-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id="confirm-modal-title" className="settings-modal__title">
          {title}
        </h3>
        <p className="settings-modal__message">{message}</p>
        <div className="settings-modal__actions">
          <button
            ref={cancelRef}
            type="button"
            className="settings-btn"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="settings-btn settings-btn--danger"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
