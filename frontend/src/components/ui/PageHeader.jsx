export default function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="text-sm font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-400">{eyebrow}</p>}
        <h1 className="mt-1 font-display text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl dark:text-stone-100">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-stone-600 dark:text-stone-400">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
    </div>
  )
}
