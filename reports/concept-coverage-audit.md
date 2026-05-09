# 《无穷的开始》概念覆盖审计

这份审计按原书 18 章目录、当前 `notes/` 概念节点和知识图谱连接关系来评估。目标不是逐句复述原书，而是判断当前 reading companion 的 precision（概念是否准确、是否混入非原书内容）和 recall（章节级核心概念是否覆盖）。

## 总体判断

当前笔记对全书主轴覆盖较好：解释、好解释、难以改变、知识创造、批判、进步、通用性、通用解释者、AI、模因、静态/动态社会、乐观主义、可持续性这些核心节点已经成网。

主要 recall 缺口在五个章节级主题：第 2 章的现实/实在论与工具主义，第 5 章的抽象现实与还原论，第 10 章的苏格拉底之梦与客观知识，第 12 章的坏哲学，第 13 章的选择/社会选择。已新增对应节点：`Reality`、`Instrumentalism`、`Abstraction`、`Reductionism`、`Socratic Dream`、`Objective Knowledge`、`Bad Philosophy`、`Choice`。

Naval 相关内容是有意加入的外部延伸来源，不再作为 precision 阻塞项处理。为了让读者理解来源层级，后续可以给节点增加 `source: book | extension`，或在文中统一标注“延伸理解”。本轮对照的 Naval 来源是 [Part 1](https://nav.al/infinity) 和 [Part 2](https://nav.al/infinity-2)。

## 章节覆盖

| 原书章节 | 当前覆盖 | 判断 |
| --- | --- | --- |
| 引言 / 第 1 章 解释的延伸 | `Good Explanation`, `Bad Explanation`, `Hard to vary`, `Reach`, `Science` | 召回高，precision 基本好 |
| 第 2 章 更接近现实 | `Empiricism`, `Inductivism`, `Testability`，新增 `Reality`, `Instrumentalism` | 原先缺实在论主轴，已补 |
| 第 3 章 思想的火花 | `Enlightenment`, `Criticism`, `Progress`, `Static Societies`, `Dynamic Societies` | 覆盖足够 |
| 第 4 章 创造 | `Evolution`, `Neo-Darwinism`, `Bad Explanations for Biology`, `Knowledge Creation` | 新增生物坏解释后覆盖较好 |
| 第 5 章 抽象的现实 | 新增 `Abstraction`, `Reductionism`，已有 `Emergent phenomena` | 原先是最大缺口之一，已补核心节点 |
| 第 6 章 向通用性跳转 | `Jump to Universality`, `Universality`, `Universal System`, `Universal Computation` | 覆盖高 |
| 第 7 章 人工创造力 | `AI`, `Creativity`, `Person`, `Universal Explainers` | 覆盖高；需避免把当代 AI 评论写成原书结论 |
| 第 8 章 无穷的窗口 | `Infinity`, `Multiverse`, `Principle of Mediocrity` | 可继续加强 `Infinity`，但核心有入口 |
| 第 9 章 乐观主义 | `Optimism`, `Problems`, `Blind Optimism`, `Blind Pessimism` | 覆盖高 |
| 第 10 章 苏格拉底的梦 | 新增 `Socratic Dream`, `Objective Knowledge`，已有 `Morality`, `Fallibilism` | 原先缺章节入口，已补 |
| 第 11 章 多重宇宙 | `Multiverse`, `Qualia`, `Fungibility` | 覆盖中高；可未来补概率/决策相关节点 |
| 第 12 章 坏哲学史 | 新增 `Bad Philosophy`，已有 `Empiricism`, `Instrumentalism`, `Good Explanation` | 原先过于分散，已补总入口 |
| 第 13 章 选择 | 新增 `Choice`，已有 `Governing`, `Arrow's theorem` | 原先有政治结论但缺章节主轴，已补 |
| 第 14 章 花儿为什么美丽 | `Beauty` | 新增后覆盖足够；需把“客观美”表述为 Deutsch 的论证方向而非已完成定论 |
| 第 15 章 文化的进化 | `Memes`, `Rational Meme`, `Anti-rational Meme`, `Culture` | 覆盖高 |
| 第 16 章 创造力进化 | `Creativity`, `Evolution`, `Memes` | 覆盖中高 |
| 第 17 章 不可维持 | `Sustainability`, `Unsustainable`, `Precautionary Principle`, `Spaceship Earth` | 覆盖高 |
| 第 18 章 开始 | `Beginning of Infinity`, `Optimism`, `Universal Explainers`, `Infinity` | 覆盖中高；可继续加强收束型总论 |

## 建议的下一轮整理

1. 给笔记增加来源层级：原书核心、原书支撑、外部延伸。这样 knowledge graph 可以过滤，precision 会更清楚。
2. Naval 相关段落保留为外部延伸；后续只需要统一标注来源层级，不需要移除。
3. 如果想让 recall 更接近全书细节，可以再补 `Probability`, `Decision Theory`, `Tradition`, `Justificationism` 这类二级节点；它们属于第二优先级，不影响当前版本发布。
4. 后续可以把 `source` 元数据接入 knowledge graph，让读者在“原书核心”和“外部延伸”之间切换视图。
