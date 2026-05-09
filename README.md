# 无穷的开始（The Beginning of Infinity）

> **在线阅读：[beginning-of-infinity-zh.vercel.app](https://beginning-of-infinity-zh.vercel.app/)**

这是《无穷的开始（The Beginning of Infinity）》reading companion 的中文本地化版本。

本项目基于 [team-reflect/beginning-of-infinity](https://github.com/team-reflect/beginning-of-infinity) 制作；原站点由 [Reflect](https://reflect.app) 团队创建，并运行在 [thebeginningofinfinity.xyz](https://thebeginningofinfinity.xyz)。原始代码、笔记结构和交互体验的 credit 归原仓库与原作者所有。

## 本版本新增内容

这个仓库已经不只是原始 reading companion 的中文翻译。当前版本在原仓库基础上做了这些扩展：

- 将原有笔记本地化为中文，并在关键英文术语旁保留英文标注，方便对照原书概念。
- 基于原书 EPUB 重新做了一轮概念覆盖检查，补充了 `Reality`、`Instrumentalism`、`Abstraction`、`Reductionism`、`Socratic Dream`、`Objective Knowledge`、`Bad Philosophy`、`Choice` 等章节级核心节点。
- 增加了来自 Naval Ravikant 对《The Beginning of Infinity》的两篇解读的外部延伸内容：[Part 1](https://nav.al/infinity) 和 [Part 2](https://nav.al/infinity-2)。
- 增强了多层级阅读体验：点击内部链接会打开下一级笔记，并高亮当前层级被选中的链接，方便回看阅读 trace。
- 增加了可视化知识网络：右下角按钮可打开全局 knowledge graph，支持力导向布局、节点拖拽、重置布局、点击节点查看摘要和跳转原笔记。
- 补充了发布前的概念覆盖报告：[reports/concept-coverage-audit.md](reports/concept-coverage-audit.md)。
- 已适配 Vercel 部署，构建时会把 `notes/` 生成到 `server/generated/notes-data.json`，避免部署环境依赖运行时文件扫描。

# 这本书

我们认为《[无穷的开始（The Beginning of Infinity）](https://www.amazon.com/Beginning-Infinity-Explanations-Transform-World/dp/0143121359)》是有史以来最重要的书之一。不过它内容密度很高，对普通读者来说并不容易读。我们做这个网站，是为了分享自己的高层次笔记，传播戴维·多伊奇（David Deutsch）的思想，也鼓励更多人去读原书。

这里的思想当然不属于我们：它们直接来自多伊奇的书，或来自对他的访谈。事实上，连这个网站的交互体验也不是我们原创，它受到了 [Andy Matuschak 的笔记](https://notes.andymatuschak.org/About_these_notes)启发。谢谢 David，也谢谢 Andy！

原作者已经开源了这个网站的代码，你也可以用它来整理自己的笔记。

这个中文版本保留原仓库的致谢：原网站由 [Reflect](https://reflect.app) 背后的团队创建。Reflect 是一款网络化笔记应用。

## 开始

克隆仓库并安装依赖。

```bash
yarn install
```

然后运行开发服务器：

```bash
yarn dev
```

用浏览器打开 [http://localhost:3000](http://localhost:3000) 查看页面。

## 部署到 Vercel

这个仓库已经为 Vercel 做了准备，可以直接在 Vercel Dashboard 里导入 GitHub 仓库：

1. 在 Vercel 选择 **Add New Project**。
2. 导入 `lmq3030/beginning-of-infinity-zh`。
3. Framework Preset 选择 **Next.js**。
4. Build Command 使用 `yarn build`。
5. Install Command 使用 `yarn install --frozen-lockfile`。
6. 不需要配置环境变量。

构建时会先运行 `yarn generate:notes`，把 `notes/` 里的 Markdown 生成到 `server/generated/notes-data.json`。这样部署后的页面和 API routes 都可以稳定读取笔记内容，不依赖运行时文件夹扫描。

如果之后修改了 `notes/` 里的内容，本地可以运行：

```bash
yarn generate:notes
```

然后提交生成后的 `server/generated/notes-data.json`。
