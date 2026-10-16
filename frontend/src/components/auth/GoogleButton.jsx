import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../hooks/useTheme'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const SCRIPT_SRC = 'https://accounts.google.com/gsi/client'

let scriptPromise

// loads Google's sign-in script once for the whole app
function loadGoogleScript() {
  if (window.google?.accounts?.id) return Promise.resolve()

  scriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.onload = resolve
    script.onerror = () => {
      scriptPromise = null
      reject(new Error('Google script failed to load'))
    }
    document.head.appendChild(script)
  })

  return scriptPromise
}

// "Continue with Google" button (Google Identity Services).
// onCredential receives the Google ID token; the backend verifies it and signs the user in.
export default function GoogleButton({ onCredential, text = 'continue_with' }) {
  const { t, i18n } = useTranslation()
  const { isDark } = useTheme()
  const holder = useRef(null)
  const callback = useRef(onCredential)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    callback.current = onCredential
  })

  useEffect(() => {
    if (!CLIENT_ID) return

    let cancelled = false

    loadGoogleScript()
      .then(() => {
        if (cancelled || !holder.current) return

        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: (response) => callback.current?.(response.credential),
        })

        holder.current.innerHTML = ''
        window.google.accounts.id.renderButton(holder.current, {
          type: 'standard',
          theme: isDark ? 'filled_black' : 'outline',
          size: 'large',
          shape: 'pill',
          text,
          logo_alignment: 'center',
          locale: i18n.resolvedLanguage,
          width: Math.min(holder.current.offsetWidth || 360, 400),
        })
      })
      .catch(() => !cancelled && setFailed(true))

    return () => {
      cancelled = true
    }
  }, [isDark, text, i18n.resolvedLanguage])

  if (!CLIENT_ID) {
    // no client ID set up: tell the developer, hide the button from real visitors
    return import.meta.env.DEV ? (
      <p className="rounded-xl border border-dashed border-stone-300 px-3 py-2 text-center text-xs text-stone-500 dark:border-stone-700 dark:text-stone-400">
        {t('auth.googleNotConfigured')}
      </p>
    ) : null
  }

  if (failed) {
    return <p className="text-center text-xs text-stone-500 dark:text-stone-400">{t('auth.googleFailed')}</p>
  }

  return <div ref={holder} className="flex min-h-10 w-full justify-center" />
}
