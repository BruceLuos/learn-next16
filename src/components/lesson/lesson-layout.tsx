import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getAdjacent,
  badgeLabel,
  type Badge as BadgeType,
  type Section,
  sections,
} from "@/lib/curriculum";
import { cn } from "@/lib/utils";

const badgeVariant: Record<BadgeType, "default" | "secondary" | "destructive"> =
  {
    start: "default",
    core: "secondary",
    new: "default",
    breaking: "destructive",
  };

/** 找到某 href 所属的章节 */
function findSection(href: string): Section | undefined {
  return sections.find((s) => s.lessons.some((l) => l.href === href));
}

export function Lesson({
  href,
  title,
  badge,
  description,
  children,
}: {
  href: string;
  title: string;
  badge?: BadgeType;
  description?: string;
  children: ReactNode;
}) {
  const section = findSection(href);
  const { prev, next } = getAdjacent(href);

  return (
    <article className="mx-auto w-full min-w-0 max-w-3xl px-5 py-10 sm:px-8">
      {/* 头部 */}
      <header className="mb-8 border-b border-border pb-6">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {section && (
            <span className="flex items-center gap-1.5">
              <span>{section.emoji}</span>
              <span>{section.title}</span>
              <span className="text-border">/</span>
            </span>
          )}
          {badge && (
            <Badge variant={badgeVariant[badge]} className="text-[10px]">
              {badge === "new"
                ? "⭐ 16 新增"
                : badge === "breaking"
                  ? "⚠️ 破坏性变更"
                  : badgeLabel[badge]}
            </Badge>
          )}
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            {description}
          </p>
        )}
      </header>

      {/* 正文 */}
      <div className="text-[15px]">{children}</div>

      {/* 上一课 / 下一课 */}
      <nav className="mt-12 grid grid-cols-2 gap-3 border-t border-border pt-6">
        {prev ? (
          <Button
            asChild
            variant="outline"
            className="h-auto justify-start py-3"
          >
            <Link href={prev.href}>
              <ChevronLeft className="size-4 shrink-0" />
              <span className="truncate text-left">
                <span className="block text-[10px] font-normal text-muted-foreground">
                  上一课
                </span>
                {prev.title}
              </span>
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {next ? (
          <Button
            asChild
            variant="outline"
            className={cn("h-auto justify-end py-3 text-right")}
          >
            <Link href={next.href}>
              <span className="truncate text-right">
                <span className="block text-[10px] font-normal text-muted-foreground">
                  下一课
                </span>
                {next.title}
              </span>
              <ChevronRight className="size-4 shrink-0" />
            </Link>
          </Button>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
