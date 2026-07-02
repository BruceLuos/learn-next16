"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const items = [
  { id: 1, c: "from-rose-500 to-orange-500" },
  { id: 2, c: "from-emerald-500 to-teal-500" },
  { id: 3, c: "from-blue-500 to-indigo-500" },
  { id: 4, c: "from-amber-500 to-yellow-500" },
  { id: 5, c: "from-fuchsia-500 to-pink-500" },
  { id: 6, c: "from-cyan-500 to-sky-500" },
];

/** 用原生 document.startViewTransition 演示视图过渡（React 19.2 的 <ViewTransition> 是其声明式封装）。 */
export function ViewTransitionDemo() {
  const [grid, setGrid] = useState(true);

  function toggle() {
    const update = () => setGrid((g) => !g);
    // 浏览器原生 API：把一次 DOM 变化包成交互过渡
    if (
      typeof document !== "undefined" &&
      "startViewTransition" in document
    ) {
      (document as Document).startViewTransition(update);
    } else {
      update();
    }
  }

  return (
    <div>
      <Button variant="outline" size="sm" onClick={toggle}>
        切换布局（带视图过渡）
      </Button>
      <span className="ml-3 text-xs text-muted-foreground">
        支持时切换会平滑过渡；不支持时直接切换。
      </span>
      <div
        className={`mt-4 gap-3 ${grid ? "grid grid-cols-3" : "flex flex-wrap"}`}
      >
        {items.map((it) => (
          <div
            key={it.id}
            className={`flex h-16 items-center justify-center rounded-xl bg-gradient-to-br ${it.c} font-mono text-sm text-white shadow`}
            style={{ viewTransitionName: `tile-${it.id}` }}
          >
            #{it.id}
          </div>
        ))}
      </div>
    </div>
  );
}
