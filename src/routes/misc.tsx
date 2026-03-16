import { createFileRoute } from '@tanstack/react-router'
import { CodeBlock } from '../components/ui/CodeBlock'

export const Route = createFileRoute('/misc')({
  component: Misc,
})

function Misc() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="mb-16 mt-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter mb-4 text-black">
          Misc Tools & Commands.
        </h1>
        <p className="text-lg sm:text-xl text-[#888] max-w-2xl leading-relaxed">
          One-liners, shell commands, and miscellaneous dev patterns that are
          easy to forget but essential out in the wild.
        </p>
      </header>

      <section className="mb-16">
        <h2 className="text-2xl font-bold tracking-tight mb-8 pb-2 border-b border-[#e5e5e5]">
          Shell & File System
        </h2>

        <article id="wsl-zone" className="scroll-mt-24 mb-12">
          <h3 className="text-lg font-semibold tracking-tight mb-2">
            Delete Windows Zone.Identifier files
          </h3>
          <p className="text-sm text-[#888] mb-4">
            Cleans up WSL filesystem junk left by Windows after copying files
            into the Linux filesystem.
          </p>
          <CodeBlock
            code={`find . -name "*:Zone.Identifier" -type f -delete`}
            lang="bash"
          />
        </article>

        <article className="scroll-mt-24 mb-12">
          <h3 className="text-lg font-semibold tracking-tight mb-2">
            WSL2 Tips for Web Dev
          </h3>
          <p className="text-sm text-[#888] mb-4">
            Keep your code in{' '}
            <code className="bg-[#f5f5f5] px-1 py-0.5 rounded text-black text-xs">
              ~/
            </code>{' '}
            (e.g.{' '}
            <code className="bg-[#f5f5f5] px-1 py-0.5 rounded text-black text-xs">
              ~/projects/
            </code>
            ), NEVER in{' '}
            <code className="bg-[#f5f5f5] px-1 py-0.5 rounded text-black text-xs">
              /mnt/c/
            </code>
            . Cross-OS file I/O is extremely slow and will destroy node_modules
            performance. Access Windows from WSL via{' '}
            <code className="bg-[#f5f5f5] px-1 py-0.5 rounded text-black text-xs">
              \\\\wsl$
            </code>
            .
          </p>
        </article>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold tracking-tight mb-8 pb-2 border-b border-[#e5e5e5]">
          Git
        </h2>

        <article id="git" className="scroll-mt-24 mb-12">
          <h3 className="text-lg font-semibold tracking-tight mb-2">
            Interactive Rebase (Squash/Fixup)
          </h3>
          <p className="text-sm text-[#888] mb-4">
            Combine or edit the last{' '}
            <code className="bg-[#f5f5f5] px-1 py-0.5 rounded text-black text-xs">
              n
            </code>{' '}
            commits. Change{' '}
            <code className="bg-[#f5f5f5] px-1 py-0.5 rounded text-black text-xs">
              pick
            </code>{' '}
            to{' '}
            <code className="bg-[#f5f5f5] px-1 py-0.5 rounded text-black text-xs">
              squash
            </code>{' '}
            (or{' '}
            <code className="bg-[#f5f5f5] px-1 py-0.5 rounded text-black text-xs">
              s
            </code>
            ) in the editor.
          </p>
          <CodeBlock
            code={`git rebase -i HEAD~3

# The editor opens:
pick 1a2b3c First commit
s 4d5e6f Fix typo
s 7g8h9i Add missing prop`}
            lang="bash"
          />
        </article>

        <article className="scroll-mt-24 mb-12">
          <h3 className="text-lg font-semibold tracking-tight mb-2">
            Stash Pop vs. Apply
          </h3>
          <p className="text-sm text-[#888] mb-4">
            <code className="bg-[#f5f5f5] px-1 py-0.5 rounded text-black text-xs">
              pop
            </code>{' '}
            applies the stash and removes it from the list.{' '}
            <code className="bg-[#f5f5f5] px-1 py-0.5 rounded text-black text-xs">
              apply
            </code>{' '}
            applies the stash but keeps it in the list (safer if you might need
            it again).
          </p>
        </article>

        <article className="scroll-mt-24 mb-12">
          <h3 className="text-lg font-semibold tracking-tight mb-2">
            Common Full-Stack .gitignore
          </h3>
          <p className="text-sm text-[#888] mb-4">
            The essentials for JS/TS projects.
          </p>
          <CodeBlock
            code={`node_modules
.env
.env.local
.env.*.local
dist
build
/coverage
.vercel/
.DS_Store`}
            lang="bash"
          />
        </article>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold tracking-tight mb-8 pb-2 border-b border-[#e5e5e5]">
          Node & Package Managers
        </h2>

        <article className="scroll-mt-24 mb-12">
          <h3 className="text-lg font-semibold tracking-tight mb-2">
            npx vs pnpx vs bunx
          </h3>
          <p className="text-sm text-[#888] mb-4">
            Use the runner matching your package manager to execute binaries.
          </p>
          <CodeBlock
            code={`# npm
npx create-next-app@latest

# pnpm
pnpm dlx create-next-app@latest # dlx downloads without installing globally

# Bun (fastest startup)
bunx create-next-app@latest`}
            lang="bash"
          />
        </article>

        <article className="scroll-mt-24 mb-12">
          <h3 className="text-lg font-semibold tracking-tight mb-2">
            Essential package.json Scripts
          </h3>
          <p className="text-sm text-[#888] mb-4">Common CI/CD scripts.</p>
          <CodeBlock
            code={`"scripts": {
  "type-check": "tsc --noEmit",
  "lint": "eslint . --ext .ts,.tsx",
  "lint:fix": "eslint . --ext .ts,.tsx --fix",
  "format": "prettier --write \\"**/*.{ts,tsx,md}\\""
}`}
            lang="json"
          />
        </article>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold tracking-tight mb-8 pb-2 border-b border-[#e5e5e5]">
          TypeScript & Validation
        </h2>

        <article className="scroll-mt-24 mb-12">
          <h3 className="text-lg font-semibold tracking-tight mb-2">
            satisfies vs as const vs type vs interface
          </h3>
          <CodeBlock
            code={`// satisfies: checks shape without widening type
const routes = { home: '/' } satisfies Record<string, string>

// as const: freezes literal values
const roles = ['admin', 'user'] as const
type Role = typeof roles[number] // 'admin' | 'user'

// type: union types, mapped types, primitives
type Status = 'loading' | 'error'

// interface: OOP patterns, extensible object shapes
interface User { id: string }
interface Admin extends User { level: number }`}
            lang="tsx"
          />
        </article>

        <article className="scroll-mt-24 mb-12">
          <h3 className="text-lg font-semibold tracking-tight mb-2">
            Zod Mastery
          </h3>
          <p className="text-sm text-[#888] mb-4">
            Schema definition, extraction, and safe parsing.
          </p>
          <CodeBlock
            code={`import { z } from 'zod'

const userSchema = z.object({
  email: z.string().email(),
  age: z.number().min(18).optional()
})

// Extract the TS type
type UserPayload = z.infer<typeof userSchema>

// safeParse avoids throwing errors
const result = userSchema.safeParse(req.body)
if (!result.success) {
  return Response.json(result.error.flatten())
}
const user = result.data`}
            lang="tsx"
          />
        </article>

        <article className="scroll-mt-24 mb-12">
          <h3 className="text-lg font-semibold tracking-tight mb-2">
            Environment Variable Patterns
          </h3>
          <p className="text-sm text-[#888] mb-4">
            <code className="bg-[#f5f5f5] px-1 py-0.5 rounded text-black text-xs">
              .env
            </code>{' '}
            is the base.{' '}
            <code className="bg-[#f5f5f5] px-1 py-0.5 rounded text-black text-xs">
              .env.local
            </code>{' '}
            overrides it locally (and is gitignored).{' '}
            <code className="bg-[#f5f5f5] px-1 py-0.5 rounded text-black text-xs">
              .env.production
            </code>{' '}
            is used in the build pipeline.
          </p>
        </article>
      </section>

      <footer className="mt-16 pt-8 pb-16 border-t border-[#e5e5e5] text-sm text-[#888]">
        <p>Built as a static TanStack Start single-page app.</p>
      </footer>
    </div>
  )
}
