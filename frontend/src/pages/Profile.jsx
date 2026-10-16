import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { BookOpen, Calendar, Cake, LogOut, Mail, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getProfile } from '../services/authService'
import { useAuth } from '../hooks/useAuth'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import Skeleton from '../components/ui/Skeleton'
import { roleTone } from '../utils/roles'

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-stone-50 p-4 dark:bg-stone-900">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-stone-500 shadow-sm dark:bg-stone-900 dark:text-stone-400">
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-wide text-stone-500 uppercase dark:text-stone-400">{label}</p>
        <p className="truncate font-medium text-stone-900 dark:text-stone-100">{value || '—'}</p>
      </div>
    </div>
  )
}

export default function Profile() {
  const { t, i18n } = useTranslation()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const { data: user, isLoading, isError, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    retry: false,
  })

  function handleLogout() {
    logout()
    navigate('/login')
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    )
  }

  if (isError || !user) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <EmptyState
          title={t('profile.loadError')}
          action={
            <Button variant="secondary" onClick={() => refetch()}>
              {t('common.retry')}
            </Button>
          }
        />
      </div>
    )
  }

  const fullName = [user.ism, user.familiya].filter(Boolean).join(' ')

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <div className="animate-fade-up overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <div className="h-28 bg-linear-to-br from-stone-900 via-stone-800 to-amber-700" />

        <div className="px-6 pb-8 sm:px-10">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <span className="flex size-24 items-center justify-center rounded-3xl bg-amber-500 font-display text-4xl font-bold text-stone-950 ring-4 ring-white">
              {user.ism.charAt(0).toUpperCase()}
            </span>
            <Button variant="secondary" icon={LogOut} onClick={handleLogout}>
              {t('nav.logout')}
            </Button>
          </div>

          <h1 className="mt-5 font-display text-3xl font-bold text-stone-900 dark:text-stone-100">{fullName}</h1>
          <div className="mt-2">
            <Badge tone={roleTone(user.role)}>
              <ShieldCheck className="size-3.5" />
              {t(`roles.${user.role}`)}
            </Badge>
          </div>
          <p className="mt-4 text-stone-600 dark:text-stone-400">{t(`roleInfo.${user.role}`)}</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <InfoRow icon={Mail} label={t('profile.email')} value={user.email} />
            <InfoRow icon={Cake} label={t('profile.age')} value={user.yosh} />
            <InfoRow
              icon={Calendar}
              label={t('profile.memberSince')}
              value={user.createdAt ? new Date(user.createdAt).toLocaleDateString(i18n.language) : null}
            />
          </div>

          <div className="mt-8">
            <Button to="/books" variant="accent" icon={BookOpen}>
              {t('profile.myBooks')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
