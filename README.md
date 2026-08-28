# 辦公室抽屜櫃重新分配與對照系統

辦公室活動抽屜櫃重新排列與搬遷位置對照系統，提供個人快速查詢、視覺化區域平面圖、搬遷進度即時追蹤，並支援多端 Firebase 即時雲端雙向同步。

---

## 🚀 上傳至 GitHub 與部署到 Render 完整教學

### 步驟一：將專案匯出 / 上傳至 GitHub

#### 方法 A：使用 AI Studio 內建匯出功能（最推薦、最簡單）
1. 在 Google AI Studio 畫面右上角，點選 **設定 / 選單 (Settings / Export)**。
2. 選擇 **Export to GitHub**（或 **Download ZIP**）。
3. 依照提示連接您的 GitHub 帳號，並將專案建立至您的 GitHub Repository（例如命名為 `office-pedestal-system`）。

#### 方法 B：使用 Git 命令列上傳
若您下載了專案 ZIP 檔案或在本地環境：
```bash
git init
git add .
git commit -m "feat: initial commit for office pedestal system"
git branch -M main
git remote add origin https://github.com/您的帳號/office-pedestal-system.git
git push -u origin main
```

---

### 步驟二：在 Render 上進行免費一鍵部署

Render 支援直接連接 GitHub Repository 部署靜態網站（Static Site），速度極快且完全免費：

1. 前往 **[Render 官網](https://render.com/)** 並登入（建議直接使用 GitHub 登入）。
2. 在 Render 儀表板右上角點選 **New +** ➜ 選擇 **Static Site**。
3. 連接您的 GitHub 帳號，並選擇剛才建立的專案 Repository（例如 `office-pedestal-system`）。
4. 填寫以下部署設定：
   - **Name**: `office-pedestal-system`（或您自訂的名稱）
   - **Branch**: `main`
   - **Root Directory**: （留空即可）
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. 在下方 **Advanced** ➜ **Redirects / Rewrites** 新增一條 SPA 轉址規則（專案內已附帶 `render.yaml`，若手動設定亦可確認此項）：
   - **Type**: `Rewrite`
   - **Source Path**: `/*`
   - **Destination**: `/index.html`
6. 點擊 **Create Static Site** 按鈕開始自動建置。
7. 等待 1~2 分鐘建置完成後，Render 會自動為您生成一個免費的公開 HTTPS 專屬網址（例如 `https://office-pedestal-system.onrender.com`）！

---

### 🛠️ 本地開發指令

```bash
# 安裝相依套件
npm install

# 啟動本地開發伺服器
npm run dev

# 建置正式環境生產版本
npm run build

# 預覽建置成果
npm run preview
```
