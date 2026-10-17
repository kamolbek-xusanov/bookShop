import { cn } from '../../utils/cn'

export default function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/80', className)} />
}

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
      <Skeleton className="h-40 rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}
