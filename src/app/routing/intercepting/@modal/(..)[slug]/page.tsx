import Link from "next/link";
import { getCachedPost } from "@/lib/cache";
import { X } from "lucide-react";

/**
 * 拦截命中页：软导航到 /routing/intercepting/<slug> 时，渲染到这里（模态）。
 * 文件夹名 (..)[slug]：(..) 表示拦截上一层 [slug] 段。
 *
 * 这里 params 同样是 Promise（16）。
 */
export default async function InterceptedModal({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: post } = await getCachedPost(slug);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl">
        <Link
          href="/routing/intercepting"
          className="absolute right-3 top-3 rounded-md p-1.5 text-muted-foreground hover:bg-muted"
          aria-label="关闭"
        >
          <X className="size-4" />
        </Link>
        {post ? (
          <>
            <div className="mb-1 text-xs text-emerald-500">● 被拦截 → 渲染为模态</div>
            <h2 className="text-lg font-bold text-foreground">{post.title}</h2>
            <div className="text-xs text-muted-foreground">
              作者：{post.author} · ▲ {post.upvotes}
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {post.excerpt}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">未找到该帖子。</p>
        )}
        <div className="mt-4 rounded-lg bg-muted/50 p-2 text-[11px] text-muted-foreground">
          提示：现在按 F5 刷新本页，会<strong className="text-foreground">离开模态</strong>，
          进入真正的 <code>[slug]/page.tsx</code> 独立详情页。
        </div>
      </div>
    </div>
  );
}
