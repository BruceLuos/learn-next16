import { type ReadResult, type Post } from "@/lib/data/store";

/** 把一次数据读取（含 fetchedAt / latency）渲染成可对比的小卡片。 */
export function FeedView({
  label,
  result,
  cached,
}: {
  label: string;
  result: ReadResult<Post[]>;
  cached?: boolean;
}) {
  const time = new Date(result.fetchedAt);
  const ms = String(time.getMilliseconds()).padStart(3, "0");

  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] ${
            cached
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
          }`}
        >
          {cached ? "● 命中缓存" : "● 实时动态"}
        </span>
      </div>
      <div className="mb-3 rounded-lg bg-muted/50 p-2 font-mono text-[11px] text-muted-foreground">
        fetchedAt = {time.toLocaleTimeString("zh-CN", { hour12: false })}.
        {ms}
        <br />
        latency ={" "}
        <span className={result.latencyMs > 100 ? "text-amber-500" : "text-emerald-500"}>
          {result.latencyMs}ms
        </span>
      </div>
      <ul className="space-y-1.5">
        {result.data.slice(0, 3).map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between gap-2 text-xs"
          >
            <span className="truncate text-foreground">{p.title}</span>
            <span className="shrink-0 text-muted-foreground">▲ {p.upvotes}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
