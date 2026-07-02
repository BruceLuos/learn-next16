import type { ReactNode } from "react";
import { Play } from "lucide-react";

/** 「在线演示」块：包裹可交互的 Demo，带统一外观与标题。 */
export function Demo({
  title = "在线演示",
  description,
  children,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="my-6">
      <div className="mb-2 flex items-center gap-2">
        <Play className="size-4 fill-primary text-primary" />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      {description && (
        <p className="mb-3 text-sm text-muted-foreground">{description}</p>
      )}
      <div className="rounded-xl border border-dashed border-primary/30 bg-background p-5 [&>form]:space-y-3">
        {children}
      </div>
    </section>
  );
}
