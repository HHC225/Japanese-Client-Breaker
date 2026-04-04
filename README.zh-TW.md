# Japanese-Client-Breaker

[English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

`Japanese-Client-Breaker` 是一個面向日本客戶防禦場景的 harness，能把成果物轉化為面向嚴格日本客戶的說服與防禦論證。

這個專案已在真實業務中用來說服日本銀行與保險公司。它就是為了這種情境而打造的：交付文件只是工作的一半，更難的一半是扛過審查、回應間接異議，並給客戶一個能保全面子地批准的理由。

狀態：仍在持續建設中。

## 這是什麼

`Japanese-Client-Breaker` 是一個面向日本客戶防禦場景、並只為單一目標設計的實戰型 harness：

把成果物轉化成能夠承受嚴格日本客戶審查的說服與防禦策略。

它面對的是這樣的審查文化：真正的壓力不只來自內容本身，還來自以下要求：

- MECE 嚴謹性
- 覆蓋完整性
- 證據品質
- 對前例的敏感度
- 形式與版面一致性
- 風險意識
- 能讓對方保全面子的溝通方式

這不是一般性的 prompt 套件，而是一條結構化流程：分析成果物、預測批評、建立多層反駁樹、進行品質檢查，最後整理成可直接使用的報告。

## 為什麼會做這個

在很多日本企業的審查場景裡，尤其是銀行與保險業，即使成果物本身不差，也一樣會失敗。如果：

- 邏輯中哪怕只有很小的跳躍
- 分類沒有做到 MECE
- 理由說明得不夠明確
- 客戶無法在內部把建議講清楚
- 審查者覺得批准這件事會讓自己承擔個人風險

這個 harness 就是為了應對這種現實而存在。

## 快速開始

這個倉庫是為在 Claude Code 內使用而設計的。你不需要手動串接這些 agents。

1. Clone 倉庫並進入目錄。

```bash
git clone https://github.com/HHC225/Japanese-Client-Breaker.git
cd Japanese-Client-Breaker
```

2. 把你的成果物放進 `input/`。

支援的輸入包含 Excel、PDF、PowerPoint、Word、CSV、圖片與純文字檔。如果一份成果物由多個檔案組成，請全部放進 `input/`。

3. 在倉庫根目錄啟動 Claude Code。

如果你的本機安裝使用預設 CLI 入口，通常可以這樣啟動：

```bash
claude
```

4. 貼上以下提示詞。

```text
請從嚴格的日本客戶視角分析 `input/` 中的成果物，執行完整防禦流程，並產生 HTML 報告。
```

5. 開啟產生出的報告：`_workspace/defense-report.html`。

## 環境需求

- Python 3.10+
- 預處理腳本需要 `uv`。首次執行時它可能會自動安裝；若失敗，請手動安裝：

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

- 首次解析相依套件以及 HTML 報告中的 Google Fonts 需要網路連線。離線時報告會退回系統字型。

## 它如何運作

目前的設計由五個核心 agent 組成：

1. `deliverable-analyst`
   把成果物拆成可被批評的細粒度項目，並標出假設、依賴關係與結構缺口。
2. `jp-client-critic`
   模擬嚴格的日本客戶，產生高真實度的質疑與反對意見。
3. `persuasion-strategist`
   建立多層級反駁樹，並提供符合日本商務語境的表達。
4. `consulting-qa`
   用 McKinsey、BCG、Bain、Deloitte、Accenture 五種顧問視角對論證進行壓力測試。
5. `report-generator`
   把全部結果整理成適合會議前準備使用的 HTML 報告。

## 倉庫結構

- `input/`
  把要分析的成果物檔案放在這裡。
- `_workspace/`
  執行時產生。包含中間產物與最終 HTML 報告。
- `CLAUDE.md`
  在 Claude Code 中使用本倉庫時的執行說明。
- `.claude/agents/`
  端到端防禦流程中的 agent 定義。
- `.claude/skills/`
  可重用技能、參考資料與編排邏輯。
- `japanese-client-characteristics-research.md`
  關於日本銀行與金融客戶行為模式的研究資料。

## 適合誰使用

這個專案特別適合：

- 需要準備高壓客戶審查的顧問團隊
- 面對日本銀行、保險公司與大型企業的交付團隊
- 需要「捍衛建議」而不只是「撰寫建議」的策略與 PM 團隊
- 正在建立高摩擦企業說服型 agent workflow 的操作者

## 授權

本倉庫以 MIT License 釋出。

你可以自由使用。

## 貢獻

如果這個 harness 幫你贏下艱難審查、撐過殘酷的客戶會議，或成功說服了日本銀行或保險公司，請把你有效的模式、邊界案例、用語或改進補進來，並提交 pull request。

真實一線經驗比打磨過的理論更有價值。歡迎把它回饋回來。

特別歡迎以下類型的貢獻：

- 來自日本客戶審查現場的真實異議模式
- 更好的保全面子式表達
- 更強的說服樹
- 更嚴格的 QA 標準
- 更貼近金融業的邊界案例

目標很簡單：讓它在真實會議中更有用。
