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

To use ails with your AI coding assistant:

1. Make sure the ails extension is installed and active in VSCode
2. Find your temp directory (see Step 1 below)
3. Customize the agent prompt with your temp directory path
4. Paste the customized prompt into your AI assistant
5. Ask the AI to "lint", "review", or "analyze" your code
6. Diagnostics will appear as squiggles in your editor

### Step 1: Find Your Temp Directory

Run one of these commands in your terminal:
- **macOS/Linux**: `echo $TMPDIR` (or use `/tmp`)
- **Windows**: `echo %TEMP%`

### Step 2: Copy Agent Setup Prompt

Replace `<YOUR_TEMP_DIR>` with your actual path from step 1. For example:
- macOS: `/var/folders/d2/hflhkhsd08v8nbjf3jf9yfdm0000gn/T`
- Linux: `/tmp`
- Windows: `C:\Users\YourName\AppData\Local\Temp`

Then copy this customized prompt to your AI assistant:

```
I have the ails (AI Language Server) extension installed in VSCode. When I ask you to lint, review, or analyze my code, please write your findings as JSON to my diagnostics file.

Write diagnostics to: <YOUR_TEMP_DIR>/ails-diagnostics.json

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

**Example customized prompt** (for Linux/macOS using `/tmp`):
```
I have the ails (AI Language Server) extension installed in VSCode. When I ask you to lint, review, or analyze my code, please write your findings as JSON to my diagnostics file.

Write diagnostics to: /tmp/ails-diagnostics.json

[... rest of the prompt ...]
```

### After Setup

Once you've given this prompt to your AI assistant, it will remember these instructions for your entire conversation. Simply ask it to "lint" or "review" any file, and diagnostics will automatically appear in VSCode as:
- Red squiggles for errors
- Yellow squiggles for warnings  
- Blue squiggles for info/hints

The diagnostics update in real-time whenever the AI writes new analysis results.
