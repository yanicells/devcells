import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { flattenSearchEntries } from '../../lib/docsNav'

const searchData = flattenSearchEntries()

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
      className="m-auto w-full max-w-lg border border-(--border) p-0 bg-(--surface) backdrop:bg-black/70 backdrop:backdrop-blur-sm open:animate-in open:fade-in-0 open:zoom-in-95 focus:outline-none"
      onClose={() => setQuery('')}
    >
      <div className="flex flex-col h-full max-h-[60vh] bg-(--surface)">
        <div className="flex items-center border-b border-(--border) px-4 py-3 gap-3">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-(--text-faint)"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search docs, patterns, and commands..."
            className="flex-1 bg-transparent text-sm text-(--text-primary) outline-none placeholder:text-(--text-faint)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={() => dialogRef.current?.close()}
            className="text-xs text-(--text-faint) bg-(--surface-raised) px-2 border border-(--border) py-0.5 hover:text-(--text-primary)"
          >
            ESC
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="text-center text-sm text-(--text-muted) py-8">
              No results found for "{query}"
            </div>
          ) : (
            <div className="flex flex-col">
              {filtered.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(item.path)}
                  className="flex flex-col text-left justify-center px-3 py-2.5 hover:bg-(--surface-raised) focus:bg-(--surface-raised) outline-none transition-colors"
                >
                  <span className="text-sm font-medium text-(--text-primary)">
                    {item.title}
                  </span>
                  <span className="text-xs text-(--text-muted) capitalize">
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
