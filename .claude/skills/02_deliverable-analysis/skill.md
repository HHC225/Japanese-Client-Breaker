---
name: deliverable-analysis
description: "Analyze and decompose any deliverable (documents, specs, presentations, reports, code) into discrete, critique-ready items with structural metadata. Use this skill when parsing work products for Japanese client review preparation, extracting analyzable items, identifying structural gaps, or breaking down deliverables for defense scenario generation. MUST trigger whenever a deliverable needs to be parsed into items for downstream critique."
---

# Deliverable Analysis Skill

## Purpose

Decompose any deliverable into a structured inventory of discrete items, each with enough context for independent critique and defense. This is the first step in the Japanese client defense pipeline.

## When to Use

- A deliverable needs to be analyzed before critique
- Structural gaps need to be identified
- MECE categorizations need to be validated
- Implicit assumptions need to be surfaced

## Methodology

### Granularity Principle
Break items to the smallest independently defensible unit. The test: "Could a Japanese client raise a separate criticism about this specific point?" If yes, it's a separate item.

**Too coarse**: "Section 3: System Architecture" → This contains multiple claims, decisions, and assumptions.
**Right granularity**: "ITEM-007: Choice of microservices over monolith", "ITEM-008: Database selection (PostgreSQL)", "ITEM-009: API authentication method (OAuth2)"

### Item Categories
| Category | Description | Example |
|----------|-------------|---------|
| `claim` | Factual assertion | "Response time will be under 200ms" |
| `decision` | Choice made among alternatives | "We selected React over Vue" |
| `recommendation` | Suggested action | "We recommend phased rollout" |
| `assumption` | Stated or implied premise | "User base will grow 20% annually" |
| `data` | Quantitative evidence | "Current system handles 10k requests/sec" |
| `design` | Architectural or design choice | "Event-driven architecture for notifications" |
| `process` | Methodology or workflow | "Agile sprints with 2-week cycles" |
| `definition` | Terminology or scope definition | "Active user = logged in within 30 days" |

### Assumption Surfacing
For every item, answer these questions:
1. What must be true for this item to be valid?
2. What external factors does this depend on?
3. What technical constraints are assumed?
4. What business rules are implied but not stated?

These surfaced assumptions become their own items with category `assumption`.

### Gap Detection Patterns
Common gaps Japanese banking clients notice:
- **Missing alternatives**: Only one option presented with no comparison
- **Missing risk assessment**: No discussion of what could go wrong
- **Missing quantification**: Qualitative claims without numbers
- **Missing timeline**: No schedule or milestone information
- **Missing ownership**: No clear RACI or responsibility assignment
- **Missing precedent**: No reference to similar past implementations
- **Missing rollback plan**: No discussion of failure recovery

### MECE Validation
For any categorization found in the deliverable:
1. List all categories
2. Test mutual exclusivity: Does any element fit in 2+ categories?
3. Test collective exhaustiveness: Is there any element that doesn't fit in any category?
4. Flag failures with specific overlap/gap description

## Output Format

Write structured JSON to `_workspace/01_analyst_items.json`. See the agent definition for the complete schema.

## Quality Checklist
- [ ] Every item has at least 1 vulnerability hint
- [ ] All implicit assumptions surfaced
- [ ] Structural gaps include at least 3 critical missing elements
- [ ] MECE categorizations tested and results noted
- [ ] Items are sequentially and uniquely numbered
- [ ] Each item carries enough context to stand alone
