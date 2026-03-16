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
        'border-l-2 border-black bg-[#f5f5f5] px-4 py-2 my-4 text-sm text-black flex items-start gap-3 flex-col sm:flex-row sm:items-center',
        className,
      )}
    >
      <span className="font-bold flex-none text-xs bg-black text-white px-1.5 py-0.5 rounded-sm">
        !
      </span>
      <span>{children}</span>
    </div>
  )
}
