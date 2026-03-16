import { createFileRoute } from '@tanstack/react-router'
import { SectionEverydayReact } from '../components/features/SectionEverydayReact'
import { SectionDataSideEffects } from '../components/features/SectionDataSideEffects'
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
    <div className="flex flex-col min-h-screen">
      <header className="mb-16 mt-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter mb-4 text-black">
          React + TanStack Start.
        </h1>
        <p className="text-lg sm:text-xl text-[#888] max-w-2xl leading-relaxed">
          The ultimate brutally minimal cheat sheet focusing on everyday
          patterns and the latest tools. Let typography do the heavy lifting.
        </p>
      </header>

      <div className="flex flex-col">
        <SectionEverydayReact />
        <SectionDataSideEffects />
        <SectionTanstackRouting />
        <SectionCompositionPatterns />
        <SectionTailwindV4 />
        <SectionPerformance />
        <SectionLessCommon />
      </div>

      <footer className="mt-16 pt-8 pb-16 border-t border-[#e5e5e5] text-sm text-[#888]">
        <p>Built as a static TanStack Start single-page app.</p>
      </footer>
    </div>
  )
}
