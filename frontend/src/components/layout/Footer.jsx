import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BookOpen } from 'lucide-react'

const GITHUB_URL = 'https://github.com/kamolbek-xusanov'

function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.1c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a10.9 10.9 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  )
}

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="mt-24 border-t border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-amber-500 text-stone-950">
              <BookOpen className="size-5" />
            </span>
            <span className="font-display text-xl font-bold text-stone-900 dark:text-stone-100">{t('brand')}</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-stone-500 dark:text-stone-400">{t('footer.tagline')}</p>
        </div>

        <nav className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm font-medium text-stone-600 dark:text-stone-400">
          <Link to="/books" className="hover:text-stone-900 dark:hover:text-stone-100">
            {t('nav.books')}
          </Link>
          <Link to="/login" className="hover:text-stone-900 dark:hover:text-stone-100">
            {t('nav.login')}
          </Link>
          <Link to="/register" className="hover:text-stone-900 dark:hover:text-stone-100">
            {t('nav.register')}
          </Link>
        </nav>
      </div>

      <div className="border-t border-stone-100 dark:border-stone-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-stone-500 sm:flex-row sm:px-6 dark:text-stone-400">
          <p>{t('footer.rights', { year: new Date().getFullYear() })}</p>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 font-medium text-stone-600 transition hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
          >
            <GithubIcon className="size-4.5" />
            {t('footer.builtBy')} Kamol Xusanov
          </a>
        </div>
      </div>
    </footer>
  )
}
