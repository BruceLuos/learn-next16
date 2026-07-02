import { Lesson } from "@/components/lesson/lesson-layout";
import { Concept } from "@/components/lesson/concept";
import { Callout } from "@/components/lesson/callout";
import { KeyPoints } from "@/components/lesson/key-points";
import { Demo } from "@/components/lesson/demo";
import { P, H2, UL, LI, Lead, Source } from "@/components/lesson/typography";
import { CodeBlock } from "@/components/code-block";
import { CompilerDemo } from "@/components/demos/compiler-demo";

export default function Page() {
  return (
    <Lesson
      href="/react19/compiler"
      title="React Compiler"
      badge="new"
      description="16 里稳定了：自动 memoize，从此告别手写 useMemo / useCallback。"
    >
      <Lead>
        React Compiler 是一个编译期优化器：它分析你的组件，自动插入等价于{" "}
        <code>useMemo</code>/<code>useCallback</code> 的记忆化逻辑。你写的代码更简单，性能却更好。
        本项目已经 <code>reactCompiler: true</code> 全局开启。
      </Lead>

      <Concept title="它解决了什么">
        <P>
          手动 <code>useMemo</code> 又啰嗦又容易写错（依赖漏了就 bug、多了就没用）。React Compiler
          按「规则」自动判断哪些值/函数需要缓存，并在依赖不变时跳过重算与子组件重渲染。
        </P>
      </Concept>

      <H2>开启它</H2>
      <CodeBlock
        code={`# 1. 装插件
pnpm add -D babel-plugin-react-compiler

# 2. next.config.ts
const nextConfig = {
  reactCompiler: true, // 16 从 experimental 转正
};`}
        highlight={[5]}
      />

      <H2>之前 vs 之后</H2>
      <CodeBlock
        code={`// ❌ 之前：手动 memo，又长又易错
function Todo({ todos, onClick }) {
  const visible = useMemo(() => todos.filter(done), [todos]);
  const handleClick = useCallback((id) => onClick(id), [onClick]);
  return <List items={visible} onSelect={handleClick} />;
}

// ✅ 之后（Compiler 已开启）：直接写，自动优化
function Todo({ todos, onClick }) {
  const visible = todos.filter(done);          // 自动 memo
  const handleClick = (id) => onClick(id);     // 自动稳定引用
  return <List items={visible} onSelect={handleClick} />;
}`}
        highlight={[4, 5, 9, 10]}
      />

      <Callout variant="warning" title="代价：编译变慢">
        React Compiler 依赖 Babel 做代码分析，所以<strong>开启后 dev 首次编译和 build 都会变慢</strong>。
        这是预期内的权衡。本项目开启了它，你能直接感受到首次编译略慢。
      </Callout>

      <Demo
        title="没有一行 useMemo"
        description="下面的过滤列表组件里完全没有 useMemo/useCallback。改过滤词会重算；只点计数器，Compiler 会跳过不必要的重算与重渲染。"
      >
        <CompilerDemo />
      </Demo>

      <Callout variant="tip" title="「React 规则」是前提">
        Compiler 要求你遵守 <strong>Rules of React</strong>（不在渲染期改可变全局、hook 顶层调用等）。
        代码越规范，Compiler 优化越激进；违规则会自动跳过该处（安全降级），不会出错。
      </Callout>

      <KeyPoints
        points={[
          "reactCompiler 在 16 稳定（原 experimental）。",
          "自动 memoize，告别手写 useMemo/useCallback。",
          "代价：依赖 Babel，dev/build 编译变慢。",
          "前提：遵守 Rules of React，否则该处安全降级跳过。",
        ]}
      />
      <Source>参考：React「React Compiler」；Next.js「reactCompiler 配置」。</Source>
    </Lesson>
  );
}
