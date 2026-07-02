import Link from "next/link";
import { Lesson } from "@/components/lesson/lesson-layout";
import { Concept } from "@/components/lesson/concept";
import { Callout } from "@/components/lesson/callout";
import { KeyPoints } from "@/components/lesson/key-points";
import { Demo } from "@/components/lesson/demo";
import { P, H2, UL, LI, Lead, Source } from "@/components/lesson/typography";
import { CodeBlock } from "@/components/code-block";

const slugs = [
  "cache-components",
  "turbopack-stable",
  "proxy-ts",
  "react-19-2",
];

export default function Page() {
  return (
    <Lesson
      href="/routing/dynamic-params"
      title="动态路由 + 异步 params"
      badge="breaking"
      description="16 最常踩的破坏性变更：params / searchParams 现在是 Promise，必须 await。"
    >
      <Lead>
        动态段 <code>[slug]</code> 一直都在，但 16 给它戴上了一顶「Promise 帽子」。这是从 15 升 16
        最普遍的编译报错来源，也是本课的重点。
      </Lead>

      <Concept title="为什么 params 变成异步">
        <P>
          为了让 Next.js 能更准确地判断一个路由能不能静态生成，15 引入了「Async Request APIs」作为
          破坏性变更（附带临时同步兼容），<strong>16 彻底移除同步访问</strong>。现在{" "}
          <code>params</code>、<code>searchParams</code> 都是 Promise，必须 <code>await</code>。
        </P>
        <P>受益：你不再需要手动用 <code>force-dynamic</code>，框架根据你是否 await 请求级数据来判定渲染时机。</P>
      </Concept>

      <H2>15 vs 16 写法对照</H2>
      <CodeBlock
        code={`// ❌ Next.js 15（同步，16 里会报错）
export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  return <h1>{slug}</h1>;
}

// ✅ Next.js 16（异步）
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // 必须 await
  return <h1>{slug}</h1>;
}`}
        highlight={[11]}
      />

      <H2>用 PageProps 拿到带类型的 params（推荐）</H2>
      <P>
        手写 <code>Promise&gt;{`{ slug: string }`}&lt;</code> 很啰嗦。运行{" "}
        <code>next typegen</code> 后，Next 会为你生成全局类型{" "}
        <code>PageProps</code>、<code>LayoutProps</code>、<code>RouteContext</code>，
        直接按路径取类型：
      </P>
      <CodeBlock
        title="app/routing/dynamic-params/[slug]/page.tsx"
        code={`// 路径字符串就是字面路由，params/searchParams 自动推断
export default async function Page(
  props: PageProps<"/routing/dynamic-params/[slug]">,
) {
  const { slug } = await props.params;
  const query = await props.searchParams; // searchParams 也是 Promise
  return <h1>slug = {slug}</h1>;
}`}
        highlight={[3, 5, 6]}
      />

      <Callout variant="breaking" title="所有「请求级」API 都异步了">
        16 里这些都必须 await：<code>params</code>、<code>searchParams</code>、
        <code>cookies()</code>、<code>headers()</code>、<code>draftMode()</code>；连 icon / OG 图 /
        sitemap 接收的 <code>params</code> 与 <code>id</code> 也变成了 Promise。
      </Callout>

      <H2>预生成已知路径：generateStaticParams</H2>
      <CodeBlock
        code={`export async function generateStaticParams() {
  // 构建时预渲染这几个 slug；其余按需（dynamicParams）动态生成
  return [
    { slug: "cache-components" },
    { slug: "turbopack-stable" },
  ];
}`}
      />

      <Demo
        title="点进真实动态路由"
        description="下面的链接指向本课的 [slug] 子路由，每篇都是从「内存数据库」按 slug 取出的（且被缓存）："
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {slugs.map((s) => (
            <Link
              key={s}
              href={`/routing/dynamic-params/${s}`}
              className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted"
            >
              <span className="font-mono text-xs text-muted-foreground">
                /routing/dynamic-params/
                <span className="text-foreground">{s}</span>
              </span>
              <span className="text-muted-foreground">→</span>
            </Link>
          ))}
        </div>
      </Demo>

      <KeyPoints
        points={[
          { text: "params / searchParams 是 Promise", code: "const { slug } = await params" },
          "cookies()/headers()/draftMode() 也都必须 await。",
          "用 PageProps<'/路径'> 拿到带类型的 params（需 next typegen）。",
          "generateStaticParams 仍可用于预生成已知动态段。",
        ]}
      />
      <Source>参考：Next.js「Upgrading: Version 16 · Async Request APIs」「Dynamic Routes」。</Source>
    </Lesson>
  );
}
