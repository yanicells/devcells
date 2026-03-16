import { useEffect, useState } from 'react'
import { createHighlighter, type Highlighter } from 'shiki'
import { cn } from '../../lib/utils'

let highlighterPromise: Promise<Highlighter> | null = null

export function CodeBlock({
  code,
  lang = 'tsx',
  filename,
  className,
}: {
  code: string
  lang?: string
  filename?: string
  className?: string
}) {
  const [html, setHtml] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function highlight() {
      if (!highlighterPromise) {
        highlighterPromise = createHighlighter({
          themes: ['github-dark'],
          langs: ['tsx', 'typescript', 'javascript', 'bash', 'json', 'css'],
        })
      }
      const highlighter = await highlighterPromise
      const result = highlighter.codeToHtml(code.trim(), {
        lang,
        theme: 'github-dark',
      })

      if (isMounted) {
        setHtml(result)
      }
    }

    highlight()
    return () => {
      isMounted = false
    }
  }, [code, lang])

  const copy = () => {
    navigator.clipboard.writeText(code.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        'relative mt-4 mb-6 rounded-lg overflow-hidden border border-gray-200 bg-[#0d1117] text-sm font-mono',
        className,
      )}
    >
      {(filename || lang) && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-gray-800 text-gray-400 text-xs">
          <span>{filename || lang}</span>
          <button
            onClick={copy}
            className="hover:text-white transition-colors flex items-center gap-1.5"
            aria-label="Copy code"
          >
            {copied ? (
              <>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      )}
      <div className="p-4 overflow-x-auto">
        {html ? (
          <div
            dangerouslySetInnerHTML={{ __html: html }}
            className="[&>pre]:!bg-transparent [&>pre]:!p-0"
          />
        ) : (
          <pre className="text-gray-400 animate-pulse bg-transparent p-0">
            {code.trim()}
          </pre>
        )}
      </div>
    </div>
  )
}
