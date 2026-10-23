import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ArrowRight, BookOpen, Languages, Library, Search, ShieldCheck } from 'lucide-react'
import { getBooks } from '../services/bookService'
import { useAuth } from '../hooks/useAuth'
import BookCard from '../components/books/BookCard'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import { CardSkeleton } from '../components/ui/Skeleton'

const heroBooks = [
  { colors: ['#0f766e', '#134e4a'], style: { '--r': '-8deg', left: '0%', top: '12%' }, delay: '0s' },
  { colors: ['#b45309', '#78350f'], style: { '--r': '5deg', left: '34%', top: '0%' }, delay: '1.2s' },
  { colors: ['#4338ca', '#1e1b4b'], style: { '--r': '-3deg', left: '62%', top: '22%' }, delay: '2.4s' },
]

function HeroBooks() {
  return (
    <div className="relative hidden h-96 lg:block" aria-hidden="true">
      {heroBooks.map((book) => (
        <div
          key={book.colors[0]}
          className="absolute h-72 w-48 animate-float overflow-hidden rounded-r-2xl rounded-l-md shadow-2xl shadow-black/50"
          style={{
            ...book.style,
            animationDelay: book.delay,
            background: `linear-gradient(135deg, ${book.colors[0]}, ${book.colors[1]})`,
          }}
        >
          <div className="absolute inset-y-0 left-0 w-4 bg-black/25" />
          <div className="mt-10 ml-9 h-1.5 w-20 rounded-full bg-white/50" />
          <div className="mt-3 ml-9 h-1.5 w-14 rounded-full bg-white/30" />
          <div className="absolute right-5 bottom-6 size-10 rounded-full bg-white/15" />
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['books', 'latest'],
    queryFn: () => getBooks({ page: 1, limit: 6, sort: 'newest' }),
  })

  const features = [
    { icon: Search, title: t('home.f1Title'), text: t('home.f1Text') },
    { icon: Library, title: t('home.f2Title'), text: t('home.f2Text') },
    { icon: ShieldCheck, title: t('home.f3Title'), text: t('home.f3Text') },
    { icon: Languages, title: t('home.f4Title'), text: t('home.f4Text') },
  ]

  return (
    <>
      {/* hero */}
      <section className="relative overflow-hidden bg-stone-950 text-white">
        <div className="pointer-events-none absolute -top-32 left-1/4 size-136 rounded-full bg-[radial-gradient(closest-side,rgba(245,158,11,0.28),transparent)]" />
        <div className="pointer-events-none absolute -right-20 bottom-0 size-120 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.28),transparent)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pt-20 pb-24 sm:px-6 lg:grid-cols-2 lg:pt-28">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-amber-200 ring-1 ring-white/15">
              <BookOpen className="size-4" />
              {t('home.badge')}
            </span>

            <h1 className="mt-6 font-display text-5xl leading-[1.05] font-bold tracking-tight sm:text-6xl lg:text-7xl">
              {t('home.titleA')} <span className="text-amber-400">{t('home.titleB')}</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-300">{t('home.subtitle')}</p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button to="/books" variant="accent" size="lg">
                {t('home.ctaBrowse')}
                <ArrowRight className="size-5" />
              </Button>
              {!isAuthenticated && (
                <Button to="/register" variant="light" size="lg">
                  {t('home.ctaRegister')}
                </Button>
              )}
            </div>

            <dl className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-8">
              <div>
                <dd className="font-display text-3xl font-bold text-white tabular-nums">
                  {data ? data.pagination.totalBooks : '–'}
                </dd>
                <dt className="mt-1 text-sm text-stone-400">{t('home.statBooks')}</dt>
              </div>
              <div>
                <dd className="font-display text-3xl font-bold text-white">3</dd>
                <dt className="mt-1 text-sm text-stone-400">{t('home.statLanguages')}</dt>
              </div>
              <div>
                <dd className="font-display text-3xl font-bold text-white">4</dd>
                <dt className="mt-1 text-sm text-stone-400">{t('home.statRoles')}</dt>
              </div>
            </dl>
          </div>

          <HeroBooks />
        </div>
      </section>

      {/* latest books */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-20 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold text-stone-900 sm:text-4xl dark:text-stone-100">{t('home.latestTitle')}</h2>
            <p className="mt-2 text-stone-600 dark:text-stone-400">{t('home.latestSubtitle')}</p>
          </div>
          <Link
            to="/books"
            className="hidden items-center gap-1.5 text-sm font-semibold text-amber-700 hover:underline sm:flex dark:text-amber-400"
          >
            {t('common.viewAll')}
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-10">
          {isLoading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <CardSkeleton key={item} />
              ))}
            </div>
          )}

          {isError && <EmptyState icon={BookOpen} title={t('books.loadError')} />}

          {data && data.books.length === 0 && (
            <EmptyState
              icon={BookOpen}
              title={t('home.emptyTitle')}
              text={t('home.emptyText')}
              action={
                <Button to={isAuthenticated ? '/books' : '/register'} variant="accent">
                  {isAuthenticated ? t('home.ctaAdd') : t('home.ctaRegister')}
                </Button>
              }
            />
          )}

          {data && data.books.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.books.map((book) => (
                <BookCard key={book._id} book={book} canManage={false} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* features */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-24 sm:px-6">
        <h2 className="max-w-xl font-display text-3xl font-bold text-stone-900 sm:text-4xl dark:text-stone-100">{t('home.featuresTitle')}</h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
                <Icon className="size-6" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-stone-900 dark:text-stone-100">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* call to action */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-24 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-stone-900 px-8 py-14 text-center text-white sm:px-16 dark:bg-stone-800">
          <div className="pointer-events-none absolute -top-20 left-1/2 size-80 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(245,158,11,0.35),transparent)]" />         <div className="relative">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold sm:text-4xl">{t('home.ctaTitle')}</h2>
            <p className="mx-auto mt-4 max-w-xl text-stone-300">{t('home.ctaText')}</p>
            <div className="mt-8 flex justify-center">
              <Button to={isAuthenticated ? '/books' : '/register'} variant="accent" size="lg">
                {isAuthenticated ? t('home.ctaAdd') : t('home.ctaRegister')}
                <ArrowRight className="size-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
