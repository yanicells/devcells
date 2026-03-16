import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

const searchData = [
  { title: 'Everyday React', path: '/#everyday-react', type: 'section' },
  {
    title: 'Data & Side Effects',
    path: '/#data-side-effects',
    type: 'section',
  },
  {
    title: 'TanStack Start Routing',
    path: '/#tanstack-routing',
    type: 'section',
  },
  {
    title: 'Composition Patterns',
    path: '/#composition-patterns',
    type: 'section',
  },
  { title: 'Tailwind CSS v4', path: '/#tailwind-v4', type: 'section' },
  { title: 'Performance', path: '/#performance', type: 'section' },
  { title: 'Less Common', path: '/#less-common', type: 'section' },
  { title: 'useState & useEffect', path: '/#everyday-react', type: 'pattern' },
  {
    title: 'useReducer, useContext, useRef',
    path: '/#data-side-effects',
    type: 'pattern',
  },
  { title: 'TanStack Query', path: '/#data-side-effects', type: 'pattern' },
  {
    title: 'TanStack Router Directory Tree',
    path: '/#tanstack-routing',
    type: 'pattern',
  },
  { title: 'Loaders and Actions', path: '/#tanstack-routing', type: 'pattern' },
  {
    title: 'Compound Components',
    path: '/#composition-patterns',
    type: 'pattern',
  },
  { title: 'Render Props', path: '/#composition-patterns', type: 'pattern' },
  { title: 'Flexbox & CSS Grid', path: '/#tailwind-v4', type: 'pattern' },
  { title: 'Migration v3 to v4', path: '/#tailwind-v4', type: 'pattern' },
  { title: 'React.memo, Suspense', path: '/#performance', type: 'pattern' },
  { title: 'Caching Flow', path: '/#performance', type: 'pattern' },
  { title: 'Misc Tools & Commands', path: '/misc', type: 'page' },
  {
    title: 'Windows WSL Zone Identifier',
    path: '/misc#wsl-zone',
    type: 'pattern',
  },
  { title: 'Git Stash & Rebase', path: '/misc#git', type: 'pattern' },
]

export function CommandPalette() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        dialogRef.current?.showModal()
        inputRef.current?.focus()
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (dialogRef.current && e.target === dialogRef.current) {
        dialogRef.current.close()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('click', handleClickOutside)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const filtered = searchData.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()),
  )

  const handleSelect = (path: string) => {
    dialogRef.current?.close()
    setQuery('')
    navigate({ to: path })
  }

  return (
    <dialog
      ref={dialogRef}
      className="m-auto w-full max-w-lg rounded-xl border border-[#e5e5e5] p-0 shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm open:animate-in open:fade-in-0 open:zoom-in-95 focus:outline-none"
      onClose={() => setQuery('')}
    >
      <div className="flex flex-col h-full max-h-[60vh] bg-white">
        <div className="flex items-center border-b border-[#e5e5e5] px-4 py-3 gap-3">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#888]"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search docs, patterns, and commands..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#888]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={() => dialogRef.current?.close()}
            className="text-xs text-[#888] bg-[#f5f5f5] px-2 border border-[#e5e5e5] py-0.5 rounded shadow-sm hover:focus:text-black"
          >
            ESC
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="text-center text-sm text-[#888] py-8">
              No results found for "{query}"
            </div>
          ) : (
            <div className="flex flex-col">
              {filtered.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(item.path)}
                  className="flex flex-col text-left justify-center rounded-md px-3 py-2.5 hover:bg-[#f5f5f5] focus:bg-[#f5f5f5] outline-none transition-colors"
                >
                  <span className="text-sm font-medium">{item.title}</span>
                  <span className="text-xs text-[#888] capitalize">
                    {item.type}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </dialog>
  )
}
