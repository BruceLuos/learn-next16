import { Lesson } from "@/components/lesson/lesson-layout";
import { Concept } from "@/components/lesson/concept";
import { Callout } from "@/components/lesson/callout";
import { KeyPoints } from "@/components/lesson/key-points";
import { Demo } from "@/components/lesson/demo";
import { ApiTable } from "@/components/lesson/api-table";
import { P, H2, H3, UL, LI, Lead, Source } from "@/components/lesson/typography";
import { CodeBlock } from "@/components/code-block";

export default function Page() {
  return (
    <Lesson
      href="/optimization/metadata"
      title="Metadata + 动态 OG 图"
      badge="new"
      description="generateMetadata、文件约定（opengraph-image/icon/sitemap…），以及 16 里它们 params 也变异步。"
    >
      <Lead>
        Next.js 用一套「Metadata API」管理 <code>&lt;head&gt;</code>：静态 <code>metadata</code> 对象、
        动态 <code>generateMetadata</code> 函数，以及一堆文件约定（opengraph-image、icon、sitemap、robots…）。
        本路由的 OG 图就是用 <code>opengraph-image.tsx</code> 动态生成的。
      </Lead>

      <Concept title="三种声明方式">
        <UL>
          <LI><strong>静态</strong>：<code>export const metadata</code>，适合不变的内容。</LI>
          <LI><strong>动态</strong>：<code>export async function generateMetadata()</code>，可取数、可读 params。</LI>
          <LI><strong>文件约定</strong>：在路由里放 <code>opengraph-image.tsx</code> / <code>icon.tsx</code> / <code>sitemap.ts</code> / <code>robots.ts</code> 等，自动生效。</LI>
        </UL>
      </Concept>

      <H2>generateMetadata（params 也是 Promise）</H2>
      <CodeBlock
        code={`import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params; // 16：异步
  const post = await getPost(slug);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { images: ["/og/" + slug + ".png"] },
  };
}`}
        highlight={[6]}
      />

      <Callout variant="breaking" title="OG 图 / icon / sitemap 的参数都异步了">
        16 起，<code>opengraph-image</code> / <code>icon</code> / <code>apple-icon</code> 生成函数收到的{" "}
        <code>params</code> 与 <code>id</code> 都是 Promise；<code>sitemap</code> 收到的 <code>id</code> 也是。
        都要 <code>await</code>。
      </Callout>

      <H2>本路由的 OG 图就是这么来的</H2>
      <CodeBlock
        title="app/optimization/metadata/opengraph-image.tsx"
        code={`import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (<div style={{ background: "#0a0a0a", color: "white", padding: 64 }}>
       <h1>Metadata 与动态 OG 图</h1>
     </div>),
    { ...size },
  );
}`}
        highlight={[1, 6]}
      />

      <Demo title="查看本路由的 OG 图" description="直接访问下面的 URL，返回的就是上面代码动态生成的 PNG：">
        <a
          href="/optimization/metadata/opengraph-image"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 font-mono text-xs hover:bg-muted"
        >
          /optimization/metadata/opengraph-image ↗
        </a>
      </Demo>

      <ApiTable
        columns={["文件约定", "作用"]}
        rows={[
          ["favicon.ico / icon.tsx", "站点图标"],
          ["opengraph-image.tsx", "社交分享 OG 图（本课用的）"],
          ["twitter-image.tsx", "Twitter/X 分享图"],
          ["sitemap.ts", "动态站点地图"],
          ["robots.ts", "动态 robots.txt"],
          ["manifest.json", "PWA manifest"],
        ]}
      />

      <KeyPoints
        points={[
          "静态 metadata / 动态 generateMetadata / 文件约定三种方式。",
          "generateMetadata 与 OG/icon/sitemap 的 params、id 在 16 都是 Promise。",
          "opengraph-image.tsx + next/og 的 ImageResponse 动态画图。",
          "文件约定自动生效，无需手动 link。",
        ]}
      />
      <Source>参考：Next.js「Metadata and OG images」「generateMetadata」「generateImageMetadata」。</Source>
    </Lesson>
  );
}
