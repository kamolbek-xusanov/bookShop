import { useTranslation } from 'react-i18next'
import { cn } from '../../utils/cn'

const languages = ['uz', 'en', 'ru']

export default function LanguageSwitcher({ className }) {
  const { i18n } = useTranslation()

  return (
    <div className={cn('inline-flex rounded-full bg-stone-200/70 p-1 dark:bg-stone-800/70', className)} role="group" aria-label="Language">
      {languages.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => i18n.changeLanguage(lang)}
          aria-pressed={i18n.resolvedLanguage === lang}
          className={cn(
            'cursor-pointer rounded-full px-3 py-1 text-xs font-bold uppercase transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md active:scale-95',
            i18n.resolvedLanguage === lang
              ? 'bg-stone-900 text-white shadow dark:bg-stone-100 dark:text-stone-900'
              : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
          )}
        >
          {lang}
        </button>
      ))}
    </div>
  )
}
