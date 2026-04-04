---
name: jp-client-critique
description: "Simulate a demanding Japanese banking/financial client reviewing deliverables. Identifies MECE gaps, objectivity issues, comprehensiveness failures, evidence shortfalls, and cultural form violations with authentic Japanese business criticism phrases. Use this skill whenever evaluating deliverables from a Japanese client perspective, finding potential criticisms, simulating client review meetings, preparing for pushback, or anticipating Japanese business objections. MUST trigger on any Japanese client analysis or deliverable defense preparation task."
---

# Japanese Client Critique Skill

## Purpose

Evaluate deliverable items through the eyes of a demanding Japanese client — specifically the kind of meticulous, risk-averse reviewer found in Japanese banking, financial institutions, and large enterprise environments. Generate authentic, detailed criticisms that anticipate real client objections.

## When to Use

- Deliverable items need critique from Japanese client perspective
- Preparing for a client review meeting
- Identifying weaknesses before the client does
- Need to understand how a Japanese banking client would react

## Core Critique Framework

### The 12 Criticism Types

Every criticism maps to one of these types. Read `references/jp-banking-client-patterns.md` for detailed patterns, phrases, and psychology for each type.

| Type | Japanese | Client's Internal Question |
|------|----------|--------------------------|
| `MECE_GAP` | MECE不備 | "Is this categorization truly exhaustive and non-overlapping?" |
| `OBJECTIVITY` | 客観性不足 | "Is this based on facts or just the vendor's opinion?" |
| `COMPREHENSIVENESS` | 網羅性不足 | "Have all cases been considered?" |
| `EVIDENCE` | 根拠不足 | "Where is the proof?" |
| `FORM` | 体裁不備 | "Does this look professional and consistent?" |
| `AMBIGUITY` | 曖昧さ | "What exactly does this mean?" |
| `RISK` | リスク考慮不足 | "What if this goes wrong?" |
| `PROCESS` | プロセス不備 | "How was this conclusion reached?" |
| `PRECEDENT` | 前例なし | "Has anyone done this before successfully?" |
| `ASSUMPTION` | 前提条件の不備 | "What are we assuming here?" |
| `CONSISTENCY` | 整合性の欠如 | "Doesn't this contradict what was said earlier?" |
| `SCOPE` | スコープの逸脱 | "Is this within what we agreed?" |

### Severity Rating Guide

**HIGH** — Would block approval:
- Any MECE failure in a core framework
- Missing risk assessment for a critical component
- Contradictions between sections
- Fundamental evidence gaps on key claims

**MEDIUM** — Requires satisfactory explanation:
- Partial evidence (some data but not enough)
- Minor comprehensiveness gaps
- Terminology inconsistencies
- Assumptions acknowledged but not validated

**LOW** — Noted for improvement:
- Formatting inconsistencies
- Minor wording ambiguities
- Nice-to-have additions
- Style preferences

### The Hidden Concern Principle

Japanese clients rarely state their real concern directly. The surface criticism often masks a deeper issue:

| Surface Criticism | Hidden Concern |
|------------------|----------------|
| "MECEになっていない" | "I can't explain this framework to my boss" |
| "もう少し検討してください" | "I'm not comfortable approving this" |
| "根拠が不足している" | "I need cover if this fails" |
| "イメージと違う" | "This isn't what I expected but I can't articulate why" |
| "網羅的に検討されていますか" | "I want to see that you worked hard on this" |

Understanding the hidden concern is crucial for building effective persuasion scenarios downstream.

### Critique Process

1. **Read all items** from `_workspace/01_analyst_items.json`
2. **Structural review** — Assess overall deliverable organization
3. **MECE sweep** — Test all categorizations
4. **Item-by-item critique** — Apply all 12 criticism types to each item
5. **Cross-item consistency** — Check for contradictions
6. **Severity rating** — Rate each finding
7. **Prioritize** — Identify top 3 critical issues

For detailed Japanese banking client behavior patterns and authentic criticism phrases, read `references/jp-banking-client-patterns.md`.

## Output Format

Write findings to `_workspace/02_critic_findings.json`. See the agent definition for the complete schema.

## Quality Checklist
- [ ] At least 1 finding per item (even if LOW severity)
- [ ] All findings have Japanese phrasing (criticism_jp)
- [ ] Hidden concerns identified for HIGH severity findings
- [ ] Top 3 critical issues clearly identified
- [ ] Cross-item consistency checked
- [ ] Severity ratings are calibrated (not everything is HIGH)
