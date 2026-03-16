import { Link, useLocation } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

const sections = [
  { id: 'everyday-react', title: 'Everyday React' },
  { id: 'data-side-effects', title: 'Data & Side Effects' },
  { id: 'tanstack-routing', title: 'TanStack Start Routing' },
  { id: 'composition-patterns', title: 'Composition Patterns' },
  { id: 'tailwind-v4', title: 'Tailwind CSS v4' },
  { id: 'performance', title: 'Performance' },
  { id: 'less-common', title: 'Less Common' },
]

export function Sidebar() {
  const [activeId, setActiveId] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveId('')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -80% 0px' },
    )

    setTimeout(() => {
      sections.forEach((s) => {
        const el = document.getElementById(s.id)
        if (el) observer.observe(el)
      })
    }, 100)

    return () => observer.disconnect()
  }, [location.pathname])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-white border border-[#e5e5e5] rounded-md shadow-sm"
        aria-label="Open Menu"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-[#e5e5e5] p-6 flex flex-col gap-8 overflow-y-auto z-50 transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="flex items-center justify-between">
          <div className="font-bold text-lg tracking-tight flex items-center gap-2">
            <div className="w-4 h-4 bg-black rounded-sm" />
            Cheat Sheet
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-1.5 flex-1">
          <div className="text-xs font-semibold text-[#888] tracking-wider mb-2 mt-2">
            Sections
          </div>
          {sections.map((s) => (
            <a
              key={s.id}
              href={`/#${s.id}`}
              onClick={() => setIsOpen(false)}
              className={`text-sm px-3 py-1.5 rounded-md -mx-3 transition-colors ${
                activeId === s.id && location.pathname === '/'
                  ? 'font-medium bg-[#f5f5f5] text-black'
                  : 'text-[#888] hover:text-black hover:bg-[#f5f5f5]'
              }`}
            >
              {s.title}
            </a>
          ))}

          <div className="text-xs font-semibold text-[#888] tracking-wider mt-8 mb-2">
            Pages
          </div>
          <Link
            to="/misc"
            onClick={() => setIsOpen(false)}
            className={`text-sm px-3 py-1.5 rounded-md -mx-3 transition-colors ${
              location.pathname === '/misc'
                ? 'font-medium bg-[#f5f5f5] text-black'
                : 'text-[#888] hover:text-black hover:bg-[#f5f5f5]'
            }`}
          >
            Misc Tools
          </Link>
        </nav>

        <div className="text-xs text-[#888] border-t border-[#e5e5e5] pt-4 mt-auto">
          Press{' '}
          <kbd className="font-mono bg-[#f5f5f5] px-1 rounded border border-[#e5e5e5]">
            ⌘K
          </kbd>{' '}
          to search
        </div>
      </aside>
    </>
  )
}
