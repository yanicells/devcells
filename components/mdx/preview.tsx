"use client";

import { Children, isValidElement, useState, type ReactElement, type ReactNode } from "react";
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "@/components/ui/tabs";

type CodeChild = ReactElement<{ children?: ReactNode }>;

type PreviewProps = {
  children: ReactNode;
  code?: string;
};

export function Preview({ children, code }: PreviewProps) {
  // If a `code` element is passed as a child, treat that as the source.
  let source: ReactNode = code ?? null;
  let renderable: ReactNode = children;
  const arr = Children.toArray(children);
  const codeChild = arr.find(
    (c): c is CodeChild => isValidElement(c) && (c as ReactElement).type === "pre"
  );
  if (!source && codeChild) {
    source = codeChild;
    renderable = arr.filter((c) => c !== codeChild);
  }

  return (
    <PreviewClient renderable={renderable} source={source} />
  );
}

function PreviewClient({
  renderable,
  source,
}: {
  renderable: ReactNode;
  source: ReactNode;
}) {
  const [view, setView] = useState<"preview" | "code">("preview");
  return (
    <div className="my-5 overflow-hidden rounded-lg border border-border bg-bg-subtle">
      <div className="flex items-center justify-between border-b border-border bg-bg-muted px-3 py-2">
        <TabsRoot value={view} defaultValue="preview" onValueChange={(v) => setView(v as "preview" | "code")}>
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
        </TabsRoot>
      </div>
      {view === "preview" ? (
        <div className="flex min-h-[120px] items-center justify-center bg-bg p-6 text-fg">
          {renderable}
        </div>
      ) : (
        <div className="bg-bg p-0 [&>div]:my-0 [&_pre]:rounded-none [&_pre]:border-0">
          {typeof source === "string" ? (
            <pre className="overflow-x-auto p-4 font-mono text-xs">{source}</pre>
          ) : (
            source
          )}
        </div>
      )}
    </div>
  );
}
