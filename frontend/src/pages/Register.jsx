import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { loginUser, registerUser } from '../services/authService'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { getErrorMessages } from '../utils/errors'
import AuthShell from '../components/layout/AuthShell'
import Field from '../components/ui/Field'
import FormErrors from '../components/ui/FormErrors'
import Button from '../components/ui/Button'
import GoogleButton from '../components/auth/GoogleButton'
import OrDivider from '../components/auth/OrDivider'
import { useGoogleAuth } from '../hooks/useGoogleAuth'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Register() {
  const { t } = useTranslation()
  const { login, isAuthenticated } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [values, setValues] = useState({ ism: '', familiya: '', yosh: '', email: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const set = (name) => (event) => setValues((current) => ({ ...current, [name]: event.target.value }))

  // register, then sign the new user in right away
  const mutation = useMutation({
    mutationFn: async (payload) => {
      await registerUser(payload)
      const { data } = await loginUser({ email: payload.email, password: payload.password })
      return data
    },
    onSuccess: (data) => {
      login(data.token)
      toast.success(t('auth.registered'))
      navigate('/books', { replace: true })
    },
  })

  const google = useGoogleAuth('/books')

  if (isAuthenticated && !mutation.isSuccess && !google.isSuccess) {
    return <Navigate to="/books" replace />
  }

  function validate() {
    const errors = {}
    if (values.ism.trim().length < 2) errors.ism = t('validation.min', { count: 2 })
    if (values.familiya.trim().length < 2) errors.familiya = t('validation.min', { count: 2 })
    const age = Number(values.yosh)
    if (!age || age < 1 || age > 120) errors.yosh = t('validation.range', { min: 1, max: 120 })
    if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = t('validation.email')
    if (values.password.length < 6) errors.password = t('validation.min', { count: 6 })
    return errors
  }

  function handleSubmit(event) {
    event.preventDefault()

    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    mutation.mutate({
      ism: values.ism.trim(),
      familiya: values.familiya.trim(),
      yosh: Number(values.yosh),
      email: values.email.trim(),
      password: values.password,
    })
  }

  return (
    <AuthShell
      title={t('auth.registerTitle')}
      subtitle={t('auth.registerSubtitle')}
      footer={
        <>
          {t('auth.haveAccount')}{' '}
          <Link to="/login" className="font-semibold text-amber-700 hover:underline dark:text-amber-400">
            {t('nav.login')}
          </Link>
        </>
      }
    >
      <div className="mb-6 flex flex-col gap-4">
        <GoogleButton text="signup_with" onCredential={google.mutate} />
        {google.isError && <FormErrors errors={getErrorMessages(google.error, t)} />}
        <OrDivider label={t('auth.orEmail')} />
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label={t('auth.firstName')}
            autoComplete="given-name"
            value={values.ism}
            onChange={set('ism')}
            error={fieldErrors.ism}
            autoFocus
          />
          <Field
            label={t('auth.lastName')}
            autoComplete="family-name"
            value={values.familiya}
            onChange={set('familiya')}
            error={fieldErrors.familiya}
          />
        </div>

        <Field
          label={t('auth.age')}
          type="number"
          min="1"
          max="120"
          value={values.yosh}
          onChange={set('yosh')}
          error={fieldErrors.yosh}
        />
        <Field
          label={t('auth.email')}
          type="email"
          icon={Mail}
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={set('email')}
          error={fieldErrors.email}
        />
        <Field
          label={t('auth.password')}
          type={showPassword ? 'text' : 'password'}
          icon={Lock}
          autoComplete="new-password"
          value={values.password}
          onChange={set('password')}
          error={fieldErrors.password}
          hint={t('auth.passwordHint')}
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
              className="cursor-pointer rounded-lg p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200"
            >
              {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
            </button>
          }
        />

        {mutation.isError && <FormErrors errors={getErrorMessages(mutation.error, t)} />}

        <Button type="submit" size="lg" variant="primary" loading={mutation.isPending}>
          {t('auth.submitRegister')}
        </Button>
      </form>
    </AuthShell>
  )
}
