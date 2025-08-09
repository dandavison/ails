import * as path from 'path';
import * as fs from 'fs';
import { workspace, ExtensionContext, window } from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
  console.log('AILS extension activating...');
  const outputChannel = window.createOutputChannel('AILS Extension');
  outputChannel.appendLine('AILS extension activating...');
  outputChannel.show();
  
  const serverModule = context.asAbsolutePath(
    path.join('server', 'server.js')
  );
  outputChannel.appendLine(`Server module path: ${serverModule}`);
  
  if (!fs.existsSync(serverModule)) {
    const error = `Server module not found at: ${serverModule}`;
    outputChannel.appendLine(error);
    window.showErrorMessage(`AILS: ${error}`);
    return;
  }
  outputChannel.appendLine('Server module found');
  
  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: { execArgv: ['--nolazy', '--inspect=6009'] }
    }
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', pattern: '**/*' }],
    synchronize: {
      fileEvents: workspace.createFileSystemWatcher('**/*')
    }
  };

  client = new LanguageClient(
    'ails',
    'AI Language Server',
    serverOptions,
    clientOptions
  );

  try {
    outputChannel.appendLine('Starting language client...');
    client.start();
    outputChannel.appendLine('Language client started successfully');
  } catch (error) {
    outputChannel.appendLine(`Error starting client: ${error}`);
    window.showErrorMessage(`AILS: Failed to start language server: ${error}`);
  }
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
