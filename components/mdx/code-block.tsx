"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type PreProps = HTMLAttributes<HTMLPreElement> & {
  "data-language"?: string;
  raw?: string;
};

export function Pre({ className, children, raw: rawFromMdx, ...props }: PreProps) {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLPreElement>(null);
  const language =
    (props["data-language"] as string | undefined) ??
    extractLanguage(className) ??
    "";

  const onCopy = async () => {
    const text = rawFromMdx ?? ref.current?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1200);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <div className="group/code relative">
      {language && (
        <span className="pointer-events-none absolute left-3 top-2 z-10 select-none font-mono text-[10px] uppercase tracking-wide text-fg-subtle/70">
          {language}
        </span>
      )}
      <button
        type="button"
        onClick={onCopy}
        aria-label="Copy code"
        className={cn(
          "absolute right-2 top-2 z-10 inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-bg/80 text-fg-muted opacity-0 transition-all hover:bg-bg-muted hover:text-fg group-hover/code:opacity-100 focus-visible:opacity-100"
        )}
      >
        {copied ? <Check size={13} className="text-accent" /> : <Copy size={13} />}
      </button>
      <pre
        ref={ref}
        className={cn(language ? "pt-7" : "", className)}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}

export function Figure({
  children,
  ...props
}: HTMLAttributes<HTMLElement> & { children?: ReactNode }) {
  return <figure {...props}>{children}</figure>;
}

function extractLanguage(className?: string): string | null {
  if (!className) return null;
  const m = /language-(\w+)/.exec(className);
  return m ? m[1] : null;
}
