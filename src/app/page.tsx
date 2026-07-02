import Link from "next/link";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { sections, stats, type Badge } from "@/lib/curriculum";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const heroFeatures = [
  { name: "Cache Components", hint: '"use cache" + PPR' },
  { name: "Turbopack 默认", hint: "构建快 2-5×" },
  { name: "proxy.ts", hint: "取代 middleware" },
  { name: "React 19.2", hint: "View Transitions" },
  { name: "React Compiler", hint: "自动 memo" },
  { name: "异步 Request API", hint: "await params" },
];

const badgeStyle: Record<Badge, string> = {
  start: "bg-primary/10 text-primary",
  core: "bg-muted text-muted-foreground",
  new: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  breaking: "bg-red-500/15 text-red-600 dark:text-red-400",
};

const badgeText: Record<Badge, string> = {
  start: "入口",
  core: "基础",
  new: "16 新增",
  breaking: "破坏性",
};

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-foreground/[0.04] to-transparent p-8 sm:p-12">
        <div className="absolute -right-20 -top-20 size-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative">
          <UIBadge
            variant="secondary"
            className="mb-4 gap-1.5 rounded-full px-3 py-1 text-xs"
          >
            <Sparkles className="size-3.5" />
            Next.js 16.2 · React 19.2 · Turbopack
          </UIBadge>
          <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            用一个项目，讲透{" "}
            <span className="bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text text-transparent">
              Next.js 16
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            这不是文档的翻译，而是一个「边讲边用」的交互式手册：每个特性都有一节课，
            包含<span className="text-foreground">为什么</span>、
            <span className="text-foreground">关键代码</span>、
            <span className="text-foreground">可运行的演示</span>。
            而且本站点本身就运行在 Next.js 16 之上（已开启{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              cacheComponents
            </code>{" "}
            与{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              reactCompiler
            </code>
            ）。
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {heroFeatures.map((f) => (
              <span
                key={f.name}
                className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs"
              >
                <span className="font-medium text-foreground">{f.name}</span>
                <span className="text-muted-foreground"> · {f.hint}</span>
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/fundamentals/components"
              className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              开始学习 <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/rendering/cache-components"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              直奔重头戏：Cache Components
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "课程", value: stats.lessons },
          { label: "章节", value: stats.sections },
          { label: "16 新增", value: stats.newCount },
          { label: "破坏性变更", value: stats.breakingCount },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <div className="text-2xl font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </Card>
        ))}
      </section>

      {/* Knowledge map */}
      <section className="mt-10">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <Zap className="size-4 text-primary" />
          知识图谱
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {sections
            .filter((s) => s.id !== "overview")
            .map((section) => (
              <Card key={section.id} className="flex flex-col p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-lg">{section.emoji}</span>
                  <h3 className="font-semibold text-foreground">
                    {section.title}
                  </h3>
                </div>
                <ul className="space-y-1.5">
                  {section.lessons.map((lesson) => (
                    <li key={lesson.slug}>
                      <Link
                        href={lesson.href}
                        className="group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted"
                      >
                        <span className="flex-1 truncate text-muted-foreground group-hover:text-foreground">
                          {lesson.title}
                        </span>
                        {lesson.badge && (
                          <span
                            className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] ${badgeStyle[lesson.badge]}`}
                          >
                            {badgeText[lesson.badge]}
                          </span>
                        )}
                        <ArrowRight className="size-3 shrink-0 text-muted-foreground/0 transition-colors group-hover:text-muted-foreground" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
        </div>
      </section>
    </div>
  );
}
