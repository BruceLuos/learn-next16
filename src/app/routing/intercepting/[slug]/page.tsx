import Link from "next/link";
import { notFound } from "next/navigation";
import { getCachedPost } from "@/lib/cache";
import { ArrowLeft } from "lucide-react";

/** 真正的详情页：直接访问 /routing/intercepting/<slug> 或刷新时走这里（不被拦截）。 */
export default async function DirectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: post } = await getCachedPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-8">
      <Link
        href="/routing/intercepting"
        className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> 回到 intercepting 课
      </Link>
      <div className="mb-2 text-xs text-amber-500">
        ● 独立详情页（直达 / 刷新走这里，未拦截）
      </div>
      <h1 className="text-2xl font-bold text-foreground">{post.title}</h1>
      <div className="mt-1 text-sm text-muted-foreground">
        作者：{post.author} · ▲ {post.upvotes}
      </div>
      <p className="mt-4 leading-7 text-muted-foreground">{post.excerpt}</p>
    </article>
  );
}
