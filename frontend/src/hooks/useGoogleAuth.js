import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { googleAuth } from '../services/authService'
import { useAuth } from './useAuth'
import { useToast } from './useToast'

// "Continue with Google": sends the Google token to the API, then logs the user in
export function useGoogleAuth(redirectTo = '/books') {
  const { t } = useTranslation()
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (credential) => googleAuth(credential),
    onSuccess: ({ data }) => {
      login(data.token)
      toast.success(data.isNew ? t('auth.registered') : t('auth.welcome', { name: data.user?.ism ?? '' }))
      navigate(redirectTo, { replace: true })
    },
  })
}
