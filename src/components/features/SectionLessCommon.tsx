import { CodeBlock } from '../ui/CodeBlock'

export function SectionLessCommon() {
  return (
    <section id="less-common" className="scroll-mt-24 mb-16">
      <h2 className="text-2xl font-bold tracking-tight mb-6 pb-2 border-b border-[#e5e5e5]">
        7. Less Common but Good to Know
      </h2>

      <div className="space-y-12">
        <article>
          <h3 className="text-lg font-semibold tracking-tight mb-4">
            Error Boundaries
          </h3>
          <p className="text-sm text-[#888] mb-4">
            React has no functional equivalent to error boundaries. Use{' '}
            <code className="bg-[#f5f5f5] px-1 py-0.5 rounded text-black text-xs">
              react-error-boundary
            </code>
            .
          </p>
          <CodeBlock
            code={`import { ErrorBoundary } from 'react-error-boundary'

function Fallback({ error, resetErrorBoundary }) {
  return (
    <div>
      <p>Something went wrong: {error.message}</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

// In Render
<ErrorBoundary fallbackRender={Fallback}>
  <BuggyComponent />
</ErrorBoundary>`}
            lang="tsx"
          />
        </article>

        <article>
          <h3 className="text-lg font-semibold tracking-tight mb-4">
            createPortal
          </h3>
          <p className="text-sm text-[#888] mb-4">
            Render children into a DOM node outside the parent hierarchy (e.g.,
            Modals, Tooltips) to escape parent{' '}
            <code className="bg-[#f5f5f5] px-1 py-0.5 rounded text-black text-[11px]">
              overflow: hidden
            </code>{' '}
            or strict `
            <code className="bg-[#f5f5f5] px-1 py-0.5 rounded text-black text-[11px]">
              z-index
            </code>{' '}
            stacking contexts.
          </p>
          <CodeBlock
            code={`import { createPortal } from 'react-dom'

function Modal({ children }) {
  const mountNode = document.getElementById('modal-root')
  if (!mountNode) return null

  return createPortal(
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl">{children}</div>
    </div>,
    mountNode
  )
}`}
            lang="tsx"
          />
        </article>

        <article>
          <h3 className="text-lg font-semibold tracking-tight mb-4">
            useLayoutEffect vs useEffect
          </h3>
          <p className="text-sm text-[#888] mb-4">
            Use{' '}
            <code className="bg-[#f5f5f5] px-1 py-0.5 rounded text-black text-[11px]">
              useLayoutEffect
            </code>{' '}
            only if you need to mutate the DOM synchronously before the browser
            repaints. Using it everywhere harms performance.
          </p>
          <CodeBlock
            code={`useLayoutEffect(() => {
  if (ref.current) {
    const height = ref.current.getBoundingClientRect().height
    setCalculatedHeight(height) // Synchronous update before paint
  }
}, [])`}
            lang="tsx"
          />
        </article>

        <article>
          <h3 className="text-lg font-semibold tracking-tight mb-4">
            Context + useReducer as Store
          </h3>
          <p className="text-sm text-[#888] mb-4">
            A lightweight alternative to Redux/Zustand.
          </p>
          <CodeBlock
            code={`type Action = { type: 'ADD'; payload: string }
type State = { items: string[] }

const StoreContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | null>(null)

function storeReducer(state: State, action: Action): State {
  if (action.type === 'ADD') return { items: [...state.items, action.payload] }
  return state
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, { items: [] })
  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be inside StoreProvider')
  return ctx
}

// In Component:
const { state, dispatch } = useStore()
dispatch({ type: 'ADD', payload: 'New Item' })`}
            lang="tsx"
          />
        </article>

        <article>
          <h3 className="text-lg font-semibold tracking-tight mb-4">useId</h3>
          <p className="text-sm text-[#888] mb-4">
            Generate unique IDs for accessible form label/input pairs. Using{' '}
            <code className="bg-[#f5f5f5] px-1 py-0.5 rounded text-black text-[11px]">
              Math.random()
            </code>{' '}
            causes hydration mismatch errors.
          </p>
          <CodeBlock
            code={`import { useId } from 'react'

function PasswordInput() {
  const id = useId()
  return (
    <div>
      <label htmlFor={id}>Password</label>
      <input id={id} type="password" />
    </div>
  )
}`}
            lang="tsx"
          />
        </article>
      </div>
    </section>
  )
}
