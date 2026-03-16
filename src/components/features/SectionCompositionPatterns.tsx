import { CodeBlock } from '../ui/CodeBlock'

export function SectionCompositionPatterns() {
  return (
    <section
      id="composition-patterns"
      className="scroll-mt-24 mb-16 docs-section"
    >
      <h2 className="section-title">5. Composition Patterns</h2>
      <div className="space-y-12">
        <article id="composition-compound" className="scroll-mt-24">
          <h3 className="pattern-title">Compound Components</h3>
          <p className="section-note">
            Share implicit state between components that work together.
          </p>
          <CodeBlock
            code={`import { createContext, useContext, useState } from 'react'

const TabsContext = createContext<{
  activeId: string;
  setActiveId: (id: string) => void
} | null>(null)

function Tabs({ children, defaultId }: { children: React.ReactNode, defaultId: string }) {
  const [activeId, setActiveId] = useState(defaultId)
  return <TabsContext.Provider value={{ activeId, setActiveId }}>{children}</TabsContext.Provider>
}

Tabs.List = function TabsList({ children }: { children: React.ReactNode }) {
  return <div className="flex border-b">{children}</div>
}

Tabs.Tab = function TabsTab({ id, children }: { id: string; children: React.ReactNode }) {
  const ctx = useContext(TabsContext)!
  const isActive = ctx.activeId === id
  return (
    <button 
      onClick={() => ctx.setActiveId(id)}
      className={\`p-4 \${isActive ? 'border-b-2 border-black font-bold' : 'text-gray-500'}\`}
    >
      {children}
    </button>
  )
}

Tabs.Panel = function TabsPanel({ id, children }: { id: string; children: React.ReactNode }) {
  const ctx = useContext(TabsContext)!
  return ctx.activeId === id ? <div className="p-4">{children}</div> : null
}

// Usage:
<Tabs defaultId="1">
  <Tabs.List>
    <Tabs.Tab id="1">Tab 1</Tabs.Tab>
    <Tabs.Tab id="2">Tab 2</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel id="1">Panel 1 Content</Tabs.Panel>
  <Tabs.Panel id="2">Panel 2 Content</Tabs.Panel>
</Tabs>`}
            lang="tsx"
          />
        </article>

        <article id="composition-render-props" className="scroll-mt-24">
          <h3 className="pattern-title">Render Props</h3>
          <p className="section-note">
            A component that takes a function returning a React element and
            calls it to render UI.
          </p>
          <CodeBlock
            code={`function Toggle({ children }: { children: (props: { on: boolean; toggle: () => void }) => React.ReactNode }) {
  const [on, setOn] = useState(false)
  return <>{children({ on, toggle: () => setOn(!on) })}</>
}

// Usage:
<Toggle>
  {({ on, toggle }) => (
    <button onClick={toggle}>
      The toggle is {on ? 'ON' : 'OFF'}
    </button>
  )}
</Toggle>`}
            lang="tsx"
          />
        </article>

        <article id="composition-forward-ref" className="scroll-mt-24">
          <h3 className="pattern-title">forwardRef + useImperativeHandle</h3>
          <p className="section-note">
            Expose a custom method from a child component to its parent.
          </p>
          <CodeBlock
            code={`import { forwardRef, useImperativeHandle, useRef } from 'react'

export interface FancyInputRef {
  focusAndSelect: () => void
  reset: () => void
}

const FancyInput = forwardRef<FancyInputRef, { placeholder?: string }>(
  ({ placeholder }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => ({
      focusAndSelect: () => {
        inputRef.current?.focus()
        inputRef.current?.select()
      },
      reset: () => {
        if (inputRef.current) inputRef.current.value = ''
      }
    }))

    return <input ref={inputRef} placeholder={placeholder} />
  }
)

// Usage:
const ref = useRef<FancyInputRef>(null)
// ref.current?.focusAndSelect()`}
            lang="tsx"
          />
        </article>

        <article id="composition-polymorphic" className="scroll-mt-24">
          <h3 className="pattern-title">Polymorphic "as" prop</h3>
          <p className="section-note">
            A component that can render as any HTML element while preserving
            valid HTML attributes for that element.
          </p>
          <CodeBlock
            code={`import { ElementType, ComponentPropsWithoutRef } from 'react'

type TextProps<T extends ElementType> = {
  as?: T
  className?: string
  children: React.ReactNode
} & ComponentPropsWithoutRef<T>

function Text<C extends ElementType = 'span'>({
  as,
  className,
  children,
  ...rest
}: TextProps<C>) {
  const Component = as || 'span'
  return (
    <Component className={className} {...rest}>
      {children}
    </Component>
  )
}

// Usage:
<Text as="h1" className="text-4xl" id="title">Heading</Text>
<Text as="a" href="/home">Link</Text>`}
            lang="tsx"
          />
        </article>
      </div>
    </section>
  )
}
