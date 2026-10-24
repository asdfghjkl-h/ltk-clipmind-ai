/**
 * ClipMind AI - Content Script
 * Runs inside web pages, isolated with Shadow DOM
 */

(function () {
  if (window.__CLIPMIND_INJECTED__) return;
  window.__CLIPMIND_INJECTED__ = true;

  // 1. Create Shadow Host
  const host = document.createElement("div");
  host.id = "clipmind-host";
  document.documentElement.appendChild(host);
  const shadow = host.attachShadow({ mode: "open" });

  // 2. Inject Styles inside Shadow DOM
  const style = document.createElement("style");
  style.textContent = `
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }

    .clipmind-bubble {
      position: absolute;
      display: none;
      align-items: center;
      background: #1e1b4b;
      background: linear-gradient(135deg, #312e81 0%, #1e1b4b 100%);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 30px;
      padding: 4px 6px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
      z-index: 2147483647;
      pointer-events: auto;
      animation: cmFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes cmFadeIn {
      from { opacity: 0; transform: translateY(6px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .clipmind-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: transparent;
      color: #e0e7ff;
      border: none;
      padding: 5px 10px;
      font-size: 12px;
      font-weight: 500;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.18s ease;
      white-space: nowrap;
    }

    .clipmind-btn:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #ffffff;
      transform: translateY(-1px);
    }

    .clipmind-btn:active {
      transform: translateY(0);
    }

    .clipmind-divider {
      width: 1px;
      height: 14px;
      background: rgba(255, 255, 255, 0.15);
      margin: 0 2px;
    }

    /* Floating Result Card */
    .clipmind-card {
      position: absolute;
      display: none;
      flex-direction: column;
      width: 380px;
      max-width: 90vw;
      background: #ffffff;
      border-radius: 14px;
      box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.08);
      z-index: 2147483647;
      pointer-events: auto;
      overflow: hidden;
      animation: cmCardIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes cmCardIn {
      from { opacity: 0; transform: translateY(10px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .clipmind-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: #ffffff;
    }

    .clipmind-card-title {
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .clipmind-badge {
      font-size: 10px;
      padding: 2px 6px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
    }

    .clipmind-card-close {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.8);
      cursor: pointer;
      font-size: 18px;
      line-height: 1;
      padding: 2px 6px;
      border-radius: 6px;
      transition: background 0.15s;
    }

    .clipmind-card-close:hover {
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
    }

    .clipmind-card-body {
      padding: 16px;
      max-height: 280px;
      overflow-y: auto;
      color: #334155;
      font-size: 13px;
      line-height: 1.6;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .clipmind-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      gap: 8px;
      color: #6366f1;
      font-weight: 500;
    }

    .clipmind-spinner {
      width: 18px;
      height: 18px;
      border: 2px solid #e0e7ff;
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: cmSpin 0.8s linear infinite;
    }

    @keyframes cmSpin {
      to { transform: rotate(360deg); }
    }

    .clipmind-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
    }

    .clipmind-footer-left {
      font-size: 11px;
      color: #94a3b8;
    }

    .clipmind-footer-actions {
      display: flex;
      gap: 8px;
    }

    .clipmind-action-btn {
      font-size: 12px;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.15s;
    }

    .clipmind-btn-secondary {
      background: #ffffff;
      color: #475569;
      border: 1px solid #cbd5e1;
    }
    .clipmind-btn-secondary:hover {
      background: #f1f5f9;
      border-color: #94a3b8;
    }

    .clipmind-btn-primary {
      background: #4f46e5;
      color: #ffffff;
      border: none;
    }
    .clipmind-btn-primary:hover {
      background: #4338ca;
    }

    .clipmind-notice {
      background: #fffbeb;
      border: 1px solid #fef3c7;
      color: #b45309;
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 12px;
      margin-bottom: 10px;
    }
  `;
  shadow.appendChild(style);

  // 3. Create DOM Elements
  const bubble = document.createElement("div");
  bubble.className = "clipmind-bubble";
  bubble.innerHTML = `
    <button class="clipmind-btn" data-action="summarize">✨ 提炼</button>
    <div class="clipmind-divider"></div>
    <button class="clipmind-btn" data-action="xhs">📱 小红书</button>
    <div class="clipmind-divider"></div>
    <button class="clipmind-btn" data-action="translate">🌐 翻译</button>
    <div class="clipmind-divider"></div>
    <button class="clipmind-btn" data-action="save">📋 存卡片</button>
  `;
  shadow.appendChild(bubble);

  const card = document.createElement("div");
  card.className = "clipmind-card";
  card.innerHTML = `
    <div class="clipmind-card-header">
      <div class="clipmind-card-title">
        <span>⚡ ClipMind AI</span>
        <span class="clipmind-badge" id="cm-badge">分析结果</span>
      </div>
      <button class="clipmind-card-close" id="cm-close">×</button>
    </div>
    <div class="clipmind-card-body" id="cm-body">
      <!-- Dynamic Content -->
    </div>
    <div class="clipmind-card-footer">
      <div class="clipmind-footer-left" id="cm-status">就绪</div>
      <div class="clipmind-footer-actions">
        <button class="clipmind-action-btn clipmind-btn-secondary" id="cm-copy">复制结果</button>
        <button class="clipmind-action-btn clipmind-btn-primary" id="cm-save-card">保存记录</button>
      </div>
    </div>
  `;
  shadow.appendChild(card);

  // References
  const cmBody = shadow.getElementById("cm-body");
  const cmBadge = shadow.getElementById("cm-badge");
  const cmStatus = shadow.getElementById("cm-status");
  const cmClose = shadow.getElementById("cm-close");
  const cmCopy = shadow.getElementById("cm-copy");
  const cmSaveCard = shadow.getElementById("cm-save-card");

  let currentSelectedText = "";
  let currentResultText = "";
  let currentAction = "";
  let isMouseSelecting = false;

  // 4. Mouse and Selection Events
  document.addEventListener("mousedown", (e) => {
    isMouseSelecting = true;
    // Don't close if clicking inside our shadow root
    if (e.composedPath().includes(host)) return;
    bubble.style.display = "none";
  });

  document.addEventListener("mouseup", (e) => {
    isMouseSelecting = false;
    if (e.composedPath().includes(host)) return;

    setTimeout(() => {
      const selection = window.getSelection();
      const text = selection.toString().trim();

      if (text.length >= 2) {
        currentSelectedText = text;
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Calculate positioning
        const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        let top = rect.top + scrollY - 45;
        let left = rect.left + scrollX + (rect.width / 2) - 130;

        if (top < scrollY + 10) top = rect.bottom + scrollY + 10;
        if (left < 10) left = 10;

        bubble.style.top = `${top}px`;
        bubble.style.left = `${left}px`;
        bubble.style.display = "flex";
      } else {
        bubble.style.display = "none";
      }
    }, 50);
  });

  // Action Click Handler on Bubble
  bubble.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const action = btn.dataset.action;
    if (!action) return;

    bubble.style.display = "none";
    runAction(action, currentSelectedText);
  });

  // Execute Action
  async function runAction(action, text) {
    if (!text) return;
    currentAction = action;

    // Position Card
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    
    // Position near center/selection
    const top = Math.max(scrollY + 60, parseFloat(bubble.style.top || 100));
    const left = Math.max(10, Math.min(window.innerWidth - 400, parseFloat(bubble.style.left || 100)));

    card.style.top = `${top}px`;
    card.style.left = `${left}px`;
    card.style.display = "flex";

    // Update Action Badge
    const badgeMap = {
      summarize: "核心要点提炼",
      xhs: "小红书爆款文案",
      translate: "双语互译",
      save: "闪念金句存盘"
    };
    cmBadge.textContent = badgeMap[action] || "智能处理";

    if (action === "save") {
      currentResultText = text;
      cmBody.textContent = `已成功选定金句：\n\n"${text}"\n\n点击下方【保存记录】即可归档到 ClipMind 知识库。`;
      cmStatus.textContent = "待保存";
      return;
    }

    // Show Loading
    cmBody.innerHTML = `
      <div class="clipmind-loading">
        <div class="clipmind-spinner"></div>
        <span>AI 正在思考提炼中...</span>
      </div>
    `;
    cmStatus.textContent = "处理中...";

    // Send to background
    try {
      chrome.runtime.sendMessage(
        { type: "EXECUTE_ACTION", action, text },
        (res) => {
          if (!res) {
            cmBody.textContent = "未能连接至后台扩展服务，请刷新页面重试。";
            return;
          }

          if (!res.success) {
            cmBody.innerHTML = `
              <div class="clipmind-notice">
                ⚠️ ${res.error || "执行出错"}
              </div>
              <p>请点击扩展图标进入【设置】，填入您自己的 API Key（如 DeepSeek/OpenAI）或解锁 Pro 享受无限额度。</p>
            `;
            cmStatus.textContent = "额度已达限";
            return;
          }

          currentResultText = res.result;
          cmBody.textContent = res.result;
          cmStatus.textContent = res.isPro ? "Pro 尊享会员" : `剩余免费额度: ${res.remainingQuota} 次`;
        }
      );
    } catch (err) {
      cmBody.textContent = `请求失败: ${err.message}`;
    }
  }

  // Card Controls
  cmClose.addEventListener("click", () => {
    card.style.display = "none";
  });

  cmCopy.addEventListener("click", () => {
    if (!currentResultText) return;
    navigator.clipboard.writeText(currentResultText).then(() => {
      const orig = cmCopy.textContent;
      cmCopy.textContent = "已复制 ✓";
      setTimeout(() => { cmCopy.textContent = orig; }, 1500);
    });
  });

  cmSaveCard.addEventListener("click", () => {
    if (!currentResultText) return;
    chrome.runtime.sendMessage({
      type: "SAVE_CLIP",
      clip: {
        sourceUrl: window.location.href,
        pageTitle: document.title,
        originalText: currentSelectedText,
        processedText: currentResultText,
        action: currentAction
      }
    }, (res) => {
      if (res && res.success) {
        const orig = cmSaveCard.textContent;
        cmSaveCard.textContent = "已存盘 ✓";
        setTimeout(() => { cmSaveCard.textContent = orig; }, 1500);
      }
    });
  });

  // Listen for context menu messages
  chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.type === "TRIGGER_ACTION_FROM_MENU") {
      currentSelectedText = req.text;
      runAction(req.action, req.text);
    }
  });

})();
