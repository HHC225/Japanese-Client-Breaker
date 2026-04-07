---
name: gap-analysis
description: "Identifies what is MISSING from a deliverable — gaps in structure, stakeholder coverage, scenarios, risks, evidence, and regulatory considerations. Runs in parallel with the Analyst. Use when checking deliverable completeness or detecting blind spots."
---

# Gap Analysis Skill

> `{WORKSPACE}` = timestamped run directory provided by the orchestrator.

## Purpose

Detect blind spots. The Analyst extracts what the deliverable contains; the Gap Analyzer identifies what it SHOULD contain but doesn't. These two tasks are independent and run in parallel.

## When to Use

- Any deliverable needs completeness assessment
- Need to identify missing sections, unconsidered scenarios, absent stakeholders
- Preparing for a review where "why didn't you consider X?" questions are expected

## Process

1. Read the preprocessed deliverable
2. Identify the deliverable type (test plan, design doc, proposal, report)
3. Apply the 6-dimension gap analysis framework
4. Score each gap by severity (CRITICAL / IMPORTANT / NICE_TO_HAVE)
5. Identify missing stakeholder perspectives
6. Output structured gap report

## Integration with Pipeline

- **Runs at**: Phase 1 (parallel with Analyst)
- **No dependency on Analyst** — reads preprocessed input directly
- **Feeds into**: Phase 1.5 (Decision Advisor may reference gaps), Phase 2 (Critic incorporates gap findings), Phase 4 (QA validates gap analysis)
- **Report**: Gaps appear in a dedicated "Gaps" section with different visual treatment from criticism findings

## Quality Checklist

- [ ] All 6 dimensions analyzed (structural, stakeholder, scenario, risk, evidence, regulatory)
- [ ] Each gap has a specific recommendation (not just "add this")
- [ ] Severity classifications are justified
- [ ] Missing perspectives identified with specific "what they would flag"
- [ ] Completeness score calculated with rationale
