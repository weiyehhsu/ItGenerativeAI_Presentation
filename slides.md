---
theme: default
routerMode: hash
base: /ItGenerativeAI_Presentation/
title: AI塔羅 - Arcana Oraculum
transition: fade
mdc: true
colorSchema: dark
drawings:
  persist: false

fonts:
  sans: 'Noto Sans TC'
  serif: 'Noto Serif TC'
  mono: 'JetBrains Mono'
---

<div class="kicker">Generative AI Final Project · Team 3</div>

# AI塔羅

## Arcana Oraculum

<div class="cover-grid">
  <div>
    <p class="lead">
      一個把 <strong>OpenAI-compatible LLM</strong>、<strong>LLM-as-Guardrail</strong>、
      <strong>SDXL 圖像生成</strong> 與即時管理面板整合在一起的互動式塔羅網站。
    </p>
    <div class="mini repo-line">
      Repo: <code>xingting1026/ItGenerativeAI_Presentation2</code>
    </div>
  </div>
  <div class="panel">
    <div class="kicker panel-kicker">Team Members</div>
    <p class="team-list">
      111550029 蔡奕庠<br>
      110550048 許維也<br>
      109950026 李明謙<br>
      112652030 呂泰廷<br>
      0816132 蔡欣龍<br>
      112550026 林均澔
    </p>
  </div>
</div>

---

<div class="kicker">Opening</div>

# 從一個問題開始

<div class="split split-home">
  <div>
    <img src="./assets/screenshots/arcana-home.png" class="shot screen-lg" />
  </div>
  <div class="stack">
    <div class="metric">
      <div class="n">輸入</div>
      <div>使用者留下生日與想詢問的問題，像是在進入一場線上占卜。</div>
    </div>
    <div class="metric">
      <div class="n">判斷</div>
      <div>系統先分辨這個問題是否適合被塔羅回應。</div>
    </div>
    <div class="metric">
      <div class="n">生成</div>
      <div>通過後，文字解讀與牌面圖像分成兩條路徑產生。</div>
    </div>
  </div>
</div>

---

<div class="kicker">Problem</div>

# 生成式占卜的三個挑戰

<div class="cards cards-3">
  <div class="panel">
    <h3>個人化</h3>
    <p>塔羅不只是固定牌義查表，回應要能讀進使用者的問題、生日與三張牌的位置。</p>
  </div>
  <div class="panel">
    <h3>安全邊界</h3>
    <p>輸入可能包含 prompt injection、越獄、暴力、自傷訊號或離題需求，需要先被分類。</p>
  </div>
  <div class="panel">
    <h3>等待體驗</h3>
    <p>圖像生成比文字慢，前端必須把等待轉化成可理解的牌面顯化流程。</p>
  </div>
</div>

<div class="statement">
  目標不是做一個會聊天的塔羅師，而是把生成式 AI 放進有邊界、可觀察、可替換的產品流程。
</div>

---

<div class="kicker">Architecture</div>

# 一個請求如何穿過系統

```mermaid
flowchart LR
  U["Browser<br/>index.html + main.js"] --> D["POST /api/draw<br/>birthday + question + settings + mcp_servers"]
  D --> G["Guardrail LLM<br/>guardrail.classify (async)"]
  G -->|blocked| B["Seal UI"]
  G -->|crisis| C["Care Routing"]
  G -->|clean| R["TarotAgent.run_reading<br/>tool-use loop"]
  R <-->|MCP tool call| M["MCPSessionPool<br/>Streamable HTTP"]
  R --> J["job_id + cards + reading + tool_trace"]
  J --> P["asyncio.create_task<br/>_run_image_jobs"]
  P --> I["A1111 / OpenAI images /<br/>OpenAI chat-image"]
  U --> Q["GET /api/image/{job}/{idx}<br/>polling"]
  D --> L["attack_log.jsonl"]
  L --> A["/admin dashboard"]
```

<div class="tags">
  <div class="arc-tag">FastAPI · async</div>
  <div class="arc-tag">uv · Python 3.13</div>
  <div class="arc-tag">OpenAI-compatible API</div>
  <div class="arc-tag">HTTP MCP (官方 SDK)</div>
  <div class="arc-tag">Vanilla JS + Lucide</div>
  <div class="arc-tag">JSONL log</div>
</div>

---

<div class="kicker">Request Lifecycle</div>

# `/api/draw` 的決策路徑

<div class="two-col code-pair">
  <div class="panel tight">
    <h3>後端順序</h3>
    <ol>
      <li>讀取生日、問題與進階設定。</li>
      <li>建立 guard model client，呼叫 `guard_classify()`。</li>
      <li>把分類結果寫入 `attack_log.record()`。</li>
      <li>不安全輸入回傳封印狀態。</li>
      <li>`crisis` 回傳關懷資源，不抽牌。</li>
      <li>`clean` 抽三張 Major Arcana，交給解讀模型。</li>
      <li>建立 `job_id`，背景 thread 生成牌圖。</li>
    </ol>
  </div>
  <div>

```python
classification = guard_classify(
    question,
    guard_client,
    model=guard_model,
)
attack_log.record(question, classification, ip, reading_model)

if not classification["safe"]:
    return jsonify({"blocked": True, ...})

if classification["category"] == "crisis":
    return jsonify({"crisis": True, ...})

drawn = random.sample(MAJOR_ARCANA, 3)
```

  </div>
</div>

---

<div class="kicker">Guardrail</div>

# LLM-as-Guardrail：八類輸入分類

<div class="guard-grid">
  <div class="panel"><strong class="green">clean</strong><br><span class="mini">正常塔羅問題</span></div>
  <div class="panel"><strong>crisis</strong><br><span class="mini">自傷或自殺訊號</span></div>
  <div class="panel"><strong class="red">prompt_injection</strong><br><span class="mini">要求忽略規則、抽 prompt</span></div>
  <div class="panel"><strong class="red">jailbreak</strong><br><span class="mini">DAN / developer mode</span></div>
  <div class="panel"><strong class="red">nsfw</strong><br><span class="mini">色情或性暗示</span></div>
  <div class="panel"><strong class="red">violence</strong><br><span class="mini">武器或傷害他人</span></div>
  <div class="panel"><strong class="red">off_topic</strong><br><span class="mini">寫 code、數學、翻譯等離題</span></div>
  <div class="panel"><strong class="red">minor_safety</strong><br><span class="mini">未成年與高風險主題</span></div>
</div>

<div class="panel note-panel">
  Guard prompt 明確要求模型把 <strong>user text 視為待分類資料</strong>，而不是要遵循的 instructions。
  審查失敗時採用 fail-open，降低正常使用被誤擋的機率。
</div>

---

<div class="kicker">Safety UI</div>

# 封印：把拒答做成產品語言

<div class="split">
  <div>
    <img src="./assets/screenshots/arcana-blocked.png" class="shot screen-md" />
  </div>
  <div class="panel tight">
    <h3>封印狀態保留三件事</h3>
    <ul>
      <li>分類 label，讓團隊知道被擋的原因。</li>
      <li>reason，讓使用者理解界線，而不是只看到錯誤碼。</li>
      <li>log 記錄，但不持久化 API key。</li>
    </ul>
  </div>
</div>

---

<div class="kicker">Crisis Routing</div>

# 危機訊號不封鎖，改成把牌放下

<div class="split split-reverse">
  <div class="panel tight">
    <h3>為什麼 `crisis` 仍然是 `safe: true`？</h3>
    <ul>
      <li>自傷或自殺訊號不適合被冷冰冰地拒絕。</li>
      <li>系統停止占卜流程，改給台灣求助資源。</li>
      <li>這是 routing，不是一般內容封鎖。</li>
    </ul>
  </div>
  <div>
    <img src="./assets/screenshots/arcana-crisis.png" class="shot screen-md" />
  </div>
</div>

---

<div class="kicker">Reading Generation</div>

# 解讀模型吃的是結構化上下文

<div class="two-col code-pair">
  <div class="panel tight">
    <h3>Prompt inputs</h3>
    <ul>
      <li>求問者生日</li>
      <li>使用者問題</li>
      <li>三張牌的位置、中文名、英文名與關鍵字</li>
      <li>可由進階模式覆寫的 system prompt</li>
    </ul>
  </div>
  <div>

```txt
請依以下結構解讀：
1. 【整體脈絡】
2. 【過去】
3. 【現在】
4. 【未來】
5. 【塔羅師的建議】

請直接開始解讀，不要說「好的」。
```

  </div>
</div>

<div class="statement">
  固定輸出格式讓模型的語氣仍然有彈性，但內容不會脫離塔羅解讀的結構。
</div>

---

<div class="kicker">Image Pipeline</div>

# Lazy-flip：圖好，牌才翻

<div class="split">
  <div>
    <img src="./assets/screenshots/arcana-reading.png" class="shot screen-md" />
  </div>
  <div class="panel tight">
    <h3>前端流程</h3>
    <ol>
      <li>後端先回傳 `job_id`、三張牌與文字解讀。</li>
      <li>前端顯示牌背與占卜師獨白。</li>
      <li>每 1.5 秒呼叫 `/api/image/{job}/{idx}`。</li>
      <li>某張圖完成，才翻開那一張牌。</li>
    </ol>
  </div>
</div>

---

<div class="kicker">Image Prompt</div>

# 每張牌都有自己的圖像語彙

<div class="two-col code-pair">
  <div class="panel tight">
    <h3>`tarot_data.py`</h3>
    <ul>
      <li>22 張 Major Arcana。</li>
      <li>每張牌有中英文名、關鍵字與 `imagery`。</li>
      <li>`STYLE_PREFIX` 統一 Art Nouveau、金色邊框與神祕氛圍。</li>
      <li>`NEGATIVE_PROMPT` 控制 SFW 與畫質限制。</li>
    </ul>
  </div>
  <div>

```python
STYLE_PREFIX = (
  "masterpiece, best quality, "
  "art nouveau, alphonse mucha style, "
  "ornate golden art deco border, "
  "sfw, safe, fully clothed, ..."
)

def build_sdxl_prompt(card):
    return STYLE_PREFIX + card["imagery"], NEGATIVE_PROMPT
```

  </div>
</div>

---

<div class="kicker">Advanced Mode</div>

# 模型與後端可以在介面切換

<div class="split">
  <div>
    <img src="./assets/screenshots/arcana-advanced.png" class="shot screen-md" />
  </div>
  <div class="panel tight">
    <h3>可調參數（localStorage，無需重啟）</h3>
    <ul>
      <li>Reading model：base URL、API key、model ID、system prompt。</li>
      <li>Guard model：base URL、API key、model ID。</li>
      <li>三種 image backend：A1111 / OpenAI <code>/images/generations</code> / OpenAI <code>/chat/completions</code> w/ <code>modalities</code>（Nano Banana 等）。</li>
      <li>MCP 工具：HTTP URL、auth header、逐工具勾選啟用。</li>
    </ul>
  </div>
</div>

---

<div class="kicker">Image Backends</div>

# 三種圖像 backend，同樣的介面

<div class="cards cards-3">
  <div class="panel">
    <h3>A1111 SDXL</h3>
    <p><code>/sdapi/v1/txt2img</code>。本地、可控、可掛 Lightning LoRA。支援 negative prompt 與 checkpoint 切換。</p>
  </div>
  <div class="panel">
    <h3>OpenAI <code>/images/generations</code></h3>
    <p>標準 OpenAI 圖像端點。預設 <code>gpt-image-1</code>。Azure / Together / Fireworks 同 schema。</p>
  </div>
  <div class="panel">
    <h3>OpenAI <code>/chat/completions</code> w/ <code>modalities</code></h3>
    <p>OpenRouter Nano Banana / Gemini 2.5 Flash Image 等。圖在 <code>choices[0].message.images[0].image_url.url</code>。</p>
  </div>
</div>

<div class="statement">
  三種共用同一個 <code>generate_image(card, backend, opts, http)</code> dispatcher，前端只需切換 radio。
</div>

---

<div class="kicker">MCP Tool Use</div>

# HTTP MCP：占卜師會自己呼叫工具

<div class="two-col code-pair">
  <div class="panel tight">
    <h3>流程</h3>
    <ol>
      <li>使用者在「MCP 工具」介面新增 Streamable HTTP MCP 伺服器。</li>
      <li>後端 <code>MCPSessionPool</code> 用官方 <code>mcp</code> SDK 建立並重用 session。</li>
      <li><code>TarotAgent</code> 把啟用工具加入 chat-completions 的 <code>tools</code>。</li>
      <li>模型回 <code>tool_calls</code> → 並行 <code>asyncio.gather</code> 呼叫 → 結果回填 → loop。</li>
      <li>最多 5 輪，失敗自動降級為純文字解讀。</li>
    </ol>
  </div>
  <div>

```python
from mcp import ClientSession
from mcp.client.streamable_http import (
    streamablehttp_client,
)

async with streamablehttp_client(
    url, headers={"Authorization": auth},
) as (r, w, _):
    async with ClientSession(r, w) as s:
        await s.initialize()
        tools = (await s.list_tools()).tools
        result = await s.call_tool(name, args)
```

  </div>
</div>

<div class="statement">
  Auth header 只存在使用者瀏覽器，後端用 sha256 做 session pool key，不寫入磁碟。
</div>

---

<div class="kicker">API Browser</div>

# Scalar：互動式 API 文件

<div class="two-col code-pair">
  <div class="panel tight">
    <h3>三個出口</h3>
    <ul>
      <li><code>/scalar</code> — Scalar 互動瀏覽器（dark mode、可直接打請求）</li>
      <li><code>/docs</code> — Swagger UI（FastAPI 預設）</li>
      <li><code>/openapi.json</code> — 規格本體，給外部 codegen 使用</li>
    </ul>
    <h3>怎麼設定</h3>
    <ul>
      <li>FastAPI 自帶 OpenAPI；Pydantic <code>Field(examples=...)</code> 自動成為 example。</li>
      <li>Tags 把 endpoints 分成 <code>tarot / mcp / admin / health</code> 群組。</li>
      <li>Scalar 從 <code>request.base_url</code> 推 server URL，反代後也可用。</li>
    </ul>
  </div>
  <div>

```python
from scalar_fastapi import get_scalar_api_reference

@app.get("/scalar", include_in_schema=False)
async def scalar_html(request: Request):
    base = str(request.base_url).rstrip("/")
    return get_scalar_api_reference(
        openapi_url=app.openapi_url,
        title=f"{app.title} API",
        dark_mode=True,
        telemetry=False,
        base_server_url=base,
        servers=[{"url": base, "description": "Current host"}],
    )
```

  </div>
</div>

---

<div class="kicker">Client / Server Boundary</div>

# 哪些資料在哪邊：明確劃分

<div class="cards cards-2">
  <div class="panel">
    <h3>瀏覽器 localStorage</h3>
    <ul>
      <li>使用者覆寫的 reading / guard / image API key、URL、model</li>
      <li>MCP 伺服器 URL + auth header</li>
      <li>系統 prompt 自訂</li>
    </ul>
    <p class="mini">隨請求送出，後端絕不寫入磁碟。</p>
  </div>
  <div class="panel">
    <h3>後端 .env</h3>
    <ul>
      <li>啟動時讀一次的 fallback：預設 LLM key、預設 model、SDXL URL</li>
      <li>Server-side 設定：host / port / log level / tool-use 上限</li>
    </ul>
    <p class="mini">沒填？UI 就必須提供完整 credentials；填了？UI 可以只填要覆寫的那幾格。</p>
  </div>
</div>

<div class="statement">
  <strong>Key narrowing：</strong> 前端只送「當下選用的 image backend」的 credentials。選 A1111 時 OpenAI key 完全不離開瀏覽器。
</div>

---

<div class="kicker">Observability</div>

# 安全不是黑盒：每一次分類都可觀察

<div class="split">
  <div>
    <img src="./assets/screenshots/arcana-admin.png" class="shot screen-md" />
  </div>
  <div class="stack">
    <div class="metric">
      <div class="n">JSONL</div>
      <div>append-only attack log，重啟後載回最近 500 筆。</div>
    </div>
    <div class="metric">
      <div class="n">2s</div>
      <div>前端每 2 秒 polling stats 與 recent feed。</div>
    </div>
    <div class="metric">
      <div class="n">0 key</div>
      <div>log entry 不持久化 API key。</div>
    </div>
  </div>
</div>

---

<div class="kicker">Code Map</div>

# 功能如何對應到程式結構

<div class="two-col">
  <div class="panel tight">
    <h3>Backend（依 concern 分群）</h3>
    <ul>
      <li><code>app.py</code>、<code>config.py</code>：FastAPI factory、Settings。</li>
      <li><code>core/</code>：<code>llm.py</code> AsyncOpenAI factory、<code>jobs.py</code> job store。</li>
      <li><code>tarot/</code>：<code>cards / prompts / guardrail / agent / attack_log</code>。</li>
      <li><code>images/clients.py</code>：三種 backend dispatcher。</li>
      <li><code>tools/mcp.py</code>：<code>MCPSessionPool</code>（官方 SDK + AsyncExitStack）。</li>
      <li><code>api/models.py</code> + <code>api/routes/</code>。</li>
    </ul>
  </div>
  <div class="panel tight">
    <h3>Frontend</h3>
    <ul>
      <li><code>templates/index.html</code>：塔羅 UI + advanced drawer + MCP drawer + Lucide icons。</li>
      <li><code>static/main.js</code>：抽牌流程、polling、lazy flip、封印與危機 UI。</li>
      <li><code>static/mcp.js</code>：MCP 伺服器 CRUD、test、refresh、per-tool toggle。</li>
      <li><code>templates/admin.html</code> + <code>admin.js</code>：安全面板。</li>
    </ul>
  </div>
</div>

<div class="statement">
  Flask 負責決策與狀態，Vanilla JS 負責把狀態轉成儀式感，兩邊的界線清楚。
</div>

---

<div class="kicker">API Surface</div>

# 少量 endpoint 支撐完整流程

<div class="api-grid">
  <div class="api-card">
    <strong>GET <code>/</code></strong>
    <span>塔羅主畫面與互動入口</span>
  </div>
  <div class="api-card">
    <strong>POST <code>/api/draw</code></strong>
    <span>Guardrail、抽牌、解讀與背景生圖</span>
  </div>
  <div class="api-card">
    <strong>GET <code>/api/image/&lt;job&gt;/&lt;idx&gt;</code></strong>
    <span>前端 polling 單張卡圖狀態</span>
  </div>
  <div class="api-card">
    <strong>GET <code>/admin</code></strong>
    <span>安全分類與攻擊紀錄面板</span>
  </div>
  <div class="api-card">
    <strong>GET <code>/api/admin/stats</code></strong>
    <span>總數、攔截、危機與分類分佈</span>
  </div>
  <div class="api-card">
    <strong>GET <code>/api/admin/recent</code></strong>
    <span>最近分類紀錄</span>
  </div>
  <div class="api-card">
    <strong>POST <code>/api/admin/clear</code></strong>
    <span>清空觀測資料</span>
  </div>
  <div class="api-card">
    <strong>POST <code>/api/mcp/test</code></strong>
    <span>連線 MCP 伺服器並回傳工具列表（前端 test/refresh 共用）</span>
  </div>
  <div class="api-card">
    <strong>GET <code>/healthz</code></strong>
    <span>FastAPI 健康檢查（含 SDXL 連線狀態）</span>
  </div>
  <div class="api-card">
    <strong>GET <code>/docs</code></strong>
    <span>FastAPI 自動產生的 OpenAPI 文件</span>
  </div>
</div>

---

<div class="kicker">Design Decisions</div>

# 幾個值得說明的設計取捨

<div class="cards cards-2">
  <div class="panel">
    <h3>Fail-open</h3>
    <p>審查模型失敗時放行，避免暫時性 API 問題讓正常問題全部被擋下。</p>
  </div>
  <div class="panel">
    <h3>Key handling</h3>
    <p>API key 存在瀏覽器 `localStorage`，只隨請求送到後端，不寫入 JSONL。</p>
  </div>
  <div class="panel">
    <h3>Crisis routing</h3>
    <p>自傷訊號不走封印，而是顯示專業協助資源，讓產品回應更符合情境。</p>
  </div>
  <div class="panel">
    <h3>Prompt boundary</h3>
    <p>Guard prompt 明確把使用者輸入視為待分類資料，降低 prompt injection 生效機率。</p>
  </div>
</div>

---

<div class="kicker">Takeaway</div>

# AI 不是只產生答案，而是進入一個有邊界的體驗

<div class="cards cards-2">
  <div class="panel">
    <h3>輸入先被理解</h3>
    <p>問題先經過 guardrail，再決定是封印、關懷路由或正常解讀。</p>
  </div>
  <div class="panel">
    <h3>模型可以替換</h3>
    <p>Reading、Guard 與 Image backend 都透過介面設定，不綁死單一供應商。</p>
  </div>
  <div class="panel">
    <h3>等待有敘事</h3>
    <p>文字先出現，牌面等待圖像完成後翻開，讓技術延遲變成互動節奏。</p>
  </div>
  <div class="panel">
    <h3>安全可觀察</h3>
    <p>分類結果、攔截比例與最近紀錄都進入 admin 面板，方便團隊回看。</p>
  </div>
</div>

---
layout: center
---

<div class="end-slide">
  <div class="kicker">Thank You</div>
  <h1>AI塔羅</h1>
  <h2>Arcana Oraculum</h2>
  <div class="mini">Generative AI + AI Safety + Interactive Web UI</div>
</div>
