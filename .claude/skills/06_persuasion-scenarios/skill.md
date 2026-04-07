---
name: persuasion-scenarios
description: "Build multi-level counter-argument trees (minimum 3 levels) for defending deliverables against Japanese client criticism. Creates culturally calibrated debate scenarios with escalating persuasion techniques, Japanese business phrasing, and practical preparation notes. Use this skill when creating defense arguments, building counter-argument scenarios, preparing for Japanese client pushback, developing persuasion strategies, or rehearsing difficult client conversations. MUST trigger on any persuasion scenario generation or argument tree building task."
---

# Persuasion Scenarios Skill

> `{WORKSPACE}` = timestamped run directory provided by the orchestrator (e.g., `_workspace/run_20260404_153000`).

## Purpose

Transform each criticism into a structured, multi-level debate tree. Each tree has minimum 3 rounds of back-and-forth, using escalating persuasion techniques calibrated for Japanese business culture.

## When to Use

- Criticisms need defense scenarios
- Preparing counter-arguments for client meetings
- Building persuasion strategies for Japanese contexts
- Need rehearsal scripts for difficult conversations

## Argument Tree Architecture

### The 3-Level Minimum Rule

Every argument tree has at least 3 levels. Each level follows a pattern:

```
Level 1 (Foundation): Acknowledge + Initial Defense
  → Client Rebuttal (anticipated)
Level 2 (Reinforcement): Stronger Evidence + Broader Context
  → Client Pushback (anticipated)
Level 3 (Resolution): Strongest Argument + Face-Saving Bridge + Path Forward
```

### Technique Selection Matrix

Select techniques based on criticism type and severity. Read `references/argument-tree-patterns.md` for detailed examples.

| Severity | Level 1 | Level 2 | Level 3 |
|----------|---------|---------|---------|
| HIGH | ACKNOWLEDGE_THEN_REDIRECT | RISK_QUANTIFICATION + INDUSTRY_BENCHMARK | ALTERNATIVE_COMPARISON + FACE_SAVING_BRIDGE |
| HIGH | EVIDENCE_FIRST | EXPERT_AUTHORITY + PROCESS_TRANSPARENCY | STAKEHOLDER_ALIGNMENT + MUTUAL_COMMITMENT |
| MEDIUM | SCOPE_CLARIFICATION | COST_BENEFIT_ANALYSIS | PHASED_APPROACH |
| MEDIUM | PRECEDENT_CITATION | INDUSTRY_BENCHMARK | FACE_SAVING_BRIDGE |
| LOW | EVIDENCE_FIRST | PRECEDENT_CITATION | FACE_SAVING_BRIDGE |

### Cultural Calibration Rules

These are non-negotiable in Japanese business contexts:

1. **Never contradict directly** — "That's incorrect" → "I appreciate that perspective. If I may add some context..."
2. **Always acknowledge first** — Validate their concern before any counter-argument
3. **Use humble language** — "弊社としましては..." (From our company's perspective...), not assertive claims
4. **Reference their authority** — "○○様のご指導を踏まえまして..." (Based on your guidance...)
5. **Offer, don't demand** — "ご検討いただけますでしょうか" (Would you consider...), not "You should..."
6. **Show exhaustive effort** — "X件の代替案を検討した結果..." (After examining X alternatives...)
7. **Quantify obsessively** — Every claim should have a number attached if possible

### The Face-Saving Bridge

The most critical technique. Japanese clients will reject even valid arguments if accepting means losing face. Always provide an "off-ramp":

**Pattern**: Frame your argument as an extension of the client's own thinking.

- "○○様が以前ご指摘されたように..." (As you previously pointed out...)
- "ご要件を踏まえた上で..." (Building on your requirements...)
- "○○様のご方針に沿って検討した結果..." (Having considered this in line with your policy...)

This allows the client to accept without admitting they were wrong.

### Nemawashi (根回し) Strategy

For HIGH severity findings, direct meeting defense often isn't enough. The preparation_notes should include a nemawashi strategy:

1. **Who to contact before the meeting** — Identify the key decision-maker and their trusted advisor
2. **What to share informally** — Give them a preview of your argument so they're not surprised
3. **When to do it** — At least 2-3 business days before the formal meeting
4. **How to frame it** — "ご相談がございまして..." (I have something I'd like to consult you about...)

## Process

1. Read findings from `{WORKSPACE}/02_critic_findings.json`
2. For each finding, identify the hidden concern behind the surface criticism
3. Select opening strategy based on severity and type
4. Build 3-level argument tree with escalating techniques
5. Write Japanese business phrases for each level
6. Create preparation notes including nemawashi strategy

For detailed argument patterns and examples, read `references/argument-tree-patterns.md`.

## Output Format

Write scenarios to `{WORKSPACE}/03_strategist_scenarios.json`. See the agent definition for the complete schema.

## Quality Checklist
- [ ] Every finding has a scenario with minimum 3 levels
- [ ] No two consecutive levels use the same technique
- [ ] All levels include Japanese phrasing
- [ ] HIGH severity findings include nemawashi strategy
- [ ] Face-saving bridge present in every Level 3
- [ ] Evidence is specific (not "data shows" but "Q3 2024 report shows 15% reduction")
- [ ] Fallback strategy defined for every scenario
