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
    <div className="border border-(--border) overflow-hidden mb-6">
      {title && (
        <div className="bg-(--surface) px-4 py-2 text-xs font-semibold tracking-wider text-(--text-muted) uppercase border-b border-(--border)">
          {title}
        </div>
      )}
      <div className="p-6 bg-(--surface-raised) flex items-center justify-center relative min-h-[120px]">
        <div className="w-full">{children}</div>
      </div>
      <div className="bg-(--surface) text-xs font-mono px-4 py-3 border-t border-(--border) flex justify-between items-center text-(--text-primary)">
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
      className={`bg-(--surface) border border-(--border) text-(--text-primary) px-4 py-2 text-sm font-semibold flex items-center justify-center ${className}`}
    >
      {text || children}
    </div>
  )
}

export function SectionTailwindV4() {
  return (
    <section id="tailwind-v4" className="scroll-mt-24 mb-16 docs-section">
      <h2 className="section-title">
        6. Tailwind CSS v4
      </h2>

      <div className="space-y-12">
        <article id="tailwind-v4-changes" className="scroll-mt-24">
          <h3 className="pattern-title">
            v3 → v4 Migration
          </h3>
          <p className="section-note">
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

        <article id="tailwind-theme-tokens" className="scroll-mt-24">
          <h3 className="pattern-title">
            Config & Tokens
          </h3>
          <p className="section-note">
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

          <h4 id="tailwind-cn-cva" className="pattern-title mt-8 mb-2 scroll-mt-24">
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

        <article id="tailwind-flexbox" className="scroll-mt-24">
          <h3 className="pattern-title">
            Layout — Flexbox
          </h3>
          <DemoBlock
            classes="flex items-center justify-between"
            title="Horizontal Navbar"
          >
            <div className="flex items-center justify-between w-full docs-demo-shell p-4">
              <Box>Logo</Box>
              <Box className="bg-(--surface-raised) text-(--text-primary)">
                Links
              </Box>
            </div>
          </DemoBlock>

          <DemoBlock
            classes="flex items-center justify-center"
            title="Centered Content"
          >
            <div className="flex items-center justify-center w-full h-32 docs-demo-shell">
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
            <div className="flex flex-wrap gap-2 max-w-[250px] docs-demo-shell p-4">
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
                  className="px-2 py-1 text-xs font-semibold border border-(--border) bg-(--surface) text-(--text-primary)"
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
            <div className="flex items-center border border-(--border) p-2 bg-(--surface-raised)">
              <div className="flex-none w-16 bg-(--surface) text-(--text-primary) text-xs p-2 text-center mr-2 border border-(--border)">
                none
              </div>
              <div className="flex-1 border border-(--accent) text-(--text-primary) text-xs p-2 text-center mr-2 truncate">
                1 (fills space)
              </div>
              <div className="flex-shrink-0 w-24 bg-(--surface) text-(--text-primary) text-xs p-2 text-center border border-(--border)">
                shrink-0
              </div>
            </div>
          </DemoBlock>

          <DemoBlock
            classes="flex items-center [&>*:last-child]:ml-auto"
            title="Push Last Item Right (ml-auto)"
          >
            <div className="flex items-center border border-(--border) p-4 bg-(--surface-raised) gap-2">
              <Box className="bg-(--surface-raised) text-(--text-primary)">
                1
              </Box>
              <Box className="bg-(--surface-raised) text-(--text-primary)">
                2
              </Box>
              <Box className="ml-auto">ml-auto</Box>
            </div>
          </DemoBlock>
        </article>

        <article id="tailwind-grid" className="scroll-mt-24">
          <h3 className="pattern-title">
            Layout — CSS Grid
          </h3>
          <DemoBlock classes="grid grid-cols-12 gap-4" title="12-Column Grid">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-8 bg-(--surface) border border-(--border) text-(--text-primary) text-center p-2 text-xs font-mono">
                col-span-8
              </div>
              <div className="col-span-4 bg-(--surface-raised) border border-(--accent) text-(--text-primary) text-center p-2 text-xs font-mono">
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
              <div className="bg-(--surface) border border-(--border) p-2 text-xs font-bold flex items-center justify-center text-(--text-primary)">
                Sidebar
              </div>
              <div className="bg-(--surface-raised) border border-(--accent) p-4 text-xs font-bold flex items-center justify-center text-(--text-primary)">
                Main Content
              </div>
            </div>
          </DemoBlock>

          <DemoBlock
            classes="grid min-h-screen grid-rows-[auto_1fr_auto]"
            title="Holy Grail (Header, Main, Footer)"
          >
            <div className="grid grid-rows-[auto_1fr_auto] gap-2 h-44 w-full max-w-sm mx-auto border border-(--border) bg-(--surface-raised) p-2">
              <div className="bg-(--surface) text-(--text-primary) p-2 text-center text-xs border border-(--border)">
                Header
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-2">
                <div className="bg-(--surface) p-2 text-center text-xs border border-(--border) text-(--text-primary)">
                  Nav
                </div>
                <div className="bg-(--surface-raised) border border-(--accent) flex items-center justify-center text-xs font-bold text-(--text-primary)">
                  Main
                </div>
              </div>
              <div className="bg-(--surface) text-(--text-primary) p-2 text-center text-xs border border-(--border)">
                Footer
              </div>
            </div>
          </DemoBlock>
        </article>

        <article id="tailwind-spacing-grid" className="scroll-mt-24">
          <h3 className="pattern-title">
            Spacing / Sizing Scale
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-4">
            {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64].map((s) => (
              <div key={s} className="flex flex-col items-center">
                <div
                  className="w-full bg-(--surface-raised) border border-(--border) overflow-hidden flex items-end justify-center pb-0"
                  style={{ height: '120px' }}
                >
                  <div
                    className="bg-[#2a2a2a] w-1/2"
                    style={{ height: `${s * 0.25}rem` }}
                  ></div>
                </div>
                <div className="mt-2 text-xs font-mono font-bold text-(--text-primary)">{s}</div>
                <div className="text-[10px] text-(--text-muted)">
                  {s * 4}px / {s * 0.25}rem
                </div>
              </div>
            ))}
          </div>
        </article>

        <article id="tailwind-common-layouts" className="scroll-mt-24">
          <h3 className="pattern-title">
            Common Designs
          </h3>
          <ul className="space-y-4">
            <li className="p-4 border border-(--border) bg-(--surface) flex flex-col gap-2">
              <span className="font-bold text-sm text-(--text-primary)">Sticky header</span>
              <code className="inline-code">
                sticky top-0 z-50 bg-white border-b border-[#e5e5e5]
              </code>
            </li>
            <li className="p-4 border border-(--border) bg-(--surface) flex flex-col gap-2">
              <span className="font-bold text-sm text-(--text-primary)">Centered page container</span>
              <code className="inline-code">
                max-w-4xl mx-auto px-4
              </code>
            </li>
            <li className="p-4 border border-(--border) bg-(--surface) flex flex-col gap-2">
              <span className="font-bold text-sm text-(--text-primary)">Card</span>
              <code className="inline-code">
                rounded-lg border border-[#e5e5e5] bg-white p-6
              </code>
            </li>
            <li className="p-4 border border-(--border) bg-(--surface) flex flex-col gap-2">
              <span className="font-bold text-sm flex items-center justify-between text-(--text-primary)">
                <span>Pill / Badge</span>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border border-(--border) bg-(--surface-raised) text-(--text-primary)">
                  Preview
                </span>
              </span>
              <code className="inline-code">
                inline-flex items-center rounded-full px-2.5 py-0.5 text-xs
                font-medium
              </code>
            </li>
            <li className="p-4 border border-(--border) bg-(--surface) flex flex-col gap-2">
              <span className="font-bold text-sm text-(--text-primary)">
                Overlay / modal backdrop
              </span>
              <code className="inline-code">
                fixed inset-0 bg-black/50 flex items-center justify-center
              </code>
            </li>
            <li className="p-4 border border-(--border) bg-(--surface) flex flex-col gap-2">
              <span className="font-bold text-sm flex items-center gap-4 text-(--text-primary)">
                Truncated Text
                <span className="truncate w-16 text-xs text-(--text-muted)">
                  Super long text that truncates
                </span>
              </span>
              <code className="inline-code">
                truncate (1 line) OR line-clamp-2 (2 lines)
              </code>
            </li>
          </ul>
        </article>

        <article id="tailwind-responsive-variants" className="scroll-mt-24">
          <h3 className="pattern-title">Responsive Variants</h3>
          <p className="section-note">
            Tailwind is mobile-first: base styles apply to mobile, then layer
            `sm:`, `md:`, `lg:`, and `xl:` for larger breakpoints.
          </p>
          <CodeBlock
            lang="tsx"
            code={`<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <aside className="hidden md:block">Sidebar</aside>
  <main className="col-span-1 md:col-span-1 lg:col-span-2">Content</main>
</div>`}
          />
        </article>

        <article id="tailwind-dark-mode" className="scroll-mt-24">
          <h3 className="pattern-title">Dark Mode Strategy</h3>
          <p className="section-note">
            Use class strategy with `.dark` when supporting both themes. For
            this project, dark mode is permanent and token-driven.
          </p>
          <CodeBlock
            lang="tsx"
            code={`<html className="dark">
  <body className="bg-white text-black dark:bg-black dark:text-white">
    <button className="border border-neutral-200 dark:border-neutral-800">
      Theme-aware button
    </button>
  </body>
</html>`}
          />
        </article>
      </div>
    </section>
  )
}
