import { Lesson } from "@/components/lesson/lesson-layout";
import { Concept } from "@/components/lesson/concept";
import { Callout } from "@/components/lesson/callout";
import { KeyPoints } from "@/components/lesson/key-points";
import { Demo } from "@/components/lesson/demo";
import { P, H2, UL, LI, Lead, Source } from "@/components/lesson/typography";
import { CodeBlock } from "@/components/code-block";
import { ViewTransitionDemo } from "@/components/demos/view-transition-demo";

export default function Page() {
  return (
    <Lesson
      href="/react19/view-transitions"
      title="View Transitions"
      badge="new"
      description="React 19.2 带来声明式的视图过渡：DOM 变化时自动产生丝滑动画。"
    >
      <Lead>
        View Transitions 让「一次状态变化」自动拥有过渡动画——布局在变、元素在移动，浏览器会算出中间帧并平滑播放。
        React 19.2 把浏览器的 View Transitions API 封装成了声明式组件。
      </Lead>

      <Concept title="两层 API">
        <UL>
          <LI>
            <strong>底层</strong>：浏览器原生 <code>document.startViewTransition(callback)</code>，
            把一次 DOM 更新包成交互过渡。
          </LI>
          <LI>
            <strong>React 19.2</strong>：声明式 <code>&lt;ViewTransition&gt;</code> 组件，给元素命名、跟踪其在前后两帧的位置/尺寸，
            实现 FLIP 动画（自动 morph）。Next 16 还提供 <code>viewTransition</code> 配置为整页导航启用过渡。
          </LI>
        </UL>
      </Concept>

      <Demo
        title="原生 startViewTransition 演示"
        description="点击按钮在「网格 ↔ 行」之间切换，每个色块带 viewTransitionName，浏览器会平滑 morph 它们的位置："
      >
        <ViewTransitionDemo />
      </Demo>

      <H2>React 19.2 声明式用法</H2>
      <CodeBlock
        code={`import { ViewTransition } from "react";

export function Gallery({ items }) {
  return items.map((it) => (
    <ViewTransition key={it.id} name={\`photo-\${it.id}\`}>
      <img src={it.src} style={{ viewTransitionName: \`photo-\${it.id}\` }} />
    </ViewTransition>
  ));
}

// 或在导航时整页过渡：在 next.config 开启 viewTransition
// const nextConfig = { viewTransition: true };`}
        highlight={[5, 11]}
      />

      <Callout variant="tip" title="渐进增强">
        View Transitions 是浏览器能力（Chrome 111+ 等）。不支持的浏览器会<strong>直接降级为无动画</strong>，
        不会报错——本页演示里你也能看到这个 if 分支。
      </Callout>

      <KeyPoints
        points={[
          "底层是 document.startViewTransition；React 19.2 提供 <ViewTransition> 声明式封装。",
          "给元素 viewTransitionName，浏览器自动 morph（FLIP）。",
          "Next 16 的 viewTransition 配置可为整页导航启用过渡。",
          "渐进增强：不支持的浏览器静默降级。",
        ]}
      />
      <Source>参考：React 19.2 发布说明「View Transitions」；Next.js「viewTransition 配置」。</Source>
    </Lesson>
  );
}
