"use client";

import { useActionState, useOptimistic } from "react";
import { useFormStatus } from "react-dom";
import { createPost } from "@/lib/actions/posts";
import { Button } from "@/components/ui/button";

type Post = {
  id: string;
  title: string;
  author: string;
  excerpt: string;
};

const inputCls =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

/** 提交按钮单独成组件，才能用 useFormStatus 感知 pending。 */
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "提交中…" : "发布（调用 Server Action）"}
    </Button>
  );
}

export function PostForm({ posts }: { posts: Post[] }) {
  // ① useActionState：把表单与 Server Action 绑定，拿到上次返回的 state
  const [state, dispatch] = useActionState(createPost, { ok: false });

  // ② useOptimistic：提交瞬间先「乐观」地把新帖插到列表头，等服务端确认后再校正
  const [optimisticPosts, addOptimistic] = useOptimistic<Post[], Post>(
    posts,
    (cur, n) => [n, ...cur],
  );

  return (
    <form
      action={async (formData) => {
        const title = String(formData.get("title") || "");
        // 提交前先乐观插入（id 占位，UI 即时反馈）
        addOptimistic({
          id: "optimistic-" + Date.now(),
          title,
          author: String(formData.get("author") || "匿名"),
          excerpt: String(formData.get("excerpt") || ""),
        });
        dispatch(formData);
      }}
      className="space-y-3"
    >
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          name="title"
          placeholder="标题（必填）"
          className={inputCls}
          required
        />
        <input name="author" placeholder="作者（可选）" className={inputCls} />
      </div>
      <textarea
        name="excerpt"
        placeholder="摘要"
        rows={2}
        className={inputCls}
      />
      <div className="flex items-center gap-3">
        <SubmitButton />
        {state.error && (
          <span className="text-xs text-red-500">{state.error}</span>
        )}
        {state.ok && (
          <span className="text-xs text-emerald-500">已发布 ✓（缓存已 updateTag）</span>
        )}
      </div>

      {/* 乐观列表：提交瞬间这里会多一条「虚化」的帖子 */}
      <div className="rounded-lg border border-dashed border-border p-3">
        <div className="mb-2 text-[10px] text-muted-foreground">
          useOptimistic 预览（提交瞬间即时出现，服务端确认后由列表替换）：
        </div>
        <ul className="space-y-1">
          {optimisticPosts.slice(0, 3).map((p) => (
            <li
              key={p.id}
              className={`truncate text-xs ${
                p.id.startsWith("optimistic-")
                  ? "animate-pulse text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {p.title || "（空）"}{" "}
              {p.id.startsWith("optimistic-") && "← 乐观"}
            </li>
          ))}
        </ul>
      </div>
    </form>
  );
}
