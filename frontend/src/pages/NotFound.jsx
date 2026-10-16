import { useTranslation } from 'react-i18next'
import Button from '../components/ui/Button'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-display text-8xl font-bold text-amber-500 sm:text-9xl">404</p>
      <h1 className="mt-4 font-display text-3xl font-bold text-stone-900 dark:text-stone-100">{t('notFound.title')}</h1>
      <p className="mt-3 max-w-md text-stone-600 dark:text-stone-400">{t('notFound.text')}</p>
      <Button to="/" size="lg" className="mt-8">
        {t('notFound.back')}
      </Button>
    </div>
  )
}
