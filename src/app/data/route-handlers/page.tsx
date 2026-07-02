import { Lesson } from "@/components/lesson/lesson-layout";
import { Concept } from "@/components/lesson/concept";
import { Callout } from "@/components/lesson/callout";
import { KeyPoints } from "@/components/lesson/key-points";
import { Demo } from "@/components/lesson/demo";
import { P, H2, UL, LI, Lead, Source } from "@/components/lesson/typography";
import { CodeBlock } from "@/components/code-block";
import { ApiExplorer } from "@/components/demos/api-explorer";

export default function Page() {
  return (
    <Lesson
      href="/data/route-handlers"
      title="Route Handlers"
      badge="core"
      description="app 目录下的 route.ts，就是 Web 标准的 Request/Response API 端点。"
    >
      <Lead>
        当你需要一个真正的 HTTP 端点（给移动端、Webhook、第三方调用），就用 Route Handler：
        在 <code>app/</code> 下建 <code>route.ts</code>，导出 <code>GET/POST/...</code> 即可。
        它们基于 Web 标准的 <code>Request</code>/<code>Response</code>，跑在 Node.js runtime。
      </Lead>

      <Concept title="route.ts vs Server Action">
        <UL>
          <LI>
            <strong>Server Action</strong>：给本应用的表单/按钮用，走 RSC 协议，不对外。
          </LI>
          <LI>
            <strong>Route Handler</strong>：标准 HTTP 端点，有 URL、可被任意客户端调用，适合公开 API。
          </LI>
        </UL>
        <P>同一个项目里两者可以共存：内部交互用 Action，对外接口用 route.ts。</P>
      </Concept>

      <H2>定义 GET / POST</H2>
      <CodeBlock
        title="app/api/posts/route.ts"
        code={`import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const limit = Number(new URL(request.url).searchParams.get("limit") ?? 5);
  const result = await getPosts();
  return NextResponse.json({ posts: result.data.slice(0, limit) });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.title) return NextResponse.json({ error: "title 必填" }, { status: 422 });
  const post = addPost(body);
  return NextResponse.json({ post }, { status: 201 });
}`}
        highlight={[4, 11]}
      />

      <Callout variant="tip" title="Route Handler 天然是请求级动态">
        因为 route.ts 总是按请求执行，里面用 <code>Date.now()</code>、<code>Math.random()</code> 都合法，
        不需要像 Server Component 那样先 <code>await connection()</code>。动态路由的 <code>params</code> 仍是 Promise。
      </Callout>

      <H2>流式响应（无需 WebSocket）</H2>
      <CodeBlock
        title="app/api/stream/route.ts"
        code={`export async function GET() {
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 1; i <= 5; i++) {
        controller.enqueue(new TextEncoder().encode(\`第 \${i} 块\\n\`));
        await new Promise((r) => setTimeout(r, 400));
      }
      controller.close();
    },
  });
  return new Response(stream);
}`}
        highlight={[3]}
      />

      <Demo title="真的调一下" description="下面的按钮会真实请求本项目的 /api/posts 与 /api/stream：">
        <ApiExplorer />
      </Demo>

      <KeyPoints
        points={[
          "app/**/route.ts 导出 GET/POST/... 即为 HTTP 端点。",
          "基于 Web 标准 Request/Response；用 NextRequest/NextResponse 更顺手。",
          "Server Action 对内、Route Handler 对外，两者可共存。",
          "用 ReadableStream 实现流式响应；params 仍是 Promise。",
        ]}
      />
      <Source>参考：Next.js「Route Handlers」「Backend for Frontend」。</Source>
    </Lesson>
  );
}
