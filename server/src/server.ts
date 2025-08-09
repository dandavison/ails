import {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  InitializeParams,
  InitializeResult,
  TextDocumentSyncKind,
  Diagnostic,
  DiagnosticSeverity
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

const diagnosticsFile = path.join(os.homedir(), '.ails-diagnostics.json');
const diagnosticsMap = new Map<string, Diagnostic[]>();

interface DiagnosticData {
  file: string;
  diagnostics: Array<{
    line: number;
    column: number;
    endLine?: number;
    endColumn?: number;
    severity: 'error' | 'warning' | 'info' | 'hint';
    message: string;
    code?: string;
  }>;
}

function severityToLSP(severity: string): DiagnosticSeverity {
  switch (severity) {
    case 'error': return DiagnosticSeverity.Error;
    case 'warning': return DiagnosticSeverity.Warning;
    case 'info': return DiagnosticSeverity.Information;
    case 'hint': return DiagnosticSeverity.Hint;
    default: return DiagnosticSeverity.Information;
  }
}

function watchDiagnosticsFile() {
  fs.watchFile(diagnosticsFile, () => {
    try {
      const content = fs.readFileSync(diagnosticsFile, 'utf-8');
      const data: DiagnosticData = JSON.parse(content);
      
      const uri = data.file.startsWith('file://') ? data.file : `file://${data.file}`;
      const diagnostics: Diagnostic[] = data.diagnostics.map(d => ({
        severity: severityToLSP(d.severity),
        range: {
          start: { line: d.line - 1, character: d.column - 1 },
          end: { 
            line: (d.endLine || d.line) - 1, 
            character: (d.endColumn || d.column) - 1 
          }
        },
        message: d.message,
        code: d.code,
        source: 'ails'
      }));

      diagnosticsMap.set(uri, diagnostics);
      connection.sendDiagnostics({ uri, diagnostics });
    } catch (e) {
      connection.console.error(`Error reading diagnostics file: ${e}`);
    }
  });
}

connection.onInitialize((params: InitializeParams): InitializeResult => {
  watchDiagnosticsFile();
  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental
    }
  };
});

documents.onDidOpen(e => {
  const diagnostics = diagnosticsMap.get(e.document.uri) || [];
  connection.sendDiagnostics({ uri: e.document.uri, diagnostics });
});

documents.onDidClose(e => {
  connection.sendDiagnostics({ uri: e.document.uri, diagnostics: [] });
});

documents.listen(connection);
connection.listen();
