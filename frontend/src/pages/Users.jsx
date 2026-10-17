import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Pencil, Plus, Trash2, Users as UsersIcon } from 'lucide-react'
import { createUser, deleteUser, getUsers, updateUser } from '../services/userService'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { getErrorMessages } from '../utils/errors'
import { roleTone } from '../utils/roles'
import UserFormModal from '../components/users/UserFormModal'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import EmptyState from '../components/ui/EmptyState'
import PageHeader from '../components/ui/PageHeader'
import SearchInput from '../components/ui/SearchInput'
import Skeleton from '../components/ui/Skeleton'

export default function Users() {
  const { t } = useTranslation()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { user: me, hasRole } = useAuth()

  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null) 
  const [toDelete, setToDelete] = useState(null)

  const canManage = hasRole('superAdmin')

  const { data: users, isLoading, isError, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  })

  const saveMutation = useMutation({
    mutationFn: (values) => (modal.user ? updateUser({ id: modal.user._id, user: values }) : createUser(values)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success(modal.user ? t('users.updated') : t('users.created'))
      setModal(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success(t('users.deleted'))
      setToDelete(null)
    },
    onError: (error) => {
      toast.error(getErrorMessages(error, t)[0])
      setToDelete(null)
    },
  })

  const query = search.trim().toLowerCase()
  const visible = (users ?? []).filter((person) =>
    [person.ism, person.familiya, person.email].some((value) => value?.toLowerCase().includes(query))
  )

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
      <PageHeader
        title={t('users.title')}
        subtitle={canManage ? t('users.subtitle') : t('users.readOnly')}
        actions={
          canManage && (
            <Button variant="accent" icon={Plus} onClick={() => setModal({ user: null })}>
              {t('users.add')}
            </Button>
          )
        }
      />

      <div className="mt-10">
        <SearchInput value={search} onChange={setSearch} placeholder={t('users.searchPlaceholder')} />
      </div>

      <div className="mt-8">
        {isLoading && <Skeleton className="h-80 rounded-3xl" />}

        {isError && (
          <EmptyState
            icon={UsersIcon}
            title={t('users.loadError')}
            action={
              <Button variant="secondary" onClick={() => refetch()}>
                {t('common.retry')}
              </Button>
            }
          />
        )}

        {users && visible.length === 0 && (
          <EmptyState icon={UsersIcon} title={search ? t('users.emptySearch', { q: search }) : t('users.empty')} />
        )}

        {visible.length > 0 && (
          <div className="overflow-x-auto rounded-3xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
            <table className="w-full min-w-160 text-left text-sm">
              <thead className="border-b border-stone-200 bg-stone-50 text-xs font-semibold tracking-wide text-stone-500 uppercase dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400">
                <tr>
                  <th className="px-6 py-4">{t('users.colUser')}</th>
                  <th className="px-6 py-4">{t('users.colAge')}</th>
                  <th className="px-6 py-4">{t('users.colRole')}</th>
                  {canManage && <th className="px-6 py-4 text-right">{t('users.colActions')}</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {visible.map((person) => (
                  <tr key={person._id} className="transition hover:bg-stone-50/70 dark:hover:bg-stone-800/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-stone-900 font-bold text-white dark:bg-stone-100 dark:text-stone-900">
                          {person.ism.charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-stone-900 dark:text-stone-100">
                            {[person.ism, person.familiya].filter(Boolean).join(' ')}
                            {person._id === me.id && (
                              <span className="ml-2 text-xs font-medium text-amber-700 dark:text-amber-400">({t('common.you')})</span>
                            )}
                          </p>
                          <p className="truncate text-stone-500 dark:text-stone-400">{person.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-stone-600 tabular-nums dark:text-stone-400">{person.yosh ?? '—'}</td>
                    <td className="px-6 py-4">
                      <Badge tone={roleTone(person.role)}>{t(`roles.${person.role}`)}</Badge>
                    </td>
                    {canManage && (
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={Pencil}
                            onClick={() => setModal({ user: person })}
                            aria-label={`${t('common.edit')}: ${person.ism}`}
                          >
                            {t('common.edit')}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Trash2}
                            disabled={person._id === me.id}
                            onClick={() => setToDelete(person)}
                            className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                            aria-label={`${t('common.delete')}: ${person.ism}`}
                          >
                            {t('common.delete')}
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <UserFormModal
          user={modal.user}
          onSubmit={(values) => saveMutation.mutateAsync(values)}
          onClose={() => setModal(null)}
        />
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title={t('users.deleteTitle')}
        text={t('users.deleteText', { name: toDelete?.ism })}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(toDelete._id)}
        onClose={() => setToDelete(null)}
      />
    </div>
  )
}
