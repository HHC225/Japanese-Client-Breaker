---
name: file-preprocessing
description: "Preprocess deliverable files from the input directory into LLM-readable format. Handles Excel (.xlsx/.xls), PowerPoint (.pptx), Word (.docx), CSV, PDF, images, and text files. Extracts tables, slides, and structured content into a single Markdown file. MUST trigger before any deliverable analysis when the input contains non-text files."
---

# File Preprocessing Skill

## Purpose

Convert non-text deliverable files (Excel, PowerPoint, Word, PDF, images) into LLM-readable Markdown format. This is Phase 0 of the defense pipeline — it runs BEFORE the deliverable analyst.

## When to Use

- Input directory contains Excel, PowerPoint, Word, PDF, or image files
- Deliverables are not plain text
- Multiple files need to be combined into a single analyzable document

## Input

Files placed in the designated input directory (default: `input/`).

## Process

### Step 1: Run Extraction Script

```bash
bash .claude/skills/01_file-preprocessing/scripts/run_extract.sh \
  input/ \
  _workspace/00_preprocessed_input.md
```

The wrapper script (`run_extract.sh`) handles everything:
1. Checks if `uv` is installed
2. If not → auto-installs via `curl` (user-level, no sudo)
3. If auto-install fails → prints clear Korean instructions with 4 install methods and stops
4. Runs `uv run extract_files.py` which auto-resolves Python dependencies (openpyxl, python-pptx, python-docx)

The script automatically:
- Scans all files in the input directory
- Extracts content from supported formats into Markdown tables and text
- Creates a file manifest (`_workspace/00_file_manifest.json`)
- Flags PDF and image files as "LLM-Native" — these need the Read tool

### Step 2: Handle LLM-Native Files

After the script runs, check `_workspace/00_file_manifest.json` for `llm_native_paths`. For each:

- **PDF files**: Use the Read tool with `pages` parameter
  ```
  Read(file_path="/path/to/file.pdf", pages="1-10")
  ```
  Append the extracted content to `_workspace/00_preprocessed_input.md`

- **Image files**: Use the Read tool (multimodal)
  ```
  Read(file_path="/path/to/image.png")
  ```
  Describe the image content and append to `_workspace/00_preprocessed_input.md`

### Step 3: Verify Output

Check that `_workspace/00_preprocessed_input.md` contains meaningful content. If empty or minimal, report the issue.

## Supported Formats

| Format | Extension | Method | Output |
|--------|-----------|--------|--------|
| Excel | .xlsx, .xls | openpyxl | Markdown tables per sheet |
| PowerPoint | .pptx | python-pptx | Text per slide + embedded tables |
| Word | .docx | python-docx | Headings + paragraphs + tables |
| CSV | .csv | csv module | Markdown table |
| PDF | .pdf | Read tool (LLM) | Full text extraction |
| Images | .png, .jpg, .gif, .webp | Read tool (LLM) | Visual description |
| Text | .txt, .md, .json, .xml, .yaml | Direct read | Verbatim include |

## Output

- `_workspace/00_preprocessed_input.md` — Combined Markdown with all extracted content
- `_workspace/00_file_manifest.json` — Structured manifest of all input files

The deliverable-analyst agent reads `00_preprocessed_input.md` as its input instead of raw files.
