import { CodeBlock } from '../ui/CodeBlock'

export function SectionLessCommon() {
  return (
    <section id="less-common" className="scroll-mt-24 mb-16 docs-section">
      <h2 className="section-title">8. Less Common but Good to Know</h2>

      <div className="space-y-12">
        <article id="less-error-boundaries" className="scroll-mt-24">
          <h3 className="pattern-title">Error Boundaries</h3>
          <p className="section-note">
            React has no functional equivalent to error boundaries. Use{' '}
            <code className="inline-code">react-error-boundary</code>.
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

        <article id="less-create-portal" className="scroll-mt-24">
          <h3 className="pattern-title">createPortal</h3>
          <p className="section-note">
            Render children into a DOM node outside the parent hierarchy (e.g.,
            Modals, Tooltips) to escape parent{' '}
            <code className="inline-code">overflow: hidden</code> or strict{' '}
            <code className="inline-code">z-index</code> stacking contexts.
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

        <article id="less-use-layout-effect" className="scroll-mt-24">
          <h3 className="pattern-title">useLayoutEffect vs useEffect</h3>
          <p className="section-note">
            Use <code className="inline-code">useLayoutEffect</code> only if you
            need to mutate the DOM synchronously before the browser repaints.
            Using it everywhere harms performance.
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

        <article id="less-context-reducer-store" className="scroll-mt-24">
          <h3 className="pattern-title">Context + useReducer as Store</h3>
          <p className="section-note">
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

        <article id="less-use-id" className="scroll-mt-24">
          <h3 className="pattern-title">useId</h3>
          <p className="section-note">
            Generate unique IDs for accessible form label/input pairs. Using{' '}
            <code className="inline-code">Math.random()</code> causes hydration
            mismatch errors.
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
