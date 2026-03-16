import { CodeBlock } from '../ui/CodeBlock'
import { Gotcha } from '../ui/Gotcha'

export function SectionDataSideEffects() {
  return (
    <section id="data-side-effects" className="scroll-mt-24 mb-16 docs-section">
      <h2 className="section-title">2. Data & Side Effects</h2>
      <div className="space-y-12">
        <article id="data-use-reducer" className="scroll-mt-24">
          <h3 className="pattern-title">useReducer</h3>
          <p className="section-note">
            Manage complex state objects or multiple sub-values where the next
            state relies on the previous.
          </p>
          <CodeBlock
            code={`type State = { count: number; error: string | null }
type Action = { type: 'INCREMENT' } | { type: 'ERROR'; message: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1, error: null }
    case 'ERROR':
      return { ...state, error: action.message }
    default:
      return state
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0, error: null })
  
  return (
    <button onClick={() => dispatch({ type: 'INCREMENT' })}>
      Count: {state.count}
    </button>
  )
}`}
            lang="tsx"
          />
        </article>

        <article id="data-use-context" className="scroll-mt-24">
          <h3 className="pattern-title">useContext</h3>
          <p className="section-note">
            Pass data through the component tree without prop-drilling.
          </p>
          <CodeBlock
            code={`const ThemeContext = createContext<'light' | 'dark'>('light')

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Child />
    </ThemeContext.Provider>
  )
}

function Child() {
  const theme = useContext(ThemeContext)
  return <div>Current Theme: {theme}</div>
}`}
            lang="tsx"
          />
          <Gotcha>
            Any state change in the Provider value causes all consuming
            components to re-render. Memoize values if they are complex objects.
          </Gotcha>
        </article>

        <article id="data-tanstack-query" className="scroll-mt-24">
          <h3 className="pattern-title">TanStack Query</h3>
          <p className="section-note">
            The standard async state manager. Handles caching, background
            updates, and stale data.
          </p>
          <CodeBlock
            code={`// 1. Fetching (useQuery)
const { data, isLoading, error } = useQuery({
  queryKey: ['users', projectId],
  queryFn: () => fetchUsers(projectId),
  staleTime: 60 * 1000, // Data fresh for 1 min
})

// 2. Mutations (useMutation)
const queryClient = useQueryClient()
const mutation = useMutation({
  mutationFn: (newUser) => api.createUser(newUser),
  onSuccess: () => {
    // Invalidate the cache to trigger a refetch
    queryClient.invalidateQueries({ queryKey: ['users'] })
  },
})`}
            lang="tsx"
          />
          <Gotcha>
            Forgetting `queryKey` variables (e.g., using `['users']` instead of
            `['users', id]`) causes cache collisions between different entities.
          </Gotcha>
          <p className="section-note mt-4 leading-relaxed font-semibold">
            SWR Equivalent:
          </p>
          <CodeBlock
            code={`import useSWR from 'swr'
const { data, mutate } = useSWR('/api/users', fetcher)
mutate() // Invalidating cache`}
            lang="tsx"
          />
        </article>

        <article id="data-use-ref" className="scroll-mt-24">
          <h3 className="pattern-title">useRef</h3>
          <p className="section-note">
            Create DOM references or mutable values that don't trigger
            re-renders.
          </p>
          <CodeBlock
            code={`// DOM Reference
const inputRef = useRef<HTMLInputElement>(null)
useEffect(() => { inputRef.current?.focus() }, [])
// <input ref={inputRef} />

// Mutable Value without Re-render
const renderCount = useRef(0)
renderCount.current += 1`}
            lang="tsx"
          />
          <Gotcha>
            Reading or writing `ref.current` during render is a side effect and
            breaks concurrent rendering. Only use inside effects or event
            handlers.
          </Gotcha>
        </article>

        <article id="data-use-memo-callback" className="scroll-mt-24">
          <h3 className="pattern-title">useCallback & useMemo</h3>
          <p className="section-note">
            Cache functions and derived values between renders. Use only when
            calculating is expensive or passing to `React.memo` components.
          </p>
          <CodeBlock
            code={`// useMemo: Cache expensive calculations
const sortedItems = useMemo(() => items.sort(), [items])

// useCallback: Cache function identities
const handleSubmit = useCallback((data) => {
  api.submit(data, id)
}, [id])`}
            lang="tsx"
          />
          <Gotcha>
            Wrapping every function in `useCallback` is an anti-pattern. The
            cost of closure identity checks is often worse than re-creating the
            function.
          </Gotcha>
        </article>

        <article id="data-custom-hooks" className="scroll-mt-24">
          <h3 className="pattern-title">Custom Hooks</h3>
          <p className="section-note">Extract and reuse stateful logic.</p>
          <CodeBlock
            code={`// useDebounce
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

// useLocalStorage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (e) { return initialValue }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value
    setStoredValue(valueToStore)
    window.localStorage.setItem(key, JSON.stringify(valueToStore))
  }

  return [storedValue, setValue] as const
}`}
            lang="tsx"
          />
        </article>
      </div>
    </section>
  )
}
