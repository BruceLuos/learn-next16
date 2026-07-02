import { cacheLife, cacheTag } from "next/cache";
import {
  getPosts,
  getPost,
  type ReadResult,
  type Post,
} from "./data/store";

/**
 * 用 "use cache" 指令把数据读取「选择性地」缓存起来。
 *
 * 心智模型（cacheComponents 开启后）：
 * - 默认一切动态（每次请求都执行 getPosts，慢）。
 * - 在这里用 "use cache" 显式选择缓存 → 命中时直接返回旧结果，fetchedAt 冻结、latency 归零。
 * - cacheLife(...) 设寿命；cacheTag(...) 打标签，便于 revalidateTag / updateTag 精确失效。
 */

/** 缓存全部帖子（寿命 minutes，便于肉眼观察「冻结」现象） */
export async function getCachedPosts(): Promise<ReadResult<Post[]>> {
  "use cache";
  cacheLife("minutes");
  cacheTag("posts");
  return getPosts();
}

/** 缓存单个帖子，多打一个 post-<id> 精确标签 */
export async function getCachedPost(
  id: string,
): Promise<ReadResult<Post | null>> {
  "use cache";
  cacheLife("minutes");
  cacheTag("posts", `post-${id}`);
  return getPost(id);
}
