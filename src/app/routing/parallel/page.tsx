import { Lesson } from "@/components/lesson/lesson-layout";
import { Concept } from "@/components/lesson/concept";
import { Callout } from "@/components/lesson/callout";
import { KeyPoints } from "@/components/lesson/key-points";
import { P, H2, UL, LI, Lead, Source } from "@/components/lesson/typography";
import { CodeBlock } from "@/components/code-block";

export default function Page() {
  return (
    <Lesson
      href="/routing/parallel"
      title="并行路由 + default.js"
      badge="breaking"
      description="一个 layout 同时渲染多个独立的「槽」，它们在同一请求里并行取数；16 起每个槽都强制要有 default.js。"
    >
      <Lead>
        本页下面的两个面板（@stats 与 @feed）就是并行路由。它们各自有独立的 page.tsx，
        在同一次请求里<strong>并行</strong>渲染——一个慢不会阻塞另一个（可各自 Suspense）。
      </Lead>

      <Concept title="并行路由是什么">
        <P>
          用 <code>@</code> 前缀的文件夹定义「槽」（slot）。父 layout 会把这些槽当作命名 props 收到，
          连同 <code>children</code> 一起渲染。常用于仪表盘：左边导航、中间主区、右边实时面板，互不阻塞。
        </P>
      </Concept>

      <H2>目录结构</H2>
      <CodeBlock
        code={`app/routing/parallel/
├─ layout.tsx        // 接收 { children, stats, feed }
├─ page.tsx          // = children（本课正文）
├─ @stats/
│   ├─ page.tsx      // stats 槽
│   └─ default.tsx   // ⭐ 16 强制要求
└─ @feed/
    ├─ page.tsx      // feed 槽
    └─ default.tsx   // ⭐ 16 强制要求`}
        highlight={[6, 9]}
      />

      <H2>layout 接收槽</H2>
      <CodeBlock
        title="app/routing/parallel/layout.tsx"
        code={`export default function ParallelLayout({
  children,
  stats, // 对应 @stats 文件夹
  feed,  // 对应 @feed 文件夹
}: {
  children: ReactNode;
  stats: ReactNode;
  feed: ReactNode;
}) {
  return (
    <>
      {children}
      <Grid>{stats}{feed}</Grid>
    </>
  );
}`}
        highlight={[3, 4]}
      />

      <Callout variant="breaking" title="default.js 不再可选">
        16 起，<strong>所有并行槽都必须有 default.tsx</strong>，否则构建失败。
        想保持旧行为（无匹配时为空），就建一个返回 <code>null</code> 的 default.tsx；
        想兜底 404，就建一个调用 <code>notFound()</code> 的。
      </Callout>

      <H2>独立加载与错误边界</H2>
      <P>
        每个槽都可以有自己的 <code>loading.tsx</code> / <code>error.tsx</code>，
        一个槽出错或加载中，不影响其它槽——这是并行路由最大的工程价值。
      </P>
      <CodeBlock
        code={`// 包一层 Suspense，单个槽慢也不阻塞整页
<Suspense fallback={<Skeleton />}>
  {stats}
</Suspense>
<Suspense fallback={<Skeleton />}>
  {feed}
</Suspense>`}
      />

      <KeyPoints
        points={[
          "@ 前缀文件夹 = 并行槽；layout 按命名 props 收到它们。",
          "各槽独立取数、可独立 Suspense / error，互不阻塞。",
          { text: "16 强制每个槽要有 default.tsx", code: "返回 null 或 notFound()" },
          "适合仪表盘式「多区域同屏」布局。",
        ]}
      />
      <Source>参考：Next.js「Parallel Routes」「default.js」。</Source>
    </Lesson>
  );
}
