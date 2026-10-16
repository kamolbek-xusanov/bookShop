import { useTranslation } from 'react-i18next'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../utils/cn'

// Switches between the light and the dark theme
export default function ThemeToggle({ className }) {
  const { t } = useTranslation()
  const { isDark, toggle } = useTheme()
  const label = isDark ? t('theme.toLight') : t('theme.toDark')

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn(
        'flex size-9 cursor-pointer items-center justify-center rounded-full bg-stone-200/70 text-stone-700 transition hover:bg-stone-300 hover:text-stone-900 dark:bg-stone-800 dark:text-amber-300 dark:hover:bg-stone-700',
        className
      )}
    >
      {isDark ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
    </button>
  )
}
