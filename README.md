# ails - AI Language Server

A language server (LSP) that receives diagnostics from external sources via file watching. Works with VSCode and any LSP-compatible editor.

## Architecture

- **Language Server**: Watches `~/.ails-diagnostics.json` for diagnostic data
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

### For Non-VSCode Users

The language server can run standalone with any LSP-compatible editor:

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

Example configurations:
- **Neovim**: Use [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig) with a custom server config
- **Emacs**: Use [lsp-mode](https://github.com/emacs-lsp/lsp-mode) or [eglot](https://github.com/joaotavora/eglot)
- **Sublime Text**: Use [LSP](https://github.com/sublimelsp/LSP) package

## Usage

To use ails with your AI coding assistant:

1. Make sure the ails extension is installed and active in VSCode
2. Copy the prompt below and paste it into your AI assistant (Claude, ChatGPT, Cursor, etc.)
3. Ask the AI to "lint", "review", or "analyze" your code
4. Diagnostics will appear as squiggles in your editor

### Agent Setup Prompt

Copy this prompt to your AI assistant:

```
I have the ails (AI Language Server) extension installed in VSCode. When I ask you to lint, review, or analyze my code, please write your findings as JSON to my diagnostics file.

Write diagnostics to: ~/.ails-diagnostics.json

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
