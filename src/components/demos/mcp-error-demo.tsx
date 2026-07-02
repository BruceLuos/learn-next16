"use client";

import { Component, useState, type ReactNode } from "react";
import { Bomb, RotateCcw, Eye, Terminal } from "lucide-react";

/**
 * MCP 调试演示：亲手触发一个 browser 渲染错误，对照「页面里人眼看到的」
 * 与「MCP get_errors 看到的结构化数据」。
 * 用一个隔离的 ErrorBoundary 包住，错误只在本 demo 子树内被捕获，不会炸掉整页。
 */

/** 隔离错误边界：只捕获本 demo 子树的渲染错误；resetToken 变化即视为「已修复」并清空错误。 */
class LocalErrorBoundary extends Component<
  { resetToken: number; children: (error: Error | null) => ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidUpdate(prevProps: { resetToken: number }) {
    if (prevProps.resetToken !== this.props.resetToken && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    return this.props.children(this.state.error);
  }
}

/** boom=true 时在渲染期抛错（browser 运行时错误）。 */
function Boomer({ boom }: { boom: boolean }) {
  if (boom) throw new Error("渲染期抛错（MCP 演示）");
  return null;
}

/** MCP get_errors 对应的结构化视角（示意；浏览器侧拿不到真实 MCP 输出）。 */
const MCP_VIEW = `{
  "url": "/optimization/tooling",
  "runtimeErrors": [{
    "type": "runtime",
    "errorName": "Error",
    "message": "渲染期抛错（MCP 演示）",
    "stack": [
      { "file": "mcp-error-demo.tsx", "methodName": "Boomer",       "line": 30 },
      { "file": "mcp-error-demo.tsx", "methodName": "McpErrorDemo", "line": 68 }
    ]
  }]
}`;

export function McpErrorDemo() {
  const [resetToken, setResetToken] = useState(0);
  const [boom, setBoom] = useState(false);

  return (
    <LocalErrorBoundary resetToken={resetToken}>
      {(error) =>
        error ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <Eye className="size-3.5" /> 人眼看到的（页面 / console）
                </div>
                <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-center">
                  <div className="mb-2 text-3xl">💥</div>
                  <div className="text-sm font-semibold text-foreground">这一段渲染出错了</div>
                  <div className="mt-1 text-xs text-muted-foreground">{error.message}</div>
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <Terminal className="size-3.5" /> MCP get_errors 看到的
                </div>
                <pre className="overflow-x-auto rounded-lg bg-[#0b0e14] p-3 font-mono text-[11px] leading-5 text-zinc-300">
{MCP_VIEW}
                </pre>
              </div>
            </div>
            <p className="text-xs leading-6 text-muted-foreground">
              同一个错误：左边是红色 UI / console 文本，右边是带{" "}
              <code className="text-foreground">file / methodName / line</code> 的结构化数据——
              AI 拿到右边就能直接定位，零猜测。
            </p>
            <button
              onClick={() => {
                setBoom(false);
                setResetToken((t) => t + 1);
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted"
            >
              <RotateCcw className="size-3.5" /> 重置（修复 → 清零）
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setBoom(true)}
              className="inline-flex items-center gap-1.5 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-destructive/10"
            >
              <Bomb className="size-3.5" /> 触发渲染错误
            </button>
            <span className="text-xs leading-6 text-muted-foreground">
              点一下，让 <code className="text-foreground">Boomer</code> 在渲染时{" "}
              <code className="text-foreground">throw</code>——这是一个真实的 browser 运行时错误，
              会被本 demo 的隔离边界捕获（不波及整页）。
            </span>
            <Boomer boom={boom} />
          </div>
        )
      }
    </LocalErrorBoundary>
  );
}
