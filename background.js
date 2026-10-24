/**
 * ClipMind AI - Background Service Worker
 * Manifest V3 Compliant
 */

// Initialize default settings and context menus on install
chrome.runtime.onInstalled.addListener(async () => {
  // Setup context menus
  chrome.contextMenus.create({
    id: "clipmind_parent",
    title: "ClipMind AI 智能助手",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "clipmind_summarize",
    parentId: "clipmind_parent",
    title: "✨ 提炼核心三要点",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "clipmind_xhs",
    parentId: "clipmind_parent",
    title: "📱 改写为小红书爆款文案",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "clipmind_translate",
    parentId: "clipmind_parent",
    title: "🌐 智能中英双向互译",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "clipmind_save",
    parentId: "clipmind_parent",
    title: "📋 保存至知识金句卡片",
    contexts: ["selection"]
  });

  // Initialize storage defaults if not exists
  const existing = await chrome.storage.local.get(["isPro", "dailyQuota", "savedClips", "apiProvider"]);
  const today = new Date().toISOString().split("T")[0];

  const defaults = {};
  if (existing.isPro === undefined) defaults.isPro = false;
  if (!existing.dailyQuota || existing.dailyQuota.date !== today) {
    defaults.dailyQuota = { date: today, count: 0, max: 10 };
  }
  if (!existing.savedClips) defaults.savedClips = [];
  if (!existing.apiProvider) defaults.apiProvider = "deepseek";

  if (Object.keys(defaults).length > 0) {
    await chrome.storage.local.set(defaults);
  }
});

// Handle Context Menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab || !tab.id) return;
  const selectedText = info.selectionText || "";
  if (!selectedText.trim()) return;

  let actionType = "summarize";
  if (info.menuItemId === "clipmind_xhs") actionType = "xhs";
  else if (info.menuItemId === "clipmind_translate") actionType = "translate";
  else if (info.menuItemId === "clipmind_save") actionType = "save";

  // Send message to active tab to trigger overlay UI
  try {
    await chrome.tabs.sendMessage(tab.id, {
      type: "TRIGGER_ACTION_FROM_MENU",
      action: actionType,
      text: selectedText
    });
  } catch (err) {
    console.warn("Could not send message to tab, maybe content script is refreshing:", err);
  }
});

// Check & update daily quota
async function checkAndUpdateQuota() {
  const { isPro = false, dailyQuota } = await chrome.storage.local.get(["isPro", "dailyQuota"]);
  if (isPro) return { allowed: true, isPro: true };

  const today = new Date().toISOString().split("T")[0];
  let currentQuota = dailyQuota;

  if (!currentQuota || currentQuota.date !== today) {
    currentQuota = { date: today, count: 0, max: 10 };
  }

  if (currentQuota.count >= currentQuota.max) {
    return {
      allowed: false,
      isPro: false,
      remaining: 0,
      message: `今日免费 10 次额度已用完（已用 ${currentQuota.count}/${currentQuota.max}）。升级 Pro 或在设置中配置个人 API Key 即可无限畅享！`
    };
  }

  currentQuota.count += 1;
  await chrome.storage.local.set({ dailyQuota: currentQuota });

  return {
    allowed: true,
    isPro: false,
    remaining: currentQuota.max - currentQuota.count
  };
}

// Built-in offline fallback processor (works immediately without any external API Key!)
function processLocalFallback(text, action) {
  const clean = text.trim();
  if (action === "summarize") {
    const sentences = clean.split(/[。！？\n.!?]/).map(s => s.trim()).filter(s => s.length > 5);
    const topSentences = sentences.slice(0, 3);
    const bulletList = topSentences.length > 0 
      ? topSentences.map((s, i) => `${i + 1}. ${s}`).join("\n") 
      : `1. 核心关键词：${clean.slice(0, 30)}...\n2. 内容概括：长度 ${clean.length} 字。`;
    return `📌【智能核心速览】\n${bulletList}\n\n💡 提示：在插件设置中填入 API Key 可开启深度大模型洞察。`;
  } else if (action === "xhs") {
    return `🔥 救命！这个干货太绝了！必须码住👇\n\n“${clean.slice(0, 60)}...”\n\n✨ 核心亮点：\n1️⃣ 真的超级实用，强烈建议收藏！\n2️⃣ 细节拉满，越看越有启发。\n\n🏷️ #干货分享 #自我提升 #宝藏工具 #知识精进`;
  } else if (action === "translate") {
    const isChinese = /[\u4e00-\u9fa5]/.test(clean);
    return isChinese 
      ? `🌐 [En Translation Preview]:\n"${clean}" -> (Connecting to LLM for high-fidelity nuance translation...)`
      : `🌐 [中文参考翻译预览]:\n"${clean}" -> (建议在设置中开启 DeepSeek / OpenAI 获取地道流畅翻译)`;
  }
  return clean;
}

// Online API Caller (DeepSeek / OpenAI compatible API)
async function callLLM(prompt, userText, config) {
  const { apiKey, apiEndpoint = "https://api.deepseek.com/v1", model = "deepseek-chat" } = config;
  
  const response = await fetch(`${apiEndpoint.replace(/\/+$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: userText }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API 请求失败 (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "无生成结果";
}

// Runtime message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      if (message.type === "EXECUTE_ACTION") {
        const { action, text } = message;
        
        // 1. Quota Verification
        const quotaStatus = await checkAndUpdateQuota();
        if (!quotaStatus.allowed) {
          sendResponse({
            success: false,
            quotaExceeded: true,
            error: quotaStatus.message
          });
          return;
        }

        // 2. Read user settings
        const settings = await chrome.storage.local.get(["apiKey", "apiEndpoint", "model", "isPro"]);
        
        // 3. Execution
        let result = "";
        if (settings.apiKey && settings.apiKey.trim()) {
          let systemPrompt = "你是一个高效的信息提炼与文案大师。请直接输出结果，不要包含寒暄。";
          if (action === "summarize") {
            systemPrompt = "你是一个顶级研究员。请提取用户提供文本的3个核心要点，条理清晰，使用Emoji标号，并在最后给出一句金句总结。";
          } else if (action === "xhs") {
            systemPrompt = "你是一个小红书百万粉丝爆款博主。请将用户的内容改写成小红书风格：开头吸引眼球，正文短句带情绪，使用大量emoji，底部带5个热门话题标签。";
          } else if (action === "translate") {
            systemPrompt = "你是一个精通中英双语的资深同声传译。若输入为中文请翻译为地道自然英文；若为英文或其他语言请翻译为优美中文。直接给出翻译，不要附带解释。";
          }
          result = await callLLM(systemPrompt, text, settings);
        } else {
          // Fast instant local fallback
          result = processLocalFallback(text, action);
        }

        sendResponse({
          success: true,
          result: result,
          remainingQuota: quotaStatus.remaining,
          isPro: quotaStatus.isPro
        });
      } else if (message.type === "SAVE_CLIP") {
        const { clip } = message;
        const { savedClips = [] } = await chrome.storage.local.get("savedClips");
        const newClip = {
          id: Date.now().toString(),
          date: new Date().toLocaleString(),
          ...clip
        };
        savedClips.unshift(newClip);
        await chrome.storage.local.set({ savedClips: savedClips.slice(0, 100) }); // keep latest 100
        sendResponse({ success: true, count: savedClips.length });
      } else if (message.type === "GET_STATS") {
        const data = await chrome.storage.local.get(["isPro", "dailyQuota", "savedClips", "apiKey"]);
        sendResponse({ success: true, data });
      }
    } catch (err) {
      console.error("Background error:", err);
      sendResponse({ success: false, error: err.message || "执行发生错误" });
    }
  })();

  return true; // Keeps async response channel open
});
