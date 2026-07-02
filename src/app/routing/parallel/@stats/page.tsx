import { getCachedPosts } from "@/lib/cache";

/** @stats 槽：聚合统计。与 @feed 并行渲染、各自独立取数。 */
export default async function StatsSlot() {
  const { data: posts, fetchedAt, latencyMs } = await getCachedPosts();
  const totalUpvotes = posts.reduce((sum, p) => sum + p.upvotes, 0);
  const t = new Date(fetchedAt);

  return (
    <div className="space-y-2 text-xs">
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="rounded-lg bg-muted/60 p-2">
          <div className="text-lg font-bold text-foreground">{posts.length}</div>
          <div className="text-[10px] text-muted-foreground">帖子数</div>
        </div>
        <div className="rounded-lg bg-muted/60 p-2">
          <div className="text-lg font-bold text-foreground">{totalUpvotes}</div>
          <div className="text-[10px] text-muted-foreground">总点赞</div>
        </div>
      </div>
      <div className="font-mono text-[10px] text-muted-foreground">
        {t.toLocaleTimeString("zh-CN", { hour12: false })} · {latencyMs}ms
      </div>
    </div>
  );
}
