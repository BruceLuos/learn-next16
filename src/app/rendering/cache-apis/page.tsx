import { Lesson } from "@/components/lesson/lesson-layout";
import { Concept } from "@/components/lesson/concept";
import { Callout } from "@/components/lesson/callout";
import { KeyPoints } from "@/components/lesson/key-points";
import { Demo } from "@/components/lesson/demo";
import { ApiTable } from "@/components/lesson/api-table";
import { P, H2, UL, LI, Lead, Source } from "@/components/lesson/typography";
import { CodeBlock } from "@/components/code-block";
import { CachedFeed } from "@/components/demos/cached-feed";

export default function Page() {
  return (
    <Lesson
      href="/rendering/cache-apis"
      title="cacheLife / cacheTag"
      badge="new"
      description={'给 "use cache" 配寿命与标签：16 里这两个 API 从 unstable_ 转正。'}
    >
      <Lead>
        <code>&quot;use cache&quot;</code> 只说「这段要缓存」，但缓存多久、怎么失效，由{" "}
        <code>cacheLife</code> 与 <code>cacheTag</code> 这对搭档决定。两者在 16 都已稳定，
        不再需要 <code>unstable_</code> 前缀。
      </Lead>

      <Concept title="寿命与标签">
        <UL>
          <LI>
            <code>cacheLife(profile)</code>：在 <code>&quot;use cache&quot;</code> 作用域内调用，
            设定缓存的「新鲜 → 可后台刷新 → 过期」三段寿命。
          </LI>
          <LI>
            <code>cacheTag(...tags)</code>：给这条缓存打标签，之后可用{" "}
            <code>revalidateTag</code>/<code>updateTag</code> 按 tag 精确失效。
          </LI>
        </UL>
      </Concept>

      <H2>内置 cacheLife profile</H2>
      <ApiTable
        columns={["profile", "大致语义", "典型场景"]}
        rows={[
          ["\"seconds\"", "秒级", "极高实时性"],
          ["\"minutes\"", "分钟级", "列表、动态 feed（本页演示用）"],
          ["\"hours\"", "小时级", "仪表盘"],
          ["\"days\"", "天级", "文档、配置"],
          ["\"weeks\"", "周级", "几乎不变的内容"],
          ["\"max\"", "尽可能长 + 后台刷新", "配合 revalidateTag 的 SWR"],
        ]}
      />

      <H2>用法</H2>
      <CodeBlock
        title="lib/cache.ts"
        code={`import { cacheLife, cacheTag } from "next/cache"; // 16 起稳定导出

export async function getCachedPosts() {
  "use cache";
  cacheLife("minutes");      // 选一个寿命 profile
  cacheTag("posts", "feed"); // 打一个或多个标签
  return getPosts();
}`}
        highlight={[5, 6]}
      />

      <Callout variant="tip" title="告别 unstable_ 前缀">
        之前你可能写过 <code>{`import { unstable_cacheLife as cacheLife }`}</code>，现在直接{" "}
        <code>{`import { cacheLife, cacheTag } from "next/cache"`}</code> 即可。
      </Callout>

      <H2>自定义 profile</H2>
      <P>
        内置的不够用？在 <code>next.config.ts</code> 里定义自己的 profile，然后在{" "}
        <code>cacheLife</code> 里引用：
      </P>
      <CodeBlock
        title="next.config.ts"
        code={`const nextConfig = {
  cacheLife: {
    // 自定义 profile：stale=新鲜期，revalidate=后台刷新点，expire=硬过期
    "my-fast": { stale: 0, revalidate: 3, expire: 30 },
  },
};

// 使用：
// cacheLife("my-fast");`}
      />

      <Demo title="一个被打标签、定寿命的缓存" description="下面的列表就是 getCachedPosts()：cacheLife('minutes') + cacheTag('posts')。在分钟级寿命内多次刷新，fetchedAt 冻结；到点或被 revalidateTag/updateTag 失效后才更新。">
        <CachedFeed />
      </Demo>

      <KeyPoints
        points={[
          "cacheLife / cacheTag 在 16 已稳定，无需 unstable_ 前缀。",
          "cacheLife 选寿命 profile；cacheTag 打标签供精确失效。",
          "可在 next.config.cacheLife 里自定义 profile（stale/revalidate/expire）。",
          "二者只能在 \"use cache\" 作用域内调用。",
        ]}
      />
      <Source>参考：Next.js「cacheLife」「cacheTag」「Caching」。</Source>
    </Lesson>
  );
}
