# ails - AI Language Server

A language server (LSP) that receives diagnostics from external sources via file watching. Works with VSCode and any LSP-compatible editor.

## Setup (VSCode)

```bash
make
```

and then reload your VSCode windows / restart VSCode.

### Non-VSCode Users

The language server can run standalone to be used by any LSP-compatible editor:

1. Build the server:
```bash
cd server
npm install
npm run compile
```

2. Run the server:
```bash
node out/server.js --stdio
```

3. Configure your editor to connect to the language server via stdio. The server watches `~/.ails-diagnostics.json` and provides diagnostics for any file.

## Usage

To use ails with your AI coding assistant:

1. Copy the prompt below and paste it into your AI assistant (Claude, ChatGPT, Cursor, etc.)
2. Ask your AI agent to "lint", "review", or "analyze" your code.
3. Diagnostics will appear as squiggles in your editor

Of course, you can ask your agent to do things that linters normally don't, such as to compare the
current code version with a previous version in git history and alert you to any
backwards-incompatible changes.

### Agent Setup Prompt

Copy this prompt to your AI assistant:

```
I have the ails (AI Language Server) extension installed.
When I ask you to lint, review, or analyze my code, please write your findings as JSON to ~/.ails-diagnostics.json.
Assume that the code passes a conventional linter and type-checker; your job is to identify incorrectness that would likely not have been flagged by such tools.

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

### After Setup

Once you've given this prompt to your AI assistant, it will remember these instructions for your entire conversation. Simply ask it to "lint" or "review" any file, and diagnostics will automatically appear in VSCode as:
- Red squiggles for errors
- Yellow squiggles for warnings  
- Blue squiggles for info/hints

The diagnostics update in real-time whenever the AI writes new analysis results.
