# Chrome Web Store Listing — ClipMind AI (划词智能提取与爆款文案助手)

> Last Updated: 2026-10-24

## Store Listing

**Extension Name** [REQUIRED]
ClipMind AI - 划词智能提取与爆款文案助手

**Short Description** [REQUIRED]
在任意网页划词即可一键提炼核心要点、改写小红书/推特爆款文案、多语言翻译并导出精美知识卡片。

**Detailed Description** [REQUIRED]
ClipMind AI 是专为内容创作者、跨境卖家、学生与知识工作者打造的极速划词提炼神器。无需在聊天窗口与网页之间频繁复制粘贴，只需在任意网页轻轻划选文字，悬浮工具栏即刻为你智能生成！

主要功能：
- 核心要点提炼：一键抓取长文重点，自动整理为清晰明了的结构化笔记。
- 爆款自媒体改写：将枯燥素材一键转化为富有吸引力的小红书种草文案与社媒讨论热帖。
- 中英地道互译：提供语境精准的高保真双向翻译，阅读外文文献与外媒毫无阻碍。
- 闪念卡片与一键导出：支持把网页精选句子随时归档，并一键导出为 Markdown 与纯文本。
- 零配置即可用，高级功能直连：内置快速规则引擎；同时支持接入个人 DeepSeek / OpenAI / Gemini 密钥，隐私数据完全留存在本地。

使用方法：
1. 在任意网页用鼠标划选你感兴趣的文字。
2. 点击弹出的悬浮小气泡（如“✨ 提炼”或“📱 小红书”）。
3. 即刻在浮动卡片中预览生成结果，一键复制或存入知识库。
4. 点击浏览器右上角插件图标，可集中管理或导出所有收藏笔记。

隐私承诺：
您的网页浏览历史与个人信息绝不会被上传或收集。所有用户配置均加密保存在浏览器本地。

**Category** [REQUIRED]
Productivity

**Single Purpose** [REQUIRED]
帮助用户在浏览网页时划选文本并快速进行要点提炼、文案改写、双语翻译与知识卡片导出。

**Primary Language** [REQUIRED]
zh-CN (Chinese Simplified)

## Graphics & Assets

| Asset | Dimensions | Status | Filename |
|-------|-----------|--------|----------|
| Store Icon [REQUIRED] | 128×128 PNG | ✅ Ready | icons/icon-128.png |
| Screenshot 1 [REQUIRED] | 1280×800 | ✅ Ready | promo-screenshots/screenshot-1-1280x800.png |
| Screenshot 2 [RECOMMENDED] | 1280×800 | ✅ Ready | promo-screenshots/screenshot-2-1280x800.png |

### Submission ZIP Package [REQUIRED]
- **Store-Ready Clean Zip**: `C:\Users\admin\.gemini\antigravity\scratch\ClipMind-ChromeWebStore-Upload.zip` (已剔除所有非运行时文件，严格符合 Google Web Store 审核规范)

## Permissions Justification

| Permission | Type | Justification |
|------------|------|---------------|
| `storage` | permissions | 用于在本地保存用户的每日使用额度记录、个人设置项、API Key 以及收藏的知识卡片。 |
| `contextMenus` | permissions | 在浏览器右键菜单中增加快速分析选项，方便用户通过鼠标右键快速触发提炼与翻译。 |
| `clipboardWrite` | permissions | 允许用户点击“一键复制”按钮时将提炼成果直接复制到系统剪贴板。 |

## Privacy & Data Use

### Data Collection

**Does the extension collect user data?** No

*此扩展不设任何自建中心服务器收集用户隐私数据，所有数据均保留在本地 Chrome Storage 中。如果用户配置了第三方 API Key，请求将直接发送给对应的官方模型提供方。*

### Data Use Certification
- [x] Data is NOT sold to third parties
- [x] Data is NOT used for purposes unrelated to the extension's core functionality
- [x] Data is NOT used for creditworthiness or lending purposes

## Privacy Policy

**Privacy Policy URL** [REQUIRED]
https://github.com/your-username/clipmind-ai/blob/main/PRIVACY.md

## Distribution

**Visibility**: Public  
**Regions**: All regions

## Developer Info

**Publisher Name** [REQUIRED]
ClipMind Lab

**Contact Email** [REQUIRED]
support@clipmind.ai

## Version History

| Version | Date | Changes | Status |
|---------|------|---------|--------|
| 1.0.0 | 2026-10-24 | 首次发布：网页划词浮动气泡、智能提炼、小红书改写、双语互译、闪念卡片与 Markdown 导出。 | Draft |
