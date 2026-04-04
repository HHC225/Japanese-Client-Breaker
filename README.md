# Japanese-Hanko-Breaker

[English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

`Japanese-Hanko-Breaker` is a Japanese client defense harness that turns deliverables into persuasion-ready arguments for demanding Japanese clients.

This project was used in real work to persuade Japanese banks and insurance companies. It was built for situations where delivering the document is only half the job, and the harder half is surviving the review, answering indirect objections, and giving the client a face-saving reason to approve.

Status: under active construction.

## What This Is

`Japanese-Hanko-Breaker` is a practical Japanese client defense harness built for one specific job:

turn a deliverable into a defense strategy that can stand up to a tough Japanese client review.

It is designed for review cultures where the real pressure is not only content quality, but also:

- MECE discipline
- comprehensiveness
- evidence quality
- precedent sensitivity
- formal consistency
- risk awareness
- face-saving communication

This is not a generic prompt pack. It is a structured pipeline for analyzing a deliverable, predicting criticism, building rebuttal trees, quality-checking the arguments, and packaging the result into a usable report.

## Why It Exists

In many Japanese enterprise reviews, especially in banking and insurance, a good deliverable still fails if:

- the logic has even a small gap
- the categories are not MECE
- the rationale is not explicit enough
- the client cannot explain the recommendation internally
- the reviewer feels approval creates personal risk

This harness exists to prepare for that reality.

## Quick Start

This repository is designed to be used from inside Claude Code. You do not need to wire the agents manually.

1. Clone the repository and move into it.

```bash
git clone https://github.com/HHC225/Japanese-Hanko-Breaker.git
cd Japanese-Hanko-Breaker
```

2. Put your deliverables in `input/`.

Supported inputs include Excel, PDF, PowerPoint, Word, CSV, images, and plain text files. If one deliverable spans multiple files, put all of them in `input/`.

3. Launch Claude Code from the repository root.

If your local installation uses the default CLI entrypoint, this is typically:

```bash
claude
```

4. Paste this prompt.

```text
Analyze the deliverables in `input/` from a demanding Japanese client perspective. Run the full defense pipeline and generate the HTML report.
```

5. Open the generated report at `_workspace/defense-report.html`.

## Requirements

- Python 3.10+
- `uv` for the preprocessing script. It can auto-install on first run, but if that fails, install it manually:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

- Internet connection for first-run dependency resolution and Google Fonts in the HTML report. The report falls back to system fonts if offline.

## How It Works

The current design has five core agents:

1. `deliverable-analyst`
   Breaks the deliverable into critique-ready items with assumptions, dependencies, and structural gaps.
2. `jp-client-critic`
   Simulates a demanding Japanese client and generates realistic objections.
3. `persuasion-strategist`
   Builds multi-level counter-argument trees with culturally calibrated phrasing.
4. `consulting-qa`
   Stress-tests the arguments through McKinsey, BCG, Bain, Deloitte, and Accenture lenses.
5. `report-generator`
   Compiles the full output into a practical HTML report for meeting preparation.

## Repository Structure

- `input/`
  Put the deliverable files you want to analyze here.
- `_workspace/`
  Generated at runtime. Contains intermediate artifacts and the final HTML report.
- `CLAUDE.md`
  Runtime instructions for using this repository inside Claude Code.
- `.claude/agents/`
  Agent definitions for the end-to-end defense pipeline.
- `.claude/skills/`
  Reusable skills, references, and orchestration logic.
- `japanese-client-characteristics-research.md`
  Source research on Japanese banking and financial client behavior.

## Best Fit

This project is best suited for:

- consulting teams preparing for difficult client reviews
- delivery teams facing Japanese banks, insurers, and large enterprises
- strategy and PM teams that need to defend recommendations, not just write them
- operators building agent workflows for high-friction enterprise persuasion

## License

This repository is released under the MIT License.

Use it freely.

## Contributing

If this harness helps you win difficult reviews, survive a brutal client meeting, or persuade a Japanese bank or insurance company, add your pattern, edge case, phrasing, or improvement and open a pull request.

Good field experience is more valuable than polished theory. Please contribute it back.

Contributions are especially welcome if you can add:

- real objection patterns from Japanese client reviews
- better face-saving phrasing
- stronger persuasion trees
- sharper QA standards
- more realistic financial-sector edge cases

The goal is simple: make this more useful in real meetings.
