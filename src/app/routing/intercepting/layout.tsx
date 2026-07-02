import type { ReactNode } from "react";

/**
 * 拦截路由（Intercepting Routes）通常配合并行槽实现「软导航弹窗」。
 * layout 收到 @modal 槽：当从本页软导航到被拦截的 URL 时，@modal 里有内容（模态）；
 * 直接访问/刷新该 URL 时，走真正的 [slug]/page.tsx。
 */
export default function InterceptLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
