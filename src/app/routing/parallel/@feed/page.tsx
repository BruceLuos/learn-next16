import { getCachedPosts } from "@/lib/cache";

/** @feed 槽：帖子列表。与 @stats 并行渲染。 */
export default async function FeedSlot() {
  const { data: posts } = await getCachedPosts();
  return (
    <ul className="space-y-1 text-xs">
      {posts.slice(0, 4).map((p) => (
        <li key={p.id} className="flex items-center justify-between gap-2">
          <span className="truncate text-muted-foreground">{p.title}</span>
          <span className="shrink-0 text-muted-foreground">▲{p.upvotes}</span>
        </li>
      ))}
    </ul>
  );
}
