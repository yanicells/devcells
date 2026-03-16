export type TreeNodeType = {
  name: string
  comment?: string
  children?: TreeNodeType[]
}

function TreeNode({
  node,
  depth = 0,
  isLast = false,
}: {
  node: TreeNodeType
  depth?: number
  isLast?: boolean
}) {
  const isDir = !!node.children
  return (
    <div className="relative text-sm font-mono flex flex-col pt-1">
      <div className="flex items-center gap-2 group">
        <div
          className="flex-none w-[1em] h-[1em] border-l-2 border-b-2 border-(--border) rounded-bl-sm opacity-80 relative -top-[0.2em]"
          style={{ visibility: depth === 0 ? 'hidden' : 'visible' }}
        />
        <div className="flex items-center gap-2 flex-1">
          {isDir ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-(--text-muted) group-hover:text-(--text-primary)"
            >
              <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-(--text-faint)"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          )}
          <span
            className={
              isDir
                ? 'font-semibold text-(--text-primary)'
                : 'text-(--code-text)'
            }
          >
            {node.name}
          </span>
          {node.comment && (
            <span className="text-(--text-muted) text-xs hidden sm:inline-block pl-2 truncate">
              {node.comment}
            </span>
          )}
        </div>
      </div>
      {node.children && (
        <div className="pl-4 relative">
          {!isLast && (
            <div className="absolute left-[15px] top-0 bottom-0 border-l border-(--border-subtle)" />
          )}
          <div className="flex flex-col border-l border-(--border-subtle) ml-1.5 pl-3">
            {node.children.map((child, i) => (
              <TreeNode
                key={child.name}
                node={child}
                depth={depth + 1}
                isLast={i === node.children!.length - 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function FileTree({
  data,
  className,
}: {
  data: TreeNodeType[]
  className?: string
}) {
  return (
    <div
      className={`bg-(--surface) border border-(--border) rounded-md p-4 overflow-x-auto ${className || ''}`}
    >
      {data.map((node, i) => (
        <TreeNode key={node.name} node={node} isLast={i === data.length - 1} />
      ))}
    </div>
  )
}
