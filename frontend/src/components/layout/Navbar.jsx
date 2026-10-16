import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BookOpen, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../utils/cn'
import Button from '../ui/Button'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { t } = useTranslation()
  const { user, isAuthenticated, hasRole, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const links = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/books', label: t('nav.books') },
    ...(hasRole('admin', 'superAdmin') ? [{ to: '/users', label: t('nav.users') }] : []),
  ]

  function handleLogout() {
    logout()
    setOpen(false)
    navigate('/login')
  }

  const linkClasses = ({ isActive }) =>
    cn(
      'rounded-full px-4 py-2 text-sm font-semibold transition',
      isActive ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900' : 'text-stone-600 hover:bg-stone-200/70 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800/70 dark:hover:text-stone-100'
    )

  const initial = (user?.ism || '?').charAt(0).toUpperCase()

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-paper/85 backdrop-blur-lg dark:border-stone-800/80 dark:bg-stone-950/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex size-9 items-center justify-center rounded-xl bg-amber-500 text-stone-950 shadow-sm shadow-amber-500/40">
            <BookOpen className="size-5" />
          </span>
          <span className="font-display text-xl font-bold text-stone-900 dark:text-stone-100">{t('brand')}</span>
        </Link>

        {/* desktop */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClasses}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-full bg-white py-1 pr-4 pl-1 text-sm font-semibold text-stone-800 ring-1 ring-stone-200 transition hover:ring-stone-300 dark:bg-stone-900 dark:text-stone-200 dark:ring-stone-800 dark:hover:ring-stone-700"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-stone-900 text-sm font-bold text-white dark:bg-stone-100 dark:text-stone-900">
                  {initial}
                </span>
                {user.ism}
              </Link>
              <Button variant="ghost" size="sm" icon={LogOut} onClick={handleLogout} aria-label={t('nav.logout')}>
                {t('nav.logout')}
              </Button>
            </>
          ) : (
            <>
              <Button to="/login" variant="ghost" size="sm">
                {t('nav.login')}
              </Button>
              <Button to="/register" size="sm">
                {t('nav.register')}
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={t('nav.menu')}
          aria-expanded={open}
          className="cursor-pointer rounded-xl p-2 text-stone-800 hover:bg-stone-200/70 md:hidden dark:text-stone-200 dark:hover:bg-stone-800/70"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* mobile */}
      {open && (
        <div className="animate-fade-in border-t border-stone-200 bg-paper px-4 pt-3 pb-6 md:hidden dark:border-stone-800 dark:bg-stone-950">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'rounded-xl px-4 py-3 text-base font-semibold',
                    isActive ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900' : 'text-stone-700 hover:bg-stone-200/70 dark:text-stone-300 dark:hover:bg-stone-800/70'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-4 flex flex-col gap-3 border-t border-stone-200 pt-4 dark:border-stone-800">
            {isAuthenticated ? (
              <>
                <Button to="/profile" variant="secondary" onClick={() => setOpen(false)}>
                  {t('nav.profile')} ({user.ism})
                </Button>
                <Button variant="danger" icon={LogOut} onClick={handleLogout}>
                  {t('nav.logout')}
                </Button>
              </>
            ) : (
              <>
                <Button to="/login" variant="secondary" onClick={() => setOpen(false)}>
                  {t('nav.login')}
                </Button>
                <Button to="/register" onClick={() => setOpen(false)}>
                  {t('nav.register')}
                </Button>
              </>
            )}
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
