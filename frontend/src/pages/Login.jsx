import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { loginUser } from '../services/authService'
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

export default function Login() {
  const { t } = useTranslation()
  const { login, isAuthenticated } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const redirectTo = location.state?.from?.pathname || '/books'

  const mutation = useMutation({
    mutationFn: (credentials) => loginUser(credentials),
    onSuccess: ({ data }) => {
      login(data.token)
      toast.success(t('auth.welcome', { name: data.user?.ism ?? '' }))
      navigate(redirectTo, { replace: true })
    },
  })

  const google = useGoogleAuth(redirectTo)

  if (isAuthenticated && !mutation.isSuccess && !google.isSuccess) {
    return <Navigate to={redirectTo} replace />
  }

  function handleSubmit(event) {
    event.preventDefault()
    mutation.mutate({ email: email.trim(), password })
  }

  return (
    <AuthShell
      title={t('auth.loginTitle')}
      subtitle={t('auth.loginSubtitle')}
      footer={
        <>
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="font-semibold text-amber-700 hover:underline dark:text-amber-400">
            {t('nav.register')}
          </Link>
        </>
      }
    >
      <div className="mb-6 flex flex-col gap-4">
        <GoogleButton text="signin_with" onCredential={google.mutate} />
        {google.isError && <FormErrors errors={getErrorMessages(google.error, t)} />}
        <OrDivider label={t('auth.orEmail')} />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Field
          label={t('auth.email')}
          type="email"
          icon={Mail}
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoFocus
        />
        <Field
          label={t('auth.password')}
          type={showPassword ? 'text' : 'password'}
          icon={Lock}
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
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
          {t('auth.submitLogin')}
        </Button>
      </form>
    </AuthShell>
  )
}
