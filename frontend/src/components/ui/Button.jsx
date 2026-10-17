import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

const variants = {
  primary: 'bg-stone-900 text-white hover:bg-stone-700 shadow-sm dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-300',
  accent: 'bg-amber-500 text-stone-950 hover:bg-amber-400 shadow-sm shadow-amber-500/30',
  secondary: 'bg-white text-stone-800 ring-1 ring-stone-300 hover:bg-stone-50 dark:bg-stone-900 dark:text-stone-200 dark:ring-stone-700 dark:hover:bg-stone-800',
  danger: 'bg-red-600 text-white hover:bg-red-500 shadow-sm',
  ghost: 'text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800',
  light: 'bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/20',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3.5 text-base gap-2',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  to,
  className,
  children,
  disabled,
  type = 'button',
  ...props
}) {
  const classes = cn(
    'inline-flex cursor-pointer items-center justify-center rounded-xl font-semibold transition duration-200',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500',
    'disabled:pointer-events-none disabled:opacity-60',
    variants[variant],
    sizes[size],
    className
  )

  const content = (
    <>
      {loading ? <Loader2 className="size-4 animate-spin" /> : Icon && <Icon className="size-4" />}
      {children}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} disabled={disabled || loading} {...props}>
      {content}
    </button>
  )
}
