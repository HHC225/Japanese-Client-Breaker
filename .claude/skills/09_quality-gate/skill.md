---
name: quality-gate
description: "Internal consultant-level QA that validates each phase's analytical direction, premise correctness, and logical soundness. NOT schema validation (scripts do that). Challenges whether the thinking is right."
---

# Quality Gate Skill

> `{WORKSPACE}` = timestamped run directory provided by the orchestrator.

## Purpose

Catch flawed premises and wrong analytical directions EARLY, before they cascade through the pipeline. A critic that targets the wrong weakness wastes the entire strategist phase. A gap analyzer that flags non-issues adds noise.

## Two Layers of Validation

| Layer | What | How | When |
|-------|------|-----|------|
| **Schema Validation** | JSON structure, field types, ID patterns | Scripts (run by orchestrator) | Before quality gate |
| **Consultant QA** | Premise, logic, direction, consistency | This agent (opus) | After schema passes |

The orchestrator runs schema validation first (simple file existence + JSON parse check). Only if that passes does the quality gate agent run.

## When to Run

After every analytical phase (NOT preprocessor or report generator):
- Phase 1A (Analyst) → premise + extraction quality
- Phase 1B (Gap Analyzer) → gap validity + severity calibration
- Phase 1C (Decision Advisor) → recommendation soundness + completeness
- Phase 2 (Critic) → criticism direction + gap/undecided integration
- Phase 3 (Strategist) → defense direction + cultural calibration

## Retry Logic

```
Phase N → Schema check (script) → Quality Gate (opus)
  ├─ PASS → proceed to Phase N+1
  └─ REVISE → re-run Phase N with fix_direction from QA
                ├─ 2nd PASS → proceed
                └─ 2nd REVISE → proceed with warnings
```

## Critical Rule

The quality gate MUST read the original preprocessed deliverable (`00_preprocessed_input.md`) alongside the phase output. This is how it verifies that claims about the deliverable are actually accurate — not just internally consistent but factually correct.
