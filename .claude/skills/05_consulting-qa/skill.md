---
name: consulting-qa
description: "Validate persuasion arguments through Big 5 consulting firm lenses: McKinsey (structure/logic), BCG (strategic pragmatism), Bain (results orientation), Deloitte (evidence/compliance), Accenture (implementation feasibility). Grades each argument A-F per lens, identifies weaknesses, and prescribes concrete improvements. Use this skill whenever quality-checking defense arguments, validating persuasion scenarios, ensuring consulting-grade quality, reviewing argument logic, or auditing deliverable defense strategies. MUST trigger on any QA validation or argument quality review task."
---

# Consulting QA Skill

## Purpose

Every persuasion scenario must pass quality validation through 5 distinct consulting methodologies before reaching the final report. This skill provides the evaluation framework, grading criteria, and revision standards.

## When to Use

- Persuasion scenarios need quality validation
- Arguments need to be stress-tested from multiple perspectives
- Defense strategies need professional-grade quality assurance
- Need to identify which arguments are too weak for client-facing use

## Two-Phase QA Architecture

QA operates in TWO sequential phases. Phase A is the most critical.

### Phase A: Foundational Audit (Premise Validation)

**Runs FIRST, before any argument grading.** Validates that the entire upstream pipeline produced correct foundations.

| Check | Question | Fail Signal |
|-------|----------|-------------|
| **Analysis validity** | Were the right items extracted? Right granularity? Right assumptions surfaced? | `ANALYSIS_REDO` |
| **Critique direction** | Are criticisms targeting the real weaknesses? Right severity? Anything critical missed? | `CRITIQUE_REDO` |
| **Defense direction** | Is the defense strategy sound? Are we defending things that should be conceded? Hidden concerns correctly identified? | `STRATEGY_REDO` |

If ANY foundational check fails → set the appropriate REDO verdict, write detailed `foundation_issues`, and **DO NOT proceed to Phase B**. The orchestrator will restart the pipeline from the failing phase.

### Phase B: Argument Quality (Scenario Quality Validation)

**Only runs if Phase A verdict is `FOUNDATION_PASS`.**

## The Five Lenses — Quick Reference

| Lens | Core Question | Pass Criterion |
|------|--------------|----------------|
| **McKinsey** | "Is this logically airtight and well-structured?" | Pyramid structure, MECE supporting points, clear "So What?" |
| **BCG** | "Does this hold up under different scenarios?" | Robust across best/worst/likely cases, honest trade-offs |
| **Bain** | "Does this lead to concrete action?" | Clear outcomes, actionable next steps, measurable success |
| **Deloitte** | "Is every claim backed by verifiable evidence?" | Cited sources, regulatory awareness, audit trail |
| **Accenture** | "Can this actually be implemented?" | Feasible, resource-realistic, change management considered |

Read `references/big5-consulting-methods.md` for detailed evaluation criteria, real-world examples, and grading rubrics for each firm.

## Grading Scale

| Grade | Score | Standard |
|-------|-------|----------|
| A | 90-100 | Would impress a senior partner. Exceptional quality. |
| B | 75-89 | Professional quality. Would pass partner review with minor notes. |
| C | 60-74 | Adequate. Notable weaknesses but core argument works. |
| D | 40-59 | Below standard. Would be sent back for revision. |
| F | 0-39 | Fundamental issues. Needs complete rework. |

## Verdict Logic

```
IF any_lens_grade == "F" → FAIL
IF count(grade <= "D") >= 2 → FAIL
IF any_lens_grade == "D" → REVISION_NEEDED
IF cultural_calibration_failed → REVISION_NEEDED
IF consistency_check_failed → REVISION_NEEDED
ELSE → PASS
```

## Cross-Scenario Consistency Rules

Arguments across different findings must not contradict each other. Common contradictions to catch:

1. **Speed vs. Thoroughness**: One argument claims "we prioritized speed" while another claims "we were thorough"
2. **Cost vs. Quality**: One claims "cost-optimized" while another claims "premium quality"
3. **Innovation vs. Precedent**: One says "novel approach" while another says "proven methodology"
4. **Scope**: Arguments about what's in/out of scope must be consistent

## Cultural Calibration Checklist

For each scenario, verify:
- [ ] No direct confrontation or accusation
- [ ] Acknowledgment precedes every counter-argument
- [ ] Humble language used consistently
- [ ] Face-saving bridge is genuinely face-saving (not condescending)
- [ ] Japanese phrasing is grammatically correct and appropriately formal (敬語/丁寧語)
- [ ] Nemawashi recommendations are realistic for the context
- [ ] No Western-style "hard sell" or aggressive persuasion

## Revision Instructions Format

When writing revision instructions, be specific:

**Bad**: "Strengthen the evidence in Level 2"
**Good**: "Level 2 cites 'industry data' without specifics. Replace with: cite the 2024 JFSA (金融庁) guidelines Section 4.2 which mandates minimum 99.95% uptime for Tier-1 banking systems, directly supporting our 99.99% SLA commitment."

## Process

1. Read all upstream artifacts (01, 02, 03 JSON files)
2. For each scenario, apply all 5 lenses
3. Grade each level within each lens
4. Check cross-scenario consistency
5. Run cultural calibration checklist
6. Assign verdict (PASS/REVISION_NEEDED/FAIL)
7. Write specific revision instructions for non-PASS scenarios

## Output Format

Write QA results to `_workspace/04_qa_results.json`. See the agent definition for the complete schema.

## Quality Checklist
- [ ] All 5 lenses applied to every scenario
- [ ] Level-by-level grades provided (not just overall)
- [ ] Specific improvement actions for every grade below B
- [ ] Cross-scenario consistency verified
- [ ] Cultural calibration checked
- [ ] Revision instructions are actionable and specific
- [ ] Overall defense readiness score calculated
