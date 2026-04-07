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
    03_jp-client-critic.md      ← JP client critique (opus)
    04_persuasion-strategist.md ← 3-level argument trees (opus)
    05_consulting-qa.md         ← Big 5 QA validation (opus)
    06_report-generator.md      ← HTML report generation (sonnet)
  skills/
    00_jp-client-defender/      ← Orchestrator skill (entry point)
    01_file-preprocessing/      ← Preprocessing skill + scripts
    02_deliverable-analysis/
    03_jp-client-critique/      ← + references/jp-banking-client-patterns.md
    04_persuasion-scenarios/    ← + references/argument-tree-patterns.md
    05_consulting-qa/           ← + references/big5-consulting-methods.md
    06_html-report-generation/  ← + assets/report-template.html
```

## Pipeline

```
input/ → Preprocessor(sonnet) → Analyst(sonnet) → Critic(opus) → Strategist(opus) → QA(opus) → [Loop] → Report(sonnet)
```

QA runs two phases: foundational audit (premise check) then argument grading (Big 5 lenses). Foundational failures restart the pipeline from the failing phase.
