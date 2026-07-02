"use client";

/** error.tsx —— 必须是客户端组件。捕获子树渲染错误并提供 reset() 重试。
 *  它同样基于 React 的错误边界，不会捕获 layout.tsx 中的错误（那需要更上层的 error）。 */
import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto w-full max-w-xl px-8 py-20 text-center">
      <div className="mb-4 text-5xl">💥</div>
      <h1 className="mb-2 text-xl font-semibold text-foreground">
        这一段渲染出错了
      </h1>
      <p className="mb-1 text-sm text-muted-foreground">
        {error.message || "未知错误"}
      </p>
      {error.digest && (
        <p className="mb-6 font-mono text-xs text-muted-foreground/60">
          digest: {error.digest}
        </p>
      )}
      <Button onClick={reset} variant="outline">
        <RotateCcw className="size-4" /> 重试
      </Button>
    </div>
  );
}
