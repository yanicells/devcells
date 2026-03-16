import { CodeBlock } from '../ui/CodeBlock'
import { Gotcha } from '../ui/Gotcha'

export function SectionEverydayReact() {
  return (
    <section id="everyday-react" className="scroll-mt-24 mb-16">
      <h2 className="text-2xl font-bold tracking-tight mb-6 pb-2 border-b border-[#e5e5e5]">
        1. Everyday React
      </h2>
      <div className="space-y-12">
        <article>
          <h3 className="text-lg font-semibold tracking-tight mb-2">
            useState
          </h3>
          <p className="text-[#888] text-sm mb-4">
            Use for standard local component state that triggers a re-render.
          </p>
          <CodeBlock
            code={`const [count, setCount] = useState(0)

// Functional update for previous state dependence
const increment = () => setCount((prev) => prev + 1)`}
            lang="tsx"
          />
          <Gotcha>
            Mutating the state variable directly (e.g. `count = 1`) doesn't
            trigger a re-render. Always use the setter.
          </Gotcha>
        </article>

        <article>
          <h3 className="text-lg font-semibold tracking-tight mb-2">
            useEffect
          </h3>
          <p className="text-[#888] text-sm mb-4">
            Synchronize your component with external systems (network, DOM,
            subscriptions).
          </p>
          <CodeBlock
            code={`useEffect(() => {
  const timeoutId = setTimeout(() => console.log('Ping'), 1000)
  
  return () => clearTimeout(timeoutId) // Cleanup prevents memory leaks
}, [])`}
            lang="tsx"
          />
          <Gotcha>
            Calling `setState` inside `useEffect` without a dependency array
            causes an infinite loop.
          </Gotcha>
        </article>

        <article>
          <h3 className="text-lg font-semibold tracking-tight mb-2">
            Props & Events
          </h3>
          <p className="text-[#888] text-sm mb-4">
            Pass data down and emit events up.
          </p>
          <CodeBlock
            code={`interface ButtonProps {
  label: string
  onClick: (id: string) => void
}

function Button({ label, onClick }: ButtonProps) {
  return <button onClick={() => onClick('btn-1')}>{label}</button>
}`}
            lang="tsx"
          />
        </article>

        <article>
          <h3 className="text-lg font-semibold tracking-tight mb-2">
            Controlled Inputs
          </h3>
          <p className="text-[#888] text-sm mb-4">
            Drive form inputs solely by React state, making React the single
            source of truth.
          </p>
          <CodeBlock
            code={`const [value, setValue] = useState('')

return (
  <input 
    value={value} 
    onChange={(e) => setValue(e.target.value)} 
  />
)`}
            lang="tsx"
          />
          <Gotcha>
            Forgetting the `onChange` handler makes the input read-only.
          </Gotcha>
        </article>

        <article>
          <h3 className="text-lg font-semibold tracking-tight mb-2">
            Conditional Rendering
          </h3>
          <p className="text-[#888] text-sm mb-4">Show UI based on logic.</p>
          <CodeBlock
            code={`return (
  <div>
    {isLoading ? <Spinner /> : <Data />}
    {error && <ErrorMessage />}
  </div>
)`}
            lang="tsx"
          />
          <Gotcha>
            Using `array.length && &lt;Component /&gt;` renders a `0` when
            empty. Use `array.length &gt; 0 && &lt;Component /&gt;` instead.
          </Gotcha>
        </article>

        <article>
          <h3 className="text-lg font-semibold tracking-tight mb-2">
            List Rendering
          </h3>
          <p className="text-[#888] text-sm mb-4">
            Render multiples of a component from an array.
          </p>
          <CodeBlock
            code={`const items = [{ id: 'a', name: 'Al' }, { id: 'b', name: 'Bo' }]

return (
  <ul>
    {items.map((item) => (
      <li key={item.id}>{item.name}</li>
    ))}
  </ul>
)`}
            lang="tsx"
          />
          <Gotcha>
            Using array index as a `key` can break state and DOM reconciliation
            if item order changes. Always use a stable ID.
          </Gotcha>
        </article>
      </div>
    </section>
  )
}
