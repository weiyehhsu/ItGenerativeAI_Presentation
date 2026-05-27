---
theme: default
title: AI塔羅
transition: slide-left
mdc: true

fonts:
  sans: 'Noto Sans TC'
  serif: 'Noto Serif TC'
  mono: 'JetBrains Mono'

background: https://images.unsplash.com/photo-1518562180175-34a163b1a9a6?q=80&w=1920
class: text-center
---

# AI塔羅

## Team 3

<br>

<div class="text-xl opacity-80">
Generative AI Final Project
</div>

<br><br>

<div class="text-lg">
Team Members
</div>

<div class="opacity-70">
111550029 蔡奕庠 ・ 110550048 許維也 ・ 109950026 李銘謙 
 
112652030 呂泰廷 ・ 0816132 蔡欣龍 ・ 112550026 林均澔
</div>

<br>

<div class="text-sm opacity-60">
https://github.com/xingting1026/ItGenerativeAI_Presentation2
</div>

---

# 1. 專案介紹
<br>

<div class="grid grid-cols-2 gap-10">

<div>



結合：

- Generative AI
- SDXL 生圖
- Guardrail 安全機制
- 即時管理面板

的 AI 塔羅占卜網站。

</div>

<div>

## 專案特色

- AI 自動解讀
- 卡牌圖片生成
- Prompt Injection 防護
- Crisis Routing
- 可切換模型 API

</div>

</div>

<br>

<div class="mt-8 p-4 rounded-xl bg-white/10">
打造兼具「互動性、沉浸感、安全性」的 AI Web Application
</div>

---

# 2. 問題與動機
<br>
<br>

<div class="grid grid-cols-2 gap-8">

<div class="p-6 rounded-2xl bg-red-500/10">

## 現有問題

- 傳統塔羅網站 UI 老舊
- 缺乏 AI 互動性
- 無安全防護
- 缺乏個人化體驗

</div>

<div class="p-6 rounded-2xl bg-yellow-500/10">

## 我們的目標

- 建立現代化 UI
- 增加 AI 解讀能力
- 強化安全防護
- 提升沉浸式體驗

</div>

</div>

<br>

<div class="text-center text-xl opacity-80 mt-8">
讓 AI 不只是聊天，而是完整互動式體驗
</div>

---

# 3. 系統架構

```mermaid
graph TD

A[Frontend Website]
--> B[Flask Backend]

B --> C[Guardrail LLM]
B --> D[Reading LLM]
B --> E[SDXL Generator]

C --> F[安全分類]
D --> G[塔羅解讀]
E --> H[圖片生成]

B --> I[Attack Log]
B --> J[Admin Dashboard]
````

<br>

<div class="text-center opacity-80">
Frontend、AI、Image Generation、Security 完整整合
</div>

---

# 4. 技術架構

| Layer            | Technology            |
| ---------------- | --------------------- |
| Frontend         | Vanilla JavaScript    |
| Backend          | Flask                 |
| AI API           | OpenAI-compatible API |
| Image Generation | SDXL                  |
| Security         | Guardrail LLM         |
| Storage          | JSONL                 |

<br>




---

# 5. 支援模型

<br>
<br>
<br>

<div class="grid grid-cols-4 gap-4 mt-6">

<div class="p-4 rounded-xl bg-blue-500/10 text-center">OpenAI</div>
<div class="p-4 rounded-xl bg-green-500/10 text-center">Groq</div>
<div class="p-4 rounded-xl bg-purple-500/10 text-center">Ollama</div>
<div class="p-4 rounded-xl bg-yellow-500/10 text-center">Together AI</div>



</div>

---

# 6. 抽牌系統

<div class="grid grid-cols-3 gap-4 mt-8">

<div class="p-6 rounded-2xl bg-blue-500/10">

## 過去

影響使用者的根源

</div>

<div class="p-6 rounded-2xl bg-purple-500/10">

## 現在

目前真正的課題

</div>

<div class="p-6 rounded-2xl bg-yellow-500/10">

## 未來

即將發生的趨勢

</div>

</div>

<br>

## 特殊機制

只有 SDXL 圖片生成完成後：

# 卡牌才會翻開

---

# 7. AI生成流程

```mermaid
graph LR

A[User Input]
--> B[Guardrail Classification]

B --> C[Tarot Draw]
C --> D[Prompt Generation]

D --> E[LLM Reading]
D --> F[SDXL Image]

E --> G[Reading Result]
F --> H[Card Animation]
```

<br>

<div class="p-4 rounded-xl bg-green-500/10">
文字生成與圖片生成同步進行
</div>

---

# 8. Prompt Engineering

<div class="grid grid-cols-2 gap-8">

<div>

## Prompt Input

* 使用者問題
* 出生日期
* 三張塔羅牌
* 卡牌關鍵字

</div>

<div>

## Prompt Goal

* 更自然
* 更像真人
* 更具神秘感
* 更具儀式感

</div>

</div>

<br>

```txt
求問者生日：1999-01-01

問題：我的感情未來如何？

抽出的牌：
- 愚者
- 女祭司
- 戀人
```

---

# 9. 前端設計

<div class="grid grid-cols-2 gap-8">

<div>

## Frontend Features

* 星空動畫
* 卡牌翻轉
* 粒子效果
* Loading animation
* Responsive Design

</div>

<div>

## 使用技術

* Canvas
* CSS Animation
* Transition Effects
* Vanilla JS

</div>

</div>

<br>

<div class="w-full h-60 rounded-2xl bg-white/10 flex items-center justify-center">
前端畫面截圖放這裡
</div>

---

# 10. GitHub協作

```txt
Develop Feature
↓
Git Commit
↓
Push to GitHub
↓
Merge / Review
↓
Team Integration
```

<br>

<div class="grid grid-cols-3 gap-4 mt-8">

<div class="p-4 rounded-xl bg-blue-500/10 text-center">
Version Control
</div>

<div class="p-4 rounded-xl bg-green-500/10 text-center">
Collaboration
</div>

<div class="p-4 rounded-xl bg-purple-500/10 text-center">
Backup
</div>

</div>

---


# 11. 未來改進

<div class="grid grid-cols-2 gap-8">

<div>

## 功能擴充

* 帳號系統
* 歷史紀錄
* 多語言
* Voice interaction

</div>

<div>

## AI 改進

* 更強模型
* 更快 SDXL
* 個人化解讀
* 更精準推理

</div>

</div>

---

# 12. 結論

<div class="text-2xl mb-8">

我們成功完成：

</div>

<div class="grid grid-cols-2 gap-6">

<div class="p-6 rounded-2xl bg-blue-500/10">
AI Tarot Platform
</div>

<div class="p-6 rounded-2xl bg-green-500/10">
AI Safety System
</div>

<div class="p-6 rounded-2xl bg-purple-500/10">
SDXL Image Generation
</div>

<div class="p-6 rounded-2xl bg-yellow-500/10">
Interactive Web UI
</div>

</div>

<br><br>

<div class="text-center text-xl opacity-80">
Generative AI + AI Safety + Modern Web Design
</div>

---

background: https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1920
class: text-center
------------------

# Thank You





