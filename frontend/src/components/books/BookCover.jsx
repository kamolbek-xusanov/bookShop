import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { coverGradient } from '../../utils/cover'
import { mediaUrl } from '../../utils/media'
import { cn } from '../../utils/cn'

export default function BookCover({ book, children }) {
  const { t } = useTranslation()
  const images = book.images ?? []
  const [index, setIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="relative h-52 overflow-hidden p-4" style={{ background: coverGradient(book.nomi) }}>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-2 -bottom-10 font-display text-[9rem] leading-none font-bold text-white/15 select-none"
        >
          {book.nomi.charAt(0).toUpperCase()}
        </span>
        <div className="absolute inset-y-0 left-0 w-3 bg-black/20" aria-hidden="true" />
        {children}
      </div>
    )
  }

  const go = (step) => (event) => {
    event.stopPropagation()
    setIndex((current) => (current + step + images.length) % images.length)
  }

  return (
    <div className="group/cover relative h-52 overflow-hidden bg-stone-200 p-4 dark:bg-stone-800">
      <img
        key={images[index]}
        src={mediaUrl(images[index])}
        alt={t('images.photoOf', { name: book.nomi, n: index + 1 })}
        loading="lazy"
        className="absolute inset-0 size-full animate-fade-in object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/30" aria-hidden="true" />

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={go(-1)}
            aria-label={t('images.prev')}
            className="absolute top-1/2 left-2 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/85 text-stone-900 opacity-0 shadow transition group-hover/cover:opacity-100 focus-visible:opacity-100"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={go(1)}
            aria-label={t('images.next')}
            className="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/85 text-stone-900 shadow transition pointer-fine:opacity-0 pointer-fine:group-hover/cover:opacity-100 pointer-fine:focus-visible:opacity-100"
          >
            <ChevronRight className="size-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5" aria-hidden="true">
            {images.map((image, i) => (
              <span key={image} className={cn('size-1.5 rounded-full bg-white transition', i === index ? 'opacity-100' : 'opacity-50')} />
            ))}
          </div>
        </>
      )}

      {children}
    </div>
  )
}
