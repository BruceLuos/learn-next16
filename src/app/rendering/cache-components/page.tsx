import { Suspense } from "react";
import { Lesson } from "@/components/lesson/lesson-layout";
import { Concept } from "@/components/lesson/concept";
import { Callout } from "@/components/lesson/callout";
import { KeyPoints } from "@/components/lesson/key-points";
import { Demo } from "@/components/lesson/demo";
import { ApiTable } from "@/components/lesson/api-table";
import { P, H2, H3, UL, LI, Lead, Source } from "@/components/lesson/typography";
import { CodeBlock } from "@/components/code-block";
import { CachedFeed } from "@/components/demos/cached-feed";
import { DynamicFeed } from "@/components/demos/dynamic-feed";

export default function Page() {
  return (
    <Lesson
      href="/rendering/cache-components"
      title="Cache Components + 'use cache'"
      badge="new"
      description={'Next.js 16 缓存的心脏：默认全动态，用 "use cache" 精确选择缓存，并完整启用 PPR。'}
    >
      <Lead>
        这是 16 最大的变化。过去 App Router 「能缓存就缓存」，开发者要靠{" "}
        <code>{`{ cache: 'no-store' }`}</code> 关缓存；16 翻转过来：<strong>默认一切动态</strong>，
        你用 <code>&quot;use cache&quot;</code> 主动声明「这一段可以缓存」。
      </Lead>

      <Concept title="翻转的心智模型">
        <P>
          <strong>之前</strong>：页面/组件默认被尝试静态化与缓存，数据获取默认缓存（fetch 的隐式
          cache）。开发者要「退出」缓存。
        </P>
        <P>
          <strong>16（开启 cacheComponents）</strong>：所有动态代码（读时间、读 DB、读 cookie）默认
          每次请求都执行；只有你用 <code>&quot;use cache&quot;</code> 标记的页面/组件/函数才会被缓存。
          这与一个全栈框架「按请求执行」的直觉一致。
        </P>
        <P>
          <code>&quot;use cache&quot;</code> 配合编译器自动生成缓存键，可放在函数、组件、甚至整个文件顶部。
          它同时完成了 <strong>PPR（Partial Pre-Rendering）</strong>：静态部分预渲染为壳，动态部分用
          Suspense 留成「洞」，首屏秒开、动态数据稍后流入。
        </P>
      </Concept>

      <H2>开启它</H2>
      <CodeBlock
        title="next.config.ts"
        code={`const nextConfig = {
  // 取代了 experimental.dynamicIO 与 experimental.ppr
  cacheComponents: true,
};`}
        highlight={[3]}
      />
      <Callout variant="breaking" title="旧的 PPR 标志已移除">
        <code>experimental.ppr</code>、<code>experimental.dynamicIO</code>、路由段的{" "}
        <code>export const experimental_ppr</code> 在 16 全部移除，统一收敛进{" "}
        <code>cacheComponents</code>。
      </Callout>

      <H2>三种用法</H2>
      <CodeBlock
        title="lib/cache.ts"
        code={`import { cacheLife, cacheTag } from "next/cache";

// ① 缓存一个函数的返回值
export async function getCachedPosts() {
  "use cache";              // ← 编译器据此生成缓存键
  cacheLife("minutes");     // 寿命 profile
  cacheTag("posts");        // 打标签，便于精确失效
  return getPosts();
}

// ② 直接缓存一个组件（本项目里的 <CodeBlock> 就是这么做的）
export async function Profile({ id }: { id: string }) {
  "use cache";
  cacheLife("hours");
  const user = await db.user.find(id);
  return <Card>{user.name}</Card>;
}`}
        highlight={[6, 7, 8, 14, 15]}
      />

      <H2>在线演示：缓存 vs 动态（顺带看 PPR）</H2>
      <P>
        下面两块在同一页：<strong>左</strong>是被 <code>&quot;use cache&quot;</code> 缓存的，
        <strong>右</strong>是每次请求都跑的动态数据（用 Suspense 包裹）。
        多次刷新本页：左侧 <code>fetchedAt</code> 与 <code>latency</code> 几乎不变（命中缓存），
        右侧每次都是「现在」、且有 ~700ms 延迟。右侧先显示骨架、再流入——这就是 PPR 的「静态壳 + 动态洞」。
      </P>
      <Demo title="缓存命中 vs 实时动态">
        <div className="grid gap-4 sm:grid-cols-2">
          <CachedFeed />
          <Suspense
            fallback={
              <div className="flex h-full min-h-32 items-center justify-center rounded-xl border border-dashed border-border text-xs text-muted-foreground">
                <span className="animate-pulse">流式加载动态数据中…（PPR 洞）</span>
              </div>
            }
          >
            <DynamicFeed />
          </Suspense>
        </div>
      </Demo>

      <Callout variant="tip" title="为什么「读时间」会报错">
        开启 cacheComponents 后，服务端组件里直接 <code>Date.now()</code> /{" "}
        <code>new Date()</code> 会报错——因为「当前时间」是动态的。要么把这段放进{" "}
        <code>&quot;use cache&quot;</code>（缓存时刻冻结时间），要么先{" "}
        <code>await connection()</code> 把组件标记为按请求动态。本页右侧的动态 Feed 正是后者。
      </Callout>

      <H2>PPR：静态壳 + 动态洞</H2>
      <ApiTable
        columns={["", "静态部分（壳）", "动态部分（洞）"]}
        rows={[
          ["来源", "没有访问动态数据 / 被 use cache", "读了 cookie/时间/DB 且未缓存"],
          ["何时渲染", "构建时预渲染", "请求时（可流式）"],
          ["首屏", "立即", "Suspense fallback 先行"],
        ]}
      />

      <KeyPoints
        points={[
          "开启 cacheComponents 后默认全动态，用 \"use cache\" 主动缓存。",
          "\"use cache\" 可放函数/组件/文件顶部；配合 cacheLife 定寿命、cacheTag 打标签。",
          "读「当前时间」要么进 use cache、要么先 await connection()。",
          "Cache Components 完整启用 PPR：静态壳 + Suspense 动态洞。",
          "旧的 experimental.ppr / dynamicIO / experimental_ppr 已全部移除。",
        ]}
      />
      <Source>参考：Next.js「Directives: use cache」「cacheComponents 配置」「Migrating to Cache Components」。</Source>
    </Lesson>
  );
}
