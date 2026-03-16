import { CodeBlock } from '../ui/CodeBlock'
import { FileTree } from '../ui/FileTree'
import type { TreeNodeType } from '../ui/FileTree'

const appRoutesTree: TreeNodeType[] = [
  {
    name: 'app/',
    children: [
      {
        name: 'routes/',
        children: [
          {
            name: '__root.tsx',
            comment: '# root layout, wraps entire app, place <Outlet /> here',
          },
          { name: 'index.tsx', comment: '# / route' },
          { name: 'about.tsx', comment: '# /about route' },
          {
            name: '_layout.tsx',
            comment: '# pathless layout route (no URL segment)',
          },
          {
            name: '_layout/',
            children: [
              {
                name: 'dashboard.tsx',
                comment: '# /dashboard, nested under _layout',
              },
              {
                name: 'settings.tsx',
                comment: '# /settings, nested under _layout',
              },
            ],
          },
          {
            name: 'blog/',
            children: [
              { name: 'index.tsx', comment: '# /blog' },
              { name: '$slug.tsx', comment: '# /blog/:slug — dynamic param' },
            ],
          },
          {
            name: '(auth)/',
            comment: '# route group convention',
            children: [{ name: 'login.tsx' }, { name: 'register.tsx' }],
          },
          {
            name: 'api/',
            children: [
              { name: 'webhook.ts', comment: '# server function endpoint' },
            ],
          },
        ],
      },
    ],
  },
]

const projectTree: TreeNodeType[] = [
  {
    name: 'src/',
    children: [
      {
        name: 'app/',
        children: [
          { name: 'routes/', comment: '# TanStack Start file-based routes' },
          {
            name: 'router.tsx',
            comment: '# createRouter() — registers all routes',
          },
          {
            name: 'routeTree.gen.ts',
            comment: '# auto-generated, do not edit',
          },
          { name: 'client.tsx', comment: '# client entry point' },
        ],
      },
      {
        name: 'components/',
        children: [
          {
            name: 'ui/',
            comment:
              '# primitives: Button, Input, Badge, Card — no data fetching, no server imports',
          },
          {
            name: 'features/',
            comment:
              '# domain components: PostCard, UserNav — can be server or client',
          },
        ],
      },
      {
        name: 'lib/',
        children: [
          { name: 'db.ts', comment: '# Prisma / Drizzle client singleton' },
          { name: 'auth.ts', comment: '# auth config / session helpers' },
          { name: 'query-client.ts', comment: '# TanStack Query client setup' },
          { name: 'utils.ts', comment: '# cn(), formatDate(), etc.' },
        ],
      },
      {
        name: 'server/',
        children: [
          {
            name: 'queries/',
            comment: '# pure async DB-read functions, called from loaders',
            children: [{ name: 'posts.ts' }, { name: 'users.ts' }],
          },
          {
            name: 'actions/',
            comment: '# createServerFn() mutations — write operations',
            children: [{ name: 'posts.ts' }, { name: 'users.ts' }],
          },
        ],
      },
      { name: 'hooks/', comment: '# custom client-side hooks' },
      { name: 'types/', comment: '# shared TypeScript interfaces' },
      { name: 'middleware.ts', comment: '# TanStack Start middleware' },
    ],
  },
]

export function SectionTanstackRouting() {
  return (
    <section id="tanstack-routing" className="scroll-mt-24 mb-16">
      <h2 className="text-2xl font-bold tracking-tight mb-6 pb-2 border-b border-[#e5e5e5]">
        3. TanStack Start Routing
      </h2>

      <div className="space-y-12">
        <article>
          <h3 className="text-lg font-semibold tracking-tight mb-4">
            File-Based Routing
          </h3>
          <p className="text-sm text-[#888] mb-4">
            Routes are automatically generated from files inside the{' '}
            <code className="bg-[#f5f5f5] px-1 py-0.5 rounded text-black text-xs">
              app/routes/
            </code>{' '}
            directory.
          </p>
          <FileTree data={appRoutesTree} />
        </article>

        <article>
          <h3 className="text-lg font-semibold tracking-tight mb-4">
            Project Structure
          </h3>
          <p className="text-sm text-[#888] mb-4">
            Opinionated conventions outside of the routes directory.
          </p>
          <FileTree data={projectTree} />

          <ul className="mt-6 space-y-3 text-sm text-[#888]">
            <li>
              <strong className="text-black">server/queries/</strong> — Pure
              async functions that call the DB directly. Only called inside
              route{' '}
              <code className="bg-[#f5f5f5] px-1 py-0.5 rounded text-black text-[11px]">
                loader
              </code>
              s or{' '}
              <code className="bg-[#f5f5f5] px-1 py-0.5 rounded text-black text-[11px]">
                createServerFn
              </code>
              . Never imported in client components.
            </li>
            <li>
              <strong className="text-black">server/actions/</strong> —{' '}
              <code className="bg-[#f5f5f5] px-1 py-0.5 rounded text-black text-[11px]">
                createServerFn()
              </code>{' '}
              mutations. Write operations only. Can be called from client
              components.
            </li>
            <li>
              <strong className="text-black">components/ui/</strong> — Zero data
              fetching, zero server imports. Pure presentational primitives.
              Accept all data via props.
            </li>
            <li>
              <strong className="text-black">components/features/</strong> — Own
              a domain concept. Can fetch data via{' '}
              <code className="bg-[#f5f5f5] px-1 py-0.5 rounded text-black text-[11px]">
                useQuery
              </code>{' '}
              on the client or receive loader data via{' '}
              <code className="bg-[#f5f5f5] px-1 py-0.5 rounded text-black text-[11px]">
                useLoaderData
              </code>
              .
            </li>
          </ul>
        </article>

        <article className="space-y-8">
          <div>
            <h4 className="text-md font-bold mb-2">1. createFileRoute</h4>
            <CodeBlock
              code={`import { createFileRoute } from '@tanstack/react-router'\n\nexport const Route = createFileRoute('/about')({\n  component: () => <div>About Page</div>\n})`}
              lang="tsx"
            />
          </div>

          <div>
            <h4 className="text-md font-bold mb-2">2. Loaders</h4>
            <CodeBlock
              code={`import { createFileRoute } from '@tanstack/react-router'\nimport { getPosts } from '~/server/queries/posts'\n\nexport const Route = createFileRoute('/blog/')({\n  loader: async ({ request }) => {\n    const posts = await getPosts()\n    return { posts }\n  },\n  component: function BlogRoute() {\n    const { posts } = Route.useLoaderData()\n    return <div>{posts.length} posts</div>\n  }\n})`}
              lang="tsx"
            />
          </div>

          <div>
            <h4 className="text-md font-bold mb-2">3. Dynamic Params</h4>
            <CodeBlock
              code={`export const Route = createFileRoute('/blog/$slug')({\n  loader: async ({ params }) => {\n    return await getPostBySlug(params.slug)\n  },\n  component: function BlogPost() {\n    const params = Route.useParams()\n    return <div>Slug: {params.slug}</div>\n  }\n})`}
              lang="tsx"
            />
          </div>

          <div>
            <h4 className="text-md font-bold mb-2">4. Search Params</h4>
            <CodeBlock
              code={`import { z } from 'zod'\n\nconst searchSchema = z.object({\n  page: z.number().catch(1),\n  sortBy: z.enum(['asc', 'desc']).catch('desc')\n})\n\nexport const Route = createFileRoute('/search')({\n  validateSearch: searchSchema,\n  component: function Search() {\n    const { page, sortBy } = Route.useSearch()\n    return (\n      <Link to="/search" search={{ page: page + 1, sortBy }}>Next</Link>\n    )\n  }\n})`}
              lang="tsx"
            />
          </div>

          <div>
            <h4 className="text-md font-bold mb-2">5. createServerFn</h4>
            <CodeBlock
              code={`import { createServerFn } from '@tanstack/start'\n\nconst updateUser = createServerFn({ method: 'POST' })\n  .validator((d: { id: string; name: string }) => d)\n  .handler(async ({ data }) => {\n    await db.user.update(data)\n    return { success: true }\n  })\n\n// In a component:\n<button onClick={() => updateUser({ data: { id: '1', name: 'Al' } })}>\n  Update\n</button>`}
              lang="tsx"
            />
          </div>

          <div>
            <h4 className="text-md font-bold mb-2">
              6. Layouts and nested routes
            </h4>
            <CodeBlock
              code={`// app/routes/__root.tsx\nexport const Route = createRootRoute({\n  component: () => (\n    <div className="layout">\n      <Header />\n      <Outlet />\n    </div>\n  )\n})\n\n// app/routes/_layout.tsx\nexport const Route = createFileRoute('/_layout')({\n  component: () => <div className="sub-layout"><Outlet /></div>\n})`}
              lang="tsx"
            />
          </div>

          <div>
            <h4 className="text-md font-bold mb-2">
              7. Pending / Loading states
            </h4>
            <CodeBlock
              code={`export const Route = createFileRoute('/dashboard')({\n  pendingComponent: () => <Spinner />,\n  component: Dashboard,\n})\n\n// Or manually inside a component:\nconst { state } = useRouterState()\nconst isNavigating = state.location !== state.resolvedLocation`}
              lang="tsx"
            />
          </div>

          <div>
            <h4 className="text-md font-bold mb-2">8. Head / Metadata</h4>
            <CodeBlock
              code={`export const Route = createFileRoute('/post/$id')({\n  head: ({ loaderData }) => ({\n    meta: [\n      { title: \`Post | \${loaderData?.title || ''}\` },\n      { name: 'description', content: loaderData?.excerpt }\n    ]\n  })\n})`}
              lang="tsx"
            />
          </div>

          <div>
            <h4 className="text-md font-bold mb-2">9. Middleware</h4>
            <CodeBlock
              code={`import { createMiddleware } from '@tanstack/start'\n\nexport const authMiddleware = createMiddleware()\n  .server(async ({ next }) => {\n    const session = await getSession()\n    if (!session) throw redirect({ to: '/login' })\n    return next({ context: { user: session.user } })\n  })\n\nexport const Route = createFileRoute('/dashboard')({\n  beforeLoad: async ({ context }) => {\n    await authMiddleware()\n  }\n})`}
              lang="tsx"
            />
          </div>

          <div>
            <h4 className="text-md font-bold mb-2">
              10. TanStack Query + Loaders hybrid
            </h4>
            <CodeBlock
              code={`import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'\n\nconst postQueryOptions = (id: string) => queryOptions({\n  queryKey: ['post', id],\n  queryFn: () => fetchPost(id),\n})\n\nexport const Route = createFileRoute('/post/$id')({\n  loader: async ({ context: { queryClient }, params }) => {\n    // Prefetch on server/loader\n    await queryClient.ensureQueryData(postQueryOptions(params.id))\n  },\n  component: function Post() {\n    const { id } = Route.useParams()\n    // Hydrate & manage cache on client seamlessly\n    const { data } = useSuspenseQuery(postQueryOptions(id))\n    return <div>{data.title}</div>\n  }\n})`}
              lang="tsx"
            />
          </div>
        </article>
      </div>
    </section>
  )
}
