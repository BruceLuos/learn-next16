import { cn } from "@/lib/utils";

/** API 对照表：用于并排对比若干 API / 选项 / 行为。 */
export function ApiTable({
  title,
  columns,
  rows,
}: {
  title?: string;
  columns: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <section className="my-6">
      {title && (
        <h3 className="mb-2 text-sm font-semibold text-foreground">{title}</h3>
      )}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted/50">
              {columns.map((c, i) => (
                <th
                  key={i}
                  className="border-b border-border px-3 py-2 text-left font-semibold text-foreground"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="odd:bg-background">
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={cn(
                      "border-b border-border/60 px-3 py-2 align-top text-muted-foreground",
                      ci === 0 && "font-mono text-xs text-foreground"
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
