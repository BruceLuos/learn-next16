import type { NextConfig } from "next";

/**
 * Next.js 16 配置 —— 本文件本身就是 /fundamentals/config 一课的教学产物。
 * 带 ⭐ 的都是 Next.js 16 的新默认 / 新位置，详见对应课程。
 */
const nextConfig: NextConfig = {
  // ⭐ Cache Components（原 experimental.dynamicIO / experimental.ppr 合并升级）
  // 开启后：全站默认「动态渲染」，必须用 "use cache" 指令显式选择缓存。
  // 这是 Next 16 缓存心智模型的核心翻转：从「默认缓存」变为「默认动态、按需缓存」。
  // 同时完整启用 PPR（Partial Pre-Rendering）：静态壳 + 动态洞。详见 /rendering/cache-components
  cacheComponents: true,

  // ⭐ React Compiler（稳定）。自动 memo，无需手写 useMemo/useCallback。
  // 需安装 babel-plugin-react-compiler（已装）。会增加编译耗时，属预期。详见 /react19/compiler
  reactCompiler: true,

  // ⭐ Turbopack 配置：16 从 experimental.turbopack 提升为顶层字段。
  // Turbopack 已是默认打包器（dev + build），无需 --turbopack。
  turbopack: {
    // 演示用：当客户端代码误引用 node 内建模块时，可用 resolveAlias 兜底（取代 webpack 的 resolve.fallback）
    resolveAlias: {
      // fs: { browser: "./src/lib/empty-module.ts" }, // 仅作示例，默认不开启
    },
  },

  experimental: {
    // ⭐ Turbopack 文件系统缓存（beta）：把编译产物持久化到磁盘，跨重启显著加速大型项目冷启动
    turbopackFileSystemCacheForDev: true,
  },

  // ⭐ next/image 新默认值（详见 /optimization/image）
  images: {
    // 默认由 60s 提升到 4 小时（14400s），减少无 cache-control 头图片的反复校验
    minimumCacheTTL: 14400,
    // 默认由 [1..100] 收敛为 [75]；使用 quality 时会向列表中最近的值收敛
    qualities: [50, 75, 100],
    // 默认最多重定向 3 次（原为无限）
    maximumRedirects: 3,
    // 远程图片白名单（images.domains 已废弃，改用 remotePatterns）
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },

  // 日志：dev 请求日志会拆分显示 Compile / Render 耗时（16 新增）
  logging: {
    fetches: { fullUrl: false },
  },
};

export default nextConfig;
