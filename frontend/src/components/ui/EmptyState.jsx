export default function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-stone-300 bg-white/60 px-6 py-16 text-center dark:border-stone-700 dark:bg-stone-900/40">
      {Icon && (
        <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
          <Icon className="size-7" />
        </div>
      )}
      <h3 className="mt-5 font-display text-xl font-bold text-stone-900 dark:text-stone-100">{title}</h3>
      {text && <p className="mt-2 max-w-md text-sm text-stone-500 dark:text-stone-400">{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
