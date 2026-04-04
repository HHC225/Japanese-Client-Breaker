#!/usr/bin/env bash
# Wrapper script: ensures Python 3.10+ and uv are available, then runs extract_files.py
# Usage: bash run_extract.sh <input_dir> <output_path>

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXTRACT_PY="${SCRIPT_DIR}/extract_files.py"

# ── 1. Check Python 3.10+ ──
check_python() {
    local cmd="$1"
    if command -v "$cmd" &>/dev/null; then
        local ver
        ver=$("$cmd" -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')" 2>/dev/null)
        local major="${ver%%.*}"
        local minor="${ver#*.}"
        if [[ "$major" -ge 3 ]] && [[ "$minor" -ge 10 ]]; then
            return 0
        fi
    fi
    return 1
}

PYTHON_OK=false
for cmd in python3 python; do
    if check_python "$cmd"; then
        PYTHON_OK=true
        break
    fi
done

if [[ "$PYTHON_OK" == false ]]; then
    echo "[INFO] Python 3.10+ not found. Attempting auto-install..." >&2

    # If uv is already available, use uv python install
    if command -v uv &>/dev/null; then
        if uv python install 3.12 2>&1 >&2; then
            echo "[INFO] Python 3.12 installed via uv." >&2
            PYTHON_OK=true
        fi
    fi

    # If still no Python, try system package managers
    if [[ "$PYTHON_OK" == false ]]; then
        echo "[INFO] Trying system package manager..." >&2

        if command -v apt-get &>/dev/null; then
            if sudo -n apt-get update -qq && sudo -n apt-get install -y -qq python3 2>/dev/null; then
                echo "[INFO] Python3 installed via apt." >&2
                PYTHON_OK=true
            fi
        elif command -v brew &>/dev/null; then
            if brew install python@3.12 2>/dev/null; then
                echo "[INFO] Python 3.12 installed via Homebrew." >&2
                PYTHON_OK=true
            fi
        elif command -v dnf &>/dev/null; then
            if sudo -n dnf install -y python3 2>/dev/null; then
                echo "[INFO] Python3 installed via dnf." >&2
                PYTHON_OK=true
            fi
        fi
    fi

    if [[ "$PYTHON_OK" == false ]]; then
        echo "" >&2
        echo "========================================" >&2
        echo " ERROR: Python 3.10+ is required but auto-install failed." >&2
        echo " Please install it manually using one of the methods below:" >&2
        echo "" >&2
        echo "   Ubuntu/Debian:" >&2
        echo "     sudo apt update && sudo apt install python3" >&2
        echo "" >&2
        echo "   macOS (Homebrew):" >&2
        echo "     brew install python@3.12" >&2
        echo "" >&2
        echo "   Fedora/RHEL:" >&2
        echo "     sudo dnf install python3" >&2
        echo "" >&2
        echo "   uv (any OS):" >&2
        echo "     uv python install 3.12" >&2
        echo "" >&2
        echo "   Official installer:" >&2
        echo "     https://www.python.org/downloads/" >&2
        echo "" >&2
        echo " Then re-run this script." >&2
        echo "========================================" >&2
        exit 1
    fi
fi

# ── 2. Check if uv exists ──
if ! command -v uv &>/dev/null; then
    echo "[INFO] uv not found. Installing..." >&2

    # Try user-level install (no sudo)
    if curl -LsSf https://astral.sh/uv/install.sh | sh 2>/dev/null; then
        export PATH="$HOME/.local/bin:$HOME/.cargo/bin:$PATH"

        if command -v uv &>/dev/null; then
            echo "[INFO] uv installed successfully." >&2
        else
            echo "" >&2
            echo "========================================" >&2
            echo " ERROR: uv was installed but is not on PATH." >&2
            echo " Please run the following and try again:" >&2
            echo "" >&2
            echo "   source ~/.bashrc   # or: source ~/.zshrc" >&2
            echo "========================================" >&2
            exit 1
        fi
    else
        echo "" >&2
        echo "========================================" >&2
        echo " ERROR: Failed to install uv automatically." >&2
        echo " Please install it manually using one of the methods below:" >&2
        echo "" >&2
        echo "   Option 1 (recommended):" >&2
        echo "     curl -LsSf https://astral.sh/uv/install.sh | sh" >&2
        echo "" >&2
        echo "   Option 2 (if sudo is needed):" >&2
        echo "     curl -LsSf https://astral.sh/uv/install.sh | sudo sh" >&2
        echo "" >&2
        echo "   Option 3 (Homebrew):" >&2
        echo "     brew install uv" >&2
        echo "" >&2
        echo "   Option 4 (pip):" >&2
        echo "     pip install uv" >&2
        echo "" >&2
        echo " Then re-run this script." >&2
        echo "========================================" >&2
        exit 1
    fi
fi

# ── 3. Run extraction with uv ──
uv run "${EXTRACT_PY}" "$@"
