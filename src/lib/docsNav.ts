export type NavPattern = {
  id: string
  title: string
}

export type NavSection = {
  id: string
  title: string
  patterns?: NavPattern[]
}

export type NavGroup = {
  id: string
  title: string
  sections?: NavSection[]
}

export type SearchEntry = {
  title: string
  path: string
  type: 'group' | 'section' | 'pattern' | 'page'
}

export const mainNavGroups: NavGroup[] = [
  {
    id: 'react',
    title: 'React',
    sections: [
      {
        id: 'everyday-react',
        title: 'Everyday React',
        patterns: [
          { id: 'react-use-state', title: 'useState' },
          { id: 'react-use-effect', title: 'useEffect' },
          { id: 'react-props-events', title: 'Props & Events' },
          { id: 'react-controlled-inputs', title: 'Controlled Inputs' },
          {
            id: 'react-conditional-rendering',
            title: 'Conditional Rendering',
          },
          { id: 'react-list-rendering', title: 'List Rendering' },
        ],
      },
      {
        id: 'data-side-effects',
        title: 'Data & Side Effects',
        patterns: [
          { id: 'data-use-reducer', title: 'useReducer' },
          { id: 'data-use-context', title: 'useContext' },
          { id: 'data-tanstack-query', title: 'TanStack Query' },
          { id: 'data-use-ref', title: 'useRef' },
          { id: 'data-use-memo-callback', title: 'useCallback / useMemo' },
          { id: 'data-custom-hooks', title: 'Custom Hooks' },
        ],
      },
      {
        id: 'composition-patterns',
        title: 'Composition Patterns',
        patterns: [
          { id: 'composition-compound', title: 'Compound Components' },
          { id: 'composition-render-props', title: 'Render Props' },
          { id: 'composition-forward-ref', title: 'forwardRef' },
          { id: 'composition-polymorphic', title: 'Polymorphic As Prop' },
        ],
      },
      {
        id: 'performance',
        title: 'Performance',
        patterns: [
          { id: 'perf-react-memo', title: 'React.memo' },
          { id: 'perf-lazy-suspense', title: 'lazy + Suspense' },
          { id: 'perf-start-transition', title: 'startTransition' },
          { id: 'perf-use-optimistic', title: 'useOptimistic' },
          { id: 'perf-use-deferred', title: 'useDeferredValue' },
          { id: 'perf-virtualization', title: 'Virtualization' },
        ],
      },
      {
        id: 'less-common',
        title: 'Less Common',
        patterns: [
          { id: 'less-error-boundaries', title: 'Error Boundaries' },
          { id: 'less-create-portal', title: 'createPortal' },
          { id: 'less-use-layout-effect', title: 'useLayoutEffect' },
          {
            id: 'less-context-reducer-store',
            title: 'Context + useReducer Store',
          },
          { id: 'less-use-id', title: 'useId' },
        ],
      },
    ],
  },
  {
    id: 'nextjs',
    title: 'Next.js',
    sections: [
      { id: 'next-file-structure', title: 'File Structure' },
      { id: 'next-server-components', title: 'Server Components' },
      { id: 'next-use-client-boundary', title: 'use client Boundary' },
      { id: 'next-server-actions', title: 'Server Actions' },
      { id: 'next-route-handlers', title: 'Route Handlers' },
      { id: 'next-metadata', title: 'Metadata' },
      { id: 'next-static-params', title: 'generateStaticParams' },
      { id: 'next-middleware', title: 'Middleware' },
      { id: 'next-layouts-loading', title: 'Layouts & Loading' },
      { id: 'next-parallel-routes', title: 'Parallel Routes' },
      { id: 'next-caching-overview', title: 'Caching Overview' },
      { id: 'next-image-font', title: 'next/image & next/font' },
    ],
  },
  {
    id: 'tanstack-start',
    title: 'TanStack Start',
    sections: [
      { id: 'tanstack-file-structure', title: 'File Structure' },
      { id: 'tanstack-create-file-route', title: 'createFileRoute' },
      { id: 'tanstack-loaders', title: 'Loaders' },
      { id: 'tanstack-dynamic-params', title: 'Dynamic Params' },
      { id: 'tanstack-search-params', title: 'Search Params' },
      { id: 'tanstack-create-server-fn', title: 'createServerFn' },
      {
        id: 'tanstack-layouts-nested',
        title: 'Layouts & Nested Routes',
      },
      { id: 'tanstack-pending-states', title: 'Pending States' },
      { id: 'tanstack-head-metadata', title: 'Head / Metadata' },
      { id: 'tanstack-middleware', title: 'Middleware' },
      { id: 'tanstack-query-loader-hybrid', title: 'Query + Loader Hybrid' },
    ],
  },
  {
    id: 'tailwind-css',
    title: 'Tailwind CSS',
    sections: [
      { id: 'tailwind-v4-changes', title: 'v3 -> v4 Changes' },
      { id: 'tailwind-theme-tokens', title: '@theme & Tokens' },
      { id: 'tailwind-cn-cva', title: 'cn() & cva()' },
      { id: 'tailwind-flexbox', title: 'Flexbox' },
      { id: 'tailwind-grid', title: 'Grid' },
      { id: 'tailwind-common-layouts', title: 'Common Layouts' },
      { id: 'tailwind-responsive-variants', title: 'Responsive Variants' },
      { id: 'tailwind-dark-mode', title: 'Dark Mode' },
      { id: 'tailwind-spacing-grid', title: 'Spacing Grid' },
    ],
  },
]

export const miscSections: NavSection[] = [
  { id: 'misc-shell', title: 'Shell / Terminal' },
  { id: 'misc-git', title: 'Git Workflows' },
  { id: 'misc-pkg', title: 'Package Tools' },
  { id: 'misc-typescript', title: 'TypeScript & Zod' },
  { id: 'misc-wsl', title: 'WSL2 Tips' },
]

export function flattenSearchEntries(): SearchEntry[] {
  const entries: SearchEntry[] = []

  for (const group of mainNavGroups) {
    entries.push({ title: group.title, path: '/', type: 'group' })

    for (const section of group.sections ?? []) {
      entries.push({
        title: section.title,
        path: `/#${section.id}`,
        type: 'section',
      })

      for (const pattern of section.patterns ?? []) {
        entries.push({
          title: `${section.title}: ${pattern.title}`,
          path: `/#${pattern.id}`,
          type: 'pattern',
        })
      }
    }
  }

  for (const item of miscSections) {
    entries.push({ title: item.title, path: `/misc#${item.id}`, type: 'pattern' })
  }

  entries.push({ title: 'Misc', path: '/misc', type: 'page' })

  return entries
}

export function sectionGroupMap(groups: NavGroup[]): Record<string, string> {
  const map: Record<string, string> = {}
  for (const group of groups) {
    for (const section of group.sections ?? []) {
      map[section.id] = group.id
      for (const pattern of section.patterns ?? []) {
        map[pattern.id] = group.id
      }
    }
  }
  return map
}
