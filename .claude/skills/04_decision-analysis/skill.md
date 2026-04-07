---
name: decision-analysis
description: "Identifies undecided/pending items in deliverables and provides structured option analysis with recommendations. Handles 要検討, ?, 未確定, TBD markers. Use when deliverables contain unresolved decision points that should be analyzed separately from defects."
---

# Decision Analysis Skill

> `{WORKSPACE}` = timestamped run directory provided by the orchestrator.

## Purpose

Separate **decision points** from **defects**. Undecided items (要検討, ?, 未確定) are not failures — they are choices that need to be made. This skill analyzes each decision point and recommends a direction.

## When to Use

- Deliverable contains 要検討, ?, 未確定, TBD markers
- Items need option analysis rather than criticism
- Decision dependencies need to be mapped

## Process

1. Read analyst items and preprocessed input
2. Scan for undecided markers using detection patterns from agent definition
3. For each undecided item:
   - Extract the decision point
   - Identify available options from context
   - Analyze pros/cons for each option
   - Recommend a direction based on project context
   - Assess urgency and dependencies
4. Map decision chains (which decisions block which)
5. Output structured recommendations

## Integration with Pipeline

- **Runs at**: Phase 1.5 (after Analyst, before Critic)
- **Critic interaction**: The critic receives the decision advisor's output and MUST:
  - Tag findings that overlap with undecided items as `"is_undecided": true`
  - Not assign HIGH/MEDIUM/LOW severity to undecided items
  - Instead reference the UNDECIDED-XXX id for the decision advisor's analysis
- **QA interaction**: QA validates decision recommendations through all 5 consulting lenses
- **Report**: Undecided items appear in a dedicated section with option comparison UI

## Quality Checklist

- [ ] All 要検討/？/未確定 markers identified
- [ ] Each has minimum 2 options with pros/cons
- [ ] Decision chains mapped (blocking relationships)
- [ ] Urgency levels assigned with rationale
- [ ] Recommendations have confidence levels
- [ ] Impact of delay stated for each
