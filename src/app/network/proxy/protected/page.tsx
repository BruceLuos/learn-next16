import Link from "next/link";
import { headers } from "next/headers";
import { ShieldCheck } from "lucide-react";

/** 受保护页：只有 proxy 放行（带 ?token=next16）才到得了这里。 */
export default async function ProtectedPage() {
  // 16：headers() 也是 Promise，需 await
  const h = await headers();
  const proxyHeader = h.get("x-proxy-demo");

  return (
    <div className="mx-auto w-full max-w-xl px-5 py-20 text-center">
      <div className="mb-4 inline-flex size-14 items-center justify-center rounded-full bg-emerald-500/15">
        <ShieldCheck className="size-7 text-emerald-500" />
      </div>
      <h1 className="text-xl font-semibold text-foreground">已通过 proxy 校验</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        你带着 <code className="rounded bg-muted px-1.5 py-0.5 font-mono">?token=next16</code>{" "}
        访问，proxy 放行并注入了响应头：
      </p>
      <p className="mt-3 rounded-lg bg-muted/50 px-3 py-2 font-mono text-xs text-muted-foreground">
        x-proxy-demo = {proxyHeader ?? "(未注入)"}
      </p>
      <Link
        href="/network/proxy"
        className="mt-6 inline-block text-xs text-muted-foreground hover:text-foreground"
      >
        ← 回到 proxy 课
      </Link>
    </div>
  );
}
