import * as vscode from 'vscode';
import * as path from 'path';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from 'vscode-languageclient/node';

export function activateLSPClient(context: vscode.ExtensionContext) {
  // The server is implemented in node
  const serverModule = context.asAbsolutePath(path.join('out', 'lsp', 'server.js'));

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: { module: serverModule, transport: TransportKind.ipc }
  };

  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    // Register the server for ac3d documents by default
    documentSelector: [{ scheme: 'file', language: 'ac3d' }]
  };

  const client = new LanguageClient('ac3dLanguageServer', 'AC3D Language Server', serverOptions, clientOptions);
  client.start();
  context.subscriptions.push(client);
}
