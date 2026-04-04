# Japanese-Client-Breaker

[English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

`Japanese-Client-Breaker` 是一个面向高风险日本企业评审场景的防御 harness，适用于审批风险、间接异议和内部说明责任都很重的场合。

这个项目已经在真实业务中使用过，其中包括说服日本银行和保险公司的项目。它就是为这样的场景而做的：交付文档只是工作的一半，更难的一半是扛过高风险评审、应对间接异议，并给相关方一个既能保全面子、又能在内部讲得通的批准理由。

状态：仍在持续建设中。

## 这是什么

`Japanese-Client-Breaker` 是一个聚焦单一目标的实战型防御 harness：

把成果物转化为能够经受高风险日本企业评审的说服与防御策略。

它针对的是这样一种审查环境：真正的压力不仅来自内容本身，还来自以下要求：

- MECE 严谨性
- 覆盖完整性
- 证据质量
- 对先例的敏感度
- 形式与版式一致性
- 风险意识
- 给对方留有余地的沟通方式

这不是一个泛用型 prompt 集合，而是一条结构化流水线：分析成果物、预测批评、构建多层反驳树、进行质量校验，并最终整理成可直接使用的报告。

## 为什么会做这个

在高风险日本企业评审场景中，即使成果物本身不错，也仍然会失败。如果：

- 逻辑里存在哪怕很小的跳跃
- 分类没有做到 MECE
- 理由表达得不够明确
- 审核者无法在内部为这项建议做出解释
- 审核者觉得批准这件事会给自己带来个人风险

这个 harness 就是为应对这种现实而生的。

## 快速开始

这个仓库是为在 Claude Code 内部使用而设计的。你不需要手动串接这些 agents。

1. 克隆仓库并进入目录。

```bash
git clone https://github.com/HHC225/Japanese-Client-Breaker.git
cd Japanese-Client-Breaker
```

2. 把你的成果物放进 `input/`。

支持的输入包括 Excel、PDF、PowerPoint、Word、CSV、图片和纯文本文件。如果一个成果物由多个文件组成，把它们全部放进 `input/`。

3. 在仓库根目录启动 Claude Code。

如果你的本地安装使用默认 CLI 入口，通常可以这样启动：

```bash
claude
```

4. 粘贴下面这段提示词。

```text
请把 `input/` 中的成果物当作高风险日本企业评审材料来分析，运行完整防御流水线，并生成 HTML 报告。
```

5. 打开生成的报告：`_workspace/defense-report.html`。

## 环境要求

- Python 3.10+
- 预处理脚本需要 `uv`。首次运行时它可能会自动安装；如果失败，请手动安装：

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

- 首次解析依赖以及 HTML 报告中的 Google Fonts 需要网络连接。离线时报告会回退到系统字体。

## 它如何工作

当前设计由五个核心 agent 构成：

1. `deliverable-analyst`
   将成果物拆解成可批评的细粒度条目，并标出假设、依赖关系与结构缺口。
2. `jp-client-critic`
   模拟高风险日本企业评审者，生成真实感强的质疑与反对意见。
3. `persuasion-strategist`
   构建多层级反驳树，并给出符合日本商务语境的表达方式。
4. `consulting-qa`
   用 McKinsey、BCG、Bain、Deloitte、Accenture 五种咨询视角对论证进行压力测试。
5. `report-generator`
   将全部结果编译为适合会前准备使用的 HTML 报告。

## 仓库结构

- `input/`
  把要分析的成果物文件放在这里。
- `_workspace/`
  运行时生成。包含中间产物和最终 HTML 报告。
- `CLAUDE.md`
  在 Claude Code 中使用本仓库时的运行说明。
- `.claude/agents/`
  端到端防御流水线中的 agent 定义。
- `.claude/skills/`
  可复用技能、参考资料与编排逻辑。
- `japanese-client-characteristics-research.md`
  关于日本银行和金融客户行为模式的研究材料。

## 适合谁使用

这个项目尤其适合：

- 需要准备高风险日本企业评审的团队
- 处在日本组织内部审批压力下的交付团队
- 需要让建议“能被内部说明和辩护”的战略与 PM 团队
- 正在构建异议处理与审批支持型 agent workflow 的操盘者

## 许可

本仓库采用 MIT License 发布。

你可以自由使用。

## 贡献

如果这个 harness 帮你扛过高风险日本企业评审、应对间接异议，或者做出了能在内部被解释和辩护的批准论证，请把你有效的模式、边界案例、表达方式或改进内容补充进来，并提交 pull request。

真实一线经验比精修过的理论更有价值。欢迎把它贡献回来。

尤其欢迎以下贡献：

- 来自日本客户审查现场的真实异议模式
- 更好的留面子式表达
- 更强的说服树
- 更严格的 QA 标准
- 更贴近金融行业的边界案例

目标很简单：让它在真实会议里更有用。
