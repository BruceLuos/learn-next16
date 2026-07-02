/**
 * 演示用的「内存数据库」+ 模拟延迟 + 时间戳。
 *
 * 设计意图：让抽象的缓存语义「看得见」。
 * - 每次读取都带 fetchedAt（ISO）与 latencyMs，缓存命中时 fetchedAt 会「冻结」、latency 归零。
 * - 数据存在模块级内存里，Server Actions 直接 mutate。
 *
 * 注意：内存存储仅在单进程内有效，dev 重启会丢失（这正是演示想要的）。
 */

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  upvotes: number;
  tags: string[];
  updatedAt: number;
}

export interface Metrics {
  visitors: number;
  reads: number;
  trend: number[];
}

export interface ReadResult<T> {
  data: T;
  fetchedAt: string;
  latencyMs: number;
  /** 标记，便于 UI 区分这条数据是否来自缓存（由调用方覆盖） */
  cached?: boolean;
}

const LATENCY = 700; // 模拟一次真实的慢查询
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

let counter = 100;
const nextId = () => `p${++counter}`;

let posts: Post[] = [
  {
    id: "cache-components",
    title: "Cache Components：让缓存重新变得显式",
    excerpt: "用 \"use cache\" 指令精确选择要缓存的内容，配合 PPR 实现静态壳 + 动态洞。",
    author: "Next 团队",
    upvotes: 142,
    tags: ["caching", "ppr"],
    updatedAt: Date.now(),
  },
  {
    id: "turbopack-stable",
    title: "Turbopack 进入默认时代",
    excerpt: "构建快 2-5×、Fast Refresh 快 10×，Turbopack 成为新项目默认打包器。",
    author: "Turbopack 团队",
    upvotes: 98,
    tags: ["tooling"],
    updatedAt: Date.now(),
  },
  {
    id: "proxy-ts",
    title: "proxy.ts 取代 middleware.ts",
    excerpt: "明确网络边界，固定运行在 Node.js runtime，函数名也从 middleware 改为 proxy。",
    author: "Next 团队",
    upvotes: 76,
    tags: ["routing"],
    updatedAt: Date.now(),
  },
  {
    id: "react-19-2",
    title: "React 19.2：View Transitions 落地",
    excerpt: "导航与元素更新都能拥有丝滑过渡，还有 useEffectEvent 与 Activity。",
    author: "React 团队",
    upvotes: 121,
    tags: ["react"],
    updatedAt: Date.now(),
  },
];

let metrics: Metrics = {
  visitors: 1280,
  reads: 4920,
  trend: [12, 18, 15, 22, 28, 25, 31],
};

function stamp<T>(data: T, start: number): ReadResult<T> {
  return {
    data,
    fetchedAt: new Date().toISOString(),
    latencyMs: Date.now() - start,
  };
}

/** 读取全部帖子（每次都「慢」，用于演示未缓存 vs 缓存的差异） */
export async function getPosts(): Promise<ReadResult<Post[]>> {
  const start = Date.now();
  await sleep(LATENCY);
  return stamp(
    posts.map((p) => ({ ...p, tags: [...p.tags] })),
    start,
  );
}

export async function getPost(id: string): Promise<ReadResult<Post | null>> {
  const start = Date.now();
  await sleep(LATENCY);
  return stamp(posts.find((p) => p.id === id) ?? null, start);
}

/** 读取实时指标（每次都变，用于演示 refresh() 刷新未缓存数据） */
export async function getMetrics(): Promise<ReadResult<Metrics>> {
  const start = Date.now();
  await sleep(LATENCY);
  metrics = {
    visitors: metrics.visitors + Math.floor(Math.random() * 6),
    reads: metrics.reads + Math.floor(Math.random() * 12),
    trend: [...metrics.trend.slice(1), Math.floor(Math.random() * 40)],
  };
  return stamp({ ...metrics, trend: [...metrics.trend] }, start);
}

// ===== 同步 mutations（由 Server Actions 调用） =====

export function upvotePost(id: string): Post | null {
  const p = posts.find((x) => x.id === id);
  if (!p) return null;
  p.upvotes += 1;
  p.updatedAt = Date.now();
  return { ...p };
}

export function addPost(input: {
  title: string;
  excerpt: string;
  author: string;
}): Post {
  const post: Post = {
    id: nextId(),
    title: input.title,
    excerpt: input.excerpt,
    author: input.author || "匿名",
    upvotes: 0,
    tags: ["new"],
    updatedAt: Date.now(),
  };
  posts = [post, ...posts];
  return post;
}
