---
name: jp-client-defender
description: "Analyze deliverables and generate defense strategies for Japanese clients. Input any deliverable (document, spec, presentation, report) and receive a comprehensive HTML report with item-by-item critique, multi-level persuasion scenarios, and Big 5 consulting QA validation. Use this skill whenever preparing for Japanese client reviews, defending deliverables against Japanese criticism, building persuasion arguments for Japanese business contexts, or needing to anticipate Japanese banking client objections. MUST trigger on any request involving Japanese client defense, deliverable review preparation, persuasion scenario generation, or 日本クライアント対策."
---

# JP Client Defender — Orchestrator Skill

## Entry Point

This skill is executed by the **orchestrator agent** (`.claude/agents/00_orchestrator.md`, model: opus). When this skill triggers, spawn the orchestrator agent first:

```
Agent(
  description: "Run JP Client Defender pipeline",
  model: "opus",
  prompt: "You are the JP Client Defender Orchestrator. Read your agent definition at .claude/agents/00_orchestrator.md and follow the instructions there. The user wants to analyze the following deliverable: [deliverable info]"
)
```

## Execution Mode: Sub-Agent (Pipeline)

The orchestrator agent runs a 5-stage pipeline, spawning each sub-agent sequentially. Each stage depends on the previous stage's output.

## Agent Configuration

| Agent | Definition | Model | Role | Skill | Output |
|-------|-----------|-------|------|-------|--------|
| **orchestrator** | `.claude/agents/00_orchestrator.md` | **opus** | Pipeline coordination, QA gating, revision loop | jp-client-defender | Final report |
| file-preprocessor | `.claude/agents/01_file-preprocessor.md` | sonnet | Convert Excel/PDF/PPT/Word → Markdown | file-preprocessing | `00_preprocessed_input.md` |
| deliverable-analyst | `.claude/agents/02_deliverable-analyst.md` | sonnet | Parse deliverable into items | deliverable-analysis | `01_analyst_items.json` |
| gap-analyzer | `.claude/agents/03_gap-analyzer.md` | **opus** | Detect missing elements (parallel with analyst) | gap-analysis | `06_gap_analysis.json` |
| decision-advisor | `.claude/agents/04_decision-advisor.md` | **opus** | Analyze undecided items, recommend direction | decision-analysis | `05_decision_recommendations.json` |
| jp-client-critic | `.claude/agents/05_jp-client-critic.md` | opus | Critique from JP client perspective | jp-client-critique | `02_critic_findings.json` |
| persuasion-strategist | `.claude/agents/06_persuasion-strategist.md` | opus | Build argument trees | persuasion-scenarios | `03_strategist_scenarios.json` |
| consulting-qa | `.claude/agents/07_consulting-qa.md` | opus | Validate through Big 5 lenses | consulting-qa | `04_qa_results.json` |
| report-generator | `.claude/agents/08_report-generator.md` | sonnet | Generate HTML report | html-report-generation | `{TIMESTAMP}_client-defense-report.html` |
| quality-gate | `.claude/agents/09_quality-gate.md` | **opus** | Internal QA after each phase | quality-gate | `09_quality_gate_{phase}.json` |

## Workspace Variable

Throughout this document, `{WORKSPACE}` refers to a **timestamped run directory** created at the start of each pipeline execution. The orchestrator generates this path in Phase 0 and substitutes it into every sub-agent prompt. Example: `_workspace/run_20260404_153000`.

When constructing sub-agent prompts below, **replace all `{WORKSPACE}` references with the actual workspace path**.

## Workflow

### Phase 0: Preparation & Preprocessing

1. **Language selection**: Before anything else, determine the output language.
   - If the user already specified a language in their request, use it.
   - If not, ask: "What language should the report be generated in? (e.g., Korean, Japanese, English)"
   - Store as `{LANGUAGE}` and pass to every sub-agent prompt.
   - Save the language to `{WORKSPACE}/00_language.txt` for reference.
   - **Rule**: ALL generated text content (criticisms, arguments, evidence, QA feedback, summaries, titles) MUST be in `{LANGUAGE}`. JSON field names remain English. Japanese phrasing fields (`japanese_phrasing`, `criticism_jp`) are always in Japanese regardless.

2. Create timestamped workspace directory:
   ```bash
   TIMESTAMP=$(date +%Y%m%d_%H%M%S)
   WORKSPACE="_workspace/run_${TIMESTAMP}"
   mkdir -p "$WORKSPACE"
   ln -sfn "run_${TIMESTAMP}" _workspace/latest
   ```
   Use this path as `{WORKSPACE}` for ALL file operations in subsequent phases.
   Also create/update a `_workspace/latest` symlink pointing to this run for user convenience.

3. **Input directory**: `input/`
   - Users place deliverable files here (Excel, PDF, PowerPoint, Word, CSV, images, text)
   - If user provides text directly instead → save to `{WORKSPACE}/00_raw_input.txt` and skip preprocessing

3. **Run file preprocessor** to convert non-text files into LLM-readable Markdown:

```
Agent(
  description: "Preprocess input files",
  model: "sonnet",
  prompt: "You are the File Preprocessor. Read your agent definition at .claude/agents/01_file-preprocessor.md and your skill at .claude/skills/01_file-preprocessing/skill.md.

  Run the extraction script to convert all files in input/ into LLM-readable format:

  bash .claude/skills/01_file-preprocessing/scripts/run_extract.sh input/ {WORKSPACE}/00_preprocessed_input.md

  The wrapper script auto-installs uv if missing. If it fails, it prints installation instructions and exits with code 1. In that case, relay the error message to the user and stop the pipeline.

  After the script completes, check {WORKSPACE}/00_file_manifest.json for any PDF or image files that need Read tool processing. Read those files and append their content to {WORKSPACE}/00_preprocessed_input.md.

  Verify the final output is comprehensive."
)
```

**Completion check**: Verify `{WORKSPACE}/00_preprocessed_input.md` exists and has substantial content.

4. Determine the output report path:
   - Default: `{WORKSPACE}/{TIMESTAMP}_client-defense-report.html`
   - If user specifies a path, use that instead

### Phase 1: Analysis + Gap Detection (PARALLEL)

Launch BOTH agents simultaneously using parallel Agent calls. They have no dependency on each other.

**Phase 1A: Deliverable Analyst**

```
Agent(
  description: "Analyze deliverable into items",
  model: "sonnet",
  prompt: "You are the Deliverable Analyst. Read your agent definition at .claude/agents/02_deliverable-analyst.md and your skill at .claude/skills/02_deliverable-analysis/skill.md. Then analyze the preprocessed deliverable at {WORKSPACE}/00_preprocessed_input.md and write the structured output to {WORKSPACE}/01_analyst_items.json.

  Also check {WORKSPACE}/00_file_manifest.json to understand the source files and their types.

  OUTPUT LANGUAGE: {LANGUAGE}. ALL text content (titles, summaries, descriptions) MUST be written in {LANGUAGE}.

  Follow the agent definition precisely. Output MUST be valid JSON."
)
```

**Phase 1B: Gap Analyzer** (runs in parallel with 1A)

```
Agent(
  description: "Detect missing elements",
  model: "opus",
  prompt: "You are the Gap Analyzer. Read your agent definition at .claude/agents/03_gap-analyzer.md and your skill at .claude/skills/03_gap-analysis/skill.md.

  Read the preprocessed deliverable at {WORKSPACE}/00_preprocessed_input.md. Also read any project context files in input/details/ if they exist.

  Identify what is MISSING from the deliverable — gaps in structure, stakeholder coverage, scenarios, risks, evidence, and regulatory considerations. Do NOT criticize what IS there — only flag what SHOULD BE there but ISN'T.

  OUTPUT LANGUAGE: {LANGUAGE}. ALL text content MUST be in {LANGUAGE}. JSON field names stay in English.

  Output MUST be valid JSON. Write to {WORKSPACE}/06_gap_analysis.json."
)
```

**Phase 1C: Decision Advisor** (runs in parallel with 1A and 1B)

```
Agent(
  description: "Analyze undecided items",
  model: "opus",
  prompt: "You are the Decision Advisor. Read your agent definition at .claude/agents/04_decision-advisor.md and your skill at .claude/skills/04_decision-analysis/skill.md.

  Read the preprocessed deliverable at {WORKSPACE}/00_preprocessed_input.md.

  Identify ALL items marked with 要検討, ？, 未確定, TBD, 検討中, （仮）, or similar undecided markers. For each, analyze options and recommend a direction.

  OUTPUT LANGUAGE: {LANGUAGE}. ALL text content MUST be in {LANGUAGE}. JSON field names stay in English.

  Output MUST be valid JSON. Write to {WORKSPACE}/05_decision_recommendations.json."
)
```

**Completion check**: Verify ALL THREE files exist and are valid JSON.

### Phase 1-QG: Quality Gate (run 3 quality gates in parallel)

First, verify all 3 JSON files exist and parse correctly (simple script-level check by orchestrator).
Then run 3 consultant QA reviews in parallel:

```
Agent(
  description: "Quality gate Phase 1A",
  model: "opus",
  prompt: "You are the Quality Gate. Read .claude/agents/09_quality-gate.md and .claude/skills/09_quality-gate/skill.md.
  Review {WORKSPACE}/01_analyst_items.json — check if the analyst extracted the RIGHT items at the RIGHT granularity.
  Also read {WORKSPACE}/00_preprocessed_input.md to verify claims are accurate.
  Focus on: premise validity, extraction quality, implicit assumptions.
  Write results to {WORKSPACE}/09_quality_gate_1a.json. Output MUST be valid JSON."
)
Agent(
  description: "Quality gate Phase 1B",
  model: "opus",
  prompt: "You are the Quality Gate. Read .claude/agents/09_quality-gate.md and .claude/skills/09_quality-gate/skill.md.
  Review {WORKSPACE}/06_gap_analysis.json — check if the identified gaps are REAL and the severity is calibrated correctly for Japanese banking.
  Also read {WORKSPACE}/00_preprocessed_input.md to verify the gaps aren't actually addressed in the deliverable.
  Focus on: gap validity, false positives, missed critical gaps, severity calibration.
  Write results to {WORKSPACE}/09_quality_gate_1b.json. Output MUST be valid JSON."
)
Agent(
  description: "Quality gate Phase 1C",
  model: "opus",
  prompt: "You are the Quality Gate. Read .claude/agents/09_quality-gate.md and .claude/skills/09_quality-gate/skill.md.
  Review {WORKSPACE}/05_decision_recommendations.json — check if ALL undecided markers were caught and recommendations are defensible.
  Also read {WORKSPACE}/00_preprocessed_input.md to verify no undecided items were missed.
  Focus on: completeness, recommendation soundness, option balance, dependency logic.
  Write results to {WORKSPACE}/09_quality_gate_1c.json. Output MUST be valid JSON."
)
```

For each REVISE verdict: re-run the failing agent with quality gate's `fix_direction` feedback. Max 1 retry per agent. If 2nd REVISE, proceed with warnings.

After quality gates pass, extract undecided item IDs from Phase 1C to pass to Phase 2.

### Phase 2: Critique (JP Client Critic)

Launch the jp-client-critic agent:

```
Agent(
  description: "Critique from JP client view",
  model: "opus",
  prompt: "You are the Japanese Client Critic. Read your agent definition at .claude/agents/05_jp-client-critic.md and your skill at .claude/skills/05_jp-client-critique/skill.md. Also read the detailed reference at .claude/skills/05_jp-client-critique/references/jp-banking-client-patterns.md for comprehensive Japanese banking client patterns.

  Read the analyst output from {WORKSPACE}/01_analyst_items.json and generate detailed criticisms from a Japanese banking client perspective. Write output to {WORKSPACE}/02_critic_findings.json.

  IMPORTANT — GAP ANALYSIS: Also read {WORKSPACE}/06_gap_analysis.json. Incorporate identified gaps as additional findings with type COMPREHENSIVENESS or MECE_GAP. Reference the GAP-XXX id. These represent things MISSING from the deliverable that the Gap Analyzer identified.

  IMPORTANT — UNDECIDED ITEMS: Also read {WORKSPACE}/05_decision_recommendations.json. The following items are PENDING DECISIONS, not defects: [paste undecided item IDs from Phase 1.5]. For these items:
  - Set severity to 'UNDECIDED' (NOT HIGH/MEDIUM/LOW)
  - Set 'is_undecided' to true
  - Reference the corresponding UNDECIDED-XXX id
  - Do NOT treat them as defects — they are decision points being analyzed separately
  - You may still note risks associated with the delay of these decisions

  Be genuinely critical for non-undecided items. Think like a 部長 at a major Japanese bank reviewing a vendor deliverable. Find every weakness.

  OUTPUT LANGUAGE: {LANGUAGE}. ALL text content (criticism_detail, specific_weakness, client_psychology, cultural_context, likely_client_phrasing) MUST be in {LANGUAGE}. The criticism_jp field is ALWAYS in Japanese regardless. JSON field names stay in English.

  Output MUST be valid JSON."
)
```

**Completion check**: Verify `{WORKSPACE}/02_critic_findings.json` exists and is valid JSON.

### Phase 2-QG: Quality Gate for Critic

```
Agent(
  description: "Quality gate Phase 2",
  model: "opus",
  prompt: "You are the Quality Gate. Read .claude/agents/09_quality-gate.md and .claude/skills/09_quality-gate/skill.md.
  Review {WORKSPACE}/02_critic_findings.json — check if criticisms target the RIGHT weaknesses at the RIGHT severity for Japanese banking context.
  Also read: {WORKSPACE}/00_preprocessed_input.md (source truth), {WORKSPACE}/01_analyst_items.json, {WORKSPACE}/05_decision_recommendations.json, {WORKSPACE}/06_gap_analysis.json.
  Focus on: Are UNDECIDED items correctly separated? Are gap findings incorporated? Is severity calibrated for banking? Are criticisms targeting real issues or nitpicking?
  Write results to {WORKSPACE}/09_quality_gate_2.json. Output MUST be valid JSON."
)
```

If REVISE: re-run Critic with fix_direction feedback. Max 1 retry.

### Phase 3: Persuasion (Persuasion Strategist)

Launch the persuasion-strategist agent:

```
Agent(
  description: "Build persuasion scenarios",
  model: "opus",
  prompt: "You are the Persuasion Strategist. Read your agent definition at .claude/agents/06_persuasion-strategist.md and your skill at .claude/skills/06_persuasion-scenarios/skill.md. Also read the detailed argument patterns at .claude/skills/06_persuasion-scenarios/references/argument-tree-patterns.md.

  Read the critic findings from {WORKSPACE}/02_critic_findings.json and build multi-level argument trees (minimum 3 levels) for each finding. This includes BOTH the item-level 'findings' array AND the 'structural_criticisms' array. For structural criticisms, use their id as finding_id (e.g., STRUCT-001), set item_id to 'STRUCTURAL', and output them in a separate 'structural_scenarios' array. Write output to {WORKSPACE}/03_strategist_scenarios.json.

  Every argument tree must have culturally calibrated Japanese phrasing and a face-saving bridge at Level 3.

  OUTPUT LANGUAGE: {LANGUAGE}. ALL text content (your_argument, evidence, closing_strategy, expected_client_rebuttal) MUST be in {LANGUAGE}. The japanese_phrasing field is ALWAYS in Japanese regardless. JSON field names stay in English.

  Output MUST be valid JSON."
)
```

**Completion check**: Verify `{WORKSPACE}/03_strategist_scenarios.json` exists and is valid JSON.

### Phase 3-QG: Quality Gate for Strategist

```
Agent(
  description: "Quality gate Phase 3",
  model: "opus",
  prompt: "You are the Quality Gate. Read .claude/agents/09_quality-gate.md and .claude/skills/09_quality-gate/skill.md.
  Review {WORKSPACE}/03_strategist_scenarios.json — check if the defense strategy is sound.
  Also read: {WORKSPACE}/00_preprocessed_input.md and {WORKSPACE}/02_critic_findings.json.
  Focus on: Are we defending things that should be conceded? Are argument trees logically coherent? Is cultural calibration appropriate for Japanese banking? Would these arguments actually work in a real meeting?
  Write results to {WORKSPACE}/09_quality_gate_3.json. Output MUST be valid JSON."
)
```

If REVISE: re-run Strategist with fix_direction feedback. Max 1 retry.

### Phase 4: QA Validation (Consulting QA) — TWO-PHASE QA

Launch the consulting-qa agent. QA runs in two phases:
- **Phase A**: Foundational Audit — checks if premises, criticism direction, and defense approach are correct
- **Phase B**: Argument Quality — grades individual scenarios through Big 5 lenses (only runs if Phase A passes)

```
Agent(
  description: "QA through Big 5 lenses",
  model: "opus",
  prompt: "You are the Consulting QA Agent. Read your agent definition at .claude/agents/07_consulting-qa.md and your skill at .claude/skills/07_consulting-qa/skill.md. Also read the detailed consulting methods reference at .claude/skills/07_consulting-qa/references/big5-consulting-methods.md.

  Read all upstream artifacts:
  - {WORKSPACE}/01_analyst_items.json
  - {WORKSPACE}/02_critic_findings.json
  - {WORKSPACE}/03_strategist_scenarios.json
  - {WORKSPACE}/05_decision_recommendations.json
  - {WORKSPACE}/06_gap_analysis.json

  CRITICAL: Run Phase A (Foundational Audit) FIRST.
  Also validate:
  - Decision recommendations: check that each recommendation is well-reasoned, options are MECE, and the recommended option is defensible. Include in output under 'decision_qa' array.
  - Gap analysis: check that identified gaps are genuine (not false positives), severity is calibrated correctly, and recommendations are actionable. Include in output under 'gap_qa' array.
  Check if the premises, analysis, criticism direction, and defense approach are fundamentally correct.
  If Phase A fails, set the appropriate verdict (ANALYSIS_REDO, CRITIQUE_REDO, or STRATEGY_REDO)
  and write detailed foundation_issues explaining what is wrong and how to fix it.
  Do NOT proceed to Phase B if Phase A fails.

  Only if Phase A passes (FOUNDATION_PASS), proceed to Phase B:
  Validate every persuasion scenario through all 5 consulting firm lenses.
  Grade each argument at each level.

  Write output to {WORKSPACE}/04_qa_results.json.

  Be ruthlessly honest. A weak argument or wrong premise that passes QA damages the user's credibility in the actual meeting.

  OUTPUT LANGUAGE: {LANGUAGE}. ALL text content (detail, strengths, weaknesses, improvement_actions, foundation_issues) MUST be in {LANGUAGE}. JSON field names stay in English.

  Output MUST be valid JSON."
)
```

**Completion check**: Verify `{WORKSPACE}/04_qa_results.json` exists and is valid JSON.

### Phase 4.5: QA-Driven Loop (Conditional)

Read the QA results and check `foundation_audit.verdict`:

#### If `ANALYSIS_REDO` → Full restart from Phase 1

The deliverable was improperly decomposed. Re-run the analyst with QA's feedback:

```
Agent(
  description: "Re-analyze deliverable (QA restart)",
  model: "sonnet",
  prompt: "You are the Deliverable Analyst. Read your agent definition and skill.

  IMPORTANT: The QA agent found fundamental issues with the previous analysis.
  QA Foundation Issues: [paste foundation_issues from QA results]
  QA Restart Instructions: [paste restart_instructions from QA results]

  Re-analyze the deliverable incorporating the QA feedback above.
  Write corrected output to {WORKSPACE}/01_analyst_items.json (overwrite).

  OUTPUT LANGUAGE: {LANGUAGE}. ALL text content MUST be in {LANGUAGE}. JSON field names stay in English.

  Output MUST be valid JSON."
)
```

Then re-run Phase 2 → Phase 3 → Phase 4.

#### If `CRITIQUE_REDO` → Restart from Phase 2

The criticisms targeted the wrong issues. Re-run the critic with QA's feedback:

```
Agent(
  description: "Re-critique with QA feedback",
  model: "opus",
  prompt: "You are the Japanese Client Critic. Read your agent definition, skill, and reference files.

  IMPORTANT: The QA agent found that your previous criticisms were misdirected.
  QA Foundation Issues: [paste foundation_issues from QA results]
  QA Restart Instructions: [paste restart_instructions from QA results]

  Re-read {WORKSPACE}/01_analyst_items.json and generate corrected criticisms.
  Write corrected output to {WORKSPACE}/02_critic_findings.json (overwrite).

  OUTPUT LANGUAGE: {LANGUAGE}. ALL text content MUST be in {LANGUAGE}. criticism_jp is always Japanese. JSON field names stay in English.

  Output MUST be valid JSON."
)
```

Then re-run Phase 3 → Phase 4.

#### If `STRATEGY_REDO` → Restart from Phase 3

The defense direction is wrong. Re-run the strategist with QA's feedback:

```
Agent(
  description: "Re-strategize with QA feedback",
  model: "opus",
  prompt: "You are the Persuasion Strategist. Read your agent definition, skill, and reference files.

  IMPORTANT: The QA agent found that your defense direction was fundamentally wrong.
  QA Foundation Issues: [paste foundation_issues from QA results]
  QA Restart Instructions: [paste restart_instructions from QA results]

  Re-read {WORKSPACE}/02_critic_findings.json and build corrected argument trees.
  Write corrected output to {WORKSPACE}/03_strategist_scenarios.json (overwrite).

  OUTPUT LANGUAGE: {LANGUAGE}. ALL text content MUST be in {LANGUAGE}. japanese_phrasing is always Japanese. JSON field names stay in English.

  Output MUST be valid JSON."
)
```

Then re-run Phase 4.

#### If `FOUNDATION_PASS` → Check scenario verdicts

If any scenario has verdict `REVISION_NEEDED` or `FAIL`, re-run Phase 3 (strategist) with revision instructions, then re-run Phase 4. When re-running QA after a scenario revision (not a foundational restart), explicitly instruct the QA agent: "Phase A (Foundational Audit) has already PASSED. Skip Phase A entirely. Run ONLY Phase B (Argument Quality Validation) on the revised scenarios." Maximum 2 scenario revision iterations.

#### Loop Limits

| Loop Type | Max Iterations | After Limit |
|-----------|---------------|-------------|
| Full restart (ANALYSIS/CRITIQUE/STRATEGY_REDO) | 1 | Proceed with warnings |
| Scenario revision (REVISION_NEEDED) | 2 | Proceed with warnings |

### Phase 5: Report Generation

Launch the report-generator agent:

```
Agent(
  description: "Generate HTML report",
  model: "sonnet",
  prompt: "You are the Report Generator. Read your agent definition at .claude/agents/08_report-generator.md and your skill at .claude/skills/08_html-report-generation/skill.md.

  Read the HTML template at .claude/skills/08_html-report-generation/assets/report-template.html.

  Read all workspace data files:
  - {WORKSPACE}/01_analyst_items.json
  - {WORKSPACE}/02_critic_findings.json
  - {WORKSPACE}/03_strategist_scenarios.json
  - {WORKSPACE}/04_qa_results.json

  Merge all data into the REPORT_DATA structure defined in your agent definition. Then inject the data into the HTML template by replacing /* __REPORT_DATA_PLACEHOLDER__ */ with the actual JSON data.

  Write the final report to: [output_path]

  OUTPUT LANGUAGE: {LANGUAGE}. The HTML template UI labels remain as-is, but the REPORT_DATA metadata.language field should be set to '{LANGUAGE}' so the template can adapt if needed.

  The report must be a single, self-contained HTML file that opens in any browser without JavaScript errors. After writing, validate with: node .claude/skills/08_html-report-generation/scripts/validate-report.js [output_path]"
)
```

### Phase 6: Delivery

1. Verify the report file exists
2. Report the file path to the user
3. Show a brief summary:
   - Total items analyzed
   - Total findings
   - Severity breakdown
   - Defense readiness score
   - QA pass rate
4. Preserve the workspace directory for audit trail — each run is isolated under `_workspace/run_YYYYMMDD_HHMMSS/`

## Data Flow

```
[User Input: Deliverable files in input/]
        │
        ▼
┌─────────────────┐
│ File             │  model: sonnet
│ Preprocessor     │──→ 00_preprocessed_input.md + 00_file_manifest.json
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Deliverable      │  model: sonnet
│ Analyst          │──→ 01_analyst_items.json
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ JP Client        │  model: opus
│ Critic           │──→ 02_critic_findings.json
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Persuasion       │  model: opus
│ Strategist       │──→ 03_strategist_scenarios.json
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ Consulting QA (opus)                     │
│                                          │
│  Phase A: Foundational Audit             │
│  ┌─────────────────────────────────┐     │
│  │ Premises correct?                │     │
│  │ Criticism direction valid?       │     │
│  │ Defense approach sound?          │     │
│  └──────────┬──────────────────────┘     │
│             │                            │
│    ┌────────┴────────┐                   │
│    │ Foundation OK?  │                   │
│    └────────┬────────┘                   │
│      REDO   │   PASS                     │
│    ┌────────┘    │                       │
│    │             ▼                       │
│    │  Phase B: Argument Grading          │
│    │  (Big 5 Consulting Lenses)          │
│    │             │                       │
│    │         ┌───┴───┐                   │
│    │         │ Pass? │                   │
│    │         └───┬───┘                   │
│    │          No │ Yes                   │
│    ▼          │  │                       │
│ ┌──────────┐ │  │                       │
│ │ RESTART  │ │  │                       │
│ │ signal   │ │  │                       │
│ └──────────┘ │  │                       │
└──────────────┼──┼───────────────────────┘
               │  │
  ┌────────────┘  │
  │               │
  ▼               │
┌──────────┐      │
│ANALYSIS_ │──→ Back to Analyst (Phase 1)
│REDO      │    then re-run 2→3→4
├──────────┤      │
│CRITIQUE_ │──→ Back to Critic (Phase 2)
│REDO      │    then re-run 3→4
├──────────┤      │
│STRATEGY_ │──→ Back to Strategist (Phase 3)
│REDO      │    then re-run 4
├──────────┤      │
│REVISION_ │──→ Revise scenarios (Phase 3)
│NEEDED    │    then re-run QA Phase B only
└──────────┘      │
  (max 1 full     │
   restart,       │
   max 2 revise)  │
                  ▼
        ┌─────────────────┐
        │ Report           │  model: sonnet
        │ Generator        │──→ {TIMESTAMP}_client-defense-report.html
        └─────────────────┘
                  │
                  ▼
           [User receives HTML report]
```

## Error Handling

| Scenario | Strategy |
|----------|----------|
| Agent fails to produce JSON | Retry once with explicit JSON instruction. If still fails, skip and note in report. |
| Deliverable too large to read | Split into sections, process sequentially, merge results. |
| QA fails all scenarios after 2 revisions | Proceed to report with QA warnings prominently displayed. |
| Workspace file missing | Generate report with available data + warning banner. |
| Agent timeout | Report progress so far, note incomplete analysis. |

## Test Scenarios

### Normal Flow
1. User provides a 10-page requirements document
2. Analyst extracts 15 items
3. Critic finds 20 findings (5 HIGH, 10 MEDIUM, 5 LOW)
4. Strategist creates 20 scenarios with 3-level argument trees
5. QA passes 16, flags 4 for revision
6. Revision loop fixes 3 of 4 (1 remains REVISION_NEEDED)
7. Report generated with all data, warnings on the 1 unresolved scenario

### Error Flow
1. User provides a very short deliverable (1 paragraph)
2. Analyst extracts 2 items
3. Critic finds 3 findings
4. Strategist creates 3 scenarios
5. QA fails 2 scenarios (evidence gaps)
6. Revision loop: iteration 1 fixes 1, iteration 2 fixes 0
7. Report generated with QA warnings on 1 remaining failed scenario
8. User notified that 1 scenario needs manual improvement
