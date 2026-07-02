import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * ⭐ Next.js 16：proxy.ts 取代了 middleware.ts，用于明确「网络边界」。
 *
 * 关键变化（详见 /network/proxy 一课）：
 * - 文件名 middleware.ts → proxy.ts；导出函数 middleware → proxy
 * - 运行时固定为 Node.js（不再是 edge），不可配置 runtime
 * - 配置项更名：skipMiddlewareUrlNormalize → skipProxyUrlNormalize
 * - middleware.ts 仍可用（仅 edge 场景），但已废弃
 *
 * 本文件演示：拦截 /network/proxy/protected，未带 ?token=next16 时重定向到说明页。
 * 你可以在浏览器访问 /network/proxy/protected 体验被拦截，带 ?token=next16 体验放行。
 */
export function proxy(request: NextRequest) {
  const { nextUrl } = request;

  if (nextUrl.pathname.startsWith("/network/proxy/protected")) {
    const token = nextUrl.searchParams.get("token");
    if (token !== "next16") {
      // 模拟「未登录 → 跳登录页」
      const dest = new URL("/network/proxy", request.url);
      dest.searchParams.set("blocked", "1");
      return NextResponse.redirect(dest);
    }
    // 放行：注入自定义响应头，证明请求确实经过了 proxy（Node runtime）
    const res = NextResponse.next();
    res.headers.set("x-proxy-demo", "passed");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  // matcher 决定哪些路径会进入 proxy；这里只拦截演示路由，避免影响全站
  matcher: ["/network/proxy/:path*"],
};
