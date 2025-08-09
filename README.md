# ails - AI Language Server

A VSCode language server that receives diagnostics from external sources via file watching.

## Architecture

- **Language Server**: Watches temp directory for `ails-diagnostics.json` (cross-platform)
- **VSCode Extension**: Activates the language server for all files
- **AI Agents**: Write diagnostic data to the watched file

## Setup

1. Install dependencies:
```bash
cd server && npm install
cd ../extension && npm install
```

2. Build:
```bash
cd server && npm run compile
cd ../extension && npm run compile
```

3. Install extension in VSCode:
   - Open the `extension` folder in VSCode
   - Press F5 to launch a new VSCode window with the extension

## Usage

AI agents write diagnostics to the temp directory (e.g., `/tmp/ails-diagnostics.json` on Linux/macOS, `%TEMP%\ails-diagnostics.json` on Windows):

```json
{
  "file": "/absolute/path/to/file.ts",
  "diagnostics": [
    {
      "line": 42,
      "column": 10,
      "endLine": 42,
      "endColumn": 25,
      "severity": "warning",
      "message": "Consider using a more descriptive variable name",
      "code": "AI001"
    }
  ]
}
```

Severity levels: `error`, `warning`, `info`, `hint`

The language server automatically detects changes and updates diagnostics in VSCode.

To find your temp directory path:
- **macOS/Linux**: `echo $TMPDIR` or `/tmp`
- **Windows**: `echo %TEMP%`
- **Node.js**: `require('os').tmpdir()`

## Agent Instructions

Copy and paste this prompt to any AI coding assistant to enable ails integration:

```
I have the ails (AI Language Server) extension installed in VSCode. When I ask you to lint, review, or analyze my code, please write your findings as JSON to my temp directory diagnostics file.

To provide diagnostics:
1. Determine the temp directory using: require('os').tmpdir()
2. Write to: <temp_dir>/ails-diagnostics.json

Use this exact JSON format:
{
  "file": "<absolute_path_to_file>",
  "diagnostics": [
    {
      "line": <line_number>,
      "column": <column_number>,
      "endLine": <optional_end_line>,
      "endColumn": <optional_end_column>,
      "severity": "<error|warning|info|hint>",
      "message": "<diagnostic_message>",
      "code": "<optional_diagnostic_code>"
    }
  ]
}

Example diagnostics:
- "severity": "error" - Syntax errors, undefined variables, type errors
- "severity": "warning" - Potential bugs, deprecated usage, missing error handling
- "severity": "info" - Style suggestions, refactoring opportunities
- "severity": "hint" - Minor suggestions, alternative approaches

Line and column numbers are 1-based. Include endLine/endColumn for multi-line issues.

When I ask you to "lint", "review", or "analyze" my code, write appropriate diagnostics to the JSON file and tell me you've done so. The diagnostics will appear as squiggles in my editor.
```
