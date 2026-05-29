#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# bootstrap.sh — scaffold a new investing-thesis workspace for Claude Code.
#
# Usage:
#   ./bootstrap.sh [target-folder]
#
# If no folder is given, it scaffolds into ./my-investing
# Run it from inside the thesis-builder folder (so it can find the source files).
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET="${1:-./my-investing}"

echo "▶ Scaffolding investing workspace at: $TARGET"

# 1. folders
mkdir -p "$TARGET/.claude/commands"
mkdir -p "$TARGET/reference"
mkdir -p "$TARGET/stocks"

# 2. core files
cp "$SRC/CLAUDE.md"              "$TARGET/CLAUDE.md"
cp "$SRC/README.md"             "$TARGET/README.md"
cp "$SRC/.claude/commands/"*.md "$TARGET/.claude/commands/"

# 3. reference build (so new theses have a real example to match)
if [ -d "$SRC/reference" ]; then
  cp "$SRC/reference/"* "$TARGET/reference/" 2>/dev/null || true
fi

# 4. a .gitkeep so the empty stocks/ folder survives version control
touch "$TARGET/stocks/.gitkeep"

echo "✓ Done. Structure created:"
echo ""
echo "  $TARGET/"
echo "  ├── CLAUDE.md              (methodology, auto-loaded)"
echo "  ├── README.md"
echo "  ├── .claude/commands/      (/thesis, /update-thesis)"
echo "  ├── reference/             (META build to pattern-match)"
echo "  └── stocks/                (one folder per stock you cover)"
echo ""
echo "Next steps:"
echo "  cd $TARGET"
echo "  claude            # open Claude Code here"
echo "  /thesis NVDA      # build your first thesis"
