import { getCachedPosts } from "@/lib/cache";
import { FeedView } from "./feed-view";

/**
 * 缓存版 Feed：getCachedPosts 内部用了 "use cache"，
 * 在缓存寿命内多次渲染都返回同一条结果（fetchedAt 冻结、latency≈0）。
 */
export async function CachedFeed() {
  const result = await getCachedPosts();
  return <FeedView label="getCachedPosts()" result={result} cached />;
}
