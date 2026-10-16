import { useState } from 'react'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { BookOpen, Plus } from 'lucide-react'
import { createBook, getBooks, removeBook, updateBook } from '../services/bookService'
import { useAuth } from '../hooks/useAuth'
import { useDebounce } from '../hooks/useDebounce'
import { useToast } from '../hooks/useToast'
import { getErrorMessages } from '../utils/errors'
import { cn } from '../utils/cn'
import BookCard from '../components/books/BookCard'
import BookFormModal from '../components/books/BookFormModal'
import Button from '../components/ui/Button'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import EmptyState from '../components/ui/EmptyState'
import PageHeader from '../components/ui/PageHeader'
import Pagination from '../components/ui/Pagination'
import SearchInput from '../components/ui/SearchInput'
import { CardSkeleton } from '../components/ui/Skeleton'

const PAGE_SIZE = 9

export default function Books() {
  const { t } = useTranslation()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { user, isAuthenticated, hasRole } = useAuth()

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(null) // null | { book: null | book }
  const [toDelete, setToDelete] = useState(null)

  const debouncedSearch = useDebounce(search)

  const { data, isLoading, isError, refetch, isPlaceholderData } = useQuery({
    queryKey: ['books', { page, search: debouncedSearch }],
    queryFn: () => getBooks({ page, limit: PAGE_SIZE, search: debouncedSearch }),
    placeholderData: keepPreviousData,
  })

  const saveMutation = useMutation({
    mutationFn: (values) => (modal.book ? updateBook({ id: modal.book._id, book: values }) : createBook(values)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      toast.success(modal.book ? t('books.updated') : t('books.created'))
      setModal(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => removeBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      toast.success(t('books.deleted'))
      // deleted the last book of this page: go back one page
      if (data.books.length === 1 && page > 1) setPage(page - 1)
      setToDelete(null)
    },
    onError: (error) => {
      toast.error(getErrorMessages(error, t)[0])
      setToDelete(null)
    },
  })

  // owners can change their own books; admins can change all of them
  const canManage = (book) =>
    isAuthenticated && (hasRole('admin', 'superAdmin') || String(book.user?._id) === user.id)

  const addButton = isAuthenticated ? (
    <Button variant="accent" icon={Plus} onClick={() => setModal({ book: null })}>
      {t('books.add')}
    </Button>
  ) : (
    <Button to="/login" variant="secondary">
      {t('books.loginToAdd')}
    </Button>
  )

  function handleSearch(value) {
    setSearch(value)
    setPage(1)
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
      <PageHeader title={t('books.title')} subtitle={t('books.subtitle')} actions={addButton} />

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput value={search} onChange={handleSearch} placeholder={t('books.searchPlaceholder')} />
        {data && (
          <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
            {t('books.total', { count: data.pagination.totalBooks })}
          </p>
        )}
      </div>

      <div className="mt-8">
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        )}

        {isError && (
          <EmptyState
            icon={BookOpen}
            title={t('books.loadError')}
            action={
              <Button variant="secondary" onClick={() => refetch()}>
                {t('common.retry')}
              </Button>
            }
          />
        )}

        {data && data.books.length === 0 && (
          <EmptyState
            icon={BookOpen}
            title={debouncedSearch ? t('books.emptySearch', { q: debouncedSearch }) : t('books.empty')}
            action={!debouncedSearch && isAuthenticated ? addButton : null}
          />
        )}

        {data && data.books.length > 0 && (
          <div
            className={cn(
              'grid gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-3',
              isPlaceholderData && 'opacity-60'
            )}
          >
            {data.books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                canManage={canManage(book)}
                onEdit={(selected) => setModal({ book: selected })}
                onDelete={setToDelete}
              />
            ))}
          </div>
        )}
      </div>

      {data && <Pagination page={page} totalPages={data.pagination.totalPages} onChange={setPage} />}

      {modal && (
        <BookFormModal
          book={modal.book}
          onSubmit={(values) => saveMutation.mutateAsync(values)}
          onClose={() => setModal(null)}
        />
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title={t('books.deleteTitle')}
        text={t('books.deleteText', { name: toDelete?.nomi })}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(toDelete._id)}
        onClose={() => setToDelete(null)}
      />
    </div>
  )
}
