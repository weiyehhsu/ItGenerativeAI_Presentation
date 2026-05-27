# ItGenerativeAI Presentation

AI 塔羅期末簡報，使用 [Slidev](https://sli.dev/) 製作。主要內容在 `slides.md`，截圖素材放在 `assets/screenshots/`。

## 環境需求

- Node.js 20+
- pnpm

如果還沒有 pnpm，可先啟用 Corepack：

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

## 第一次安裝

```bash
pnpm install
```

這會安裝 Slidev 和相關套件。`node_modules/` 不要 commit。

## 開啟預覽

```bash
pnpm run dev
```

預設會開啟：

```text
http://localhost:3030/
```

如果沒有自動開瀏覽器，手動打開上面的網址即可。修改 `slides.md` 或 `styles/index.css` 後，Slidev 會自動熱更新。

停止 dev server：

```bash
Ctrl-C
```

如果 `3030` 被占用，可改用其他 port：

```bash
pnpm exec slidev --port 3031 --open
```

## 編輯位置

- `slides.md`：簡報內容與每頁結構
- `styles/index.css`：全域簡報樣式
- `assets/screenshots/`：放進簡報的截圖素材

## 建置檢查

```bash
pnpm run build
```

成功後會輸出靜態檔到 `dist/`。`dist/` 不要 commit。

## 匯出 PDF

```bash
pnpm run export
```

如果匯出時出現瀏覽器相關錯誤，先安裝匯出用的瀏覽器套件：

```bash
pnpm add -D playwright-chromium
```
