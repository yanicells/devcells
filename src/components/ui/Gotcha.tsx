import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export function Gotcha({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'border-l-2 border-(--gotcha-border) bg-(--gotcha-bg) px-4 py-3 my-4 text-sm text-(--text-primary) flex items-start gap-3 flex-col sm:flex-row sm:items-center',
        className,
      )}
    >
      <span className="font-bold flex-none text-[0.65rem] tracking-[0.1em] text-(--gotcha-border)">
        !
      </span>
      <span>{children}</span>
    </div>
  )
}
