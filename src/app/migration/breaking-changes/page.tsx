import { Lesson } from "@/components/lesson/lesson-layout";
import { Concept } from "@/components/lesson/concept";
import { Callout } from "@/components/lesson/callout";
import { KeyPoints } from "@/components/lesson/key-points";
import { ApiTable } from "@/components/lesson/api-table";
import { P, H2, UL, LI, Lead, Source } from "@/components/lesson/typography";
import { CodeBlock } from "@/components/code-block";

export default function Page() {
  return (
    <Lesson
      href="/migration/breaking-changes"
      title="升级到 16 全攻略"
      badge="breaking"
      description="从 15 到 16 的破坏性变更、移除项、与一条命令搞定的 codemod。"
    >
      <Lead>
        把前面各课的「破坏性变更」收拢成一张迁移清单。大多数变更有一行 codemod 自动改，少数需要手动。
      </Lead>

      <Concept title="先用 codemod">
        <P>官方升级 codemod 能自动处理一大批机械变更：</P>
      </Concept>
      <CodeBlock
        code={`# 一键升级到最新（含 16）
pnpm dlx @next/codemod@canary upgrade latest

# 单项：把废弃的 next lint 迁到 ESLint CLI
pnpm dlx @next/codemod@canary next-lint-to-eslint-cli .

# 或让 Devtools MCP 帮你：
# 提示词："Next Devtools, help me upgrade my Next.js app to version 16"`}
      />

      <Callout variant="breaking" title="门槛：Node 20.9+ / TS 5.1+ / 现代浏览器">
        Node 18 不再支持；TypeScript 最低 5.1；浏览器需 Chrome/Edge/Firefox 111+、Safari 16.4+。
      </Callout>

      <H2>① 异步 Request API（最高频）</H2>
      <CodeBlock
        code={`// ❌ 15 同步写法（16 报错）
const token = cookies().get("token");
const { slug } = params;
const q = searchParams.q;

// ✅ 16 全部 await
const token = (await cookies()).get("token");
const { slug } = await params;
const q = (await searchParams).q;`}
      />
      <ApiTable
        columns={["API", "影响位置"]}
        rows={[
          ["params", "layout/page/route/default/OG/icon/apple-icon"],
          ["searchParams", "page"],
          ["cookies() / headers() / draftMode()", "任意服务端"],
          ["OG/icon 的 params、id", "opengraph-image 等"],
          ["sitemap 的 id", "sitemap.ts"],
        ]}
      />

      <H2>② 移除项（Removed）</H2>
      <ApiTable
        columns={["移除", "替代"]}
        rows={[
          ["AMP 全部 API", "移除（用现代优化替代）"],
          ["next lint 命令", "用 ESLint/Biome CLI"],
          ["serverRuntimeConfig / publicRuntimeConfig", "环境变量 + connection()"],
          ["experimental.ppr / dynamicIO / useCache", "cacheComponents"],
          ["experimental.turbopack（位置）", "顶层 turbopack"],
          ["自动 scroll-behavior: smooth", "html 加 data-scroll-behavior=\"smooth\""],
          ["unstable_rootParams", "等待新 API"],
        ]}
      />

      <H2>③ 行为变更（Behavior Changes）</H2>
      <ApiTable
        columns={["变更", "详情"]}
        rows={[
          ["默认打包器", "Turbopack（--webpack 退回）"],
          ["images.minimumCacheTTL", "60s → 4h"],
          ["images.qualities", "[1..100] → [75]，传值被收敛"],
          ["images.imageSizes", "去掉 16"],
          ["images.maximumRedirects", "无限 → 3"],
          ["images.dangerouslyAllowLocalIP", "默认禁止"],
          ["revalidateTag 签名", "必须传第二参 cacheLife profile"],
          ["并行路由 default.js", "每个槽强制要有"],
          ["dev/build 输出目录", "分离（.next/dev），可并发，含锁文件"],
          ["ESLint 插件", "默认 Flat Config"],
        ]}
      />

      <H2>④ 废弃项（Deprecated，未来移除）</H2>
      <ApiTable
        columns={["废弃", "替代"]}
        rows={[
          ["middleware.ts 文件名", "proxy.ts"],
          ["next/legacy/image", "next/image"],
          ["images.domains", "images.remotePatterns"],
          ["revalidateTag 单参数", "revalidateTag(tag, profile) / updateTag"],
        ]}
      />

      <H2>手动检查清单</H2>
      <UL>
        <LI>全局搜 <code>params</code>/<code>searchParams</code>，补 <code>await</code>；用 <code>next typegen</code> 生成 <code>PageProps</code>。</LI>
        <LI><code>middleware.ts</code> → <code>proxy.ts</code>，函数改名、删 <code>runtime=edge</code>。</LI>
        <LI><code>next.config</code>：把 turbopack 提到顶层；评估 <code>cacheComponents</code> 与 <code>reactCompiler</code>。</LI>
        <LI>检查 <code>next/image</code> 用到的 <code>quality</code>，显式配 <code>images.qualities</code>。</LI>
        <LI>清理 <code>next lint</code>、AMP、runtimeConfig 等已移除用法。</LI>
      </UL>

      <KeyPoints
        points={[
          "先跑 @next/codemod upgrade latest 自动处理机械变更。",
          "最高频坑：params/searchParams/cookies/headers 全异步。",
          "middleware→proxy、turbopack 上移、revalidateTag 加第二参。",
          "next/image 一系列默认值变更；并行路由强制 default.js。",
          "门槛：Node 20.9+ / TS 5.1+。",
        ]}
      />
      <Source>参考：Next.js「Upgrading: Version 16」官方升级指南（本手册其余各课展开细节）。</Source>
    </Lesson>
  );
}
