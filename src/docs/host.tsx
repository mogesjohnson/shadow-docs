"use client";

import { createContext, useContext, type ReactNode } from "react";

export type FooterColumn = { title: string; links: { label: string; href: string; external?: boolean }[] };

/**
 * What the site hosting Shadow Docs adds to the shell. Standalone, nothing:
 * the docs use their own theme toggle and footer. The portfolio passes its
 * shared theme toggle, a link back to its home page and its own footer columns.
 */
export type DocsHost = {
  themeToggle?: ReactNode;
  homeLink?: { label: string; href: string };
  footerColumns?: FooterColumn[];
};

const HostContext = createContext<DocsHost>({});

export function ShadowDocsHost({ children, ...host }: DocsHost & { children: ReactNode }) {
  return <HostContext.Provider value={host}>{children}</HostContext.Provider>;
}

export function useDocsHost(): DocsHost {
  return useContext(HostContext);
}
