import { AlertCircle } from 'lucide-react'

// Red box with server / validation messages above a form's buttons
export default function FormErrors({ errors }) {
  if (!errors || errors.length === 0) return null

  return (
    <div role="alert" className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
      <AlertCircle className="mt-0.5 size-4.5 shrink-0" />
      <ul className="space-y-0.5">
        {errors.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    </div>
  )
}
