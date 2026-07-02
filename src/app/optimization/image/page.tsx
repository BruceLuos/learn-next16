import { Lesson } from "@/components/lesson/lesson-layout";
import { Concept } from "@/components/lesson/concept";
import { Callout } from "@/components/lesson/callout";
import { KeyPoints } from "@/components/lesson/key-points";
import { Demo } from "@/components/lesson/demo";
import { ApiTable } from "@/components/lesson/api-table";
import { P, H2, UL, LI, Lead, Source } from "@/components/lesson/typography";
import { CodeBlock } from "@/components/code-block";
import { ImageDemo } from "@/components/demos/image-demo";

export default function Page() {
  return (
    <Lesson
      href="/optimization/image"
      title="next/image 新默认值"
      badge="breaking"
      description="16 给图片优化换了一批「更安全、更省」的默认值，列表里的每一项都可能影响你。"
    >
      <Lead>
        <code>next/image</code> 在 16 里改了好几个默认值——方向是「更耐用缓存、更小 srcset、更安全」。
        大多数项目受益，但如果你依赖旧行为，这就是破坏性变更。
      </Lead>

      <Concept title="为什么改">
        <P>
          旧默认（如 <code>minimumCacheTTL=60s</code>）会让没有 <code>cache-control</code> 头的图片反复校验，
          造成无谓的 CPU 开销与费用；旧的 <code>qualities=[1..100]</code> 让 srcset 臃肿。新默认更贴合真实场景。
        </P>
      </Concept>

      <ApiTable
        columns={["配置", "15 默认", "16 默认"]}
        rows={[
          ["minimumCacheTTL", "60 秒", "14400 秒（4 小时）"],
          ["imageSizes", "[16,32,48,64,96,128,256,384]", "去掉 16"],
          ["qualities", "[1..100] 全部", "[75]（需显式声明）"],
          ["maximumRedirects", "无限", "3"],
          ["dangerouslyAllowLocalIP", "允许", "默认禁止（私有网络才开）"],
          ["localPatterns.search", "—", "本地图带 query 必须声明"],
        ]}
      />

      <Callout variant="breaking" title="qualities 现在会强制收敛">
        16 默认 <code>qualities=[75]</code>。你传 <code>quality=&#123;30&#125;</code> 不会报错，而是被{" "}
        <strong>收敛到最近的允许值</strong>（→ 75）。要支持多档质量，必须显式配置{" "}
        <code>images.qualities</code>。本项目设为 <code>[50, 75, 100]</code>。
      </Callout>

      <H2>本项目的配置</H2>
      <CodeBlock
        title="next.config.ts"
        code={`images: {
  minimumCacheTTL: 14400,            // 4h
  qualities: [50, 75, 100],          // 显式声明多档
  maximumRedirects: 3,
  remotePatterns: [
    { protocol: "https", hostname: "picsum.photos" },
    { protocol: "https", hostname: "images.unsplash.com" },
  ],
  // 本地图带 query 需要：localPatterns: [{ pathname: "/assets/**", search: "?v=1" }]
}`}
        highlight={[3, 4]}
      />

      <Demo
        title="quality 收敛演示"
        description="下面三张是同一张图，分别请求 quality=30 / 75 / 95。在本项目 [50,75,100] 下，30→50、95→100："
      >
        <ImageDemo />
      </Demo>

      <Callout variant="warning" title="本地图带 query 字符串">
        出于防止枚举攻击，本地图片 <code>src=&quot;/a.jpg?v=1&quot;</code> 现在<strong>必须</strong>在{" "}
        <code>images.localPatterns.search</code> 里声明允许的 query，否则报错。
      </Callout>

      <KeyPoints
        points={[
          "minimumCacheTTL 默认 60s → 4h；imageSizes 去掉 16。",
          "qualities 默认收敛为 [75]，传值会被收敛到最近档。",
          "remotePatterns 取代废弃的 images.domains。",
          "本地图带 query 需声明 localPatterns.search。",
          "images.dangerouslyAllowLocalIP / maximumRedirects 默认更严格。",
        ]}
      />
      <Source>参考：Next.js「Image Component」「Upgrading: Version 16 · next/image changes」。</Source>
    </Lesson>
  );
}
