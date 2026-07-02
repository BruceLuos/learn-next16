import { Lesson } from "@/components/lesson/lesson-layout";
import { Concept } from "@/components/lesson/concept";
import { Callout } from "@/components/lesson/callout";
import { KeyPoints } from "@/components/lesson/key-points";
import { Demo } from "@/components/lesson/demo";
import { ApiTable } from "@/components/lesson/api-table";
import { P, H2, UL, LI, Lead, Source } from "@/components/lesson/typography";
import { CodeBlock } from "@/components/code-block";
import { CachedFeed } from "@/components/demos/cached-feed";
import { UncachedMetrics } from "@/components/demos/uncached-metrics";
import { RevalidationControls } from "@/components/demos/revalidation-controls";

export default function Page() {
  return (
    <Lesson
      href="/rendering/revalidation"
      title="revalidateTag / updateTag / refresh"
      badge="new"
      description="三种让缓存「失效」的方式，语义完全不同。本页可以亲手点出它们的差别。"
    >
      <Lead>
        数据变了，缓存怎么办？Next.js 16 给了三个语义清晰的工具，分别对应「最终一致」「立即生效」
        和「不碰缓存」。下面这一组按钮是真的能点的——点完看左右两块的变化。
      </Lead>

      <Concept title="三种失效语义">
        <UL>
          <LI>
            <code>revalidateTag(tag, profile)</code>：<strong>SWR（stale-while-revalidate）</strong>。
            标记过期，但本次仍返回旧值，后台再刷新。适合博客、商品目录等可容忍最终一致的内容。
          </LI>
          <LI>
            <code>updateTag(tag)</code>：<strong>read-your-writes</strong>。立即过期并重读，用户当场看到自己的改动。
            <strong>仅 Server Actions 可用</strong>。适合表单、设置等需要即时反馈的场景。
          </LI>
          <LI>
            <code>refresh()</code>：不碰缓存，只刷新<strong>未缓存</strong>的数据。刷新通知数、实时指标等。
            <strong>仅 Server Actions 可用</strong>，是客户端 <code>router.refresh()</code> 的服务端补充。
          </LI>
        </UL>
      </Concept>

      <Callout variant="breaking" title="revalidateTag 签名变了">
        16 起 <code>revalidateTag(&quot;posts&quot;)</code> 单参数写法<strong>已废弃</strong>，会触发 TS 报错。
        必须传第二个 <code>cacheLife</code> profile 参数（如 <code>&quot;max&quot;</code>）来开启 SWR。
      </Callout>

      <H2>三者对照</H2>
      <CodeBlock
        title="app/actions.ts"
        lang="ts"
        code={`"use server";
import { revalidateTag, updateTag, refresh } from "next/cache";

// ① 最终一致：先旧后新
export async function onPublishSWR() {
  revalidateTag("posts", "max"); // 第二参 = cacheLife profile
}
// ② 立即生效：read-your-writes（仅 Server Action）
export async function onUpvote() {
  await db.posts.upvote(id);
  updateTag("posts");
}
// ③ 只刷未缓存数据（仅 Server Action）
export async function onMarkRead() {
  await db.notifications.markRead(id);
  refresh();
}`}
        highlight={[6, 12, 18]}
      />

      <Demo
        title="亲手点出差别"
        description="左侧是被 cacheTag('posts') 缓存的帖子列表；右下是未缓存的实时指标。点下面三个按钮，观察左右变化（重点看第一条帖子『Cache Components…』的点赞数 ▲ 与 fetchedAt）。"
      >
        <div className="mb-4">
          <RevalidationControls postId="cache-components" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <CachedFeed />
          <UncachedMetrics />
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">
          提示：① 点完帖子点赞数立刻 +1；② 点完这次还是旧的，再刷新一次页面才 +1（SWR）；③ 点完帖子不变、指标变。
        </p>
      </Demo>

      <ApiTable
        columns={["API", "语义", "可用范围", "返回行为"]}
        rows={[
          ["revalidateTag(tag, profile)", "SWR 失效", "任意服务端", "本次旧值，后台刷新"],
          ["updateTag(tag)", "read-your-writes", "仅 Server Actions", "立即重读，当场新值"],
          ["refresh()", "刷新未缓存数据", "仅 Server Actions", "未缓存数据按请求重算"],
        ]}
      />

      <KeyPoints
        points={[
          { text: "revalidateTag 第二参必填", code: "revalidateTag('posts', 'max')" },
          "updateTag 提供 read-your-writes，仅 Server Actions 可用。",
          "refresh() 只刷未缓存数据，缓存内容原样不动。",
          "对应客户端的 router.refresh() 是 refresh() 的补充。",
          "选型：可容忍最终一致用 SWR；需要即时反馈用 updateTag；只更新动态指标用 refresh。",
        ]}
      />
      <Source>参考：Next.js「Caching」「Revalidating」「How Revalidation Works」。</Source>
    </Lesson>
  );
}
