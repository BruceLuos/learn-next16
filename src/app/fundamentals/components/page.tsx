import { Lesson } from "@/components/lesson/lesson-layout";
import { Concept } from "@/components/lesson/concept";
import { Callout } from "@/components/lesson/callout";
import { KeyPoints } from "@/components/lesson/key-points";
import { Demo } from "@/components/lesson/demo";
import { P, H2, H3, UL, LI, Lead, Source } from "@/components/lesson/typography";
import { CodeBlock } from "@/components/code-block";
import { CounterDemo } from "@/components/demos/counter-demo";

export default function Page() {
  return (
    <Lesson
      href="/fundamentals/components"
      title="Server / Client 组件"
      badge="core"
      description="App Router 的基石：哪些代码在服务端跑、哪些进了浏览器 bundle，以及它们如何组合。"
    >
      <Lead>
        理解 Next.js（乃至整个 React 19）的第一道分水岭，就是分清{" "}
        <strong>Server Components</strong> 和 <strong>Client Components</strong>。
        本手册的每一节课都建立在这个边界之上。
      </Lead>

      <Concept title="为什么要分两种组件">
        <P>
          传统 SPA 把整个组件树都送到浏览器，导致首屏要下载并执行大量 JS。
          RSC（React Server Components）把这一半工作搬回服务端：那些{" "}
          <strong>不需要交互、不需要浏览器 API</strong> 的组件，直接在服务端渲染成 HTML，
          <strong>其代码根本不会进入客户端 bundle</strong>。
        </P>
        <P>于是有了默认与显式两种身份：</P>
        <UL>
          <LI>
            <strong>Server Component（默认）</strong>：async、可直连数据库/文件系统/密钥、零客户端 JS。
          </LI>
          <LI>
            <strong>Client Component</strong>：文件顶部声明{" "}
            <code>&quot;use client&quot;</code>，能用 useState/useEffect/事件、访问 window，
            其代码会被打包进浏览器。
          </LI>
        </UL>
      </Concept>

      <H2>Server Component：默认身份</H2>
      <P>
        在 <code>app/</code> 目录下的组件默认都是服务端组件。它可以是 async，能直接 await 数据：
      </P>
      <CodeBlock
        title="app/fundamentals/components/page.tsx"
        code={`// 没有 "use client" → 默认就是 Server Component
import { getCachedPosts } from "@/lib/cache";

export default async function Page() {
  // 直接 await，无需 useEffect、无需 fetch 包装
  const { data: posts } = await getCachedPosts();

  return (
    <ul>
      {posts.map((p) => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  );
}`}
      />

      <H2>Client Component：声明 &quot;use client&quot;</H2>
      <P>需要交互（状态、事件、浏览器 API）时，在文件首行声明：</P>
      <CodeBlock
        title="components/demos/counter-demo.tsx"
        code={`"use client"; // ← 这一行把它变成 Client Component

import { useState } from "react";

export function CounterDemo() {
  const [n, setN] = useState(0); // useState 只能在客户端组件里用
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}`}
      />

      <Demo title="可交互的客户端组件" description="下面这个计数器就是 Client Component，点击有反应；而它外层这一整页都是 Server Component。">
        <CounterDemo />
      </Demo>

      <H2>组合模式：服务端组件渲染客户端组件</H2>
      <P>
        最常见的模式：Server Component 负责取数据，把<strong>可序列化的 props</strong> 传给 Client
        Component 渲染交互。本页正是这么做的：
      </P>
      <CodeBlock
        code={`// app/.../page.tsx —— Server Component
import { CounterDemo } from "@/components/demos/counter-demo";

export default function Page() {
  return (
    <main>
      <h1>整页在服务端渲染</h1>
      <CounterDemo /> {/* 交互部分交给客户端组件 */}
    </main>
  );
}`}
        highlight={[5]}
      />

      <Callout variant="warning" title="props 必须可序列化">
        从 Server Component 传给 Client Component 的 props，必须是{" "}
        <strong>可被 JSON 序列化</strong>的值（字符串、数字、数组、普通对象）。
        不能传函数、不能传 Class 实例、不能传 <code>Date</code> 之外复杂对象。需要传函数时，
        把客户端组件需要的能力做成 <code>&quot;use server&quot;</code> 的 Server Action 再传。
      </Callout>

      <H3>边界划在哪里</H3>
      <UL>
        <LI>能不写 <code>&quot;use client&quot;</code> 就不写 —— 让代码留在服务端。</LI>
        <LI>叶子节点（按钮、输入框、带事件的组件）做成客户端组件。</LI>
        <LI>layout/page 尽量保持服务端组件，交互下沉到子组件。</LI>
      </UL>

      <KeyPoints
        points={[
          "app/ 下默认是 Server Component；\"use client\" 显式声明 Client Component。",
          "Server Component 可 async、可直连数据源、不进客户端 bundle。",
          "Client Component 才能用 useState/useEffect/事件/window。",
          { text: "跨边界传 props 必须可序列化；", code: "函数 → 用 Server Action" },
          "策略：把 \"use client\" 下沉到叶子节点，保持上层服务端化。",
        ]}
      />

      <Source>
        参考：Next.js 文档「Server and Client Components」「Fetching Data」。
      </Source>
    </Lesson>
  );
}
