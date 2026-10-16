import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ImagePlus, X } from 'lucide-react'
import { cn } from '../../utils/cn'
import { IMAGE_TYPES, MAX_IMAGE_MB, MAX_IMAGES } from '../../utils/media'

// A grid of up to 5 book images. `items` are { key, src, isNew }.
// The first image is the book cover.
export default function ImagePicker({ items, onAdd, onRemove }) {
  const { t } = useTranslation()
  const inputRef = useRef(null)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)

  const free = MAX_IMAGES - items.length

  function addFiles(fileList) {
    const files = Array.from(fileList)
    if (files.length === 0) return

    const valid = files.filter((file) => IMAGE_TYPES.includes(file.type))
    const small = valid.filter((file) => file.size <= MAX_IMAGE_MB * 1024 * 1024)

    if (valid.length < files.length) setError(t('images.badType'))
    else if (small.length < valid.length) setError(t('images.tooBig', { mb: MAX_IMAGE_MB }))
    else if (small.length > free) setError(t('images.tooMany', { count: MAX_IMAGES }))
    else setError('')

    if (small.length > 0 && free > 0) onAdd(small.slice(0, free))
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">{t('images.label')}</span>
        <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
          {t('images.count', { count: items.length, max: MAX_IMAGES })}
        </span>
      </div>

      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {items.map((item, index) => (
          <li key={item.key} className="relative aspect-3/4 overflow-hidden rounded-xl bg-stone-100 ring-1 ring-stone-200 dark:bg-stone-800 dark:ring-stone-700">
            <img src={item.src} alt="" className="size-full object-cover" />
            {index === 0 && (
              <span className="absolute bottom-1 left-1 rounded-md bg-stone-950/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {t('images.cover')}
              </span>
            )}
            <button
              type="button"
              onClick={() => onRemove(item)}
              aria-label={t('images.remove')}
              className="absolute top-1 right-1 flex size-6 cursor-pointer items-center justify-center rounded-full bg-stone-950/70 text-white transition hover:bg-red-600"
            >
              <X className="size-3.5" />
            </button>
          </li>
        ))}

        {free > 0 && (
          <li className="aspect-3/4">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(event) => {
                event.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault()
                setDragging(false)
                addFiles(event.dataTransfer.files)
              }}
              className={cn(
                'flex size-full cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-1 text-center text-xs font-semibold transition',
                dragging
                  ? 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400'
                  : 'border-stone-300 text-stone-500 hover:border-amber-500 hover:text-amber-700 dark:border-stone-700 dark:text-stone-400 dark:hover:text-amber-400'
              )}
            >
              <ImagePlus className="size-6" />
              {t('images.add')}
            </button>
          </li>
        )}
      </ul>

      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_TYPES.join(',')}
        multiple
        hidden
        data-testid="book-images-input"
        onChange={(event) => {
          addFiles(event.target.files)
          event.target.value = ''
        }}
      />

      {error ? (
        <p role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">{error}</p>
      ) : (
        <p className="text-xs text-stone-500 dark:text-stone-400">{t('images.hint', { count: MAX_IMAGES, mb: MAX_IMAGE_MB })}</p>
      )}
    </div>
  )
}
