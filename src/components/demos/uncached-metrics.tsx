import { connection } from "next/server";
import { getMetrics } from "@/lib/data/store";

/** 未缓存的实时指标：每次请求都变。用来演示 refresh() 「只刷新未缓存数据」。 */
export async function UncachedMetrics() {
  await connection(); // 标记为动态，允许读取当前时间
  const { data, fetchedAt } = await getMetrics();
  const t = new Date(fetchedAt);
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4">
      <div className="mb-1 text-xs font-semibold text-foreground">
        未缓存实时指标 getMetrics()
      </div>
      <div className="mb-3 font-mono text-[10px] text-muted-foreground">
        fetchedAt = {t.toLocaleTimeString("zh-CN", { hour12: false })}
      </div>
      <div className="grid grid-cols-2 gap-3 text-center">
        <div>
          <div className="text-xl font-bold tabular-nums text-foreground">
            {data.visitors}
          </div>
          <div className="text-[10px] text-muted-foreground">访客</div>
        </div>
        <div>
          <div className="text-xl font-bold tabular-nums text-foreground">
            {data.reads}
          </div>
          <div className="text-[10px] text-muted-foreground">阅读</div>
        </div>
      </div>
      <div className="mt-3 flex items-end gap-1">
        {data.trend.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-primary/40"
            style={{ height: `${Math.max(4, v)}px` }}
          />
        ))}
      </div>
    </div>
  );
}
