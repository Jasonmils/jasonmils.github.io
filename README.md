# Jason Ding · 个人网站

线上地址：https://jasonmils.github.io/

## 目录

- **`docs/` — 新版网站**：当前双语面试网站，GitHub Pages 只发布这个目录。
- **`legacy/` — 旧版网站归档**：旧学术主页的代码、文章、图片、附件及原说明文档，完整保留原有内部目录结构。此目录不参与当前网站发布。

## 日常修改

| 文件 | 用途 |
| --- | --- |
| `docs/content.js` | 中英文内容 |
| `docs/styles.css` | 样式和排版 |
| `docs/app.js` | 导航、语言切换和项目面板 |
| `docs/index.html` | 网站入口 |
| `docs/assets/` | 新版字体、Logo 和许可说明 |

将新版修改提交到 `master` 后，GitHub Pages 自动发布。无需安装依赖或构建。

Pages 配置：**Deploy from a branch → master → /docs**。网址不包含 `/docs`。

## 数学公式

页面使用本地 KaTeX 排版，支持正文中的 `\(...\)` 和独立公式 `\[...\]` / `$$...$$`。中英文和项目详情面板都会自动渲染。库、字体和许可保存在 `docs/assets/vendor/katex/`，无需安装依赖。

在 `docs/content.js` 中使用 `String.raw` 保留公式的反斜杠，例如：

```js
T(String.raw`目标为 \(Y_{\ln}=\ln(1+Y/X_L)\)`,
  String.raw`The target is \(Y_{\ln}=\ln(1+Y/X_L)\)`)
```

`docs/app.js` 中的 `renderEquation(标题, 公式, 说明)` 用于带标题的公式卡片，公式参数直接写 TeX，无需另加定界符。过长公式会在卡片内横向滚动。

如需处理旧网站，请在 `legacy/` 内操作；原有使用说明见 [legacy/README.md](legacy/README.md)。两个版本的资源文件已分开。
