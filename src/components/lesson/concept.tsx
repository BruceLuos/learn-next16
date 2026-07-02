import type { ReactNode } from "react";
import { Brain } from "lucide-react";

/** 「概念」块：解释一个特性为什么存在、背后的心智模型。 */
export function Concept({
  title = "概念与心智模型",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={slugify(title)}
      className="my-6 rounded-2xl border border-border bg-gradient-to-br from-muted/50 to-transparent p-5"
    >
      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
        <Brain className="size-5 text-primary" />
        {title}
      </h2>
      <div className="text-sm leading-7 text-muted-foreground [&_p]:my-2 [&_code]:text-foreground [&_strong]:text-foreground">
        {children}
      </div>
    </section>
  );
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^\w]+/g, "-").replace(/^-|-$/g, "");
}
