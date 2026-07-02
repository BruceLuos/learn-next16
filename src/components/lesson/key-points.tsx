import { CheckCircle2 } from "lucide-react";

/** 「要点小结」：一节课的收束，列出最该记住的几条。 */
export function KeyPoints({
  title = "要点小结",
  points,
}: {
  title?: string;
  points: (string | { text: string; code?: string })[];
}) {
  return (
    <section className="my-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5">
      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
        <CheckCircle2 className="size-5 text-emerald-500" />
        {title}
      </h2>
      <ul className="space-y-2">
        {points.map((p, i) => (
          <li key={i} className="flex gap-2 text-sm leading-6 text-muted-foreground">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-500" />
            <span>
              {typeof p === "string" ? (
                p
              ) : (
                <>
                  {p.text}{" "}
                  {p.code && (
                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                      {p.code}
                    </code>
                  )}
                </>
              )}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
