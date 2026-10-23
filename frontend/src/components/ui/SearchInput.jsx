import { Search } from 'lucide-react'

export default function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="relative w-full sm:max-w-md">
      <Search className="pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-stone-400" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-2xl border border-stone-300 bg-white py-3 pr-4 pl-11 text-base sm:text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 hover:border-stone-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:border-stone-600 dark:focus:ring-amber-500/25"
      />
    </div>
  )
}
