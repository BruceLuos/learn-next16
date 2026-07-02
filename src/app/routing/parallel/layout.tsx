import type { ReactNode } from "react";

/**
 * 并行路由（Parallel Routes）：layout 同时接收多个「槽」作为 props。
 * 这里接收 @stats 与 @feed 两个文件夹对应的 slot，并把它们和 children 一起渲染。
 */
export default function ParallelLayout({
  children,
  stats,
  feed,
}: {
  children: ReactNode;
  /** 对应 app/routing/parallel/@stats/page.tsx */
  stats: ReactNode;
  /** 对应 app/routing/parallel/@feed/page.tsx */
  feed: ReactNode;
}) {
  return (
    <>
      {children}
      <div className="mx-auto w-full max-w-3xl px-5 pb-16 sm:px-8">
        <div className="rounded-2xl border border-border bg-muted/20 p-5">
          <div className="mb-1 text-xs text-muted-foreground">
            ↓ 下面两个面板是两个并行路由槽，在同一次请求里并行渲染：
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <SlotFrame label="@stats" hint="app/routing/parallel/@stats">
              {stats}
            </SlotFrame>
            <SlotFrame label="@feed" hint="app/routing/parallel/@feed">
              {feed}
            </SlotFrame>
          </div>
        </div>
      </div>
    </>
  );
}

function SlotFrame({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-xs font-semibold text-primary">{label}</span>
        <span className="font-mono text-[9px] text-muted-foreground">{hint}</span>
      </div>
      {children}
    </div>
  );
}
