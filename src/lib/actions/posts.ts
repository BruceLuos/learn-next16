"use server";

import { revalidateTag, updateTag, refresh } from "next/cache";
import { upvotePost, addPost as addPostToStore } from "@/lib/data/store";

/**
 * 三种「让缓存失效 / 刷新」的策略，对应 /rendering/revalidation 一课。
 * 它们都是 Server Actions（"use server"），既能被表单 action= 直接调用，
 * 也能在客户端事件里以普通函数调用。
 *
 * 对比：
 * - revalidateTag(tag, profile)：SWR。本次返回旧值，后台再刷新。最终一致即可的场景。
 * - updateTag(tag)：read-your-writes。立即过期并重读，用户马上看到自己的改动。
 * - refresh()：不碰缓存，只刷新「未缓存」的数据（如实时计数）。
 */

/** 1) read-your-writes：点赞后立即失效并重读（仅 Server Actions 可用） */
export async function upvoteInstant(formData: FormData) {
  upvotePost(String(formData.get("id") ?? ""));
  updateTag("posts");
}

/** 2) SWR：点赞后乐观失效，先返回旧值，后台再刷新 */
export async function upvoteSWR(formData: FormData) {
  upvotePost(String(formData.get("id") ?? ""));
  // ⭐ 16 起必须传第二个 cacheLife profile 参数
  revalidateTag("posts", "max");
}

/** 3) 只刷新未缓存数据（仅 Server Actions 可用） */
export async function refreshMetrics() {
  refresh();
}

/**
 * 新建帖子 —— 演示 useActionState 的 (prevState, formData) 签名（server-actions 课）。
 * 成功后用 updateTag 让列表立即出现新帖。
 */
export async function createPost(
  _prev: { ok: boolean; error?: string },
  formData: FormData,
) {
  const title = String(formData.get("title") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  if (!title) return { ok: false, error: "标题不能为空" };
  addPostToStore({
    title,
    excerpt,
    author: String(formData.get("author") || "").trim(),
  });
  updateTag("posts");
  return { ok: true };
}
