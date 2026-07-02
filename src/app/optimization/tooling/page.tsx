import { Lesson } from "@/components/lesson/lesson-layout";
import { Concept } from "@/components/lesson/concept";
import { Callout } from "@/components/lesson/callout";
import { KeyPoints } from "@/components/lesson/key-points";
import { Demo } from "@/components/lesson/demo";
import { ApiTable } from "@/components/lesson/api-table";
import { P, H2, H3, UL, LI, Lead, Source } from "@/components/lesson/typography";
import { CodeBlock } from "@/components/code-block";
import { McpErrorDemo } from "@/components/demos/mcp-error-demo";

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

      <H3>实战：三类错误，分别用哪个工具</H3>
      <P>
        <code>get_errors</code> 是这套 MCP 里最常用的调试工具，但它<strong>有盲区</strong>——
        并非所有错误都能在它里面看到。下面这张表是踩坑后总结的覆盖范围：
      </P>
      <ApiTable
        columns={["错误类型", "get_errors", "看不到时找谁"]}
        rows={[
          ["编译 / 语法错误", "✅ 抓到（带 source-map，定位到行:列）", "—"],
          ["server 运行时错误", "❌ 抓不到（被 error.tsx 吞成 HTTP 200）", "get_logs → dev 日志（source: Server）"],
          ["browser 运行时错误", "✅ 抓到（真 JS 调用栈 + 组件树）", "—"],
        ]}
      />
      <P>
        其中 <strong>browser 运行时错误</strong> 最有价值——返回的是结构化的组件调用栈，
        AI 拿到就能直接定位，无需肉眼解析终端红字：
      </P>
      <CodeBlock
        title="get_errors 返回（browser runtime，节选）"
        code={`{
  "url": "/react19/compiler",
  "runtimeErrors": [{
    "type": "runtime",
    "errorName": "Error",
    "message": "FilteredList render 抛错",
    "stack": [
      { "file": "compiler-demo.tsx", "methodName": "FilteredList",  "line": 23 },
      { "file": "compiler-demo.tsx", "methodName": "CompilerDemo",  "line": 60 },
      { "file": "page.tsx",           "methodName": "Page",          "line": 70 }
    ]
  }]
}`}
      />
      <Callout variant="warning" title={`最大的坑：server 错误会"藏"起来`}>
        server component 里 <code>throw</code> 在 dev 下会被 <code>error.tsx</code> 边界捕获，<strong>HTTP 仍是 200</strong>，
        <code>get_errors</code> 也看不到。这类错误只在 <code>get_logs</code> 返回的 dev 日志里（<code>source: Server</code>）。
        页面"看着正常却行为异常"时，第一时间 <code>get_logs</code>。
      </Callout>
      <Demo title="调试决策树" description="出错时按这个顺序找工具：">
        <pre className="overflow-x-auto rounded-lg bg-[#0b0e14] p-3 font-mono text-[11px] leading-5 text-zinc-300">
{`编译挂了 / 直接 500          → get_errors        （build error，带 source-map）
页面 200 但白屏 / 行为异常    → 先 get_errors → 空的？→ get_logs （server runtime 藏在这）
某页渲染了哪些层 / 为何动态   → get_page_metadata
全站路由 / Action 在哪定义    → get_routes / get_server_action_by_id`}
        </pre>
      </Demo>

      <Demo
        title="亲手试：触发一个 browser 运行时错误"
        description="只有 browser 运行时错误能在浏览器里真实触发。点按钮让组件渲染时 throw，对照「页面里人眼看到的」与「MCP get_errors 看到的结构化数据」；编译错误 / server 运行时无法在此触发，覆盖范围见上方对照表。"
      >
        <McpErrorDemo />
      </Demo>

      <KeyPoints
        points={[
          "Turbopack 稳定且默认；配置在顶层 turbopack。",
          "turbopackFileSystemCacheForDev 跨重启加速（beta）。",
          "dev 日志拆 Compile/Render；build 每步计时。",
          "Devtools MCP 把应用上下文喂给 AI，辅助调试与升级。",
          "get_errors 抓编译 / browser 运行时错误；server 运行时错误要靠 get_logs。",
        ]}
      />
      <Source>参考：Next.js「Turbopack」「Next.js MCP Server」「Upgrading: Version 16」。</Source>
    </Lesson>
  );
}
