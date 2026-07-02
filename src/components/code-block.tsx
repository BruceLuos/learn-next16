import { createHighlighter, type Highlighter } from "shiki";
import { cacheLife } from "next/cache";

/**
 * <CodeBlock> —— 基于 shiki 的服务端代码高亮组件（RSC）。
 *
 * 要点（也是一节"潜台词"课）：
 * - 完全在服务端渲染高亮 HTML，客户端 0 JS 体积。
 * - highlighter 单例化（模块级 Promise 缓存），避免每次渲染重复加载语法/主题。
 * - 代码块始终使用深色主题（与站点明暗主题解耦，阅读体验更稳）。
 * - 本身是 Cache Component（"use cache"）：既缓存昂贵的高亮计算，也满足 cacheComponents
 *   模式下「服务端组件读取当前时间需先访问动态数据」的约束——缓存组件允许在缓存时读取时间。
 */

type Lang = "tsx" | "ts" | "jsx" | "js" | "bash" | "json" | "css" | "text";

interface CodeBlockProps {
  code: string;
  lang?: Lang;
  /** 文件名 / 标题，显示在顶栏 */
  title?: string;
  /** 要高亮的行号（1-based） */
  highlight?: number[];
}

// 模块级单例：只在首次调用时加载主题与语言
let highlighterPromise: Promise<Highlighter> | null = null;
function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark-default"],
      langs: ["tsx", "typescript", "jsx", "javascript", "bash", "json", "css"],
    });
  }
  return highlighterPromise;
}

export async function CodeBlock({
  code,
  lang = "tsx",
  title,
  highlight = [],
}: CodeBlockProps) {
  "use cache";
  // 代码内容稳定，按 (code, lang, title, highlight) 自动生成缓存键，长期缓存
  cacheLife("days");

  const highlighter = await getHighlighter();
  const html = highlighter.codeToHtml(code.trimEnd(), {
    lang,
    theme: "github-dark-default",
    // 内联传入，借助 transformers 的上下文类型推断 node/line（无需显式导入类型）
    transformers: highlight.length
      ? [
          {
            name: "next16:line-highlight",
            line(node, line) {
              if (highlight.includes(line)) {
                this.addClassToHast(node, "highlighted");
              }
              return node;
            },
          },
        ]
      : [],
  });

  return (
    <figure className="code-block-wrapper not-prose my-5">
      <figcaption className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-2">
        <span className="flex gap-1.5">
          <span className="size-3 rounded-full bg-[#ff5f56]" />
          <span className="size-3 rounded-full bg-[#ffbd2e]" />
          <span className="size-3 rounded-full bg-[#27c93f]" />
        </span>
        <span className="ml-1 font-mono text-xs text-zinc-400">
          {title ?? lang}
        </span>
        <span className="ml-auto rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-zinc-400">
          {lang}
        </span>
      </figcaption>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </figure>
  );
}
