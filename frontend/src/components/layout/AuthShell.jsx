import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BookOpen } from 'lucide-react'

const spines = [
  { h: 'h-44', c: '#0f766e' },
  { h: 'h-56', c: '#b45309' },
  { h: 'h-40', c: '#4338ca' },
  { h: 'h-60', c: '#be123c' },
  { h: 'h-48', c: '#15803d' },
  { h: 'h-52', c: '#7c3aed' },
  { h: 'h-36', c: '#0369a1' },
]

export default function AuthShell({ title, subtitle, children, footer }) {
  const { t } = useTranslation()

  return (
    <div className="grid flex-1 lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-stone-950 p-12 text-white lg:flex">
        <div className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-amber-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 size-96 rounded-full bg-indigo-500/20 blur-3xl" />

        <Link to="/" className="relative flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-amber-500 text-stone-950">
            <BookOpen className="size-5" />
          </span>
          <span className="font-display text-xl font-bold">{t('brand')}</span>
        </Link>

        <div className="relative">
          <h2 className="max-w-md font-display text-4xl leading-tight font-bold">{t('auth.sideTitle')}</h2>
          <p className="mt-4 max-w-md text-stone-300">{t('auth.sideText')}</p>
        </div>

        <div className="relative flex items-end gap-2" aria-hidden="true">
          {spines.map((spine) => (
            <div
              key={spine.c}
              className={`${spine.h} w-12 rounded-t-md shadow-lg`}
              style={{ background: `linear-gradient(90deg, ${spine.c}, ${spine.c}cc)` }}
            >
              <div className="mx-auto mt-4 h-1 w-6 rounded-full bg-white/40" />
              <div className="mx-auto mt-2 h-1 w-6 rounded-full bg-white/25" />
            </div>
          ))}
        </div>
      </aside>

      <main className="flex items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md animate-fade-up">
          <h1 className="font-display text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100">{title}</h1>
          <p className="mt-2 text-stone-600 dark:text-stone-400">{subtitle}</p>

          <div className="mt-8">{children}</div>

          {footer && <p className="mt-8 text-center text-sm text-stone-600 dark:text-stone-400">{footer}</p>}
        </div>
      </main>
    </div>
  )
}
