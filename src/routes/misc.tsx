import { createFileRoute } from '@tanstack/react-router'
import { CodeBlock } from '../components/ui/CodeBlock'

export const Route = createFileRoute('/misc')({
  component: Misc,
})

function Misc() {
  return (
    <div className="flex flex-col min-h-screen docs-page">
      <header className="mb-16 mt-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-[-0.05em] mb-4 text-(--text-primary)">
          Misc.
        </h1>
        <p className="text-lg sm:text-xl text-(--text-muted) max-w-2xl leading-relaxed">
          One-liners, shell commands, and miscellaneous dev patterns that are
          easy to forget but essential out in the wild.
        </p>
      </header>

      <section id="misc-shell" className="mb-16 scroll-mt-24">
        <h2 className="section-title">
          Shell & File System
        </h2>

        <article className="scroll-mt-24 mb-12">
          <h3 className="pattern-title">
            Delete Windows Zone.Identifier files
          </h3>
          <p className="section-note">
            Cleans up WSL filesystem junk left by Windows after copying files
            into the Linux filesystem.
          </p>
          <CodeBlock
            code={`find . -name "*:Zone.Identifier" -type f -delete`}
            lang="bash"
          />
        </article>

        <article id="misc-wsl" className="scroll-mt-24 mb-12">
          <h3 className="pattern-title">
            WSL2 Tips for Web Dev
          </h3>
          <p className="section-note">
            Keep your code in{' '}
            <code className="inline-code">
              ~/
            </code>{' '}
            (e.g.{' '}
            <code className="inline-code">
              ~/projects/
            </code>
            ), NEVER in{' '}
            <code className="inline-code">
              /mnt/c/
            </code>
            . Cross-OS file I/O is extremely slow and will destroy node_modules
            performance. Access Windows from WSL via{' '}
            <code className="inline-code">
              \\\\wsl$
            </code>
            .
          </p>
        </article>
      </section>

      <section id="misc-git" className="mb-16 scroll-mt-24">
        <h2 className="section-title">
          Git
        </h2>

        <article className="scroll-mt-24 mb-12">
          <h3 className="pattern-title">
            Interactive Rebase (Squash/Fixup)
          </h3>
          <p className="section-note">
            Combine or edit the last{' '}
            <code className="inline-code">
              n
            </code>{' '}
            commits. Change{' '}
            <code className="inline-code">
              pick
            </code>{' '}
            to{' '}
            <code className="inline-code">
              squash
            </code>{' '}
            (or{' '}
            <code className="inline-code">
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
          <h3 className="pattern-title">
            Stash Pop vs. Apply
          </h3>
          <p className="section-note">
            <code className="inline-code">
              pop
            </code>{' '}
            applies the stash and removes it from the list.{' '}
            <code className="inline-code">
              apply
            </code>{' '}
            applies the stash but keeps it in the list (safer if you might need
            it again).
          </p>
        </article>

        <article className="scroll-mt-24 mb-12">
          <h3 className="pattern-title">
            Common Full-Stack .gitignore
          </h3>
          <p className="section-note">
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

      <section id="misc-pkg" className="mb-16 scroll-mt-24">
        <h2 className="section-title">
          Node & Package Managers
        </h2>

        <article className="scroll-mt-24 mb-12">
          <h3 className="pattern-title">
            npx vs pnpx vs bunx
          </h3>
          <p className="section-note">
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
          <h3 className="pattern-title">
            Essential package.json Scripts
          </h3>
          <p className="section-note">Common CI/CD scripts.</p>
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

      <section id="misc-typescript" className="mb-16 scroll-mt-24">
        <h2 className="section-title">
          TypeScript & Validation
        </h2>

        <article className="scroll-mt-24 mb-12">
          <h3 className="pattern-title">
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
          <h3 className="pattern-title">
            Zod Mastery
          </h3>
          <p className="section-note">
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
          <h3 className="pattern-title">
            Environment Variable Patterns
          </h3>
          <p className="section-note">
            <code className="inline-code">
              .env
            </code>{' '}
            is the base.{' '}
            <code className="inline-code">
              .env.local
            </code>{' '}
            overrides it locally (and is gitignored).{' '}
            <code className="inline-code">
              .env.production
            </code>{' '}
            is used in the build pipeline.
          </p>
        </article>
      </section>

      <footer className="mt-16 pt-8 pb-16 border-t border-(--border) text-sm text-(--text-muted)">
        <p>Built as a static TanStack Start single-page app.</p>
      </footer>
    </div>
  )
}
