"use client";

import { useMemo, useState } from "react";

const DATA = Array.from({ length: 600 }, (_, i) => `条目 #${i + 1}`);

/**
 * 注意：这段代码里完全没有 useMemo / useCallback。
 * 在开启 reactCompiler 的本项目里，React Compiler 会自动分析依赖、自动 memoize，
 * 让下方过滤在只有 counter 变化时不重复计算。
 * （为让对比可见，这里用渲染计数器展示子组件被重渲染的次数。）
 */
function FilteredList({
  data,
  query,
  renderCountRef,
}: {
  data: string[];
  query: string;
  renderCountRef: React.RefObject<number>;
}) {
  // 统计子组件渲染次数：必须在 render 阶段自增 ref，否则用 effect+state
  // 会触发无限重渲染循环。此处为本演示的可视化目的，禁用 react-hooks/refs。
  // eslint-disable-next-line react-hooks/refs
  renderCountRef.current += 1;
  const filtered = data.filter((d) => d.includes(query));
  return (
    <ul className="max-h-40 space-y-0.5 overflow-auto rounded-lg bg-muted/40 p-2 font-mono text-[11px]">
      {filtered.slice(0, 8).map((d) => (
        <li key={d} className="text-muted-foreground">
          {d}
        </li>
      ))}
      {filtered.length > 8 && (
        <li className="text-muted-foreground/60">…共 {filtered.length} 条</li>
      )}
    </ul>
  );
}

export function CompilerDemo() {
  const [query, setQuery] = useState("");
  const [counter, setCounter] = useState(0);
  const renderCountRef = useMemo(() => ({ current: 0 }), []);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="过滤条目…"
          className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
        />
        <button
          onClick={() => setCounter((c) => c + 1)}
          className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted"
        >
          无关计数器：{counter}
        </button>
      </div>
      <FilteredList data={DATA} query={query} renderCountRef={renderCountRef} />
      <p className="text-[11px] text-muted-foreground">
        子组件累计渲染次数：
        <span className="font-mono text-foreground">
          {/* eslint-disable-next-line react-hooks/refs -- 读取渲染计数用于展示 */}
          {renderCountRef.current}
        </span>
        。<strong>没有手写 useMemo/useCallback</strong>，React
        Compiler（本项目已开启）自动处理了 memo。
      </p>
    </div>
  );
}
