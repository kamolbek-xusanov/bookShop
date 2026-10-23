import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

const widths = { sm: 'sm:max-w-md', md: 'sm:max-w-lg', lg: 'sm:max-w-2xl' }

export default function Modal({ open, onClose, title, description, size = 'md', children }) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event) => event.key === 'Escape' && onClose()
    const previousOverflow = document.body.style.overflow

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 animate-fade-in bg-stone-950/50 backdrop-blur-sm" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'relative max-h-[92dvh] overscroll-contain w-full animate-pop overflow-y-auto rounded-t-3xl bg-white p-5 pb-8 shadow-2xl sm:rounded-3xl sm:p-8 dark:bg-stone-900',
          widths[size]
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 cursor-pointer rounded-full p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
        >
          <X className="size-5" />
        </button>

        <h2 className="pr-10 font-display text-2xl font-bold text-stone-900 dark:text-stone-100">{title}</h2>
        {description && <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{description}</p>}

        <div className="mt-6">{children}</div>
      </div>
    </div>,
    document.body
  )
}
