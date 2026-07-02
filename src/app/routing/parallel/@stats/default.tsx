/** 16：每个并行槽都必须有 default.tsx，否则构建失败。
 *  当该槽没有匹配的活跃状态时，用 default 兜底。这里返回 null。 */
export default function Default() {
  return null;
}
