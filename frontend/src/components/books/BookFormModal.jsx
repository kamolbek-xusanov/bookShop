import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from '../ui/Modal'
import Field, { Switch } from '../ui/Field'
import FormErrors from '../ui/FormErrors'
import Button from '../ui/Button'
import ImagePicker from './ImagePicker'
import { mediaUrl } from '../../utils/media'
import { getErrorMessages } from '../../utils/errors'

const GENRES = ['Programming', 'Fiction', 'Fantasy', 'Science', 'History', 'Business', 'Biography', 'Self-development']

export default function BookFormModal({ book, onSubmit, onClose }) {
  const { t } = useTranslation()
  const isEdit = Boolean(book)

  const [values, setValues] = useState({
    nomi: book?.nomi ?? '',
    muallifi: book?.muallifi ?? '',
    sahifasi: book?.sahifasi ?? '',
    Janr: book?.Janr ?? '',
    sotuvdaBor: book?.sotuvdaBor ?? true,
    tavsif: book?.tavsif ?? '',
    tili: book?.tili ?? '',
    nashrYili: book?.nashrYili ?? '',
    narxi: book?.narxi ?? ''
  })
  const [savedImages, setSavedImages] = useState(book?.images ?? [])
  const [newImages, setNewImages] = useState([]) // [{ key, file, src }]
  const [removed, setRemoved] = useState([])
  const previews = useRef([])
  const [fieldErrors, setFieldErrors] = useState({})
  const [serverErrors, setServerErrors] = useState([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const urls = previews.current
    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [])

  const imageItems = [
    ...savedImages.map((path) => ({ key: path, src: mediaUrl(path), path })),
    ...newImages,
  ]

  function addImages(files) {
    const added = files.map((file) => {
      const src = URL.createObjectURL(file)
      previews.current.push(src)
      return { key: src, src, file }
    })
    setNewImages((current) => [...current, ...added])
  }

  function removeImage(item) {
    if (item.path) {
      setSavedImages((current) => current.filter((path) => path !== item.path))
      setRemoved((current) => [...current, item.path])
    } else {
      setNewImages((current) => current.filter((image) => image.key !== item.key))
      URL.revokeObjectURL(item.src)
    }
  }

  const set = (name) => (event) => setValues((current) => ({ ...current, [name]: event.target.value }))

  function validate() {
    const errors = {}
    if (values.nomi.trim().length < 4) errors.nomi = t('validation.min', { count: 4 })
    if (values.muallifi.trim().length < 3) errors.muallifi = t('validation.min', { count: 3 })
    if (!Number(values.sahifasi) || Number(values.sahifasi) < 1) errors.sahifasi = t('validation.minNumber', { count: 1 })
    if (!values.Janr.trim()) errors.Janr = t('validation.required')
    return errors
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    setServerErrors([])

    try {
      await onSubmit({
        nomi: values.nomi.trim(),
        muallifi: values.muallifi.trim(),
        sahifasi: Number(values.sahifasi),
        Janr: values.Janr.trim(),
        sotuvdaBor: values.sotuvdaBor,
        newImages: newImages.map((image) => image.file),
        removeImages: removed,
        tavsif: values.tavsif.trim(),
        tili: values.tili.trim(),
        nashrYili: values.nashrYili === '' ? undefined : Number(values.nashrYili),
        narxi: values.narxi === '' ? undefined : Number(values.narxi),
      })
    } catch (error) {
      setServerErrors(getErrorMessages(error, t))
      setSubmitting(false)
    }
  }

  return (
    <Modal open onClose={onClose} title={isEdit ? t('bookForm.editTitle') : t('bookForm.addTitle')}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Field
          label={t('bookForm.title')}
          value={values.nomi}
          onChange={set('nomi')}
          error={fieldErrors.nomi}
          autoFocus
        />
        <Field label={t('bookForm.author')} value={values.muallifi} onChange={set('muallifi')} error={fieldErrors.muallifi} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={t('bookForm.pages')}
            type="number"
            min="1"
            value={values.sahifasi}
            onChange={set('sahifasi')}
            error={fieldErrors.sahifasi}
          />
          <Field
            label={t('bookForm.genre')}
            list="book-genres"
            value={values.Janr}
            onChange={set('Janr')}
            error={fieldErrors.Janr}
          />
          <datalist id="book-genres">
            {GENRES.map((genre) => (
              <option key={genre} value={genre} />
            ))}
          </datalist>
        </div>



        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Kitob tavsifi"
            value={values.tavsif}
            onChange={set('tavsif')}
          />

          <Field
            label="Kitob tili"
            value={values.tili}
            onChange={set('tili')}
          />

          <Field
            label="Nashr yili"
            type="number"
            min="1000"
            max="2100"
            value={values.nashrYili}
            onChange={set('nashrYili')}
          />

          <Field
            label="Narxi (so'm)"
            type="number"
            min="0"
            value={values.narxi}
            onChange={set('narxi')}
          />
        </div>


        <ImagePicker items={imageItems} onAdd={addImages} onRemove={removeImage} />

        <Switch
          checked={values.sotuvdaBor}
          onChange={(checked) => setValues((current) => ({ ...current, sotuvdaBor: checked }))}
          label={t('common.inStock')}
          hint={t('bookForm.inStockHint')}
        />

        <FormErrors errors={serverErrors} />

        <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="accent" loading={submitting}>
            {isEdit ? t('common.save') : t('bookForm.submitAdd')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
