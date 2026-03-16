import { Link, useLocation } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { mainNavGroups, miscSections, sectionGroupMap } from '../../lib/docsNav'

const mainMap = sectionGroupMap(mainNavGroups)

function hrefFor(pathname: string, id: string) {
  return `${pathname === '/misc' ? '/misc' : '/'}#${id}`
}

export function Sidebar() {
  const [activeId, setActiveId] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [expandedGroup, setExpandedGroup] = useState('react')
  const location = useLocation()
  const isMisc = location.pathname === '/misc'

  useEffect(() => {
    const ids = isMisc
      ? miscSections.map((s) => s.id)
      : mainNavGroups.flatMap((g) => [
          ...(g.sections?.map((s) => s.id) ?? []),
          ...(g.sections?.flatMap((s) => s.patterns?.map((p) => p.id) ?? []) ??
            []),
        ])

    if (!ids.length) {
      setActiveId('')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        rootMargin: '-20% 0px -70% 0px',
        threshold: [0.1, 0.3, 0.6],
      },
    )

    setTimeout(() => {
      ids.forEach((id) => {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      })
    }, 100)

    return () => observer.disconnect()
  }, [isMisc])

  useEffect(() => {
    if (isMisc) {
      setExpandedGroup('misc')
      return
    }

    if (!activeId) {
      return
    }

    const groupId = mainMap[activeId]
    if (groupId) {
      setExpandedGroup(groupId)
    }
  }, [activeId, isMisc])

  useEffect(() => {
    if (!isMisc && expandedGroup === 'misc') {
      setExpandedGroup('react')
    }
  }, [expandedGroup, isMisc])

  const handleGroupToggle = (id: string) => {
    setExpandedGroup((prev) => (prev === id ? '' : id))
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-(--surface) border border-(--border) text-(--text-primary)"
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
          className="md:hidden fixed inset-0 bg-black/70 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-(--surface) border-r border-(--border) p-4 flex flex-col gap-4 overflow-y-auto z-50 transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="flex items-center justify-between border-b border-(--border-subtle) pb-3">
          <div className="font-bold text-lg tracking-tight flex items-center gap-2 text-(--text-primary)">
            <div className="w-4 h-4 border border-(--accent)" />
            Cheat Sheet
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-(--text-muted) hover:text-(--text-primary)"
          >
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
          {!isMisc &&
            mainNavGroups.map((group) => {
              const open = expandedGroup === group.id

              return (
                <div
                  key={group.id}
                  className="border-b border-(--border-subtle) pb-2"
                >
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-2 py-2 text-xs tracking-[0.14em] uppercase text-(--text-muted) hover:bg-(--surface-raised) transition-colors"
                    onClick={() => handleGroupToggle(group.id)}
                    aria-expanded={open}
                  >
                    <span>{group.title}</span>
                    <span className="text-[10px]">{open ? '-' : '+'}</span>
                  </button>

                  <div
                    className={`overflow-hidden transition-[max-height,opacity] duration-200 ${open ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    {(group.sections ?? []).map((section) => {
                      const isSectionActive = activeId === section.id
                      return (
                        <div key={section.id} className="mt-1">
                          <a
                            href={hrefFor(location.pathname, section.id)}
                            onClick={() => setIsOpen(false)}
                            className={`block px-2 py-1.5 text-sm border-l-2 transition-colors ${
                              isSectionActive
                                ? 'border-(--accent) text-(--text-primary)'
                                : 'border-transparent text-(--text-muted) hover:bg-(--surface-raised) hover:text-(--text-primary)'
                            }`}
                          >
                            {section.title}
                          </a>
                          {(section.patterns?.length ?? 0) > 0 && (
                            <div className="ml-3 border-l border-(--border-subtle)">
                              {section.patterns?.map((pattern) => {
                                const isPatternActive = activeId === pattern.id

                                return (
                                  <a
                                    key={pattern.id}
                                    href={hrefFor(
                                      location.pathname,
                                      pattern.id,
                                    )}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-2 py-1 text-xs tracking-[0.08em] uppercase border-l-2 transition-colors ${
                                      isPatternActive
                                        ? 'border-(--accent) text-(--text-primary)'
                                        : 'border-transparent text-(--text-faint) hover:bg-(--surface-raised) hover:text-(--text-muted)'
                                    }`}
                                  >
                                    {pattern.title}
                                  </a>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}

          {isMisc && (
            <div className="border-b border-(--border-subtle) pb-2">
              <button
                type="button"
                className="w-full flex items-center justify-between px-2 py-2 text-xs tracking-[0.14em] uppercase text-(--text-muted)"
                onClick={() => handleGroupToggle('misc')}
                aria-expanded={expandedGroup === 'misc'}
              >
                <span>Misc</span>
                <span className="text-[10px]">
                  {expandedGroup === 'misc' ? '-' : '+'}
                </span>
              </button>

              <div
                className={`overflow-hidden transition-[max-height,opacity] duration-200 ${expandedGroup === 'misc' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
              >
                {miscSections.map((item) => {
                  const isActive = activeId === item.id
                  return (
                    <a
                      key={item.id}
                      href={`/misc#${item.id}`}
                      onClick={() => setIsOpen(false)}
                      className={`block px-2 py-1.5 text-sm border-l-2 transition-colors ${
                        isActive
                          ? 'border-(--accent) text-(--text-primary)'
                          : 'border-transparent text-(--text-muted) hover:bg-(--surface-raised) hover:text-(--text-primary)'
                      }`}
                    >
                      {item.title}
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          <div className="mt-4 border-t border-(--border-subtle) pt-3">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={`block px-2 py-1.5 text-sm border-l-2 transition-colors ${
                location.pathname === '/'
                  ? 'border-(--accent) text-(--text-primary)'
                  : 'border-transparent text-(--text-muted) hover:bg-(--surface-raised) hover:text-(--text-primary)'
              }`}
            >
              Main Cheat Sheet
            </Link>
            <Link
              to="/misc"
              onClick={() => setIsOpen(false)}
              className={`block px-2 py-1.5 text-sm border-l-2 transition-colors ${
                location.pathname === '/misc'
                  ? 'border-(--accent) text-(--text-primary)'
                  : 'border-transparent text-(--text-muted) hover:bg-(--surface-raised) hover:text-(--text-primary)'
              }`}
            >
              Misc
            </Link>
          </div>
        </nav>

        <div className="text-xs text-(--text-faint) border-t border-(--border-subtle) pt-3 mt-auto">
          Press{' '}
          <kbd className="font-mono bg-(--surface-raised) px-1 border border-(--border)">
            ⌘K
          </kbd>{' '}
          to search
        </div>
      </aside>
    </>
  )
}
