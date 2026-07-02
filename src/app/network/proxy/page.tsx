import Link from "next/link";
import { Lesson } from "@/components/lesson/lesson-layout";
import { Concept } from "@/components/lesson/concept";
import { Callout } from "@/components/lesson/callout";
import { KeyPoints } from "@/components/lesson/key-points";
import { Demo } from "@/components/lesson/demo";
import { ApiTable } from "@/components/lesson/api-table";
import { P, H2, UL, LI, Lead, Source } from "@/components/lesson/typography";
import { CodeBlock } from "@/components/code-block";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ blocked?: string }>;
}) {
  const { blocked } = await searchParams;

  return (
    <Lesson
      href="/network/proxy"
      title="middleware → proxy.ts"
      badge="new"
      description="16 把 middleware 改名为 proxy，固定跑在 Node.js runtime，让「网络边界」名副其实。"
    >
      <Lead>
        以前 <code>middleware.ts</code> 这个名字让人误以为它是「业务中间件」。16 把它改名为{" "}
        <code>proxy.ts</code>，强调它的真实职责：<strong>在网络边界上拦截/改写/重定向请求</strong>。
      </Lead>

      {blocked ? (
        <Callout variant="warning" title="你刚刚被 proxy 拦截了">
          你试图访问 <code>/network/proxy/protected</code> 但没带 <code>?token=next16</code>，
          <code>proxy.ts</code> 把你重定向回了本页。这就是 proxy 在网络边界干的事。
        </Callout>
      ) : null}

      <Concept title="改了什么">
        <UL>
          <LI>文件名 <code>middleware.ts</code> → <code>proxy.ts</code>；导出 <code>middleware</code> → <code>proxy</code>。</LI>
          <LI>运行时<strong>固定 Node.js</strong>（不再是 edge，不可配置 <code>runtime</code>）。</LI>
          <LI>配置项更名：<code>skipMiddlewareUrlNormalize</code> → <code>skipProxyUrlNormalize</code>。</LI>
          <LI><code>middleware.ts</code> 仍可用（仅 edge 场景），但已废弃，未来版本移除。</LI>
        </UL>
      </Concept>

      <H2>本项目的真实 proxy</H2>
      <CodeBlock
        title="src/proxy.ts"
        code={`import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 函数名从 middleware 改为 proxy
export function proxy(request: NextRequest) {
  const { nextUrl } = request;
  if (nextUrl.pathname.startsWith("/network/proxy/protected")) {
    if (nextUrl.searchParams.get("token") !== "next16") {
      const dest = new URL("/network/proxy", request.url);
      dest.searchParams.set("blocked", "1");
      return NextResponse.redirect(dest); // 拦截 → 重定向
    }
    const res = NextResponse.next();
    res.headers.set("x-proxy-demo", "passed"); // 放行 + 注入响应头
    return res;
  }
  return NextResponse.next();
}

export const config = { matcher: ["/network/proxy/:path*"] };`}
        highlight={[5, 8, 11, 19]}
      />

      <Callout variant="breaking" title="edge 运行时不再支持">
        <code>proxy.ts</code> 的 runtime 固定为 <code>nodejs</code>，<strong>不能</strong>再{" "}
        <code>export const runtime = &quot;edge&quot;</code>。若你必须用 edge，继续用旧的{" "}
        <code>middleware.ts</code>（已废弃）。
      </Callout>

      <ApiTable
        columns={["项", "15 (middleware)", "16 (proxy)"]}
        rows={[
          ["文件名", "middleware.ts", "proxy.ts"],
          ["函数名", "middleware", "proxy"],
          ["runtime", "nodejs / edge", "仅 nodejs"],
          ["URL 规范化开关", "skipMiddlewareUrlNormalize", "skipProxyUrlNormalize"],
        ]}
      />

      <Demo
        title="亲手触发一次拦截"
        description="本项目的 proxy 真的在拦截下面这个路由："
      >
        <div className="grid gap-2 sm:grid-cols-2">
          <Link
            href="/network/proxy/protected"
            className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-sm hover:bg-red-500/10"
          >
            <div className="font-mono text-[10px] text-muted-foreground">
              /network/proxy/protected
            </div>
            <div className="mt-1 text-red-600 dark:text-red-400">
              ❌ 不带 token → 会被重定向回来
            </div>
          </Link>
          <Link
            href="/network/proxy/protected?token=next16"
            className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm hover:bg-emerald-500/10"
          >
            <div className="font-mono text-[10px] text-muted-foreground">
              /network/proxy/protected?token=next16
            </div>
            <div className="mt-1 text-emerald-600 dark:text-emerald-400">
              ✅ 带正确 token → 放行
            </div>
          </Link>
        </div>
      </Demo>

      <KeyPoints
        points={[
          "middleware.ts → proxy.ts；函数 middleware → proxy。",
          "runtime 固定 nodejs，edge 不再支持（edge 请继续用旧 middleware）。",
          "职责是网络边界：鉴权、重定向、改写请求/响应头、A/B、地域路由。",
          "config.matcher 限定哪些路径进入 proxy，避免全站开销。",
        ]}
      />
      <Source>参考：Next.js「Proxy」「Upgrading: Version 16 · middleware to proxy」。</Source>
    </Lesson>
  );
}
