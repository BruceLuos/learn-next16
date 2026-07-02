/**
 * 课程地图 —— 全站导航的单一真相源。
 * 侧边栏、首页知识图谱、上一课/下一课都从这里生成。新增课节只需在此登记一行。
 *
 * badge 含义：
 * - start    入口
 * - core     App Router 基础（非 16 特有，但必须掌握）
 * - new      ⭐ Next.js 16 新增 / 重磅
 * - breaking ⚠️ 16 破坏性变更
 */

export type Badge = "start" | "core" | "new" | "breaking";

export interface Lesson {
  slug: string;
  title: string;
  href: string;
  badge?: Badge;
  /** 一句话说明，用于侧栏 tooltip 与首页卡片 */
  description?: string;
}

export interface Section {
  id: string;
  title: string;
  /** 章节emoji/图标标识，侧栏分组标题前显示 */
  emoji: string;
  lessons: Lesson[];
}

export const sections: Section[] = [
  {
    id: "overview",
    title: "总览",
    emoji: "🗺️",
    lessons: [
      {
        slug: "home",
        title: "首页 · 知识图谱",
        href: "/",
        badge: "start",
        description: "Next.js 16 全貌 + 本手册使用指南",
      },
    ],
  },
  {
    id: "fundamentals",
    title: "一、基础架构",
    emoji: "🧱",
    lessons: [
      {
        slug: "components",
        title: "Server / Client 组件",
        href: "/fundamentals/components",
        badge: "core",
        description: "RSC 边界、'use client'、组件组合模式",
      },
      {
        slug: "config",
        title: "next.config.ts 全解",
        href: "/fundamentals/config",
        badge: "new",
        description: "cacheComponents / reactCompiler / 顶层 turbopack / FS 缓存",
      },
    ],
  },
  {
    id: "rendering",
    title: "二、渲染与缓存（16 重头戏）",
    emoji: "⚡",
    lessons: [
      {
        slug: "cache-components",
        title: "Cache Components + 'use cache'",
        href: "/rendering/cache-components",
        badge: "new",
        description: "opt-in 缓存 + PPR 静态壳/动态洞",
      },
      {
        slug: "cache-apis",
        title: "cacheLife / cacheTag",
        href: "/rendering/cache-apis",
        badge: "new",
        description: "稳定的缓存寿命与标签 API + 自定义 profile",
      },
      {
        slug: "revalidation",
        title: "revalidateTag / updateTag / refresh",
        href: "/rendering/revalidation",
        badge: "new",
        description: "三种失效语义的可视化对比",
      },
    ],
  },
  {
    id: "routing",
    title: "三、路由系统",
    emoji: "🛣️",
    lessons: [
      {
        slug: "dynamic-params",
        title: "动态路由 + 异步 params",
        href: "/routing/dynamic-params",
        badge: "breaking",
        description: "await params、PageProps<'/...'> 类型",
      },
      {
        slug: "parallel",
        title: "并行路由 + default.js",
        href: "/routing/parallel",
        badge: "breaking",
        description: "多 slot 同屏渲染、16 强制 default.js",
      },
      {
        slug: "intercepting",
        title: "拦截路由 + 模态框",
        href: "/routing/intercepting",
        badge: "core",
        description: "(..) 语法、软导航弹窗 vs 直接访问",
      },
    ],
  },
  {
    id: "data",
    title: "四、数据交互",
    emoji: "🔄",
    lessons: [
      {
        slug: "server-actions",
        title: "Server Actions + React 19 Hooks",
        href: "/data/server-actions",
        badge: "new",
        description: "useActionState / useFormStatus / useOptimistic / use()",
      },
      {
        slug: "route-handlers",
        title: "Route Handlers",
        href: "/data/route-handlers",
        badge: "core",
        description: "GET/POST、流式响应、异步 params",
      },
    ],
  },
  {
    id: "network",
    title: "五、网络边界",
    emoji: "🛡️",
    lessons: [
      {
        slug: "proxy",
        title: "middleware → proxy.ts",
        href: "/network/proxy",
        badge: "new",
        description: "Node runtime、明确网络边界、matcher",
      },
    ],
  },
  {
    id: "react19",
    title: "六、React 19.2",
    emoji: "⚛️",
    lessons: [
      {
        slug: "view-transitions",
        title: "View Transitions",
        href: "/react19/view-transitions",
        badge: "new",
        description: "导航/元素的过渡动画",
      },
      {
        slug: "compiler",
        title: "React Compiler",
        href: "/react19/compiler",
        badge: "new",
        description: "自动 memo，告别手写 useMemo/useCallback",
      },
    ],
  },
  {
    id: "optimization",
    title: "七、优化与工具",
    emoji: "🚀",
    lessons: [
      {
        slug: "image",
        title: "next/image 新默认值",
        href: "/optimization/image",
        badge: "breaking",
        description: "qualities / minimumCacheTTL / localPatterns 等全集",
      },
      {
        slug: "metadata",
        title: "Metadata + 动态 OG 图",
        href: "/optimization/metadata",
        badge: "new",
        description: "generateMetadata + 异步 params 的 OG 生成",
      },
      {
        slug: "tooling",
        title: "Turbopack + Devtools MCP",
        href: "/optimization/tooling",
        badge: "new",
        description: "稳定打包器、文件系统缓存、AI 调试",
      },
    ],
  },
  {
    id: "migration",
    title: "八、迁移与破坏性变更",
    emoji: "🔧",
    lessons: [
      {
        slug: "breaking-changes",
        title: "升级到 16 全攻略",
        href: "/migration/breaking-changes",
        badge: "breaking",
        description: "异步 Request API + image 默认 + 移除项 + codemod",
      },
    ],
  },
];

/** 扁平化的全部课节（不含首页分组顺序） */
export const allLessons: Lesson[] = sections.flatMap((s) => s.lessons);

/** 给定当前 href，返回上一课 / 下一课（用于文末翻页） */
export function getAdjacent(href: string): {
  prev?: Lesson;
  next?: Lesson;
} {
  const idx = allLessons.findIndex((l) => l.href === href);
  if (idx === -1) return {};
  return {
    prev: idx > 0 ? allLessons[idx - 1] : undefined,
    next: idx < allLessons.length - 1 ? allLessons[idx + 1] : undefined,
  };
}

export const badgeLabel: Record<Badge, string> = {
  start: "入口",
  core: "基础",
  new: "16 新增",
  breaking: "破坏性变更",
};

/** 统计：用于首页展示 */
export const stats = {
  sections: sections.length,
  lessons: allLessons.length,
  newCount: allLessons.filter((l) => l.badge === "new").length,
  breakingCount: allLessons.filter((l) => l.badge === "breaking").length,
};
