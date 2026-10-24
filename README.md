<div align="center">

# ⚡ ClipMind AI (智能网页划词提炼与爆款文案助手)

<p align="center">
  <strong>基于 Chrome Manifest V3 的极简高能生产力扩展 · 划选网页文字一键提炼要点与生成爆款文案</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Manifest-V3-indigo.svg" alt="Manifest V3">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License MIT">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome">
  <img src="https://img.shields.io/badge/Privacy-100%25%20Local-success.svg" alt="Privacy First">
</p>

</div>

---

## 📖 简介 (Introduction)

**ClipMind AI** 是一款开源、纯客户端运行、专注于消除网页浏览与内容创作上下文切换（Context Switching）的浏览器扩展插件。

无需在网页与大模型聊天窗口之间来回复制粘贴，只需在任意网页轻轻用鼠标划选文字，便能直接原地完成：
- 💡 **核心要点 3 秒速览**：长篇文献、新闻毫秒级结构化提取。
- 📱 **小红书/自媒体爆款改写**：将干货素材一键改写为情绪饱满、带 Emoji 的社媒爆款文案。
- 🌐 **高保真地道双语互译**：拒绝机械生硬机翻，支持直连 DeepSeek、OpenAI、Gemini 等大模型。
- 📋 **闪念卡片与 Markdown 导出**：随时随地收藏网页金句，一键导出标准 Markdown / Notion 格式笔记。

---

## 🌟 核心特色 (Features)

1. **零污染 Shadow DOM 技术**：所有浮动气泡与结果卡片均在隔离的 Shadow DOM 中渲染，绝不破坏宿主网页的原生 CSS 样式。
2. **纯客户端极简架构**：完全在用户浏览器本地运行，不上传任何浏览历史，保护隐私。
3. **多模型自由接入**：支持无 Key 本地启发式提炼；也支持填入个人 DeepSeek / OpenAI / Gemini API Key 享受顶级深度大模型能力。
4. **开箱即用知识库**：内置卡片流归档管理，一键下载标准 Markdown 读书报告。

---

## 🚀 快速开始与安装 (Getting Started)

### 方法一：开发者加载模式（30 秒离线安装）
1. 克隆或下载本项目至本地：
   ```bash
   git clone https://github.com/your-username/smart-clipper-ai.git
   ```
2. 打开 Chrome 浏览器，在地址栏输入：`chrome://extensions/` 并回车；
3. 打开右上角的 **“开发者模式”** 开关；
4. 点击左上角的 **“加载已解压的扩展程序”**；
5. 选择本项目所在文件夹，即可立即在任意网页划词体验！

---

## 📂 项目结构 (Project Structure)

```text
smart-clipper-ai/
├── manifest.json             # Manifest V3 核心配置文件
├── background.js             # 后台 Service Worker（额度调度、多模型调用）
├── content.js                # 网页划词浮动气泡与卡片组件（Shadow DOM 隔离）
├── content.css               # 基础宿主容器样式
├── icons/                    # 16px, 48px, 128px 扩展图标
├── popup/                    # 点击浏览器图标弹出的控制面板与知识库
│   ├── popup.html
│   ├── popup.css
│   ├── popup.js
│   └── keys.js
├── options/                  # 大模型配置中心与私有 Key 设置页
│   ├── options.html
│   ├── options.css
│   └── options.js
├── landing-page/             # 官方宣传与体验落地页
└── LICENSE                   # MIT 开源协议
```

---

## ☕ 赞助与支持 (Support & Sponsor)

如果您觉得 ClipMind 对您的日常阅读和内容创作有所帮助，欢迎赞助作者一杯咖啡支持开源开发：

<div align="center">
  <img src="qrcode.png" width="220" alt="WeChat Sponsor QR" />
  <p><em>微信扫码赞助支持作者 ☕</em></p>
</div>

---

## 📄 开源许可 (License)

本项目采用 [MIT License](LICENSE) 开源协议，欢迎 Star ⭐️、Fork、提交 PR 或基于此项目进行二次开发！
