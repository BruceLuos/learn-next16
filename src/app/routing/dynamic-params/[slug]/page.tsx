import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCachedPost } from "@/lib/cache";
import { ArrowLeft, Clock } from "lucide-react";

/** 预生成已知 slug，构建时静态化（其余 dynamicParams 动态生成） */
export async function generateStaticParams() {
  return [
    { slug: "cache-components" },
    { slug: "turbopack-stable" },
    { slug: "proxy-ts" },
    { slug: "react-19-2" },
  ];
}

/** 16：generateMetadata 的 params 也是 Promise，需 await */
export async function generateMetadata(
  props: PageProps<"/routing/dynamic-params/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  return { title: `动态路由示例：${slug}` };
}

export default async function Page(
  props: PageProps<"/routing/dynamic-params/[slug]">,
) {
  // ⭐ 16 关键：params 是 Promise，必须 await
  const { slug } = await props.params;
  const { data: post, fetchedAt, latencyMs } = await getCachedPost(slug);

  if (!post) notFound();
  const t = new Date(fetchedAt);

  return (
    <article className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-8">
      <Link
        href="/routing/dynamic-params"
        className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> 回到 dynamic-params 课
      </Link>

      <div className="mb-2 flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground">
        <span className="rounded bg-muted px-1.5 py-0.5 text-foreground">
          params.slug = {JSON.stringify(slug)}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="size-3" />
          fetchedAt {t.toLocaleTimeString("zh-CN", { hour12: false })} · {latencyMs}ms
        </span>
        <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-emerald-600 dark:text-emerald-400">
          已缓存
        </span>
      </div>

      <h1 className="text-2xl font-bold text-foreground">{post.title}</h1>
      <div className="mt-1 text-sm text-muted-foreground">作者：{post.author}</div>

      <p className="mt-4 leading-7 text-muted-foreground">{post.excerpt}</p>

      <div className="mt-6 rounded-xl border border-dashed border-border bg-muted/30 p-4 text-xs text-muted-foreground">
        <p className="mb-2 font-semibold text-foreground">这条路由做了什么</p>
        <ul className="list-disc space-y-1 pl-4">
          <li>
            <code>await props.params</code> 取出 slug（异步 Request API）
          </li>
          <li>
            <code>getCachedPost(slug)</code> 命中缓存：刷新本页 fetchedAt 基本不变
          </li>
          <li>
            <code>generateStaticParams</code> 让这 4 个 slug 在构建时预生成
          </li>
        </ul>
      </div>
    </article>
  );
}
