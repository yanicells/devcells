"use client";

import { Children, isValidElement, useMemo, type ReactElement, type ReactNode } from "react";
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "@/components/ui/tabs";

type TabProps = {
  value: string;
  label: string;
  children: ReactNode;
};

export function Tab(_props: TabProps) {
  // Rendering is handled by <Tabs>.
  return null;
}

type TabsProps = {
  defaultValue?: string;
  children: ReactNode;
};

export function Tabs({ defaultValue, children }: TabsProps) {
  const tabs = useMemo(() => {
    return Children.toArray(children).filter(
      (c): c is ReactElement<TabProps> =>
        isValidElement(c) &&
        typeof (c.props as TabProps)?.value === "string"
    );
  }, [children]);

  if (tabs.length === 0) return null;
  const initial = defaultValue ?? tabs[0].props.value;

  return (
    <TabsRoot defaultValue={initial} className="my-5">
      <TabsList>
        {tabs.map((t) => (
          <TabsTrigger key={t.props.value} value={t.props.value}>
            {t.props.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((t) => (
        <TabsContent key={t.props.value} value={t.props.value}>
          {t.props.children}
        </TabsContent>
      ))}
    </TabsRoot>
  );
}
