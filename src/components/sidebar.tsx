"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, BookOpen } from "lucide-react";
import { sections, type Badge } from "@/lib/curriculum";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

const badgeDot: Record<Badge, string> = {
  start: "bg-primary",
  core: "bg-muted-foreground/40",
  new: "bg-emerald-500",
  breaking: "bg-red-500",
};

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

/** 共享的导航列表（桌面侧栏与移动抽屉都用它） */
function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="space-y-6 p-4">
      {sections.map((section) => (
        <div key={section.id}>
          <div className="mb-1.5 flex items-center gap-1.5 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground/70">
            <span>{section.emoji}</span>
            <span>{section.title}</span>
          </div>
          <ul className="space-y-0.5">
            {section.lessons.map((lesson) => {
              const active = isActive(pathname, lesson.href);
              return (
                <li key={lesson.slug}>
                  <Link
                    href={lesson.href}
                    onClick={onNavigate}
                    className={cn(
                      "group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                      active
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "size-1.5 shrink-0 rounded-full",
                        active ? badgeDot[lesson.badge ?? "core"] : "bg-transparent border border-border group-hover:border-muted-foreground/40"
                      )}
                    />
                    <span className="truncate">{lesson.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 border-b border-border px-4 py-4"
    >
      <div className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background">
        <BookOpen className="size-4" />
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold text-foreground">Next.js 16</div>
        <div className="text-[11px] text-muted-foreground">交互式学习手册</div>
      </div>
    </Link>
  );
}

/** 桌面侧栏：lg 及以上显示 */
export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r border-border bg-background/60 lg:block">
      <Brand />
      <ScrollArea className="h-[calc(100dvh-65px)]">
        {/* usePathname() 属请求级动态数据，cacheComponents 下需 Suspense 边界
            以免阻塞 /routing/intercepting/[slug] 等动态路由的预渲染 */}
        <Suspense fallback={null}>
          <NavList />
        </Suspense>
      </ScrollArea>
    </aside>
  );
}

/** 移动端抽屉：lg 以下显示一个菜单按钮 */
export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="打开菜单"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetTitle className="sr-only">课程导航</SheetTitle>
        <Brand />
        <ScrollArea className="h-[calc(100dvh-65px)]">
          <Suspense fallback={null}>
            <NavList onNavigate={() => setOpen(false)} />
          </Suspense>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
