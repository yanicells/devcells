import { createFileRoute } from '@tanstack/react-router'
import { SectionEverydayReact } from '../components/features/SectionEverydayReact'
import { SectionDataSideEffects } from '../components/features/SectionDataSideEffects'
import { SectionNextJs } from '../components/features/SectionNextJs'
import { SectionTanstackRouting } from '../components/features/SectionTanstackRouting'
import { SectionCompositionPatterns } from '../components/features/SectionCompositionPatterns'
import { SectionTailwindV4 } from '../components/features/SectionTailwindV4'
import { SectionPerformance } from '../components/features/SectionPerformance'
import { SectionLessCommon } from '../components/features/SectionLessCommon'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="flex flex-col min-h-screen docs-page">
      <header className="mb-16 mt-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-[-0.05em] mb-4 text-(--text-primary)">
          React. Next.js. TanStack Start.
        </h1>
        <p className="text-lg sm:text-xl text-(--text-muted) max-w-2xl leading-relaxed">
          Direct, copyable patterns for modern React stacks, with a permanent
          editorial dark interface.
        </p>
      </header>

      <div className="flex flex-col">
        <SectionEverydayReact />
        <SectionDataSideEffects />
        <SectionNextJs />
        <SectionTanstackRouting />
        <SectionCompositionPatterns />
        <SectionTailwindV4 />
        <SectionPerformance />
        <SectionLessCommon />
      </div>

      <footer className="mt-16 pt-8 pb-16 border-t border-(--border) text-sm text-(--text-muted)">
        <p>Built as a static TanStack Start single-page app.</p>
      </footer>
    </div>
  )
}
