import { useId } from 'react'
import { cn } from '../../utils/cn'

const inputClasses =
  'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400  dark:bg-stone-900 dark:text-stone-100' +
  'transition outline-none focus:ring-4'

function stateClasses(error) {
  return error
    ? 'border-red-400 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900'
    : 'border-stone-300 hover:border-stone-400 focus:border-amber-500 focus:ring-amber-100 dark:border-stone-700 dark:hover:border-stone-600 dark:focus:ring-amber-500/25'
}

function Wrapper({ id, label, error, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-stone-700 dark:text-stone-300">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs font-medium text-red-600 dark:text-red-400">{error}</p>
      ) : (
        hint && <p className="text-xs text-stone-500 dark:text-stone-400">{hint}</p>
      )}
    </div>
  )
}

// Text input with an optional leading icon and a trailing slot (e.g. show/hide password)
export default function Field({ label, error, hint, icon: Icon, trailing, className, ...props }) {
  const id = useId()

  return (
    <Wrapper id={id} label={label} error={error} hint={hint}>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-stone-400" />
        )}
        <input
          id={id}
          aria-invalid={Boolean(error)}
          className={cn(inputClasses, stateClasses(error), Icon && 'pl-10', trailing && 'pr-11', className)}
          {...props}
        />
        {trailing && <div className="absolute top-1/2 right-2 -translate-y-1/2">{trailing}</div>}
      </div>
    </Wrapper>
  )
}

export function SelectField({ label, error, hint, className, children, ...props }) {
  const id = useId()

  return (
    <Wrapper id={id} label={label} error={error} hint={hint}>
      <select
        id={id}
        className={cn(inputClasses, stateClasses(error), 'cursor-pointer', className)}
        {...props}
      >
        {children}
      </select>
    </Wrapper>
  )
}

// On/off switch with a label
export function Switch({ checked, onChange, label, hint }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-stone-300 bg-white px-3.5 py-3 hover:border-stone-400 dark:border-stone-700 dark:bg-stone-900 dark:hover:border-stone-600">
      <span>
        <span className="block text-sm font-semibold text-stone-700 dark:text-stone-300">{label}</span>
        {hint && <span className="block text-xs text-stone-500 dark:text-stone-400">{hint}</span>}
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-amber-500',
          checked ? 'bg-emerald-500' : 'bg-stone-300 dark:bg-stone-600'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform duration-200',
            checked && 'translate-x-5'
          )}
        />
      </span>
    </label>
  )
}
