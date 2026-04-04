# Japanese Banking Client Patterns — Comprehensive Reference

## Table of Contents
1. [Banking Industry Context](#banking-industry-context)
2. [Criticism Patterns by Type](#criticism-patterns-by-type)
3. [Authentic Japanese Phrases Library](#authentic-japanese-phrases-library)
4. [Psychological Drivers Deep Dive](#psychological-drivers-deep-dive)
5. [Banking-Specific Review Patterns](#banking-specific-review-patterns)
6. [Hidden Concern Mapping](#hidden-concern-mapping)
7. [Severity Calibration Guide](#severity-calibration-guide)

---

## Banking Industry Context

### Why Japanese Banking Clients Are Uniquely Demanding

Japanese banks (メガバンク: MUFG, SMBC, Mizuho; 地方銀行; 信託銀行) operate under extreme regulatory pressure from the Financial Services Agency (金融庁/FSA). This creates a culture where:

1. **Every deliverable is a potential audit artifact** — Bank examiners may review vendor deliverables during inspections
2. **Approval requires multi-layer 稟議** — A section chief (課長) must explain and defend the deliverable to a department head (部長), who must explain to a division head (本部長), who may need to brief an executive (役員)
3. **Personal career risk** — An approver who signs off on a flawed deliverable faces personal accountability
4. **Zero-defect expectation** — In banking, "95% correct" means "5% wrong" which is unacceptable
5. **Conservatism bias** — Existing systems and approaches are preferred; change must be justified exhaustively

### The 稟議 Chain Effect

When a client reviewer receives your deliverable, they're thinking about who they need to convince next:

```
Your deliverable → 担当者 (handler) → 課長 (section chief) → 部長 (dept. head) → 本部長 (div. head) → 役員 (executive)
```

At each level, the person above asks harder questions with less context. Your deliverable must be "escalation-proof" — it must contain answers to questions that people 3 levels above the reviewer might ask.

### Industry-Specific Compliance Context

Japanese banking deliverables are often scrutinized against:
- **FISC安全対策基準** (FISC Security Guidelines) — The de facto standard for banking IT in Japan
- **金融庁ガイドライン** (FSA Guidelines) — Regulatory requirements
- **バーゼルIII** (Basel III) — International banking standards
- **J-SOX** — Japanese Sarbanes-Oxley equivalent
- **個人情報保護法** (Personal Information Protection Act)

Any deliverable touching IT systems, data, or processes should reference applicable standards.

---

## Criticism Patterns by Type

### MECE_GAP (MECE不備)

**What triggers it**: Any categorization, framework, or classification that has overlaps or gaps.

**Banking context**: Japanese banks learned MECE from McKinsey consultants in the 1990s and have internalized it as a universal quality standard. Even operational staff apply MECE thinking.

**Common manifestations**:
- "この分類にはAとBの重複がありませんか？" (Isn't there overlap between categories A and B?)
- "Cのケースはどこに分類されますか？" (Where does case C fall in this classification?)
- "この3つ以外のパターンは存在しないのですか？" (Are there no patterns other than these 3?)

**How to detect**: Look for any list, categorization, or framework. Test each one for overlaps and gaps.

### OBJECTIVITY (客観性不足)

**What triggers it**: Subjective statements without data, benchmarks, or third-party validation.

**Banking context**: Banks deal in numbers. Qualitative assessments feel like opinions, and opinions are not defensible in 稟議.

**Common manifestations**:
- "これは御社の主観ではないですか？" (Isn't this your company's subjective opinion?)
- "客観的なデータに基づいていますか？" (Is this based on objective data?)
- "第三者の見解はありますか？" (Is there a third-party perspective?)

**Red flags**: Words like "we believe", "in our experience", "best practice" without citation, "typically", "generally"

### COMPREHENSIVENESS (網羅性不足)

**What triggers it**: Missing scenarios, perspectives, or considerations.

**Banking context**: 網羅性 is perhaps the #1 Japanese banking obsession. They want to see that every possibility has been considered, even if most are dismissed. The act of considering and dismissing is itself evidence of thoroughness.

**Common manifestations**:
- "○○のケースは検討されましたか？" (Was the case of XX considered?)
- "障害時のシナリオが含まれていないようですが" (The failure scenario doesn't seem to be included)
- "セキュリティの観点からの検討は？" (What about consideration from a security perspective?)

**Key insight**: Japanese clients don't just want the answer — they want to see the work. Showing 10 alternatives evaluated and 1 selected is vastly more convincing than just presenting the selected option.

### EVIDENCE (根拠不足)

**What triggers it**: Claims without supporting data, citations, or proof.

**Banking context**: In the 稟議 chain, every claim needs a traceable source. "The vendor said so" is not evidence; "Section 4.2 of the vendor's technical specification dated 2024-03-15, verified by our independent assessment" is.

**Common manifestations**:
- "根拠を示してください" (Please show the basis)
- "このデータの出典は何ですか？" (What is the source of this data?)
- "定量的な裏付けはありますか？" (Is there quantitative backing?)
- "エビデンスをご提供いただけますか？" (Can you provide evidence?)

### FORM (体裁不備)

**What triggers it**: Inconsistent formatting, terminology variations, unclear structure.

**Banking context**: Form matters enormously in Japanese business. A deliverable with inconsistent bullet styles, mixed terminology, or unclear headers signals carelessness — and carelessness in presentation implies carelessness in analysis.

**Common manifestations**:
- "用語が統一されていません" (Terminology is not consistent)
- "目次と本文の構成が一致していません" (Table of contents doesn't match body structure)
- "フォントサイズが統一されていません" (Font sizes are not consistent)

### AMBIGUITY (曖昧さ)

**What triggers it**: Vague statements that could be interpreted multiple ways.

**Banking context**: Ambiguity is the enemy of 稟議. Every statement in a deliverable may be quoted in an approval document. Ambiguous statements create risk because they can be interpreted as promises or commitments that weren't intended.

**Common manifestations**:
- "具体的にどういう意味ですか？" (What specifically does this mean?)
- "「適切に対応する」とは具体的に何をするのですか？" (What specifically does "respond appropriately" mean?)
- "「必要に応じて」の判断基準は何ですか？" (What is the criterion for "as needed"?)

**Danger words**: "適切に" (appropriately), "必要に応じて" (as needed), "検討する" (will consider), "可能な限り" (as much as possible), "等" (etc.), "原則として" (in principle)

### RISK (リスク考慮不足)

**What triggers it**: Failure to address what could go wrong.

**Banking context**: Japanese banks are trauma-informed organizations. Past incidents (system failures, data breaches, regulatory penalties) drive extreme risk consciousness. Every deliverable must address "what if this fails?"

**Common manifestations**:
- "障害時の対応はどうなりますか？" (What is the response during failures?)
- "最悪のケースを想定していますか？" (Have you considered the worst case?)
- "リスクの洗い出しは十分ですか？" (Is the risk identification sufficient?)
- "コンティンジェンシープランはありますか？" (Is there a contingency plan?)

### PROCESS (プロセス不備)

**What triggers it**: Conclusions presented without showing the methodology.

**Banking context**: Japanese banking culture values process as much as results. Showing your work demonstrates rigor, professionalism, and auditability.

**Common manifestations**:
- "どのような手順で検討されましたか？" (What procedure was used for this analysis?)
- "レビュープロセスは確立されていますか？" (Is the review process established?)
- "品質管理体制はどうなっていますか？" (What is the quality management structure?)

### PRECEDENT (前例なし)

**What triggers it**: Novel approaches without reference to similar past successes.

**Banking context**: 前例主義 (precedent-first thinking) dominates Japanese banking. Innovation is viewed with suspicion unless proven elsewhere first. "No precedent" = "unproven" = "risky".

**Common manifestations**:
- "他行での導入実績はありますか？" (Are there implementation records at other banks?)
- "類似の取り組みの事例はありますか？" (Are there examples of similar initiatives?)
- "前例がない場合、どのようにリスクを軽減しますか？" (If there's no precedent, how will you mitigate risk?)

---

## Authentic Japanese Phrases Library

### Tier 3: Vague/Indirect Criticism — The Hardest to Decode

These phrases sound mild but often signal serious problems:

| Japanese | Real Meaning | Severity |
|----------|-------------|----------|
| "ちょっと違うんだよね" | This is wrong but I won't tell you how | HIGH |
| "しっくりこない" | Something is fundamentally off | HIGH |
| "なんとなくピンとこない" | Deep dissatisfaction I can't articulate | HIGH |
| "難しいですね" | **No.** This won't work. | CRITICAL |
| "検討させてください" | Probably no, need to consult others | MEDIUM |
| "ちょっと持ち帰ります" | I can't decide; need group consensus | MEDIUM |
| "方向性が違う気がする" | You misunderstood what I wanted | HIGH |
| "もう少し工夫が必要" | Substantially rework this | HIGH |
| Silence after presentation | Major concerns exist | CRITICAL |
| "おっしゃる通りですが..." | You're wrong | HIGH |
| "いいですね" (without enthusiasm) | Not good | MEDIUM |

### Tier 4: Effort/Time Criticism

| Japanese | Real Meaning | Severity |
|----------|-------------|----------|
| "私の10分、いくらか分かってるの？" | You wasted my time with low-quality work | CRITICAL |
| "前回と同じことを言わせないでください" | You failed to incorporate previous feedback | CRITICAL |
| "手戻りが多すぎる" | Quality control is failing | HIGH |

### Formal Meeting Criticism Phrases

| Japanese | Romaji | English | Context |
|----------|--------|---------|---------|
| もう少し検討してください | Mō sukoshi kentō shite kudasai | Please consider this a bit more | Polite rejection — usually means "redo this" |
| ご検討の上、再度ご提出ください | Go-kentō no ue, saido go-teishutsu kudasai | Please reconsider and resubmit | Formal rejection |
| イメージと違います | Imēji to chigaimasu | This is different from what I imagined | Vague but serious — means expectations were not met |
| 説明が不十分です | Setsumei ga fujūbun desu | The explanation is insufficient | Needs more detail |
| 整合性が取れていないのでは | Seigōsei ga torete inai no dewa | Isn't there a consistency issue? | Contradiction found |
| 網羅性に欠けるのではないですか | Mōrasei ni kakeru no dewa nai desu ka | Doesn't this lack comprehensiveness? | Missing cases |
| 具体性に欠けます | Gutaisei ni kakemasu | This lacks specificity | Too vague |
| 数値的な裏付けがほしいです | Sūchi-teki na urazuke ga hoshii desu | I want quantitative backing | Need numbers |
| 社内で説明できる資料にしてください | Shanai de setsumei dekiru shiryō ni shite kudasai | Make this a document I can explain internally | Can't defend this in 稟議 |
| 前回の指摘事項が反映されていません | Zenkai no shiteki jikō ga han'ei sarete imasen | Previous feedback was not incorporated | Serious — shows lack of attention |

### Email Criticism Phrases

| Japanese | Context |
|----------|---------|
| ご確認させていただきたい点がございます | "There are points I'd like to verify" — formal flag that issues exist |
| いくつか気になる点がございました | "There were some points of concern" — polite way to say "problems found" |
| 一部修正をお願いできればと存じます | "I wonder if I could ask for some revisions" — formal revision request |
| 品質面でやや懸念がございます | "I have some quality concerns" — serious quality issue |

---

## Psychological Drivers Deep Dive

### 1. Responsibility Avoidance (責任回避)
The #1 driver. Japanese banking reviewers are not trying to be difficult — they're protecting themselves. Every approval is a personal risk. They critique to create a paper trail showing due diligence.

**Implication**: Your defense must help them justify their approval. Give them the exact words they can use in their 稟議 document.

### 2. Internal Explanation Burden (社内説明責任)
The reviewer must be able to explain every aspect of your deliverable to their superiors. If they can't, they can't approve.

**Implication**: Make everything self-explanatory. Don't assume the reader has context.

### 3. Perfectionism as Professional Duty (完璧主義)
In Japanese banking culture, attention to detail is a reflection of professionalism. Finding errors (even minor ones) is seen as doing one's job well.

**Implication**: Some criticism is performative — the reviewer needs to show they reviewed carefully. Accept minor critiques gracefully.

### 4. Herd Mentality (横並び意識)
Japanese banks closely watch what peer institutions do. "Other banks do it this way" is a powerful argument.

**Implication**: Always benchmark against peer institutions. "三菱UFJでも同様のアプローチが採用されています" (MUFG has adopted a similar approach) is gold.

### 5. Subtractive Evaluation (減点主義)
Japanese banking culture evaluates on a subtractive basis — you start with a perfect score and lose points for every flaw found. This is the opposite of additive evaluation where you earn credit for strengths.

**Key insight**: People are penalized for failures but NOT rewarded for successes. This creates extreme caution.
- "減点を避けるために、新しいことはしない" (Don't do anything new to avoid losing points)
- Finding a flaw is the reviewer's JOB — it demonstrates diligence
- Even minor imperfections (typos, inconsistent fonts) trigger the subtractive instinct
- A brilliant deliverable with one error may score lower than a mediocre but flawless one

**Implication**: Eliminate ALL errors before submission. Japanese clients will find them and each one reduces your credibility score.

### 6. Long-term Relationship Framing (長期的関係重視)
Japanese clients view vendor relationships as long-term. They're not just evaluating this deliverable — they're evaluating your reliability for the next 5-10 years.

**Implication**: Show commitment to continuous improvement, not just this delivery.

### 7. Middle Management as Gatekeepers (中間管理職のゲートキーパー)
The client's 課長 (section chief) or 部長 (department head) controls what reaches senior leadership. These middle managers add their own criticism layer to demonstrate their value.

**Key patterns**:
- They may not have authority to approve but absolutely have authority to reject
- They layer additional requirements on top of what senior leadership asked for
- Building relationships with middle management is often more important than impressing executives
- They need YOUR deliverable to make THEM look good to their superiors

**Implication**: Design your deliverable so the middle manager can present it as their own work/judgment to their boss.

---

## Banking-Specific Review Patterns

### System Development Deliverables
- **Requirements definition** (要件定義): Expect exhaustive functional/non-functional requirements, edge cases, error handling
- **Basic design** (基本設計): Architecture must reference FISC guidelines, include disaster recovery
- **Detailed design** (詳細設計): Every API, every data flow, every error code documented
- **Test plan** (テスト計画): Test coverage must be comprehensive with clear pass/fail criteria

### Consulting Deliverables
- **Market analysis**: Must include all major players (網羅性), quantified market share data, multiple source citations
- **Strategy recommendations**: Must include alternative options considered and rejected (with reasons), risk assessment, implementation roadmap
- **Process improvement**: Must show current state (AS-IS) vs. proposed state (TO-BE) with quantified improvements

### Operational Deliverables
- **Procedure manuals**: Must cover every scenario including edge cases and failure modes
- **Training materials**: Must include assessment criteria and competency verification methods
- **Compliance reports**: Must reference specific regulations by article number

---

## Hidden Concern Mapping

| Surface Criticism | Probability of Being the Real Concern | Actual Hidden Concern | How to Detect |
|------------------|--------------------------------------|----------------------|---------------|
| "MECEになっていない" | 40% actual MECE issue, 60% hidden | "I can't understand/explain this framework" | If the MECE issue is minor, the real concern is comprehension |
| "根拠が不足している" | 50% actual evidence issue, 50% hidden | "I need audit-proof documentation" | If they ask for evidence on obvious points, they need defense material |
| "もう少し検討してください" | 10% actual, 90% hidden | "Something feels wrong but I can't pinpoint it" OR "I already decided to reject but want to be polite" | If no specific criticism follows, it's usually the latter |
| "網羅性に欠ける" | 60% actual, 40% hidden | "I want to see that you worked hard" | If the missing items are obscure edge cases, they want effort visibility |
| "イメージと違います" | 5% actual, 95% hidden | "My boss won't like this" OR "I expected something more visually impressive" | Almost always about stakeholder management, not content |

---

## Severity Calibration Guide

### Industry-Specific Severity Adjustments

For **banking/financial** clients, increase severity by one level compared to general clients:
- General MEDIUM → Banking HIGH
- General LOW → Banking MEDIUM

Exceptions:
- Pure form issues (typos, formatting) stay at their general level
- Anything touching security, compliance, or data → always HIGH for banking

### Multi-Finding Escalation

When multiple findings compound on the same item:
- 2 MEDIUM findings on same item → treat as 1 HIGH
- 3+ LOW findings on same item → treat as 1 MEDIUM
- Any HIGH + any other finding on same item → treat as CRITICAL

This reflects how Japanese banking clients perceive accumulated issues as systemic problems rather than isolated incidents.
