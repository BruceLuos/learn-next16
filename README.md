# Next.js 16 交互式学习手册 · learn-next16

> 用一个真实项目，讲透 Next.js 16。这本身就是一个运行在 Next.js 16 之上的应用——每个特性都有一节课：**为什么 + 关键代码 + 可运行演示 + 要点**。

打开 `http://localhost:3000`，左侧目录是完整的知识图谱，点进去就是一节课。

## ✨ 这个项目覆盖什么

| 领域 | 课程 | Next.js 16 重点 |
| --- | --- | --- |
| 基础 | Server/Client 组件、`next.config.ts` 全解 | `cacheComponents`、`reactCompiler`、顶层 `turbopack`、FS 缓存 |
| 渲染与缓存 | Cache Components、cacheLife/cacheTag、revalidation | ⭐ `"use cache"` + PPR、`updateTag` / `refresh`、SWR |
| 路由 | 动态路由、并行路由、拦截路由 | ⚠️ 异步 `params`、强制 `default.js`、`(..)` 拦截 |
| 数据 | Server Actions、Route Handlers | `useActionState` / `useFormStatus` / `useOptimistic` |
| 网络边界 | `middleware` → `proxy.ts` | Node runtime、网络边界 |
| React 19.2 | View Transitions、React Compiler | ⭐ `<ViewTransition>`、自动 memo |
| 优化 | `next/image`、Metadata + 动态 OG、Turbopack + MCP | ⚠️ image 新默认、`ImageResponse`、Devtools MCP |
| 迁移 | 升级到 16 全攻略 | codemod、异步 Request API、移除/废弃清单 |

## 🚀 快速开始
`
```bash
pnpm install      # 安装依赖（首次会 build sharp 等原生模块）
pnpm dev          # 启动开发服务器（Turbopack 默认）
# 打开 http://localhost:3000
```

> 环境要求：Node.js ≥ 20.9、TypeScript ≥ 5.1（本地已具备 Node 24）。

其它命令：

```bash
pnpm build        # 生产构建（Turbopack；reactCompiler 会让构建稍慢）
pnpm start        # 运行生产构建
pnpm exec next typegen   # 生成 PageProps / LayoutProps / RouteContext 全局类型
```

## 🧭 课程地图（18 节）

**总览**
- `/` 首页 · 知识图谱

**一、基础架构**
- `/fundamentals/components` — Server / Client 组件
- `/fundamentals/config` — `next.config.ts` 全解 ⭐

**二、渲染与缓存（重头戏）**
- `/rendering/cache-components` — Cache Components + `"use cache"` ⭐
- `/rendering/cache-apis` — cacheLife / cacheTag ⭐
- `/rendering/revalidation` — revalidateTag / updateTag / refresh ⭐

**三、路由系统**
- `/routing/dynamic-params` — 动态路由 + 异步 params ⚠️
- `/routing/parallel` — 并行路由 + default.js ⚠️
- `/routing/intercepting` — 拦截路由 + 模态框

**四、数据交互**
- `/data/server-actions` — Server Actions + React 19 Hooks ⭐
- `/data/route-handlers` — Route Handlers

**五、网络边界**
- `/network/proxy` — middleware → proxy.ts ⭐

**六、React 19.2**
- `/react19/view-transitions` — View Transitions ⭐
- `/react19/compiler` — React Compiler ⭐

**七、优化与工具**
- `/optimization/image` — `next/image` 新默认值 ⚠️
- `/optimization/metadata` — Metadata + 动态 OG 图 ⭐
- `/optimization/tooling` — Turbopack + Devtools MCP ⭐

**八、迁移与破坏性变更**
- `/migration/breaking-changes` — 升级到 16 全攻略 ⚠️

## 🧠 本项目「边讲边用」的 Next.js 16 特性

这个站点不是「讲」完就罢——它本身就启用了这些特性，你可以直接观察：

- **`cacheComponents: true`**：全站默认动态，缓存必须用 `"use cache"` 显式声明。见 `/rendering/cache-components`。
- **`reactCompiler: true`**：全局自动 memo，所有组件（含 shadcn）都被 React Compiler 处理。
- **顶层 `turbopack` + 文件系统缓存**：dev 启动行可见 `(Turbopack)`。
- **`proxy.ts`**：访问 `/network/proxy/protected` 真实被拦截重定向。
- **`"use cache"` 组件**：连本站的 `<CodeBlock>`（shiki 高亮）都是 Cache Component。
- **异步 Request API**：动态路由、proxy 课、metadata 课里 `await params/headers/searchParams` 真实生效。
- **动态 OG 图**：`/optimization/metadata/opengraph-image` 是 `next/og` 现场画的 PNG。

## 🗂️ 项目结构

```
src/
├─ app/                     # App Router
│  ├─ layout.tsx            # 根布局：侧栏 + 顶栏 + 主题
│  ├─ page.tsx              # 首页知识图谱
│  ├─ fundamentals/ rendering/ routing/ data/
│  ├─ network/ react19/ optimization/ migration/   # 各课
│  └─ api/{posts,stream}/route.ts                   # Route Handlers
├─ proxy.ts                 # ⭐ 取代 middleware.ts
├─ components/
│  ├─ lesson/               # 课节模板（Lesson/Concept/CodeBlock/Callout/...）
│  ├─ demos/                # 各课可交互演示
│  └─ ui/                   # shadcn/ui 组件
└─ lib/
   ├─ curriculum.ts         # ⭐ 全站导航的单一真相源
   ├─ cache.ts              # "use cache" 缓存封装
   ├─ data/store.ts         # 内存「数据库」+ 模拟延迟
   └─ actions/posts.ts      # Server Actions（三种失效语义）
```

## ⚙️ 重要说明

- **数据是内存演示数据**：`lib/data/store.ts` 的数据存在模块内存里，dev 重启会重置——这正是演示想要的（让缓存「看得见」）。
- **字体用系统栈**：本环境无法稳定下载 Google Fonts，故 `globals.css` 用系统字体栈、零网络依赖、启动更快。生产推荐 `next/font/google` 或 `next/font/local`。
- **`reactCompiler` 与文件系统缓存会增加首次编译耗时**，属预期。
- **shadcn/ui** 采用 `radix-nova` 风格 + Tailwind v4（CSS-first 配置）。

## 📚 参考

- [Next.js 16 发布博客](https://nextjs.org/blog/next-16)
- [Upgrading: Version 16](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Directives: use cache](https://nextjs.org/docs/app/api-reference/directives/use-cache)
- [React 19.2](https://react.dev/blog)

---

用项目学框架，比读文档更深刻。祝你玩得开心 🎉
