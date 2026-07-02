"use client";

/** 演示 NEXT_PUBLIC_ 前缀的环境变量会被内联到客户端 bundle。 */
export function EnvDemo() {
  return (
    <div className="space-y-2 font-mono text-xs">
      <div>
        process.env.<span className="text-emerald-400">NEXT_PUBLIC_APP_NAME</span>{" "}
        ={" "}
        <span className="rounded bg-muted px-1.5 py-0.5 text-foreground">
          {process.env.NEXT_PUBLIC_APP_NAME ?? "(空)"}
        </span>
      </div>
      <div>
        process.env.<span className="text-red-400">DEMO_SERVER_ONLY_TOKEN</span>{" "}
        ={" "}
        <span className="rounded bg-muted px-1.5 py-0.5 text-muted-foreground">
          {process.env.DEMO_SERVER_ONLY_TOKEN ?? "undefined（客户端读不到）"}
        </span>
      </div>
    </div>
  );
}
