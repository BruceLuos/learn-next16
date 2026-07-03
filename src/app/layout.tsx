import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Sidebar, MobileSidebar } from "@/components/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  // 解析 OG / Twitter 图片的基准 URL，避免 Next 用 localhost 兜底告警；
  // 部署时设 NEXT_PUBLIC_SITE_URL 为正式域名即可。
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Next.js 16 交互式学习手册",
    template: "%s · Next.js 16 手册",
  },
  description:
    "用一个真实项目讲透 Next.js 16：Cache Components、proxy.ts、新缓存 API、异步 Request API、React 19.2、Turbopack 等。",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

// 在 hydration 前就设定主题，避免明暗闪烁（FOUC）
const themeInit = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':true;if(d){document.documentElement.classList.add('dark');}}catch(e){document.documentElement.classList.add('dark');}})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="zh-CN"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="min-h-full">
        <div className="flex min-h-dvh">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur">
              <MobileSidebar />
              <div className="flex-1" />
              <a
                href="https://nextjs.org/blog/next-16"
                target="_blank"
                rel="noreferrer"
                className="hidden text-xs text-muted-foreground hover:text-foreground sm:block"
              >
                官方博客 ↗
              </a>
              <ThemeToggle />
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t border-border px-6 py-6 text-center text-xs text-muted-foreground">
              Next.js 16 交互式学习手册 · 用一个项目讲透一个框架 · 数据为演示用内存数据
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
