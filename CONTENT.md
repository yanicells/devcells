# Yani's Web Dev Docs

Personal reference for the patterns I use most. Not a tutorial. If something here doesn't make sense, I probably already know it and just need the snippet.

Stack assumed throughout: TypeScript, React 19, Next.js 15+ (App Router), Tailwind v4, Postgres + Drizzle, shadcn/ui, pnpm.

---

# React + TypeScript

## Function components with typed props

The default. Use a `type` (not `interface`) unless you need extension.

```tsx filename="components/Button.tsx"
type ButtonProps = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
};

export function Button({ label, onClick, variant = "primary" }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={variant === "primary" ? "bg-black text-white" : "bg-zinc-200"}
    >
      {label}
    </button>
  );
}
```

<Callout type="note">
Skip `React.FC`. It implicitly adds `children` and makes generic components annoying. Type props directly.
</Callout>

## Children typing

```tsx
type CardProps = {
  title: string;
  children: React.ReactNode;
};

export function Card({ title, children }: CardProps) {
  return (
    <div className="rounded-lg border p-4">
      <h3>{title}</h3>
      {children}
    </div>
  );
}
```

`React.ReactNode` covers everything: strings, numbers, JSX, arrays, fragments, null. Use it 95% of the time.

## Event handlers

```tsx
function Form() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(e.currentTarget);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} />
      <button onClick={handleClick}>Go</button>
    </form>
  );
}
```

## useState with types

Inferred types are usually fine. Annotate when initial value is `null` or unions.

```tsx
const [count, setCount] = useState(0);                 // inferred: number
const [user, setUser] = useState<User | null>(null);   // annotate
const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
```

## useState with objects (complex state)

Always spread the previous state when updating one field. Forgetting this wipes the rest of the object.

```tsx
const [form, setForm] = useState({ name: "", email: "" });

// good
setForm((prev) => ({ ...prev, name: "Yani" }));

// bad — wipes email
setForm({ name: "Yani" });
```

## useEffect

Three patterns to remember:

```tsx
// runs after every render — almost never what you want
useEffect(() => {
  console.log("rendered");
});

// runs once on mount
useEffect(() => {
  console.log("mounted");
}, []);

// runs on mount and whenever `query` changes
useEffect(() => {
  fetchResults(query);
}, [query]);

// with cleanup
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
}, []);
```

<Callout type="gotcha">
Effects run after the browser paints. If you're computing derived state from props, do it inline during render — don't `useEffect` + `useState` to "sync" them.
</Callout>

## Derived state (don't useEffect this)

```tsx
// bad
const [fullName, setFullName] = useState("");
useEffect(() => {
  setFullName(`${first} ${last}`);
}, [first, last]);

// good
const fullName = `${first} ${last}`;
```

## Refs

```tsx
const inputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  inputRef.current?.focus();
}, []);

return <input ref={inputRef} />;
```

## useMemo and useCallback

Use sparingly. They cost too. Reach for them when:
- A computation is genuinely expensive
- You're passing a function to a memoized child and stability matters
- You're putting an object/array in a dep array

```tsx
const filtered = useMemo(
  () => items.filter((i) => i.name.includes(query)),
  [items, query],
);

const handleSelect = useCallback((id: string) => {
  setSelected(id);
}, []);
```

<Callout type="tip">
React 19's compiler memoizes automatically when the rules of React are followed. If you're on 19 + the compiler, you can mostly stop reaching for these manually.
</Callout>

## Conditional rendering

```tsx
{isLoading && <Spinner />}
{user ? <Dashboard /> : <Login />}
{items.length === 0 && <Empty />}
```

<Callout type="gotcha">
`{count && <Thing />}` renders `0` to the DOM when count is 0. Use `count > 0 && <Thing />` or convert to boolean: `{!!count && <Thing />}`.
</Callout>

## Lists with keys

Use a stable, unique ID. Index is fine only if the list never reorders, never filters, and items never get inserted in the middle (basically: a static list).

```tsx
{users.map((user) => (
  <UserCard key={user.id} user={user} />
))}
```

## Lifting state up

When two siblings need the same state, move it to the closest common parent and pass it down with a setter.

```tsx
function Parent() {
  const [filter, setFilter] = useState("");

  return (
    <>
      <SearchBar value={filter} onChange={setFilter} />
      <ResultsList filter={filter} />
    </>
  );
}
```

## Custom hooks

Extract any reusable stateful logic. Name must start with `use`.

```tsx filename="hooks/useDebounce.ts"
import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
```

```tsx
const debouncedQuery = useDebounce(query, 500);
```

## Context (when, and when not)

Use Context for things that are truly app-wide and rarely change: theme, auth user, locale. Don't use it for state that changes frequently — every consumer rerenders.

```tsx filename="contexts/ThemeContext.tsx"
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Theme = "light" | "dark";
type ThemeContextValue = {
  theme: Theme;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
```

<Callout type="gotcha">
Every child wrapped by a Provider rerenders when the value changes. For frequently-updating state, use Zustand or split the context into smaller providers.
</Callout>

## Zustand (when Context isn't enough)

Lighter than Redux, no provider needed, easier than Context for cross-component state.

```ts filename="stores/useCounter.ts"
import { create } from "zustand";

type CounterStore = {
  count: number;
  increment: () => void;
  reset: () => void;
};

export const useCounter = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}));
```

```tsx
// good — selector, only rerenders when count changes
const count = useCounter((s) => s.count);

// less optimal — rerenders on any store change
const { count } = useCounter();
```

<Callout type="tip">
Group stores by feature, not by data type. One store for cart, one for filters, one for auth — not one giant store.
</Callout>

## Forms with react-hook-form + Zod

The combo I always reach for. Schema once, validates both runtime and TypeScript.

```tsx filename="components/SignupForm.tsx"
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "At least 8 characters"),
});

type FormData = z.infer<typeof schema>;

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} placeholder="Email" />
      {errors.email && <p>{errors.email.message}</p>}

      <input {...register("password")} type="password" />
      {errors.password && <p>{errors.password.message}</p>}

      <button disabled={isSubmitting}>Sign up</button>
    </form>
  );
}
```

## Common utility types

```ts
// allow either string or React node
type Label = string | React.ReactNode;

// extract props from a component
type ButtonProps = React.ComponentProps<"button">;
type MyButtonProps = React.ComponentProps<typeof MyButton>;

// children type
type WithChildren = { children: React.ReactNode };

// optional callback
type OnChange = (value: string) => void;

// extending HTML element props
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};
```

## `as` prop / polymorphic components

For components that can render as different elements.

```tsx
type BoxProps<T extends React.ElementType> = {
  as?: T;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children">;

export function Box<T extends React.ElementType = "div">({
  as,
  children,
  ...rest
}: BoxProps<T>) {
  const Component = as || "div";
  return <Component {...rest}>{children}</Component>;
}

// usage
<Box as="section" className="p-4">Hello</Box>
<Box as="a" href="/x">Link</Box>
```

---

# Tailwind

## Spacing scale (the one thing to memorize)

Tailwind's spacing scale is `0.25rem` per unit. So `p-4` = `1rem` = `16px`.

```
p-1 = 4px    p-4 = 16px   p-8  = 32px
p-2 = 8px    p-5 = 20px   p-10 = 40px
p-3 = 12px   p-6 = 24px   p-12 = 48px
```

Same scale for `m-`, `gap-`, `space-x-`, `w-`, `h-`, etc.

## Flexbox basics

<Preview>
  <div className="flex gap-4">
    <div className="w-12 h-12 bg-zinc-700 rounded" />
    <div className="w-12 h-12 bg-zinc-700 rounded" />
    <div className="w-12 h-12 bg-zinc-700 rounded" />
  </div>
</Preview>

```tsx
<div className="flex gap-4">
  <div className="w-12 h-12 bg-zinc-700 rounded" />
  <div className="w-12 h-12 bg-zinc-700 rounded" />
  <div className="w-12 h-12 bg-zinc-700 rounded" />
</div>
```

## Centering everything

The pattern I use 100x a day. Center a thing horizontally and vertically.

<Preview>
  <div className="flex items-center justify-center h-32 bg-zinc-800 rounded-lg">
    <span className="text-white">Centered</span>
  </div>
</Preview>

```tsx
<div className="flex items-center justify-center h-32 bg-zinc-800 rounded-lg">
  <span className="text-white">Centered</span>
</div>
```

## Justify and align

`justify-*` controls the main axis. `items-*` controls the cross axis.

<Preview>
  <div className="space-y-2">
    <div className="flex justify-between bg-zinc-800 p-2 rounded">
      <div className="w-8 h-8 bg-zinc-500 rounded" />
      <div className="w-8 h-8 bg-zinc-500 rounded" />
      <div className="w-8 h-8 bg-zinc-500 rounded" />
    </div>
    <div className="flex justify-around bg-zinc-800 p-2 rounded">
      <div className="w-8 h-8 bg-zinc-500 rounded" />
      <div className="w-8 h-8 bg-zinc-500 rounded" />
    </div>
    <div className="flex justify-evenly bg-zinc-800 p-2 rounded">
      <div className="w-8 h-8 bg-zinc-500 rounded" />
      <div className="w-8 h-8 bg-zinc-500 rounded" />
    </div>
  </div>
</Preview>

```tsx
<div className="flex justify-between">...</div>
<div className="flex justify-around">...</div>
<div className="flex justify-evenly">...</div>
```

## Flex-1 (the "take up the rest" trick)

<Preview>
  <div className="flex gap-2 p-2 bg-zinc-800 rounded">
    <div className="w-12 h-12 bg-zinc-500 rounded" />
    <div className="flex-1 h-12 bg-zinc-400 rounded" />
    <div className="w-12 h-12 bg-zinc-500 rounded" />
  </div>
</Preview>

```tsx
<div className="flex gap-2">
  <div className="w-12 h-12" />        {/* fixed */}
  <div className="flex-1 h-12" />      {/* fills remaining space */}
  <div className="w-12 h-12" />        {/* fixed */}
</div>
```

## Flex direction

<Preview>
  <div className="flex flex-col gap-2 bg-zinc-800 p-2 rounded">
    <div className="h-8 bg-zinc-500 rounded" />
    <div className="h-8 bg-zinc-500 rounded" />
    <div className="h-8 bg-zinc-500 rounded" />
  </div>
</Preview>

```tsx
<div className="flex flex-col gap-2">...</div>
```

## Flex wrap

<Preview>
  <div className="flex flex-wrap gap-2 bg-zinc-800 p-2 rounded max-w-xs">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="w-16 h-8 bg-zinc-500 rounded" />
    ))}
  </div>
</Preview>

```tsx
<div className="flex flex-wrap gap-2 max-w-xs">
  {items.map((i) => <div className="w-16 h-8" />)}
</div>
```

## Grid basics

12-column grid with gap. The Bootstrap mental model still applies.

<Preview>
  <div className="grid grid-cols-3 gap-2">
    <div className="h-12 bg-zinc-700 rounded" />
    <div className="h-12 bg-zinc-700 rounded" />
    <div className="h-12 bg-zinc-700 rounded" />
    <div className="h-12 bg-zinc-700 rounded" />
    <div className="h-12 bg-zinc-700 rounded" />
    <div className="h-12 bg-zinc-700 rounded" />
  </div>
</Preview>

```tsx
<div className="grid grid-cols-3 gap-2">
  {/* 6 items, 3 columns, 2 rows */}
</div>
```

## Grid with column spans

<Preview>
  <div className="grid grid-cols-4 gap-2">
    <div className="col-span-2 h-12 bg-zinc-600 rounded" />
    <div className="h-12 bg-zinc-700 rounded" />
    <div className="h-12 bg-zinc-700 rounded" />
    <div className="col-span-3 h-12 bg-zinc-700 rounded" />
    <div className="h-12 bg-zinc-700 rounded" />
  </div>
</Preview>

```tsx
<div className="grid grid-cols-4 gap-2">
  <div className="col-span-2" />
  <div />
  <div />
  <div className="col-span-3" />
  <div />
</div>
```

## Responsive grid (the dashboard pattern)

1 column on mobile, 2 on tablet, 4 on desktop.

<Preview>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="h-16 bg-zinc-700 rounded" />
    ))}
  </div>
</Preview>

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <Card />
  <Card />
  <Card />
  <Card />
</div>
```

## `auto-fit` / `minmax` (responsive without breakpoints)

When you don't want to think about breakpoints — fits as many columns as it can, each at least 200px wide.

```tsx
<div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
  {items.map((i) => <Card />)}
</div>
```

## Sidebar layout (the classic)

<Preview>
  <div className="flex gap-2 h-32">
    <aside className="w-32 bg-zinc-800 rounded p-2 text-white text-sm">Sidebar</aside>
    <main className="flex-1 bg-zinc-700 rounded p-2 text-white text-sm">Content</main>
  </div>
</Preview>

```tsx
<div className="flex h-screen">
  <aside className="w-64 bg-zinc-800">Sidebar</aside>
  <main className="flex-1 overflow-y-auto">Content</main>
</div>
```

## Sticky header

```tsx
<header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-zinc-900/80 border-b">
  ...
</header>
```

## Responsive prefixes

Mobile-first — base classes apply to everything, prefixes scale up.

```
sm:   640px+
md:   768px+
lg:   1024px+
xl:   1280px+
2xl:  1536px+
```

```tsx
<div className="text-sm md:text-base lg:text-lg">
  Smaller on mobile, bigger on desktop
</div>
```

## Dark mode

Set up dark mode with `next-themes`. Then prefix any class with `dark:`.

<Preview>
  <div className="p-4 bg-white text-black dark:bg-zinc-900 dark:text-white rounded border">
    Adapts to current theme
  </div>
</Preview>

```tsx
<div className="bg-white text-black dark:bg-zinc-900 dark:text-white">
  Adapts to current theme
</div>
```

## Hover, focus, active

<Preview>
  <button className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600 active:bg-zinc-800 transition">
    Hover me
  </button>
</Preview>

```tsx
<button className="bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-800 transition">
  Hover me
</button>
```

## Group hover

When hovering the parent should change a child.

<Preview>
  <div className="group p-4 bg-zinc-800 rounded cursor-pointer">
    <p className="text-zinc-400 group-hover:text-white transition">
      Hover the parent box
    </p>
  </div>
</Preview>

```tsx
<div className="group p-4 bg-zinc-800">
  <p className="text-zinc-400 group-hover:text-white transition">
    Child reacts to parent hover
  </p>
</div>
```

## Peer state (sibling-driven styling)

Style an element based on a sibling's state. Common for floating labels and custom checkboxes.

```tsx
<input id="email" type="email" className="peer" />
<label
  htmlFor="email"
  className="text-zinc-500 peer-focus:text-blue-500 peer-invalid:text-red-500"
>
  Email
</label>
```

## Conditional classes with `cn()`

The shadcn helper. Combine `clsx` + `tailwind-merge` so classes compose without conflicts.

```ts filename="lib/utils.ts"
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

```tsx
<button
  className={cn(
    "px-4 py-2 rounded",
    variant === "primary" && "bg-black text-white",
    variant === "secondary" && "bg-zinc-200",
    disabled && "opacity-50 cursor-not-allowed",
  )}
/>
```

## `cva` for variants

When a component has many variant combinations.

```ts filename="components/Button.tsx"
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition",
  {
    variants: {
      variant: {
        primary: "bg-black text-white hover:bg-zinc-800",
        secondary: "bg-zinc-200 hover:bg-zinc-300",
        ghost: "hover:bg-zinc-100",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-lg",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
```

## Container + max-width pattern

For a centered article column.

```tsx
<div className="max-w-3xl mx-auto px-4">
  <article>...</article>
</div>
```

## Aspect ratio

```tsx
<div className="aspect-video bg-zinc-800">
  <iframe src="..." className="w-full h-full" />
</div>

<div className="aspect-square w-32 bg-zinc-800" />
```

## Truncate text

<Preview>
  <p className="truncate w-48 text-white bg-zinc-800 p-2 rounded">
    This is a really long line of text that will get cut off with an ellipsis
  </p>
</Preview>

```tsx
<p className="truncate w-48">Very long text that gets cut off...</p>

{/* Multi-line */}
<p className="line-clamp-2">Long text cut after 2 lines...</p>
```

## Arbitrary values

When the design token doesn't have what you need.

```tsx
<div className="w-[347px] h-[12.5rem] bg-[#FF6B6B] grid-cols-[200px_1fr_auto]">
  ...
</div>
```

<Callout type="tip">
Use sparingly. If you find yourself doing this a lot, your design system isn't matching the design.
</Callout>
---

# Next.js

App Router only. Pages Router is legacy — don't reach for it.

## Server vs Client Components

Default is server. Add `"use client"` at the top of a file to opt in.

**Server Component (default):**
- Renders on the server, sends HTML
- Can be `async`, can fetch directly, can hit the DB
- No hooks, no event handlers, no browser APIs
- Smaller bundle for the client

**Client Component:**
- Runs in the browser
- Can use hooks, state, effects, event handlers
- Needs `"use client"` at the top of the file

```tsx filename="app/page.tsx"
// Server Component — default, no "use client"
import { db } from "@/db";

export default async function HomePage() {
  const posts = await db.query.posts.findMany();
  return <PostList posts={posts} />;
}
```

```tsx filename="components/Counter.tsx"
"use client";

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

<Callout type="tip">
Mental model: keep things server by default. Push `"use client"` as far down the tree as possible — only the leaf component that needs interactivity should be a client component.
</Callout>

## File structure (the convention I follow)

```
app/
  layout.tsx              # root layout (HTML, body, providers)
  page.tsx                # /
  globals.css
  (marketing)/            # route group — doesn't affect URL
    layout.tsx            # marketing-specific layout
    about/page.tsx
    pricing/page.tsx
  (app)/
    layout.tsx            # app shell, auth guard
    dashboard/page.tsx
    settings/page.tsx
  api/
    auth/[...all]/route.ts
    webhooks/stripe/route.ts
components/
  ui/                     # shadcn components, untouched
  layout/                 # navbar, sidebar, footer
  forms/                  # form components
  [feature]/              # grouped by feature
lib/
  db/
    index.ts              # drizzle client
    schema.ts             # all tables
  auth.ts                 # better-auth config
  utils.ts                # cn(), helpers
  validations/            # zod schemas
hooks/                    # custom hooks
types/                    # shared types
```

<Callout type="note">
Co-locate. Components used by a single page can live next to it (`app/dashboard/_components/`). Use the underscore prefix to opt out of routing.
</Callout>

## Routes

Each `page.tsx` becomes a route. Folder name = URL segment.

```
app/about/page.tsx              -> /about
app/blog/[slug]/page.tsx        -> /blog/anything
app/blog/[...slug]/page.tsx     -> /blog/a/b/c (catch-all)
app/(marketing)/about/page.tsx  -> /about (group doesn't show in URL)
```

## Dynamic routes

```tsx filename="app/blog/[slug]/page.tsx"
type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  return <article>{post.title}</article>;
}
```

<Callout type="gotcha">
In Next 15+, `params` and `searchParams` are Promises. You must `await` them.
</Callout>

## Special files

```
layout.tsx        # wraps the route segment
page.tsx          # the actual route
loading.tsx       # automatic Suspense boundary
error.tsx         # automatic error boundary (must be client)
not-found.tsx     # 404 page for the segment
template.tsx      # like layout but remounts on navigation
```

## Layouts

```tsx filename="app/dashboard/layout.tsx"
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

Layouts are nested. The root layout wraps everything; child layouts wrap their segment's pages.

## Loading states

Drop a `loading.tsx` next to a `page.tsx` and Next wraps the page in Suspense automatically.

```tsx filename="app/dashboard/loading.tsx"
export default function Loading() {
  return <DashboardSkeleton />;
}
```

## Error boundaries

```tsx filename="app/dashboard/error.tsx"
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

## Linking

Use `<Link>`, not `<a>`. Prefetches in the background, avoids a full page reload.

```tsx
import Link from "next/link";

<Link href="/dashboard">Dashboard</Link>
<Link href={`/posts/${id}`}>Post</Link>
```

## Programmatic navigation

```tsx
"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
    router.refresh(); // refetch server components
  };

  return <button onClick={handleLogout}>Log out</button>;
}
```

## Reading the URL

```tsx
"use client";

import { useParams, useSearchParams, usePathname } from "next/navigation";

const params = useParams();              // { slug: "abc" }
const searchParams = useSearchParams();  // ?q=hello -> .get("q")
const pathname = usePathname();          // "/blog/abc"
```

## Server Actions

The pattern for mutations from forms or buttons. No need to write API routes for most CRUD.

```tsx filename="app/posts/actions.ts"
"use server";

import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createPostSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
});

export async function createPost(formData: FormData) {
  const parsed = createPostSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten() };
  }

  await db.insert(posts).values(parsed.data);
  revalidatePath("/posts");
  return { success: true };
}
```

```tsx filename="app/posts/new/page.tsx"
import { createPost } from "../actions";

export default function NewPost() {
  return (
    <form action={createPost}>
      <input name="title" />
      <textarea name="body" />
      <button>Create</button>
    </form>
  );
}
```

## Server Actions from a client component

```tsx
"use client";

import { createPost } from "./actions";
import { useTransition } from "react";

export function CreateButton() {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await createPost({ title: "New", body: "..." });
    });
  };

  return (
    <button onClick={handleClick} disabled={isPending}>
      {isPending ? "Creating..." : "Create"}
    </button>
  );
}
```

## Route Handlers (when you need an actual API)

For webhooks, third-party integrations, or when you need a real REST endpoint.

```ts filename="app/api/posts/route.ts"
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";

export async function GET() {
  const posts = await db.query.posts.findMany();
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const post = await db.insert(posts).values(body).returning();
  return NextResponse.json(post, { status: 201 });
}
```

```ts filename="app/api/posts/[id]/route.ts"
type Context = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Context) {
  const { id } = await params;
  const post = await db.query.posts.findFirst({ where: eq(posts.id, id) });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function DELETE(req: NextRequest, { params }: Context) {
  const { id } = await params;
  await db.delete(posts).where(eq(posts.id, id));
  return NextResponse.json({ ok: true });
}
```

## Caching and revalidation

Next caches aggressively. Three levers:

```tsx
// disable caching for a page
export const dynamic = "force-dynamic";

// revalidate every 60 seconds
export const revalidate = 60;
```

```ts
// revalidate a path after mutation
import { revalidatePath } from "next/cache";
revalidatePath("/posts");

// or by tag
import { revalidateTag } from "next/cache";
revalidateTag("posts");

// fetch with tags
fetch("https://api.x.com/posts", { next: { tags: ["posts"] } });
```

<Callout type="gotcha">
If you mutate data and don't see the UI update, you forgot `revalidatePath` or `router.refresh()`.
</Callout>

## Middleware

Runs before every request. Common uses: auth gates, redirects, rewrites.

```ts filename="middleware.ts"
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const session = req.cookies.get("session");

  if (!session && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*"],
};
```

## Metadata (SEO)

```tsx filename="app/blog/[slug]/page.tsx"
import type { Metadata } from "next";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: [post.coverImage],
    },
  };
}
```

## Images

```tsx
import Image from "next/image";

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority           // for above-the-fold images
/>

// for unknown dimensions (external URLs)
<div className="relative w-full h-64">
  <Image src={url} alt="" fill className="object-cover" />
</div>
```

## Fonts

```tsx filename="app/layout.tsx"
import { Geist, Geist_Mono } from "next/font/google";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export default function RootLayout({ children }) {
  return (
    <html className={`${geist.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

## Environment variables

```bash filename=".env.local"
DATABASE_URL=postgres://...
NEXT_PUBLIC_APP_URL=http://localhost:3000
GEMINI_API_KEY=...
```

- `NEXT_PUBLIC_*` is exposed to the browser
- Everything else is server-only

```ts
const dbUrl = process.env.DATABASE_URL!;          // server only
const appUrl = process.env.NEXT_PUBLIC_APP_URL!;  // works anywhere
```

## Data Access Layer (DAL) pattern

The pattern I use to keep DB code clean. Centralize all DB queries in one place. Wrap each in auth checks.

```ts filename="lib/dal/posts.ts"
import "server-only";
import { auth } from "@/lib/auth";
import { db } from "@/db";

export async function getMyPosts() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  return db.query.posts.findMany({
    where: eq(posts.userId, session.user.id),
  });
}

export async function getPostById(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const post = await db.query.posts.findFirst({ where: eq(posts.id, id) });
  if (!post) throw new Error("Not found");
  if (post.userId !== session.user.id) throw new Error("Forbidden");

  return post;
}
```

<Callout type="tip">
The `"server-only"` import throws a build error if you accidentally import this from a client component. Add it to every DAL file.
</Callout>

## Parallel routes (modals, side panels)

For things that should render alongside the current page — typically modals.

```
app/
  @modal/
    (.)photos/
      [id]/page.tsx     # intercepted route — renders as modal
  photos/
    [id]/page.tsx       # full page when navigated directly
  layout.tsx            # receives `modal` slot
```

Brain-bender. Look it up when you actually need it.

## Best practices recap

- Server Components by default, push `"use client"` to leaves
- Server Actions for mutations, Route Handlers for APIs
- DAL for all DB access, with auth checks
- Co-locate components with their pages
- Use `revalidatePath` after every mutation
- `"server-only"` on anything that touches the DB
---

# TanStack Start

Full-stack React framework. Alternative to Next.js. Built on Vite, uses TanStack Router for type-safe routing. Worth knowing if you want type-safe everything and don't want React Server Components.

## Setup

```bash
pnpm create @tanstack/start@latest my-app
cd my-app
pnpm install
pnpm dev
```

## File-based routing

Routes live in `src/routes/`. File path = URL.

```
src/routes/
  __root.tsx              # root route (like Next's root layout)
  index.tsx               # /
  about.tsx               # /about
  posts.tsx               # /posts (layout)
  posts.index.tsx         # /posts (index)
  posts.$postId.tsx       # /posts/:postId
```

Naming uses dots for nesting and `$` for dynamic segments — opposite of Next's brackets.

## Defining a route

```tsx filename="src/routes/posts.$postId.tsx"
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/posts/$postId")({
  loader: async ({ params }) => {
    const post = await fetchPost(params.postId);
    return { post };
  },
  component: PostPage,
});

function PostPage() {
  const { post } = Route.useLoaderData();
  return <article>{post.title}</article>;
}
```

## Server functions

Server-only logic, callable from anywhere. Like Next's Server Actions but more general.

```tsx
import { createServerFn } from "@tanstack/start";

export const getPosts = createServerFn({ method: "GET" })
  .handler(async () => {
    return await db.query.posts.findMany();
  });

// in a component
const posts = await getPosts();
```

## Type-safe links

```tsx
import { Link } from "@tanstack/react-router";

<Link to="/posts/$postId" params={{ postId: "123" }}>
  View Post
</Link>
```

If you typo the route or forget a param, TypeScript yells. This is the main appeal.

## Loaders + caching

Loaders run before the route renders. Data is cached automatically.

```tsx
export const Route = createFileRoute("/posts")({
  loader: () => fetchPosts(),
  staleTime: 1000 * 60,   // 1 minute
  component: PostsPage,
});
```

## When to pick TanStack Start over Next.js

- You want full type safety on routes and search params
- You don't want React Server Components (TanStack uses traditional SPA + SSR)
- You're already deep in TanStack Query + Router and want consistency
- You're building something that doesn't need ISR or edge rendering

Next.js is still the safer default for most projects. TanStack Start is newer, smaller community, fewer hosting integrations.

---

# Drizzle + Postgres

ORM that feels like writing SQL. Type-safe. Pairs well with Neon or Supabase Postgres.

## Setup

```bash
pnpm add drizzle-orm pg
pnpm add -D drizzle-kit @types/pg

# for Neon serverless / Vercel / Cloudflare
pnpm add @neondatabase/serverless
```

```ts filename="drizzle.config.ts"
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
```

## Client (Neon serverless, for Cloudflare/Vercel)

```ts filename="lib/db/index.ts"
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

## Client (node-postgres, for traditional Node deployments)

```ts filename="lib/db/index.ts"
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });
```

## Schema

```ts filename="lib/db/schema.ts"
import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  published: boolean("published").default(false).notNull(),
  views: integer("views").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// relations (for query builder joins)
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, { fields: [posts.userId], references: [users.id] }),
}));

// types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
```

## Migrations

```bash
# generate migration from schema changes
pnpm drizzle-kit generate

# apply migrations
pnpm drizzle-kit migrate

# push schema directly (dev only — skips migrations)
pnpm drizzle-kit push

# open the GUI
pnpm drizzle-kit studio
```

## CRUD — Read

```ts
import { db } from "@/lib/db";
import { posts, users } from "@/lib/db/schema";
import { eq, and, desc, like, gt, sql } from "drizzle-orm";

// find all
const all = await db.select().from(posts);

// find one (query builder, with relations)
const post = await db.query.posts.findFirst({
  where: eq(posts.id, id),
  with: { author: true },
});

// find many with filter
const published = await db.query.posts.findMany({
  where: and(eq(posts.published, true), gt(posts.views, 100)),
  orderBy: desc(posts.createdAt),
  limit: 20,
});

// search
const matches = await db.query.posts.findMany({
  where: like(posts.title, `%${query}%`),
});

// raw count
const [{ count }] = await db
  .select({ count: sql<number>`count(*)` })
  .from(posts);
```

## CRUD — Create

```ts
const [newPost] = await db
  .insert(posts)
  .values({
    userId: session.user.id,
    title: "Hello",
    body: "World",
  })
  .returning();
```

## CRUD — Update

```ts
const [updated] = await db
  .update(posts)
  .set({ title: "New title", views: sql`${posts.views} + 1` })
  .where(eq(posts.id, id))
  .returning();
```

## CRUD — Delete

```ts
await db.delete(posts).where(eq(posts.id, id));
```

## Joins (manual style)

```ts
const result = await db
  .select({
    postId: posts.id,
    title: posts.title,
    authorName: users.name,
  })
  .from(posts)
  .leftJoin(users, eq(posts.userId, users.id))
  .where(eq(posts.published, true));
```

## Transactions

```ts
await db.transaction(async (tx) => {
  const [user] = await tx.insert(users).values(userData).returning();
  await tx.insert(profiles).values({ userId: user.id, ...profileData });
});
```

If anything throws inside, the whole thing rolls back.

## Pagination

```ts
const PAGE_SIZE = 20;

const items = await db.query.posts.findMany({
  limit: PAGE_SIZE,
  offset: page * PAGE_SIZE,
  orderBy: desc(posts.createdAt),
});
```

For large datasets, prefer cursor-based:

```ts
const items = await db.query.posts.findMany({
  where: lt(posts.createdAt, cursor),
  limit: PAGE_SIZE,
  orderBy: desc(posts.createdAt),
});
```

## Common operators (cheatsheet)

```ts
import {
  eq, ne, gt, gte, lt, lte,
  and, or, not,
  like, ilike, isNull, isNotNull,
  inArray, notInArray, between,
  asc, desc,
  sql,
} from "drizzle-orm";
```

---

# APIs

## fetch (the basics)

```ts
const res = await fetch("/api/posts");
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const data = await res.json();
```

## POST with JSON

```ts
const res = await fetch("/api/posts", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title, body }),
});
```

## With auth header

```ts
const res = await fetch(url, {
  headers: { Authorization: `Bearer ${token}` },
});
```

## Type-safe fetch wrapper

```ts filename="lib/api.ts"
type ApiResponse<T> = { data: T } | { error: string };

export async function apiFetch<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `HTTP ${res.status}`);
  }

  return res.json();
}
```

## Zod validation (request bodies)

```ts filename="lib/validations/post.ts"
import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1),
  tags: z.array(z.string()).max(5).optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
```

```ts filename="app/api/posts/route.ts"
import { createPostSchema } from "@/lib/validations/post";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = createPostSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const post = await db.insert(posts).values(parsed.data).returning();
  return NextResponse.json(post[0], { status: 201 });
}
```

## Zod patterns

```ts
// optional with default
z.string().default("anonymous")

// transform
z.string().transform((s) => s.toLowerCase())

// refine (custom validation)
z.string().refine((s) => s.includes("@"), "Must include @")

// enum
z.enum(["user", "admin"])

// union
z.union([z.string(), z.number()])

// nested
z.object({
  user: z.object({ id: z.string(), name: z.string() }),
  tags: z.array(z.string()),
})

// parse vs safeParse
const data = schema.parse(input);          // throws on invalid
const result = schema.safeParse(input);    // returns { success, data | error }
```

## Error handling pattern

```ts
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const result = await db.insert(table).values(parsed.data).returning();
    return NextResponse.json(result[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
```

## Server Actions with validation

The cleanest mutation pattern. No API route needed.

```ts filename="app/posts/actions.ts"
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const schema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
});

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createPost(
  input: z.infer<typeof schema>,
): Promise<ActionResult<{ id: string }>> {
  const session = await auth();
  if (!session) return { success: false, error: "Unauthorized" };

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }

  const [post] = await db
    .insert(posts)
    .values({ ...parsed.data, userId: session.user.id })
    .returning();

  revalidatePath("/posts");
  return { success: true, data: { id: post.id } };
}
```

## TanStack Query (server state on the client)

```bash
pnpm add @tanstack/react-query
```

```tsx filename="components/Providers.tsx"
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
```

```tsx
"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function Posts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetch("/api/posts").then((r) => r.json()),
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  return <PostList posts={data} />;
}

function CreatePost() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: NewPost) =>
      fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify(input),
      }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });

  return (
    <button onClick={() => mutation.mutate({ title: "x", body: "y" })}>
      {mutation.isPending ? "Creating..." : "Create"}
    </button>
  );
}
```

<Callout type="tip">
On Next.js with Server Components, you usually don't need TanStack Query. Use it when you have client-heavy interactivity (filters, infinite scroll, optimistic updates).
</Callout>
---

# Auth (Better Auth)

The auth library I use. Type-safe, framework-agnostic, batteries included.

## Setup

```bash
pnpm add better-auth
```

```ts filename="lib/auth.ts"
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
});
```

## Generate auth tables

```bash
pnpm dlx @better-auth/cli generate
```

This adds `user`, `session`, `account`, and `verification` tables to your schema.

## Mount the route handler

```ts filename="app/api/auth/[...all]/route.ts"
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

## Client setup

```ts filename="lib/auth-client.ts"
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

export const { signIn, signOut, signUp, useSession } = authClient;
```

## Sign in / sign up

```tsx
"use client";
import { signIn, signUp } from "@/lib/auth-client";

await signUp.email({
  email: "yani@example.com",
  password: "password123",
  name: "Yani",
});

await signIn.email({
  email: "yani@example.com",
  password: "password123",
});

await signIn.social({ provider: "google" });
```

## Get session in server components

```tsx filename="app/dashboard/page.tsx"
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  return <div>Welcome {session.user.name}</div>;
}
```

## Get session in client components

```tsx
"use client";
import { useSession } from "@/lib/auth-client";

function Profile() {
  const { data: session, isPending } = useSession();
  if (isPending) return <Spinner />;
  if (!session) return <Login />;
  return <p>{session.user.name}</p>;
}
```

## Protect a route via middleware

```ts filename="middleware.ts"
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(req: NextRequest) {
  const session = getSessionCookie(req);
  if (!session) return NextResponse.redirect(new URL("/login", req.url));
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };
```

## Sign out

```tsx
"use client";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await signOut();
        router.push("/");
        router.refresh();
      }}
    >
      Log out
    </button>
  );
}
```

## Role-based access (manual)

Add a role column to your schema, then check in your DAL:

```ts filename="lib/dal/admin.ts"
import "server-only";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  if (session.user.role !== "admin") throw new Error("Forbidden");
  return session;
}
```

---

# AI Integration

Patterns first, providers second. Most apps need: text generation, streaming chat, structured output, RAG, and (sometimes) agents/tool calls. The provider is mostly interchangeable.

## Vercel AI SDK (the easy default)

```bash
pnpm add ai @ai-sdk/openai @ai-sdk/anthropic @ai-sdk/google
```

The SDK gives you a unified API across providers. Swap models without rewriting your code.

## Pattern: simple text generation

<Tabs defaultValue="vercel">
  <Tab value="vercel" label="Vercel AI SDK">
```ts
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

const { text } = await generateText({
  model: openai("gpt-4o-mini"),
  prompt: "Write a haiku about Postgres",
});
```
  </Tab>
  <Tab value="openai" label="OpenAI direct">
```ts
import OpenAI from "openai";
const client = new OpenAI();

const res = await client.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [{ role: "user", content: "Write a haiku about Postgres" }],
});
const text = res.choices[0].message.content;
```
  </Tab>
  <Tab value="claude" label="Anthropic direct">
```ts
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic();

const res = await client.messages.create({
  model: "claude-opus-4-7",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Write a haiku about Postgres" }],
});
const text = res.content[0].type === "text" ? res.content[0].text : "";
```
  </Tab>
  <Tab value="gemini" label="Gemini direct">
```ts
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const result = await model.generateContent("Write a haiku about Postgres");
const text = result.response.text();
```
  </Tab>
</Tabs>

## Pattern: streaming chat (the most common UI)

The user sends a message, tokens stream back into the UI as they're generated.

```ts filename="app/api/chat/route.ts"
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: "You are a helpful assistant.",
    messages,
  });

  return result.toDataStreamResponse();
}
```

```tsx filename="app/chat/page.tsx"
"use client";
import { useChat } from "ai/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({ api: "/api/chat" });

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>
          <strong>{m.role}:</strong> {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button disabled={isLoading}>Send</button>
      </form>
    </div>
  );
}
```

## Pattern: structured output (JSON with a schema)

When you need the LLM to return data your code can use directly. Pair with Zod.

```ts
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const { object } = await generateObject({
  model: openai("gpt-4o"),
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    sentiment: z.enum(["positive", "neutral", "negative"]),
  }),
  prompt: `Analyze this review: "${review}"`,
});

// object is fully typed: { title: string; tags: string[]; sentiment: ... }
```

<Callout type="tip">
This is the killer feature. No more parsing flaky JSON from text completions.
</Callout>

## Pattern: tool calling (let the model use functions)

Give the model a set of tools. It decides when to call them.

```ts
import { streamText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const result = streamText({
  model: openai("gpt-4o"),
  messages,
  tools: {
    getWeather: tool({
      description: "Get current weather for a city",
      parameters: z.object({ city: z.string() }),
      execute: async ({ city }) => {
        const res = await fetch(`https://api.weather.com/${city}`);
        return await res.json();
      },
    }),
    searchPosts: tool({
      description: "Search posts by keyword",
      parameters: z.object({ query: z.string() }),
      execute: async ({ query }) => {
        return await db.query.posts.findMany({
          where: like(posts.title, `%${query}%`),
        });
      },
    }),
  },
  maxSteps: 5,  // how many times the model can loop with tool results
});
```

## Pattern: RAG (retrieval-augmented generation)

Find relevant docs, stuff them into the prompt, generate.

The flow:
1. **Index**: chunk your docs, generate embeddings, store in a vector DB
2. **Retrieve**: embed the user's query, find similar chunks
3. **Generate**: pass the retrieved chunks as context to the LLM

```ts
// 1. Indexing
import { embed } from "ai";
import { openai } from "@ai-sdk/openai";

for (const chunk of chunks) {
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: chunk.text,
  });
  await db.insert(documents).values({ text: chunk.text, embedding });
}

// 2. Retrieve
const { embedding } = await embed({
  model: openai.embedding("text-embedding-3-small"),
  value: userQuery,
});

const relevant = await db
  .select()
  .from(documents)
  .orderBy(sql`embedding <=> ${embedding}`)
  .limit(5);

// 3. Generate
const { text } = await generateText({
  model: openai("gpt-4o"),
  system: `Answer based only on this context:\n${relevant.map((d) => d.text).join("\n\n")}`,
  prompt: userQuery,
});
```

For the vector DB: pgvector (Postgres extension), Pinecone, or Weaviate.

## Pattern: agents

An agent is just a loop of "model decides → calls tools → sees results → decides again" until it decides it's done. Use `maxSteps` in `streamText` for the simple case. For complex multi-step workflows, look at LangChain or LangGraph.

## LangChain (when you need orchestration)

For complex chains: multi-step reasoning, conditional flows, memory across sessions, multi-agent setups. Heavier than the AI SDK but more powerful.

```bash
pnpm add @langchain/core @langchain/openai
```

```ts
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatOpenAI({ model: "gpt-4o-mini" });
const prompt = ChatPromptTemplate.fromTemplate(
  "Translate '{text}' to {language}",
);

const chain = prompt.pipe(model);
const result = await chain.invoke({ text: "hello", language: "Japanese" });
```

<Callout type="note">
For 90% of apps, the Vercel AI SDK is enough. Reach for LangChain when you have genuinely complex orchestration.
</Callout>

## Hugging Face (open-source models, embeddings)

For self-hosted or open-source model access. Useful for embeddings on a budget, or running a smaller model for specific tasks.

```bash
pnpm add @huggingface/inference
```

```ts
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_TOKEN);

const result = await hf.textGeneration({
  model: "meta-llama/Llama-3.2-3B-Instruct",
  inputs: "Write a haiku about Postgres",
});
```

## Provider quick-pick

| Use case | First choice |
|----------|-------------|
| General chat / fast iteration | Vercel AI SDK + OpenAI or Claude |
| Need cheap, fast | Gemini Flash or GPT-4o-mini |
| Need best quality | Claude Opus or GPT-4o |
| Long context (1M tokens) | Gemini |
| Structured output | Vercel AI SDK `generateObject` |
| Self-host / open-source | Hugging Face + Llama |
| Complex orchestration | LangChain |

## Streaming structured output

```ts
import { streamObject } from "ai";

const { partialObjectStream } = streamObject({
  model: openai("gpt-4o"),
  schema: z.object({ items: z.array(z.string()) }),
  prompt: "List 5 things",
});

for await (const partial of partialObjectStream) {
  console.log(partial); // updates as fields fill in
}
```

## Cost / rate limit tips

- Cache identical prompts (Redis, key by prompt hash)
- Use the cheapest model that works (test with Flash/Mini first)
- Set `max_tokens` aggressively
- Stream when possible (better UX, can stop early)
- For RAG, cache embeddings

---

# Patterns

The "you'll do this in every project" stuff.

## `cn()` for conditional Tailwind classes

Already covered in the Tailwind section. The single most-reused utility in any project.

## Optimistic UI

Update the UI immediately, roll back on error.

```tsx
"use client";
import { useOptimistic } from "react";

function TodoList({ todos }: { todos: Todo[] }) {
  const [optimistic, addOptimistic] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [...state, newTodo],
  );

  const handleAdd = async (text: string) => {
    addOptimistic({ id: "temp", text, done: false });
    await createTodo(text); // server action
  };

  return <ul>{optimistic.map((t) => <li key={t.id}>{t.text}</li>)}</ul>;
}
```

## Debouncing (search inputs)

```tsx
const [query, setQuery] = useState("");
const debounced = useDebounce(query, 300);

useEffect(() => {
  if (!debounced) return;
  fetchResults(debounced);
}, [debounced]);
```

## Throttling

When you want to fire at most once per N ms (scroll, resize handlers).

```ts
function throttle<T extends (...args: any[]) => any>(fn: T, ms: number) {
  let last = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn(...args);
    }
  };
}
```

## Loading states (the three you always need)

```tsx
{isLoading && <Skeleton />}
{error && <ErrorMessage error={error} />}
{!isLoading && !error && data && <Content data={data} />}

// or with empty state
{!isLoading && data?.length === 0 && <Empty />}
```

## Empty states matter

Always design the empty state. Three things to include: icon/illustration, message, CTA.

```tsx
<div className="text-center py-12">
  <Inbox className="mx-auto h-12 w-12 text-zinc-400" />
  <h3 className="mt-2 font-semibold">No posts yet</h3>
  <p className="text-sm text-zinc-500">Get started by creating your first post.</p>
  <Button className="mt-4">Create post</Button>
</div>
```

## Toast notifications

Sonner is the de-facto choice now. Tiny, accessible, easy.

```bash
pnpm add sonner
```

```tsx
import { toast } from "sonner";

toast.success("Saved");
toast.error("Something went wrong");
toast("Generic message");

toast.promise(saveUser(), {
  loading: "Saving...",
  success: "Saved!",
  error: "Failed to save",
});
```

## Modals (shadcn Dialog)

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
    </DialogHeader>
    <ProfileForm />
  </DialogContent>
</Dialog>
```

## Confirmation dialog

```tsx
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

<AlertDialog>
  <AlertDialogTrigger>Delete</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## Copy to clipboard

```tsx
"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button onClick={handleCopy}>
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
}
```

## Format dates (date-fns)

```ts
import { format, formatDistanceToNow, parseISO } from "date-fns";

format(new Date(), "MMM d, yyyy");           // "Apr 23, 2026"
format(new Date(), "h:mm a");                // "3:42 PM"
formatDistanceToNow(date, { addSuffix: true }); // "2 hours ago"
parseISO("2026-04-23T15:42:00Z");
```

## Image upload

```tsx
"use client";

function FileUpload() {
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const { url } = await res.json();
  };

  return <input type="file" accept="image/*" onChange={handleUpload} />;
}
```

For storage: UploadThing (easiest), Cloudinary, S3, or Supabase Storage.

## Pagination URL state

Keep page state in the URL so refresh and sharing work.

```tsx
"use client";
import { useSearchParams, useRouter } from "next/navigation";

function Pagination() {
  const params = useSearchParams();
  const router = useRouter();
  const page = Number(params.get("page") ?? 1);

  const goTo = (n: number) => {
    const next = new URLSearchParams(params);
    next.set("page", String(n));
    router.push(`?${next}`);
  };

  return (
    <>
      <button onClick={() => goTo(page - 1)}>Prev</button>
      <span>{page}</span>
      <button onClick={() => goTo(page + 1)}>Next</button>
    </>
  );
}
```

## Skeleton loaders (better than spinners for content)

```tsx
import { Skeleton } from "@/components/ui/skeleton";

<div className="space-y-2">
  <Skeleton className="h-8 w-3/4" />
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-5/6" />
</div>
```

## Infinite scroll (intersection observer)

```tsx
"use client";
import { useEffect, useRef } from "react";

function useInfiniteScroll(onIntersect: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) onIntersect();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [onIntersect]);

  return ref;
}
```

## Local storage hook

```ts
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
```

## Keyboard shortcuts

```tsx
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setOpen(true);
    }
  };
  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
}, []);
```

## Prevent layout shift (CLS)

- Always specify `width` and `height` on `<Image>`
- Use skeleton loaders sized like the real content
- For embedded videos/iframes, wrap in `aspect-video`
- Reserve space for things that load async

## Env variable validation (with Zod)

```ts filename="lib/env.ts"
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  GEMINI_API_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

Now `env.DATABASE_URL` is fully typed and validated at startup.
---

# Resources

The libraries, services, and links I keep reaching for. Grouped by what they do.

## Frameworks & runtimes

<LinkCard
  href="https://nextjs.org"
  title="Next.js"
  description="React framework. App Router, Server Components, Server Actions. My default for full-stack apps."
/>

<LinkCard
  href="https://tanstack.com/start"
  title="TanStack Start"
  description="Type-safe full-stack React framework. Vite-based. Alternative to Next.js."
/>

<LinkCard
  href="https://remix.run"
  title="Remix"
  description="Web fundamentals first. Now part of React Router v7."
/>

<LinkCard
  href="https://astro.build"
  title="Astro"
  description="Content sites. Ships zero JS by default. Great for blogs and marketing pages."
/>

<LinkCard
  href="https://vitejs.dev"
  title="Vite"
  description="Frontend build tool. Fast dev server. The default for non-Next React apps."
/>

## Styling & UI

<LinkCard
  href="https://tailwindcss.com"
  title="Tailwind CSS"
  description="Utility-first CSS. v4 is current. The default for new projects."
/>

<LinkCard
  href="https://ui.shadcn.com"
  title="shadcn/ui"
  description="Copy-paste component library built on Radix + Tailwind. Not a dependency — owns your code."
/>

<LinkCard
  href="https://www.radix-ui.com"
  title="Radix UI"
  description="Unstyled, accessible component primitives. What shadcn is built on."
/>

<LinkCard
  href="https://lucide.dev"
  title="Lucide"
  description="Icon set. Tree-shakeable, consistent style. The shadcn default."
/>

<LinkCard
  href="https://www.framer.com/motion"
  title="Framer Motion (Motion)"
  description="Animations for React. Now just called 'Motion'. Use sparingly."
/>

<LinkCard
  href="https://cva.style/docs"
  title="class-variance-authority (cva)"
  description="Variant API for component classes. Pairs with Tailwind."
/>

<LinkCard
  href="https://github.com/dcastil/tailwind-merge"
  title="tailwind-merge"
  description="Smartly merges conflicting Tailwind classes. Inside the cn() helper."
/>

<LinkCard
  href="https://sonner.emilkowal.ski"
  title="Sonner"
  description="Toast notifications. Tiny, accessible, the new standard."
/>

<LinkCard
  href="https://magicui.design"
  title="Magic UI"
  description="Animated components built with Tailwind + Motion. Pairs with shadcn."
/>

<LinkCard
  href="https://aceternity.com"
  title="Aceternity UI"
  description="Flashy hero/landing components. Good for marketing pages."
/>

## Forms & validation

<LinkCard
  href="https://react-hook-form.com"
  title="React Hook Form"
  description="Performant forms with minimal rerenders. The standard."
/>

<LinkCard
  href="https://zod.dev"
  title="Zod"
  description="TypeScript-first schema validation. Use for forms, API inputs, env vars, LLM outputs."
/>

<LinkCard
  href="https://valibot.dev"
  title="Valibot"
  description="Alternative to Zod. Smaller bundle. API is similar."
/>

## State management

<LinkCard
  href="https://zustand-demo.pmnd.rs"
  title="Zustand"
  description="Tiny state management. No provider. The default when Context isn't enough."
/>

<LinkCard
  href="https://jotai.org"
  title="Jotai"
  description="Atomic state management. Different mental model from Zustand."
/>

<LinkCard
  href="https://redux-toolkit.js.org"
  title="Redux Toolkit"
  description="Modern Redux. Use when you have genuinely complex state."
/>

## Data fetching & caching

<LinkCard
  href="https://tanstack.com/query"
  title="TanStack Query"
  description="Server state for client components. Caching, refetching, mutations."
/>

<LinkCard
  href="https://swr.vercel.app"
  title="SWR"
  description="Vercel's data-fetching hook. Lighter than TanStack Query."
/>

## Database & ORM

<LinkCard
  href="https://orm.drizzle.team"
  title="Drizzle ORM"
  description="TypeScript ORM that feels like SQL. My default."
/>

<LinkCard
  href="https://www.prisma.io"
  title="Prisma"
  description="Schema-first ORM with great DX. Heavier than Drizzle."
/>

<LinkCard
  href="https://neon.tech"
  title="Neon"
  description="Serverless Postgres. Branching for preview deploys. Generous free tier."
/>

<LinkCard
  href="https://supabase.com"
  title="Supabase"
  description="Postgres + Auth + Storage + Realtime. Open source Firebase alternative."
/>

<LinkCard
  href="https://www.postgresql.org"
  title="PostgreSQL"
  description="The database. Always start here unless you have a specific reason."
/>

<LinkCard
  href="https://upstash.com"
  title="Upstash"
  description="Serverless Redis and Kafka. HTTP-based, works on edge."
/>

## Auth

<LinkCard
  href="https://www.better-auth.com"
  title="Better Auth"
  description="Type-safe, framework-agnostic auth. My default."
/>

<LinkCard
  href="https://authjs.dev"
  title="Auth.js (NextAuth)"
  description="The original. Widely used. More mature than Better Auth but less ergonomic."
/>

<LinkCard
  href="https://clerk.com"
  title="Clerk"
  description="Hosted auth with pre-built UI. Fastest to ship, costs money at scale."
/>

<LinkCard
  href="https://workos.com"
  title="WorkOS"
  description="Enterprise auth (SSO, SCIM). Use when selling B2B."
/>

## AI & LLMs

<LinkCard
  href="https://sdk.vercel.ai"
  title="Vercel AI SDK"
  description="Unified API across AI providers. Chat, streaming, structured output, tools."
/>

<LinkCard
  href="https://platform.openai.com"
  title="OpenAI"
  description="GPT-4o, embeddings, Whisper. The benchmark."
/>

<LinkCard
  href="https://docs.anthropic.com"
  title="Anthropic Claude"
  description="Claude Opus, Sonnet, Haiku. My pick for coding and long context."
/>

<LinkCard
  href="https://ai.google.dev"
  title="Google Gemini"
  description="Cheap, fast, 1M+ token context. Great for high-volume tasks."
/>

<LinkCard
  href="https://huggingface.co"
  title="Hugging Face"
  description="Open-source models, datasets, inference API."
/>

<LinkCard
  href="https://js.langchain.com"
  title="LangChain"
  description="Orchestration for complex LLM workflows. Use when AI SDK isn't enough."
/>

<LinkCard
  href="https://langchain-ai.github.io/langgraphjs"
  title="LangGraph"
  description="Stateful, multi-agent workflows. Built on LangChain."
/>

<LinkCard
  href="https://www.llamaindex.ai"
  title="LlamaIndex"
  description="Data framework for LLM apps. Strong for RAG."
/>

<LinkCard
  href="https://www.pinecone.io"
  title="Pinecone"
  description="Hosted vector database for RAG."
/>

<LinkCard
  href="https://github.com/pgvector/pgvector"
  title="pgvector"
  description="Vector similarity search inside Postgres. Free, just an extension."
/>

<LinkCard
  href="https://ollama.com"
  title="Ollama"
  description="Run LLMs locally. Llama, Mistral, Gemma."
/>

## Date & time

<LinkCard
  href="https://date-fns.org"
  title="date-fns"
  description="Modern, tree-shakeable date utilities. My default."
/>

<LinkCard
  href="https://day.js.org"
  title="Day.js"
  description="2KB Moment.js alternative. Smaller than date-fns if you only need basics."
/>

<LinkCard
  href="https://moment.github.io/luxon"
  title="Luxon"
  description="Powerful, immutable date library. Heavier."
/>

## File uploads & storage

<LinkCard
  href="https://uploadthing.com"
  title="UploadThing"
  description="The fastest way to add file uploads to Next.js. Free tier is generous."
/>

<LinkCard
  href="https://cloudinary.com"
  title="Cloudinary"
  description="Image/video CDN with on-the-fly transformations."
/>

<LinkCard
  href="https://aws.amazon.com/s3"
  title="AWS S3"
  description="Object storage. The cheapest at scale, but more setup."
/>

## Email

<LinkCard
  href="https://resend.com"
  title="Resend"
  description="Email API for developers. Made by the React Email team."
/>

<LinkCard
  href="https://react.email"
  title="React Email"
  description="Build emails with React components. Pairs with Resend."
/>

<LinkCard
  href="https://mailchimp.com"
  title="Mailchimp"
  description="Newsletters and marketing emails."
/>

<LinkCard
  href="https://postmarkapp.com"
  title="Postmark"
  description="Transactional email with great deliverability."
/>

## Payments

<LinkCard
  href="https://stripe.com/docs"
  title="Stripe"
  description="The default for payments. Subscriptions, one-time, marketplaces."
/>

<LinkCard
  href="https://lemonsqueezy.com"
  title="Lemon Squeezy"
  description="Merchant of record. Handles tax, easier for solo devs and indie SaaS."
/>

## Background jobs & queues

<LinkCard
  href="https://trigger.dev"
  title="Trigger.dev"
  description="Background jobs with great DX. Long-running tasks without timeouts."
/>

<LinkCard
  href="https://www.inngest.com"
  title="Inngest"
  description="Serverless event-driven functions. Workflows, retries, fan-out."
/>

<LinkCard
  href="https://upstash.com/qstash"
  title="Upstash QStash"
  description="HTTP-based message queue. Schedule and retry from any HTTP endpoint."
/>

## Realtime

<LinkCard
  href="https://supabase.com/realtime"
  title="Supabase Realtime"
  description="Postgres changes, presence, broadcast. Easy if already on Supabase."
/>

<LinkCard
  href="https://pusher.com"
  title="Pusher"
  description="Hosted WebSockets. Easy pubsub."
/>

<LinkCard
  href="https://ably.com"
  title="Ably"
  description="Realtime messaging. Strong reliability guarantees."
/>

## Hosting & deployment

<LinkCard
  href="https://vercel.com"
  title="Vercel"
  description="Best DX for Next.js. Free tier hits limits fast for hobby projects."
/>

<LinkCard
  href="https://pages.cloudflare.com"
  title="Cloudflare Pages"
  description="Free for unlimited bandwidth. Where I migrated UniSort. Workers runtime."
/>

<LinkCard
  href="https://www.netlify.com"
  title="Netlify"
  description="The OG static-first host. Good for non-Next sites."
/>

<LinkCard
  href="https://railway.app"
  title="Railway"
  description="Deploy any container. Easy databases. Pay-per-use."
/>

<LinkCard
  href="https://fly.io"
  title="Fly.io"
  description="Run containers near users. Good for Postgres + app colocated."
/>

## Analytics & monitoring

<LinkCard
  href="https://vercel.com/analytics"
  title="Vercel Analytics"
  description="Web vitals + visitor counts. Free tier on Vercel."
/>

<LinkCard
  href="https://posthog.com"
  title="PostHog"
  description="Product analytics, feature flags, session replay. Open source."
/>

<LinkCard
  href="https://plausible.io"
  title="Plausible"
  description="Privacy-friendly analytics. Lightweight."
/>

<LinkCard
  href="https://sentry.io"
  title="Sentry"
  description="Error tracking. Catches what your users see, before they tell you."
/>

<LinkCard
  href="https://axiom.co"
  title="Axiom"
  description="Logs. Great Vercel integration."
/>

## Testing

<LinkCard
  href="https://vitest.dev"
  title="Vitest"
  description="Unit testing. Vite-native, Jest-compatible API."
/>

<LinkCard
  href="https://playwright.dev"
  title="Playwright"
  description="End-to-end browser testing. Microsoft, multi-browser."
/>

<LinkCard
  href="https://testing-library.com/docs/react-testing-library/intro"
  title="React Testing Library"
  description="Test React components from the user's perspective."
/>

## DX & tooling

<LinkCard
  href="https://pnpm.io"
  title="pnpm"
  description="Faster, disk-efficient npm alternative. My default."
/>

<LinkCard
  href="https://biomejs.dev"
  title="Biome"
  description="Fast linter + formatter. Single tool to replace ESLint + Prettier."
/>

<LinkCard
  href="https://eslint.org"
  title="ESLint"
  description="The standard linter. Slower than Biome but huge plugin ecosystem."
/>

<LinkCard
  href="https://prettier.io"
  title="Prettier"
  description="Code formatter. Pairs with ESLint."
/>

<LinkCard
  href="https://www.t3.gg"
  title="create-t3-app"
  description="Opinionated Next.js stack: TS + tRPC + Prisma + Tailwind. Good reference."
/>

## Workflow & automation

<LinkCard
  href="https://n8n.io"
  title="n8n"
  description="Self-hostable workflow automation. Open-source Zapier."
/>

<LinkCard
  href="https://zapier.com"
  title="Zapier"
  description="Connect apps without code. The classic."
/>

<LinkCard
  href="https://make.com"
  title="Make"
  description="Visual workflow builder. More flexible than Zapier."
/>

## Documentation & learning

<LinkCard
  href="https://react.dev"
  title="React docs"
  description="The actual official docs. Excellent."
/>

<LinkCard
  href="https://nextjs.org/docs"
  title="Next.js docs"
  description="Comprehensive. Read the App Router section first."
/>

<LinkCard
  href="https://www.typescriptlang.org/docs"
  title="TypeScript docs"
  description="The Handbook. Re-read every few months."
/>

<LinkCard
  href="https://roadmap.sh"
  title="roadmap.sh"
  description="Curated learning paths for every dev role."
/>

<LinkCard
  href="https://frontendmasters.com"
  title="Frontend Masters"
  description="Where I take most of my courses. Quality > YouTube."
/>

<LinkCard
  href="https://www.totaltypescript.com"
  title="Total TypeScript"
  description="Matt Pocock's TypeScript courses. Free tier is excellent."
/>

<LinkCard
  href="https://2ality.com"
  title="2ality (Dr. Axel)"
  description="Deep dives into JS/TS internals."
/>

## Cheatsheet hubs

<LinkCard
  href="https://devhints.io"
  title="DevHints"
  description="Cheatsheets for everything. Bookmark."
/>

<LinkCard
  href="https://overapi.com"
  title="OverAPI"
  description="Quick API references for many languages."
/>

## Inspiration / templates

<LinkCard
  href="https://vercel.com/templates"
  title="Vercel Templates"
  description="Production-ready starters."
/>

<LinkCard
  href="https://shadcnui-templates.com"
  title="shadcn/ui templates"
  description="Pre-built layouts using shadcn."
/>

<LinkCard
  href="https://21st.dev"
  title="21st.dev"
  description="Curated UI components and inspiration."
/>

---

# How to use this site

Each section is a working reference, not a tutorial. The sidebar is your friend — `cmd+k` to search, click a heading, copy the snippet you need.

When something here feels outdated, fix it. The whole point is that this is mine.
