import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/** not-found.tsx —— 404 兜底页。调用 notFound() 或访问不存在路由时渲染。 */
export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-xl px-8 py-24 text-center">
      <div className="mb-4 font-mono text-6xl font-bold text-muted-foreground/30">
        404
      </div>
      <h1 className="mb-2 text-xl font-semibold text-foreground">
        这一课还不存在
      </h1>
      <p className="mb-8 text-sm text-muted-foreground">
        也许它还在作者的待办里，也许你输错了地址。
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted"
      >
        <ArrowLeft className="size-4" /> 回到首页
      </Link>
    </div>
  );
}
