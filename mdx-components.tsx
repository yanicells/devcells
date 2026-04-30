import type { MDXComponents } from "mdx/types";
import { Pre } from "@/components/mdx/code-block";
import { Callout } from "@/components/mdx/callout";
import { Step, Steps } from "@/components/mdx/steps";
import { LinkCard } from "@/components/mdx/link-card";
import { Tab, Tabs } from "@/components/mdx/tabs";
import { Preview } from "@/components/mdx/preview";

const components: MDXComponents = {
  pre: Pre as MDXComponents["pre"],
  Callout,
  Steps,
  Step,
  LinkCard,
  Tabs,
  Tab,
  Preview,
};

export function useMDXComponents(existing: MDXComponents): MDXComponents {
  return { ...existing, ...components };
}
