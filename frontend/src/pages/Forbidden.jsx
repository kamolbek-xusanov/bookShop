import { useTranslation } from 'react-i18next'
import { ShieldAlert } from 'lucide-react'
import Button from '../components/ui/Button'

export default function Forbidden() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <span className="flex size-16 items-center justify-center rounded-3xl bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
        <ShieldAlert className="size-8" />
      </span>
      <h1 className="mt-6 font-display text-3xl font-bold text-stone-900 dark:text-stone-100">{t('forbidden.title')}</h1>
      <p className="mt-3 max-w-md text-stone-600 dark:text-stone-400">{t('forbidden.text')}</p>
      <Button to="/" size="lg" className="mt-8">
        {t('notFound.back')}
      </Button>
    </div>
  )
}
