/** GET /api/stream —— 用 Web 标准的 ReadableStream 流式输出，无需 WebSocket。 */
export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 1; i <= 5; i++) {
        controller.enqueue(encoder.encode(`data: 第 ${i} 个数据块（${new Date().toLocaleTimeString("zh-CN", { hour12: false })}）\n\n`));
        await new Promise((r) => setTimeout(r, 400));
      }
      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
