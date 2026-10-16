import { useTranslation } from 'react-i18next'

export default function OrDivider({ label }) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-4 text-xs font-semibold tracking-wide text-stone-400 uppercase">
      <span className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
      {label ?? t('auth.or')}
      <span className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
    </div>
  )
}
