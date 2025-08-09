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
