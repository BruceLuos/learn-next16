import { Lesson } from "@/components/lesson/lesson-layout";
import { Concept } from "@/components/lesson/concept";
import { Callout } from "@/components/lesson/callout";
import { KeyPoints } from "@/components/lesson/key-points";
import { Demo } from "@/components/lesson/demo";
import { ApiTable } from "@/components/lesson/api-table";
import { P, H2, UL, LI, Lead, Source } from "@/components/lesson/typography";
import { CodeBlock } from "@/components/code-block";

export default function Page() {
  return (
    <Lesson
      href="/optimization/tooling"
      title="Turbopack + Devtools MCP"
      badge="new"
      description="16 的工具链：稳定的 Turbopack 默认、磁盘缓存、更细的开发日志，以及给 AI 用的 Devtools MCP。"
    >
      <Lead>
        框架的「使用体验」在 16 大幅提升：构建更快、日志更清晰、还能把应用上下文喂给 AI 助手帮你调试。
      </Lead>

      <Concept title="四件套">
        <UL>
          <LI><strong>Turbopack（稳定，默认）</strong>：Rust 写的打包器，构建快 2-5×、Fast Refresh 快 10×。</LI>
          <LI><strong>文件系统缓存（beta）</strong>：把编译产物存盘，跨重启加速。</LI>
          <LI><strong>日志改进</strong>：开发请求拆出 Compile / Render 耗时；build 每步计时。</LI>
          <LI><strong>Devtools MCP</strong>：把路由/缓存/日志上下文暴露给 AI 编码助手。</LI>
        </UL>
      </Concept>

      <H2>Turbopack 是默认</H2>
      <P>
        新项目 <code>next dev</code> / <code>next build</code> 默认就用 Turbopack，无需 <code>--turbopack</code>。
        配置也从 <code>experimental.turbopack</code> 上移到顶层：
      </P>
      <CodeBlock
        code={`// package.json：不再需要 --turbopack
"scripts": { "dev": "next dev", "build": "next build" }

// next.config.ts
const nextConfig = {
  turbopack: { /* 顶层，原 experimental.turbopack */ },
  experimental: {
    turbopackFileSystemCacheForDev: true, // 磁盘缓存（beta）
  },
};`}
        highlight={[6, 8]}
      />
      <Callout variant="tip" title="本项目就开着">
        你现在跑的 dev 就是 Turbopack（看终端启动行 <code>▲ Next.js 16.2.9 (Turbopack)</code>），
        且开启了文件系统缓存。需要 webpack 时用 <code>next build --webpack</code>。
      </Callout>

      <H2>更细的开发日志</H2>
      <P>
        每个请求现在会拆出耗时来源：<strong>Compile</strong>（路由/编译）与 <strong>Render</strong>（跑你的代码 + React 渲染）。
        build 输出也对每个步骤计时。
      </P>
      <Demo title="真实日志长这样" description="本项目 dev 终端里你会看到类似：">
        <pre className="overflow-x-auto rounded-lg bg-[#0b0e14] p-3 font-mono text-[11px] leading-5 text-zinc-300">
{`▲ Next.js 16.2.9 (Turbopack)
- Local:   http://localhost:3000
✓ Ready in 328ms
- Cache Components enabled

 GET /rendering/cache-components 200 in 311ms (next.js: 69ms, application-code: 243ms)`}
        </pre>
      </Demo>

      <H2>Devtools MCP：让 AI 帮你调 Next</H2>
      <P>
        <strong>Next.js DevTools MCP</strong> 是一个 MCP 服务，给 AI 编码助手提供：路由/缓存/渲染行为知识、
        浏览器+服务端统一日志、自动错误堆栈、当前路由上下文。本项目已配好：
      </P>
      <CodeBlock
        title=".mcp.json"
        code={`{
  "mcpServers": {
    "next-devtools": {
      "command": "npx",
      "args": ["-y", "next-devtools-mcp@latest"]
    }
  }
}`}
      />
      <ApiTable
        columns={["能力", "说明"]}
        rows={[
          ["Next.js 知识", "路由、缓存、渲染行为的上下文"],
          ["统一日志", "浏览器 + 服务端日志，无需切换"],
          ["自动错误", "详细堆栈，免手动复制"],
          ["页面感知", "理解当前激活路由"],
        ]}
      />

      <KeyPoints
        points={[
          "Turbopack 稳定且默认；配置在顶层 turbopack。",
          "turbopackFileSystemCacheForDev 跨重启加速（beta）。",
          "dev 日志拆 Compile/Render；build 每步计时。",
          "Devtools MCP 把应用上下文喂给 AI，辅助调试与升级。",
        ]}
      />
      <Source>参考：Next.js「Turbopack」「Next.js MCP Server」「Upgrading: Version 16」。</Source>
    </Lesson>
  );
}
