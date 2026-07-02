"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

/** 客户端组件演示：useState 只在浏览器跑，这段 JS 才会进入客户端 bundle。 */
export function CounterDemo() {
  const [n, setN] = useState(0);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outline" onClick={() => setN((v) => v - 1)}>
        −
      </Button>
      <div className="min-w-12 rounded-lg bg-muted px-3 py-1.5 text-center font-mono text-2xl tabular-nums">
        {n}
      </div>
      <Button onClick={() => setN((v) => v + 1)}>+</Button>
      <span className="text-xs text-muted-foreground">
        state 保存在浏览器里 ← 这行注释里的交互不会跑到服务端
      </span>
    </div>
  );
}
