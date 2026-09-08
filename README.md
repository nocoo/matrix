<p align="center">
  <img src="assets/brand/icon-rounded.png" width="128" height="128" alt="Matrix" />
</p>

<h1 align="center">Matrix</h1>

<p align="center">为数据看板提供绿黑配色的控件、图表和页面模板。</p>

<p align="center">
  <a href="https://matrix.hexly.ai">站点</a> ·
  <a href="docs/README.en.md">English</a>
</p>

## 这是什么

Matrix 是以终端界面和 Matrix 视觉风格为参考的 React UI 示例集。绿黑配色、等宽字体、ASCII 边框与动态字符组成统一的看板样式，适合复用到管理界面、个人数据页或产品原型。

仓库运行的是静态 SPA，账户、交易、健康和任务面板使用模拟数据。登录页和运行状态用于展示界面，不连接身份认证、金融账户、健康数据或真实任务调度服务。

## 功能

- 使用 AsciiBox、MatrixButton、MatrixInput、MatrixSelect 和 MatrixShell 组合页面与交互控件。
- 展示表单、表格、导航、弹层、通知、标签和确认流程。
- 提供趋势图、迷你折线、年度热力图、指标面板和任务运行记录的界面示例。
- 使用 Canvas 字符雨、文字解码、打字机效果和启动序列构建动态页面。
- 浏览账户、卡片、流水、预算、投资组合与 Life.ai 健康看板模板。
- 支持中英文切换，提供主题色板参考；目前仅有深色主题。

## 使用

打开[在线示例](https://matrix.hexly.ai)，从侧栏查看控件和页面。

| 示例 | 路由 |
| --- | --- |
| Dashboard 与组件集合 | `/`、`/component-showcase` |
| 控件、按钮、表单、表格 | `/controls`、`/buttons`、`/forms`、`/tables` |
| 反馈、弹层、导航、标签 | `/feedback`、`/overlays`、`/navigation`、`/pills` |
| 账户、卡片、流水、进度 | `/accounts`、`/card-showcase`、`/records`、`/progress-tracking` |
| 图表与健康示例 | `/stats`、`/flow-comparison`、`/portfolio`、`/life-ai` |
| 配色与设置 | `/palette`、`/settings` |

主要可复用控件在 [src/components/ui/](src/components/ui/)。主题由 [src/index.css](src/index.css) 中的 Tailwind CSS 变量定义，使用 `text-matrix-primary`、`bg-matrix-panel` 等类名。矩形容器保持直角，圆点与头像可以使用圆形。

将模板用于业务应用时，替换 `src/data/mock.ts` 及组件内示例数据，并提供自己的数据访问和认证逻辑。示例代码按 `models/`、`viewmodels/` 和 `pages/` 组织计算、状态与页面。

## 开发

使用 Bun；Node.js 建议采用 24 或更新版本。

```bash
git clone https://github.com/nocoo/matrix.git
cd matrix
bun install --frozen-lockfile
bun run dev
```

开发地址为 `http://localhost:7013`，不需要后端账号或环境变量。

```bash
bun run typecheck
bun run lint
bun run build
bun run preview
```

静态产物在 `dist/`。部署时为 React Router 配置 `index.html` 回退；[wrangler.toml](wrangler.toml)已提供 Cloudflare Workers 静态资源配置。`/api/live` 是 Vite 开发服务器的状态接口，生产静态站不提供该 API。

## 测试

| 测试层 | 命令 |
| --- | --- |
| 单元与组件测试 | `bun run test` |
| 开发时持续运行 | `bun run test:watch` |

运行单个测试文件：

```bash
bun run test src/test/components/MatrixButton.test.tsx
```

测试使用 Vitest、jsdom 和 Testing Library。可用 `bun run test:coverage` 查看可复用 UI 组件与 `src/lib/` 工具函数的报告；当前没有独立的 API 或浏览器端到端测试入口。

## 技术栈

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-149ECA?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)

| 部分 | 实现 |
| --- | --- |
| 应用与路由 | React、TypeScript、React Router |
| 视觉与图表 | Tailwind CSS、原生 SVG / Canvas、Lucide |
| 国际化 | i18next、react-i18next |
| 开发与托管 | Vite / SWC、Bun、Biome、Vitest、Testing Library、Cloudflare Workers 静态资源 |

## 文档

- [品牌资源与使用](assets/brand/README.md)
- [可复用组件源码](src/components/ui/)
- [变更记录](CHANGELOG.md)

界面风格和部分组件模式参考 [VibeUsage 的 Matrix-A Design System](https://github.com/victorGPT/vibeusage)。

## 许可证

[MIT](LICENSE) © 2026 Zheng Li
