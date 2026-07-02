"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const btn =
  "rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted";

export function ApiExplorer() {
  const [out, setOut] = useState<string>("（点按钮发起请求，响应会显示在这里）");
  const [busy, setBusy] = useState(false);

  async function getPosts() {
    setBusy(true);
    try {
      const r = await fetch("/api/posts?limit=3");
      const j = await r.json();
      setOut(`GET /api/posts?limit=3 → ${r.status}\n\n${JSON.stringify(j, null, 2)}`);
    } finally {
      setBusy(false);
    }
  }

  async function postPost() {
    setBusy(true);
    try {
      const r = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `来自 API 的帖子 ${Math.floor(Math.random() * 99)}`,
          excerpt: "通过 POST /api/posts 创建",
          author: "api-explorer",
        }),
      });
      const j = await r.json();
      setOut(`POST /api/posts → ${r.status}\n\n${JSON.stringify(j, null, 2)}`);
    } finally {
      setBusy(false);
    }
  }

  async function stream() {
    setBusy(true);
    setOut("GET /api/stream（流式）…\n\n");
    try {
      const r = await fetch("/api/stream");
      const reader = r.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;
      let acc = "GET /api/stream（流式）…\n\n";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setOut(acc);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={getPosts} disabled={busy}>
          GET /api/posts
        </Button>
        <Button variant="outline" size="sm" onClick={postPost} disabled={busy}>
          POST /api/posts
        </Button>
        <Button variant="outline" size="sm" onClick={stream} disabled={busy}>
          GET /api/stream
        </Button>
      </div>
      <pre className="max-h-72 overflow-auto rounded-lg bg-[#0b0e14] p-3 font-mono text-[11px] leading-5 text-zinc-300">
        {out}
      </pre>
    </div>
  );
}
