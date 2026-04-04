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
| jp-client-critic | `.claude/agents/03_jp-client-critic.md` | opus | Critique from JP client perspective | jp-client-critique | `02_critic_findings.json` |
| persuasion-strategist | `.claude/agents/04_persuasion-strategist.md` | opus | Build argument trees | persuasion-scenarios | `03_strategist_scenarios.json` |
| consulting-qa | `.claude/agents/05_consulting-qa.md` | opus | Validate through Big 5 lenses | consulting-qa | `04_qa_results.json` |
| report-generator | `.claude/agents/06_report-generator.md` | sonnet | Generate HTML report | html-report-generation | `defense-report.html` |

## Workspace Variable

Throughout this document, `{WORKSPACE}` refers to a **timestamped run directory** created at the start of each pipeline execution. The orchestrator generates this path in Phase 0 and substitutes it into every sub-agent prompt. Example: `_workspace/run_20260404_153000`.

When constructing sub-agent prompts below, **replace all `{WORKSPACE}` references with the actual workspace path**.

## Workflow

### Phase 0: Preparation & Preprocessing

1. Create timestamped workspace directory:
   ```bash
   TIMESTAMP=$(date +%Y%m%d_%H%M%S)
   WORKSPACE="_workspace/run_${TIMESTAMP}"
   mkdir -p "$WORKSPACE"
   ln -sfn "run_${TIMESTAMP}" _workspace/latest
   ```
   Use this path as `{WORKSPACE}` for ALL file operations in subsequent phases.
   Also create/update a `_workspace/latest` symlink pointing to this run for user convenience.

2. **Input directory**: `input/`
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
   - Default: `{WORKSPACE}/defense-report.html`
   - If user specifies a path, use that instead

### Phase 1: Analysis (Deliverable Analyst)

Launch the deliverable-analyst agent:

```
Agent(
  description: "Analyze deliverable into items",
  model: "sonnet",
  prompt: "You are the Deliverable Analyst. Read your agent definition at .claude/agents/02_deliverable-analyst.md and your skill at .claude/skills/02_deliverable-analysis/skill.md. Then analyze the preprocessed deliverable at {WORKSPACE}/00_preprocessed_input.md and write the structured output to {WORKSPACE}/01_analyst_items.json.

  Also check {WORKSPACE}/00_file_manifest.json to understand the source files and their types.

  Follow the agent definition precisely. Output MUST be valid JSON."
)
```

**Completion check**: Verify `{WORKSPACE}/01_analyst_items.json` exists and is valid JSON.

### Phase 2: Critique (JP Client Critic)

Launch the jp-client-critic agent:

```
Agent(
  description: "Critique from JP client view",
  model: "opus",
  prompt: "You are the Japanese Client Critic. Read your agent definition at .claude/agents/03_jp-client-critic.md and your skill at .claude/skills/03_jp-client-critique/skill.md. Also read the detailed reference at .claude/skills/03_jp-client-critique/references/jp-banking-client-patterns.md for comprehensive Japanese banking client patterns.

  Read the analyst output from {WORKSPACE}/01_analyst_items.json and generate detailed criticisms from a Japanese banking client perspective. Write output to {WORKSPACE}/02_critic_findings.json.

  Be genuinely critical. Think like a 部長 at a major Japanese bank reviewing a vendor deliverable. Find every weakness.

  Output MUST be valid JSON."
)
```

**Completion check**: Verify `{WORKSPACE}/02_critic_findings.json` exists and is valid JSON.

### Phase 3: Persuasion (Persuasion Strategist)

Launch the persuasion-strategist agent:

```
Agent(
  description: "Build persuasion scenarios",
  model: "opus",
  prompt: "You are the Persuasion Strategist. Read your agent definition at .claude/agents/04_persuasion-strategist.md and your skill at .claude/skills/04_persuasion-scenarios/skill.md. Also read the detailed argument patterns at .claude/skills/04_persuasion-scenarios/references/argument-tree-patterns.md.

  Read the critic findings from {WORKSPACE}/02_critic_findings.json and build multi-level argument trees (minimum 3 levels) for each finding. This includes BOTH the item-level 'findings' array AND the 'structural_criticisms' array. For structural criticisms, use their id as finding_id (e.g., STRUCT-001), set item_id to 'STRUCTURAL', and output them in a separate 'structural_scenarios' array. Write output to {WORKSPACE}/03_strategist_scenarios.json.

  Every argument tree must have culturally calibrated Japanese phrasing and a face-saving bridge at Level 3.

  Output MUST be valid JSON."
)
```

**Completion check**: Verify `{WORKSPACE}/03_strategist_scenarios.json` exists and is valid JSON.

### Phase 4: QA Validation (Consulting QA) — TWO-PHASE QA

Launch the consulting-qa agent. QA runs in two phases:
- **Phase A**: Foundational Audit — checks if premises, criticism direction, and defense approach are correct
- **Phase B**: Argument Quality — grades individual scenarios through Big 5 lenses (only runs if Phase A passes)

```
Agent(
  description: "QA through Big 5 lenses",
  model: "opus",
  prompt: "You are the Consulting QA Agent. Read your agent definition at .claude/agents/05_consulting-qa.md and your skill at .claude/skills/05_consulting-qa/skill.md. Also read the detailed consulting methods reference at .claude/skills/05_consulting-qa/references/big5-consulting-methods.md.

  Read all upstream artifacts:
  - {WORKSPACE}/01_analyst_items.json
  - {WORKSPACE}/02_critic_findings.json
  - {WORKSPACE}/03_strategist_scenarios.json

  CRITICAL: Run Phase A (Foundational Audit) FIRST.
  Check if the premises, analysis, criticism direction, and defense approach are fundamentally correct.
  If Phase A fails, set the appropriate verdict (ANALYSIS_REDO, CRITIQUE_REDO, or STRATEGY_REDO)
  and write detailed foundation_issues explaining what is wrong and how to fix it.
  Do NOT proceed to Phase B if Phase A fails.

  Only if Phase A passes (FOUNDATION_PASS), proceed to Phase B:
  Validate every persuasion scenario through all 5 consulting firm lenses.
  Grade each argument at each level.

  Write output to {WORKSPACE}/04_qa_results.json.

  Be ruthlessly honest. A weak argument or wrong premise that passes QA damages the user's credibility in the actual meeting.

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
  prompt: "You are the Report Generator. Read your agent definition at .claude/agents/06_report-generator.md and your skill at .claude/skills/06_html-report-generation/skill.md.

  Read the HTML template at .claude/skills/06_html-report-generation/assets/report-template.html.

  Read all workspace data files:
  - {WORKSPACE}/01_analyst_items.json
  - {WORKSPACE}/02_critic_findings.json
  - {WORKSPACE}/03_strategist_scenarios.json
  - {WORKSPACE}/04_qa_results.json

  Merge all data into the REPORT_DATA structure defined in your agent definition. Then inject the data into the HTML template by replacing /* __REPORT_DATA_PLACEHOLDER__ */ with the actual JSON data.

  Write the final report to: [output_path]

  The report must be a single, self-contained HTML file that opens in any browser."
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
        │ Generator        │──→ defense-report.html
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
