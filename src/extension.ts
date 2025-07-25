import * as vscode from 'vscode';
import { registerFileLinkProvider } from './features/fileLinkProvider';
import { registerColorProvider } from './features/colorProvider';
import { registerFoldingProvider } from './features/foldingProvider';
import { registerCompletionProvider } from './features/completionProvider';
import { activateLSPClient } from './lsp/client';

export function activate(context: vscode.ExtensionContext) {
  registerFileLinkProvider(context);
  registerColorProvider(context);
  registerFoldingProvider(context);
  registerCompletionProvider(context);
  activateLSPClient(context);
}
