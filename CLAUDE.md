# Japanese-Client-Breaker

Japanese-Client-Breaker is a defense harness for high-stakes Japanese enterprise reviews, where approval risk, indirect objections, and internal justification matter. It analyzes deliverables, finds weaknesses from a Japanese enterprise review perspective, builds multi-level persuasion scenarios, validates them through Big 5 consulting firm QA, and outputs an interactive HTML report.

## Prerequisites

- **Python 3.10+** — required for the file preprocessing script
- **uv** — auto-installed on first run. If auto-install fails, install manually:
  ```
  curl -LsSf https://astral.sh/uv/install.sh | sh
  ```
- **Internet connection** — needed for uv dependency resolution on first run and Google Fonts in the HTML report (falls back to system fonts if offline)

## Usage

1. Place deliverable files in `input/` directory (Excel, PDF, PowerPoint, Word, CSV, images, text)
2. Ask Claude to analyze:
   ```
   Analyze the deliverables in input/ for a high-stakes Japanese enterprise review
   ```
3. The pipeline runs automatically and outputs to `_workspace/run_YYYYMMDD_HHMMSS/{TIMESTAMP}_client-defense-report.html`
   - A `_workspace/latest` symlink always points to the most recent run

## How to Run the Pipeline

**IMPORTANT**: Do NOT use the `Skill` tool. This pipeline runs via the `Agent` tool with `subagent_type: "orchestrator"`:

```
Agent(
  description: "Run JP Client Defender pipeline",
  subagent_type: "orchestrator",
  prompt: "You are the JP Client Defender Orchestrator. Read your agent definition at .claude/agents/00_orchestrator.md and follow the instructions there. The user wants to analyze the deliverables in input/ directory. [include any user context/instructions here]"
)
```

This is the ONLY correct way to invoke the pipeline. The orchestrator agent reads its own skill file and spawns all sub-agents sequentially.

## Project Structure

```
input/                          ← Put deliverable files here
_workspace/                     ← Generated during analysis
  run_YYYYMMDD_HHMMSS/          ← Timestamped run directory (intermediate + final report)
  latest/                       ← Symlink to most recent run
.claude/
  agents/
    00_orchestrator.md          ← Pipeline controller (opus)
    01_file-preprocessor.md     ← Excel/PDF/PPT → Markdown (sonnet)
    02_deliverable-analyst.md   ← Item extraction (sonnet)
    03_gap-analyzer.md          ← Missing element detection (opus) [parallel with 02]
    04_decision-advisor.md      ← Undecided item analysis (opus) [parallel with 02]
    05_jp-client-critic.md      ← JP client critique (opus)
    06_persuasion-strategist.md ← 3-level argument trees (opus)
    07_consulting-qa.md         ← Big 5 QA for user display (opus)
    08_report-generator.md      ← HTML report generation (sonnet)
    09_quality-gate.md          ← Internal consultant QA per phase (opus)
  skills/
    00_jp-client-defender/      ← Orchestrator skill (entry point)
    01_file-preprocessing/      ← Preprocessing skill + scripts
    02_deliverable-analysis/
    03_gap-analysis/            ← Gap detection skill
    04_decision-analysis/       ← Undecided item analysis skill
    05_jp-client-critique/      ← + references/jp-banking-client-patterns.md
    06_persuasion-scenarios/    ← + references/argument-tree-patterns.md
    07_consulting-qa/           ← + references/big5-consulting-methods.md
    08_html-report-generation/  ← + assets/report-template.html + scripts/validate-report.js
    09_quality-gate/            ← Internal QA skill
```

## Pipeline

```
                              ┌→ Analyst(sonnet)        ─┐
input/ → Preprocessor(sonnet) ─┤→ Gap Analyzer(opus)      ├→ QG ─→ Critic(opus) → QG ─→ Strategist(opus) → QG ─→ Big5 QA(opus) → Report(sonnet)
                              └→ Decision Advisor(opus) ─┘
                                   (all three parallel)     (QG = Quality Gate per phase)
```

- **Analyst** (02): extracts what IS in the deliverable
- **Gap Analyzer** (03): identifies what is MISSING (parallel with Analyst)
- **Decision Advisor** (04): analyzes 要検討/未確定 items → option analysis + recommendations (parallel with Analyst)
- **Quality Gate** (09): internal consultant QA after each phase — validates analytical direction, premise correctness, logical consistency. REVISE verdict triggers re-run (max 1 retry)
- **Critic** (05): receives all three Phase 1 results. Tags undecided items as UNDECIDED severity, incorporates gaps as findings
- **Strategist** (06): builds 3-level defense argument trees with Japanese business phrasing
- **Big 5 QA** (07): evaluates final defense through Accenture/McKinsey/BCG/Bain/Deloitte lenses — for user display in report
- **Report Generator** (08): compiles everything into interactive HTML report
