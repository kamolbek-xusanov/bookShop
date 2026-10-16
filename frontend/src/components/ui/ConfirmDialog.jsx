import { useTranslation } from 'react-i18next'
import { Trash2 } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'

export default function ConfirmDialog({ open, title, text, loading, onConfirm, onClose }) {
  const { t } = useTranslation()

  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="-mt-3 flex size-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
        <Trash2 className="size-6" />
      </div>
      <p className="mt-4 text-sm leading-relaxed text-stone-600 dark:text-stone-400">{text}</p>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {t('common.cancel')}
        </Button>
        <Button variant="danger" loading={loading} onClick={onConfirm}>
          {t('common.delete')}
        </Button>
      </div>
    </Modal>
  )
}
