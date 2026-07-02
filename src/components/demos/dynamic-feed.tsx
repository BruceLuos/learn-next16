import { connection } from "next/server";
import { getPosts } from "@/lib/data/store";
import { FeedView } from "./feed-view";

/**
 * 动态版 Feed：每次请求都重新执行 getPosts()，fetchedAt 始终是「现在」、latency≈700ms。
 *
 * 注意 cacheComponents 模式下的约束：store 里用到了 new Date()/Date.now()（读「当前时间」），
 * 在服务端组件里这样做之前，必须先访问「动态数据源」——这里用 await connection() 把本组件
 * 显式标记为「按请求动态」，于是后续读取时间就是合法的。
 */
export async function DynamicFeed() {
  await connection(); // 关键：声明「我是动态的，允许读时间」
  const result = await getPosts();
  return <FeedView label="getPosts()（未缓存）" result={result} />;
}
