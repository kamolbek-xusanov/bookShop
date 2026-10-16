import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from './Button'

export default function Pagination({ page, totalPages, onChange }) {
  const { t } = useTranslation()

  if (totalPages <= 1) return null

  return (
    <nav className="mt-10 flex items-center justify-center gap-4" aria-label="Pagination">
      <Button variant="secondary" size="sm" icon={ChevronLeft} disabled={page <= 1} onClick={() => onChange(page - 1)}>
        {t('common.previous')}
      </Button>

      <span className="text-sm font-medium text-stone-600 dark:text-stone-400">{t('common.pageOf', { page, total: totalPages })}</span>

      <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        {t('common.next')}
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  )
}
