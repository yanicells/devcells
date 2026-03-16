import { CodeBlock } from '../ui/CodeBlock'
import { FileTree } from '../ui/FileTree'
import type { TreeNodeType } from '../ui/FileTree'
import { Gotcha } from '../ui/Gotcha'

const nextAppTree: TreeNodeType[] = [
  {
    name: 'app/',
    children: [
      {
        name: 'layout.tsx',
        comment: '# root layout, place <html> and <body> here',
      },
      { name: 'page.tsx', comment: '# / route' },
      { name: 'loading.tsx', comment: '# Suspense fallback while route loads' },
      {
        name: 'error.tsx',
        comment: "# error boundary (must be 'use client')",
      },
      { name: 'not-found.tsx', comment: '# shown by notFound()' },
      { name: 'globals.css' },
      {
        name: '(auth)/',
        comment: '# route group, no URL segment',
        children: [{ name: 'login/page.tsx' }, { name: 'register/page.tsx' }],
      },
      {
        name: 'dashboard/',
        children: [
          {
            name: 'layout.tsx',
            comment: '# nested layout for dashboard pages',
          },
          { name: 'page.tsx' },
          {
            name: '@analytics/',
            comment: '# parallel route slot',
            children: [{ name: 'page.tsx' }],
          },
        ],
      },
      {
        name: 'blog/',
        children: [
          {
            name: '[slug]/',
            children: [{ name: 'page.tsx' }, { name: 'opengraph-image.tsx' }],
          },
        ],
      },
      {
        name: 'api/',
        children: [
          {
            name: 'webhook/',
            children: [{ name: 'route.ts' }],
          },
        ],
      },
    ],
  },
]

const nextProjectTree: TreeNodeType[] = [
  {
    name: 'src/',
    children: [
      { name: 'app/', comment: '# Next.js routes only' },
      {
        name: 'components/',
        children: [
          { name: 'ui/', comment: '# presentational primitives only' },
          {
            name: 'features/',
            comment: '# domain components, can be server or client',
          },
        ],
      },
      {
        name: 'lib/',
        children: [
          { name: 'db.ts', comment: '# Prisma/Drizzle singleton' },
          { name: 'auth.ts', comment: '# auth/session helpers' },
          { name: 'utils.ts', comment: '# cn(), formatDate()' },
        ],
      },
      {
        name: 'server/',
        children: [
          {
            name: 'queries/',
            comment: '# DB reads, server-only',
            children: [{ name: 'posts.ts' }],
          },
          {
            name: 'actions/',
            comment: "# 'use server' mutations + revalidatePath()",
            children: [{ name: 'posts.ts' }],
          },
        ],
      },
      { name: 'hooks/', comment: '# custom client hooks' },
      { name: 'types/', comment: '# shared TS types' },
      { name: 'middleware.ts', comment: '# auth guards / redirects' },
    ],
  },
]

function NextCachingDiagram() {
  return (
    <div className="border border-(--border) bg-(--surface) p-4 overflow-x-auto">
      <svg
        viewBox="0 0 900 120"
        width="100%"
        height="120"
        className="min-w-[760px]"
      >
        <defs>
          <marker
            id="next-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0 0L10 5L0 10z" fill="var(--text-primary)" />
          </marker>
        </defs>

        {[
          { x: 10, label: 'Request Memoization' },
          { x: 230, label: 'Data Cache' },
          { x: 420, label: 'Full Route Cache' },
          { x: 640, label: 'Router Cache' },
        ].map((item) => (
          <g key={item.label}>
            <rect
              x={item.x}
              y="30"
              width="190"
              height="56"
              fill="none"
              stroke="var(--border)"
              strokeWidth="1.5"
            />
            <text
              x={item.x + 95}
              y="64"
              textAnchor="middle"
              fill="var(--text-primary)"
              fontSize="12"
              fontFamily="var(--font-mono)"
            >
              {item.label}
            </text>
          </g>
        ))}

        <path
          d="M200 58 L226 58"
          stroke="var(--text-primary)"
          strokeWidth="1.5"
          markerEnd="url(#next-arrow)"
        />
        <path
          d="M390 58 L416 58"
          stroke="var(--text-primary)"
          strokeWidth="1.5"
          markerEnd="url(#next-arrow)"
        />
        <path
          d="M610 58 L636 58"
          stroke="var(--text-primary)"
          strokeWidth="1.5"
          markerEnd="url(#next-arrow)"
        />
      </svg>
    </div>
  )
}

function ParallelRoutesDiagram() {
  return (
    <div className="border border-(--border) bg-(--surface) p-4 grid gap-4 md:grid-cols-2">
      <div className="border border-(--border) p-3">
        <p className="text-[11px] tracking-[0.11em] uppercase text-(--text-muted) mb-2">
          Parallel Slots
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono text-(--text-primary)">
          <div className="border border-(--border) p-2">dashboard/page.tsx</div>
          <div className="border border-(--border) p-2">
            @analytics/page.tsx
          </div>
        </div>
      </div>
      <div className="border border-(--border) p-3">
        <p className="text-[11px] tracking-[0.11em] uppercase text-(--text-muted) mb-2">
          Intercepting
        </p>
        <div className="text-xs font-mono text-(--text-primary) space-y-2">
          <div className="border border-(--border) p-2">
            (..)photo/[id]/page.tsx
          </div>
          <p className="text-(--text-muted) text-[11px] leading-5">
            Render a route from a different segment as a modal while keeping the
            current layout context.
          </p>
        </div>
      </div>
    </div>
  )
}

export function SectionNextJs() {
  return (
    <section id="nextjs" className="scroll-mt-24 mb-16 docs-section">
      <h2 className="section-title">3. Next.js</h2>

      <div className="space-y-10">
        <article id="next-file-structure" className="scroll-mt-24">
          <h3 className="pattern-title">File Structure</h3>
          <p className="section-note">
            Next.js App Router directory conventions.
          </p>
          <FileTree data={nextAppTree} />
          <div className="mt-4" />
          <FileTree data={nextProjectTree} />
        </article>

        <article id="next-server-components" className="scroll-mt-24">
          <h3 className="pattern-title">Server Components</h3>
          <p className="section-note">
            Use async server components for data reads to avoid client
            waterfalls.
          </p>
          <CodeBlock
            lang="tsx"
            code={`import { db } from '@/lib/db'

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await db.post.findUnique({ where: { slug: params.slug } })
  if (!post) return <p>Not found</p>

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  )
}`}
          />
        </article>

        <article id="next-use-client-boundary" className="scroll-mt-24">
          <h3 className="pattern-title">use client Boundary</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-(--border) bg-(--surface) p-3">
              <p className="text-[11px] tracking-[0.11em] uppercase text-(--text-muted) mb-2">
                Wrong
              </p>
              <CodeBlock
                lang="tsx"
                code={`'use client'

// Entire page is now client-rendered.
export default function DashboardPage() {
  return <Dashboard widgets={heavyServerData} />
}`}
              />
            </div>
            <div className="border border-(--border) bg-(--surface) p-3">
              <p className="text-[11px] tracking-[0.11em] uppercase text-(--text-muted) mb-2">
                Right
              </p>
              <CodeBlock
                lang="tsx"
                code={`// app/dashboard/page.tsx (Server Component)
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const data = await getDashboardData()
  return <DashboardClient initialData={data} />
}

// app/dashboard/DashboardClient.tsx
'use client'
export default function DashboardClient({ initialData }) {
  const [tab, setTab] = useState('overview')
  return <InteractiveDashboard data={initialData} tab={tab} onTab={setTab} />
}`}
              />
            </div>
          </div>
        </article>

        <article id="next-server-actions" className="scroll-mt-24">
          <h3 className="pattern-title">Server Actions</h3>
          <CodeBlock
            lang="tsx"
            code={`// src/server/actions/posts.ts
'use server'

import { revalidatePath } from 'next/cache'

export async function createPostAction(_: unknown, formData: FormData) {
  const title = String(formData.get('title') ?? '')
  await db.post.create({ data: { title } })
  revalidatePath('/dashboard/posts')
  return { ok: true }
}

// app/dashboard/posts/NewPostForm.tsx
'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { createPostAction } from '@/server/actions/posts'

function SubmitButton() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>{pending ? 'Saving...' : 'Create'}</button>
}

export function NewPostForm() {
  const [state, formAction] = useActionState(createPostAction, { ok: false })
  return (
    <form action={formAction}>
      <input name='title' />
      <SubmitButton />
      {state.ok ? <p>Saved.</p> : null}
    </form>
  )
}`}
          />
        </article>

        <article id="next-route-handlers" className="scroll-mt-24">
          <h3 className="pattern-title">Route Handlers</h3>
          <CodeBlock
            lang="tsx"
            code={`import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  return NextResponse.json({ id, ok: true })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  return NextResponse.json({ created: body }, { status: 201 })
}`}
          />
        </article>

        <article id="next-metadata" className="scroll-mt-24">
          <h3 className="pattern-title">Metadata</h3>
          <CodeBlock
            lang="tsx"
            code={`import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Docs',
  description: 'Reference docs',
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug)
  return {
    title: post.title,
    description: post.excerpt,
  }
}`}
          />
        </article>

        <article id="next-static-params" className="scroll-mt-24">
          <h3 className="pattern-title">generateStaticParams</h3>
          <CodeBlock
            lang="tsx"
            code={`export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  return <article>{post.title}</article>
}`}
          />
        </article>

        <article id="next-middleware" className="scroll-mt-24">
          <h3 className="pattern-title">Middleware</h3>
          <CodeBlock
            lang="tsx"
            code={`import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value
  const isProtected = request.nextUrl.pathname.startsWith('/dashboard')

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}`}
          />
        </article>

        <article id="next-layouts-loading" className="scroll-mt-24">
          <h3 className="pattern-title">Layouts + loading.tsx</h3>
          <CodeBlock
            lang="tsx"
            code={`// app/dashboard/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Sidebar />
      <main>{children}</main>
    </div>
  )
}

// app/dashboard/loading.tsx
export default function LoadingDashboard() {
  return <p>Loading dashboard...</p>
}`}
          />
        </article>

        <article id="next-parallel-routes" className="scroll-mt-24">
          <h3 className="pattern-title">Parallel + Intercepting Routes</h3>
          <p className="section-note">
            Use @slot for parallel regions and (..) to intercept another
            segment.
          </p>
          <ParallelRoutesDiagram />
          <CodeBlock
            lang="tsx"
            code={`// app/dashboard/layout.tsx
export default function Layout({
  children,
  analytics,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
}) {
  return (
    <div className='grid grid-cols-[1fr_320px] gap-6'>
      <section>{children}</section>
      <aside>{analytics}</aside>
    </div>
  )
}

// app/feed/(..)photo/[id]/page.tsx -> modal intercept from /photo/[id]`}
          />
        </article>

        <article id="next-caching-overview" className="scroll-mt-24">
          <h3 className="pattern-title">Next.js Caching Overview</h3>
          <NextCachingDiagram />
        </article>

        <article id="next-image-font" className="scroll-mt-24">
          <h3 className="pattern-title">next/image + next/font</h3>
          <CodeBlock
            lang="tsx"
            code={`import Image from 'next/image'
import { Geist } from 'next/font/google'
import localFont from 'next/font/local'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const mono = localFont({
  src: './fonts/DepartureMono-Regular.woff2',
  variable: '--font-departure-mono',
})

export default function Hero() {
  return (
    <div className={\`\${geist.variable} \${mono.variable}\`}>
      <Image
        src='/hero.jpg'
        alt='Hero image'
        width={1280}
        height={720}
        priority
      />

      <div className='relative h-72'>
        <Image
          src='/cover.jpg'
          alt='Cover'
          fill
          sizes='(max-width: 768px) 100vw, 50vw'
          placeholder='blur'
          blurDataURL='data:image/jpeg;base64,/9j/4AAQSk...'
        />
      </div>
    </div>
  )
}`}
          />
          <Gotcha>
            Marking every route file with 'use client' disables most server-side
            optimizations and inflates the browser bundle.
          </Gotcha>
        </article>
      </div>
    </section>
  )
}
