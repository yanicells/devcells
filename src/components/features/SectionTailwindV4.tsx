import { CodeBlock } from '../ui/CodeBlock'

function DemoBlock({
  children,
  classes,
  title,
}: {
  children: React.ReactNode
  classes: string
  title?: string
}) {
  return (
    <div className="border border-[#e5e5e5] rounded-xl overflow-hidden mb-6">
      {title && (
        <div className="bg-[#f5f5f5] px-4 py-2 text-xs font-semibold tracking-wider text-[#888] uppercase border-b border-[#e5e5e5]">
          {title}
        </div>
      )}
      <div className="p-6 bg-white flex items-center justify-center relative min-h-[120px] bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="w-full">{children}</div>
      </div>
      <div className="bg-[#f5f5f5] text-xs font-mono px-4 py-3 border-t border-[#e5e5e5] flex justify-between items-center text-black">
        <span>{classes}</span>
      </div>
    </div>
  )
}

function Box({
  className = '',
  children,
  text = '',
}: {
  className?: string
  children?: React.ReactNode
  text?: string
}) {
  return (
    <div
      className={`bg-black text-white px-4 py-2 rounded shadow-sm text-sm font-semibold flex items-center justify-center ${className}`}
    >
      {text || children}
    </div>
  )
}

export function SectionTailwindV4() {
  return (
    <section id="tailwind-v4" className="scroll-mt-24 mb-16">
      <h2 className="text-2xl font-bold tracking-tight mb-6 pb-2 border-b border-[#e5e5e5]">
        5. Tailwind CSS v4
      </h2>

      <div className="space-y-12">
        <article>
          <h3 className="text-lg font-semibold tracking-tight mb-4">
            v3 → v4 Migration
          </h3>
          <p className="text-sm text-[#888] mb-4">
            No more `tailwind.config.js`. Everything is configured via CSS.
          </p>
          <CodeBlock
            code={`@import "tailwindcss";

@theme {
  --color-brand-blue: #007bff;
  --font-sans: 'Inter', sans-serif;
  --spacing-1: 0.25rem; /* overrides scale */
}

/* @layer base, components, utilities */
@layer utilities {
  .truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}`}
            lang="css"
          />
        </article>

        <article>
          <h3 className="text-lg font-semibold tracking-tight mb-4">
            Config & Tokens
          </h3>
          <p className="text-[#888] text-sm mb-4">
            The `cn()` utility for conditional classes & resolving conflicts
            using `tailwind-merge` + `clsx`.
          </p>
          <CodeBlock
            code={`import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`}
            lang="tsx"
          />

          <h4 className="text-md font-bold mt-8 mb-2">
            class-variance-authority (cva)
          </h4>
          <CodeBlock
            code={`import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      intent: {
        primary: 'bg-black text-white hover:bg-gray-800',
        secondary: 'bg-transparent border border-black text-black hover:bg-gray-100',
      },
      size: { sm: 'h-8 px-3 text-xs', md: 'h-10 px-4 py-2', lg: 'h-12 px-8' },
    },
    defaultVariants: { intent: 'primary', size: 'md' },
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {}

export function Button({ intent, size, className, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ intent, size, className }))} {...props} />
}`}
            lang="tsx"
          />
        </article>

        <article>
          <h3 className="text-lg font-semibold tracking-tight mb-4">
            Layout — Flexbox
          </h3>
          <DemoBlock
            classes="flex items-center justify-between"
            title="Horizontal Navbar"
          >
            <div className="flex items-center justify-between w-full bg-white p-4 rounded border border-gray-200 shadow-sm">
              <Box>Logo</Box>
              <Box className="bg-[#f5f5f5] text-black border border-gray-200">
                Links
              </Box>
            </div>
          </DemoBlock>

          <DemoBlock
            classes="flex items-center justify-center"
            title="Centered Content"
          >
            <div className="flex items-center justify-center w-full h-32 bg-white rounded border border-gray-200 shadow-sm">
              <Box>Center</Box>
            </div>
          </DemoBlock>

          <DemoBlock classes="flex flex-col gap-4" title="Vertical Stack">
            <div className="flex flex-col gap-4 w-1/2 mx-auto">
              <Box>Item 1</Box>
              <Box>Item 2</Box>
            </div>
          </DemoBlock>

          <DemoBlock classes="flex flex-wrap gap-2" title="Wrapping Pills/Tags">
            <div className="flex flex-wrap gap-2 max-w-[250px] bg-white p-4 rounded border border-gray-200">
              {[
                'React',
                'Next.js',
                'Vite',
                'TanStack Route',
                'Tailwind',
                'CSS',
              ].map((tag) => (
                <div
                  key={tag}
                  className="px-2 py-1 bg-[#f5f5f5] text-xs font-semibold rounded-full border border-gray-200"
                >
                  {tag}
                </div>
              ))}
            </div>
          </DemoBlock>

          <DemoBlock
            classes="flex items-center"
            title="Flex sizing (flex-1 vs flex-none)"
          >
            <div className="flex items-center border border-gray-200 rounded p-2 bg-white">
              <div className="flex-none w-16 bg-black text-white text-xs p-2 text-center rounded mr-2">
                none
              </div>
              <div className="flex-1 bg-black/10 border-2 border-black border-dashed text-black text-xs p-2 text-center rounded mr-2 truncate">
                1 (fills space)
              </div>
              <div className="flex-shrink-0 w-24 bg-black text-white text-xs p-2 text-center rounded">
                shrink-0
              </div>
            </div>
          </DemoBlock>

          <DemoBlock
            classes="flex items-center [&>*:last-child]:ml-auto"
            title="Push Last Item Right (ml-auto)"
          >
            <div className="flex items-center border border-gray-200 rounded p-4 bg-white gap-2">
              <Box className="bg-[#f5f5f5] text-black border border-gray-200">
                1
              </Box>
              <Box className="bg-[#f5f5f5] text-black border border-gray-200">
                2
              </Box>
              <Box className="ml-auto">ml-auto</Box>
            </div>
          </DemoBlock>
        </article>

        <article>
          <h3 className="text-lg font-semibold tracking-tight mb-4">
            Layout — CSS Grid
          </h3>
          <DemoBlock classes="grid grid-cols-12 gap-4" title="12-Column Grid">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-8 bg-black text-white text-center p-2 rounded text-xs font-mono">
                col-span-8
              </div>
              <div className="col-span-4 bg-[#f5f5f5] border-black border-2 border-dashed text-black text-center p-2 rounded text-xs font-mono">
                col-span-4
              </div>
            </div>
          </DemoBlock>

          <DemoBlock
            classes="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))]"
            title="Responsive Card Grid (No Breapoints)"
          >
            <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2">
              <Box className="h-20" />
              <Box className="h-20" />
              <Box className="h-20" />
            </div>
          </DemoBlock>

          <DemoBlock
            classes="grid grid-cols-[240px_1fr]"
            title="Sidebar + Main Layout"
          >
            <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[140px_1fr] gap-4 h-32">
              <div className="bg-[#f5f5f5] border border-gray-200 rounded p-2 text-xs font-bold flex items-center justify-center">
                Sidebar
              </div>
              <div className="bg-white border text-black border-black border-dashed rounded p-4 text-xs font-bold flex items-center justify-center">
                Main Content
              </div>
            </div>
          </DemoBlock>

          <DemoBlock
            classes="grid min-h-screen grid-rows-[auto_1fr_auto]"
            title="Holy Grail (Header, Main, Footer)"
          >
            <div className="grid grid-rows-[auto_1fr_auto] gap-2 h-44 w-full max-w-sm mx-auto border border-gray-200 rounded bg-white p-2">
              <div className="bg-black text-white p-2 text-center text-xs rounded">
                Header
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-2">
                <div className="bg-[#f5f5f5] p-2 text-center text-xs rounded">
                  Nav
                </div>
                <div className="bg-white border border-dashed border-black rounded flex items-center justify-center text-xs font-bold">
                  Main
                </div>
              </div>
              <div className="bg-[#888] text-white p-2 text-center text-xs rounded">
                Footer
              </div>
            </div>
          </DemoBlock>
        </article>

        <article>
          <h3 className="text-lg font-semibold tracking-tight mb-4">
            Spacing / Sizing Scale
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-4">
            {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40].map((s) => (
              <div key={s} className="flex flex-col items-center">
                <div
                  className="w-full bg-[#f5f5f5] border border-[#e5e5e5] rounded overflow-hidden flex items-end justify-center pb-0"
                  style={{ height: '120px' }}
                >
                  <div
                    className="bg-black w-1/2 rounded-t-sm"
                    style={{ height: `${s * 0.25}rem` }}
                  ></div>
                </div>
                <div className="mt-2 text-xs font-mono font-bold">{s}</div>
                <div className="text-[10px] text-[#888]">
                  {s * 4}px / {s * 0.25}rem
                </div>
              </div>
            ))}
          </div>
        </article>

        <article>
          <h3 className="text-lg font-semibold tracking-tight mb-4">
            Common Designs
          </h3>
          <ul className="space-y-4">
            <li className="p-4 border border-[#e5e5e5] rounded bg-white flex flex-col gap-2">
              <span className="font-bold text-sm">Sticky header</span>
              <code className="bg-[#f5f5f5] p-1.5 rounded font-mono text-xs">
                sticky top-0 z-50 bg-white border-b border-[#e5e5e5]
              </code>
            </li>
            <li className="p-4 border border-[#e5e5e5] rounded bg-white flex flex-col gap-2">
              <span className="font-bold text-sm">Centered page container</span>
              <code className="bg-[#f5f5f5] p-1.5 rounded font-mono text-xs">
                max-w-4xl mx-auto px-4
              </code>
            </li>
            <li className="p-4 border border-[#e5e5e5] rounded bg-white flex flex-col gap-2">
              <span className="font-bold text-sm">Card</span>
              <code className="bg-[#f5f5f5] p-1.5 rounded font-mono text-xs">
                rounded-lg border border-[#e5e5e5] bg-white p-6
              </code>
            </li>
            <li className="p-4 border border-[#e5e5e5] rounded bg-white flex flex-col gap-2">
              <span className="font-bold text-sm flex items-center justify-between">
                <span>Pill / Badge</span>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border border-[#e5e5e5] bg-[#f5f5f5] text-black">
                  Preview
                </span>
              </span>
              <code className="bg-[#f5f5f5] p-1.5 rounded font-mono text-xs">
                inline-flex items-center rounded-full px-2.5 py-0.5 text-xs
                font-medium
              </code>
            </li>
            <li className="p-4 border border-[#e5e5e5] rounded bg-white flex flex-col gap-2">
              <span className="font-bold text-sm">
                Overlay / modal backdrop
              </span>
              <code className="bg-[#f5f5f5] p-1.5 rounded font-mono text-xs">
                fixed inset-0 bg-black/50 flex items-center justify-center
              </code>
            </li>
            <li className="p-4 border border-[#e5e5e5] rounded bg-white flex flex-col gap-2">
              <span className="font-bold text-sm flex items-center gap-4">
                Truncated Text
                <span className="truncate w-16 text-xs text-[#888]">
                  Super long text that truncates
                </span>
              </span>
              <code className="bg-[#f5f5f5] p-1.5 rounded font-mono text-xs">
                truncate (1 line) OR line-clamp-2 (2 lines)
              </code>
            </li>
          </ul>
        </article>
      </div>
    </section>
  )
}
