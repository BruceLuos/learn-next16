"use client";

import { useFormStatus } from "react-dom";
import {
  upvoteInstant,
  upvoteSWR,
  refreshMetrics,
} from "@/lib/actions/posts";
import { Button } from "@/components/ui/button";

function Submit({
  children,
  variant = "outline",
}: {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline";
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant={variant} disabled={pending} className="w-full">
      {pending ? "执行中…" : children}
    </Button>
  );
}

/** 三种失效/刷新策略的按钮组。每个 form 内藏一个 hidden id，告诉 Server Action 给哪条帖子点赞。 */
export function RevalidationControls({ postId }: { postId: string }) {
  const cards: {
    action: (fd: FormData) => void;
    n: string;
    title: string;
    api: string;
    desc: string;
    variant: "default" | "secondary" | "outline";
  }[] = [
    {
      action: upvoteInstant,
      n: "①",
      title: "立即生效",
      api: "updateTag(\"posts\")",
      desc: "read-your-writes：失效后立即重读，点赞数当场 +1。",
      variant: "default",
    },
    {
      action: upvoteSWR,
      n: "②",
      title: "SWR 后台刷新",
      api: "revalidateTag(\"posts\", \"max\")",
      desc: "本次仍返回旧值，后台再刷新；下一次刷新才看到 +1。",
      variant: "secondary",
    },
    {
      action: refreshMetrics,
      n: "③",
      title: "只刷新未缓存",
      api: "refresh()",
      desc: "不动缓存：帖子不变，只让右下角实时指标刷新。",
      variant: "outline",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {cards.map((c) => (
        <form key={c.n} action={c.action} className="space-y-2">
          <input type="hidden" name="id" value={postId} />
          <div className="text-xs text-muted-foreground">{c.n}</div>
          <Submit variant={c.variant}>{c.title}</Submit>
          <div className="font-mono text-[10px] text-muted-foreground">{c.api}</div>
          <p className="text-[11px] leading-4 text-muted-foreground">{c.desc}</p>
        </form>
      ))}
    </div>
  );
}
