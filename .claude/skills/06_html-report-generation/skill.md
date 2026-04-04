---
name: html-report-generation
description: "Generate polished, interactive single-file HTML reports with business-minimal design for Japanese client defense scenarios. Compiles analysis, critique, persuasion scenarios, and QA validation results into a navigable, print-friendly report. Use this skill when creating final defense reports, rendering analysis results as HTML, generating business reports, or producing client-meeting preparation documents. MUST trigger on any report generation or HTML output task in the defense pipeline."
---

# HTML Report Generation Skill

> `{WORKSPACE}` = timestamped run directory provided by the orchestrator (e.g., `_workspace/run_20260404_153000`).

## Purpose

Compile all pipeline data into a single, self-contained HTML file that serves as the user's primary tool for Japanese client defense preparation. The report must be immediately useful — a professional can open it, find their item, see the criticism, and rehearse their argument within seconds.

## When to Use

- All upstream analysis is complete and needs to be compiled into a report
- User needs a final, actionable defense preparation document
- Results need to be rendered as an interactive HTML report

## Report Generation Process

### Step 1: Load Data
Read all workspace JSON files:
- `{WORKSPACE}/01_analyst_items.json`
- `{WORKSPACE}/02_critic_findings.json`
- `{WORKSPACE}/03_strategist_scenarios.json`
- `{WORKSPACE}/04_qa_results.json`

### Step 2: Load Template
Read the HTML template from `assets/report-template.html` (relative to this skill directory).

### Step 3: Merge Data
Combine all JSON data into a single `REPORT_DATA` object following the structure defined in the report-generator agent definition.

### Step 4: Inject Data
Replace the placeholder `/* __REPORT_DATA_PLACEHOLDER__ */` in the template with the serialized JSON data:
```javascript
const REPORT_DATA = {actual data here};
```

### Step 5: Write Output
Write the complete HTML file to the path specified by the orchestrator.

## Template Design Principles

The template in `assets/report-template.html` follows these design principles:

1. **Single-file**: All CSS and JS embedded. Only external dependency: Google Fonts CDN (Inter + Noto Sans JP)
2. **Data-driven**: All content rendered from the `REPORT_DATA` JavaScript variable
3. **Navigation-first**: Left sidebar with item listing, severity filters, search
4. **Progressive disclosure**: Summary → Item → Finding → Argument Tree → QA Details
5. **Print-ready**: Print stylesheet hides interactive elements, expands all sections
6. **Keyboard-accessible**: j/k navigation, e to expand, p to print

## Report Sections

### 1. Executive Summary (Top)
- Deliverable title and type
- Total items, findings, severity breakdown
- Defense readiness score (gauge visualization)
- QA pass rate
- Top 3 critical issues

### 2. Sidebar Navigation
- Filterable list of all items
- Severity indicators (colored dots)
- QA status badges
- Search box

### 3. Item Cards (Main Content)
Each item has a card containing:
- Item title, category, section
- Content summary
- List of findings (expandable)

### 4. Finding Details (Within Item Cards)
Each finding expands to show:
- Criticism type badge and severity
- Japanese phrasing (criticism_jp)
- Detailed explanation
- Client psychology insight

### 5. Argument Tree (Within Finding Details)
Expandable accordion showing:
- Level-by-level debate flow
- Technique badges
- Evidence lists
- Japanese business phrases
- Visual flow arrows between levels

### 6. QA Validation (Within Finding Details)
- 5 consulting firm grade badges
- Expandable details per firm
- Overall verdict badge (PASS/REVISION_NEEDED/FAIL)

### 7. QA Summary Section (Bottom)
- Aggregate scores by consulting firm
- Radar chart visualization
- Global recommendations

## User Convenience Features

The report prioritizes user convenience:

- **Quick find**: Ctrl+F works, but also custom search that filters items
- **Severity focus**: One-click filter to show only HIGH severity items
- **Meeting mode**: Button to show only items with QA=PASS for confident presentation
- **Copy button**: On each Japanese phrase and argument for quick copy-paste
- **Bookmark support**: URL hash navigation (#item-001) for sharing specific sections
- **Responsive**: Works on tablet screens for in-meeting reference

## Error Handling

- If any JSON file is missing, generate report with available data + warning banner
- If data is malformed, render what's parseable and mark broken sections
- Always produce an HTML file — partial report > no report
