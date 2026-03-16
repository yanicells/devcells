import { CodeBlock } from '../ui/CodeBlock'
import { Gotcha } from '../ui/Gotcha'

function CachingFlow() {
  return (
    <div className="border border-[#e5e5e5] rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4 overflow-x-auto my-6 bg-white [background-image:radial-gradient(#e5e5e5_1px,transparent_0)] [background-size:16px_16px]">
      <svg
        width="100%"
        height="80"
        viewBox="0 0 600 80"
        className="min-w-[500px] text-black fill-none stroke-current"
        strokeWidth="1.5"
      >
        <rect
          x="10"
          y="20"
          width="120"
          height="40"
          rx="4"
          className="stroke-black stroke-2"
          fill="white"
        />
        <text
          x="70"
          y="44"
          className="text-xs font-mono font-bold"
          stroke="none"
          fill="black"
          textAnchor="middle"
        >
          Loader Prefetch
        </text>

        <path d="M130 40 L160 40 L160 40 L190 40" markerEnd="url(#arrow)" />

        <rect
          x="200"
          y="20"
          width="120"
          height="40"
          rx="4"
          className="stroke-black stroke-2"
          fill="white"
        />
        <text
          x="260"
          y="44"
          className="text-xs font-mono font-bold"
          stroke="none"
          fill="black"
          textAnchor="middle"
        >
          Router Cache
        </text>

        <path d="M320 40 L350 40 L350 40 L380 40" markerEnd="url(#arrow)" />

        <rect
          x="390"
          y="20"
          width="120"
          height="40"
          rx="4"
          className="stroke-black stroke-2"
          fill="white"
        />
        <text
          x="450"
          y="44"
          className="text-xs font-mono font-bold"
          stroke="none"
          fill="black"
          textAnchor="middle"
        >
          Query Cache
        </text>

        <path d="M510 40 L535 40 L535 40 L560 40" markerEnd="url(#arrow)" />

        <circle
          cx="580"
          cy="40"
          r="20"
          className="stroke-black stroke-2"
          fill="white"
        />
        <text
          x="580"
          y="44"
          className="text-xs font-mono font-bold"
          stroke="none"
          fill="black"
          textAnchor="middle"
        >
          UI
        </text>

        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path
              d="M 0 0 L 10 5 L 0 10 z"
              className="fill-black stroke-none"
            />
          </marker>
        </defs>
      </svg>
    </div>
  )
}

export function SectionPerformance() {
  return (
    <section id="performance" className="scroll-mt-24 mb-16">
      <h2 className="text-2xl font-bold tracking-tight mb-6 pb-2 border-b border-[#e5e5e5]">
        6. Performance
      </h2>

      <div className="space-y-12">
        <article>
          <h3 className="text-lg font-semibold tracking-tight mb-4">
            React.memo
          </h3>
          <p className="text-sm text-[#888] mb-4">
            Skip re-rendering when props don't change.
          </p>
          <CodeBlock
            code={`const ListItem = React.memo(function ListItem({ title }: { title: string }) {
  console.log('Renders only if title changes')
  return <div>{title}</div>
})`}
            lang="tsx"
          />
          <Gotcha>
            If the component consumes a Context, it will still re-render when
            the context changes, bypassing{' '}
            <code className="bg-[#f5f5f5] px-1 py-0.5 rounded text-black text-[11px]">
              React.memo
            </code>
            .
          </Gotcha>
        </article>

        <article>
          <h3 className="text-lg font-semibold tracking-tight mb-4">
            lazy() + Suspense
          </h3>
          <p className="text-sm text-[#888] mb-4">
            Code splitting for heavy components.
          </p>
          <CodeBlock
            code={`import { lazy, Suspense } from 'react'

const HeavyChart = lazy(() => import('./HeavyChart'))

function Dashboard() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyChart />
    </Suspense>
  )
}`}
            lang="tsx"
          />
        </article>

        <article>
          <h3 className="text-lg font-semibold tracking-tight mb-4">
            startTransition
          </h3>
          <p className="text-sm text-[#888] mb-4">
            Keep UI responsive by marking updates as non-urgent.
          </p>
          <CodeBlock
            code={`const [query, setQuery] = useState('')
const [isPending, startTransition] = useTransition()

function handleChange(e) {
  // Urgent UI update
  setQuery(e.target.value)
  
  // Non-urgent background work
  startTransition(() => {
    filterHugeList(e.target.value)
  })
}`}
            lang="tsx"
          />
        </article>

        <article>
          <h3 className="text-lg font-semibold tracking-tight mb-4">
            useOptimistic
          </h3>
          <p className="text-sm text-[#888] mb-4">
            Instant UI feedback before a server mutation completes.
          </p>
          <CodeBlock
            code={`import { useOptimistic } from 'react'

function LikeButton({ initialLikes, likeAction }) {
  const [optimisticLikes, addOptimistic] = useOptimistic(
    initialLikes,
    (state, amount: number) => state + amount
  )

  const handleLike = async () => {
    addOptimistic(1) // Immediately updates UI
    await likeAction() // Wait for server to sync true state
  }

  return <button onClick={handleLike}>{optimisticLikes} Likes</button>
}`}
            lang="tsx"
          />
        </article>

        <article>
          <h3 className="text-lg font-semibold tracking-tight mb-4">
            Virtualization
          </h3>
          <p className="text-sm text-[#888] mb-4">
            Render only the visible items in a long list.
          </p>
          <CodeBlock
            code={`import { useVirtualizer } from '@tanstack/react-virtual'

const parentRef = useRef<HTMLDivElement>(null)
const rowVirtualizer = useVirtualizer({
  count: 10000,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 35,
})

return (
  <div ref={parentRef} className="h-[400px] overflow-auto">
    <div style={{ height: rowVirtualizer.getTotalSize(), position: 'relative' }}>
      {rowVirtualizer.getVirtualItems().map((vRow) => (
        <div 
          key={vRow.index} 
          style={{ position: 'absolute', top: vRow.start, height: vRow.size }}
        >
          Row {vRow.index}
        </div>
      ))}
    </div>
  </div>
)`}
            lang="tsx"
          />
        </article>

        <article>
          <h3 className="text-lg font-semibold tracking-tight mb-4">
            Image Optimization
          </h3>
          <p className="text-sm text-[#888] mb-4">
            Vite / TanStack Start lacks built-in{' '}
            <code className="bg-[#f5f5f5] px-1 py-0.5 rounded text-black text-[11px]">
              next/image
            </code>
            . Use native lazy loading and explicit sizing to avoid CLS.
          </p>
          <CodeBlock
            code={`<img 
  src="/hero.jpg" 
  width="800" 
  height="400" 
  loading="lazy" 
  decoding="async" 
  alt="Dashboard Hero"
/>`}
            lang="tsx"
          />
        </article>

        <article>
          <h3 className="text-lg font-semibold tracking-tight mb-4">
            TanStack Start Caching Overview
          </h3>
          <p className="text-sm text-[#888] mb-4">
            How prefetching, routing cache, and query caches interact.
          </p>
          <CachingFlow />
          <ul className="text-sm text-[#888] list-disc pl-5 mt-4 space-y-2">
            <li>
              <strong className="text-black">Loader Prefetch:</strong> Router
              calls loader, which runs{' '}
              <code className="bg-[#f5f5f5] px-1 py-0.5 rounded text-black text-[11px]">
                ensureQueryData
              </code>
              .
            </li>
            <li>
              <strong className="text-black">Router Cache:</strong> Reusesloader
              output for a configurable duration.
            </li>
            <li>
              <strong className="text-black">Query Cache:</strong> React Query
              holds data globally and deduplicates requests.{' '}
              <code className="bg-[#f5f5f5] px-1 py-0.5 rounded text-black text-[11px]">
                staleTime
              </code>{' '}
              controls refetches.
            </li>
            <li>
              <strong className="text-black">UI:</strong> Component hydrates
              efficiently.
            </li>
          </ul>
        </article>
      </div>
    </section>
  )
}
