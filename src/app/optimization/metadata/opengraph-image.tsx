import { ImageResponse } from "next/og";

/** 文件约定 opengraph-image.tsx：自动成为本路由的 OG 图（/optimization/metadata/opengraph-image）。
 *  用 next/og 的 ImageResponse 在服务端「画」一张图。 */
export const alt = "Next.js 16 - Metadata & Dynamic OG Image";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(135deg,#0a0a0a 0%,#1a1a2e 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "white",
              color: "black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            N16
          </div>
          <div style={{ fontSize: 28, opacity: 0.8 }}>Next.js 16 Interactive Handbook</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05 }}>
            Metadata &amp; Dynamic OG Image
          </div>
          <div style={{ fontSize: 30, opacity: 0.7 }}>
            generateMetadata - ImageResponse - async params
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, opacity: 0.6 }}>
          <span>opengraph-image.tsx</span>
          <span>1200 x 630 - server rendered</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
