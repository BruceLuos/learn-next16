/** loading.tsx —— App Router 文件约定：路由段在流式渲染时自动显示的即时加载态。
 *  它基于 React Suspense 工作，无需手动包裹 <Suspense>。 */
export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-3xl animate-pulse px-8 py-10">
      <div className="mb-6 h-8 w-2/3 rounded-lg bg-muted" />
      <div className="mb-3 h-4 w-1/2 rounded bg-muted" />
      <div className="mb-10 h-4 w-3/4 rounded bg-muted" />
      <div className="space-y-3">
        <div className="h-24 rounded-xl bg-muted" />
        <div className="h-24 rounded-xl bg-muted" />
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        loading.tsx · 流式渲染占位…
      </p>
    </div>
  );
}
