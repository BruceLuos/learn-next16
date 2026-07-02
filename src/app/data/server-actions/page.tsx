import { Lesson } from "@/components/lesson/lesson-layout";
import { Concept } from "@/components/lesson/concept";
import { Callout } from "@/components/lesson/callout";
import { KeyPoints } from "@/components/lesson/key-points";
import { Demo } from "@/components/lesson/demo";
import { ApiTable } from "@/components/lesson/api-table";
import { P, H2, UL, LI, Lead, Source } from "@/components/lesson/typography";
import { CodeBlock } from "@/components/code-block";
import { PostForm } from "@/components/demos/post-form";
import { CachedFeed } from "@/components/demos/cached-feed";
import { getCachedPosts } from "@/lib/cache";

export default async function Page() {
  const { data: posts } = await getCachedPosts();

  return (
    <Lesson
      href="/data/server-actions"
      title="Server Actions + React 19 Hooks"
      badge="new"
      description={'不用写 API：一个 "use server" 函数就是可从表单/事件直接调用的服务端变更入口。'}
    >
      <Lead>
        Server Action 是 Next 里「写变更」最省事的方式：标个 <code>&quot;use server&quot;</code>，
        它就变成一个<strong>能从客户端表单直接提交、却在服务端执行</strong>的函数。配合 React 19.2 的几个
        Hook，表单体验可以做得非常顺。
      </Lead>

      <Concept title="Server Action 是什么">
        <UL>
          <LI>
            <code>&quot;use server&quot;</code> 顶部的文件，所有导出都是 Action；或单函数内写该指令。
          </LI>
          <LI>可直接作为 <code>&lt;form action&gt;</code>，或在 <code>onClick</code> 里当普通函数调用。</LI>
          <LI>执行后自动刷新当前路由的 Server Components（配合 updateTag/revalidateTag 精准控缓存）。</LI>
        </UL>
      </Concept>

      <H2>定义与调用</H2>
      <CodeBlock
        title="lib/actions/posts.ts"
        code={`"use server";
import { updateTag } from "next/cache";

export async function createPost(prev: { ok: boolean; error?: string }, formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  if (!title) return { ok: false, error: "标题不能为空" };
  // ...写入数据...
  updateTag("posts"); // 立即让列表刷新
  return { ok: true };
}`}
        highlight={[1, 4, 9]}
      />

      <H2>三个 React 19.2 Hook</H2>
      <ApiTable
        columns={["Hook", "作用"]}
        rows={[
          ["useActionState(action, init)", "把表单与 Action 绑定，拿到 (state, dispatch, isPending)"],
          ["useFormStatus()", "表单内部子组件感知提交是否 pending（按钮禁用/Loading）"],
          ["useOptimistic(state, reducer)", "提交瞬间乐观更新 UI，服务端确认后自动校正"],
        ]}
      />
      <Callout variant="tip" title="还有一个 use()">
        <code>use(promise)</code> 能在组件里「读」一个 Promise/Context；结合 React 19 的{" "}
        <code>cache()</code> 与 Server Components，可在客户端解包服务端传来的 promise。它不是 Hook 的传统形态，
        但遵守 Hook 规则。
      </Callout>

      <Demo
        title="发一个帖子"
        description="下面的表单调用 createPost（Server Action）。提交瞬间，列表头会立刻出现一条「乐观」帖子（useOptimistic），按钮进入 pending（useFormStatus），成功后列表被 updateTag 刷新（真实数据替换乐观项）。"
      >
        <PostForm posts={posts} />
        <div className="mt-5">
          <CachedFeed />
        </div>
      </Demo>

      <KeyPoints
        points={[
          '"use server" 让函数成为可从客户端直接调用的服务端 Action。',
          "<form action={fn}> 或 onClick 里都能用。",
          "useActionState 绑定状态、useFormStatus 感知 pending、useOptimistic 即时反馈。",
          "配合 updateTag/revalidateTag 控制 Action 完成后的缓存刷新。",
        ]}
      />
      <Source>参考：Next.js「Server Actions」「Mutating Data」；React「useActionState / useFormStatus / useOptimistic」。</Source>
    </Lesson>
  );
}
