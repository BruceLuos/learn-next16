import Link from "next/link";
import { Lesson } from "@/components/lesson/lesson-layout";
import { Concept } from "@/components/lesson/concept";
import { KeyPoints } from "@/components/lesson/key-points";
import { Demo } from "@/components/lesson/demo";
import { P, H2, UL, LI, Lead, Source } from "@/components/lesson/typography";
import { CodeBlock } from "@/components/code-block";

const items = [
  { slug: "cache-components", title: "Cache Components…" },
  { slug: "turbopack-stable", title: "Turbopack…" },
  { slug: "proxy-ts", title: "proxy.ts…" },
];

export default function Page() {
  return (
    <Lesson
      href="/routing/intercepting"
      title="拦截路由 + 模态框"
      badge="core"
      description="点卡片弹出模态（软导航），刷新或直达则是独立详情页。Instagram / Twitter 的同款交互。"
    >
      <Lead>
        拦截路由让你在「当前页内」拦截一次到某 URL 的导航，改用并行槽渲染（比如弹个模态）；
        而直接访问或刷新同一个 URL，仍走它真正的页面。URL 始终可分享、可刷新。
      </Lead>

      <Concept title="两套行为，一个 URL">
        <UL>
          <LI>
            <strong>软导航（点链接）</strong>：被 <code>(..)</code> 拦截，渲染到{" "}
            <code>@modal</code> 槽里——弹窗。
          </LI>
          <LI>
            <strong>硬导航（直接访问 / 刷新）</strong>：不拦截，渲染真正的{" "}
            <code>[slug]/page.tsx</code>——独立详情页。
          </LI>
        </UL>
      </Concept>

      <H2>目录结构（(..) 语法）</H2>
      <CodeBlock
        code={`app/routing/intercepting/
├─ layout.tsx                  // 渲染 children + @modal 槽
├─ page.tsx                    // 本课（带卡片链接）
├─ [slug]/
│   └─ page.tsx                // 真正的详情页（直达/刷新走这里）
└─ @modal/
    ├─ default.tsx             // 无拦截时返回 null
    └─ (..)[slug]/
        └─ page.tsx            // 拦截一层：渲染模态

// (..) = 拦截上一层的 [slug]；(..)(..) = 上两层；(.) = 同层；(...) = 根`}
        highlight={[5, 9]}
      />

      <Demo
        title="点一下，弹个模态"
        description="点击卡片是软导航 → 弹出模态（URL 变成 /routing/intercepting/<slug>）。在模态里按 F5 刷新 → 变成独立详情页。"
      >
        <div className="grid gap-2 sm:grid-cols-3">
          {items.map((it) => (
            <Link
              key={it.slug}
              href={`/routing/intercepting/${it.slug}`}
              className="rounded-lg border border-border p-3 text-sm hover:bg-muted"
            >
              <div className="font-mono text-[10px] text-muted-foreground">
                /routing/intercepting/{it.slug}
              </div>
              <div className="mt-1 text-foreground">{it.title}</div>
              <div className="mt-2 text-xs text-primary">点击 → 模态</div>
            </Link>
          ))}
        </div>
      </Demo>

      <KeyPoints
        points={[
          "(..)/(..)(..)/(.)/(...) 控制拦截相对层级。",
          "配合并行槽 @modal 实现「软导航弹窗、直达独立页」。",
          "URL 始终可分享可刷新——这是它优于纯前端 modal 的关键。",
          "常用于图片详情、评论展开、商品速览。",
        ]}
      />
      <Source>参考：Next.js「Intercepting Routes」「Parallel Routes」。</Source>
    </Lesson>
  );
}
