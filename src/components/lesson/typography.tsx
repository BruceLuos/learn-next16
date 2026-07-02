import type { ReactNode } from "react";

/** 课节正文的统一排版基础件，让每节课的页面保持一致的视觉节奏。 */

export function P({ children }: { children: ReactNode }) {
  return <p className="my-4 leading-7 text-muted-foreground">{children}</p>;
}

export function Lead({ children }: { children: ReactNode }) {
  return (
    <p className="mb-6 mt-2 text-lg leading-8 text-foreground/80">{children}</p>
  );
}

export function H2({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold tracking-tight text-foreground"
    >
      {children}
    </h2>
  );
}

export function H3({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h3
      id={id}
      className="mt-6 mb-2 scroll-mt-24 text-base font-semibold text-foreground"
    >
      {children}
    </h3>
  );
}

export function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="my-4 list-disc space-y-1.5 pl-5 text-muted-foreground marker:text-border">
      {children}
    </ul>
  );
}

export function LI({ children }: { children: ReactNode }) {
  return <li className="leading-7 [&_code]:text-foreground">{children}</li>;
}

/** 行内引用官方文档/出处的出处块 */
export function Source({ children }: { children: ReactNode }) {
  return (
    <p className="mt-6 border-l-2 border-border pl-3 text-sm text-muted-foreground">
      {children}
    </p>
  );
}
