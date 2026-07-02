import Image from "next/image";

const SRC =
  "https://picsum.photos/id/1015/800/450";

/** next/image 演示：同一张图在不同 quality 下的差异 + qualities 收敛行为。 */
export function ImageDemo() {
  // 本项目 images.qualities = [50, 75, 100]
  // 传 quality=30 会被收敛到 50；quality=90 会收敛到 100
  const cases = [
    { requested: 30, actual: 50 },
    { requested: 75, actual: 75 },
    { requested: 95, actual: 100 },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {cases.map((c) => (
          <figure key={c.requested} className="space-y-1.5">
            <div className="overflow-hidden rounded-lg border border-border">
              <Image
                src={SRC}
                alt={`quality ${c.requested}`}
                width={400}
                height={225}
                quality={c.requested}
                className="h-auto w-full"
                unoptimized={false}
              />
            </div>
            <figcaption className="font-mono text-[10px] text-muted-foreground">
              请求 quality={c.requested} → 实际{" "}
              <span className="text-foreground">quality={c.actual}</span>
              {c.requested !== c.actual && (
                <span className="ml-1 text-amber-500">（被收敛）</span>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground">
        注：演示图来自远程 picsum.photos（已在 next.config 的{" "}
        <code>images.remotePatterns</code> 白名单内）。本地图片若带 query string
        需额外配置 <code>images.localPatterns.search</code>。
      </p>
    </div>
  );
}
