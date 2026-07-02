import {
  Lightbulb,
  TriangleAlert,
  Zap,
  Info,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "tip" | "warning" | "breaking" | "info";

const config: Record<
  Variant,
  { icon: LucideIcon; label: string; cls: string }
> = {
  tip: {
    icon: Lightbulb,
    label: "提示",
    cls: "border-emerald-500/30 bg-emerald-500/[0.07] text-emerald-700 dark:text-emerald-300",
  },
  warning: {
    icon: TriangleAlert,
    label: "注意",
    cls: "border-amber-500/30 bg-amber-500/[0.07] text-amber-700 dark:text-amber-300",
  },
  breaking: {
    icon: Zap,
    label: "破坏性变更",
    cls: "border-red-500/30 bg-red-500/[0.07] text-red-700 dark:text-red-300",
  },
  info: {
    icon: Info,
    label: "说明",
    cls: "border-blue-500/30 bg-blue-500/[0.07] text-sky-700 dark:text-sky-300",
  },
};

export function Callout({
  variant = "info",
  title,
  children,
}: {
  variant?: Variant;
  title?: string;
  children: ReactNode;
}) {
  const { icon: Icon, label, cls } = config[variant];
  return (
    <div className={cn("my-5 flex gap-3 rounded-lg border p-4", cls)}>
      <Icon className="mt-0.5 size-5 shrink-0" />
      <div className="flex-1 text-sm leading-6 [&_p]:m-0 [&_p+p]:mt-2 [&_code]:text-foreground">
        <p className="mb-1 font-semibold">{title ?? label}</p>
        {children}
      </div>
    </div>
  );
}
