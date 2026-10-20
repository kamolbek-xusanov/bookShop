import { useTranslation } from 'react-i18next'
import { Clock, FileText, Pencil, Trash2, UserRound } from 'lucide-react'
import { formatDateTime, wasEdited } from '../../utils/data'
import BookCover from './BookCover'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function BookCard({ book, canManage, onEdit, onDelete }) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { hasRole } = useAuth()

  const owner = book.user ? [book.user.ism, book.user.familiya].filter(Boolean).join(' ') : null

  return (
    <article onClick={() => navigate(`/books/${book._id}`)}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-900/10 dark:border-stone-800 dark:bg-stone-900">
      <BookCover book={book}>
        <div className="relative flex items-start justify-between gap-2 pl-3">
          {book.Janr ? <Badge tone="glass">{book.Janr}</Badge> : <span />}
          <Badge tone={book.sotuvdaBor ? 'green' : 'red'}>
            {book.sotuvdaBor ? t('common.inStock') : t('common.outOfStock')}
          </Badge>
        </div>
      </BookCover>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl leading-snug font-bold text-stone-900 dark:text-stone-100">{book.nomi}</h3>
        <p className="mt-1 text-sm font-medium text-stone-500 dark:text-stone-400">{book.muallifi}</p>

        <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-stone-600 dark:text-stone-400">
          <div className="flex items-center gap-1.5">
            <FileText className="size-4 text-stone-400" />
            <dt className="sr-only">{t('bookForm.pages')}</dt>
            <dd>{t('books.pages', { count: book.sahifasi })}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <UserRound className="size-4 text-stone-400" />
            <dt className="sr-only">{t('books.ownerLabel')}</dt>
            <dd>{owner || t('books.noOwner')}</dd>
          </div>
        </dl>

        {hasRole('admin', 'superAdmin') && wasEdited(book) && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
            <Clock className="size-3.5" />
            {t('books.editedAt')}: {formatDateTime(book.updatedAt, i18n.resolvedLanguage)}
          </p>
        )}

        {canManage && (
          <div className="mt-5 flex gap-2 border-t border-stone-100 pt-4 dark:border-stone-800">
            <Button
              variant="secondary"
              size="sm"
              icon={Pencil}
              onClick={(e) => {
                e.stopPropagation()
                onEdit(book)
              }}
              className="flex-1"
            >
              {t('common.edit')}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              icon={Trash2}
              onClick={(e) => {
                e.stopPropagation()
                onDelete(book)
              }}
              className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
              aria-label={`${t('common.delete')}: ${book.nomi}`}
            >
              {t('common.delete')}
            </Button>

          </div>
        )}
      </div>
    </article>
  )
}

