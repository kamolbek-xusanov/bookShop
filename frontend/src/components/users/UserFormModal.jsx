import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from '../ui/Modal'
import Field, { SelectField } from '../ui/Field'
import FormErrors from '../ui/FormErrors'
import Button from '../ui/Button'
import { getErrorMessages } from '../../utils/errors'

const ROLES = ['user', 'menejer', 'admin', 'superAdmin']
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function UserFormModal({ user, onSubmit, onClose }) {
  const { t } = useTranslation()
  const isEdit = Boolean(user)

  const [values, setValues] = useState({
    ism: user?.ism ?? '',
    familiya: user?.familiya ?? '',
    yosh: user?.yosh ?? '',
    email: user?.email ?? '',
    password: '',
    role: user?.role ?? 'user',
  })
  const [fieldErrors, setFieldErrors] = useState({})
  const [serverErrors, setServerErrors] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const set = (name) => (event) => setValues((current) => ({ ...current, [name]: event.target.value }))

  function validate() {
    const errors = {}
    if (values.ism.trim().length < 2) errors.ism = t('validation.min', { count: 2 })
    if (values.familiya.trim() && values.familiya.trim().length < 2) errors.familiya = t('validation.min', { count: 2 })
    const age = Number(values.yosh)
    if (!age || age < 1 || age > 120) errors.yosh = t('validation.range', { min: 1, max: 120 })
    if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = t('validation.email')
    if ((!isEdit || values.password) && values.password.length < 6) errors.password = t('validation.min', { count: 6 })
    return errors
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    const payload = {
      ism: values.ism.trim(),
      yosh: Number(values.yosh),
      email: values.email.trim(),
      role: values.role,
      ...(values.familiya.trim() ? { familiya: values.familiya.trim() } : {}),
      ...(values.password ? { password: values.password } : {}),
    }

    setSubmitting(true)
    setServerErrors([])

    try {
      await onSubmit(payload)
    } catch (error) {
      setServerErrors(getErrorMessages(error, t))
      setSubmitting(false)
    }
  }

  return (
    <Modal open onClose={onClose} title={isEdit ? t('userForm.editTitle') : t('userForm.addTitle')}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('userForm.firstName')} value={values.ism} onChange={set('ism')} error={fieldErrors.ism} autoFocus />
          <Field label={t('userForm.lastName')} value={values.familiya} onChange={set('familiya')} error={fieldErrors.familiya} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={t('userForm.age')}
            type="number"
            min="1"
            max="120"
            value={values.yosh}
            onChange={set('yosh')}
            error={fieldErrors.yosh}
          />
          <SelectField label={t('userForm.role')} value={values.role} onChange={set('role')}>
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {t(`roles.${role}`)}
              </option>
            ))}
          </SelectField>
        </div>

        <Field
          label={t('userForm.email')}
          type="email"
          autoComplete="off"
          value={values.email}
          onChange={set('email')}
          error={fieldErrors.email}
        />
        <Field
          label={t('userForm.password')}
          type="password"
          autoComplete="new-password"
          value={values.password}
          onChange={set('password')}
          error={fieldErrors.password}
          hint={isEdit ? t('userForm.passwordEditHint') : t('auth.passwordHint')}
        />

        <FormErrors errors={serverErrors} />

        <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="accent" loading={submitting}>
            {isEdit ? t('common.save') : t('userForm.submitAdd')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
