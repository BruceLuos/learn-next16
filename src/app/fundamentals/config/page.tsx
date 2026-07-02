import { Lesson } from "@/components/lesson/lesson-layout";
import { Concept } from "@/components/lesson/concept";
import { Callout } from "@/components/lesson/callout";
import { KeyPoints } from "@/components/lesson/key-points";
import { ApiTable } from "@/components/lesson/api-table";
import { Demo } from "@/components/lesson/demo";
import { P, H2, H3, UL, LI, Lead, Source } from "@/components/lesson/typography";
import { CodeBlock } from "@/components/code-block";
import { EnvDemo } from "@/components/demos/env-demo";

export default function Page() {
  return (
    <Lesson
      href="/fundamentals/config"
      title="next.config.ts 全解"
      badge="new"
      description="本项目的真实配置：cacheComponents、reactCompiler、顶层 turbopack、文件系统缓存、新的 images 默认值。"
    >
      <Lead>
        <code>next.config.ts</code> 是 Next.js 16 几个重磅开关的入口。本项目就跑在你即将看到的这份配置上。
        带 ⭐ 的是 16 的新默认或新位置。
      </Lead>

      <Concept title="16 里配置层的变化">
        <UL>
          <LI>
            <strong>类型优先</strong>：<code>next.config.ts</code> 用原生 TS，并可用{" "}
            <code>--experimental-next-config-strip-types</code> 让 Node 原生执行（无需编译）。
          </LI>
          <LI>
            <strong>Turbopack 配置上移</strong>：从 <code>experimental.turbopack</code> 提升到{" "}
            <strong>顶层 <code>turbopack</code></strong>。
          </LI>
          <LI>
            <strong>缓存模型翻转</strong>：<code>cacheComponents</code> 取代了{" "}
            <code>experimental.dynamicIO</code> 与 <code>experimental.ppr</code>。
          </LI>
          <LI>
            <strong>React Compiler 稳定</strong>：<code>reactCompiler</code> 从 experimental 转正。
          </LI>
          <LI>
            <strong>移除</strong>：<code>serverRuntimeConfig/publicRuntimeConfig</code>、AMP、
            <code>next lint</code>、配置里的 <code>eslint</code> 等。
          </LI>
        </UL>
      </Concept>

      <H2>本项目的真实配置</H2>
      <CodeBlock
        title="next.config.ts"
        code={`import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ⭐ Cache Components：全站默认动态，用 "use cache" 显式缓存 + 完整 PPR
  cacheComponents: true,
  // ⭐ React Compiler：自动 memo（需 babel-plugin-react-compiler）
  reactCompiler: true,
  // ⭐ Turbopack 配置上移到顶层（原 experimental.turbopack）
  turbopack: { resolveAlias: { /* fs: { browser: "./empty.ts" } */ } },
  experimental: {
    // ⭐ Turbopack 文件系统缓存（beta）：跨重启加速
    turbopackFileSystemCacheForDev: true,
  },
  images: {
    minimumCacheTTL: 14400,   // ⭐ 60s → 4 小时
    qualities: [50, 75, 100], // ⭐ 默认收敛为 [75]
    maximumRedirects: 3,      // ⭐ 原为无限
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;`}
        highlight={[5, 7, 9, 11, 14, 16, 17, 18, 19]}
      />

      <Callout variant="tip" title="开箱体验的变化">
        开启 <code>cacheComponents</code> 后，Next.js 的「默认行为」从「能缓存就缓存」翻转为
        「默认全动态、按需缓存」。这更符合你对一个全栈框架的直觉，也是 16 最大的心智模型变化。
      </Callout>

      <H2>关键开关速查</H2>
      <ApiTable
        columns={["选项", "作用", "16 里的变化"]}
        rows={[
          ["cacheComponents", "启用 \"use cache\" + PPR，默认动态渲染", "⭐ 取代 dynamicIO / ppr"],
          ["reactCompiler", "自动 memoization", "⭐ experimental → 稳定"],
          ["turbopack", "Turbopack 配置", "⭐ 上移到顶层"],
          ["turbopackFileSystemCacheForDev", "磁盘缓存编译产物", "⭐ 新增（beta）"],
          ["images.*", "图片优化默认值", "⭐ 多项默认变更"],
        ]}
      />

      <H2>环境变量：connection() 与 taint</H2>
      <P>
        16 移除了 <code>serverRuntimeConfig/publicRuntimeConfig</code>，统一用环境变量。
        服务端直接读 <code>process.env</code>；需要暴露给客户端的用 <code>NEXT_PUBLIC_</code> 前缀
        （构建时内联）。
      </P>
      <Demo title="环境变量的可见性" description="服务端密钥 vs 客户端可见值：">
        <div className="space-y-3 font-mono text-xs">
          <div>
            服务端读取{" "}
            <span className="text-emerald-400">DEMO_SERVER_ONLY_TOKEN</span> ={" "}
            <span className="rounded bg-muted px-1.5 py-0.5 text-foreground">
              {process.env.DEMO_SERVER_ONLY_TOKEN}
            </span>
            <div className="mt-1 text-muted-foreground">
              ↑ 这一行在服务端渲染，密钥不会进 HTML。
            </div>
          </div>
          <div className="border-t border-dashed border-border pt-3">
            ↓ 下面是 Client Component，只能读到 NEXT_PUBLIC_ 前缀的变量：
            <div className="mt-2">
              <EnvDemo />
            </div>
          </div>
        </div>
      </Demo>
      <Callout variant="info" title="运行时读环境变量：connection()">
        默认 <code>process.env.X</code> 在构建时被内联。若要<strong>运行时</strong>读取（部署后改环境变量即生效），
        先 <code>await connection()</code> 再读：
        <CodeBlock
          lang="tsx"
          code={`import { connection } from "next/server";

export default async function Page() {
  await connection(); // 强制按请求读取运行时环境
  const cfg = process.env.RUNTIME_CONFIG;
  return <p>{cfg}</p>;
}`}
        />
      </Callout>

      <H3>保护敏感值：taint API</H3>
      <P>
        担心手滑把服务端密钥当 props 传给客户端组件？用 <code>experimental_taintObjectReference</code> /
        <code>experimental_taintUniqueValue</code> 给敏感值「下毒」，一旦流向客户端就抛错。
      </P>

      <KeyPoints
        points={[
          "next.config.ts 是 16 重磅开关的统一入口，原生 TS。",
          { text: "Cache Components、React Compiler、顶层 Turbopack 配置", code: "都从这里打开" },
          "环境变量取代 runtimeConfig；服务端直接读 env，客户端用 NEXT_PUBLIC_。",
          { text: "运行时读 env", code: "先 await connection()" },
          "敏感值用 taint API 防止意外流入客户端。",
        ]}
      />
      <Source>参考：Next.js 文档「Upgrading: Version 16」「next.config.js Options」。</Source>
    </Lesson>
  );
}
