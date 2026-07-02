import { NextRequest, NextResponse } from "next/server";
import { getPosts, addPost } from "@/lib/data/store";

/** GET /api/posts?limit=3 —— Route Handler 里天然是请求级动态，可直接用 Date.now()。 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 5), 20);
  const result = await getPosts();
  return NextResponse.json({
    posts: result.data.slice(0, limit),
    fetchedAt: result.fetchedAt,
    latencyMs: result.latencyMs,
  });
}

/** POST /api/posts —— 创建帖子。演示请求体解析与响应。 */
export async function POST(request: NextRequest) {
  let body: { title?: string; excerpt?: string; author?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "非法 JSON" }, { status: 400 });
  }
  if (!body.title?.trim()) {
    return NextResponse.json({ error: "title 必填" }, { status: 422 });
  }
  const post = addPost({
    title: body.title,
    excerpt: body.excerpt ?? "",
    author: body.author ?? "匿名",
  });
  return NextResponse.json({ post }, { status: 201 });
}
